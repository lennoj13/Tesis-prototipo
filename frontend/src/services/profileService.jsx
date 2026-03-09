import api from './api';

/**
 * Servicio de perfiles — conecta con Flask /user/profile
 */
const profileService = {
  /** Obtener perfil del usuario autenticado */
  getMyProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  /** Actualizar perfil del usuario autenticado */
  updateProfile: async (profileData) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  },

  /** Obtener perfil público de otro usuario */
  getPublicProfile: async (userId) => {
    const response = await api.get(`/user/profile/${userId}`);
    return response.data;
  },
};

export default profileService;
