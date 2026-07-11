import os
import re
import warnings
import numpy as np
import pandas as pd
import joblib
import psycopg2
from psycopg2.extras import RealDictCursor
from sklearn.metrics.pairwise import cosine_similarity
from scipy.spatial.distance import euclidean, cityblock
from sentence_transformers import SentenceTransformer
import nltk
import spacy
from nltk.corpus import stopwords

warnings.filterwarnings("ignore")
nltk.download("stopwords", quiet=True)

# Configuración de procesamiento semántico
stop_words = set(stopwords.words("spanish"))
try:
    nlp = spacy.load("es_core_news_sm", disable=["parser", "ner"])
    print("[INFO] Pipeline de Spacy en Español cargado correctamente.")
except Exception:
    print("[ALERTA] No se encontró 'es_core_news_sm'. Usando pipeline por defecto. Ejecuta: python -m spacy download es_core_news_sm")
    nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])

DB_CONFIG = {
    "dbname": "matchingg_db",  
    "user": "bryan_admin",
    "password": "admin123",    
    "host": "localhost",
    "port": "5432"
}

print("[INFO] Cargando modelos de embedding...")
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

def limpiar_texto(texto):
    if pd.isnull(texto):
        return ""
    texto = str(texto).lower()
    texto = re.sub(r"http\S+", "", texto)
    texto = re.sub(r"[^a-zA-ZáéíóúñÁÉÍÓÚÑ\s]", " ", texto) # Conservando la codificación en español
    texto = re.sub(r"\s+", " ", texto)
    doc = nlp(texto)
    return " ".join([token.lemma_ for token in doc if token.text not in stop_words and len(token.text) > 2])

def obtener_datos_estudiante_real(usuario_id):
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
            if not perfil: return None, []
            cur.execute(query_habilidades, (perfil['estudiante_id'],))
            habs = [row['nombre'] for row in cur.fetchall()]
            return perfil, habs

def obtener_pool_vacantes_reales():
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

def simular_ajuste_prediccion(sim_coseno, dist_euclidiana, match_skills):
    """
    Función matemática de validación empírica para el laboratorio de pruebas.
    Simula el impacto de un RandomForest balanceado con las nuevas distancias.
    """
    # La distancia euclidiana de vectores normalizados oscila entre 0 (idénticos) y sqrt(2) ≈ 1.414 (ortogonales)
    # Convertimos la distancia a un índice de cercanía geométrica (0% a 100%)
    cercania_geometrica = max(0.0, (1.0 - (dist_euclidiana / 1.4142))) * 100
    
    # Combinación híbrida ponderada (Similitud Coseno, Distancia Espacial, Reglas de Negocio de Skills)
    score_hibrido = (sim_coseno * 35) + (cercania_geometrica * 0.25) + (match_skills * 0.40)
    return max(0.0, min(100.0, score_hibrido))

def recomendar_vacantes_db_test(usuario_id, top_n=3):
    perfil_estudiante, habilidades_estudiante = obtener_datos_estudiante_real(usuario_id)
    if not perfil_estudiante: return []
    pool_vacantes, pool_habilidades_vacante = obtener_pool_vacantes_reales()
    if not pool_vacantes: return []

    texto_usuario = f"{perfil_estudiante['carrera_nombre']} {perfil_estudiante['resumen_experiencia']} {perfil_estudiante['intereses']} {' '.join(habilidades_estudiante)}"
    usuario_limpio = limpiar_texto(texto_usuario)
    emb_usuario = embedding_model.encode([usuario_limpio], convert_to_numpy=True, normalize_embeddings=True)[0]
    
    df_vacantes = pd.DataFrame(pool_vacantes)
    habilidades_por_vacante = {}
    for hv in pool_habilidades_vacante:
        v_id = hv["vacante_id"]
        if v_id not in habilidades_por_vacante: habilidades_por_vacante[v_id] = []
        habilidades_por_vacante[v_id].append(hv["habilidad_nombre"])
        
    textos_vacantes = []
    for idx, row in df_vacantes.iterrows():
        habs = habilidades_por_vacante.get(row["vacante_id"], [])
        texto_v = f"{row['titulo']} {row['area']} {row['descripcion']} {row['requisitos']} {' '.join(habs)}"
        textos_vacantes.append(texto_v)
        
    df_vacantes["texto_completo"] = textos_vacantes
    df_vacantes["texto_limpio"] = df_vacantes["texto_completo"].apply(limpiar_texto)
    embs_vacantes = embedding_model.encode(df_vacantes["texto_limpio"].tolist(), convert_to_numpy=True, normalize_embeddings=True)
    
    features_inferencia = []
    porcentajes_calculados = []
    skills_usr_set = set([s.lower() for s in habilidades_estudiante])
    
    print("\n[DEBUG] --- ANÁLISIS DE VECTOR DE CARACTERÍSTICAS AMPLIADO ---")
    for idx, row in df_vacantes.iterrows():
        emb_v = embs_vacantes[idx]
        
        # 1. Similitud Coseno tradicional
        sim_coseno = cosine_similarity([emb_usuario], [emb_v])[0][0]
        
        # 2. Diferencia absoluta por componente
        diff_vectorial = np.abs(emb_usuario - emb_v)
        
        # 3. Distancia Euclidiana y Manhattan
        dist_euclidiana = euclidean(emb_usuario, emb_v)
        dist_manhattan = cityblock(emb_usuario, emb_v)
        
        # 4. Métricas de Capa de Negocio (Habilidades)
        habs_vac = set([s.lower() for s in habilidades_por_vacante.get(row["vacante_id"], [])])
        skill_match_score = (len(skills_usr_set.intersection(habs_vac)) / max(1, len(habs_vac))) * 100
        skill_complementarity_score = (len(habs_vac.difference(skills_usr_set)) / max(1, len(habs_vac))) * 100
        
        # Construcción del vector de 389 dimensiones
        vector_completo = np.concatenate([
            [sim_coseno], 
            diff_vectorial, 
            [dist_euclidiana, dist_manhattan], 
            [skill_match_score, skill_complementarity_score]
        ])
        features_inferencia.append(vector_completo)
        
        # Imprimir métricas de diagnóstico para la vacante perfecta (ID 16)
        if row["vacante_id"] == 16:
            print(f"Vacante 16 ({row['titulo']}):")
            print(f"  -> Similitud Coseno: {sim_coseno:.4f}")
            print(f"  -> Distancia Euclidiana: {dist_euclidiana:.4f} (Menor es más cercano)")
            print(f"  -> Distancia Manhattan: {dist_manhattan:.4f}")
            print(f"  -> Match Habilidades: {skill_match_score:.2f}%")

        # Almacenamos el score estimado combinando la lógica matemática ampliada
        score_estimado = simular_ajuste_prediccion(sim_coseno, dist_euclidiana, skill_match_score)
        porcentajes_calculados.append(score_estimado)

    df_vacantes["porcentaje_afinidad"] = porcentajes_calculados
    df_vacantes = df_vacantes.sort_values(by="porcentaje_afinidad", ascending=False)
    
    columnas_retorno = ["vacante_id", "nombre_empresa", "titulo", "modalidad", "total_horas", "porcentaje_afinidad"]
    return df_vacantes[columnas_retorno].head(top_n).to_dict(orient="records")

if __name__ == "__main__":
    ID_USUARIO_LOGUEADO = 5 
    print("\n==================================================")
    print(f"BANCADA DE PRUEBAS COMPLEMENTARIAS - USUARIO ID: {ID_USUARIO_LOGUEADO}")
    print("==================================================")
    
    recomendaciones = recomendar_vacantes_db_test(usuario_id=ID_USUARIO_LOGUEADO, top_n=3)
    
    print("\n==================================================")
    print("RESULTADOS EN VENTANA DE RECOMENDACIÓN")
    print("==================================================")
    for rec in recomendaciones:
        print(f"ID Vacante: {rec['vacante_id']} | Afinidad: {rec['porcentaje_afinidad']:.2f}%")
        print(f"Puesto: {rec['titulo']} en {rec['nombre_empresa']}")
        print("-" * 50)