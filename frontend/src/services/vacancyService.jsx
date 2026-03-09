import api from './api';

/**
 * Servicio de vacantes — conecta con Flask /vacancies
 */
const vacancyService = {
  /** Obtener todas las vacantes activas */
  getAll: async () => {
    const response = await api.get('/vacancies');
    return response.data;
  },

  /** Obtener vacantes de una empresa específica */
  getByCompany: async (companyId) => {
    const response = await api.get(`/vacancies?company_id=${companyId}`);
    return response.data;
  },

  /** Obtener detalle de una vacante */
  getById: async (vacancyId) => {
    const response = await api.get(`/vacancies?vacancy_id=${vacancyId}`);
    return response.data;
  },

  /** Crear nueva vacante (solo empresas) */
  create: async (vacancyData) => {
    const response = await api.post('/vacancies', vacancyData);
    return response.data;
  },

  /** Actualizar vacante */
  update: async (vacancyId, vacancyData) => {
    const response = await api.put(`/vacancies/${vacancyId}`, vacancyData);
    return response.data;
  },

  /** Eliminar vacante */
  delete: async (vacancyId) => {
    const response = await api.delete(`/vacancies/${vacancyId}`);
    return response.data;
  },

  /** Obtener catálogo (modalidades, skills) */
  getCatalog: async () => {
    const response = await api.get('/vacancies/catalog');
    return response.data;
  },
};

export default vacancyService;
