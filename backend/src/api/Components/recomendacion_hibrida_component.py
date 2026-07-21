import threading
import numpy as np
import pandas as pd
from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response
from .nlp.recomendacion_hibrida_features import limpiar_texto_hibrido, construir_vector_features
from .nlp.recomendacion_hibrida_models import cargar_modelos_hibridos
from .nlp.recomendacion_hibrida_repository import (
    obtener_vacantes_facultad, obtener_cache_afinidad, guardar_cache_afinidad,
    invalidar_cache_estudiante as repo_invalidar_cache_estudiante,
    invalidar_cache_vacante as repo_invalidar_cache_vacante,
    invalidar_cache_facultad as repo_invalidar_cache_facultad,
)

class RecomendacionHibridaComponent:
    """
    Motor de Recomendación Híbrido (PIVIPP)
    Integra el modelo XGBoost entrenado con el sistema de caché en PostgreSQL.
    
    - Carga los modelos (XGBoost + scaler + SentenceTransformer) una sola vez (singleton)
    - Consulta caché antes de calcular
    - Filtra vacantes por facultad_id del estudiante
    - Invalida caché cuando se actualizan perfiles o vacantes
    """
    # Constantes para umbrales de ensamble (calibrados empíricamente)
    # Estos valores deben ajustarse según tu dataset
    UMBRAL_COSENO_BAJO = 0.38      # Percentil 25 aproximado
    UMBRAL_COSENO_ALTO = 0.48      # Percentil 75 aproximado
    UMBRAL_COSENO_CRITICO = 0.45   # Punto medio
    UMBRAL_MATCH_MINIMO = 15.0     # Match de skills mínimo para considerar
    UMBRAL_MATCH_BUENO = 30.0      # Match de skills bueno
    UMBRAL_XGB_ALTO = 65.0         # XGBoost score alto
    UMBRAL_XGB_INFLADO = 60.0      # XGBoost score inflado
    UMBRAL_SVR_ALTO = 48.0         # SVR score alto

    _model = None
    _scaler = None
    _svr_model = None
    _svr_scaler = None
    _embedding_model = None
    _models_loaded = False
    _load_error = None
    
    _inference_lock = threading.Lock()
    _stats_lock = threading.Lock()  # Para estadísticas de inferencia
        
    # Estadísticas de inferencia (para monitoreo)
    _inference_stats = {
        'total_predictions': 0,
        'rule_usage': {
            'rule1_baja_similitud': 0,
            'rule2_inflacion_texto': 0,
            'rule3_match_fuerte': 0,
            'rule4_alucinatorio': 0,
            'rule5_perfil_teorico': 0,
            'rule6_hibrido_normal': 0
        },
        'avg_xgb_score': 0.0,
        'avg_svr_score': 0.0,
        'avg_final_score': 0.0
    }
  
    # =========================================================
    # CARGA DE MODELOS (Lazy Singleton)
    # =========================================================
    @classmethod
    def _load_models(cls):
        """Carga los modelos en memoria una sola vez (lazy loading)"""
        if cls._models_loaded:
            return cls._load_error is None

        try:
            cls._model, cls._scaler, cls._svr_model, cls._svr_scaler, cls._embedding_model = cargar_modelos_hibridos()
            cls._models_loaded = True
            cls._load_error = None
            return True

        except Exception as e:
            cls._models_loaded = True
            cls._load_error = str(e)
            HandleLogs.write_error(e)
            HandleLogs.write_log(f"[NLP] ERROR al cargar modelos: {e}")
            return False

    # =========================================================
    # LIMPIEZA DE TEXTO
    # =========================================================
    @staticmethod
    def _limpiar_texto(texto):
        return limpiar_texto_hibrido(texto)
    #----------------------------------
    #FUNCION UNIFICADA PARA CONSTRUIR FEATURES
    #----------------------------------------
    @staticmethod
    def _construir_vector_features(emb_estudiante, emb_vacante, skills_est, skills_vac):
        return construir_vector_features(emb_estudiante, emb_vacante, skills_est, skills_vac)
    
    # =========================================================
    # CÁLCULO BIDIRECCIONAL (Empresa -> Estudiante)
    # =========================================================
    @staticmethod
    def precalcular_afinidad_vacante_background(vacante_id, facultad_id):
        """
        Cálculo bidireccional (de Vacante hacia Estudiantes).
        Se ejecuta en segundo plano cuando una empresa crea o edita una vacante.
        Calcula la afinidad de la nueva vacante contra todos los estudiantes de la facultad
        e inserta los resultados en la caché para que la carga sea instantánea.
        """
        import threading
        
        def tarea_background():
            if not RecomendacionHibridaComponent._load_models():
                return
            try:
                HandleLogs.write_log(f"[NLP-BG] Iniciando precálculo de vacante {vacante_id} para facultad {facultad_id}")
                
                # 1. Obtener la vacante específica
                vacantes_data = RecomendacionHibridaComponent._get_vacantes_facultad(facultad_id)
                vacante_target = [v for v in vacantes_data if str(v['vacante_id']) == str(vacante_id)]
                if not vacante_target:
                    HandleLogs.write_log(f"[NLP-BG] Vacante {vacante_id} no encontrada en la extracción NLP")
                    return
                
                # 2. Obtener a TODOS los estudiantes de esa facultad Y CON CUENTA ACTIVA
                sql_estudiantes = """
                    SELECT pe.usuario_id, pe.perfil_id 
                    FROM public.perfiles_estudiante pe
                    JOIN public.usuarios u ON pe.usuario_id = u.usuario_id
                    WHERE pe.facultad_id = %s AND u.activo = true
                """
                from ...utils.database.connection_db import DataBaseHandle
                est_result = DataBaseHandle.getRecords(sql_estudiantes, 0, (facultad_id,))
                if not est_result['result'] or not est_result['data']:
                    return
                
                # 3. Iterar y calcular
                with RecomendacionHibridaComponent._inference_lock:
                    for est in est_result['data']:
                        afinidades = RecomendacionHibridaComponent._calcular_afinidad(
                            est['usuario_id'], est['perfil_id'], facultad_id, vacante_target
                        )
                        if afinidades:
                            RecomendacionHibridaComponent._save_cache(est['perfil_id'], afinidades)
                
                HandleLogs.write_log(f"[NLP-BG] Precálculo finalizado para vacante {vacante_id}")
            except Exception as e:
                HandleLogs.write_error(f"[NLP-BG] Error en precálculo de vacante: {e}")
                
        threading.Thread(target=tarea_background, daemon=True).start()

    # =========================================================
    # ENDPOINT PRINCIPAL: Obtener recomendaciones
    # =========================================================
    @staticmethod
    def get_recomendaciones(usuario_id, facultad_id, force_recalculate=False):
        """
        Obtiene las vacantes con porcentaje de afinidad para un estudiante.
        Usa caché si existe, sino calcula y guarda.
        
        Args:
            usuario_id: ID del usuario (tabla usuarios)
            facultad_id: ID de la facultad del estudiante (para filtrar vacantes)
            force_recalculate: Si es True, ignora el bloqueo de calculando_nlp y fuerza el cálculo.
        
        Returns:
            internal_response con lista de vacantes + porcentaje_afinidad
        """
        try:
            # 1. Obtener perfil_id del estudiante y estado de calculo
            sql_perfil_id = "SELECT perfil_id, calculando_nlp FROM public.perfiles_estudiante WHERE usuario_id = %s"
            from ...utils.database.connection_db import DataBaseHandle
            perfil_result = DataBaseHandle.getRecords(sql_perfil_id, 1, (usuario_id,))
            if not perfil_result['result'] or not perfil_result['data']:
                return internal_response(False, None, "Perfil de estudiante no encontrado")

            estudiante_id = perfil_result['data']['perfil_id']
            is_calculating = bool(perfil_result['data'].get('calculando_nlp', False))

            # 2. Obtener vacantes activas de la facultad del estudiante
            vacantes_data = RecomendacionHibridaComponent._get_vacantes_facultad(facultad_id)
            if not vacantes_data:
                return internal_response(True, [], "No hay vacantes activas en tu facultad")

            # 3. Consultar caché
            vacante_ids = [v['vacante_id'] for v in vacantes_data]
            cache_result = RecomendacionHibridaComponent._get_cache(estudiante_id, vacante_ids)

            # 4. Retornar caché si NO estamos forzando recalculo y:
            # - La caché está completa para TODAS las vacantes
            # - O si se está calculando en segundo plano (petición de frontend para no bloquear)
            if not force_recalculate and ((cache_result and len(cache_result) == len(vacante_ids)) or is_calculating):
                afinidad_map = {c['vacante_id']: float(c['porcentaje_afinidad']) for c in (cache_result or [])}
                for v in vacantes_data:
                    v['porcentaje_afinidad'] = afinidad_map.get(v['vacante_id'], 0)
                vacantes_data.sort(key=lambda x: x.get('porcentaje_afinidad', 0), reverse=True)
                
                res = internal_response(True, vacantes_data, "Recomendaciones desde caché" if not is_calculating else "Calculando afinidades en background...")
                res['is_calculating'] = is_calculating
                return res

            # 5. Si no hay caché completo, USAR EL CANDADO (Double-Checked Locking)
            with RecomendacionHibridaComponent._inference_lock:
                # Volvemos a consultar la caché por si otro hilo (ej. background thread) acaba de llenarla
                cache_result_2 = RecomendacionHibridaComponent._get_cache(estudiante_id, vacante_ids)
                if cache_result_2 and len(cache_result_2) == len(vacante_ids) and not force_recalculate:
                    afinidad_map = {c['vacante_id']: float(c['porcentaje_afinidad']) for c in cache_result_2}
                    for v in vacantes_data:
                        v['porcentaje_afinidad'] = afinidad_map.get(v['vacante_id'], 0)
                    vacantes_data.sort(key=lambda x: x.get('porcentaje_afinidad', 0), reverse=True)
                    res = internal_response(True, vacantes_data, "Recomendaciones desde caché (Post-espera)")
                    res['is_calculating'] = False
                    return res

                # Si definitivamente sigue vacía, calcular con el motor NLP
                afinidades = RecomendacionHibridaComponent._calcular_afinidad(usuario_id, estudiante_id, facultad_id, vacantes_data)
                if afinidades is None:
                    # Fallback: retornar vacantes sin afinidad
                    for v in vacantes_data:
                        v['porcentaje_afinidad'] = 0
                    res = internal_response(True, vacantes_data, "Motor NLP no disponible, vacantes sin afinidad")
                    res['is_calculating'] = False
                    return res

                # 6. Guardar en caché
                RecomendacionHibridaComponent._save_cache(estudiante_id, afinidades)

            # 7. Fusionar afinidades con datos de vacantes
            for v in vacantes_data:
                v['porcentaje_afinidad'] = afinidades.get(v['vacante_id'], 0)

            vacantes_data.sort(key=lambda x: x.get('porcentaje_afinidad', 0), reverse=True)
            res = internal_response(True, vacantes_data, "Recomendaciones calculadas por IA")
            res['is_calculating'] = False
            return res

        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    # =========================================================
    # CAPA DE DATOS
    # =========================================================
    @staticmethod
    def _get_vacantes_facultad(facultad_id):
        """Obtiene vacantes activas filtradas por facultad, con skills incluidos"""
        return obtener_vacantes_facultad(facultad_id)

    @staticmethod
    def _get_cache(estudiante_id, vacante_ids):
        """Consulta el caché de afinidad para un estudiante y un set de vacantes"""
        return obtener_cache_afinidad(estudiante_id, vacante_ids)

    @staticmethod
    def _save_cache(estudiante_id, afinidades):
        """Guarda las afinidades calculadas en el caché (upsert)"""
        return guardar_cache_afinidad(estudiante_id, afinidades)

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
        if not RecomendacionHibridaComponent._load_models():
            HandleLogs.write_log(f"[NLP] No se puede calcular: {RecomendacionHibridaComponent._load_error}")
            return None

        model = RecomendacionHibridaComponent._model
        scaler = RecomendacionHibridaComponent._scaler
        embedding_model = RecomendacionHibridaComponent._embedding_model

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

            # 4. Preparar texto del estudiante y vacantes
            texto_usuario = (
                f"{perfil.get('carrera_nombre', '')} {perfil.get('resumen_experiencia', '')} "
                f"{perfil.get('intereses', '')} {' '.join(habilidades)}"
            )
            usuario_limpio = RecomendacionHibridaComponent._limpiar_texto(texto_usuario)
            
            df_vacantes = pd.DataFrame(vacantes_data)
            textos_vacantes = []
            for _, row in df_vacantes.iterrows():
                habs = habilidades_por_vacante.get(row['vacante_id'], [])
                #con area
                # texto_v = (
                #     f"{row.get('titulo', '')} {row.get('area', '')} "
                #     f"{row.get('descripcion', '')} {row.get('requisitos', '')} "
                #     f"{' '.join(habs)}"
                # )
                # textos_vacantes.append(texto_v)
                #sin area
                texto_v = (
                    f"{row.get('titulo', '')} "
                    f"{row.get('descripcion', '')} {row.get('requisitos', '')} "
                    f"{' '.join(habs)}"
                )
                textos_vacantes.append(texto_v)

            df_vacantes['texto_completo'] = textos_vacantes
            df_vacantes['texto_limpio'] = df_vacantes['texto_completo'].apply(
                RecomendacionHibridaComponent._limpiar_texto
            )

            # 5. Generar embeddings 
            emb_usuario = embedding_model.encode(
                [usuario_limpio], convert_to_numpy=True, normalize_embeddings=True
            )[0]
            embs_vacantes = embedding_model.encode(
                df_vacantes['texto_limpio'].tolist(),
                convert_to_numpy=True,
                normalize_embeddings=True
            )

            # 6. Construir vectores 
            features_inferencia = []
            metadatos = []  # Guardar metadatos para logging y reglas
            
            for idx, row in df_vacantes.iterrows():
                emb_v = embs_vacantes[idx]
                
                # Obtener habilidades de la vacante (usar SOLO habilidades_por_vacante)
                habs_vac = habilidades_por_vacante.get(row['vacante_id'], [])
                
                # Construir vector features
                vector_completo, sim_coseno, match_score, comp_score = \
                    RecomendacionHibridaComponent._construir_vector_features(
                        emb_usuario, emb_v, habilidades, habs_vac
                    )
                
                features_inferencia.append(vector_completo)
                metadatos.append({
                    'sim_coseno': sim_coseno,
                    'match_score': match_score,
                    'comp_score': comp_score,
                    'vacante_id': row['vacante_id']
                })
                        # 7. Inferencia HIBRIDA (XGBoost + SVR) con reglas mejoradas
            svr_model = RecomendacionHibridaComponent._svr_model
            svr_scaler = RecomendacionHibridaComponent._svr_scaler

            X_inf = np.array(features_inferencia, dtype=np.float32)
            
            # Predicciones XGBoost
            X_inf_scaled_xgb = scaler.transform(X_inf)
            predicciones_xgb = model.predict(X_inf_scaled_xgb)
            
            # Predicciones SVR
            X_inf_scaled_svr = svr_scaler.transform(X_inf)
            predicciones_svr = svr_model.predict(X_inf_scaled_svr)
            
            # ENSAMBLAJE CON REGLAS MEJORADAS Y LOGGING
            afinidades = {}
            rule_usage = {
                'rule1': 0, 'rule2': 0, 'rule3': 0,
                'rule4': 0, 'rule5': 0, 'rule6': 0
            }
            
            # Obtener umbrales de las constantes de clase
            COSENO_BAJO = RecomendacionHibridaComponent.UMBRAL_COSENO_BAJO
            COSENO_ALTO = RecomendacionHibridaComponent.UMBRAL_COSENO_ALTO
            COSENO_CRITICO = RecomendacionHibridaComponent.UMBRAL_COSENO_CRITICO
            MATCH_MINIMO = RecomendacionHibridaComponent.UMBRAL_MATCH_MINIMO
            MATCH_BUENO = RecomendacionHibridaComponent.UMBRAL_MATCH_BUENO
            XGB_ALTO = RecomendacionHibridaComponent.UMBRAL_XGB_ALTO
            XGB_INFLADO = RecomendacionHibridaComponent.UMBRAL_XGB_INFLADO
            SVR_ALTO = RecomendacionHibridaComponent.UMBRAL_SVR_ALTO
            
            for idx, row in df_vacantes.iterrows():
                p_xgb = float(predicciones_xgb[idx])
                p_svr = float(predicciones_svr[idx])
                
                # Asegurar rangos válidos
                p_xgb = np.clip(p_xgb, 0.0, 100.0)
                p_svr = np.clip(p_svr, 0.0, 100.0)
                
                # Obtener metadatos
                meta = metadatos[idx]
                sim_coseno = meta['sim_coseno']
                match_score = meta['match_score']
                comp_score = meta['comp_score']
                vacante_id = meta['vacante_id']
                
                # Normalizar match_score a 0-1 para las reglas
                match_normalized = match_score / 100.0
                
                # --- REGLAS LÓGICAS MEJORADAS ---
                
                # REGLA 1: BAJA SIMILITUD CONTEXTUAL
                if sim_coseno < COSENO_BAJO:
                    # Si el contexto semántico es bajísimo, XGBoost tiende a alucinar
                    base_score = min(p_xgb, p_svr)
                    if match_score < 1.0:  # Prácticamente 0 match
                        # Castigo fuerte por texto basura
                        score = base_score * 0.3
                    elif match_score < MATCH_MINIMO:
                        # Match bajo, castigo moderado
                        score = (base_score + match_score) / 3.0
                    else:
                        # Tiene skills relevantes a pesar del bajo contexto
                        score = (base_score * 0.4) + (match_score * 0.6)
                    rule_usage['rule1'] += 1
                    
                # REGLA 2: DETECCIÓN DE INFLACIÓN POR TEXTO BASURA
                elif sim_coseno > COSENO_ALTO and match_score < MATCH_MINIMO:
                    # Normalizar coseno a escala 0-100
                    coseno_score = sim_coseno * 100
            
                    # Calcular base (el menor de los modelos)
                    base_score = min(p_xgb, p_svr)
                    
                    if match_score < 1.0:
                        # Sin skills seleccionados
                        if sim_coseno > 0.55:
                            # Coseno alto: la similitud semántica es real y el srv no muestra inflación
                            weight_coseno = 0.5 + ((sim_coseno - 0.55) * 1.5) 
                            weight_base = 1.0 - weight_coseno
                            score = (coseno_score * weight_coseno) + (base_score * weight_base)
                            
                            # Si SVR es alto, darle más peso (es más confiable)
                            if p_svr > 45:
                                score = (score * 0.7) + (p_svr * 0.3)
                        else:
                            # Coseno bajo-moderado: podría ser inflación
                            score = base_score * 0.4
                    else:
                        # Hay algo de match (1-14%)
                        if sim_coseno > 0.55:
                            # Coseno alto + algo de match
                            # Combinarción de coseno (semántica) + match (skills) + modelo
                            weight_coseno = 0.4
                            weight_match = 0.3
                            weight_modelo = 0.3
                            score = (coseno_score * weight_coseno) + (match_score * weight_match) + (base_score * weight_modelo)
                            
                            # Si SVR confirma la afinidad
                            if p_svr > 45:
                                score = (score * 0.8) + (p_svr * 0.2)
                        else:
                            # Coseno bajo, match bajo= castigo moderado
                            score = (base_score * 0.3) + (match_score * 0.7)
                            
                    # NUEVO: Bonus por semántica innegable sin skills (Coseno > 0.65)
                    if sim_coseno > 0.65:
                        score = min(75.0, score * 1.15)
                    
                    rule_usage['rule2'] += 1
                    
                # REGLA 3: MATCH FUERTE REAL (Especialista coincidente)
                elif sim_coseno <= COSENO_BAJO and p_xgb >= XGB_ALTO:
                    # Existe respaldo semántico y XGBoost detecta alta afinidad
                    if match_score >= MATCH_BUENO:
                        # Coincidencia excelente, premiamos
                        score = max(p_xgb, p_svr)
                        # Bonus adicional si el complemento es bajo (especialista)
                        if comp_score < 30.0:
                            score = min(100.0, score * 1.05)
                    else:
                        # Match regular, promedio ponderado
                        score = (p_xgb * 0.6) + (p_svr * 0.4)
                    rule_usage['rule3'] += 1
                    
                # REGLA 4: COMPORTAMIENTO ALUCINATORIO DE XGBOOST
                elif p_xgb >= XGB_INFLADO and sim_coseno < COSENO_CRITICO:
                    # XGBoost se infla pero Transformer duda, asi que confiamos más en SVR
                    if p_svr < p_xgb:
                        score = (p_svr + match_score) / 2.0 if match_score > 0 else p_svr
                    else:
                        # Ambos altos, promedio
                        score = (p_xgb + p_svr) / 2.0
                    rule_usage['rule4'] += 1
                    
                # REGLA 5: PERFIL TEÓRICO (SVR detecta tendencia)
                elif p_xgb < 40.0 and p_svr >= SVR_ALTO:
                    # SVR detecta compatibilidad lineal que XGBoost descarta
                    if match_score > 0:
                        score = (p_svr * 0.6) + (match_score * 0.4)
                    else:
                        score = p_svr * 0.9
                    rule_usage['rule5'] += 1
                    
                #REGLA 6: COMPORTAMIENTO HÍBRIDO NORMAL
                else:
                    # Normalizar el coseno a escala 0-100
                    coseno_score = sim_coseno * 100  # 0.835 → 83.5
                    
                    # Calcular score base del modelo híbrido
                    if match_score > MATCH_MINIMO:
                        weight_xgb = 0.5 + (match_normalized * 0.3)
                        weight_svr = 1.0 - weight_xgb
                        score_modelo = (p_xgb * weight_xgb) + (p_svr * weight_svr)
                    else:
                        score_modelo = (p_xgb + p_svr) / 2.0
                    
                    # COMBINACIÓN INTELIGENTE:
                    # - Si el coseno es muy alto (> 0.7), darle peso significativo
                    # - Si el coseno es medio (0.5-0.7), peso moderado
                    # - Si el coseno es bajo (< 0.5), ignorarlo para prevenir falsos positivos
                    
                    if sim_coseno > 0.7:
                        # Coseno alto: combinar con peso significativo
                        # Peso del coseno aumenta con su valor
                        coseno_weight = 0.2 + ((sim_coseno - 0.7) * 2.0)  # 0.835 → 0.47
                        modelo_weight = 1.0 - coseno_weight
                        
                        # Ajustar: dar más peso al modelo cuando hay buen match de skills
                        if match_score > 50:
                            modelo_weight = min(0.8, modelo_weight + 0.2)
                            coseno_weight = 1.0 - modelo_weight
                        score = (score_modelo * modelo_weight) + (coseno_score * coseno_weight)
                        
                        # NUEVO: Bonus de excelencia para perfiles casi perfectos
                        if match_score > 60 and sim_coseno > 0.75:
                            score = min(98.0, score * 1.25)
                            
                    elif sim_coseno > 0.5:
                        # Coseno medio: influencia moderada
                        coseno_weight = 0.15
                        modelo_weight = 0.85
                        score = (score_modelo * modelo_weight) + (coseno_score * coseno_weight)
                        
                    else:
                        # Coseno bajo: ignorar (usar solo el modelo)
                        score = score_modelo
                
                # Asegurar que el score esté en [0, 100]
                score = np.clip(score, 0.0, 100.0)
                afinidades[vacante_id] = round(float(score), 2)
                
                # Para debugging, mostrando en consola las afinidades de las primeras iteraciones
                if rule_usage['rule1'] + rule_usage['rule2'] + rule_usage['rule3'] + \
                   rule_usage['rule4'] + rule_usage['rule5'] + rule_usage['rule6'] <= 5:
                    HandleLogs.write_log(
                        f"[NLP-DEBUG] Vacante {vacante_id}: "
                        f"cos={sim_coseno:.3f}, match={match_score:.1f}%, "
                        f"xgb={p_xgb:.1f}, svr={p_svr:.1f}, final={score:.1f}"
                    )
            
            # Actualizar estadísticas de inferencia
            with RecomendacionHibridaComponent._stats_lock:
                stats = RecomendacionHibridaComponent._inference_stats
                stats['total_predictions'] += len(afinidades)
                rule_mapping = {
                    'rule1': 'rule1_baja_similitud',
                    'rule2': 'rule2_inflacion_texto',
                    'rule3': 'rule3_match_fuerte',
                    'rule4': 'rule4_alucinatorio',
                    'rule5': 'rule5_perfil_teorico',
                    'rule6': 'rule6_hibrido_normal'
                }
                for rule, count in rule_usage.items():
                    stats['rule_usage'][rule_mapping[rule]] += count
            
            HandleLogs.write_log(
                f"[NLP] Afinidad calculada para estudiante {estudiante_id}: "
                f"{len(afinidades)} vacantes procesadas. "
                f"Reglas: {rule_usage}"
            )
            return afinidades

        except Exception as err:
            HandleLogs.write_error(err)
            HandleLogs.write_log(f"[NLP] Error en cálculo de afinidad: {err}")
            return None

    # =========================================================
    # ESTADÍSTICAS DE INFERENCIA
    # =========================================================
    @staticmethod
    def get_inference_stats():
        """Obtiene estadísticas de uso del motor de recomendación"""
        with RecomendacionHibridaComponent._stats_lock:
            stats = RecomendacionHibridaComponent._inference_stats.copy()
            total = stats['total_predictions']
            if total > 0:
                # Calcular porcentajes de uso de reglas
                rule_percentages = {}
                for rule, count in stats['rule_usage'].items():
                    rule_percentages[rule] = (count / total) * 100
                stats['rule_percentages'] = rule_percentages
            return stats
    
    @staticmethod
    def reset_inference_stats():
        """Reinicia las estadísticas de inferencia"""
        with RecomendacionHibridaComponent._stats_lock:
            RecomendacionHibridaComponent._inference_stats = {
                'total_predictions': 0,
                'rule_usage': {
                    'rule1_baja_similitud': 0,
                    'rule2_inflacion_texto': 0,
                    'rule3_match_fuerte': 0,
                    'rule4_alucinatorio': 0,
                    'rule5_perfil_teorico': 0,
                    'rule6_hibrido_normal': 0
                },
                'avg_xgb_score': 0.0,
                'avg_svr_score': 0.0,
                'avg_final_score': 0.0
            }
        HandleLogs.write_log("[NLP] Estadísticas de inferencia reiniciadas")

    # =========================================================
    # INVALIDACIÓN DE CACHÉ
    # =========================================================
    @staticmethod
    def invalidar_cache_estudiante(estudiante_id):
        """Borra el caché de un estudiante específico (cuando actualiza perfil/skills)"""
        return repo_invalidar_cache_estudiante(estudiante_id)

    @staticmethod
    def invalidar_cache_vacante(vacante_id):
        """Borra el caché de una vacante (cuando se edita o cierra)"""
        return repo_invalidar_cache_vacante(vacante_id)

    @staticmethod
    def invalidar_cache_facultad(facultad_id):
        """
        Borra el caché de todos los estudiantes de una facultad.
        cuando se crea una nueva vacante en esa facultad.
        """
        return repo_invalidar_cache_facultad(facultad_id)
