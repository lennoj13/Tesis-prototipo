
/**
 * Dashboard Layout -- Nested Layout con proteccion de rutas por rol.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';
import Modal from 'components/Modal';
import Button from 'components/Button';
import { useAuth } from 'context/AuthContext';

export default function DashboardLayout() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !sessionExpired) {
        navigate('/login');
      } else if (user && isAuthenticated) {
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

  useEffect(() => {
    const handleAuthExpired = () => {
      setSessionExpired(true);
    };
    window.addEventListener('auth_expired', handleAuthExpired);
    return () => window.removeEventListener('auth_expired', handleAuthExpired);
  }, []);

  if (isLoading || (!isAuthenticated && !isLoading && !sessionExpired)) {
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

      {/* Modal de Sesión Expirada */}
      <Modal 
        isOpen={sessionExpired} 
        onClose={() => navigate('/login')} 
        title="Sesión Expirada" 
        size="sm"
        footer={
          <Button variant="primary" className="w-full" onClick={() => navigate('/login')}>
            Volver a Iniciar Sesión
          </Button>
        }
      >
        <div className="py-2 text-center">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <p className="text-slate-600 text-[0.9375rem] leading-relaxed m-0">
            Por seguridad, tu sesión ha caducado. Por favor, vuelve a iniciar sesión para continuar usando la plataforma.
          </p>
        </div>
      </Modal>
    </div>
  );
}
