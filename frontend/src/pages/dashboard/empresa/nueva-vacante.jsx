/**
 * Nueva Vacante — Formulario real con envío a la API.
 * Módulo 3: Gestión de Vacantes (vista empresa)
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import vacancyService from 'services/vacancyService';
import profileService from 'services/profileService';
import adminService from 'services/adminService';
import PageHeader from 'components/PageHeader';
import Button from 'components/Button';
import SkillSelector from 'components/SkillSelector';
import { FiArrowLeft, FiSave, FiAlertTriangle } from 'react-icons/fi';

const modalidades = ['Presencial', 'Remoto', 'Híbrido'];

export default function NuevaVacante() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: '', description: '', requirements: '',
    area: '', modality: 'Presencial', location: 'Guayaquil',
    total_hours: '', daily_hours: '', schedule: '',
    slots: 1, expires_at: '', supervisor_id: ''
  });
  const [newSupervisor, setNewSupervisor] = useState({
    numero_identificacion: '', nombre: '', apellido: '', correo: '', cargo: '', telefono: '', departamento: ''
  });
  const [errors, setErrors] = useState({});

  const [supervisores, setSupervisores] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [habilidades, setHabilidades] = useState([]);

  useEffect(() => {
    profileService.getMyProfile().then(res => {
      if (res.result && res.data?.details?.supervisores) {
        setSupervisores(res.data.details.supervisores);
      }
    });
    adminService.getSkills().then(res => {
      if (res.result && res.data) {
        const normalizedSkills = res.data.map(s => ({
          skill_id: s.habilidad_id || s.id || null,
          name: s.nombre || s.name || '',
          category: s.categoria || s.category || null,
        })).filter(s => s.name && s.category !== 'Ingenieria');
        setAllSkills(normalizedSkills);
      }
    });
  }, []);

  function validate() {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'El título es obligatorio';
    if (!form.description.trim() || form.description.length < 20) newErrors.description = 'Mínimo 20 caracteres';
    if (!form.requirements.trim()) newErrors.requirements = 'Los requisitos son obligatorios';
    if (!form.area) newErrors.area = 'Selecciona un área';
    if (!form.location.trim()) newErrors.location = 'La ubicación es obligatoria';
    if (!form.total_hours) newErrors.total_hours = 'Total de horas es obligatorio';
    else if (parseInt(form.total_hours) > 240) newErrors.total_hours = 'Máximo 240 horas en total';
    if (!form.daily_hours) newErrors.daily_hours = 'Horas diarias es obligatorio';
    else if (parseInt(form.daily_hours) > 6) newErrors.daily_hours = 'Máximo 6 horas por día';
    if (!form.schedule.trim()) newErrors.schedule = 'El horario es obligatorio';
    if (!form.slots || form.slots < 1) newErrors.slots = 'Obligatorio';
    if (!form.expires_at) newErrors.expires_at = 'La fecha límite es obligatoria';
    
    if (!form.supervisor_id) {
      newErrors.supervisor_id = 'Selecciona un supervisor';
    } else if (form.supervisor_id === 'new') {
      if (!newSupervisor.nombre.trim()) newErrors.sup_nombre = 'El nombre es obligatorio';
      if (!newSupervisor.apellido.trim()) newErrors.sup_apellido = 'El apellido es obligatorio';
      if (!newSupervisor.correo.trim()) newErrors.sup_correo = 'El correo es obligatorio';
      if (!newSupervisor.numero_identificacion.trim()) newErrors.sup_identificacion = 'La cédula es obligatoria';
      if (!newSupervisor.cargo.trim()) newErrors.sup_cargo = 'El cargo es obligatorio';
      if (!newSupervisor.departamento.trim()) newErrors.sup_departamento = 'El departamento es obligatorio';
      if (!newSupervisor.telefono.trim()) newErrors.sup_telefono = 'El teléfono es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'area' && value.length > 0) {
      newValue = value.charAt(0).toUpperCase() + value.slice(1);
    }
    setForm(prev => ({ ...prev, [name]: newValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        requirements: form.requirements,
        area: form.area,
        modality: form.modality,
        location: form.location,
        total_hours: form.total_hours ? parseInt(form.total_hours, 10) : null,
        daily_hours: form.daily_hours ? parseInt(form.daily_hours, 10) : null,
        schedule: form.schedule || null,
        slots: parseInt(form.slots) || 1,
        expires_at: form.expires_at,
        supervisor_id: form.supervisor_id === 'new' ? 'new' : parseInt(form.supervisor_id, 10) || null,
        new_supervisor: form.supervisor_id === 'new' ? newSupervisor : null,
        skills: habilidades.map(skill => ({
          skill_id: skill.skill_id || null,
          name: skill.name,
          required_level: skill.level || 1,
          category: skill.category || null,
          is_optional: skill.is_optional || false
        })),
      };

      const res = await vacancyService.create(payload);
      if (res.result) {
        navigate('/dashboard/empresa/vacantes');
      } else {
        setError(res.message || 'Error al crear vacante');
      }
    } catch (err) {
      setError('Error al conectar con el servidor. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldBase = `px-3 py-2 text-sm bg-white border rounded-md outline-none transition-colors w-full`;
  const fieldErr = `border-danger focus:ring-danger-light`;
  const fieldOk = `border-slate-300`;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Publicar Vacante de Prácticas"
        subtitle="Completa la información para crear una nueva oportunidad"
        action={
          <Link to="/dashboard/empresa/vacantes">
            <Button variant="ghost" icon={<FiArrowLeft />}>Volver</Button>
          </Link>
        }
      />

      {error && (
        <div className="flex items-center gap-2.5 py-3 px-4 bg-danger-light text-danger rounded-md text-sm font-medium mb-4 border border-red-500/20 w-full mx-auto">
          <FiAlertTriangle size={18} />
          <p className="m-0">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full mx-auto bg-white border border-slate-200 rounded-md overflow-hidden">
        <div className="bg-[#3c8dbc] text-white text-xs font-bold uppercase tracking-wider px-4 py-2">Información de la Vacante</div>
        <div className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Título del puesto <span className="text-danger">*</span></label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Ej: Practicante Desarrollo Frontend" className={`${fieldBase} ${errors.title ? fieldErr : fieldOk}`} />
            {errors.title && <p className="text-[0.8125rem] text-danger">{errors.title}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-end">
              <label className="text-sm font-semibold text-slate-700">Descripción <span className="text-danger">*</span></label>
              <span className="text-xs text-slate-400">{form.description?.length || 0}/800</span>
            </div>
            <textarea name="description" maxLength={800} value={form.description} onChange={handleChange} rows={4} placeholder="Describe las actividades del practicante..." className={`${fieldBase} resize-y min-h-[100px] ${errors.description ? fieldErr : fieldOk}`} />
            {errors.description && <p className="text-[0.8125rem] text-danger">{errors.description}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-end">
              <label className="text-sm font-semibold text-slate-700">Requisitos en texto <span className="text-danger">*</span></label>
              <span className="text-xs text-slate-400">{form.requirements?.length || 0}/800</span>
            </div>
            <textarea name="requirements" maxLength={800} value={form.requirements} onChange={handleChange} rows={3} placeholder="- Estudiante de Ing. en Software (8vo semestre o superior)&#10;- Conocimiento en React" className={`${fieldBase} resize-y min-h-[80px] ${errors.requirements ? fieldErr : fieldOk}`} />
            {errors.requirements && <p className="text-[0.8125rem] text-danger">{errors.requirements}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Habilidades Específicas Solicitadas</label>
            <p className="text-xs text-slate-500 mb-2">Selecciona las habilidades necesarias para esta vacante.</p>
            <SkillSelector 
              selectedSkills={habilidades} 
              allSkills={allSkills} 
              onChange={setHabilidades} 
              isVacancy={true} 
            />
          </div>

          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Área o Departamento <span className="text-danger">*</span></label>
              <input name="area" list="areas-list" value={form.area} onChange={handleChange} placeholder="Ej: Desarrollo de Software, QA..." className={`${fieldBase} ${errors.area ? fieldErr : fieldOk}`} />
              <datalist id="areas-list">
                <option value="Desarrollo de Software" />
                <option value="Desarrollo Web" />
                <option value="Desarrollo Móvil" />
                <option value="Inteligencia Artificial" />
                <option value="Base de Datos" />
                <option value="Infraestructura y Redes" />
                <option value="Seguridad Informática" />
                <option value="Soporte Técnico" />
                <option value="Gestión de Proyectos de TI" />
                <option value="QA y Pruebas" />
              </datalist>
              {errors.area && <p className="text-[0.8125rem] text-danger">{errors.area}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Modalidad <span className="text-danger">*</span></label>
              <select name="modality" value={form.modality} onChange={handleChange} className={`${fieldBase} ${fieldOk}`}>
                {modalidades.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label className="text-sm font-semibold text-slate-700">Supervisor Responsable <span className="text-danger">*</span></label>
              <select name="supervisor_id" value={form.supervisor_id} onChange={handleChange} className={`${fieldBase} ${errors.supervisor_id ? fieldErr : fieldOk}`}>
                <option value="">Seleccionar supervisor...</option>
                {supervisores.map((sup) => (
                  <option key={sup.supervisor_id} value={sup.supervisor_id}>{sup.nombre} ({sup.cargo})</option>
                ))}
                <option value="new" className="font-bold text-primary-600">+ Registrar Nuevo Supervisor</option>
              </select>
              {errors.supervisor_id && <p className="text-[0.8125rem] text-danger">{errors.supervisor_id}</p>}
            </div>
            
            {form.supervisor_id === 'new' && (
              <div className="md:col-span-3 p-4 bg-primary-50 rounded-md border border-primary-100 flex flex-col gap-3 mt-2 animate-fade-in">
                <h4 className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-1">Datos del Nuevo Supervisor</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">Nombre <span className="text-danger">*</span></label>
                    <input value={newSupervisor.nombre} onChange={e => {setNewSupervisor(p => ({...p, nombre: e.target.value})); if(errors.sup_nombre) setErrors(p => ({...p, sup_nombre: ''}));}} placeholder="Juan" className={`${fieldBase} ${errors.sup_nombre ? fieldErr : fieldOk}`} />
                    {errors.sup_nombre && <p className="text-[0.8125rem] text-danger">{errors.sup_nombre}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">Apellido <span className="text-danger">*</span></label>
                    <input value={newSupervisor.apellido} onChange={e => {setNewSupervisor(p => ({...p, apellido: e.target.value})); if(errors.sup_apellido) setErrors(p => ({...p, sup_apellido: ''}));}} placeholder="Pérez" className={`${fieldBase} ${errors.sup_apellido ? fieldErr : fieldOk}`} />
                    {errors.sup_apellido && <p className="text-[0.8125rem] text-danger">{errors.sup_apellido}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">Correo <span className="text-danger">*</span></label>
                    <input type="email" value={newSupervisor.correo} onChange={e => {setNewSupervisor(p => ({...p, correo: e.target.value})); if(errors.sup_correo) setErrors(p => ({...p, sup_correo: ''}));}} className={`${fieldBase} ${errors.sup_correo ? fieldErr : fieldOk}`} />
                    {errors.sup_correo && <p className="text-[0.8125rem] text-danger">{errors.sup_correo}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">Cédula / Identificación <span className="text-danger">*</span></label>
                    <input value={newSupervisor.numero_identificacion} onChange={e => {setNewSupervisor(p => ({...p, numero_identificacion: e.target.value})); if(errors.sup_identificacion) setErrors(p => ({...p, sup_identificacion: ''}));}} className={`${fieldBase} ${errors.sup_identificacion ? fieldErr : fieldOk}`} />
                    {errors.sup_identificacion && <p className="text-[0.8125rem] text-danger">{errors.sup_identificacion}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">Cargo <span className="text-danger">*</span></label>
                    <input value={newSupervisor.cargo} onChange={e => {setNewSupervisor(p => ({...p, cargo: e.target.value})); if(errors.sup_cargo) setErrors(p => ({...p, sup_cargo: ''}));}} placeholder="Ej: Gerente de TI" className={`${fieldBase} ${errors.sup_cargo ? fieldErr : fieldOk}`} />
                    {errors.sup_cargo && <p className="text-[0.8125rem] text-danger">{errors.sup_cargo}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">Departamento <span className="text-danger">*</span></label>
                    <input value={newSupervisor.departamento} onChange={e => {setNewSupervisor(p => ({...p, departamento: e.target.value})); if(errors.sup_departamento) setErrors(p => ({...p, sup_departamento: ''}));}} placeholder="Ej: Tecnología" className={`${fieldBase} ${errors.sup_departamento ? fieldErr : fieldOk}`} />
                    {errors.sup_departamento && <p className="text-[0.8125rem] text-danger">{errors.sup_departamento}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">Teléfono <span className="text-danger">*</span></label>
                    <input type="tel" value={newSupervisor.telefono} onChange={e => {setNewSupervisor(p => ({...p, telefono: e.target.value})); if(errors.sup_telefono) setErrors(p => ({...p, sup_telefono: ''}));}} className={`${fieldBase} ${errors.sup_telefono ? fieldErr : fieldOk}`} />
                    {errors.sup_telefono && <p className="text-[0.8125rem] text-danger">{errors.sup_telefono}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Ubicación <span className="text-danger">*</span></label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="Guayaquil" className={`${fieldBase} ${errors.location ? fieldErr : fieldOk}`} />
              {errors.location && <p className="text-[0.8125rem] text-danger">{errors.location}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Plazas <span className="text-danger">*</span></label>
              <input name="slots" type="number" value={form.slots} onChange={handleChange} min="1" className={`${fieldBase} ${errors.slots ? fieldErr : fieldOk}`} />
              {errors.slots && <p className="text-[0.8125rem] text-danger">{errors.slots}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Fecha límite <span className="text-danger">*</span></label>
              <input name="expires_at" type="date" value={form.expires_at} onChange={handleChange} className={`${fieldBase} ${errors.expires_at ? fieldErr : fieldOk}`} />
              {errors.expires_at && <p className="text-[0.8125rem] text-danger">{errors.expires_at}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Total de horas <span className="text-danger">*</span></label>
              <input name="total_hours" type="number" value={form.total_hours} onChange={handleChange} min="1" placeholder="240" className={`${fieldBase} ${errors.total_hours ? fieldErr : fieldOk}`} />
              {errors.total_hours && <p className="text-[0.8125rem] text-danger">{errors.total_hours}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Horas al día <span className="text-danger">*</span></label>
              <input name="daily_hours" type="number" value={form.daily_hours} onChange={handleChange} min="1" placeholder="6" className={`${fieldBase} ${errors.daily_hours ? fieldErr : fieldOk}`} />
              {errors.daily_hours && <p className="text-[0.8125rem] text-danger">{errors.daily_hours}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Horario <span className="text-danger">*</span></label>
              <input name="schedule" value={form.schedule} onChange={handleChange} placeholder="Lunes a Viernes" className={`${fieldBase} ${errors.schedule ? fieldErr : fieldOk}`} />
              {errors.schedule && <p className="text-[0.8125rem] text-danger">{errors.schedule}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 mt-2">
            <Link to="/dashboard/empresa/vacantes">
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
