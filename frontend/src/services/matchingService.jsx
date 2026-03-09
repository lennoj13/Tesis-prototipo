import api from './api';

/**
 * Servicio de matching bidireccional — conecta con Flask /matching
 */
const matchingService = {
  /** Obtener candidatos con afinidad para las vacantes de una empresa */
  getCandidates: async (companyId) => {
    const response = await api.get(`/matching/candidates?company_id=${companyId}`);
    return response.data;
  },
};

export default matchingService;
