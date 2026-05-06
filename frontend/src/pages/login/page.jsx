
/**
 * Pagina de Login.
 * El SIUG usa numero de cedula para autenticacion.
 * Modulo 1 de la tesis: Gestion de Usuarios
 */

import { useState } from 'react';
import { useAuth } from 'context/AuthContext';
import Logo from 'components/Logo';
import Button from 'components/Button';
import Input from 'components/Input';
import { FiCreditCard, FiLock, FiEye, FiEyeOff, FiTarget, FiRefreshCw, FiZap, FiAlertTriangle, FiInfo } from 'react-icons/fi';

export default function LoginPage() {
  const { login, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({ cedula: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  function validate() {
    const newErrors = {};
    if (!formData.cedula.trim()) {
      newErrors.cedula = 'La cedula es obligatoria';
    } else if (formData.cedula.trim().length < 10) {
      newErrors.cedula = 'La cedula debe tener al menos 10 digitos';
    }
    if (!formData.password) {
      newErrors.password = 'La contrasena es obligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Minimo 8 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (error) clearError();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    await login(formData.cedula, formData.password);
  }

  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo -- Branding */}
      <div className="brand-panel flex-1 bg-gradient-to-br from-primary-700 to-primary-900 text-white flex items-center justify-center p-12 relative overflow-hidden max-[960px]:hidden">
        <div className="relative max-w-[480px] z-10">
          <Logo size="lg" />
          <h1 className="text-[2rem] font-bold leading-tight mt-8 mb-4">
            Conectamos talento universitario con oportunidades reales
          </h1>
          <p className="text-[1.0625rem] text-primary-200 leading-relaxed mb-10">
            Plataforma de matching bidireccional para practicas preprofesionales
            basada en inteligencia artificial y similitud semantica.
          </p>
          <div className="flex flex-col gap-6">
            <div className="flex gap-3.5 items-start">
              <span className="text-2xl flex-shrink-0 mt-0.5"><FiTarget size={20} /></span>
              <div>
                <strong className="block text-[0.9375rem] mb-1">Matching Inteligente</strong>
                <p className="text-sm text-primary-200 leading-snug m-0">Algoritmo NLP que calcula el % de afinidad entre tu perfil y las vacantes</p>
              </div>
            </div>
            <div className="flex gap-3.5 items-start">
              <span className="text-2xl flex-shrink-0 mt-0.5"><FiRefreshCw size={20} /></span>
              <div>
                <strong className="block text-[0.9375rem] mb-1">Bidireccional</strong>
                <p className="text-sm text-primary-200 leading-snug m-0">Tanto estudiantes como empresas ven su nivel de compatibilidad</p>
              </div>
            </div>
            <div className="flex gap-3.5 items-start">
              <span className="text-2xl flex-shrink-0 mt-0.5"><FiZap size={20} /></span>
              <div>
                <strong className="block text-[0.9375rem] mb-1">Compatible con SIUG</strong>
                <p className="text-sm text-primary-200 leading-snug m-0">Genera paquetes de datos listos para ser consumidos por el sistema universitario</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho -- Formulario */}
      <div className="flex-1 flex items-center justify-center p-12 bg-white max-[960px]:p-8 max-[960px]:px-5">
        <div className="w-full max-w-[420px] animate-fade-in">
          <div className="mb-8">
            <div className="hidden max-[960px]:block mb-6">
              <Logo size="md" />
            </div>
            <h2 className="text-[1.75rem] font-bold text-slate-900 mb-2">Iniciar Sesion</h2>
            <p className="text-[0.9375rem] text-slate-500">
              Ingresa tu numero de cedula y contrasena
            </p>
          </div>

          {/* Error global */}
          {error && (
            <div className="flex items-center gap-2.5 py-3 px-4 bg-danger-light text-danger rounded-lg text-sm font-medium mb-6 border border-red-500/20" role="alert">
              <FiAlertTriangle size={18} />
              <p className="m-0">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <Input
              label="Numero de Cedula"
              name="cedula"
              type="text"
              placeholder="0955236773"
              value={formData.cedula}
              onChange={handleChange}
              error={errors.cedula}
              icon={<FiCreditCard />}
              required
              autoComplete="username"
              maxLength={13}
            />

            <div className="relative">
              <Input
                label="Contrasena"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimo 8 caracteres"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<FiLock />}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute top-[34px] right-3 bg-none border-none text-slate-400 cursor-pointer p-1 flex items-center transition-colors duration-150 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}>
              Iniciar Sesion
            </Button>
          </form>

          {/* Tip de prueba */}
          <div className="mt-6 py-3.5 px-4 bg-info-light rounded-lg border border-blue-500/15">
            <p className="m-0 text-[0.8125rem] text-slate-600 leading-relaxed">
              <FiInfo size={14} className="inline align-middle mr-1.5" /><strong className="text-primary-700">Credenciales de prueba:</strong> (password: <code className="bg-primary-100 px-1.5 py-px rounded text-xs font-mono text-primary-800">Test2026!</code>)
            </p>
            <p className="m-0 text-[0.8125rem] text-slate-600 leading-relaxed mt-1">
              <span className="font-medium">Estudiante:</span> <code className="bg-primary-100 px-1.5 py-px rounded text-xs font-mono text-primary-800">0955236773</code> (Bryan Galarza)
            </p>
            <p className="m-0 text-[0.8125rem] text-slate-600 leading-relaxed">
              <span className="font-medium">Empresa:</span> <code className="bg-primary-100 px-1.5 py-px rounded text-xs font-mono text-primary-800">0990123456</code> (TechSolutions)
            </p>
            <p className="m-0 text-[0.8125rem] text-slate-600 leading-relaxed">
              <span className="font-medium">Gestor PPP:</span> <code className="bg-primary-100 px-1.5 py-px rounded text-xs font-mono text-primary-800">0900000002</code> (Cesar Mero)
            </p>
            <p className="m-0 text-[0.8125rem] text-slate-600 leading-relaxed">
              <span className="font-medium">Admin:</span> <code className="bg-primary-100 px-1.5 py-px rounded text-xs font-mono text-primary-800">0900000001</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
