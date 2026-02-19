'use client';

/**
 * Nueva Vacante — Formulario de creación de vacante de prácticas.
 * Módulo 3: Gestión de Vacantes (vista empresa)
 * Contexto: Prácticas preprofesionales — Universidad de Guayaquil
 */

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/Button';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import Link from 'next/link';

const areas = [
  'Desarrollo Web', 'Desarrollo Backend', 'Desarrollo Móvil',
  'Data Science', 'Diseño UX/UI', 'Marketing Digital',
  'Contabilidad', 'Finanzas', 'Recursos Humanos',
  'IT Support', 'Redes y Telecomunicaciones',
  'Cloud Computing', 'Ciberseguridad', 'Otro',
];

const modalidades = ['Presencial', 'Remoto', 'Híbrido'];

const carrerasRelacionadas = [
  'Ingeniería en Software',
  'Ingeniería en Sistemas Computacionales',
  'Ingeniería en Networking y Telecomunicaciones',
  'Ingeniería Civil',
  'Ingeniería Industrial',
  'Matemáticas',
  'Estadística',
  'Todas las carreras',
];

export default function NuevaVacante() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    // TODO: Conectar con API Flask — POST /api/vacantes
    await new Promise((r) => setTimeout(r, 1000)); // Simular
    console.log('Vacante creada:', data);
    router.push('/dashboard/empresa/vacantes');
  };

  const fieldBase = `w-full py-2.5 px-3.5 text-[0.9375rem] text-slate-800 bg-white border-[1.5px] rounded-lg outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:ring-3 focus:ring-primary-100`;
  const fieldError = `border-danger focus:ring-danger-light`;
  const fieldNormal = `border-slate-300`;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Publicar Vacante de Prácticas"
        subtitle="Completa la información para crear una nueva oportunidad de prácticas preprofesionales"
        action={
          <Link href="/dashboard/empresa/vacantes">
            <Button variant="ghost" icon={<FiArrowLeft />}>Volver</Button>
          </Link>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 max-w-3xl">
        <div className="flex flex-col gap-5">
          {/* Título */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Título del puesto de prácticas <span className="text-danger">*</span>
            </label>
            <input
              {...register('titulo', { required: 'El título es obligatorio' })}
              placeholder="Ej: Practicante Desarrollo Frontend"
              className={`${fieldBase} ${errors.titulo ? fieldError : fieldNormal}`}
            />
            {errors.titulo && <p className="input-error-msg text-[0.8125rem] text-danger flex items-center gap-1">{errors.titulo.message}</p>}
          </div>

          {/* Descripción de actividades */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Descripción de actividades <span className="text-danger">*</span>
            </label>
            <textarea
              {...register('descripcion', { required: 'La descripción es obligatoria', minLength: { value: 20, message: 'Mínimo 20 caracteres' } })}
              rows={4}
              placeholder="Describe las actividades y responsabilidades que realizará el practicante..."
              className={`${fieldBase} resize-y min-h-[100px] ${errors.descripcion ? fieldError : fieldNormal}`}
            />
            {errors.descripcion && <p className="input-error-msg text-[0.8125rem] text-danger flex items-center gap-1">{errors.descripcion.message}</p>}
          </div>

          {/* Requisitos técnicos */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Requisitos técnicos <span className="text-danger">*</span>
            </label>
            <textarea
              {...register('requisitos', { required: 'Los requisitos son obligatorios' })}
              rows={3}
              placeholder="- Estudiante de Ing. en Software (7mo semestre o superior)&#10;- Conocimiento en React y Node.js&#10;- Nivel básico de inglés"
              className={`${fieldBase} resize-y min-h-[80px] ${errors.requisitos ? fieldError : fieldNormal}`}
            />
            {errors.requisitos && <p className="input-error-msg text-[0.8125rem] text-danger flex items-center gap-1">{errors.requisitos.message}</p>}
          </div>

          {/* Área y Modalidad */}
          <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Área <span className="text-danger">*</span>
              </label>
              <select
                {...register('area', { required: 'Selecciona un área' })}
                className={`${fieldBase} ${errors.area ? fieldError : fieldNormal}`}
              >
                <option value="">Seleccionar...</option>
                {areas.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              {errors.area && <p className="input-error-msg text-[0.8125rem] text-danger flex items-center gap-1">{errors.area.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Modalidad <span className="text-danger">*</span>
              </label>
              <select
                {...register('modalidad', { required: 'Selecciona la modalidad' })}
                className={`${fieldBase} ${errors.modalidad ? fieldError : fieldNormal}`}
              >
                <option value="">Seleccionar...</option>
                {modalidades.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              {errors.modalidad && <p className="input-error-msg text-[0.8125rem] text-danger flex items-center gap-1">{errors.modalidad.message}</p>}
            </div>
          </div>

          {/* Carreras relacionadas y Plazas */}
          <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Carreras relacionadas <span className="text-danger">*</span>
              </label>
              <select
                {...register('carreraRelacionada', { required: 'Selecciona una carrera' })}
                className={`${fieldBase} ${errors.carreraRelacionada ? fieldError : fieldNormal}`}
              >
                <option value="">Seleccionar...</option>
                {carrerasRelacionadas.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.carreraRelacionada && <p className="input-error-msg text-[0.8125rem] text-danger flex items-center gap-1">{errors.carreraRelacionada.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Plazas disponibles <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                {...register('plazas', { required: 'Indica el número de plazas', min: { value: 1, message: 'Mínimo 1 plaza' } })}
                placeholder="Ej: 2"
                className={`${fieldBase} ${errors.plazas ? fieldError : fieldNormal}`}
              />
              {errors.plazas && <p className="input-error-msg text-[0.8125rem] text-danger flex items-center gap-1">{errors.plazas.message}</p>}
            </div>
          </div>

          {/* Ubicación y Fecha límite */}
          <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Ubicación</label>
              <input
                {...register('ubicacion')}
                placeholder="Ej: Guayaquil, Ecuador"
                className={`${fieldBase} ${fieldNormal}`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Fecha límite de postulación <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                {...register('fechaLimite', { required: 'La fecha límite es obligatoria' })}
                className={`${fieldBase} ${errors.fechaLimite ? fieldError : fieldNormal}`}
              />
              {errors.fechaLimite && <p className="input-error-msg text-[0.8125rem] text-danger flex items-center gap-1">{errors.fechaLimite.message}</p>}
            </div>
          </div>

          {/* Competencias requeridas */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Competencias requeridas</label>
            <input
              {...register('competencias')}
              placeholder="Ej: React, Python, SQL, Trabajo en equipo (separadas por coma)"
              className={`${fieldBase} ${fieldNormal}`}
            />
            <p className="text-xs text-slate-500">Estas competencias se usarán para el matching semántico con los perfiles de los estudiantes.</p>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 mt-2">
            <Link href="/dashboard/empresa/vacantes">
              <Button variant="secondary" type="button">Cancelar</Button>
            </Link>
            <Button type="submit" icon={<FiSave />} loading={isSubmitting}>
              Publicar Vacante
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
