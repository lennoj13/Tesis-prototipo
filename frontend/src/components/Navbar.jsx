
/**
 * Navbar -- Barra de navegacion superior institucional.
 */

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import Logo from './Logo';
import { FiChevronDown, FiUser, FiLogOut, FiMenu, FiArrowLeft } from 'react-icons/fi';

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menu al hacer clic fuera
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
    gestor: 'Gestor PPP',
    admin: 'Administrador',
  };

  const isStudent = user?.rol === 'estudiante';

  return (
    <nav
      className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-5 z-50 shadow-sm"
      style={{ background: 'var(--color-header-bg)' }}
    >
      <div className="flex items-center gap-3">
        {/* Boton hamburguesa */}
        <button
          className="hidden md:hidden max-md:flex items-center justify-center relative w-10 h-10 border-none bg-transparent text-white/80 rounded-md cursor-pointer transition-all duration-150 hover:bg-white/10 hover:text-white"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Cerrar menu' : 'Abrir menu'}
        >
          <FiMenu size={22} className={`hamburger-icon ${!sidebarOpen ? 'icon-visible' : 'icon-hidden'}`} />
          <FiArrowLeft size={22} className={`hamburger-icon ${sidebarOpen ? 'icon-visible' : 'icon-hidden'}`} />
        </button>
        <Logo size="sm" variant="light" />
      </div>

      <div className="flex items-center gap-2">
        {/* Menu de usuario */}
        <div className="relative" ref={menuRef}>
          <button
            className="flex items-center gap-2.5 py-1.5 px-2.5 border-none bg-transparent rounded-md cursor-pointer transition-colors duration-150 hover:bg-white/10"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
          >
            <div
              className="w-9 h-9 rounded-full text-white font-bold text-sm flex items-center justify-center border-2 border-white/30 bg-white/20 backdrop-blur-sm"
            >
              {user?.nombre?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col items-start leading-tight max-md:hidden">
              <span className="text-sm font-semibold text-white">{user?.nombre || 'Usuario'}</span>
              <span className="text-xs text-white/60">{rolLabels[user?.rol] || 'Sin rol'}</span>
            </div>
            <FiChevronDown
              size={16}
              className={`text-white/50 transition-transform duration-150 max-md:hidden ${menuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {menuOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 min-w-[220px] bg-white border border-slate-200 rounded-md p-1.5 animate-fade-in z-[200]">
              {/* Info del usuario */}
              <div className="px-3 py-2.5 mb-1">
                <p className="text-sm font-semibold text-slate-800">{user?.nombre || 'Usuario'}</p>
                <p className="text-xs text-slate-500 mt-0.5">{user?.email || ''}</p>
              </div>
              <div className="h-px bg-slate-200 mx-2 my-1" />
              {isStudent && (
                <>
                  <Link
                    to="/dashboard/estudiante/perfil"
                    className="flex items-center gap-2.5 w-full py-2.5 px-3 border-none bg-transparent font-sans text-sm text-slate-700 rounded-md cursor-pointer transition-colors duration-150 hover:bg-slate-100 no-underline"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FiUser size={16} />
                    <span>Mi Perfil</span>
                  </Link>
                  <div className="h-px bg-slate-200 mx-2 my-1" />
                </>
              )}
              <button
                className="flex items-center gap-2.5 w-full py-2.5 px-3 border-none bg-transparent font-sans text-sm text-danger rounded-md cursor-pointer transition-colors duration-150 hover:bg-danger-light"
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
