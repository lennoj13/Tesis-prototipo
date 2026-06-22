
/**
 * Empresa Vacantes — Lista de vacantes con ver, editar y eliminar.
 * Módulo 3: Gestión de Vacantes
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import vacancyService from 'services/vacancyService';
import profileService from 'services/profileService';
import adminService from 'services/adminService';
import PageHeader from 'components/PageHeader';
import DataTable from 'components/DataTable';
import StatusBadge from 'components/StatusBadge';
import Modal from 'components/Modal';
import ConfirmDialog from 'components/ConfirmDialog';
import Button from 'components/Button';
import InfoField from 'components/InfoField';
import SkillSelector from 'components/SkillSelector';
import { FiEdit2, FiTrash2, FiEye, FiUsers, FiPlusCircle, FiSave, FiCheckCircle, FiClock, FiCalendar, FiMapPin, FiBriefcase, FiAlignLeft } from 'react-icons/fi';

const areas = [
  'Desarrollo Web', 'Desarrollo Backend', 'Desarrollo Móvil',
  'Data Science', 'Diseño UX/UI', 'Marketing Digital',
  'Contabilidad', 'Finanzas', 'Recursos Humanos',
  'IT Support', 'Redes y Telecomunicaciones',
  'Cloud Computing', 'Ciberseguridad', 'Otro',
];

const modalidades = ['Presencial', 'Remoto', 'Híbrido'];

function normalizeVacancy(row) {
  return {
    ...row,
    vacancy_id: row.vacancy_id ?? row.vacante_id,
    title: row.title ?? row.titulo,
    description: row.description ?? row.descripcion,
    requirements: row.requirements ?? row.requisitos,
    modality: row.modality ?? row.modalidad,
    location: row.location ?? row.ubicacion,
    total_hours: row.total_hours ?? row.total_horas,
    daily_hours: row.daily_hours ?? row.horas_diarias,
    schedule: row.schedule ?? row.horario,
    slots: row.slots ?? row.cupos,
    applications_count: row.applications_count ?? row.total_postulaciones,
    is_active: row.is_active ?? row.activo,
    expires_at: row.expires_at ?? row.fecha_expiracion,
    created_at: row.created_at ?? row.creado_en,
  };
}

export default function EmpresaVacantes() {
  const { user } = useAuth();
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supervisores, setSupervisores] = useState([]);
  const [viewModal, setViewModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [editSkills, setEditSkills] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const profRes = await profileService.getMyProfile();
        const companyId = profRes.data?.details?.institucion_id || profRes.data?.details?.company_id || user?.profile_id;
        if (profRes.result && profRes.data?.details?.supervisores) {
          setSupervisores(profRes.data.details.supervisores);
        }
        if (companyId) {
          const res = await vacancyService.getByCompany(companyId);
          if (res.result) setVacantes((res.data || []).map(normalizeVacancy));
        }
        const skillsRes = await adminService.getSkills();
        if (skillsRes.result && skillsRes.data) {
          setAllSkills(skillsRes.data.map(s => ({
            skill_id: s.habilidad_id || s.id || null,
            name: s.nombre || s.name || '',
            category: s.categoria || s.category || null,
          })).filter(s => s.name && s.category !== 'Ingenieria'));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // === EDIT ===
  function openEdit(row) {
    setEditForm({
      title: row.title || '',
      description: row.description || '',
      requirements: row.requirements || '',
      area: row.area || '',
      modality: row.modality || 'Presencial',
      location: row.location || '',
      total_hours: row.total_hours ?? '',
      daily_hours: row.daily_hours ?? '',
      schedule: row.schedule || '',
      slots: row.slots || 1,
      expires_at: row.expires_at ? row.expires_at.split('T')[0] : '',
      supervisor_id: row.supervisor_id ?? '',
      is_active: row.is_active ?? true,
    });
    setEditSkills(
      (row.skills || []).map(s => ({
        skill_id: s.habilidad_id || s.id || null,
        name: s.nombre || s.habilidad_nombre || s.name || '',
        level: s.nivel_requerido || s.level || 1,
        category: s.categoria || s.category || null,
        is_optional: s.es_opcional || s.is_optional || false
      }))
    );
    setEditErrors({});
    setEditModal(row);
  }

  function handleEditChange(e) {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (editErrors[name]) setEditErrors(prev => ({ ...prev, [name]: '' }));
  }

  function validateEdit() {
    const errs = {};
    if (!editForm.title?.trim()) errs.title = 'El título es obligatorio';
    if (!editForm.description?.trim() || editForm.description.length < 20) errs.description = 'Mínimo 20 caracteres';
    if (!editForm.requirements?.trim()) errs.requirements = 'Los requisitos son obligatorios';
    if (!editForm.area) errs.area = 'Selecciona un área';
    if (!editForm.location?.trim()) errs.location = 'La ubicación es obligatoria';
    if (!editForm.total_hours) errs.total_hours = 'Obligatorio';
    else if (parseInt(editForm.total_hours) > 240) errs.total_hours = 'Máx 240h';
    if (!editForm.daily_hours) errs.daily_hours = 'Obligatorio';
    else if (parseInt(editForm.daily_hours) > 6) errs.daily_hours = 'Máx 6h/día';
    if (!editForm.schedule?.trim()) errs.schedule = 'Obligatorio';
    if (!editForm.slots || editForm.slots < 1) errs.slots = 'Obligatorio';
    if (!editForm.expires_at) errs.expires_at = 'Obligatorio';
    if (!editForm.supervisor_id) errs.supervisor_id = 'Obligatorio';

    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleEditSave() {
    if (!validateEdit()) return;
    setEditSaving(true);
    const totalHours = editForm.total_hours ? parseInt(editForm.total_hours, 10) : null;
    const dailyHours = editForm.daily_hours ? parseInt(editForm.daily_hours, 10) : null;
    const schedule = editForm.schedule || null;
    try {
      const res = await vacancyService.update(editModal.vacancy_id, {
        title: editForm.title,
        description: editForm.description,
        requirements: editForm.requirements,
        area: editForm.area,
        modality: editForm.modality,
        location: editForm.location,
        total_hours: totalHours,
        daily_hours: dailyHours,
        schedule,
        slots: parseInt(editForm.slots) || 1,
        expires_at: editForm.expires_at || null,
        supervisor_id: editForm.supervisor_id ? parseInt(editForm.supervisor_id) : null,
        is_active: editForm.is_active,
        skills: editSkills.map(skill => ({
          skill_id: skill.skill_id || null,
          name: skill.name,
          required_level: skill.level || 1,
          category: skill.category || null,
          is_optional: skill.is_optional || false
        })),
      });
      if (res.result) {
        setToast({ type: 'success', message: `Vacante "${editForm.title}" actualizada correctamente` });
        // Actualizar en lista local
        setVacantes(prev => prev.map(v =>
          v.vacancy_id === editModal.vacancy_id
            ? {
              ...v,
              ...editForm,
              total_hours: totalHours,
              daily_hours: dailyHours,
              schedule,
              slots: parseInt(editForm.slots) || 1,
              supervisor_id: editForm.supervisor_id ? parseInt(editForm.supervisor_id) : null,
              skills: editSkills,
            }
            : v
        ));
        setEditModal(null);
      } else {
        setToast({ type: 'error', message: res.message || 'Error al actualizar' });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Error al conectar con el servidor' });
    } finally {
      setEditSaving(false);
    }
  }

  // === DELETE ===
  const handleDelete = async (id) => {
    try {
      const res = await vacancyService.delete(id);
      if (res.result) {
        setToast({ type: 'success', message: 'Vacante cerrada exitosamente' });
        setVacantes(prev => prev.map(v => v.vacancy_id === id ? { ...v, is_active: false } : v));
      } else {
        setToast({ type: 'error', message: res.message || 'Error al cerrar vacante' });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Error al conectar con el servidor' });
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Vacante de Práctica',
      render: (val, row) => (
        <div>
          <p className="font-medium text-slate-800 m-0">{val}</p>
          <p className="text-xs text-slate-500 m-0">{row.area} · {row.modality || 'Presencial'}</p>
        </div>
      ),
    },
    { key: 'slots', label: 'Plazas', render: (val) => val || 1 },
    {
      key: 'applications_count',
      label: 'Postulantes',
      render: (val) => (
        <div className="flex items-center gap-1.5">
          <FiUsers size={14} className="text-slate-400" />
          <span className="font-semibold text-primary-600">{val || 0}</span>
        </div>
      ),
    },
    { key: 'is_active', label: 'Estado', render: (val) => <StatusBadge status={val ? 'abierta' : 'cerrada'} /> },
    { key: 'expires_at', label: 'Fecha límite', render: (val) => val ? new Date(val).toLocaleDateString('es-EC') : '-' },
  ];

  const fieldBase = `w-full py-2.5 px-3.5 text-[0.9375rem] text-slate-800 bg-white border-[1.5px] rounded-md outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:ring-3 focus:ring-[var(--color-header-bg)]`;
  const fieldErr = `border-danger focus:ring-danger-light`;
  const fieldOk = `border-slate-300`;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Mis Vacantes de Prácticas"
        subtitle={loading ? 'Cargando...' : `${vacantes.filter(v => v.is_active).length} vacantes abiertas de ${vacantes.length} totales`}
        action={
          <Link to="/dashboard/empresa/vacantes/nueva">
            <Button icon={<FiPlusCircle />}>Nueva Vacante</Button>
          </Link>
        }
      />

      {/* Toast */}
      {toast && (
        <div className={`mb-4 px-4 py-3 rounded-md text-sm font-medium flex items-center gap-2 animate-fade-in ${
          toast.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {toast.type === 'success' && <FiCheckCircle size={16} />}
          {toast.message}
        </div>
      )}

      <DataTable
        columns={columns}
        data={vacantes}
        searchKeys={['title', 'area']}
        actions={(row) => (
          <>
            <button
              onClick={() => setViewModal(row)}
              className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-600"
              title="Ver detalle"
            >
              <FiEye size={16} />
            </button>
            <button
              onClick={() => openEdit(row)}
              className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-amber-50 hover:text-amber-600"
              title="Editar vacante"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              onClick={() => setDeleteConfirm(row)}
              className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-red-50 hover:text-red-600"
              title="Cerrar"
            >
              <FiTrash2 size={16} />
            </button>
          </>
        )}
      />

      {/* Modal Ver Detalle */}
      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Detalle de Vacante" size="lg">
        {viewModal && (
          <div className="flex flex-col gap-6 p-1">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 m-0 leading-tight">{viewModal.title}</h3>
                <p className="text-sm font-medium text-primary-600 m-0 mt-1">{viewModal.area}</p>
              </div>
              <StatusBadge status={viewModal.is_active ? 'abierta' : 'cerrada'} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
              <InfoField icon={FiBriefcase} label="Área / Departamento" value={viewModal.area || 'No especificado'} />
              <InfoField icon={FiMapPin} label="Ubicación" value={viewModal.location || 'No especificada'} />
              <InfoField icon={FiClock} label="Modalidad" value={viewModal.modality || 'Presencial'} />
              <InfoField icon={FiCalendar} label="Horario" value={viewModal.schedule || 'No especificado'} />
              <InfoField icon={FiClock} label="Total Horas" value={viewModal.total_hours ? `${viewModal.total_hours}h` : '-'} />
              <InfoField icon={FiClock} label="Horas Diarias" value={viewModal.daily_hours ? `${viewModal.daily_hours}h/día` : '-'} />
              <InfoField icon={FiUsers} label="Cupos Disponibles" value={viewModal.slots || 1} />
              <InfoField icon={FiUsers} label="Total Postulantes" value={viewModal.applications_count || 0} />
              <InfoField icon={FiCalendar} label="Fecha Publicación" value={viewModal.created_at ? new Date(viewModal.created_at).toLocaleDateString() : '-'} />
              <InfoField icon={FiCalendar} label="Fecha Expiración" value={viewModal.expires_at ? new Date(viewModal.expires_at).toLocaleDateString() : '-'} />
            </div>

            {viewModal.description && (
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <FiAlignLeft className="text-slate-400" />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 m-0">Descripción</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="text-sm text-slate-700 m-0 whitespace-pre-wrap leading-relaxed">{viewModal.description}</p>
                </div>
              </div>
            )}
            
            {viewModal.requirements && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FiBriefcase className="text-slate-400" />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 m-0">Requisitos Adicionales</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="text-sm text-slate-700 m-0 whitespace-pre-wrap leading-relaxed">{viewModal.requirements}</p>
                </div>
              </div>
            )}
            
            {viewModal.skills && viewModal.skills.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FiBriefcase className="text-slate-400" />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 m-0">Habilidades Solicitadas</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {viewModal.skills.map((skill, index) => (
                    <div key={index} className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-md shadow-sm">
                      <span className="font-semibold text-primary-700">{skill.habilidad_nombre || skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => { setViewModal(null); openEdit(viewModal); }} icon={<FiEdit2 />}>
                Editar Vacante
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Editar Vacante */}
      <Modal
        isOpen={!!editModal}
        onClose={() => setEditModal(null)}
        title="Editar Vacante"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditModal(null)}>Cancelar</Button>
            <Button onClick={handleEditSave} loading={editSaving} icon={<FiSave />}>Guardar Cambios</Button>
          </>
        }
      >
        {editModal && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Título del puesto <span className="text-danger">*</span></label>
              <input name="title" value={editForm.title} onChange={handleEditChange} className={`${fieldBase} ${editErrors.title ? fieldErr : fieldOk}`} />
              {editErrors.title && <p className="text-[0.8125rem] text-danger m-0">{editErrors.title}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Descripción <span className="text-danger">*</span></label>
              <textarea name="description" value={editForm.description} onChange={handleEditChange} rows={3} className={`${fieldBase} resize-y min-h-[80px] ${editErrors.description ? fieldErr : fieldOk}`} />
              {editErrors.description && <p className="text-[0.8125rem] text-danger m-0">{editErrors.description}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Requisitos <span className="text-danger">*</span></label>
              <textarea name="requirements" value={editForm.requirements} onChange={handleEditChange} rows={2} className={`${fieldBase} resize-y min-h-[60px] ${editErrors.requirements ? fieldErr : fieldOk}`} />
              {editErrors.requirements && <p className="text-[0.8125rem] text-danger m-0">{editErrors.requirements}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Habilidades Específicas Solicitadas</label>
              <SkillSelector 
                selectedSkills={editSkills} 
                allSkills={allSkills} 
                onChange={setEditSkills} 
                isVacancy={true} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Área o Departamento <span className="text-danger">*</span></label>
                <input name="area" value={editForm.area} onChange={handleEditChange} placeholder="Ej: Tecnología, Contabilidad..." className={`${fieldBase} ${editErrors.area ? fieldErr : fieldOk}`} />
                {editErrors.area && <p className="text-[0.8125rem] text-danger m-0">{editErrors.area}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Modalidad</label>
                <select name="modality" value={editForm.modality} onChange={handleEditChange} className={`${fieldBase} ${fieldOk}`}>
                  {modalidades.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Supervisor Responsable <span className="text-danger">*</span></label>
              <select name="supervisor_id" value={editForm.supervisor_id} onChange={handleEditChange} className={`${fieldBase} ${editErrors.supervisor_id ? fieldErr : fieldOk}`}>
                <option value="">Seleccionar supervisor...</option>
                {supervisores.map((sup) => (
                  <option key={sup.supervisor_id} value={sup.supervisor_id}>{sup.nombre} ({sup.cargo})</option>
                ))}
              </select>
              {editErrors.supervisor_id && <p className="text-[0.8125rem] text-danger m-0">{editErrors.supervisor_id}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Ubicación <span className="text-danger">*</span></label>
                <input name="location" value={editForm.location} onChange={handleEditChange} className={`${fieldBase} ${editErrors.location ? fieldErr : fieldOk}`} />
                {editErrors.location && <p className="text-[0.8125rem] text-danger m-0">{editErrors.location}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Plazas <span className="text-danger">*</span></label>
                <input name="slots" type="number" value={editForm.slots} onChange={handleEditChange} min="1" className={`${fieldBase} ${editErrors.slots ? fieldErr : fieldOk}`} />
                {editErrors.slots && <p className="text-[0.8125rem] text-danger m-0">{editErrors.slots}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Fecha límite <span className="text-danger">*</span></label>
                <input name="expires_at" type="date" value={editForm.expires_at} onChange={handleEditChange} className={`${fieldBase} ${editErrors.expires_at ? fieldErr : fieldOk}`} />
                {editErrors.expires_at && <p className="text-[0.8125rem] text-danger m-0">{editErrors.expires_at}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Total de horas <span className="text-danger">*</span></label>
                <input name="total_hours" type="number" value={editForm.total_hours} onChange={handleEditChange} min="1" className={`${fieldBase} ${editErrors.total_hours ? fieldErr : fieldOk}`} />
                {editErrors.total_hours && <p className="text-[0.8125rem] text-danger m-0">{editErrors.total_hours}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Horas al día <span className="text-danger">*</span></label>
                <input name="daily_hours" type="number" value={editForm.daily_hours} onChange={handleEditChange} min="1" className={`${fieldBase} ${editErrors.daily_hours ? fieldErr : fieldOk}`} />
                {editErrors.daily_hours && <p className="text-[0.8125rem] text-danger m-0">{editErrors.daily_hours}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Horario <span className="text-danger">*</span></label>
                <input name="schedule" value={editForm.schedule} onChange={handleEditChange} placeholder="Ej: Lunes a Viernes" className={`${fieldBase} ${editErrors.schedule ? fieldErr : fieldOk}`} />
                {editErrors.schedule && <p className="text-[0.8125rem] text-danger m-0">{editErrors.schedule}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={editForm.is_active}
                  onChange={handleEditChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:bg-primary-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
              </label>
              <div>
                <p className="text-sm font-medium text-slate-800 m-0">
                  Vacante {editForm.is_active ? 'activa' : 'cerrada'}
                </p>
                <p className="text-xs text-slate-500 m-0">
                  {editForm.is_active ? 'Visible para los estudiantes' : 'No aparecerá en el catálogo'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm?.vacancy_id)}
        title="Cerrar Vacante"
        message={`¿Cerrar "${deleteConfirm?.title}"? Esta vacante dejará de estar disponible y no aparecerá en el catálogo.`}
      />
    </div>
  );
}
