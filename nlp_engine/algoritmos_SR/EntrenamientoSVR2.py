import os
import re
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVR  # Algoritmo SVR
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# ==========================================
# 1. CONFIGURACIÓN Y CARGA DE MODELOS NLP
# ==========================================
print("Cargando modelo de embeddings semánticos para SVR V2...")
# NOTA: Al usar all-MiniLM-L6-v2 (Transformer de contexto completo), mantenemos el texto 
# con su estructura natural para no romper la capacidad semántica del modelo.
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

def limpiar_texto(texto):
    if not isinstance(texto, str):
        return ""
    texto = texto.lower()
    texto = re.sub(re.compile(r'[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]'), ' ', texto)
    texto = re.sub(r'\s+', ' ', texto).strip()
    return texto

# ==========================================
# 2. CARGA DEL DATASET
# ==========================================
def cargar_y_explorar_datos(path_csv):
    df = pd.read_csv(path_csv)
    df['Title'] = df['Title'].fillna('Pasante de Tecnología')
    df['Skills'] = df['Skills'].fillna('')
    df['Responsibilities'] = df['Responsibilities'].fillna('')
    df['Keywords'] = df['Keywords'].fillna('')
    return df

# ==========================================
# 3. GENERACIÓN SINTÉTICA DE PERFILES (DATA AUGMENTATION)
# ==========================================
def generar_dataset_hibrido(df_vacantes):
    datos_combinados = []
    for idx, row in df_vacantes.iterrows():
        skills_vacante = [s.strip() for s in row['Skills'].split(';') if s.strip()]
        
        # Alto match
        datos_combinados.append({
            "vacante_id": row['JobID'],
            "vacante_texto": f"{row['Title']} {row['Responsibilities']} {row['Skills']}",
            "vacante_skills": skills_vacante,
            "estudiante_texto": f"INGENIERÍA EN SOFTWARE Estudiante de los últimos semestres con sólida experiencia práctica trabajando en proyectos orientados a {row['Title']}. Capacidad para asumir responsabilidades tales como {row['Responsibilities'].replace(';', ', ')}.",
            "estudiante_skills": skills_vacante,
            "compatibility_score": np.random.uniform(85.0, 99.0)
        })
        
        # Medio match
        mitad = skills_vacante[:max(1, len(skills_vacante)//2)]
        datos_combinados.append({
            "vacante_id": row['JobID'],
            "vacante_texto": f"{row['Title']} {row['Responsibilities']} {row['Skills']}",
            "vacante_skills": skills_vacante,
            "estudiante_texto": "INGENIERÍA EN SOFTWARE Estudiante universitario proactivo interesado en el área de tecnología y desarrollo. Conocimientos teóricos.",
            "estudiante_skills": mitad if mitad else ["Lógica de programación"],
            "compatibility_score": np.random.uniform(45.0, 65.0)
        })
        
        # Bajo match
        datos_combinados.append({
            "vacante_id": row['JobID'],
            "vacante_texto": f"{row['Title']} {row['Responsibilities']} {row['Skills']}",
            "vacante_skills": skills_vacante,
            "estudiante_texto": "ADMINISTRACIÓN DE EMPRESAS Experiencia en atención al cliente, gestión de inventarios comerciales y hojas de cálculo.",
            "estudiante_skills": ["Excel", "Contabilidad"],
            "compatibility_score": np.random.uniform(5.0, 25.0)
        })
    return pd.DataFrame(datos_combinados)

# ==========================================
# 4. EXTRACCIÓN DE FEATURES MULTI-MÉTRICA (FILTRADO V2)
# ==========================================
def construir_features_semanticas(df_interacciones):
    df_interacciones['vacante_limpio'] = df_interacciones['vacante_texto'].apply(limpiar_texto)
    df_interacciones['estudiante_limpio'] = df_interacciones['estudiante_texto'].apply(limpiar_texto)
    
    embs_vacantes = embedding_model.encode(df_interacciones['vacante_limpio'].tolist(), convert_to_numpy=True)
    embs_estudiantes = embedding_model.encode(df_interacciones['estudiante_limpio'].tolist(), convert_to_numpy=True)
    
    features_X = []
    for i in range(len(df_interacciones)):
        emb_v = embs_vacantes[i]
        emb_e = embs_estudiantes[i]
        
        # 1. Similitud Coseno (Métrica de dirección semántica - inmune a longitud)
        sim_coseno = cosine_similarity([emb_e], [emb_v])[0][0]
        
        # 2. Diferencia Vectorial (Operación componente a componente entre embeddings)
        diff_vectorial = np.abs(emb_e - emb_v)
        
        # Se remueven dist_euclidiana y dist_manhattan para mitigar falsos positivos por ruido léxico
        
        # 3. Match Léxico basado en Skills
        sk_vac = set([s.lower() for s in df_interacciones.iloc[i]['vacante_skills']])
        sk_est = set([s.lower() for s in df_interacciones.iloc[i]['estudiante_skills']])
        
        skill_match_score = (len(sk_est.intersection(sk_vac)) / max(1, len(sk_vac))) * 100
        skill_complementarity_score = (len(sk_vac.difference(sk_est)) / max(1, len(sk_vac))) * 100
        
        # Construcción del vector final para esta fila
        vector_fila = np.concatenate([
            [sim_coseno], 
            diff_vectorial, 
            [skill_match_score, skill_complementarity_score]
        ])
        features_X.append(vector_fila)
        
    return np.array(features_X, dtype=np.float32), df_interacciones['compatibility_score'].values

# ==========================================
# 5. ENTRENAMIENTO SVR
# ==========================================
def entrenar_modelo_svr(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    print("Entrenando regresor SVR (Kernel RBF) sin métricas absolutas...")
    # C=20 e epsilon=0.1 optimizados para generalización en altas dimensiones
    model = SVR(kernel='rbf', C=20.0, epsilon=0.1)
    model.fit(X_train_scaled, y_train)
    
    preds = model.predict(X_test_scaled)
    r2 = r2_score(y_test, preds)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    
    print("\n=============================================")
    print("        MÉTRICAS DE EVALUACIÓN SVR V2        ")
    print("=============================================")
    print(f"R² Score (Precisión General) : {r2:.4f}")
    print(f"RMSE (Margen de Error)       : {rmse:.4f}%")
    print("=============================================")
    
    # Consolidado a la carpeta de la versión 2 (svr2)
    os.makedirs("../modelos_entrenados/svr2", exist_ok=True)
    joblib.dump(model, "../modelos_entrenados/svr2/pivipp_svr.pkl")
    joblib.dump(scaler, "../modelos_entrenados/svr2/pivipp_svr_scaler.pkl")
    print("¡Modelo SVR V2 guardado exitosamente!")

if __name__ == "__main__":
    path_dataset = r"D:\TESIS\prototipo\Tesis-prototipo\nlp_engine\data\job_dataset.csv"
    if os.path.exists(path_dataset):
        df = cargar_y_explorar_datos(path_dataset).head(1000)
        df_int = generar_dataset_hibrido(df)
        X, y = construir_features_semanticas(df_int)
        entrenar_modelo_svr(X, y)
    else:
        print(f"Error: No se encontró el dataset en la ruta especificada: {path_dataset}")