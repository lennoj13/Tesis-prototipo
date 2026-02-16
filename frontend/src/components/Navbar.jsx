'use client';

/**
 * Navbar — Barra de navegación superior.
 * Demuestra: Componente React reutilizable, useAuth hook, props callback.
 */

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Logo from './Logo';
import { FiBell, FiChevronDown, FiUser, FiLogOut, FiMenu, FiArrowLeft } from 'react-icons/fi';

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
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
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-50 shadow-sm">
      <div className="flex items-center gap-2">
        {/* Botón hamburguesa — transición suave a flecha ← */}
        <button
          className="hidden md:hidden max-md:flex items-center justify-center relative w-10 h-10 border-none bg-transparent text-slate-600 rounded-lg cursor-pointer transition-all duration-150 hover:bg-slate-100 hover:text-slate-800"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <FiMenu size={22} className={`hamburger-icon ${!sidebarOpen ? 'icon-visible' : 'icon-hidden'}`} />
          <FiArrowLeft size={22} className={`hamburger-icon ${sidebarOpen ? 'icon-visible' : 'icon-hidden'}`} />
        </button>
        <Logo size="sm" />
      </div>

      <div className="flex items-center gap-2">
        {/* Notificaciones */}
        <button
          className="relative flex items-center justify-center w-10 h-10 border-none bg-transparent text-slate-500 rounded-lg cursor-pointer transition-all duration-150 hover:bg-slate-100 hover:text-slate-700"
          title="Notificaciones"
          aria-label="Notificaciones"
        >
          <FiBell size={20} />
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-danger text-white text-[0.6875rem] font-bold rounded-full flex items-center justify-center px-1">
            3
          </span>
        </button>

        {/* Menú de usuario */}
        <div className="relative" ref={menuRef}>
          <button
            className="flex items-center gap-2.5 py-1.5 px-2.5 border-none bg-transparent rounded-lg cursor-pointer transition-colors duration-150 hover:bg-slate-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-sm flex items-center justify-center">
              {user?.nombre?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col items-start leading-tight max-md:hidden">
              <span className="text-sm font-semibold text-slate-800">{user?.nombre || 'Usuario'}</span>
              <span className="text-xs text-slate-500">{rolLabels[user?.rol] || 'Sin rol'}</span>
            </div>
            <FiChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-150 max-md:hidden ${menuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {menuOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 min-w-[200px] bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 animate-fade-in z-[200]">
              <button
                className="flex items-center gap-2.5 w-full py-2.5 px-3 border-none bg-transparent font-sans text-sm text-slate-700 rounded-lg cursor-pointer transition-colors duration-150 hover:bg-slate-100"
                onClick={() => setMenuOpen(false)}
              >
                <FiUser size={16} />
                <span>Mi Perfil</span>
              </button>
              <div className="h-px bg-slate-200 mx-2 my-1" />
              <button
                className="flex items-center gap-2.5 w-full py-2.5 px-3 border-none bg-transparent font-sans text-sm text-danger rounded-lg cursor-pointer transition-colors duration-150 hover:bg-danger-light"
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
