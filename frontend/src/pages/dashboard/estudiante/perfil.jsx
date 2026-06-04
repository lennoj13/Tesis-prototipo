
/**
 * Estudiante Perfil — Perfil real cargado de la API.
 * Módulo 2: Perfil Académico
 */

import { useState, useEffect } from 'react';
import PageHeader from 'components/PageHeader';
import Button from 'components/Button';
import Input from 'components/Input';
import { useAuth } from 'context/AuthContext';
import profileService from 'services/profileService';
import adminService from 'services/adminService';
import { FiSave, FiPlus, FiX } from 'react-icons/fi';

// Eliminamos las listas de carreras y semestres porque vienen precargadas del SIUG.

export default function EstudiantePerfil() {
  const { user } = useAuth();

  const [habilidades, setHabilidades] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: '', lastname: '', email: '', phone: '',
    career: '', semester: '', university: 'Universidad de Guayaquil',
    interests: '', experience_summary: '',
  });

  const normalizeSkill = (skill, defaultLevel = 3) => {
    const rawName = skill?.name || skill?.nombre || skill?.habilidad_nombre || skill || '';
    const name = typeof rawName === 'string' ? rawName.trim() : '';
    if (!name) return null;
    const rawLevel = skill?.nivel ?? skill?.level ?? defaultLevel;
    const parsedLevel = Number(rawLevel);
    const level = Number.isFinite(parsedLevel) ? parsedLevel : defaultLevel;
    return {
      skill_id: skill?.habilidad_id || skill?.skill_id || skill?.id || null,
      name,
      level: Math.min(Math.max(level, 1), 5),
      category: skill?.categoria || skill?.category || null,
    };
  };

  const skillKey = (value) => (value || '').toString().trim().toLowerCase();

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

          setForm({
            name: p.nombre || '', lastname: p.apellido || '',
            email: p.correo || '', phone: p.telefono || '',
            career: d.carrera_nombre ? (d.carrera_nombre.toLowerCase() === 'software' ? 'Software' : d.carrera_nombre) : 'Software', 
            semester: d.semestre ? `${d.semestre}º semestre` : '7mo semestre',
            university: d.universidad || 'Universidad de Guayaquil',
            interests: d.intereses || '', experience_summary: d.resumen_experiencia || '',
          });
          setHabilidades(
            (d.skills || [])
              .map((s) => normalizeSkill(s))
              .filter(Boolean)
          );
        }
        if (skillsRes.result) {
          const normalizedSkills = (skillsRes.data || [])
            .map((s) => ({
              skill_id: s.habilidad_id || s.skill_id || s.id || null,
              name: s.nombre || s.name || '',
              category: s.categoria || s.category || null,
            }))
            .filter((s) => s.name);
          setAllSkills(normalizedSkills);
        }
      } catch (err) {
        console.error('Error cargando perfil:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const toggleHabilidad = (skill) => {
    const normalized = normalizeSkill(skill);
    if (!normalized) return;
    const key = skillKey(normalized.name);
    setHabilidades((prev) =>
      prev.some((h) => skillKey(h.name) === key)
        ? prev.filter((h) => skillKey(h.name) !== key)
        : [...prev, normalized]
    );
  };

  const updateSkillLevel = (name, level) => {
    const key = skillKey(name);
    const parsedLevel = Math.min(Math.max(parseInt(level, 10) || 1, 1), 5);
    setHabilidades((prev) =>
      prev.map((h) => (skillKey(h.name) === key ? { ...h, level: parsedLevel } : h))
    );
  };

  const handleAddCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (!trimmed) return;
    const key = skillKey(trimmed);
    const existingCatalog = allSkills.find((s) => skillKey(s.name) === key);
    if (existingCatalog) {
      toggleHabilidad(existingCatalog);
      setCustomSkill('');
      return;
    }
    setHabilidades((prev) => {
      if (prev.some((h) => skillKey(h.name) === key)) {
        return prev;
      }
      return [...prev, { skill_id: null, name: trimmed, level: 3, category: null, is_custom: true }];
    });
    setCustomSkill('');
  };

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      await profileService.updateProfile({
        ...form,
        skills: habilidades.map((skill) => ({
          skill_id: skill.skill_id || null,
          name: skill.name,
          level: skill.level || 1,
          category: skill.category || null,
        })),
      });
      setGuardado(true);
      setTimeout(() => setGuardado(false), 3000);
    } catch (err) {
      console.error('Error guardando perfil:', err);
    } finally {
      setGuardando(false);
    }
  };

  const fieldBase = `w-full py-2.5 px-3.5 text-[0.9375rem] text-slate-800 bg-white border-[1.5px] border-slate-300 rounded-md outline-none transition-all placeholder:text-slate-400 focus:border-[var(--color-header-bg)] focus:ring-3 focus:ring-[var(--color-header-bg)]`;
  const profileInputClass = 'focus:border-[var(--color-header-bg)] focus:ring-[var(--color-header-bg)]';
  const sectionClass = 'bg-white border border-slate-200 rounded-md';
  const sectionHeaderClass = 'bg-[#3c8dbc] text-white text-xs font-bold uppercase tracking-wider px-4 py-2';
  const sectionBodyClass = 'p-5';
  const displaySkills = allSkills.length > 0 ? allSkills : [
    { name: 'JavaScript' }, { name: 'Python' }, { name: 'React' }, { name: 'Node.js' },
    { name: 'SQL' }, { name: 'Java' }, { name: 'TypeScript' }, { name: 'Git' },
    { name: 'Excel' }, { name: 'Power BI' }, { name: 'Figma' }, { name: 'Flask' },
  ];

  if (loading) {
    return <div className="animate-fade-in p-12 text-center text-slate-400">Cargando perfil...</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="w-full">
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

        <div className="flex flex-col gap-6">
        {/* Datos personales */}
        <section className={sectionClass}>
          <div className={sectionHeaderClass}>Datos Personales</div>
          <div className={`${sectionBodyClass} flex flex-col gap-4`}>
            <div className="flex items-center gap-5 mb-2">
              <div className="w-20 h-20 rounded-full bg-[#3c8dbc] text-white text-2xl font-bold flex items-center justify-center flex-shrink-0 border border-[#2f6f92]">
                {(form.name || 'E').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">{form.name} {form.lastname}</p>
                <p className="text-sm text-slate-500">{form.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <Input label="Nombre" value={form.name} disabled placeholder="Tu nombre" inputClassName={profileInputClass} />
              <Input label="Apellido" value={form.lastname} disabled placeholder="Tu apellido" inputClassName={profileInputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <Input label="Correo institucional" type="email" value={form.email} disabled placeholder="usuario@ug.edu.ec" inputClassName={profileInputClass} />
              <Input label="Teléfono" type="tel" value={form.phone} disabled placeholder="0998094515" inputClassName={profileInputClass} />
            </div>
          </div>
        </section>

        {/* Formación académica */}
        <section className={sectionClass}>
          <div className={sectionHeaderClass}>Formación Académica</div>
          <div className={`${sectionBodyClass} flex flex-col gap-4`}>
            <p className="text-xs text-slate-500">Facultad de {user?.facultad_nombre}</p>
            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <Input 
                label="Carrera" 
                value={form.career} 
                disabled 
                placeholder="Ingeniería en Software" 
                inputClassName={profileInputClass}
              />
              <Input 
                label="Semestre actual" 
                value={form.semester} 
                disabled 
                placeholder="7mo semestre" 
                inputClassName={profileInputClass}
              />
            </div>
            <Input label="Áreas de interés" value={form.interests} onChange={(e) => setForm(p => ({...p, interests: e.target.value}))} placeholder="Ej: Desarrollo Web, Ciencia de Datos, Redes" inputClassName={profileInputClass} />
          </div>
        </section>

        {/* Habilidades */}
        <section className={sectionClass}>
          <div className={sectionHeaderClass}>Habilidades y Competencias</div>
          <div className={`${sectionBodyClass} flex flex-col gap-4`}>
            <p className="text-xs text-slate-500">Selecciona las habilidades que coincidan con tu perfil.</p>
          {habilidades.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-md">
              {habilidades.map((hab) => (
                <div key={hab.skill_id || hab.name} className="inline-flex items-center gap-2 px-2.5 py-1 bg-white border border-slate-200 text-xs rounded-md">
                  <span className="font-semibold text-primary-700">{hab.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500">Nivel</span>
                    <select
                      value={hab.level}
                      onChange={(e) => updateSkillLevel(hab.name, e.target.value)}
                      className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-md px-1.5 py-0.5"
                      aria-label={`Nivel de ${hab.name}`}
                    >
                      {[1, 2, 3, 4, 5].map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => toggleHabilidad(hab)}
                    className="flex items-center justify-center w-4 h-4 rounded-md bg-slate-200 text-slate-700 border border-slate-300 cursor-pointer hover:bg-slate-300 transition-colors"
                    aria-label={`Quitar ${hab.name}`}
                  >
                    <FiX size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <div className="flex items-end gap-2 max-sm:flex-col max-sm:items-stretch">
              <Input
                label="Agregar habilidad manual"
                placeholder="Ej: Docker, Scrum, UX"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                className="flex-1"
                inputClassName={profileInputClass}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomSkill();
                  }
                }}
              />
              <Button
                size="sm"
                variant="outline"
                icon={<FiPlus />}
                onClick={handleAddCustomSkill}
                className="mb-0.5"
              >
                Agregar
              </Button>
            </div>
            <p className="text-[11px] text-slate-500">Si no encuentras la habilidad en la lista, agrégala manualmente.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {displaySkills.map((hab) => (
              <button
                key={hab.skill_id || hab.name}
                onClick={() => toggleHabilidad(hab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border cursor-pointer transition-all
                  ${habilidades.some((h) => skillKey(h.name) === skillKey(hab.name))
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-primary-300 hover:text-primary-600'
                  }`}
              >
                {hab.name}
              </button>
            ))}
          </div>
          </div>
        </section>

        {/* Experiencia */}
        <section className={sectionClass}>
          <div className={sectionHeaderClass}>Experiencia Previa</div>
          <div className={sectionBodyClass}>
            <textarea
              rows={4}
              value={form.experience_summary}
              onChange={(e) => setForm((prev) => ({ ...prev, experience_summary: e.target.value }))}
              placeholder="Describe brevemente tu experiencia previa"
              className={`${fieldBase} resize-y min-h-[100px]`}
            />
          </div>
        </section>
      </div>
    </div>
    </div>
  );
}
