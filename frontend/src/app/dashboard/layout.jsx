'use client';

/**
 * Dashboard Layout — Next.js Nested Layout (App Router).
 * Demuestra: Nested Layouts, composición, estado compartido entre componentes.
 */

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout({ children }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user) {
        // Protección de rutas por rol
        const currentRole = user.rol; // 'admin', 'empresa', 'estudiante'
        const roleRouteMap = {
          admin: '/dashboard/admin',
          empresa: '/dashboard/empresa',
          estudiante: '/dashboard/estudiante'
        };
        
        if (pathname.startsWith('/dashboard/admin') && currentRole !== 'admin') {
          router.push(roleRouteMap[currentRole] || '/login');
        } else if (pathname.startsWith('/dashboard/empresa') && currentRole !== 'empresa') {
          router.push(roleRouteMap[currentRole] || '/login');
        } else if (pathname.startsWith('/dashboard/estudiante') && currentRole !== 'estudiante') {
          router.push(roleRouteMap[currentRole] || '/login');
        }
      }
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  if (isLoading || (!isAuthenticated && !isLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-slate-500 text-[0.9375rem]">
        <div className="w-9 h-9 border-3 border-slate-200 border-t-primary-600 rounded-full animate-spin-slow" />
        <p>Cargando MatchPP...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Overlay para cerrar sidebar en móvil */}
      {sidebarOpen && (
        <div
          className="hidden max-md:block fixed top-16 left-0 right-0 bottom-0 bg-black/40 z-[85] animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <main className="mt-16 ml-[260px] p-8 min-h-[calc(100vh-64px)] animate-fade-in max-md:ml-0 max-md:p-4">
        {children}
      </main>
    </div>
  );
}
