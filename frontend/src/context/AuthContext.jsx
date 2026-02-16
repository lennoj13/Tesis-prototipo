'use client';

/**
 * AuthContext — React Context API para autenticación.
 * Demuestra: Context API, useReducer, JWT, protección por rol.
 * 
 * En producción conecta con la API Flask.
 * Por ahora simula el flujo para construir la UI.
 */

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// --- Estado inicial ---
const initialState = {
  user: null,       // { id, nombre, email, rol }
  token: null,      // JWT string
  isLoading: true,  // Cargando sesión del localStorage
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
  const router = useRouter();

  // Cargar sesión desde localStorage al montar
  useEffect(() => {
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
  }, []);

  // Login — en producción llama a POST /api/auth/login
  const login = useCallback(async (email, password) => {
    dispatch({ type: 'LOADING' });
    try {
      // TODO: Conectar con API Flask cuando el backend esté listo
      // const response = await api.post('/auth/login', { email, password });
      // const { user, token } = response.data;

      // --- Simulación temporal para construir la UI ---
      await new Promise((r) => setTimeout(r, 800));

      // Simular usuarios de prueba por email
      let rol = 'estudiante';
      if (email.includes('empresa')) rol = 'empresa';
      if (email.includes('admin')) rol = 'admin';

      const user = {
        id: 1,
        nombre: email.split('@')[0],
        email,
        rol,
      };
      const token = 'simulated-jwt-token';
      // --- Fin simulación ---

      localStorage.setItem('matchpp_token', token);
      localStorage.setItem('matchpp_user', JSON.stringify(user));

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });

      // Redirigir según rol
      const dashboardRoutes = {
        estudiante: '/dashboard/estudiante',
        empresa: '/dashboard/empresa',
        admin: '/dashboard/admin',
      };
      router.push(dashboardRoutes[rol] || '/dashboard/estudiante');
    } catch (err) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: err.response?.data?.message || 'Error al iniciar sesión',
      });
    }
  }, [router]);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('matchpp_token');
    localStorage.removeItem('matchpp_user');
    dispatch({ type: 'LOGOUT' });
    router.push('/login');
  }, [router]);

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
 * Hook personalizado para acceder al contexto de autenticación.
 * Demuestra: Custom Hook de React.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
