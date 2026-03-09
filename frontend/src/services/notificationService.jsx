import api from './api';

/**
 * Servicio de notificaciones — conecta con Flask /notifications
 */
const notificationService = {
  /** Obtener todas las notificaciones del usuario */
  getAll: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  /** Marcar una notificación como leída */
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  /** Marcar todas como leídas */
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  /** Eliminar notificación */
  delete: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};

export default notificationService;
