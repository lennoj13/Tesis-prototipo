import sys
import os
import joblib
import numpy as np
import warnings
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.spatial.distance import euclidean, cityblock

warnings.filterwarnings('ignore')

sys.path.append(r"c:\Users\Usuario\Desktop\Tesis prototipo\backend")
from src.api.Components.recomendacion_component import RecomendacionComponent

def generar_features(texto_vacante, texto_estudiante, skills_vacante, skills_estudiante, embedding_model):
    tv_limpio = RecomendacionComponent._limpiar_texto(texto_vacante + ' ' + ' '.join(skills_vacante))
    te_limpio = RecomendacionComponent._limpiar_texto(texto_estudiante + ' ' + ' '.join(skills_estudiante))
    
    emb_v = embedding_model.encode([tv_limpio], convert_to_numpy=True, normalize_embeddings=True)[0]
    emb_e = embedding_model.encode([te_limpio], convert_to_numpy=True, normalize_embeddings=True)[0]
    
    sim_coseno = cosine_similarity([emb_e], [emb_v])[0][0]
    diff_vectorial = np.abs(emb_e - emb_v)
    dist_euclidiana = euclidean(emb_e, emb_v)
    dist_manhattan = cityblock(emb_e, emb_v)
    
    set_v = set([s.lower() for s in skills_vacante])
    set_e = set([s.lower() for s in skills_estudiante])
    
    skill_match_score = (len(set_e.intersection(set_v)) / max(1, len(set_v))) * 100
    skill_complementarity_score = (len(set_v.difference(set_e)) / max(1, len(set_v))) * 100
    
    vector = np.concatenate([
        [sim_coseno],
        diff_vectorial,
        [dist_euclidiana, dist_manhattan],
        [skill_match_score, skill_complementarity_score]
    ])
    return vector, sim_coseno, skill_match_score

def ejecutar_prueba():
    print("=== CARGANDO MODELOS ===")
    base_dir = r"c:\Users\Usuario\Desktop\Tesis prototipo\nlp_engine\modelos_entrenados"
    
    # Random Forest
    rf_model = joblib.load(os.path.join(base_dir, "model2_random_forest.pkl"))
    rf_scaler = joblib.load(os.path.join(base_dir, "model2_scaler.pkl"))
    
    # SVR
    try:
        svr_model = joblib.load(os.path.join(base_dir, "svr", "pivipp_svr.pkl"))
        svr_scaler = joblib.load(os.path.join(base_dir, "svr", "pivipp_svr_scaler.pkl"))
        has_svr = True
    except:
        has_svr = False
        print("SVR model not found. Skipping SVR.")
        
    # XGBoost
    xgb_model = joblib.load(os.path.join(base_dir, "xgboost", "pivipp_xgboost.pkl"))
    xgb_scaler = joblib.load(os.path.join(base_dir, "xgboost", "pivipp_xgboost_scaler.pkl"))
    
    emb_model = SentenceTransformer("all-MiniLM-L6-v2")
    
    escenarios = [
        {
            "nombre": "1. El Especialista (Match Perfecto)",
            "vac_texto": "Buscamos Desarrollador Python Backend con conocimientos en bases de datos relacionales y diseño de APIs REST.",
            "vac_skills": ["Python", "SQL", "Django"],
            "est_texto": "Soy Desarrollador Python Backend enfocado en crear arquitecturas robustas, bases de datos relacionales y diseño de APIs REST.",
            "est_skills": ["Python", "SQL", "Django"]
        },
        {
            "nombre": "2. El Generalista (Sinónimos y Ruido)",
            "vac_texto": "Buscamos Desarrollador Python Backend con conocimientos en bases de datos relacionales y diseño de APIs REST.",
            "vac_skills": ["Python", "SQL", "Django"],
            "est_texto": "Me dedico a la programación de servidores y creación de servicios web robustos. Además, tengo experiencia diseñando interfaces atractivas, aplicaciones en Flutter, marketing digital y cocina.",
            "est_skills": ["Python", "SQL", "Django", "Flutter", "CSS", "Photoshop", "Marketing"]
        },
        {
            "nombre": "3. La Trampa (Texto Basura, Skills Perfectos)",
            "vac_texto": "Buscamos Desarrollador Python Backend con conocimientos en bases de datos relacionales y diseño de APIs REST.",
            "vac_skills": ["Python", "SQL", "Django"],
            "est_texto": "asdfasdf qwerty uiop zxcvbnm ffsdddddddddd rrrrrr wtf",
            "est_skills": ["Python", "SQL", "Django"]
        },
        {
            "nombre": "4. El Teórico (Texto Perfecto, 0 Skills)",
            "vac_texto": "Buscamos Desarrollador Python Backend con conocimientos en bases de datos relacionales y diseño de APIs REST.",
            "vac_skills": ["Python", "SQL", "Django"],
            "est_texto": "Soy Desarrollador Python Backend enfocado en crear arquitecturas robustas, bases de datos relacionales y diseño de APIs REST.",
            "est_skills": []
        }
    ]
    
    print("\n" + "="*80)
    print(f"{'ESCENARIO':<45} | {'XGBOOST':<8} | {'R-FOREST':<8} | {'SVR':<8} | {'COSENO':<8}")
    print("="*80)
    
    for e in escenarios:
        vec, sim_coseno, skill_match = generar_features(
            e['vac_texto'], e['est_texto'], e['vac_skills'], e['est_skills'], emb_model
        )
        
        X_inf = np.array([vec], dtype=np.float32)
        
        # Predicción XGBoost
        p_xgb = float(xgb_model.predict(xgb_scaler.transform(X_inf))[0])
        p_xgb = max(0.0, min(100.0, p_xgb))
        
        # Predicción Random Forest
        p_rf = float(rf_model.predict(rf_scaler.transform(X_inf))[0])
        p_rf = max(0.0, min(100.0, p_rf))
        
        # Predicción SVR
        p_svr = 0.0
        if has_svr:
            p_svr = float(svr_model.predict(svr_scaler.transform(X_inf))[0])
            p_svr = max(0.0, min(100.0, p_svr))
            
        print(f"{e['nombre']:<45} | {p_xgb:>6.2f}% | {p_rf:>6.2f}% | {p_svr:>6.2f}% | {sim_coseno:>6.2f}")

    print("="*80)

if __name__ == '__main__':
    ejecutar_prueba()
