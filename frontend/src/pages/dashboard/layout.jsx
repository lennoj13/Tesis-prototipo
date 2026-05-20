
/**
 * Dashboard Layout -- Nested Layout con proteccion de rutas por rol.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';
import { useAuth } from 'context/AuthContext';

export default function DashboardLayout() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (user) {
        // Proteccion de rutas por rol
        const currentRole = user.rol; // 'admin', 'empresa', 'estudiante', 'gestor'
        const roleRouteMap = {
          admin: '/dashboard/admin',
          empresa: '/dashboard/empresa',
          estudiante: '/dashboard/estudiante',
          gestor: '/dashboard/gestor',
        };
        
        if (pathname.startsWith('/dashboard/admin') && currentRole !== 'admin') {
          navigate(roleRouteMap[currentRole] || '/login');
        } else if (pathname.startsWith('/dashboard/empresa') && currentRole !== 'empresa') {
          navigate(roleRouteMap[currentRole] || '/login');
        } else if (pathname.startsWith('/dashboard/estudiante') && currentRole !== 'estudiante') {
          navigate(roleRouteMap[currentRole] || '/login');
        } else if (pathname.startsWith('/dashboard/gestor') && currentRole !== 'gestor') {
          navigate(roleRouteMap[currentRole] || '/login');
        }
      }
    }
  }, [isLoading, isAuthenticated, user, pathname, navigate]);

  if (isLoading || (!isAuthenticated && !isLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-slate-500 text-[0.9375rem]">
        <div className="w-9 h-9 border-3 border-slate-200 border-t-primary-600 rounded-full animate-spin-slow" />
        <p>Cargando Sistema PPP...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Overlay para cerrar sidebar en movil */}
      {sidebarOpen && (
        <div
          className="hidden max-md:block fixed top-16 left-0 right-0 bottom-0 bg-black/40 z-[85] animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <main className="mt-16 ml-[260px] p-8 min-h-[calc(100vh-64px)] animate-fade-in max-md:ml-0 max-md:p-4" style={{ background: 'var(--color-page-bg)' }}>
        <Outlet />
      </main>
    </div>
  );
}
