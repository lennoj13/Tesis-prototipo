import os
import joblib
from sentence_transformers import SentenceTransformer
from ....utils.general.logs import HandleLogs

def cargar_modelos_hibridos():
    """Carga los modelos del motor híbrido una sola vez."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(base_dir, '..', '..', '..', '..', '..'))
    nlp_dir = os.path.join(project_root, 'nlp_engine')

    model_path = os.path.join(nlp_dir, 'modelos_entrenados', 'xgboost2', 'pivipp_xgboost.pkl')
    scaler_path = os.path.join(nlp_dir, 'modelos_entrenados', 'xgboost2', 'pivipp_xgboost_scaler.pkl')

    HandleLogs.write_log('[NLP] Cargando modelo XGBoost y scaler')
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)

    svr_model_path = os.path.join(nlp_dir, 'modelos_entrenados', 'svr2', 'pivipp_svr.pkl')
    svr_scaler_path = os.path.join(nlp_dir, 'modelos_entrenados', 'svr2', 'pivipp_svr_scaler.pkl')
    
    HandleLogs.write_log('[NLP] Cargando modelo SVR y scaler')
    svr_model = joblib.load(svr_model_path)
    svr_scaler = joblib.load(svr_scaler_path)

    #Usar el modelo desde el entorno local
    sbert_path = os.path.join(nlp_dir, 'modelos_entrenados', 'sentence_transformers', 'all-MiniLM-L6-v2')
    try:
        HandleLogs.write_log('[NLP] Cargando SentenceTransformer (all-MiniLM-L6-v2) local para embeddings')
        embedding_model = SentenceTransformer(sbert_path)
    except Exception as e:    
        #Usar el modelo desde Hugging Face en linea
        HandleLogs.write_log(f'[NLP] Error al cargar el modelo local: {e}')
        HandleLogs.write_log(f'[NLP] Cargando SentenceTransformer en linea')
        embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    HandleLogs.write_log('[NLP] Modelos cargados exitosamente.')
    return model, scaler, svr_model, svr_scaler, embedding_model