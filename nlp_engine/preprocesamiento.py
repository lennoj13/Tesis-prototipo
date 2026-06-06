import os
import re
import json
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# ==========================================
# 1. CONFIGURACIÓN Y CARGA DE MODELOS NLP
# ==========================================
print("Cargando modelo de embeddings semánticos...")
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

def limpiar_texto(texto):
    if not isinstance(texto, str):
        return ""
    texto = texto.lower()
    # Eliminar caracteres especiales y quedarse con letras, números y espacios
    texto = re.sub(re.compile(r'[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]'), ' ', texto)
    # Eliminar espacios dobles
    texto = re.sub(r'\s+', ' ', texto).strip()
    return texto

# ==========================================
# 2. CARGA Y EXPLORACIÓN DEL DATASET
# ==========================================
def cargar_y_explorar_datos(path_csv):
    print("\n[INFO] Cargando y explorando dataset de vacantes...")
    df = pd.read_csv(path_csv)
    
    print(f"Dimensiones originales: {df.shape}")
    print("Columnas detectadas:", df.columns.tolist())
    
    # Limpieza inicial: Rellenar nulos en campos críticos
    df['Title'] = df['Title'].fillna('Pasante de Tecnología')
    df['Skills'] = df['Skills'].fillna('')
    df['Responsibilities'] = df['Responsibilities'].fillna('')
    df['Keywords'] = df['Keywords'].fillna('')
    
    return df

# ==========================================
# 3. GENERACIÓN SINTÉTICA DE PERFILES (DATA AUGMENTATION)
# ==========================================
def generar_dataset_hibrido(df_vacantes):
    """
    Como el dataset solo tiene vacantes, creamos perfiles de estudiantes simulados
    (Matches Altos, Medios y Bajos) para enseñarle al Random Forest a puntuar semánticamente.
    """
    print("\n[INFO] Iniciando Aumento de Datos (Generando interacciones Estudiante-Vacante)...")
    datos_combinados = []
    
    for idx, row in df_vacantes.iterrows():
        skills_vacante = [s.strip() for s in row['Skills'].split(';') if s.strip()]
        keywords_vacante = [k.strip() for k in row['Keywords'].split(';') if k.strip()]
        
        # --- CASO 1: MATCH ALTO (Estudiante Ideal) ---
        estudiante_alto = {
            "carrera_nombre": "INGENIERÍA EN SOFTWARE",
            "resumen_experiencia": f"Estudiante de los últimos semestres con sólida experiencia práctica trabajando en proyectos orientados a {row['Title']}. Capacidad para asumir responsabilidades tales como {row['Responsibilities'].replace(';', ', ')}.",
            "intereses": f"Desarrollo de software, {', '.join(keywords_vacante[:2])}",
            "habilidades": skills_vacante,
            "target_compatibility": np.random.uniform(85.0, 99.0) # Etiqueta Y alta
        }
        
        # --- CASO 2: MATCH MEDIO (Tiene noción, le faltan herramientas) ---
        mitad_skills = skills_vacante[:max(1, len(skills_vacante)//2)]
        estudiante_medio = {
            "carrera_nombre": "INGENIERÍA EN SOFTWARE",
            "resumen_experiencia": f"Estudiante universitario proactivo interesado en el área de tecnología y desarrollo. Conocimientos teóricos de la carrera.",
            "intereses": "Desarrollo de Sistemas, Programación, Innovación",
            "habilidades": mitad_skills if mitad_skills else ["Lógica de programación"],
            "target_compatibility": np.random.uniform(45.0, 65.0) # Etiqueta Y media
        }
        
        # --- CASO 3: MATCH BAJO (Perfil no tecnológico / No compatible) ---
        estudiante_bajo = {
            "carrera_nombre": "ADMINISTRACIÓN DE EMPRESAS",
            "resumen_experiencia": "Experiencia en atención al cliente, gestión de inventarios comerciales, archivo de documentos y contabilidad básica en hojas de cálculo.",
            "intereses": "Finanzas, Gestión de Talento Humano, Ventas",
            "habilidades": ["Excel", "Contabilidad", "Atención al Cliente"],
            "target_compatibility": np.random.uniform(5.0, 25.0) # Etiqueta Y baja
        }
        
        # Guardar las combinaciones guardando la referencia de la vacante
        for est in [estudiante_alto, estudiante_medio, estudiante_bajo]:
            datos_combinados.append({
                "vacante_id": row['JobID'],
                "vacante_texto": f"{row['Title']} {row['Responsibilities']} {row['Skills']}",
                "vacante_skills": skills_vacante,
                "estudiante_texto": f"{est['carrera_nombre']} {est['resumen_experiencia']} {est['intereses']} {' '.join(est['habilidades'])}",
                "estudiante_skills": est['habilidades'],
                "compatibility_score": est['target_compatibility']
            })
            
    return pd.DataFrame(datos_combinados)

# ==========================================
# 4. EXTRACCIÓN DE FEATURES SEMÁNTICAS (EMBEDDINGS)
# ==========================================
def construir_features_semanticas(df_interacciones):
    print("\n[INFO] Procesando embeddings y calculando vectores de características...")
    
    # Limpieza de textos
    df_interacciones['vacante_limpio'] = df_interacciones['vacante_texto'].apply(limpiar_texto)
    df_interacciones['estudiante_limpio'] = df_interacciones['estudiante_texto'].apply(limpiar_texto)
    
    # Obtener Embeddings
    print("-> Computando embeddings de las vacantes...")
    embs_vacantes = embedding_model.encode(df_interacciones['vacante_limpio'].tolist(), show_progress_bar=True, convert_to_numpy=True)
    
    print("-> Computando embeddings de los estudiantes...")
    embs_estudiantes = embedding_model.encode(df_interacciones['estudiante_limpio'].tolist(), show_progress_bar=True, convert_to_numpy=True)
    
    features_X = []
    
    print("-> Construyendo vectores combinados para el clasificador...")
    for i in range(len(df_interacciones)):
        emb_v = embs_vacantes[i]
        emb_e = embs_estudiantes[i]
        
        # 1. Similitud coseno pura de BERT
        sim_coseno = cosine_similarity([emb_e], [emb_v])[0][0]
        
        # 2. Diferencia absoluta elemental (Alineación de tópicos ocultos)
        diff_vectorial = np.abs(emb_e - emb_v)
        
        # 3. Métricas directas de Skill-Overlap (Matemática de conjuntos)
        sk_vac = set([s.lower() for s in df_interacciones.iloc[i]['vacante_skills']])
        sk_est = set([s.lower() for s in df_interacciones.iloc[i]['estudiante_skills']])
        
        skill_match_score = (len(sk_est.intersection(sk_vac)) / max(1, len(sk_vac))) * 100
        skill_complementarity_score = (len(sk_vac.difference(sk_est)) / max(1, len(sk_vac))) * 100
        
        # Unificar todo el vector numérico de entrada (1 + 384 + 2 = 387 columnas en X)
        features_fila = np.concatenate([[sim_coseno], diff_vectorial, [skill_match_score, skill_complementarity_score]])
        features_X.append(features_fila)
        
    return np.array(features_X, dtype=np.float32), df_interacciones['compatibility_score'].values

# ==========================================
# 5. ENTRENAMIENTO Y EVALUACIÓN DEL MODELO
# ==========================================
def entrenar_modelo_pivipp(X, y):
    print(f"\n[INFO] Estructura final de datos - X: {X.shape}, y: {y.shape}")
    
    # Separación en entrenamiento y pruebas (80/20)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Escalando vectores numéricos...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    print("Entrenando regresor RandomForest (Alineando pesos semánticos)...")
    # Limitamos profundidad y estimadores para evitar sobreajuste y reducir peso del archivo .pkl
    model = RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1)
    model.fit(X_train_scaled, y_train)
    
    # Evaluación de métricas
    preds = model.predict(X_test_scaled)
    mse = mean_squared_error(y_test, preds)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, preds)
    
    print("\n=============================================")
    print("         MÉTRICAS DE EVALUACIÓN FINAL         ")
    print("=============================================")
    print(f"R² Score (Precisión General) : {r2:.4f}")
    print(f"RMSE (Margen de Error Promedio): {rmse:.4f}% de afinidad")
    print(f"MSE  (Error Cuadrático Medio) : {mse:.4f}")
    print("=============================================")
    
    # Exportar artefactos del modelo para producción
    print("\n[INFO] Exportando componentes entrenados...")
    os.makedirs("modelos_entrenados", exist_ok=True)
    joblib.dump(model, "modelos_entrenados/pivipp_random_forest.pkl")
    joblib.dump(scaler, "modelos_entrenados/pivipp_scaler.pkl")
    print("¡Guardado exitoso en carpeta 'modelos_entrenados/'!")

# ==========================================
# BLOQUE PRINCIPAL DE EJECUCIÓN
# ==========================================
if __name__ == "__main__":
    # ruta del dataset
    path_dataset = r"D:\TESIS\prototipo\Tesis-prototipo\nlp_engine\data\job_dataset.csv"
    
    if not os.path.exists(path_dataset):
        print(f"[ERROR] No se encuentra el archivo en la ruta especificada:\n{path_dataset}\nVerifica la ubicación.")
    else:
        # Ejecución secuencial del pipeline de Machine Learning
        df_original = cargar_y_explorar_datos(path_dataset)
        
        # Limitamos el subset para la demostración si el dataset es masivo (ej. primeras 1000 vacantes)
        df_sub = df_original.head(1000) 
        
        df_interacciones = generar_dataset_hibrido(df_sub)
        X, y = construir_features_semanticas(df_interacciones)
        entrenar_modelo_pivipp(X, y)