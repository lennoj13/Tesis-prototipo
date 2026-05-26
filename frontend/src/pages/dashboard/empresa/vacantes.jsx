
/**
 * Empresa Vacantes — Lista de vacantes con ver, editar y eliminar.
 * Módulo 3: Gestión de Vacantes
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import vacancyService from 'services/vacancyService';
import profileService from 'services/profileService';
import PageHeader from 'components/PageHeader';
import DataTable from 'components/DataTable';
import StatusBadge from 'components/StatusBadge';
import Modal from 'components/Modal';
import ConfirmDialog from 'components/ConfirmDialog';
import Button from 'components/Button';
import { FiEdit2, FiTrash2, FiEye, FiUsers, FiPlusCircle, FiSave, FiCheckCircle } from 'react-icons/fi';

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
    if (!editForm.title.trim()) errs.title = 'El título es obligatorio';
    if (!editForm.description.trim() || editForm.description.length < 20) errs.description = 'Mínimo 20 caracteres';
    if (!editForm.area) errs.area = 'Selecciona un área';
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
      if (res.result !== false) {
        setToast({ type: 'success', message: 'Vacante eliminada' });
        setVacantes(prev => prev.filter(v => v.vacancy_id !== id));
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Error al eliminar vacante' });
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

  const fieldBase = `w-full py-2.5 px-3.5 text-[0.9375rem] text-slate-800 bg-white border-[1.5px] rounded-lg outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:ring-3 focus:ring-primary-100`;
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
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-fade-in ${
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
              className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-600"
              title="Ver detalle"
            >
              <FiEye size={16} />
            </button>
            <button
              onClick={() => openEdit(row)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-amber-50 hover:text-amber-600"
              title="Editar vacante"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              onClick={() => setDeleteConfirm(row)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-red-50 hover:text-red-600"
              title="Eliminar"
            >
              <FiTrash2 size={16} />
            </button>
          </>
        )}
      />

      {/* Modal Ver Detalle */}
      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Detalle de Vacante" size="lg">
        {viewModal && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-slate-900">{viewModal.title}</h3>
            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl max-md:grid-cols-2">
              <div><p className="text-xs text-slate-500 mb-1">Área</p><p className="text-sm font-semibold text-slate-800">{viewModal.area}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Modalidad</p><p className="text-sm font-semibold text-slate-800">{viewModal.modality || 'Presencial'}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Ubicación</p><p className="text-sm font-semibold text-slate-800">{viewModal.location || '-'}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Horas totales</p><p className="text-sm font-semibold text-slate-800">{viewModal.total_hours || '-'}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Horas al día</p><p className="text-sm font-semibold text-slate-800">{viewModal.daily_hours || '-'}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Horario</p><p className="text-sm font-semibold text-slate-800">{viewModal.schedule || '-'}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Plazas</p><p className="text-sm font-semibold text-primary-600">{viewModal.slots || 1}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Postulantes</p><p className="text-sm font-semibold text-primary-600">{viewModal.applications_count || 0}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Estado</p><StatusBadge status={viewModal.is_active ? 'abierta' : 'cerrada'} /></div>
            </div>
            {viewModal.description && (
              <div>
                <p className="text-xs text-slate-500 mb-1">Descripción</p>
                <p className="text-sm text-slate-700 leading-relaxed">{viewModal.description}</p>
              </div>
            )}
            {viewModal.requirements && (
              <div>
                <p className="text-xs text-slate-500 mb-1">Requisitos</p>
                <p className="text-sm text-slate-700 leading-relaxed">{viewModal.requirements}</p>
              </div>
            )}
            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => { setViewModal(null); openEdit(viewModal); }} icon={<FiEdit2 />}>
                Editar
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
              <label className="text-sm font-semibold text-slate-700">Requisitos</label>
              <textarea name="requirements" value={editForm.requirements} onChange={handleEditChange} rows={2} className={`${fieldBase} resize-y min-h-[60px] ${fieldOk}`} />
            </div>

            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Área <span className="text-danger">*</span></label>
                <select name="area" value={editForm.area} onChange={handleEditChange} className={`${fieldBase} ${editErrors.area ? fieldErr : fieldOk}`}>
                  <option value="">Seleccionar...</option>
                  {areas.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
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
              <label className="text-sm font-semibold text-slate-700">Supervisor Responsable</label>
              <select name="supervisor_id" value={editForm.supervisor_id} onChange={handleEditChange} className={`${fieldBase} ${fieldOk}`}>
                <option value="">Seleccionar supervisor...</option>
                {supervisores.map((sup) => (
                  <option key={sup.supervisor_id} value={sup.supervisor_id}>{sup.nombre} ({sup.cargo})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Ubicación</label>
                <input name="location" value={editForm.location} onChange={handleEditChange} className={`${fieldBase} ${fieldOk}`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Plazas</label>
                <input name="slots" type="number" value={editForm.slots} onChange={handleEditChange} min="1" className={`${fieldBase} ${fieldOk}`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Fecha límite</label>
                <input name="expires_at" type="date" value={editForm.expires_at} onChange={handleEditChange} className={`${fieldBase} ${fieldOk}`} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Total de horas</label>
                <input name="total_hours" type="number" value={editForm.total_hours} onChange={handleEditChange} min="1" className={`${fieldBase} ${fieldOk}`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Horas al día</label>
                <input name="daily_hours" type="number" value={editForm.daily_hours} onChange={handleEditChange} min="1" className={`${fieldBase} ${fieldOk}`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Horario</label>
                <input name="schedule" value={editForm.schedule} onChange={handleEditChange} placeholder="Ej: Lunes a Viernes" className={`${fieldBase} ${fieldOk}`} />
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
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
        title="Eliminar Vacante"
        message={`¿Eliminar "${deleteConfirm?.title}"? Esta vacante dejará de estar disponible.`}
      />
    </div>
  );
}
