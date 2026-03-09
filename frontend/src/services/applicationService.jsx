import api from './api';

/**
 * Servicio de postulaciones — conecta con Flask /applications
 */
const applicationService = {
  /** Crear nueva postulación */
  apply: async (vacancyId, matchPercentage = 0) => {
    const response = await api.post('/applications', {
      vacancy_id: vacancyId,
      match_percentage: matchPercentage,
    });
    return response.data;
  },

  /** Obtener postulaciones del estudiante autenticado */
  getMyApplications: async (studentId) => {
    const url = studentId 
      ? `/applications?student_id=${studentId}` 
      : '/applications';
    const response = await api.get(url);
    return response.data;
  },

  /** Obtener postulantes de una vacante (para empresas) */
  getByVacancy: async (vacancyId) => {
    const response = await api.get(`/applications?vacancy_id=${vacancyId}`);
    return response.data;
  },

  /** Actualizar estado (aprobar/rechazar) */
  updateStatus: async (applicationId, status) => {
    const response = await api.put(`/applications/${applicationId}`, { status });
    return response.data;
  },

  /** Obtener todos los postulantes de una empresa */
  getByCompany: async (companyId) => {
    const response = await api.get(`/applications?company_id=${companyId}`);
    return response.data;
  },
};

export default applicationService;
