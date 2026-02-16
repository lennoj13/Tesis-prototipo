'use client';

/**
 * Dashboard Empresa — Feed de Postulantes.
 * Módulo 4 de la tesis: Emparejamiento/Matching (vista empresa)
 */

import { useAuth } from '@/context/AuthContext';
import { FiFileText, FiUsers, FiCheckCircle, FiTool } from 'react-icons/fi';
import styles from './page.module.css';

export default function EmpresaDashboard() {
  const { user } = useAuth();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Panel de {user?.nombre || 'Empresa'}
          </h1>
          <p className={styles.subtitle}>
            Encuentra a los mejores candidatos para tus vacantes
          </p>
        </div>
      </header>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <FiFileText size={22} />
          </div>
          <div>
            <p className={styles.statNumber}>5</p>
            <p className={styles.statLabel}>Vacantes activas</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <FiUsers size={22} />
          </div>
          <div>
            <p className={styles.statNumber}>28</p>
            <p className={styles.statLabel}>Postulantes</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <FiCheckCircle size={22} />
          </div>
          <div>
            <p className={styles.statNumber}>7</p>
            <p className={styles.statLabel}>Aceptados</p>
          </div>
        </div>
      </div>

      <div className={styles.placeholder}>
        <FiTool size={20} style={{ marginBottom: 8 }} />
        <p>Feed de postulantes con tarjetas de matching — próxima fase de implementación</p>
      </div>
    </div>
  );
}
