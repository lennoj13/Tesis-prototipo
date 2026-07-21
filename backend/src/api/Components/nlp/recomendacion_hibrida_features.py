import re
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def limpiar_texto_hibrido(texto):
    """Normaliza texto con la misma lógica usada para el entrenamiento."""
    if not isinstance(texto, str):
        return ''
    texto = texto.lower()
    texto = re.sub(re.compile(r'[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]'), ' ', texto)
    texto = re.sub(r'\s+', ' ', texto).strip()
    return texto


def construir_vector_features(emb_estudiante, emb_vacante, skills_est, skills_vac):
    """Construye el vector de features del motor híbrido."""
    sim_coseno = cosine_similarity([emb_estudiante], [emb_vacante])[0][0]
    diff_vectorial = np.abs(emb_estudiante - emb_vacante)

    sk_est = set([s.lower().strip() for s in skills_est if s])
    sk_vac = set([s.lower().strip() for s in skills_vac if s])

    if len(sk_vac) > 0:
        skill_match_score = (len(sk_est.intersection(sk_vac)) / len(sk_vac)) * 100
        skill_complementarity_score = (len(sk_vac.difference(sk_est)) / len(sk_vac)) * 100
    else:
        skill_match_score = 0.0
        skill_complementarity_score = 0.0

    vector_completo = np.concatenate([
        [sim_coseno],
        diff_vectorial,
        [skill_match_score, skill_complementarity_score]
    ])

    return vector_completo, sim_coseno, skill_match_score, skill_complementarity_score