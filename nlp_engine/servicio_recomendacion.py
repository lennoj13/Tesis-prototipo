import pandas as pd
import numpy as np
import re
import warnings
import nltk
import spacy
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import joblib
from nltk.corpus import stopwords

warnings.filterwarnings("ignore")
nltk.download("stopwords", quiet=True)
stop_words = set(stopwords.words("english"))
stop_words = set(stopwords.words("english"))
nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])

def limpiar_texto(texto):
    if pd.isnull(texto):
        return ""
    texto = str(texto).lower()
    texto = re.sub(r"http\S+", "", texto)
    texto = re.sub(r"[^a-zA-Z\s]", " ", texto)
    texto = re.sub(r"\s+", " ", texto)
    doc = nlp(texto)
    return " ".join([token.lemma_ for token in doc if token.text not in stop_words and len(token.text) > 2])

#####################################################
# Cargar el modelo entrenado y el scaler
#####################################################
print("Cargando el motor de Inteligencia Artificial...")
# model = joblib.load("modelo_recomendacion.pkl")
# scaler = joblib.load("scaler.pkl")
model = joblib.load("modelos_entrenados/pivipp_random_forest.pkl")
scaler = joblib.load("modelos_entrenados/pivipp_scaler.pkl")
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

def recomendar_vacantes(perfil_estudiante, habilidades_estudiante, pool_vacantes, pool_habilidades_vacante, pool_instituciones, top_n=3):
    """
    Compara un perfil de usuario dinámico contra un pool de vacantes nuevas.
    Retorna las mejores opciones ordenadas por el porcentaje de afinidad del modelo híbrido.
    """
    # 1. Preparar y limpiar texto del estudiante
    texto_usuario = (
        f"{perfil_estudiante['carrera_nombre']} {perfil_estudiante['resumen_experiencia']} "
        f"{perfil_estudiante['intereses']} {' '.join(habilidades_estudiante)}"
    )
    usuario_limpio = limpiar_texto(texto_usuario)
    emb_usuario = embedding_model.encode([usuario_limpio], convert_to_numpy=True, normalize_embeddings=True)[0]
    
    # 2. Procesar las vacantes disponibles en la base de datos
    df_vacantes = pd.DataFrame(pool_vacantes)
    df_instituciones = pd.DataFrame(pool_instituciones)
    
    # Cruzar con instituciones para obtener el nombre de la empresa
    df_vacantes = df_vacantes.merge(df_instituciones[["institucion_id", "nombre"]], on="institucion_id", how="left")
    df_vacantes = df_vacantes.rename(columns={"nombre": "nombre_empresa"})
    
    # Mapeo de habilidades_vacante
    habilidades_por_vacante = {}
    for hv in pool_habilidades_vacante:
        v_id = hv["vacante_id"]
        if v_id not in habilidades_por_vacante:
            habilidades_por_vacante[v_id] = []
        habilidades_por_vacante[v_id].append(hv["habilidad_nombre"])
        
    # Construcción de strings de texto para embeddings semánticos de vacantes
    textos_vacantes = []
    for idx, row in df_vacantes.iterrows():
        habs = habilidades_por_vacante.get(row["vacante_id"], [])
        texto_v = f"{row['titulo']} {row['area']} {row['descripcion']} {row['requisitos']} {' '.join(habs)}"
        textos_vacantes.append(texto_v)
        
    df_vacantes["texto_completo"] = textos_vacantes
    df_vacantes["texto_limpio"] = df_vacantes["texto_completo"].apply(limpiar_texto)
    
    # Codificar Vacantes
    embs_vacantes = embedding_model.encode(df_vacantes["texto_limpio"].tolist(), convert_to_numpy=True, normalize_embeddings=True)
    
    # 3. Construcción exacta de los vectores de características (387 features)
    features_inferencia = []
    skills_usr_set = set([s.lower() for s in habilidades_estudiante])
    
    for idx, row in df_vacantes.iterrows():
        emb_v = embs_vacantes[idx]

        # Similitud Coseno y diferencia vectorial entre el perfil del usuario y la vacante
        sim_coseno = cosine_similarity([emb_usuario], [emb_v])[0][0]
        diff_vectorial = np.abs(emb_usuario - emb_v)
        
        # Habilidades requeridas por la vacante vs habilidades del estudiante
        habs_vac = set([s.lower() for s in habilidades_por_vacante.get(row["vacante_id"], [])])
        
        skill_match_score = (len(skills_usr_set.intersection(habs_vac)) / max(1, len(habs_vac))) * 100
        skill_complementarity_score = (len(habs_vac.difference(skills_usr_set)) / max(1, len(habs_vac))) * 100
        
        # Unificamos estrictamente con la misma estructura con la que el modelo fue entrenado (387 features)
        vector_completo = np.concatenate([[sim_coseno], diff_vectorial, [skill_match_score, skill_complementarity_score]])
        features_inferencia.append(vector_completo)

    # 4. Predicción con el modelo entrenado
    X_inf = np.array(features_inferencia, dtype=np.float32)
    X_inf_scaled = scaler.transform(X_inf)
    predicciones = model.predict(X_inf_scaled)
    
    # Insertar porcentajes controlados en el DataFrame
    df_vacantes["porcentaje_afinidad"] = [max(0.0, min(100.0, float(score))) for score in predicciones]

    # Ordenar de mayor a menor afinidad
    df_vacantes = df_vacantes.sort_values(by="porcentaje_afinidad", ascending=False)
    
    columnas_retorno = ["vacante_id", "nombre_empresa", "titulo", "modalidad", "total_horas", "porcentaje_afinidad"]
    return df_vacantes[columnas_retorno].head(top_n).to_dict(orient="records")

#####################################################
# PRUEBA CON PERFIL DE USUARIO Y VACANTES SIMULADAS
#SEGUN LA ESTRUCTURA DE LA BD
#####################################################

if __name__ == "__main__":
    # Caso 1: El perfil de un estudiante registrado en el sistema
    estudiante_sql = {
        "perfil_id": 1,
        "usuario_id": 4,
        "nombre": "Bryan Guillermo",          
        "apellido": "Galarza Indacochea",     
        "carrera_nombre": "SOFTWARE",
        "semestre": "9",
        "resumen_experiencia": "Experiencia en desarrollo web con React y Python, manejo de bases de datos PostgreSQL y control de versiones con Git.",
        "intereses": "Desarrollo Web, Ciencia de Datos, IA, Frontend"
    }

    # Relación de public.habilidades_estudiante vinculadas al perfil_id 1
    habilidades_estudiante_sql = ["React", "JavaScript", "Python", "Flask", "PostgreSQL", "Git"]
    
    instituciones_sql = [
        {"institucion_id": 1, "nombre": "TechSolutions GYE"},
        {"institucion_id": 2, "nombre": "DataMind Ecuador"},
        {"institucion_id": 6, "nombre": "SmartCode"},
        {"institucion_id": 7, "nombre": "Devs & Data Ecuador"}
    ]

    # Base de Datos Simulada de Vacantes
    # Vacantes:
    vacantes_sql = [
        {
            "vacante_id": 1,
            "institucion_id": 1,
            "titulo": "Practicante Desarrollo Frontend",
            "area": "Desarrollo Web y Desktop",
            "descripcion": "Buscamos estudiante para practicas en desarrollo frontend con React y TypeScript.",
            "requisitos": "Estudiante de Software o sistemas con conocimiento en React y Python.",
            "modalidad": "Hibrido",
            "ubicacion": "Guayaquil",
            "total_horas": 240
        },
        {
            "vacante_id": 2,
            "institucion_id": 2,
            "titulo": "Practicante Analisis de Datos",
            "area": "Data Science",
            "descripcion": "Practicas en analisis de datos con Python y herramientas de BI.",
            "requisitos": "Conocimiento en Python, SQL. Interes en machine learning.",
            "modalidad": "Presencial",
            "ubicacion": "Guayaquil",
            "total_horas": 144
        },
        {
            "vacante_id": 6,
            "institucion_id": 6,
            "titulo": "Practicante Backend .NET",
            "area": "Desarrollo Backend",
            "descripcion": "Desarrollo de microservicios con C# y .NET.",
            "requisitos": "Conocimientos de C# y SQL Server.",
            "modalidad": "Remoto",
            "ubicacion": "Quito",
            "total_horas": 240
        },
        {
            "vacante_id": 7,
            "institucion_id": 7,
            "titulo": "Practicante Fullstack Python & React",
            "area": "Desarrollo Web", 
            "descripcion": "Buscamos estudiante de software apasionado por el desarrollo web usando Flask y React para construir módulos internos y gestionar bases de datos con PostgreSQL.",
            "requisitos": "Estudiante de Software con sólidos conocimientos en Python, React, Flask, PostgreSQL y control de versiones Git.",
            "modalidad": "Hibrido",
            "ubicacion": "Guayaquil", 
            "total_horas": 240
        }
    ]

    # HABILIDADES REQUERIDAS POR VACANTE:
    habilidades_vacantes_sql = [
        {"vacante_id": 1, "habilidad_nombre": "React"},
        {"vacante_id": 1, "habilidad_nombre": "TypeScript"},
        {"vacante_id": 2, "habilidad_nombre": "Python"},
        {"vacante_id": 2, "habilidad_nombre": "SQL"},
        {"vacante_id": 6, "habilidad_nombre": "C#"},
        {"vacante_id": 6, "habilidad_nombre": ".NET"},
        {"vacante_id": 7, "habilidad_nombre": "React"},
        {"vacante_id": 7, "habilidad_nombre": "Python"},
        {"vacante_id": 7, "habilidad_nombre": "Flask"},
        {"vacante_id": 7, "habilidad_nombre": "PostgreSQL"},
        {"vacante_id": 7, "habilidad_nombre": "Git"}
    ]

    # Ejecutar la función de recomendación
    nombre_completo = f"{estudiante_sql['nombre']} {estudiante_sql['apellido']}"
    print("\n==================================================")
    print(f"Buscando vacantes ideales para: {nombre_completo}")
    print("==================================================")

    recom_actuales = recomendar_vacantes(
        perfil_estudiante=estudiante_sql,
        habilidades_estudiante=habilidades_estudiante_sql,
        pool_vacantes=vacantes_sql,
        pool_habilidades_vacante=habilidades_vacantes_sql,
        pool_instituciones=instituciones_sql,
        top_n=3
    )
    
    for rec in recom_actuales:
        print(f"ID Vacante: {rec['vacante_id']} |")
        print(f"Porcentaje de Afinidad Calculado: {rec['porcentaje_afinidad']:.2f}%")
        print(f"Empresa: {rec['nombre_empresa']}")
        print(f"Puesto: {rec['titulo']}")
        print(f"Modalidad: {rec['modalidad']}")
        print(f"Horas: {rec['total_horas']} horas")
        print("-" * 66)