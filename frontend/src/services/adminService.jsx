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

  /** Obtener todas las empresas */
  getCompanies: async () => {
    const response = await api.get('/admin/companies');
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

  /** Actualizar información de un usuario */
  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },
};

export default adminService;
