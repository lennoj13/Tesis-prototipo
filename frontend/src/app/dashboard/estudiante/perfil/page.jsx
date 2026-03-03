'use client';

/**
 * Estudiante Perfil — Perfil real cargado de la API.
 * Módulo 2: Perfil Académico
 */

import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuth } from '@/context/AuthContext';
import profileService from '@/services/profileService';
import adminService from '@/services/adminService';
import { FiSave, FiUpload, FiX } from 'react-icons/fi';

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

export default function EstudiantePerfil() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [habilidades, setHabilidades] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: '', lastname: '', email: '', phone: '',
    career: '', semester: '', university: 'Universidad de Guayaquil',
    interests: '', experience_summary: '',
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const [profRes, skillsRes] = await Promise.all([
          profileService.getMyProfile(),
          adminService.getSkills(),
        ]);
        if (profRes.result && profRes.data) {
          const p = profRes.data;
          const d = p.details || {};
          setProfile(p);
          setForm({
            name: p.name || '', lastname: p.lastname || '',
            email: p.email || '', phone: p.phone || '',
            career: d.career || '', semester: d.semester || '',
            university: d.university || 'Universidad de Guayaquil',
            interests: d.interests || '', experience_summary: d.experience_summary || '',
          });
          setHabilidades((d.skills || []).map(s => s.skill_name || s.name));
        }
        if (skillsRes.result) {
          setAllSkills((skillsRes.data || []).map(s => s.name));
        }
      } catch (err) {
        console.error('Error cargando perfil:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const toggleHabilidad = (hab) => {
    setHabilidades((prev) =>
      prev.includes(hab) ? prev.filter((h) => h !== hab) : [...prev, hab]
    );
  };

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      await profileService.updateProfile({
        ...form,
        skills: habilidades.map(name => {
          const skill = allSkills.find(s => s === name);
          return { skill_id: skill?.id || null, name, level: 3 };
        }),
      });
      setGuardado(true);
      setTimeout(() => setGuardado(false), 3000);
    } catch (err) {
      console.error('Error guardando perfil:', err);
    } finally {
      setGuardando(false);
    }
  };

  const fieldBase = `w-full py-2.5 px-3.5 text-[0.9375rem] text-slate-800 bg-white border-[1.5px] border-slate-300 rounded-lg outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:ring-3 focus:ring-primary-100`;
  const displaySkills = allSkills.length > 0 ? allSkills : [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Java',
    'TypeScript', 'Git', 'Excel', 'Power BI', 'Figma', 'Flask',
  ];

  if (loading) {
    return <div className="animate-fade-in p-12 text-center text-slate-400">Cargando perfil...</div>;
  }

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
                {(form.name || 'E').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">{form.name} {form.lastname}</p>
                <p className="text-sm text-slate-500">{form.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <Input label="Nombre" required value={form.name} onChange={(e) => setForm(p => ({...p, name: e.target.value}))} placeholder="Tu nombre" />
              <Input label="Apellido" required value={form.lastname} onChange={(e) => setForm(p => ({...p, lastname: e.target.value}))} placeholder="Tu apellido" />
            </div>
            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <Input label="Correo institucional" type="email" value={form.email} disabled placeholder="usuario@ug.edu.ec" />
              <Input label="Teléfono" type="tel" value={form.phone} onChange={(e) => setForm(p => ({...p, phone: e.target.value}))} placeholder="0998094515" />
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
                <select value={form.career} onChange={(e) => setForm(p => ({...p, career: e.target.value}))} className={fieldBase}>
                  <option value="">Seleccionar carrera...</option>
                  {carreras.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Semestre actual <span className="text-danger">*</span></label>
                <select value={form.semester} onChange={(e) => setForm(p => ({...p, semester: e.target.value}))} className={fieldBase}>
                  <option value="">Seleccionar semestre...</option>
                  {semestres.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <Input label="Áreas de interés" value={form.interests} onChange={(e) => setForm(p => ({...p, interests: e.target.value}))} placeholder="Ej: Desarrollo Web, Ciencia de Datos, Redes" />
          </div>
        </section>

        {/* Habilidades */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">Habilidades y Competencias</h3>
          <p className="text-xs text-slate-500 mb-4">Selecciona las habilidades que coincidan con tu perfil.</p>
          {habilidades.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 p-3 bg-primary-50/50 rounded-lg">
              {habilidades.map((hab) => (
                <span key={hab} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                  {hab}
                  <button onClick={() => toggleHabilidad(hab)} className="flex items-center justify-center w-4 h-4 rounded-full bg-primary-200 text-primary-600 border-none cursor-pointer hover:bg-primary-300 transition-colors">
                    <FiX size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {displaySkills.map((hab) => (
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

        {/* Experiencia */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Experiencia Previa</h3>
          <textarea
            rows={4}
            value={form.experience_summary}
            onChange={(e) => setForm(p => ({...p, experience_summary: e.target.value}))}
            placeholder="Describe brevemente tu experiencia laboral, proyectos académicos..."
            className={`${fieldBase} resize-y min-h-[100px]`}
          />
        </section>
      </div>
    </div>
  );
}
