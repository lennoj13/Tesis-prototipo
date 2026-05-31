import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

/**
 * Instancia de Axios configurada para la API Flask.
 * Incluye interceptor para agregar JWT a cada request.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT en cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('matchpp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas de error (401 o 500 de Auth)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthError =
      error.response?.status === 401 ||
      (error.response?.status === 500 &&
        error.response?.data?.message &&
        (
          error.response.data.message.includes('Token no válido') ||
          error.response.data.message.includes('Token no proporcionado') ||
          error.response.data.message.includes('Token inválido') ||
          error.response.data.message.includes('No autorizado') ||
          error.response.data.message.includes('ha expirado')
        ));

    if (isAuthError) {
      localStorage.removeItem('matchpp_token');
      localStorage.removeItem('matchpp_user');
      // Solo redirigir si estamos en el cliente
      if (typeof window !== 'undefined') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
