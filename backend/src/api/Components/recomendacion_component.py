import os
import re
import numpy as np
import pandas as pd
import joblib
from sklearn.metrics.pairwise import cosine_similarity
from scipy.spatial.distance import euclidean, cityblock

from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response


class RecomendacionComponent:
    """
    Motor de Recomendación Híbrido (PIVIPP)
    Integra el modelo XGBoost entrenado con el sistema de caché en PostgreSQL.
    
    - Carga los modelos (XGBoost + scaler + SentenceTransformer) una sola vez (singleton)
    - Consulta caché antes de calcular
    - Filtra vacantes por facultad_id del estudiante
    - Invalida caché cuando se actualizan perfiles o vacantes
    """

    _model = None
    _scaler = None
    _embedding_model = None
    _models_loaded = False
    _load_error = None

    # =========================================================
    # CARGA DE MODELOS (Lazy Singleton)
    # =========================================================
    @classmethod
    def _load_models(cls):
        """Carga los modelos en memoria una sola vez (lazy loading)"""
        if cls._models_loaded:
            return cls._load_error is None

        try:
            # Resolver ruta absoluta al directorio nlp_engine
            base_dir = os.path.dirname(os.path.abspath(__file__))
            # Subimos desde backend/src/api/Components → backend/ → raíz del proyecto
            project_root = os.path.abspath(os.path.join(base_dir, '..', '..', '..', '..'))
            nlp_dir = os.path.join(project_root, 'nlp_engine')

            model_path = os.path.join(nlp_dir, 'modelos_entrenados', 'xgboost', 'pivipp_xgboost.pkl')
            scaler_path = os.path.join(nlp_dir, 'modelos_entrenados', 'xgboost', 'pivipp_xgboost_scaler.pkl')

            HandleLogs.write_log("[NLP] Cargando modelo XGBoost y scaler...")
            cls._model = joblib.load(model_path)
            cls._scaler = joblib.load(scaler_path)

            HandleLogs.write_log("[NLP] Cargando SentenceTransformer (all-MiniLM-L6-v2)...")
            from sentence_transformers import SentenceTransformer
            cls._embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

            cls._models_loaded = True
            cls._load_error = None
            HandleLogs.write_log("[NLP] Modelos cargados exitosamente.")
            return True

        except Exception as e:
            cls._models_loaded = True
            cls._load_error = str(e)
            HandleLogs.write_error(e)
            HandleLogs.write_log(f"[NLP] ERROR al cargar modelos: {e}")
            return False

    # =========================================================
    # LIMPIEZA DE TEXTO (homologada con el entrenamiento)
    # =========================================================
    @staticmethod
    def _limpiar_texto(texto):
        """
        Homologada con el entrenamiento del modelo XGBoost.
        No usa spaCy para garantizar embeddings idénticos en estructura.
        """
        if not isinstance(texto, str):
            return ""
        texto = texto.lower()
        texto = re.sub(re.compile(r'[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]'), ' ', texto)
        texto = re.sub(r'\s+', ' ', texto).strip()
        return texto

    # =========================================================
    # ENDPOINT PRINCIPAL: Obtener recomendaciones
    # =========================================================
    @staticmethod
    def get_recomendaciones(usuario_id, facultad_id):
        """
        Obtiene las vacantes con porcentaje de afinidad para un estudiante.
        Usa caché si existe, sino calcula y guarda.
        
        Args:
            usuario_id: ID del usuario (tabla usuarios)
            facultad_id: ID de la facultad del estudiante (para filtrar vacantes)
        
        Returns:
            internal_response con lista de vacantes + porcentaje_afinidad
        """
        try:
            # 1. Obtener perfil_id del estudiante
            sql_perfil_id = "SELECT perfil_id FROM public.perfiles_estudiante WHERE usuario_id = %s"
            perfil_result = DataBaseHandle.getRecords(sql_perfil_id, 1, (usuario_id,))
            if not perfil_result['result'] or not perfil_result['data']:
                return internal_response(False, None, "Perfil de estudiante no encontrado")

            estudiante_id = perfil_result['data']['perfil_id']

            # 2. Obtener vacantes activas de la facultad del estudiante
            vacantes_data = RecomendacionComponent._get_vacantes_facultad(facultad_id)
            if not vacantes_data:
                return internal_response(True, [], "No hay vacantes activas en tu facultad")

            # 3. Consultar caché
            vacante_ids = [v['vacante_id'] for v in vacantes_data]
            cache_result = RecomendacionComponent._get_cache(estudiante_id, vacante_ids)

            # 4. Si hay caché completo para TODAS las vacantes, usar caché
            if cache_result and len(cache_result) == len(vacante_ids):
                afinidad_map = {c['vacante_id']: float(c['porcentaje_afinidad']) for c in cache_result}
                for v in vacantes_data:
                    v['porcentaje_afinidad'] = afinidad_map.get(v['vacante_id'], 0)
                vacantes_data.sort(key=lambda x: x.get('porcentaje_afinidad', 0), reverse=True)
                return internal_response(True, vacantes_data, "Recomendaciones desde caché")

            # 5. Si no hay caché completo, calcular con el motor NLP
            afinidades = RecomendacionComponent._calcular_afinidad(usuario_id, estudiante_id, facultad_id, vacantes_data)
            if afinidades is None:
                # Fallback: retornar vacantes sin afinidad
                for v in vacantes_data:
                    v['porcentaje_afinidad'] = 0
                return internal_response(True, vacantes_data, "Motor NLP no disponible, vacantes sin afinidad")

            # 6. Guardar en caché
            RecomendacionComponent._save_cache(estudiante_id, afinidades)

            # 7. Fusionar afinidades con datos de vacantes
            for v in vacantes_data:
                v['porcentaje_afinidad'] = afinidades.get(v['vacante_id'], 0)

            vacantes_data.sort(key=lambda x: x.get('porcentaje_afinidad', 0), reverse=True)
            return internal_response(True, vacantes_data, "Recomendaciones calculadas por IA")

        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    # =========================================================
    # CAPA DE DATOS
    # =========================================================
    @staticmethod
    def _get_vacantes_facultad(facultad_id):
        """Obtiene vacantes activas filtradas por facultad, con skills incluidos"""
        where_clause = ""
        params = []
        if facultad_id:
            where_clause = "AND i.facultad_id = %s"
            params.append(facultad_id)

        sql = f"""
            SELECT v.vacante_id, v.titulo, v.area, v.descripcion, v.requisitos,
                   v.modalidad, v.ubicacion, v.total_horas, v.horas_diarias, v.horario,
                   v.cupos, v.activo, v.supervisor_id,
                   i.nombre as nombre_empresa, i.correo_contacto, i.industria, i.facultad_id,
                   u.nombre || ' ' || u.apellido as persona_contacto,
                   TO_CHAR(v.creado_en, 'YYYY-MM-DD') as creado_en,
                   TO_CHAR(v.fecha_expiracion, 'YYYY-MM-DD') as fecha_expiracion,
                   COALESCE(p.total, 0) as total_postulaciones
            FROM public.vacantes v
            JOIN public.instituciones i ON v.institucion_id = i.institucion_id
            JOIN public.usuarios u ON i.usuario_id = u.usuario_id
            LEFT JOIN (
                SELECT vacante_id, COUNT(*) as total
                FROM public.postulaciones
                GROUP BY vacante_id
            ) p ON p.vacante_id = v.vacante_id
            WHERE v.activo = true {where_clause}
            ORDER BY v.creado_en DESC
        """
        result = DataBaseHandle.getRecords(sql, 0, tuple(params)) if params else DataBaseHandle.getRecords(sql, 0)
        if not result['result'] or not result['data']:
            return []

        vacantes = result['data']

        # Agregar skills a cada vacante
        vacante_ids = [v['vacante_id'] for v in vacantes]
        sql_skills = """
            SELECT hv.vacante_id, h.habilidad_id, h.nombre as habilidad_nombre, h.categoria,
                   hv.nivel_requerido, hv.es_opcional
            FROM public.habilidades_vacante hv
            JOIN public.habilidades h ON hv.habilidad_id = h.habilidad_id
            WHERE hv.vacante_id = ANY(%s)
        """
        skills_res = DataBaseHandle.getRecords(sql_skills, 0, (vacante_ids,))
        skills_by_vacante = {}
        if skills_res['result'] and skills_res['data']:
            for s in skills_res['data']:
                vid = s['vacante_id']
                if vid not in skills_by_vacante:
                    skills_by_vacante[vid] = []
                skills_by_vacante[vid].append(s)

        for v in vacantes:
            v['skills'] = skills_by_vacante.get(v['vacante_id'], [])

        return vacantes

    @staticmethod
    def _get_cache(estudiante_id, vacante_ids):
        """Consulta el caché de afinidad para un estudiante y un set de vacantes"""
        if not vacante_ids:
            return None
        sql = """
            SELECT vacante_id, CAST(porcentaje_afinidad AS FLOAT) as porcentaje_afinidad
            FROM public.cache_afinidad
            WHERE estudiante_id = %s AND vacante_id = ANY(%s)
        """
        result = DataBaseHandle.getRecords(sql, 0, (estudiante_id, vacante_ids))
        if result['result'] and result['data']:
            return result['data']
        return None

    @staticmethod
    def _save_cache(estudiante_id, afinidades):
        """Guarda las afinidades calculadas en el caché (upsert)"""
        try:
            for vacante_id, porcentaje in afinidades.items():
                sql = """
                    INSERT INTO public.cache_afinidad (estudiante_id, vacante_id, porcentaje_afinidad)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (estudiante_id, vacante_id)
                    DO UPDATE SET porcentaje_afinidad = EXCLUDED.porcentaje_afinidad, calculado_en = NOW()
                """
                DataBaseHandle.ExecuteNonQuery(sql, (estudiante_id, vacante_id, round(porcentaje, 2)))
        except Exception as err:
            HandleLogs.write_error(err)

    # =========================================================
    # MOTOR NLP: Cálculo de afinidad con XGBoost
    # =========================================================
    @staticmethod
    def _calcular_afinidad(usuario_id, estudiante_id, facultad_id, vacantes_data):
        """
        Ejecuta el motor NLP XGBoost para calcular afinidad estudiante ↔ vacantes.
        Replica exactamente la lógica de servicio_recomendacion_db.py pero usando DataBaseHandle.
        
        Returns:
            dict {vacante_id: porcentaje_afinidad} o None si hay error
        """
        if not RecomendacionComponent._load_models():
            HandleLogs.write_log(f"[NLP] No se puede calcular: {RecomendacionComponent._load_error}")
            return None

        model = RecomendacionComponent._model
        scaler = RecomendacionComponent._scaler
        embedding_model = RecomendacionComponent._embedding_model

        try:
            # 1. Obtener datos del estudiante
            sql_perfil = """
                SELECT pe.perfil_id as estudiante_id, c.nombre as carrera_nombre, 
                       pe.resumen_experiencia, pe.intereses, u.nombre, u.apellido
                FROM public.perfiles_estudiante pe
                JOIN public.usuarios u ON pe.usuario_id = u.usuario_id
                LEFT JOIN public.carreras c ON pe.carrera_id = c.carrera_id
                WHERE pe.usuario_id = %s
            """
            perfil_result = DataBaseHandle.getRecords(sql_perfil, 1, (usuario_id,))
            if not perfil_result['result'] or not perfil_result['data']:
                return None

            perfil = perfil_result['data']

            # 2. Obtener habilidades del estudiante
            sql_habs = """
                SELECT h.nombre 
                FROM public.habilidades_estudiante he
                JOIN public.habilidades h ON he.habilidad_id = h.habilidad_id
                WHERE he.estudiante_id = %s
            """
            habs_result = DataBaseHandle.getRecords(sql_habs, 0, (perfil['estudiante_id'],))
            habilidades = [r['nombre'] for r in habs_result['data']] if habs_result['result'] and habs_result['data'] else []

            # 3. Obtener habilidades de las vacantes
            vacante_ids = [v['vacante_id'] for v in vacantes_data]
            sql_habs_vac = """
                SELECT hv.vacante_id, h.nombre as habilidad_nombre
                FROM public.habilidades_vacante hv
                JOIN public.habilidades h ON hv.habilidad_id = h.habilidad_id
                WHERE hv.vacante_id = ANY(%s)
            """
            habs_vac_result = DataBaseHandle.getRecords(sql_habs_vac, 0, (vacante_ids,))
            habilidades_por_vacante = {}
            if habs_vac_result['result'] and habs_vac_result['data']:
                for hv in habs_vac_result['data']:
                    v_id = hv['vacante_id']
                    if v_id not in habilidades_por_vacante:
                        habilidades_por_vacante[v_id] = []
                    habilidades_por_vacante[v_id].append(hv['habilidad_nombre'])

            # 4. Preparar texto del estudiante y generar embedding
            texto_usuario = (
                f"{perfil.get('carrera_nombre', '')} {perfil.get('resumen_experiencia', '')} "
                f"{perfil.get('intereses', '')} {' '.join(habilidades)}"
            )
            usuario_limpio = RecomendacionComponent._limpiar_texto(texto_usuario)
            emb_usuario = embedding_model.encode(
                [usuario_limpio], convert_to_numpy=True, normalize_embeddings=True
            )[0]

            # 5. Preparar textos de vacantes y generar embeddings
            df_vacantes = pd.DataFrame(vacantes_data)

            textos_vacantes = []
            for _, row in df_vacantes.iterrows():
                habs = habilidades_por_vacante.get(row['vacante_id'], [])
                texto_v = (
                    f"{row.get('titulo', '')} {row.get('area', '')} "
                    f"{row.get('descripcion', '')} {row.get('requisitos', '')} "
                    f"{' '.join(habs)}"
                )
                textos_vacantes.append(texto_v)

            df_vacantes['texto_completo'] = textos_vacantes
            df_vacantes['texto_limpio'] = df_vacantes['texto_completo'].apply(
                RecomendacionComponent._limpiar_texto
            )

            embs_vacantes = embedding_model.encode(
                df_vacantes['texto_limpio'].tolist(),
                convert_to_numpy=True,
                normalize_embeddings=True
            )

            # 6. Construir vectores de 389 features (alineado con el modelo entrenado)
            features_inferencia = []
            skills_usr_set = set([s.lower() for s in habilidades])

            for idx, row in df_vacantes.iterrows():
                emb_v = embs_vacantes[idx]

                # Similitud coseno y diferencia vectorial
                sim_coseno = cosine_similarity([emb_usuario], [emb_v])[0][0]
                diff_vectorial = np.abs(emb_usuario - emb_v)

                # Distancias euclidiana y manhattan
                dist_euclidiana = euclidean(emb_usuario, emb_v)
                dist_manhattan = cityblock(emb_usuario, emb_v)

                # Variables de coincidencia de habilidades
                habs_vac = set([s.lower() for s in habilidades_por_vacante.get(row['vacante_id'], [])])
                skill_match_score = (len(skills_usr_set.intersection(habs_vac)) / max(1, len(habs_vac))) * 100
                skill_complementarity_score = (len(habs_vac.difference(skills_usr_set)) / max(1, len(habs_vac))) * 100

                # Vector de 389 características alineado con el entrenamiento
                vector_completo = np.concatenate([
                    [sim_coseno],
                    diff_vectorial,
                    [dist_euclidiana, dist_manhattan],
                    [skill_match_score, skill_complementarity_score]
                ])
                features_inferencia.append(vector_completo)

            # 7. Inferencia con el modelo XGBoost
            X_inf = np.array(features_inferencia, dtype=np.float32)
            X_inf_scaled = scaler.transform(X_inf)
            predicciones = model.predict(X_inf_scaled)

            # 8. Construir mapa de resultados
            afinidades = {}
            for idx, row in df_vacantes.iterrows():
                score = max(0.0, min(100.0, float(predicciones[idx])))
                afinidades[row['vacante_id']] = round(score, 2)

            HandleLogs.write_log(
                f"[NLP] Afinidad calculada para estudiante {estudiante_id}: "
                f"{len(afinidades)} vacantes procesadas"
            )
            return afinidades

        except Exception as err:
            HandleLogs.write_error(err)
            HandleLogs.write_log(f"[NLP] Error en cálculo de afinidad: {err}")
            return None

    # =========================================================
    # INVALIDACIÓN DE CACHÉ
    # =========================================================
    @staticmethod
    def invalidar_cache_estudiante(estudiante_id):
        """Borra el caché de un estudiante específico (cuando actualiza perfil/skills)"""
        try:
            sql = "DELETE FROM public.cache_afinidad WHERE estudiante_id = %s"
            DataBaseHandle.ExecuteNonQuery(sql, (estudiante_id,))
            HandleLogs.write_log(f"[NLP] Caché invalidado para estudiante_id={estudiante_id}")
        except Exception as err:
            HandleLogs.write_error(err)

    @staticmethod
    def invalidar_cache_vacante(vacante_id):
        """Borra el caché de una vacante (cuando se edita o cierra)"""
        try:
            sql = "DELETE FROM public.cache_afinidad WHERE vacante_id = %s"
            DataBaseHandle.ExecuteNonQuery(sql, (vacante_id,))
            HandleLogs.write_log(f"[NLP] Caché invalidado para vacante_id={vacante_id}")
        except Exception as err:
            HandleLogs.write_error(err)

    @staticmethod
    def invalidar_cache_facultad(facultad_id):
        """
        Borra el caché de todos los estudiantes de una facultad.
        Se usa cuando se crea una nueva vacante en esa facultad.
        """
        try:
            sql = """
                DELETE FROM public.cache_afinidad 
                WHERE estudiante_id IN (
                    SELECT perfil_id FROM public.perfiles_estudiante WHERE facultad_id = %s
                )
            """
            DataBaseHandle.ExecuteNonQuery(sql, (facultad_id,))
            HandleLogs.write_log(f"[NLP] Caché invalidado para facultad_id={facultad_id}")
        except Exception as err:
            HandleLogs.write_error(err)
