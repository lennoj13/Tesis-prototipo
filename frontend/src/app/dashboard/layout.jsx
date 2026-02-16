'use client';

/**
 * Dashboard Layout — Next.js Nested Layout (App Router).
 * Demuestra: Nested Layouts de Next.js, composición de componentes (Navbar + Sidebar).
 * 
 * Este layout envuelve TODAS las rutas dentro de /dashboard/*.
 * → Feature clave: los layouts se renderizan una vez
 *   y NO se re-renderizan cuando navegas entre páginas hijas = SPA behavior.
 */

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import styles from './layout.module.css';

export default function DashboardLayout({ children }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
        <p>Cargando MatchPP...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardLayout}>
      <Navbar />
      <Sidebar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
