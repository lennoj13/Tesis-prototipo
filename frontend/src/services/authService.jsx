import api from './api';

/**
 * Servicio de autenticación — conecta con Flask /security/*
 */
const authService = {
  /**
   * Login de usuario
   * @param {string} login - Email o nombre de usuario
   * @param {string} password - Contraseña
   */
  login: async (login, password) => {
    const response = await api.post('/security/login', {
      login_user: login,
      login_password: password,
    });
    return response.data;
  },



  /**
   * Cambiar contraseña del usuario actual
   */
  changePassword: async (old_password, new_password) => {
    const response = await api.post('/security/change-password', {
      old_password,
      new_password,
    });
    return response.data;
  },

  /**
   * Obtener datos del usuario autenticado
   */
  getCurrentUser: async () => {
    const response = await api.get('/security/current-user');
    return response.data;
  },

  /**
   * Cerrar sesión (solo limpia localStorage)
   */
  logout: () => {
    localStorage.removeItem('matchpp_token');
    localStorage.removeItem('matchpp_user');
  },
};

export default authService;
