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
  FiUser,
  FiFileText,
  FiUsers,
  FiBarChart2,
  FiBriefcase,
  FiBell,
  FiPlusCircle,
  FiInbox,
} from 'react-icons/fi';

const menuConfig = {
  estudiante: [
    { label: 'Feed de Vacantes', href: '/dashboard/estudiante', icon: FiHome },
    { label: 'Mi Perfil', href: '/dashboard/estudiante/perfil', icon: FiUser },
    { label: 'Mis Postulaciones', href: '/dashboard/estudiante/postulaciones', icon: FiFileText },
    { label: 'Notificaciones', href: '/dashboard/estudiante/notificaciones', icon: FiBell },
  ],
  empresa: [
    { label: 'Postulantes', href: '/dashboard/empresa', icon: FiUsers },
    { label: 'Mis Vacantes', href: '/dashboard/empresa/vacantes', icon: FiBriefcase },
    { label: 'Nueva Vacante', href: '/dashboard/empresa/vacantes/nueva', icon: FiPlusCircle },
    { label: 'Notificaciones', href: '/dashboard/empresa/notificaciones', icon: FiBell },
  ],
  admin: [
    { label: 'Dashboard', href: '/dashboard/admin', icon: FiHome },
    { label: 'Usuarios', href: '/dashboard/admin/usuarios', icon: FiUsers },
    { label: 'Empresas', href: '/dashboard/admin/empresas', icon: FiBriefcase },
    { label: 'Vacantes', href: '/dashboard/admin/vacantes', icon: FiInbox },
    { label: 'Reportes', href: '/dashboard/admin/reportes', icon: FiBarChart2 },
  ],
};

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const pathname = usePathname();

  const items = menuConfig[user?.rol] || menuConfig.estudiante;

  return (
    <aside
      className={`fixed top-16 left-0 bottom-0 w-[260px] bg-white border-r border-slate-200 flex flex-col z-[90] overflow-y-auto
        transition-transform duration-250 ease-in-out
        max-md:shadow-xl max-md:${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      style={{ transform: `translateX(${typeof window !== 'undefined' && window.innerWidth <= 768 && !isOpen ? '-100%' : '0'})` }}
    >
      <nav className="flex-1 p-4 px-3">
        <ul className="list-none flex flex-col gap-1">
          {items.map((item) => {
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

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-2 py-2 px-3 bg-slate-50 rounded-lg text-[0.8125rem] text-slate-600 font-medium">
          <span>{user?.rol ? user.rol.charAt(0).toUpperCase() + user.rol.slice(1) : 'Usuario'}</span>
        </div>
      </div>
    </aside>
  );
}
