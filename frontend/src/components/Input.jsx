'use client';

/**
 * Input reutilizable de MatchPP.
 * Demuestra: React forwardRef, estados de error, composición.
 * 
 * @param {Object} props
 * @param {string} props.label - Label del campo
 * @param {string} props.error - Mensaje de error
 * @param {React.ReactNode} props.icon - Icono a la izquierda
 * @param {boolean} props.required
 * @param {string} props.helperText - Texto de ayuda
 */

import { forwardRef } from 'react';
import styles from './Input.module.css';

const Input = forwardRef(function Input(
  { label, error, icon, required, helperText, type = 'text', id, className = '', ...rest },
  ref
) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`${styles.field} ${error ? styles.hasError : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`${styles.input} ${icon ? styles.withIcon : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className={styles.error} role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p className={styles.helper}>{helperText}</p>
      )}
    </div>
  );
});

export default Input;
