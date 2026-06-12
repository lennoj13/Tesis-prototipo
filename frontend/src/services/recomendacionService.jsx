import api from './api';

/**
 * Servicio de recomendación IA — conecta con Flask /recomendacion
 * Usa el motor NLP (XGBoost + SentenceTransformer) para calcular
 * porcentajes de afinidad entre el estudiante y las vacantes.
 */
const recomendacionService = {
  /** Obtener vacantes con porcentaje de afinidad calculado por IA */
  getRecomendaciones: async () => {
    const response = await api.get('/recomendacion/vacantes');
    return response.data;
  },
};

export default recomendacionService;
