'use client';

/**
 * Logo reutilizable de MatchPP.
 * Demuestra: componente React reutilizable con props.
 * 
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} props.size - Tamaño del logo
 * @param {boolean} props.showText - Mostrar texto junto al icono
 * @param {string} props.className - Clases adicionales
 */

import styles from './Logo.module.css';

const sizes = {
  sm: { icon: 28, font: '1rem' },
  md: { icon: 36, font: '1.25rem' },
  lg: { icon: 48, font: '1.75rem' },
};

export default function Logo({ size = 'md', showText = true, className = '' }) {
  const s = sizes[size];

  return (
    <div className={`${styles.logo} ${className}`}>
      <div className={styles.icon} style={{ width: s.icon, height: s.icon }}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={s.icon}
          height={s.icon}
        >
          {/* Icono: dos flechas cruzadas = matching bidireccional */}
          <rect width="40" height="40" rx="10" fill="var(--primary-600)" />
          <path
            d="M12 20L18 14L24 20M18 14V28"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M28 20L22 26L16 20M22 26V12"
            stroke="var(--primary-200)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {showText && (
        <span className={styles.text} style={{ fontSize: s.font }}>
          Match<span className={styles.highlight}>PP</span>
        </span>
      )}
    </div>
  );
}
