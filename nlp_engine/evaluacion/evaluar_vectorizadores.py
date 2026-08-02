import os
import re
import numpy as np
import pandas as pd
from scipy import stats

# Librerías de ML y NLP
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import KFold
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVR
from sklearn.metrics import mean_squared_error, r2_score

# Modelos
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from gensim.models import Word2Vec
from sentence_transformers import SentenceTransformer
import tensorflow_hub as hub

# ==========================================
# 1. FUNCIONES DE CARGA Y LIMPIEZA DE DATOS
# ==========================================
def limpiar_texto(texto):
    if not isinstance(texto, str):
        return ""
    texto = texto.lower()
    texto = re.sub(r'[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]', ' ', texto)
    return re.sub(r'\s+', ' ', texto).strip()

def cargar_y_explorar_datos(path_csv):
    df = pd.read_csv(path_csv)
    df['Title'] = df['Title'].fillna('Pasante de Tecnología')
    df['Skills'] = df['Skills'].fillna('')
    df['Responsibilities'] = df['Responsibilities'].fillna('')
    return df

def generar_dataset_hibrido(df_vacantes):
    datos_combinados = []
    for idx, row in df_vacantes.iterrows():
        skills_vacante = [s.strip() for s in row['Skills'].split(';') if s.strip()]
        estudiante_id = f"EST_{idx}"
        
        # 1. Alto match
        datos_combinados.append({
            "estudiante_id": estudiante_id,
            "vacante_id": row['JobID'],
            "vacante_texto": f"{row['Title']} {row['Responsibilities']} {row['Skills']}",
            "vacante_skills": skills_vacante,
            "estudiante_texto": f"INGENIERÍA EN SOFTWARE Estudiante con experiencia práctica en {row['Title']}. Funciones: {row['Responsibilities'].replace(';', ', ')}.",
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
            "estudiante_texto": "INGENIERÍA EN SOFTWARE Estudiante interesado en tecnología y desarrollo de sistemas.",
            "estudiante_skills": mitad if mitad else ["Lógica de programación"],
            "compatibility_score": np.random.uniform(45.0, 65.0)
        })
        # 3. Bajo match
        datos_combinados.append({
            "estudiante_id": estudiante_id,
            "vacante_id": row['JobID'],
            "vacante_texto": f"{row['Title']} {row['Responsibilities']} {row['Skills']}",
            "vacante_skills": skills_vacante,
            "estudiante_texto": "ADMINISTRACIÓN DE EMPRESAS Experiencia en atención al cliente e inventarios.",
            "estudiante_skills": ["Excel", "Contabilidad"],
            "compatibility_score": np.random.uniform(5.0, 25.0)
        })
    return pd.DataFrame(datos_combinados)

# ==========================================
# 2. EXTRACTORES DE FEATURES POR TÉCNICA
# ==========================================
def construir_matriz_features(vecs_v, vecs_e, df_int):
    features = []
    for i in range(len(df_int)):
        emb_v, emb_e = vecs_v[i], vecs_e[i]
        sim_cos = cosine_similarity([emb_e], [emb_v])[0][0]
        diff_v = np.abs(emb_e - emb_v)
        
        sk_vac = set([s.lower() for s in df_int.iloc[i]['vacante_skills']])
        sk_est = set([s.lower() for s in df_int.iloc[i]['estudiante_skills']])
        sk_match = (len(sk_est.intersection(sk_vac)) / max(1, len(sk_vac))) * 100
        sk_comp = (len(sk_vac.difference(sk_est)) / max(1, len(sk_vac))) * 100
        
        row = np.concatenate([[sim_cos], diff_v, [sk_match, sk_comp]])
        features.append(row)
    return np.array(features, dtype=np.float32)

# 2.1. TF-IDF
def extraer_tfidf(df_int):
    print("-> Extrayendo con TF-IDF...")
    tfidf = TfidfVectorizer(max_features=300)
    todos = list(df_int['vacante_limpio']) + list(df_int['estudiante_limpio'])
    tfidf.fit(todos)
    return construir_matriz_features(
        tfidf.transform(df_int['vacante_limpio']).toarray(),
        tfidf.transform(df_int['estudiante_limpio']).toarray(),
        df_int
    )

# 2.2. Word2Vec (Promedio Ponderado)
def extraer_word2vec(df_int):
    print("-> Extrayendo con Word2Vec (Mean Vector)...")
    sentences = [doc.split() for doc in list(df_int['vacante_limpio']) + list(df_int['estudiante_limpio'])]
    w2v = Word2Vec(sentences=sentences, vector_size=100, window=5, min_count=1, workers=4, seed=42)
    
    def get_doc_vector(text):
        tokens = text.split()
        vecs = [w2v.wv[w] for w in tokens if w in w2v.wv]
        return np.mean(vecs, axis=0) if len(vecs) > 0 else np.zeros(100)
    
    vecs_v = np.array([get_doc_vector(t) for t in df_int['vacante_limpio']])
    vecs_e = np.array([get_doc_vector(t) for t in df_int['estudiante_limpio']])
    return construir_matriz_features(vecs_v, vecs_e, df_int)

# 2.3. Doc2Vec
def extraer_doc2vec(df_int):
    print("-> Extrayendo con Doc2Vec...")
    corpus = [TaggedDocument(words=doc.split(), tags=[str(i)]) 
              for i, doc in enumerate(list(df_int['vacante_limpio']) + list(df_int['estudiante_limpio']))]
    d2v = Doc2Vec(corpus, vector_size=100, window=5, min_count=1, workers=4, epochs=20, seed=42)
    vecs_v = np.array([d2v.infer_vector(t.split()) for t in df_int['vacante_limpio']])
    vecs_e = np.array([d2v.infer_vector(t.split()) for t in df_int['estudiante_limpio']])
    return construir_matriz_features(vecs_v, vecs_e, df_int)

# 2.4. Universal Sentence Encoder (USE)
def extraer_use(df_int):
    print("-> Extrayendo con Universal Sentence Encoder (USE)...")
    use_model = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")
    vecs_v = use_model(df_int['vacante_limpio'].tolist()).numpy()
    vecs_e = use_model(df_int['estudiante_limpio'].tolist()).numpy()
    return construir_matriz_features(vecs_v, vecs_e, df_int)

# 2.5. Sentence-BERT
def extraer_sbert(df_int):
    print("-> Extrayendo con Sentence-BERT (all-MiniLM-L6-v2)...")
    sbert = SentenceTransformer("all-MiniLM-L6-v2")
    vecs_v = sbert.encode(df_int['vacante_limpio'].tolist(), convert_to_numpy=True)
    vecs_e = sbert.encode(df_int['estudiante_limpio'].tolist(), convert_to_numpy=True)
    return construir_matriz_features(vecs_v, vecs_e, df_int)

# ==========================================
# 3. MÉTRICAS DE RANKING
# ==========================================
def calcular_metricas_ranking(df_eval, score_corte=70.0, k=3):
    precisions, recalls, mrrs, ndcgs = [], [], [], []
    for _, group in df_eval.groupby('estudiante_id'):
        group_sorted = group.sort_values(by='pred_score', ascending=False)
        relevancia_real = (group_sorted['compatibility_score'] >= score_corte).values.astype(int)
        total_relevantes = np.sum(group['compatibility_score'] >= score_corte)
        if total_relevantes == 0: continue
            
        rel_k = relevancia_real[:k]
        actual_k = len(rel_k)
        if actual_k == 0: continue
            
        # precisions.append(np.sum(rel_k) / actual_k)
        max_posibles_relevantes = min(k, total_relevantes)
        precisions.append(np.sum(rel_k) / max_posibles_relevantes)

        recalls.append(np.sum(rel_k) / total_relevantes)
        p_idx = np.where(relevancia_real == 1)[0]
        mrrs.append(1.0 / (p_idx[0] + 1) if len(p_idx) > 0 else 0.0)
        
        discounts = np.log2(np.arange(2, actual_k + 2))
        dcg = np.sum((2**rel_k - 1) / discounts)
        ideal_rel = np.sort(relevancia_real)[::-1][:actual_k]
        idcg = np.sum((2**ideal_rel - 1) / discounts)
        ndcgs.append(dcg / idcg if idcg > 0 else 0.0)
        
    return {
        f"Precision@{k}": np.mean(precisions),
        f"Recall@{k}": np.mean(recalls),
        "MRR": np.mean(mrrs),
        f"NDCG@{k}": np.mean(ndcgs)
    }

# ==========================================
# 4. PRUEBA ESTADÍSTICA (FRIEDMAN + WILCOXON)
# ==========================================
def ejecutar_prueba_estadistica(errores_dict):
    print("\n========================================================")
    print("        EVALUACIÓN ESTADÍSTICA      ")
    print("========================================================")
    
    modelos = list(errores_dict.keys())
    matriz_errores = [errores_dict[m] for m in modelos]
    
    # Test de Friedman
    stat_f, p_val_f = stats.friedmanchisquare(*matriz_errores)
    print(f"Prueba de Friedman: Estadístico = {stat_f:.4f}, p-value = {p_val_f:.4e}")
    
    if p_val_f < 0.05:
        print("Resultado: Diferencias estadísticamente significativas (p < 0.05).")
        print("\nComparación Post-hoc (Wilcoxon Signed-Rank Test vs. Sentence-BERT):")
        
        sbert_err = errores_dict["Sentence-BERT (MiniLM)"]
        num_comparaciones = len(modelos) - 1
        alpha_bonferroni = 0.05 / num_comparaciones
        
        for m in modelos:
            if m == "Sentence-BERT (MiniLM)": continue
            stat_w, p_val_w = stats.wilcoxon(sbert_err, errores_dict[m])
            significativo = "SÍ" if p_val_w < alpha_bonferroni else "NO"
            print(f" - Sentence-BERT vs {m:25s} | p-val: {p_val_w:.4e} | Dif. Significativa (α={alpha_bonferroni:.4f}): {significativo}")
    else:
        print("Resultado: No existen diferencias estadísticamente significativas entre los modelos.")

# ==========================================
# 5. EJECUCIÓN DEL BENCHMARK
# ==========================================
if __name__ == "__main__":
    path_dataset = r"D:\TESIS\prototipo\Tesis-prototipo\nlp_engine\data\job_dataset.csv"
    
    if os.path.exists(path_dataset):
        df_raw = cargar_y_explorar_datos(path_dataset).head(1000)
        df_int = generar_dataset_hibrido(df_raw)
        df_int['vacante_limpio'] = df_int['vacante_texto'].apply(limpiar_texto)
        df_int['estudiante_limpio'] = df_int['estudiante_texto'].apply(limpiar_texto)
        
        tecnicas = {
            "TF-IDF + Coseno": extraer_tfidf(df_int),
            "Word2Vec (Promedio)": extraer_word2vec(df_int),
            "Doc2Vec": extraer_doc2vec(df_int),
            "Universal Sentence Enc.": extraer_use(df_int),
            "Sentence-BERT (MiniLM)": extraer_sbert(df_int)
        }
        
        y = df_int['compatibility_score'].values
        
        # Validación Cruzada K-Fold para recolectar residuos para la prueba estadística
        kf = KFold(n_splits=5, shuffle=True, random_state=42)
        
        resultados_comparativos = []
        errores_absolutos = {nombre: [] for nombre in tecnicas.keys()}
        
        for nombre, X_data in tecnicas.items():
            r2_list, rmse_list = [], []
            df_test_acumulado = []
            
            for train_idx, test_idx in kf.split(X_data):
                X_tr, X_te = X_data[train_idx], X_data[test_idx]
                y_tr, y_te = y[train_idx], y[test_idx]
                
                scaler = StandardScaler()
                X_tr_s = scaler.fit_transform(X_tr)
                X_te_s = scaler.transform(X_te)
                
                model = SVR(kernel='rbf', C=20.0, epsilon=0.1)
                model.fit(X_tr_s, y_tr)
                
                preds = model.predict(X_te_s)
                
                # Guardar errores absolutos para el test estadístico
                errores_absolutos[nombre].extend(np.abs(y_te - preds))
                
                r2_list.append(r2_score(y_te, preds))
                rmse_list.append(np.sqrt(mean_squared_error(y_te, preds)))
                
                df_fold = df_int.iloc[test_idx].copy()
                df_fold['pred_score'] = preds
                df_test_acumulado.append(df_fold)
                
            df_eval_total = pd.concat(df_test_acumulado)
            ranking_m = calcular_metricas_ranking(df_eval_total, score_corte=70.0, k=3)
            
            resultados_comparativos.append({
                "Técnica NLP": nombre,
                "R2 Promedio": round(np.mean(r2_list), 4),
                "RMSE (%)": round(np.mean(rmse_list), 4),
                "Precision@3": round(ranking_m["Precision@3"], 4),
                "Recall@3": round(ranking_m["Recall@3"], 4),
                "MRR": round(ranking_m["MRR"], 4),
                "NDCG@3": round(ranking_m["NDCG@3"], 4)
            })
            
        df_res = pd.DataFrame(resultados_comparativos)
        print("\n========================================================")
        print("          TABLA COMPARATIVA DE VECTORIZADORES (SVR)      ")
        print("========================================================")
        print(df_res.to_string(index=False))
        
        # Ejecutar análisis estadístico de significancia
        ejecutar_prueba_estadistica(errores_absolutos)