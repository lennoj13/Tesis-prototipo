'use client';

/**
 * Nueva Vacante — Formulario real con envío a la API.
 * Módulo 3: Gestión de Vacantes (vista empresa)
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import vacancyService from '@/services/vacancyService';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/Button';
import { FiArrowLeft, FiSave, FiAlertTriangle } from 'react-icons/fi';
import Link from 'next/link';

const areas = [
  'Desarrollo Web', 'Desarrollo Backend', 'Desarrollo Móvil',
  'Data Science', 'Diseño UX/UI', 'Marketing Digital',
  'Contabilidad', 'Finanzas', 'Recursos Humanos',
  'IT Support', 'Redes y Telecomunicaciones',
  'Cloud Computing', 'Ciberseguridad', 'Otro',
];

const modalidades = ['Presencial', 'Remoto', 'Híbrido'];

export default function NuevaVacante() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: '', description: '', requirements: '',
    area: '', modality: 'Presencial', location: 'Guayaquil',
    slots: 1, expires_at: '',
  });
  const [errors, setErrors] = useState({});

  function validate() {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'El título es obligatorio';
    if (!form.description.trim() || form.description.length < 20) newErrors.description = 'Mínimo 20 caracteres';
    if (!form.area) newErrors.area = 'Selecciona un área';
    if (!form.expires_at) newErrors.expires_at = 'La fecha límite es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await vacancyService.create({
        title: form.title,
        description: form.description,
        requirements: form.requirements,
        area: form.area,
        modality: form.modality,
        location: form.location,
        slots: parseInt(form.slots) || 1,
        expires_at: form.expires_at,
      });

      if (res.result) {
        router.push('/dashboard/empresa/vacantes');
      } else {
        setError(res.message || 'Error al crear la vacante');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al conectar con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldBase = `w-full py-2.5 px-3.5 text-[0.9375rem] text-slate-800 bg-white border-[1.5px] rounded-lg outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:ring-3 focus:ring-primary-100`;
  const fieldErr = `border-danger focus:ring-danger-light`;
  const fieldOk = `border-slate-300`;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Publicar Vacante de Prácticas"
        subtitle="Completa la información para crear una nueva oportunidad"
        action={
          <Link href="/dashboard/empresa/vacantes">
            <Button variant="ghost" icon={<FiArrowLeft />}>Volver</Button>
          </Link>
        }
      />

      {error && (
        <div className="flex items-center gap-2.5 py-3 px-4 bg-danger-light text-danger rounded-lg text-sm font-medium mb-4 border border-red-500/20 max-w-3xl">
          <FiAlertTriangle size={18} />
          <p className="m-0">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 max-w-3xl">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Título del puesto <span className="text-danger">*</span></label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Ej: Practicante Desarrollo Frontend" className={`${fieldBase} ${errors.title ? fieldErr : fieldOk}`} />
            {errors.title && <p className="text-[0.8125rem] text-danger">{errors.title}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Descripción <span className="text-danger">*</span></label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe las actividades del practicante..." className={`${fieldBase} resize-y min-h-[100px] ${errors.description ? fieldErr : fieldOk}`} />
            {errors.description && <p className="text-[0.8125rem] text-danger">{errors.description}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Requisitos</label>
            <textarea name="requirements" value={form.requirements} onChange={handleChange} rows={3} placeholder="- Estudiante de Ing. en Software (7mo semestre o superior)&#10;- Conocimiento en React" className={`${fieldBase} resize-y min-h-[80px] ${fieldOk}`} />
          </div>

          <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Área <span className="text-danger">*</span></label>
              <select name="area" value={form.area} onChange={handleChange} className={`${fieldBase} ${errors.area ? fieldErr : fieldOk}`}>
                <option value="">Seleccionar...</option>
                {areas.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              {errors.area && <p className="text-[0.8125rem] text-danger">{errors.area}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Modalidad <span className="text-danger">*</span></label>
              <select name="modality" value={form.modality} onChange={handleChange} className={`${fieldBase} ${fieldOk}`}>
                {modalidades.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Ubicación</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="Guayaquil" className={`${fieldBase} ${fieldOk}`} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Plazas</label>
              <input name="slots" type="number" value={form.slots} onChange={handleChange} min="1" className={`${fieldBase} ${fieldOk}`} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Fecha límite <span className="text-danger">*</span></label>
              <input name="expires_at" type="date" value={form.expires_at} onChange={handleChange} className={`${fieldBase} ${errors.expires_at ? fieldErr : fieldOk}`} />
              {errors.expires_at && <p className="text-[0.8125rem] text-danger">{errors.expires_at}</p>}
            </div>
          </div>

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
