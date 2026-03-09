'use client';

/**
 * Página de Registro — MatchPP.
 * Módulo 1 de la tesis: Gestión de Usuarios
 */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    login: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [errors, setErrors] = useState({});

  function validate() {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.lastname.trim()) newErrors.lastname = 'El apellido es obligatorio';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo válido';
    } else if (formData.role === 'student' && !formData.email.toLowerCase().endsWith('@ug.edu.ec')) {
      newErrors.email = 'Los estudiantes deben usar un correo institucional (@ug.edu.ec)';
    }
    if (!formData.login.trim()) newErrors.login = 'El nombre de usuario es obligatorio';
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (error) setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register({
        login: formData.login,
        password: formData.password,
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
      });

      if (response.result) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(response.message || 'Error al registrar');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md animate-fade-in">
          <FiCheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">¡Registro exitoso!</h2>
          <p className="text-slate-500">Serás redirigido al login en un momento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo — Branding */}
      <div className="brand-panel flex-1 bg-gradient-to-br from-primary-700 to-primary-900 text-white flex items-center justify-center p-12 relative overflow-hidden max-[960px]:hidden">
        <div className="relative max-w-[480px] z-10">
          <Logo size="lg" />
          <h1 className="text-[2rem] font-bold leading-tight mt-8 mb-4">
            Únete a MatchPP
          </h1>
          <p className="text-[1.0625rem] text-primary-200 leading-relaxed mb-6">
            Crea tu cuenta y comienza a encontrar las mejores prácticas preprofesionales para tu carrera.
          </p>
        </div>
      </div>

      {/* Panel derecho — Formulario */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-[480px] animate-fade-in">
          <div className="mb-6">
            <div className="hidden max-[960px]:block mb-6">
              <Logo size="md" />
            </div>
            <h2 className="text-[1.75rem] font-bold text-slate-900 mb-2">Crear Cuenta</h2>
            <p className="text-[0.9375rem] text-slate-500">
              Completa tus datos para registrarte
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 py-3 px-4 bg-danger-light text-danger rounded-lg text-sm font-medium mb-4 border border-red-500/20" role="alert">
              <FiAlertTriangle size={18} />
              <p className="m-0">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {/* Tipo de cuenta */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo de cuenta</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                    formData.role === 'student'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Estudiante
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'company' }))}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                    formData.role === 'company'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Empresa
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Nombre"
                name="name"
                placeholder="Carlos"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                icon={<FiUser />}
                required
              />
              <Input
                label="Apellido"
                name="lastname"
                placeholder="Mendoza"
                value={formData.lastname}
                onChange={handleChange}
                error={errors.lastname}
                icon={<FiUser />}
                required
              />
            </div>

            <div>
              <Input
                label="Correo electrónico"
                name="email"
                type="email"
                placeholder={formData.role === 'student' ? 'tucorreo@ug.edu.ec' : 'correo@empresa.com'}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={<FiMail />}
                required
              />
              {formData.role === 'student' && (
                <p className="text-xs text-slate-400 mt-1 ml-1">Solo se permiten correos institucionales (@ug.edu.ec)</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Usuario"
                name="login"
                placeholder="carlos.mendoza"
                value={formData.login}
                onChange={handleChange}
                error={errors.login}
                icon={<FiUser />}
                required
              />
              <Input
                label="Teléfono"
                name="phone"
                placeholder="0998094515"
                value={formData.phone}
                onChange={handleChange}
                icon={<FiPhone />}
              />
            </div>

            <div className="relative">
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
              />
              <button
                type="button"
                className="absolute top-[34px] right-3 bg-none border-none text-slate-400 cursor-pointer p-1 flex items-center transition-colors duration-150 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            <Input
              label="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={<FiLock />}
              required
            />

            <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}>
              Crear Cuenta
            </Button>
          </form>

          <div className="text-center mt-5 text-[0.9375rem] text-slate-600">
            <p>
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-primary-600 font-semibold hover:text-primary-700 hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
