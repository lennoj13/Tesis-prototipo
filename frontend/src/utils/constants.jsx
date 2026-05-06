// Constantes de la aplicacion

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Roles del sistema (ahora en espanol, igual que la BD)
export const ROLES = {
  ESTUDIANTE: 'estudiante',
  EMPRESA: 'empresa',
  GESTOR: 'gestor',
  ADMIN: 'admin',
};

// Mapeo de roles backend -> rutas frontend
export const ROLE_ROUTES = {
  estudiante: '/dashboard/estudiante',
  empresa: '/dashboard/empresa',
  gestor: '/dashboard/gestor',
  admin: '/dashboard/admin',
};

// Mapeo de roles backend -> labels frontend
export const ROLE_LABELS = {
  estudiante: 'Estudiante',
  empresa: 'Empresa',
  gestor: 'Gestor PPP',
  admin: 'Administrador',
};
