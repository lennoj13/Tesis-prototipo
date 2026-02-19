'use client';

/**
 * Estudiante Perfil — Formulario de perfil del estudiante.
 * Módulo 2: Perfil Académico
 * Contexto: Universidad de Guayaquil — Facultad de CC.MM.FF
 */

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuth } from '@/context/AuthContext';
import { FiSave, FiUpload, FiX } from 'react-icons/fi';

/* Carreras de la Facultad de Ciencias Matemáticas y Físicas — UG */
const carreras = [
  'Ingeniería en Software',
  'Ingeniería en Sistemas Computacionales',
  'Ingeniería en Networking y Telecomunicaciones',
  'Ingeniería Civil',
  'Ingeniería Industrial',
  'Matemáticas',
  'Estadística',
];

const semestres = [
  '1er semestre', '2do semestre', '3er semestre', '4to semestre',
  '5to semestre', '6to semestre', '7mo semestre', '8vo semestre',
  '9no semestre', '10mo semestre',
];

const habilidadesDisponibles = [
  'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Java',
  'TypeScript', 'Git', 'Excel', 'Power BI', 'Figma', 'Adobe XD',
  'Machine Learning', 'Data Analysis', 'AWS', 'Docker',
  'Inglés', 'Liderazgo', 'Trabajo en equipo', 'Comunicación',
  'Flask', 'Django', 'C#', '.NET', 'PHP', 'Laravel',
  'Angular', 'Vue.js', 'PostgreSQL', 'MongoDB',
];

export default function EstudiantePerfil() {
  const { user } = useAuth();
  const [habilidades, setHabilidades] = useState(['React', 'JavaScript', 'Python', 'Git']);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const toggleHabilidad = (hab) => {
    setHabilidades((prev) =>
      prev.includes(hab) ? prev.filter((h) => h !== hab) : [...prev, hab]
    );
  };

  const handleGuardar = async () => {
    setGuardando(true);
    // TODO: Conectar con API Flask — PUT /api/perfil
    await new Promise((r) => setTimeout(r, 1000));
    setGuardando(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 3000);
  };

  const fieldBase = `w-full py-2.5 px-3.5 text-[0.9375rem] text-slate-800 bg-white border-[1.5px] border-slate-300 rounded-lg outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:ring-3 focus:ring-primary-100`;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Mi Perfil Académico"
        subtitle="Completa tu perfil para mejorar la compatibilidad con las vacantes de prácticas"
        action={
          <Button
            icon={guardado ? null : <FiSave />}
            onClick={handleGuardar}
            loading={guardando}
            variant={guardado ? 'secondary' : 'primary'}
          >
            {guardado ? '✓ Guardado' : 'Guardar Perfil'}
          </Button>
        }
      />

      <div className="max-w-3xl flex flex-col gap-6">
        {/* Datos personales */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Datos Personales</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-5 mb-2">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-700 text-white text-2xl font-bold flex items-center justify-center flex-shrink-0">
                {user?.nombre?.charAt(0).toUpperCase() || 'E'}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">{user?.nombre || 'Estudiante'}</p>
                <p className="text-sm text-slate-500">{user?.email || 'correo@ug.edu.ec'}</p>
                <button className="mt-1.5 text-xs text-primary-600 font-medium hover:text-primary-700 bg-transparent border-none cursor-pointer p-0">
                  Cambiar foto
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <Input label="Nombre completo" required defaultValue={user?.nombre || ''} placeholder="Tu nombre completo" />
              <Input label="Cédula de identidad" required placeholder="Ej: 0912345678" />
            </div>
            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <Input label="Correo institucional" type="email" required defaultValue={user?.email || ''} placeholder="usuario@ug.edu.ec" disabled />
              <Input label="Teléfono" type="tel" placeholder="Ej: 0998094515" />
            </div>
          </div>
        </section>

        {/* Formación académica */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Formación Académica</h3>
          <p className="text-xs text-slate-500 mb-4">Universidad de Guayaquil — Facultad de Ciencias Matemáticas y Físicas</p>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Carrera <span className="text-danger">*</span></label>
                <select defaultValue="" className={fieldBase}>
                  <option value="" disabled>Seleccionar carrera...</option>
                  {carreras.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Semestre actual <span className="text-danger">*</span></label>
                <select defaultValue="" className={fieldBase}>
                  <option value="" disabled>Seleccionar semestre...</option>
                  {semestres.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <Input label="Áreas de interés" placeholder="Ej: Desarrollo Web, Ciencia de Datos, Redes" />
          </div>
        </section>

        {/* Habilidades */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">Habilidades y Competencias</h3>
          <p className="text-xs text-slate-500 mb-4">Selecciona las habilidades que coincidan con tu perfil. El motor NLP las usará para el matching.</p>

          {/* Skills seleccionados */}
          {habilidades.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 p-3 bg-primary-50/50 rounded-lg">
              {habilidades.map((hab) => (
                <span
                  key={hab}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full"
                >
                  {hab}
                  <button
                    onClick={() => toggleHabilidad(hab)}
                    className="flex items-center justify-center w-4 h-4 rounded-full bg-primary-200 text-primary-600 border-none cursor-pointer hover:bg-primary-300 transition-colors"
                  >
                    <FiX size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Todas las skills */}
          <div className="flex flex-wrap gap-2">
            {habilidadesDisponibles.map((hab) => (
              <button
                key={hab}
                onClick={() => toggleHabilidad(hab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border cursor-pointer transition-all
                  ${habilidades.includes(hab)
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300 hover:text-primary-600'
                  }`}
              >
                {hab}
              </button>
            ))}
          </div>
        </section>

        {/* CV Upload */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Curriculum Vitae</h3>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-primary-400 hover:bg-primary-50/30 transition-colors cursor-pointer">
            <FiUpload size={28} className="text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-700 mb-1">Arrastra tu CV aquí o haz clic para seleccionar</p>
            <p className="text-xs text-slate-500">PDF, DOC o DOCX — máximo 5MB</p>
          </div>
        </section>

        {/* Experiencia */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Experiencia Previa</h3>
          <div className="flex flex-col gap-4">
            <textarea
              rows={4}
              placeholder="Describe brevemente tu experiencia laboral, proyectos académicos o cualquier conocimiento relevante para tus prácticas preprofesionales..."
              className={`${fieldBase} resize-y min-h-[100px]`}
            />
            <p className="text-xs text-slate-500">Este texto será analizado por el motor NLP (SBERT) para calcular la similitud semántica con las vacantes disponibles.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
