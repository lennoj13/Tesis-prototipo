import os
import re
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from xgboost import XGBRegressor 
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# ==========================================
# 1. CONFIGURACIÓN Y CARGA DE MODELOS NLP
# ==========================================
print("Cargando modelo de embeddings semánticos para XGBoost V2...")
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
        
        # Asignamos un ID único por estudiante para agrupar en la evaluación de ranking
        estudiante_id = f"EST_{idx}"
        
        # 1. Alto match
        datos_combinados.append({
            "estudiante_id": estudiante_id,
            "vacante_id": row['JobID'],
            "vacante_texto": f"{row['Title']} {row['Responsibilities']} {row['Skills']}",
            "vacante_skills": skills_vacante,
            "estudiante_texto": f"INGENIERÍA EN SOFTWARE Estudiante de los últimos semestres con sólida experiencia práctica trabajando en proyectos orientados a {row['Title']}. Capacidad para asumir responsabilidades tales como {row['Responsibilities'].replace(';', ', ')}.",
            "estudiante_skills": skills_vacante,
            "compatibility_score": np.random.uniform(85.0, 99.0)
        })
        
        # 2. Medio match
        mitad = skills_vacante[:max(1, len(skills_vacante)//2)]
        datos_combinados.append({
            "estudiante_id": estudiante_id,
            "vacante_id": row['JobID'],
            "vacante_texto": f"{row['Title']} {row['Responsibilities']} {row['Skills']}",
            "vacante_skills": skills_vacante,
            "estudiante_texto": "INGENIERÍA EN SOFTWARE Estudiante universitario proactivo interesado en el área de tecnología y desarrollo. Conocimientos teóricos.",
            "estudiante_skills": mitad if mitad else ["Lógica de programación"],
            "compatibility_score": np.random.uniform(45.0, 65.0)
        })
        
        # 3. Bajo match
        datos_combinados.append({
            "estudiante_id": estudiante_id,
            "vacante_id": row['JobID'],
            "vacante_texto": f"{row['Title']} {row['Responsibilities']} {row['Skills']}",
            "vacante_skills": skills_vacante,
            "estudiante_texto": "ADMINISTRACIÓN DE EMPRESAS Experiencia en atención al cliente, gestión de inventarios comerciales y hojas de cálculo.",
            "estudiante_skills": ["Excel", "Contabilidad"],
            "compatibility_score": np.random.uniform(5.0, 25.0)
        })
    return pd.DataFrame(datos_combinados)

# ==========================================
# 4. EXTRACCIÓN DE FEATURES MULTI-MÉTRICA
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
        
        # 1. Similitud Coseno
        sim_coseno = cosine_similarity([emb_e], [emb_v])[0][0]
        
        # 2. Diferencia Vectorial
        diff_vectorial = np.abs(emb_e - emb_v)
        
        # 3. Match Léxico basado en Skills
        sk_vac = set([s.lower() for s in df_interacciones.iloc[i]['vacante_skills']])
        sk_est = set([s.lower() for s in df_interacciones.iloc[i]['estudiante_skills']])
        
        skill_match_score = (len(sk_est.intersection(sk_vac)) / max(1, len(sk_vac))) * 100
        skill_complementarity_score = (len(sk_vac.difference(sk_est)) / max(1, len(sk_vac))) * 100
        
        vector_fila = np.concatenate([
            [sim_coseno], 
            diff_vectorial, 
            [skill_match_score, skill_complementarity_score]
        ])
        features_X.append(vector_fila)
        
    return np.array(features_X, dtype=np.float32), df_interacciones

# ==========================================
# 5. MÓDULO DE EVALUACIÓN DE SISTEMAS DE RECOMENDACIÓN
# ==========================================
def calcular_metricas_ranking(df_eval, score_corte_relevancia=70.0, k=3):
    """
    Calcula Precision@K, Recall@K, MRR y NDCG@K controlando dinámicamente la forma de los arreglos.
    """
    precisions, recalls, mrrs, ndcgs = [], [], [], []

    grupos = df_eval.groupby('estudiante_id')
    
    for _, group in grupos:
        # Ordenar recomendaciones según predicción descendente
        group_sorted = group.sort_values(by='pred_score', ascending=False)
        
        # Vector binario de relevancia real
        relevancia_real = (group_sorted['compatibility_score'] >= score_corte_relevancia).values.astype(int)
        
        total_relevantes = np.sum(group['compatibility_score'] >= score_corte_relevancia)
        if total_relevantes == 0:
            continue
            
        # Tomar top K
        rel_k = relevancia_real[:k]
        actual_k = len(rel_k)  # Malla de seguridad para sub-muestras menores a K
        
        if actual_k == 0:
            continue
            
        # 1. Precision@K
        p_at_k = np.sum(rel_k) / actual_k
        precisions.append(p_at_k)
        
        # 2. Recall@K
        r_at_k = np.sum(rel_k) / total_relevantes
        recalls.append(r_at_k)
        
        # 3. Mean Reciprocal Rank (MRR)
        primer_relevante_idx = np.where(relevancia_real == 1)[0]
        if len(primer_relevante_idx) > 0:
            mrr = 1.0 / (primer_relevante_idx[0] + 1)
        else:
            mrr = 0.0
        mrrs.append(mrr)
        
        # 4. NDCG@K dinámico segun tamaño de rel_k
        discounts = np.log2(np.arange(2, actual_k + 2))
        dcg = np.sum((2**rel_k - 1) / discounts)
        
        ideal_rel = np.sort(relevancia_real)[::-1][:actual_k]
        idcg = np.sum((2**ideal_rel - 1) / discounts)
        
        ndcg = (dcg / idcg) if idcg > 0 else 0.0
        ndcgs.append(ndcg)
        
    return {
        f"Precision@{k}": np.mean(precisions) if precisions else 0.0,
        f"Recall@{k}": np.mean(recalls) if recalls else 0.0,
        "MRR": np.mean(mrrs) if mrrs else 0.0,
        f"NDCG@{k}": np.mean(ndcgs) if ndcgs else 0.0
    }

# ==========================================
# 6. ENTRENAMIENTO Y EVALUACIÓN XGBOOST
# ==========================================
def entrenar_modelo_xgboost(X, df_interacciones):
    y = df_interacciones['compatibility_score'].values
    indices = np.arange(len(df_interacciones))
    
    X_train, X_test, y_train, y_test, idx_train, idx_test = train_test_split(
        X, y, indices, test_size=0.2, random_state=42
    )
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    print("Entrenando regresor XGBoost V2 sin métricas de magnitud absoluta...")
    model = XGBRegressor(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=42, n_jobs=-1)
    model.fit(X_train_scaled, y_train)
    
    preds_test = model.predict(X_test_scaled)
    
    r2 = r2_score(y_test, preds_test)
    rmse = np.sqrt(mean_squared_error(y_test, preds_test))
    
    df_test = df_interacciones.iloc[idx_test].copy()
    df_test['pred_score'] = preds_test
    
    metricas_ranking = calcular_metricas_ranking(df_test, score_corte_relevancia=70.0, k=3)
    
    print("\n=============================================")
    print("      MÉTRICAS DE EVALUACIÓN XGBOOST V3      ")
    print("=============================================")
    print("--- Regresión ---")
    print(f"R² Score (Precisión General) : {r2:.4f}")
    print(f"RMSE (Margen de Error)       : {rmse:.4f}%")
    print("\n--- Sistema de Recomendación (Ranking @K=3) ---")
    print(f"Precision@3                  : {metricas_ranking['Precision@3']:.4f}")
    print(f"Recall@3                     : {metricas_ranking['Recall@3']:.4f}")
    print(f"MRR (Mean Reciprocal Rank)   : {metricas_ranking['MRR']:.4f}")
    print(f"NDCG@3                       : {metricas_ranking['NDCG@3']:.4f}")
    print("=============================================")
    
    os.makedirs("../modelos_entrenados/xgboost3", exist_ok=True)
    joblib.dump(model, "../modelos_entrenados/xgboost3/pivipp_xgboost.pkl")
    joblib.dump(scaler, "../modelos_entrenados/xgboost3/pivipp_xgboost_scaler.pkl")
    print("¡Modelo XGBoost V3 guardado exitosamente!")

if __name__ == "__main__":
    path_dataset = r"D:\TESIS\prototipo\Tesis-prototipo\nlp_engine\data\job_dataset.csv"
    if os.path.exists(path_dataset):
        df = cargar_y_explorar_datos(path_dataset).head(1000)
        df_int = generar_dataset_hibrido(df)
        X, df_interacciones = construir_features_semanticas(df_int)
        entrenar_modelo_xgboost(X, df_interacciones)
    else:
        print(f"Error: No se encontró el dataset en la ruta especificada: {path_dataset}")