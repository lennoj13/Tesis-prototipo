// Constantes de la aplicación
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Roles del sistema
export const ROLES = {
  STUDENT: 'student',
  COMPANY: 'company',
  ADMIN: 'admin',
};

// Mapeo de roles backend → rutas frontend
export const ROLE_ROUTES = {
  student: '/dashboard/estudiante',
  company: '/dashboard/empresa',
  admin: '/dashboard/admin',
};

// Mapeo de roles backend → labels frontend
export const ROLE_LABELS = {
  student: 'Estudiante',
  company: 'Empresa',
  admin: 'Administrador',
};
