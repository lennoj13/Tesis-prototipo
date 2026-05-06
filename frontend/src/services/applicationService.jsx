import api from './api';

/**
 * Servicio de postulaciones -- conecta con Flask /applications
 */
const applicationService = {
  /** Crear nueva postulacion */
  apply: async (vacancyId, matchPercentage = 0) => {
    const response = await api.post('/applications', {
      vacante_id: vacancyId,
      porcentaje_afinidad: matchPercentage,
    });
    return response.data;
  },

  /** Obtener postulaciones del estudiante autenticado */
  getMyApplications: async (studentId) => {
    const url = studentId 
      ? `/applications?estudiante_id=${studentId}` 
      : '/applications';
    const response = await api.get(url);
    return response.data;
  },

  /** Obtener postulantes de una vacante (para empresas) */
  getByVacancy: async (vacancyId) => {
    const response = await api.get(`/applications?vacante_id=${vacancyId}`);
    return response.data;
  },

  /** Actualizar estado (aprobar/rechazar) */
  updateStatus: async (applicationId, statusData) => {
    // statusData puede ser { estado: 'aprobada', notas: '...' } o un string
    const body = typeof statusData === 'string' ? { estado: statusData } : statusData;
    const response = await api.put(`/applications/${applicationId}`, body);
    return response.data;
  },

  /** Obtener todos los postulantes de una empresa */
  getByCompany: async (companyId) => {
    const response = await api.get(`/applications?institucion_id=${companyId}`);
    return response.data;
  },

  /** Obtener todas las postulaciones (para gestor/admin) */
  getAll: async () => {
    const response = await api.get('/applications');
    return response.data;
  },

  /** Obtener paquete de solicitud SIUG */
  getSolicitud: async (applicationId) => {
    const response = await api.get(`/applications/${applicationId}/solicitud`);
    return response.data;
  },
};

export default applicationService;
