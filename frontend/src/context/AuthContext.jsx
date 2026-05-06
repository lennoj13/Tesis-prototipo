
/**
 * AuthContext -- React Context API para autenticacion.
 * Conecta con la API Flask para login/registro real con JWT.
 */

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { ROLE_ROUTES, ROLE_LABELS } from '../utils/constants';

// --- Estado inicial ---
const initialState = {
  user: null,       // { user_id, username, nombre, name, lastname, email, rol, role, role_id, profile_id }
  token: null,      // JWT string
  isLoading: true,  // Cargando sesion del localStorage
  error: null,
};

// --- Reducer ---
function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        error: null,
      };
    case 'LOADING':
      return { ...state, isLoading: true };
    case 'LOADED':
      return { ...state, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

// --- Context ---
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // Cargar sesion desde localStorage al montar
  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = localStorage.getItem('matchpp_token');
        const user = localStorage.getItem('matchpp_user');
        if (token && user) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { token, user: JSON.parse(user) },
          });
        } else {
          dispatch({ type: 'LOADED' });
        }
      } catch {
        dispatch({ type: 'LOADED' });
      }
    };
    loadSession();
  }, []);

  // Login -- llama a POST /security/login en Flask
  const login = useCallback(async (email, password) => {
    dispatch({ type: 'LOADING' });
    try {
      const response = await authService.login(email, password);
      
      if (response.result && response.data) {
        const { token, user_info } = response.data;
        
        // Normalizar el rol: el backend ahora devuelve roles en espanol
        const backendRole = user_info.role; // 'estudiante', 'empresa', 'gestor', 'admin'
        
        // Mapear datos del backend al formato del frontend
        const user = {
          id: user_info.user_id,
          user_id: user_info.user_id,
          cedula: user_info.cedula,
          username: user_info.username,
          nombre: user_info.name,
          name: user_info.name,
          lastname: user_info.lastname,
          email: user_info.email,
          rol: backendRole,
          role: backendRole,
          role_id: user_info.role_id,
          profile_id: user_info.profile_id,
        };

        localStorage.setItem('matchpp_token', token);
        localStorage.setItem('matchpp_user', JSON.stringify(user));

        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });

        // Redirigir segun rol
        const route = ROLE_ROUTES[backendRole] || '/dashboard/estudiante';
        navigate(route);
      } else {
        dispatch({
          type: 'LOGIN_ERROR',
          payload: response.message || 'Credenciales incorrectas',
        });
      }
    } catch (err) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: err.response?.data?.message || 'Error al conectar con el servidor',
      });
    }
  }, [navigate]);

  // Logout
  const logout = useCallback(() => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  }, [navigate]);

  // Limpiar error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    user: state.user,
    token: state.token,
    isLoading: state.isLoading,
    error: state.error,
    isAuthenticated: !!state.token,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook personalizado para acceder al contexto de autenticacion.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
