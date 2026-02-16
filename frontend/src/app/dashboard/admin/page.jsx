'use client';

/**
 * Dashboard Admin — Panel de administración.
 * Módulo 1 de la tesis: Gestión de Usuarios (rol Admin)
 */

import { useAuth } from '@/context/AuthContext';
import { FiUser, FiBriefcase, FiFileText, FiTarget, FiTool } from 'react-icons/fi';
import styles from './page.module.css';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Panel de Administración
          </h1>
          <p className={styles.subtitle}>
            Bienvenido, {user?.nombre || 'Admin'}. Vista general del sistema MatchPP.
          </p>
        </div>
      </header>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <FiUser size={22} />
          </div>
          <div>
            <p className={styles.statNumber}>45</p>
            <p className={styles.statLabel}>Estudiantes registrados</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <FiBriefcase size={22} />
          </div>
          <div>
            <p className={styles.statNumber}>12</p>
            <p className={styles.statLabel}>Empresas registradas</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <FiFileText size={22} />
          </div>
          <div>
            <p className={styles.statNumber}>23</p>
            <p className={styles.statLabel}>Vacantes activas</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <FiTarget size={22} />
          </div>
          <div>
            <p className={styles.statNumber}>156</p>
            <p className={styles.statLabel}>Matchings realizados</p>
          </div>
        </div>
      </div>

      <div className={styles.placeholder}>
        <FiTool size={20} style={{ marginBottom: 8 }} />
        <p>Tablas de gestión y gráficos de reportes — próxima fase de implementación</p>
      </div>
    </div>
  );
}
