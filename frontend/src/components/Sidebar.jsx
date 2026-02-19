'use client';

/**
 * Sidebar — Menú lateral que cambia según el rol del usuario.
 * Demuestra: Renderizado condicional, useAuth, usePathname, props.
 */

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
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
  FiLogOut,
} from 'react-icons/fi';

const menuConfig = {
  estudiante: [
    { section: 'PRINCIPAL' },
    { label: 'Feed de Vacantes', href: '/dashboard/estudiante', icon: FiHome },
    { label: 'Mis Postulaciones', href: '/dashboard/estudiante/postulaciones', icon: FiSend },
    { section: 'PERFIL' },
    { label: 'Mi Perfil', href: '/dashboard/estudiante/perfil', icon: FiTarget },
  ],
  empresa: [
    { section: 'PRINCIPAL' },
    { label: 'Postulantes', href: '/dashboard/empresa', icon: FiUsers },
    { section: 'VACANTES' },
    { label: 'Mis Vacantes', href: '/dashboard/empresa/vacantes', icon: FiBriefcase },
    { label: 'Nueva Vacante', href: '/dashboard/empresa/vacantes/nueva', icon: FiPlusCircle },
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
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const items = menuConfig[user?.rol] || menuConfig.estudiante;

  return (
    <aside
      className={`fixed top-16 left-0 bottom-0 w-[260px] bg-white border-r border-slate-200 flex flex-col z-[90] overflow-y-auto
        transition-transform duration-250 ease-in-out
        md:translate-x-0
        ${isOpen ? 'translate-x-0 shadow-xl' : 'max-md:-translate-x-full'}
      `}
    >
      <nav className="flex-1 p-4 px-3">
        <ul className="list-none flex flex-col gap-0.5">
          {items.map((item, index) => {
            // Section label
            if (item.section) {
              return (
                <li key={`section-${index}`} className={`${index > 0 ? 'mt-5' : ''}`}>
                  <span className="block px-3.5 pb-1.5 text-[0.6875rem] font-bold text-slate-400 uppercase tracking-widest">
                    {item.section}
                  </span>
                </li>
              );
            }

            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-[0.9375rem] font-medium no-underline transition-all duration-150 relative
                    ${isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
                  {isActive && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary-600 rounded-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer — mini perfil + logout */}
      <div className="p-3 border-t border-slate-200">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
            {user?.nombre?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-slate-800 truncate">{user?.nombre || 'Usuario'}</span>
            <span className="text-xs text-slate-500 truncate">{user?.email || ''}</span>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2.5 w-full py-2 px-3 border-none bg-transparent text-sm text-slate-500 rounded-lg cursor-pointer transition-colors hover:bg-danger-light hover:text-danger font-medium"
        >
          <FiLogOut size={16} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
