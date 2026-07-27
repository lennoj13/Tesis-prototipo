from sentence_transformers import SentenceTransformer
import os
dir = os.path.dirname(os.path.abspath(__file__))
Base = os.path.dirname(os.path.dirname(dir))
destino = os.path.join(Base, "nlp_engine", "modelos_entrenados", "sentence_transformers", "all-MiniLM-L6-v2")

if os.path.exists(destino) and len(os.listdir(destino)) > 0:
    print(f"El modelo ya existe en: {destino}")
else:
    print(f"Descargando el modelo localmente en: {destino}")
    os.makedirs(destino, exist_ok=True)

    model = SentenceTransformer('all-MiniLM-L6-v2')
    model.save(destino)
    print(f"Modelo guardado en: {destino}")