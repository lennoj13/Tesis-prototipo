
/**
 * Sidebar -- Menu lateral institucional que cambia segun el rol del usuario.
 */

import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import {
  FiHome,
  FiFileText,
  FiUsers,
  FiBarChart2,
  FiBriefcase,
  FiPlusCircle,
  FiInbox,
  FiSend,
  FiTarget,
  FiCheckSquare,
} from 'react-icons/fi';

const menuConfig = {
  estudiante: [
    { section: 'PRINCIPAL' },
    { label: 'Feed de Vacantes', href: '/dashboard/estudiante', icon: FiHome },
    { label: 'Empresas en Convenio', href: '/dashboard/estudiante/empresas', icon: FiBriefcase },
    { label: 'Mis Postulaciones', href: '/dashboard/estudiante/postulaciones', icon: FiSend },
    { section: 'PERFIL' },
    { label: 'Mi Perfil', href: '/dashboard/estudiante/perfil', icon: FiTarget },
  ],
  empresa: [
    { section: 'PRINCIPAL' },
    { label: 'Dashboard', href: '/dashboard/empresa', icon: FiHome },
    { label: 'Postulantes', href: '/dashboard/empresa/postulantes', icon: FiUsers },
    { section: 'VACANTES' },
    { label: 'Mis Vacantes', href: '/dashboard/empresa/vacantes', icon: FiBriefcase },
    { label: 'Nueva Vacante', href: '/dashboard/empresa/vacantes/nueva', icon: FiPlusCircle },
  ],
  gestor: [
    { section: 'PRINCIPAL' },
    { label: 'Dashboard', href: '/dashboard/gestor', icon: FiHome },
    { label: 'Reportes', href: '/dashboard/gestor/reportes', icon: FiBarChart2 },
    { section: 'GESTIÓN PPP' },
    { label: 'Postulaciones Pendientes', href: '/dashboard/gestor/postulaciones', icon: FiCheckSquare },
    { label: 'Historial de Postulaciones', href: '/dashboard/gestor/historial', icon: FiFileText },
    { label: 'Empresas', href: '/dashboard/gestor/empresas', icon: FiBriefcase },
    { label: 'Consulta Estudiante', href: '/dashboard/gestor/estudiantes', icon: FiUsers },
  ],
  admin: [
    { section: 'GENERAL' },
    { label: 'Dashboard', href: '/dashboard/admin', icon: FiHome },
    { label: 'Reportes', href: '/dashboard/admin/reportes', icon: FiBarChart2 },
    { section: 'GESTIÓN' },
    { label: 'Usuarios', href: '/dashboard/admin/usuarios', icon: FiUsers },
    { label: 'Empresas', href: '/dashboard/admin/empresas', icon: FiBriefcase },
    { label: 'Vacantes', href: '/dashboard/admin/vacantes', icon: FiInbox },
  ],
};

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  const items = menuConfig[user?.rol] || menuConfig.estudiante;

  return (
    <aside
      className={`sidebar-scroll fixed top-16 left-0 bottom-0 w-[260px] flex flex-col z-[90] overflow-y-auto
        transition-transform duration-250 ease-in-out
        md:translate-x-0
        ${isOpen ? 'translate-x-0 shadow-xl' : 'max-md:-translate-x-full'}
      `}
      style={{ background: 'var(--color-sidebar-bg)' }}
    >
      <nav className="flex-1 py-3">
        <ul className="list-none flex flex-col gap-0.5">
          {items.map((item, index) => {
            // Section label
            if (item.section) {
              return (
                <li key={`section-${index}`} className={`${index > 0 ? 'mt-5' : 'mt-1'}`}>
                  <span
                    className="block px-3.5 pb-1.5 text-[0.625rem] font-bold uppercase tracking-[0.15em]"
                    style={{ color: 'var(--color-sidebar-section)' }}
                  >
                    {item.section}
                  </span>
                </li>
              );
            }

            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link to={item.href}
                  onClick={onClose}
                  className="flex w-full items-center gap-3 py-2.5 px-3.5 rounded-none text-[0.875rem] font-medium no-underline transition-all duration-150 relative"
                  style={{
                    color: isActive ? 'var(--color-sidebar-text-active)' : 'var(--color-sidebar-text)',
                    background: isActive ? 'var(--color-sidebar-active)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--color-sidebar-accent)' : '3px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--color-sidebar-hover)';
                      e.currentTarget.style.color = 'var(--color-sidebar-text-active)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--color-sidebar-text)';
                    }
                  }}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
