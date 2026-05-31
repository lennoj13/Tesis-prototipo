import api from './api';

/**
 * Servicio de administración — conecta con Flask /admin/*
 */
const adminService = {
  /** Obtener estadísticas del dashboard admin */
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  /** Obtener todos los usuarios */
  getUsers: async () => {
    const response = await api.get('/user/list');
    return response.data;
  },

  /** Obtener detalle completo de un usuario */
  getUserDetail: async (userId) => {
    const response = await api.get(`/admin/users/${userId}/detail`);
    return response.data;
  },

  /** Buscar usuario por cédula (optimizado) */
  searchUserByCedula: async (cedula) => {
    const response = await api.get(`/admin/users/search?cedula=${cedula}`);
    return response.data;
  },

  /** Obtener todas las empresas */
  getCompanies: async () => {
    const response = await api.get('/admin/companies');
    return response.data;
  },

  /** Obtener detalle completo de una empresa */
  getCompanyDetail: async (companyId) => {
    const response = await api.get(`/admin/companies/${companyId}/detail`);
    return response.data;
  },

  /** Aprobar/rechazar empresa */
  updateCompanyStatus: async (companyId, status) => {
    const response = await api.put(`/admin/companies/${companyId}/status`, { status });
    return response.data;
  },

  /** Obtener todas las habilidades */
  getSkills: async () => {
    const response = await api.get('/skills');
    return response.data;
  },

  /** Eliminar (desactivar) un usuario */
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  /** Activar/desactivar un usuario (toggle) */
  toggleUserStatus: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/toggle`);
    return response.data;
  },

  /** Actualizar información de un usuario */
  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  /** Crear un nuevo usuario */
  createUser: async (userData) => {
    const response = await api.post('/admin/users/create', userData);
    return response.data;
  },


  /** Crear una nueva empresa con su representante */
  createCompany: async (companyData) => {
    const response = await api.post('/admin/companies/create', companyData);
    return response.data;
  },

  /** Crear un supervisor nuevo para una empresa */
  createSupervisor: async (companyId, supervisorData) => {
    const response = await api.post(`/admin/companies/${companyId}/supervisors`, supervisorData);
    return response.data;
  },

  /** Obtener datos reales para los gráficos de reportes */
  getReports: async () => {
    const response = await api.get('/admin/reports');
    return response.data;
  },
};

export default adminService;
