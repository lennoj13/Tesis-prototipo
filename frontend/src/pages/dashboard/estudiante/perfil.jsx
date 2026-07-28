/**
 * Estudiante Perfil — Perfil cargado desde la API.
 * Módulo 2: Perfil Académico
 */

import { useState, useEffect } from 'react';
import PageHeader from 'components/PageHeader';
import Button from 'components/Button';
import Input from 'components/Input';
import { useAuth } from 'context/AuthContext';
import profileService from 'services/profileService';
import adminService from 'services/adminService';
import SkillSelector from 'components/SkillSelector';
import Modal from 'components/Modal';
import { FiSave, FiPlus, FiX, FiCheckCircle } from 'react-icons/fi';

export default function EstudiantePerfil() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '', lastname: '', email: '', phone: '',
    career: '', semester: '', university: 'Universidad de Guayaquil',
    interests: '', experience_summary: '',
  });

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
            semester: d.semestre ? String(d.semestre).replace(/\D/g, '') : '',
            university: d.universidad || 'Universidad de Guayaquil',
            interests: d.intereses || '', experience_summary: d.resumen_experiencia || '',
          });
          
          if (d.skills) {
            setHabilidades(d.skills.map(s => ({
              skill_id: s.habilidad_id || s.id || null,
              name: s.nombre || s.name || s.habilidad_nombre || '',
              level: s.nivel || s.level || 3,
              category: s.categoria || s.category || null,
            })).filter(s => s.name));
          }
        }
        if (skillsRes.result) {
          const normalizedSkills = (skillsRes.data || [])
            .map((s) => ({
              skill_id: s.habilidad_id || s.skill_id || s.id || null,
              name: s.nombre || s.name || '',
              category: s.categoria || s.category || null,
            }))
            .filter((s) => s.name && s.category !== 'Ingenieria');
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

  const [habilidades, setHabilidades] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);

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
      setShowSuccessModal(true);
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
                value={form.semester ? `${form.semester}º Semestre` : 'No especificado'} 
                disabled 
                placeholder="8º Semestre" 
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
            <SkillSelector 
              selectedSkills={habilidades} 
              allSkills={allSkills} 
              onChange={setHabilidades} 
              isVacancy={false} 
            />
          </div>
        </section>

        {/* Experiencia */}
        <section className={sectionClass}>
          <div className={sectionHeaderClass}>Experiencia Previa</div>
          <div className={sectionBodyClass}>
            <textarea
              rows={4}
              maxLength={800}
              value={form.experience_summary}
              onChange={(e) => setForm((prev) => ({ ...prev, experience_summary: e.target.value }))}
              placeholder="Describe brevemente tu experiencia previa"
              className={`${fieldBase} resize-y min-h-[100px]`}
            />
            <p className="text-xs text-slate-500 mt-2 text-right">{form.experience_summary?.length || 0}/800 caracteres</p>
          </div>
        </section>
      </div>
      </div>

      {/* Modal de Éxito */}
      <Modal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        title="Perfil Actualizado"
        size="sm"
        footer={
          <div className="flex justify-end w-full">
            <Button variant="primary" onClick={() => setShowSuccessModal(false)}>Entendido</Button>
          </div>
        }
      >
        <div className="flex flex-col items-center text-center p-2 gap-4">
          <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center text-green-600 mb-1 border border-green-200">
            <FiCheckCircle size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">¡Cambios Guardados!</h3>
            <p className="text-sm text-slate-600 leading-relaxed m-0">
              Tu perfil académico y tus habilidades se han actualizado correctamente. 
              El motor de Inteligencia Artificial usará esta información para recomendarte las mejores vacantes.
            </p>
          </div>
        </div>
      </Modal>

    </div>
  );
}
