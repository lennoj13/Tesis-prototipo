'use client';

/**
 * Navbar — Barra de navegación superior.
 * Demuestra: Componente React reutilizable, useAuth hook, condicional por rol.
 */

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Logo from './Logo';
import styles from './Navbar.module.css';
import { FiBell, FiChevronDown, FiUser, FiLogOut } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rolLabels = {
    estudiante: 'Estudiante',
    empresa: 'Empresa',
    admin: 'Administrador',
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Logo size="sm" />
      </div>

      <div className={styles.right}>
        {/* Notificaciones */}
        <button className={styles.iconBtn} title="Notificaciones" aria-label="Notificaciones">
          <FiBell size={20} />
          <span className={styles.badge}>3</span>
        </button>

        {/* Menú de usuario */}
        <div className={styles.userMenu} ref={menuRef}>
          <button
            className={styles.userBtn}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
          >
            <div className={styles.avatar}>
              {user?.nombre?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.nombre || 'Usuario'}</span>
              <span className={styles.userRole}>{rolLabels[user?.rol] || 'Sin rol'}</span>
            </div>
            <FiChevronDown
              size={16}
              className={`${styles.chevron} ${menuOpen ? styles.open : ''}`}
            />
          </button>

          {menuOpen && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>
                <FiUser size={16} />
                <span>Mi Perfil</span>
              </button>
              <div className={styles.divider} />
              <button
                className={`${styles.dropdownItem} ${styles.logoutItem}`}
                onClick={logout}
              >
                <FiLogOut size={16} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
