'use client';

/**
 * Sidebar — Menú lateral que cambia según el rol del usuario.
 * Demuestra: Renderizado condicional, useAuth, Next.js navigation (usePathname).
 */

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './Sidebar.module.css';
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

// --- Configuración de menú por rol ---
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

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const items = menuConfig[user?.rol] || menuConfig.estudiante;

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul className={styles.menu}>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
                >
                  <Icon size={20} className={styles.menuIcon} />
                  <span className={styles.menuLabel}>{item.label}</span>
                  {isActive && <span className={styles.activeIndicator} />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer del sidebar */}
      <div className={styles.footer}>
        <div className={styles.rolBadge}>
          {user?.rol === 'estudiante' && '🎓'}
          {user?.rol === 'empresa' && '🏢'}
          {user?.rol === 'admin' && '⚙️'}
          <span>{user?.rol?.charAt(0).toUpperCase() + user?.rol?.slice(1)}</span>
        </div>
      </div>
    </aside>
  );
}
