'use client';

/**
 * Página de Login — MatchPP.
 * Demuestra: React Hook Form (validación), useAuth context, estados de UI,
 * componentes reutilizables (Button, Input, Logo).
 * 
 * Módulo 1 de la tesis: Gestión de Usuarios
 */

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import Input from '@/components/Input';
import styles from './page.module.css';
import { FiMail, FiLock, FiEye, FiEyeOff, FiTarget, FiRefreshCw, FiZap, FiAlertTriangle, FiInfo } from 'react-icons/fi';

export default function LoginPage() {
  const { login, isLoading, error, clearError } = useAuth();

  // Estado del formulario
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Validaciones
  function validate() {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Manejar cambio en inputs
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) clearError();
  }

  // Enviar formulario
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    await login(formData.email, formData.password);
  }

  return (
    <div className={styles.page}>
      {/* Panel izquierdo — Branding */}
      <div className={styles.brandPanel}>
        <div className={styles.brandContent}>
          <Logo size="lg" />
          <h1 className={styles.brandTitle}>
            Conectamos talento universitario con oportunidades reales
          </h1>
          <p className={styles.brandSubtitle}>
            Plataforma de matching bidireccional para prácticas preprofesionales 
            basada en inteligencia artificial y similitud semántica.
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}><FiTarget size={20} /></span>
              <div>
                <strong>Matching Inteligente</strong>
                <p>Algoritmo NLP que calcula el % de afinidad entre tu perfil y las vacantes</p>
              </div>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}><FiRefreshCw size={20} /></span>
              <div>
                <strong>Bidireccional</strong>
                <p>Tanto estudiantes como empresas ven su nivel de compatibilidad</p>
              </div>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}><FiZap size={20} /></span>
              <div>
                <strong>Rápido y Simple</strong>
                <p>Completa tu perfil y recibe recomendaciones personalizadas al instante</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho — Formulario */}
      <div className={styles.formPanel}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <div className={styles.mobileLogoWrapper}>
              <Logo size="md" />
            </div>
            <h2 className={styles.formTitle}>Iniciar Sesión</h2>
            <p className={styles.formSubtitle}>
              Ingresa tus credenciales para acceder a la plataforma
            </p>
          </div>

          {/* Error global del servidor */}
          {error && (
            <div className={styles.alert} role="alert">
              <FiAlertTriangle size={18} />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            <Input
              label="Correo electrónico"
              name="email"
              type="email"
              placeholder="tucorreo@ug.edu.ec"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<FiMail />}
              required
              autoComplete="email"
            />

            <div className={styles.passwordField}>
              <Input
                label="Contraseña"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<FiLock />}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className={styles.formFooter}>
            <p>
              ¿No tienes cuenta?{' '}
              <Link href="/register" className={styles.link}>
                Regístrate aquí
              </Link>
            </p>
          </div>

          {/* Tip para pruebas */}
          <div className={styles.devTip}>
            <p><FiInfo size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /><strong>Tip de prueba:</strong></p>
            <p>Usa <code>admin@ug.edu.ec</code> para acceder como Admin</p>
            <p>Usa <code>empresa@ug.edu.ec</code> para acceder como Empresa</p>
            <p>Cualquier otro correo accede como Estudiante</p>
          </div>
        </div>
      </div>
    </div>
  );
}
