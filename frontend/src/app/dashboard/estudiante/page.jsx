'use client';

/**
 * Dashboard Estudiante — Feed de Vacantes.
 * Módulo 4 de la tesis: Emparejamiento/Matching
 */

import { useAuth } from '@/context/AuthContext';
import { FiFileText, FiSend, FiTarget, FiTool } from 'react-icons/fi';
import styles from './page.module.css';

export default function EstudianteDashboard() {
  const { user } = useAuth();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Bienvenido, {user?.nombre || 'Estudiante'}
          </h1>
          <p className={styles.subtitle}>
            Estas son las vacantes que mejor se ajustan a tu perfil
          </p>
        </div>
      </header>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <FiFileText size={22} />
          </div>
          <div>
            <p className={styles.statNumber}>12</p>
            <p className={styles.statLabel}>Vacantes compatibles</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <FiSend size={22} />
          </div>
          <div>
            <p className={styles.statNumber}>3</p>
            <p className={styles.statLabel}>Postulaciones activas</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <FiTarget size={22} />
          </div>
          <div>
            <p className={styles.statNumber}>85%</p>
            <p className={styles.statLabel}>Match más alto</p>
          </div>
        </div>
      </div>

      <div className={styles.placeholder}>
        <FiTool size={20} style={{ marginBottom: 8 }} />
        <p>Feed de vacantes con tarjetas de matching — próxima fase de implementación</p>
      </div>
    </div>
  );
}
