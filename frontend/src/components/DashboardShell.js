'use client';

/**
 * DashboardShell — Wrapper client que contiene Navbar + Sidebar.
 * Separamos los componentes de cliente en este wrapper para que
 * el layout.js pueda seguir siendo un Server Component puro
 * (necesario para exportar metadata en Next.js App Router).
 * 
 * Demuestra: Patrón Server Component + Client Component boundary.
 */

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import styles from './DashboardShell.module.css';

export default function DashboardShell({ children }) {
  const { isLoading, isAuthenticated } = useAuth();

  // Pantalla de carga mientras se verifica la sesión
  if (isLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
        <p>Cargando MatchPP...</p>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <Navbar />
      <Sidebar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
