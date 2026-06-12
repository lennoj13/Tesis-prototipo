#Servicio de recomendación 1 - Conectado a postgres
# import os
# import re
# import warnings
# import numpy as np
# import pandas as pd
# import joblib
# import psycopg2
# from psycopg2.extras import RealDictCursor
# from sklearn.metrics.pairwise import cosine_similarity
# from sentence_transformers import SentenceTransformer
# import nltk
# import spacy
# from nltk.corpus import stopwords

# # Configuración de alertas y NLP
# warnings.filterwarnings("ignore")
# nltk.download("stopwords", quiet=True)
# # stop_words = set(stopwords.words("spanish"))
# stop_words = set(stopwords.words("english"))
# nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])

# # =====================================================
# # CONFIGURACIÓN DE CONEXIÓN A POSTGRESQL
# # =====================================================
# DB_CONFIG = {
#     "dbname": "matchingg_db",  
#     "user": "bryan_admin",
#     "password": "admin123",    
#     "host": "localhost",
#     "port": "5432"
# }
# print("[INFO] Configuración de conexión a PostgreSQL establecida.")
         

# # =====================================================
# # CARGA DEL MOTOR NLP Y ARTEFACTOS ENTRENADOS
# # =====================================================
# print("[INFO] Cargando el motor de Inteligencia Artificial (PIVIPP)...")
# try:
#     model = joblib.load("modelos_entrenados/pivipp_random_forest.pkl")
#     scaler = joblib.load("modelos_entrenados/pivipp_scaler.pkl")
#     embedding_model = SentenceTransformer("all-MiniLM-L6-v2") 
#     print("[OK] Artefactos cargados con éxito.")
# except Exception as e:
#     print(f"[ERROR] No se pudieron cargar los archivos .pkl:{e}")
#     exit(1)

# def limpiar_texto(texto):
#     if pd.isnull(texto):
#         return ""
#     texto = str(texto).lower()
#     texto = re.sub(r"http\S+", "", texto)
#     texto = re.sub(r"[^a-zA-Z\s]", " ", texto)
#     texto = re.sub(r"\s+", " ", texto)
#     doc = nlp(texto)
#     return " ".join([token.lemma_ for token in doc if token.text not in stop_words and len(token.text) > 2])

# # =====================================================
# # CAPA DE DATOS A POSTGRESQL
# # =====================================================
# def obtener_datos_estudiante_real(usuario_id):
#     """ Obtiene el perfil del estudiante y su lista de habilidades desde la BD """
#     query_perfil = """
#         SELECT pe.perfil_id as estudiante_id, c.nombre as carrera_nombre, pe.resumen_experiencia, pe.intereses, u.nombre, u.apellido
#         FROM public.perfiles_estudiante pe
#         JOIN public.usuarios u ON pe.usuario_id = u.usuario_id
#         JOIN public.carreras c ON pe.carrera_id = c.carrera_id
#         WHERE pe.usuario_id = %s;
#     """
#     query_habilidades = """
#         SELECT h.nombre 
#         FROM public.habilidades_estudiante he
#         JOIN public.habilidades h ON he.habilidad_id = h.habilidad_id
#         WHERE he.estudiante_id = %s;
#     """
    
#     with psycopg2.connect(**DB_CONFIG) as conn:
#         with conn.cursor(cursor_factory=RealDictCursor) as cur:
#             # 1. Buscar perfil
#             cur.execute(query_perfil, (usuario_id,))
#             perfil = cur.fetchone()
#             if not perfil:
#                 return None, []
            
#             # 2. Buscar habilidades asociadas
#             cur.execute(query_habilidades, (perfil['estudiante_id'],))
#             habs = [row['nombre'] for row in cur.fetchall()]
#             return perfil, habs

# def obtener_pool_vacantes_reales():
#     """ Trae todas las vacantes con sus empresas y consolida sus habilidades en una sola consulta """
#     query_vacantes = """
#         SELECT v.vacante_id, i.nombre as nombre_empresa, v.titulo, v.area, 
#                v.descripcion, v.requisitos, v.modalidad, v.ubicacion, v.total_horas
#         FROM public.vacantes v
#         JOIN public.instituciones i ON v.institucion_id = i.institucion_id;
#     """
#     query_habs_vacantes = """
#         SELECT hv.vacante_id, h.nombre as habilidad_nombre
#         FROM public.habilidades_vacante hv
#         JOIN public.habilidades h ON hv.habilidad_id = h.habilidad_id;
#     """
    
#     with psycopg2.connect(**DB_CONFIG) as conn:
#         with conn.cursor(cursor_factory=RealDictCursor) as cur:
#             cur.execute(query_vacantes)
#             pool_vacantes = cur.fetchall()
            
#             cur.execute(query_habs_vacantes)
#             pool_habilidades = cur.fetchall()
            
#             return pool_vacantes, pool_habilidades

# # =====================================================
# # CAPA DE NEGOCIO: MOTOR DE RECOMENDACIÓN HÍBRIDO
# # =====================================================
# def recomendar_vacantes_db(usuario_id, top_n=3):
#     # 1. Carga de datos reales desde PostgreSQL
#     perfil_estudiante, habilidades_estudiante = obtener_datos_estudiante_real(usuario_id)
#     if not perfil_estudiante:
#         print(f"[ALERTA] No se encontró un perfil de estudiante para el usuario_id: {usuario_id}")
#         return []
        
#     pool_vacantes, pool_habilidades_vacante = obtener_pool_vacantes_reales()
#     if not pool_vacantes:
#         print("[ALERTA] No hay vacantes cargadas en el sistema para contrastar.")
#         return []

#     # 2. Preparar e inferir texto del estudiante
#     texto_usuario = (
#         f"{perfil_estudiante['carrera_nombre']} {perfil_estudiante['resumen_experiencia']} "
#         f"{perfil_estudiante['intereses']} {' '.join(habilidades_estudiante)}"
#     )
#     usuario_limpio = limpiar_texto(texto_usuario)
#     emb_usuario = embedding_model.encode([usuario_limpio], convert_to_numpy=True, normalize_embeddings=True)[0]
    
#     df_vacantes = pd.DataFrame(pool_vacantes)
    
#     # Mapeo estructurado de habilidades requeridas por cada vacante
#     habilidades_por_vacante = {}
#     for hv in pool_habilidades_vacante:
#         v_id = hv["vacante_id"]
#         if v_id not in habilidades_por_vacante:
#             habilidades_por_vacante[v_id] = []
#         habilidades_por_vacante[v_id].append(hv["habilidad_nombre"])
        
#     # Construcción de strings semánticos de las vacantes reales
#     textos_vacantes = []
#     for idx, row in df_vacantes.iterrows():
#         habs = habilidades_por_vacante.get(row["vacante_id"], [])
#         texto_v = f"{row['titulo']} {row['area']} {row['descripcion']} {row['requisitos']} {' '.join(habs)}"
#         textos_vacantes.append(texto_v)
        
#     df_vacantes["texto_completo"] = textos_vacantes
#     df_vacantes["texto_limpio"] = df_vacantes["texto_completo"].apply(limpiar_texto)
    
#     # Obtener Embeddings de las vacantes de la BD
#     embs_vacantes = embedding_model.encode(df_vacantes["texto_limpio"].tolist(), convert_to_numpy=True, normalize_embeddings=True)
    
#     # 3. Mapear vectores de entrada al RandomForest (387 columnas exactas)
#     features_inferencia = []
#     skills_usr_set = set([s.lower() for s in habilidades_estudiante])
    
#     for idx, row in df_vacantes.iterrows():
#         emb_v = embs_vacantes[idx]
#         sim_coseno = cosine_similarity([emb_usuario], [emb_v])[0][0]
#         diff_vectorial = np.abs(emb_usuario - emb_v)
        
#         habs_vac = set([s.lower() for s in habilidades_por_vacante.get(row["vacante_id"], [])])
#         skill_match_score = (len(skills_usr_set.intersection(habs_vac)) / max(1, len(habs_vac))) * 100
#         skill_complementarity_score = (len(habs_vac.difference(skills_usr_set)) / max(1, len(habs_vac))) * 100
        
#         vector_completo = np.concatenate([[sim_coseno], diff_vectorial, [skill_match_score, skill_complementarity_score]])
#         features_inferencia.append(vector_completo)

#     # 4. Inferencia con la Inteligencia Artificial
#     X_inf = np.array(features_inferencia, dtype=np.float32)
#     X_inf_scaled = scaler.transform(X_inf)
#     predicciones = model.predict(X_inf_scaled)
    
#     df_vacantes["porcentaje_afinidad"] = [max(0.0, min(100.0, float(score))) for score in predicciones]
#     df_vacantes = df_vacantes.sort_values(by="porcentaje_afinidad", ascending=False)
    
#     columnas_retorno = ["vacante_id", "nombre_empresa", "titulo", "modalidad", "total_horas", "porcentaje_afinidad"]
#     return df_vacantes[columnas_retorno].head(top_n).to_dict(orient="records")

# # =====================================================
# # BLOQUE DE PRUEBA USANDO LOS DATOS DE LA BD
# # =====================================================
# if __name__ == "__main__":
#     ID_USUARIO_LOGUEADO = 5 
    
#     print("\n==================================================")
#     print(f"Buscando vacantes en BD para el Usuario ID: {ID_USUARIO_LOGUEADO}")
#     print("==================================================")
    
#     try:
#         recomendaciones = recomendar_vacantes_db(usuario_id=ID_USUARIO_LOGUEADO, top_n=3)
        
#         if not recomendaciones:
#             print("No se generaron recomendaciones. Verifica que las tablas tengan datos.")
#         else:
#             for rec in recomendaciones:
#                 print(f"ID Vacante: {rec['vacante_id']} |")
#                 print(f"Porcentaje de Afinidad Calculado: {rec['porcentaje_afinidad']:.2f}%")
#                 print(f"Empresa: {rec['nombre_empresa']}")
#                 print(f"Puesto: {rec['titulo']}")
#                 print(f"Modalidad: {rec['modalidad']}")
#                 print(f"Horas: {rec['total_horas']} horas")
#                 print("-" * 66)
#     except Exception as error_db:
#         print(f"\n[ERROR DE CONEXIÓN/EJECUCIÓN]: {error_db}")
#         print("Asegúrate de que PostgreSQL esté corriendo y que tus credenciales en 'DB_CONFIG' sean correctas.")











#--------------------------------------------------

#CODIGO 2 FUNCIONAL -CONECTADO A POSTGRESQL, CON MODELO XGBOOST ENTRENADO
#---------------------------------------
import os
import re
import numpy as np
import pandas as pd
import psycopg2
from psycopg2.extras import RealDictCursor
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.spatial.distance import euclidean, cityblock # Importaciones críticas corregidas
import joblib

# CONFIGURACIÓN SIMULADA DE DB (Asegúrate de tener tus credenciales aquí)
DB_CONFIG = {
    "dbname": "matching_db",
    "user": "postgres",
    "password": "jonnel01",
    "host": "localhost",
    "port": "5432"
}

# =====================================================
# CARGA DEL MOTOR NLP Y ARTEFACTOS ENTRENADOS
# =====================================================
print("[INFO] Cargando el motor de Inteligencia Artificial (PIVIPP)...")
try:
    #MODELO RANDOM FOREST
    # model = joblib.load("modelos_entrenados/model2_random_forest.pkl")
    # scaler = joblib.load("modelos_entrenados/model2_scaler.pkl")
    #MODELO SVR
    # model = joblib.load("modelos_entrenados/svr/pivipp_svr.pkl")
    # scaler = joblib.load("modelos_entrenados/svr/pivipp_svr_scaler.pkl")
    model = joblib.load("modelos_entrenados/xgboost/pivipp_xgboost.pkl")
    scaler = joblib.load("modelos_entrenados/xgboost/pivipp_xgboost_scaler.pkl")
    embedding_model = SentenceTransformer("all-MiniLM-L6-v2") 
    print("[OK] Artefactos y modelo multi-métrica (389 features) cargados con éxito.")
except Exception as e:
    print(f"[ERROR] No se pudieron cargar los archivos .pkl: {e}")
    exit(1)

def limpiar_texto(texto):
    """
    HOMOLOGADA CON EL ENTRENAMIENTO:
    Elimina Spacy temporalmente de esta función para garantizar que los embeddings 
    vectoriales sean idénticos en estructura y distribución a los del modelo entrenado.
    """
    if not isinstance(texto, str):
        return ""
    texto = texto.lower()
    # Eliminar caracteres especiales y quedarse con letras, números, tildes y espacios
    texto = re.sub(re.compile(r'[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]'), ' ', texto)
    # Eliminar espacios dobles
    texto = re.sub(r'\s+', ' ', texto).strip()
    return texto

# =====================================================
# CAPA DE DATOS A POSTGRESQL
# =====================================================
def obtener_datos_estudiante_real(usuario_id):
    """ Obtiene el perfil del estudiante y su lista de habilidades desde la BD """
    query_perfil = """
        SELECT pe.perfil_id as estudiante_id, c.nombre as carrera_nombre, pe.resumen_experiencia, pe.intereses, u.nombre, u.apellido
        FROM public.perfiles_estudiante pe
        JOIN public.usuarios u ON pe.usuario_id = u.usuario_id
        JOIN public.carreras c ON pe.carrera_id = c.carrera_id
        WHERE pe.usuario_id = %s;
    """
    query_habilidades = """
        SELECT h.nombre 
        FROM public.habilidades_estudiante he
        JOIN public.habilidades h ON he.habilidad_id = h.habilidad_id
        WHERE he.estudiante_id = %s;
    """
    
    with psycopg2.connect(**DB_CONFIG) as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query_perfil, (usuario_id,))
            perfil = cur.fetchone()
            if not perfil:
                return None, []
            
            cur.execute(query_habilidades, (perfil['estudiante_id'],))
            habs = [row['nombre'] for row in cur.fetchall()]
            return perfil, habs

def obtener_pool_vacantes_reales():
    """ Trae todas las vacantes con sus empresas y consolida sus habilidades """
    query_vacantes = """
        SELECT v.vacante_id, i.nombre as nombre_empresa, v.titulo, v.area, 
               v.descripcion, v.requisitos, v.modalidad, v.ubicacion, v.total_horas
        FROM public.vacantes v
        JOIN public.instituciones i ON v.institucion_id = i.institucion_id;
    """
    query_habs_vacantes = """
        SELECT hv.vacante_id, h.nombre as habilidad_nombre
        FROM public.habilidades_vacante hv
        JOIN public.habilidades h ON hv.habilidad_id = h.habilidad_id;
    """
    
    with psycopg2.connect(**DB_CONFIG) as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query_vacantes)
            pool_vacantes = cur.fetchall()
            
            cur.execute(query_habs_vacantes)
            pool_habilidades = cur.fetchall()
            
            return pool_vacantes, pool_habilidades

# =====================================================
# CAPA DE NEGOCIO: MOTOR DE RECOMENDACIÓN HÍBRIDO
# =====================================================
def recomendar_vacantes_db(usuario_id, top_n=3):
    # 1. Carga de datos reales desde PostgreSQL
    perfil_estudiante, habilidades_estudiante = obtener_datos_estudiante_real(usuario_id)
    if not perfil_estudiante:
        print(f"[ALERTA] No se encontró un perfil de estudiante para el usuario_id: {usuario_id}")
        return []
        
    pool_vacantes, pool_habilidades_vacante = obtener_pool_vacantes_reales()
    if not pool_vacantes:
        print("[ALERTA] No hay vacantes cargadas en el sistema para contrastar.")
        return []

    # 2. Preparar e inferir texto del estudiante
    texto_usuario = (
        f"{perfil_estudiante['carrera_nombre']} {perfil_estudiante['resumen_experiencia']} "
        f"{perfil_estudiante['intereses']} {' '.join(habilidades_estudiante)}"
    )
    usuario_limpio = limpiar_texto(texto_usuario)
    emb_usuario = embedding_model.encode([usuario_limpio], convert_to_numpy=True, normalize_embeddings=True)[0]
    
    df_vacantes = pd.DataFrame(pool_vacantes)
    
    # Mapeo estructurado de habilidades requeridas por cada vacante
    habilidades_por_vacante = {}
    for hv in pool_habilidades_vacante:
        v_id = hv["vacante_id"]
        if v_id not in habilidades_por_vacante:
            habilidades_por_vacante[v_id] = []
        habilidades_por_vacante[v_id].append(hv["habilidad_nombre"])
        
    # Construcción de strings semánticos de las vacantes reales
    textos_vacantes = []
    for idx, row in df_vacantes.iterrows():
        habs = habilidades_por_vacante.get(row["vacante_id"], [])
        texto_v = f"{row['titulo']} {row['area']} {row['descripcion']} {row['requisitos']} {' '.join(habs)}"
        textos_vacantes.append(texto_v)
        
    df_vacantes["texto_completo"] = textos_vacantes
    df_vacantes["texto_limpio"] = df_vacantes["texto_completo"].apply(limpiar_texto)
    
    # Obtener Embeddings de las vacantes de la BD
    embs_vacantes = embedding_model.encode(df_vacantes["texto_limpio"].tolist(), convert_to_numpy=True, normalize_embeddings=True)
    
    # 3. Mapear vectores de entrada al RandomForest (389 columnas exactas)
    features_inferencia = []
    skills_usr_set = set([s.lower() for s in habilidades_estudiante])
    
    for idx, row in df_vacantes.iterrows():
        emb_v = embs_vacantes[idx]
        
        # Similitud coseno y diferencia vectorial
        sim_coseno = cosine_similarity([emb_usuario], [emb_v])[0][0]
        diff_vectorial = np.abs(emb_usuario - emb_v)

        # Métricas de distancia euclidiana y manhattan (Cruciales para el nuevo pkl)
        dist_euclidiana = euclidean(emb_usuario, emb_v)
        dist_manhattan = cityblock(emb_usuario, emb_v)

        # Variables de coincidencia de habilidades
        habs_vac = set([s.lower() for s in habilidades_por_vacante.get(row["vacante_id"], [])])
        skill_match_score = (len(skills_usr_set.intersection(habs_vac)) / max(1, len(habs_vac))) * 100
        skill_complementarity_score = (len(habs_vac.difference(skills_usr_set)) / max(1, len(habs_vac))) * 100
        
        # Construcción del vector de 389 características alineado
        vector_completo = np.concatenate([
            [sim_coseno], 
            diff_vectorial,
            [dist_euclidiana, dist_manhattan],
            [skill_match_score, skill_complementarity_score]
        ])
        features_inferencia.append(vector_completo)

    # 4. Inferencia con el modelo entrenado
    X_inf = np.array(features_inferencia, dtype=np.float32)
    X_inf_scaled = scaler.transform(X_inf)
    predicciones = model.predict(X_inf_scaled)
    
    df_vacantes["porcentaje_afinidad"] = [max(0.0, min(100.0, float(score))) for score in predicciones]
    df_vacantes = df_vacantes.sort_values(by="porcentaje_afinidad", ascending=False)
    
    columnas_retorno = ["vacante_id", "nombre_empresa", "titulo", "modalidad", "total_horas", "porcentaje_afinidad"]
    return df_vacantes[columnas_retorno].head(top_n).to_dict(orient="records")

# =====================================================
# BLOQUE DE PRUEBA
# =====================================================
if __name__ == "__main__":
    ID_USUARIO_LOGUEADO = 5 
    
    print("\n==================================================")
    print(f"Buscando vacantes en BD para el Usuario ID: {ID_USUARIO_LOGUEADO}")
    print("==================================================")
    
    try:
        recomendaciones = recomendar_vacantes_db(usuario_id=ID_USUARIO_LOGUEADO, top_n=3)
        
        if not recomendaciones:
            print("No se generaron recomendaciones. Verifica que las tablas tengan datos.")
        else:
            for rec in recomendaciones:
                print(f"ID Vacante: {rec['vacante_id']} |")
                print(f"Porcentaje de Afinidad Calculado: {rec['porcentaje_afinidad']:.2f}%")
                print(f"Empresa: {rec['nombre_empresa']}")
                print(f"Puesto: {rec['titulo']}")
                print(f"Modalidad: {rec['modalidad']}")
                print(f"Horas: {rec['total_horas']} horas")
                print("-" * 66)
    except Exception as error_db:
        print(f"\n[ERROR DE CONEXIÓN/EJECUCIÓN]: {error_db}")