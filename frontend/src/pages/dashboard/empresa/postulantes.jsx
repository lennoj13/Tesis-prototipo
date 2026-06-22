
/**
 * Empresa Postulantes — Vista de Gestion de Solicitudes
 * Modulo 4: Evaluacion de Postulaciones
 */

import { useState, useEffect } from 'react';
import { useAuth } from 'context/AuthContext';
import profileService from 'services/profileService';
import applicationService from 'services/applicationService';
import matchingService from 'services/matchingService';
import PageHeader from 'components/PageHeader';
import DataTable from 'components/DataTable';
import StatusBadge from 'components/StatusBadge';
import Button from 'components/Button';
import ConfirmDialog from 'components/ConfirmDialog';
import Modal from 'components/Modal';
import Toast from 'components/Toast';
import InfoField from 'components/InfoField';
import Card from 'components/Card';
import { FiCheck, FiX, FiUser, FiEye, FiMail, FiBookOpen, FiAward, FiCreditCard, FiFileText, FiTarget, FiCheckCircle, FiCalendar, FiClock, FiVideo, FiMapPin, FiLink, FiFilter } from 'react-icons/fi';

const statusMap = {
  pending: 'pendiente',
  approved: 'aprobada',
  rejected: 'rechazada',
  accepted: 'aceptada_empresa',
  aceptada_empresa: 'aceptada_empresa',
  entrevista: 'entrevista',
  aprobada: 'aprobada',
  rechazada: 'rechazada',
};

const statusLabels = {
  pendiente: 'Pendiente',
  entrevista: 'En Entrevista',
  aceptada_empresa: 'Aceptada por Empresa',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
};

function getAffinityColor(val) {
  if (val >= 80) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
  if (val >= 60) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
  return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };
}

const semestreMap = {
  '1': 'Primer semestre', '2': 'Segundo semestre', '3': 'Tercer semestre',
  '4': 'Cuarto semestre', '5': 'Quinto semestre', '6': 'Sexto semestre',
  '7': 'Septimo semestre', '8': 'Octavo semestre', '9': 'Noveno semestre',
  '10': 'Decimo semestre'
};

export default function EmpresaPostulantes() {
  const { user } = useAuth();
  const [postulantes, setPostulantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState(null);
  const [viewProfileModal, setViewProfileModal] = useState(null);
  const [toast, setToast] = useState(null);

  // Estado para el formulario de entrevista
  const [interviewModal, setInterviewModal] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    fecha_entrevista: '',
    hora_entrevista: '',
    modalidad_entrevista: 'Presencial',
    direccion_entrevista: '',
    link_reunion: '',
  });
  const [interviewLoading, setInterviewLoading] = useState(false);

  // Filtros
  const [filterEstado, setFilterEstado] = useState('todos');
  const [filterVacante, setFilterVacante] = useState('todas');
  const [sortBy, setSortBy] = useState('afinidad');

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Obtener el company_id del usuario actual
      const profRes = await profileService.getMyProfile();
      const companyId = profRes.data?.details?.institucion_id || profRes.data?.details?.company_id || user?.profile_id;
      
      if (!companyId) {
        setLoading(false);
        return;
      }

      // 2. Obtener TODOS los postulantes y los datos ricos del motor de matching en paralelo
      const [appRes, matchRes] = await Promise.all([
        applicationService.getByCompany(companyId),
        matchingService.getCandidates(companyId)
      ]);
      const allApplicants = appRes.data || [];
      const matchData = matchRes.data || [];

      // Filtrar las canceladas por el estudiante (basura para la empresa)
      const activeApplicants = allApplicants.filter(p => p.estado !== 'cancelada');

      // Crear mapa de candidatos enriquecidos para extraer habilidades e intereses
      const richCandidatesMap = {};
      matchData.forEach(vac => {
        (vac.candidates || []).forEach(cand => {
          if (cand.application_id) {
            richCandidatesMap[cand.application_id] = { ...cand, vacancy_title: vac.title, vacancy_id: vac.vacancy_id };
          }
        });
      });

      // Ordenar por afinidad descendente
      activeApplicants.sort((a, b) => (b.porcentaje_afinidad || b.match_percentage || 0) - (a.porcentaje_afinidad || a.match_percentage || 0));
      
      setPostulantes(activeApplicants.map(p => {
        const richData = richCandidatesMap[p.postulacion_id || p.application_id] || {};

        // Parsear snapshot del perfil al momento de la postulacion (auditoria)
        let snapshotSkills = [];
        let snapshotExperience = null;
        let snapshotInterests = null;
        if (p.habilidades_snapshot) {
          try {
            const raw = typeof p.habilidades_snapshot === 'string'
              ? JSON.parse(p.habilidades_snapshot)
              : p.habilidades_snapshot;
            
            // Formato nuevo: objeto con habilidades, resumen_experiencia, intereses
            if (raw && !Array.isArray(raw) && typeof raw === 'object') {
              const skillsList = raw.habilidades || [];
              snapshotSkills = skillsList.map(s => ({
                name: s.habilidad_nombre || s.nombre || '',
                category: s.habilidad_categoria || s.categoria || '',
              }));
              snapshotExperience = raw.resumen_experiencia || null;
              snapshotInterests = raw.intereses || null;
            } else if (Array.isArray(raw)) {
              // Formato viejo: array directo de habilidades
              snapshotSkills = raw.map(s => ({
                name: s.habilidad_nombre || s.nombre || '',
                category: s.habilidad_categoria || s.categoria || '',
              }));
            }
          } catch (e) { /* ignore parse errors */ }
        }

        return {
          ...p,
          ...richData,
          id: p.postulacion_id || p.application_id,
          candidato: p.nombre_estudiante || richData.name + ' ' + richData.lastname || p.student_name,
          vacante: p.titulo_vacante || richData.vacancy_title || p.vacancy_title,
          afinidad: p.porcentaje_afinidad || p.match_percentage || 0,
          estado: statusMap[p.estado || p.status] || (p.estado || p.status),
          correo: p.correo || p.email,
          cedula: p.cedula,
          semestre: p.semestre || richData.semester,
          carrera: p.carrera || richData.career,
          fecha: p.creado_en || p.created_at,
          // Prioridad: matching engine > snapshot (datos congelados al postularse)
          all_skills: richData.all_skills || (snapshotSkills.length > 0 ? snapshotSkills : null),
          experience_summary: richData.experience_summary || snapshotExperience,
          interests: richData.interests || snapshotInterests,
        };
      }));
    } catch (err) {
      console.error('Error cargando gestion de postulantes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleUpdateStatus = async () => {
    if (!actionModal) return;
    try {
      const res = await applicationService.updateStatus(actionModal.appId, actionModal.type);
      if (res.result) {
        setPostulantes(prev => prev.map(p => 
          p.id === actionModal.appId ? { ...p, estado: statusMap[actionModal.type] || actionModal.type } : p
        ));
        const messages = {
          aceptada_empresa: 'Candidato aceptado correctamente.',
          rechazada: 'Candidato rechazado correctamente.',
        };
        setToast({ type: 'success', message: messages[actionModal.type] || 'Estado actualizado.' });
      } else {
        setToast({ type: 'error', message: res.message || 'Error actualizando estado' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Error de conexion con el servidor.' });
    } finally {
      setActionModal(null);
    }
  };

  // Abrir modal de agendar entrevista
  const openInterviewModal = (row) => {
    setInterviewModal(row);
    setInterviewForm({
      fecha_entrevista: '',
      hora_entrevista: '',
      modalidad_entrevista: 'Presencial',
      direccion_entrevista: '',
      link_reunion: '',
    });
  };

  // Enviar formulario de entrevista
  const handleScheduleInterview = async () => {
    if (!interviewModal) return;

    // Validaciones
    if (!interviewForm.fecha_entrevista) {
      setToast({ type: 'error', message: 'Debe indicar la fecha de la entrevista.' });
      return;
    }
    if (!interviewForm.hora_entrevista) {
      setToast({ type: 'error', message: 'Debe indicar la hora de la entrevista.' });
      return;
    }
    if (interviewForm.modalidad_entrevista === 'Presencial' && !interviewForm.direccion_entrevista.trim()) {
      setToast({ type: 'error', message: 'Debe indicar la direccion para la entrevista presencial.' });
      return;
    }
    if (interviewForm.modalidad_entrevista === 'Virtual' && !interviewForm.link_reunion.trim()) {
      setToast({ type: 'error', message: 'Debe indicar el enlace de reunion para la entrevista virtual.' });
      return;
    }

    setInterviewLoading(true);
    try {
      const payload = {
        estado: 'entrevista',
        ...interviewForm,
      };
      const res = await applicationService.updateStatus(interviewModal.id, payload);
      if (res.result) {
        setPostulantes(prev => prev.map(p =>
          p.id === interviewModal.id ? { ...p, estado: 'entrevista' } : p
        ));
        setToast({ type: 'success', message: 'Entrevista agendada correctamente.' });
        setInterviewModal(null);
      } else {
        setToast({ type: 'error', message: res.message || 'Error al agendar entrevista.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Error de conexion con el servidor.' });
    } finally {
      setInterviewLoading(false);
    }
  };

  // Textos para el ConfirmDialog segun el tipo de accion
  const getConfirmTexts = () => {
    if (!actionModal) return {};
    if (actionModal.type === 'aceptada_empresa') {
      return {
        title: 'Aceptar Candidato',
        message: `Al aceptar a ${actionModal.name}, su postulacion pasara a revision del gestor de practicas preprofesionales para la vacante "${actionModal.vacancyTitle}".`,
        confirmText: 'Aceptar candidato',
        variant: 'primary',
      };
    }
    return {
      title: 'Rechazar Candidato',
      message: `Al rechazar a ${actionModal.name}, se cerrara su proceso para la vacante "${actionModal.vacancyTitle}".`,
      confirmText: 'Rechazar candidato',
      variant: 'danger',
    };
  };

  const confirmTexts = getConfirmTexts();

  // Vacantes unicas para el filtro
  const uniqueVacantes = [...new Set(postulantes.map(p => p.vacante).filter(Boolean))];

  // Filtrar datos segun filtros activos
  const filteredPostulantes = postulantes.filter(p => {
    if (filterEstado !== 'todos' && p.estado !== filterEstado) return false;
    if (filterVacante !== 'todas' && p.vacante !== filterVacante) return false;
    return true;
  });

  // Aplicar ordenamiento dinámico
  const sortedAndFilteredPostulantes = [...filteredPostulantes].sort((a, b) => {
    if (sortBy === 'reciente') {
      return new Date(b.fecha || 0).getTime() - new Date(a.fecha || 0).getTime();
    }
    // Por defecto afinidad
    return (b.afinidad || 0) - (a.afinidad || 0);
  });

  // Filtro por estado - opciones
  const estadoFilterOptions = [
    { value: 'todos', label: 'Todos los estados' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'entrevista', label: 'En Entrevista' },
    { value: 'aceptada_empresa', label: 'Aceptada por Empresa' },
    { value: 'rechazada', label: 'Rechazada' },
    { value: 'aprobada', label: 'Aprobada' },
  ];

  const columns = [
    {
      key: 'candidato',
      label: 'Candidato',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
            <FiUser size={14} />
          </div>
          <div>
            <p className="font-medium text-slate-800 m-0">{val || 'Sin nombre'}</p>
            <p className="text-xs text-slate-500 m-0">{row?.correo || ''}</p>
          </div>
        </div>
      )
    },
    {
      key: 'vacante',
      label: 'Vacante Aplicada',
      render: (val, row) => (
        <div>
          <p className="text-sm text-slate-800 m-0">{val || '-'}</p>
          <p className="text-xs text-slate-500 m-0">{row?.fecha || ''}</p>
        </div>
      )
    },
    {
      key: 'afinidad',
      label: 'Afinidad',
      render: (val) => (
        <span className={`text-sm font-semibold ${(val || 0) >= 70 ? 'text-success-600' : 'text-slate-600'}`}>
          {val || 0}%
        </span>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (val) => <StatusBadge status={statusMap[val] || val} />
    }
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Gestion de Postulantes"
        subtitle={loading ? 'Cargando candidatos...' : `${sortedAndFilteredPostulantes.length} de ${postulantes.length} postulaciones`}
      />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <DataTable
        columns={columns}
        data={sortedAndFilteredPostulantes}
        searchKeys={['candidato', 'vacante', 'correo']}
        filters={
          <>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-md bg-white text-slate-700 outline-none cursor-pointer transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            >
              {estadoFilterOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {uniqueVacantes.length > 1 && (
              <select
                value={filterVacante}
                onChange={(e) => setFilterVacante(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-md bg-white text-slate-700 outline-none cursor-pointer transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100 max-w-[220px]"
              >
                <option value="todas">Todas las vacantes</option>
                {uniqueVacantes.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            )}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-md bg-white text-slate-700 outline-none cursor-pointer transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            >
              <option value="afinidad">Ordenar por: Afinidad</option>
              <option value="reciente">Ordenar por: Más reciente</option>
            </select>
            {(filterEstado !== 'todos' || filterVacante !== 'todas' || sortBy !== 'afinidad') && (
              <button
                onClick={() => { setFilterEstado('todos'); setFilterVacante('todas'); setSortBy('afinidad'); }}
                className="px-3 py-2 text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200 rounded-md cursor-pointer hover:bg-slate-200 transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </>
        }
        actions={(row) => (
          <div className="flex gap-2">
            <button
              onClick={() => setViewProfileModal(row)}
              className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-600"
              title="Ver Perfil"
            >
              <FiEye size={16} />
            </button>

            {/* Estado PENDIENTE: Agendar Entrevista o Rechazar */}
            {(row.estado === 'pendiente' || row.estado === 'pending') && (
              <>
                <button
                  onClick={() => openInterviewModal(row)}
                  className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-violet-50 hover:text-violet-600"
                  title="Agendar Entrevista"
                >
                  <FiCalendar size={16} />
                </button>
                <button
                  onClick={() => setActionModal({ appId: row.id, type: 'rechazada', name: row.candidato, vacancyTitle: row.vacante })}
                  className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Rechazar"
                >
                  <FiX size={16} />
                </button>
              </>
            )}

            {/* Estado ENTREVISTA: Aceptar o Rechazar */}
            {row.estado === 'entrevista' && (
              <>
                <button
                  onClick={() => setActionModal({ appId: row.id, type: 'aceptada_empresa', name: row.candidato, vacancyTitle: row.vacante })}
                  className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-green-50 hover:text-green-600"
                  title="Aceptar Candidato"
                >
                  <FiCheck size={16} />
                </button>
                <button
                  onClick={() => setActionModal({ appId: row.id, type: 'rechazada', name: row.candidato, vacancyTitle: row.vacante })}
                  className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Rechazar"
                >
                  <FiX size={16} />
                </button>
              </>
            )}
          </div>
        )}
      />

      {/* Confirm Dialog — Aceptar/Rechazar */}
      <ConfirmDialog
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        onConfirm={handleUpdateStatus}
        title={confirmTexts.title || ''}
        message={confirmTexts.message || ''}
        confirmText={confirmTexts.confirmText || 'Confirmar'}
        variant={confirmTexts.variant || 'primary'}
      />

      {/* Modal — Agendar Entrevista */}
      <Modal
        isOpen={!!interviewModal}
        onClose={() => setInterviewModal(null)}
        title="Agendar Entrevista"
        size="md"
      >
        {interviewModal && (
          <div className="flex flex-col gap-5">
            {/* Header del candidato */}
            <Card variant="accent" padding="sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3c8dbc] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {(interviewModal.candidato || '?').charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 m-0">{interviewModal.candidato}</p>
                  <p className="text-xs text-slate-500 m-0">Vacante: {interviewModal.vacante}</p>
                </div>
              </div>
            </Card>

            {/* Fecha y hora */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  <FiCalendar size={12} className="inline mr-1" />
                  Fecha de entrevista *
                </label>
                <input
                  type="date"
                  value={interviewForm.fecha_entrevista}
                  onChange={(e) => setInterviewForm(prev => ({ ...prev, fecha_entrevista: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-800 bg-white focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  <FiClock size={12} className="inline mr-1" />
                  Hora de entrevista *
                </label>
                <input
                  type="time"
                  value={interviewForm.hora_entrevista}
                  onChange={(e) => setInterviewForm(prev => ({ ...prev, hora_entrevista: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-800 bg-white focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>
            </div>

            {/* Modalidad */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Modalidad de entrevista *
              </label>
              <div className="flex gap-3">
                {['Presencial', 'Virtual'].map((mod) => (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => setInterviewForm(prev => ({ ...prev, modalidad_entrevista: mod, direccion_entrevista: '', link_reunion: '' }))}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border text-sm font-medium transition-all cursor-pointer ${
                      interviewForm.modalidad_entrevista === mod
                        ? 'bg-primary-50 border-primary-300 text-primary-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {mod === 'Presencial' ? <FiMapPin size={14} /> : <FiVideo size={14} />}
                    {mod}
                  </button>
                ))}
              </div>
            </div>

            {/* Campo condicional: Direccion o Link */}
            {interviewForm.modalidad_entrevista === 'Presencial' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  <FiMapPin size={12} className="inline mr-1" />
                  Direccion de la entrevista *
                </label>
                <input
                  type="text"
                  value={interviewForm.direccion_entrevista}
                  onChange={(e) => setInterviewForm(prev => ({ ...prev, direccion_entrevista: e.target.value }))}
                  placeholder="Ej: Av. Delta s/n, Edificio administrativo, Piso 3"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-800 bg-white focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-slate-400"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  <FiLink size={12} className="inline mr-1" />
                  Enlace de la reunion *
                </label>
                <input
                  type="url"
                  value={interviewForm.link_reunion}
                  onChange={(e) => setInterviewForm(prev => ({ ...prev, link_reunion: e.target.value }))}
                  placeholder="Ej: https://meet.google.com/abc-defg-hij"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-800 bg-white focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-slate-400"
                />
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setInterviewModal(null)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleScheduleInterview}
                disabled={interviewLoading}
              >
                {interviewLoading ? 'Agendando...' : 'Agendar Entrevista'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal — Perfil completo del candidato */}
      <Modal isOpen={!!viewProfileModal} onClose={() => setViewProfileModal(null)} title="Perfil Completo del Candidato" size="lg">
        {viewProfileModal && (() => {
          const selectedStudent = viewProfileModal;
          const afColor = getAffinityColor(selectedStudent.afinidad);
          const semLabel = semestreMap[String(selectedStudent.semestre)] || selectedStudent.semestre || '';

          return (
            <div className="flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#3c8dbc] text-white text-2xl font-bold flex items-center justify-center flex-shrink-0 border border-[#2f6f92]">
                  {(selectedStudent.candidato || '?').charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold text-slate-900 m-0">{selectedStudent.candidato}</p>
                  <p className="text-sm text-primary-600 font-medium m-0">{selectedStudent.carrera || 'Estudiante'}</p>
                  <p className="text-xs text-slate-500 m-0">{selectedStudent.university || 'Universidad de Guayaquil'} · {semLabel}</p>
                </div>
                <div className={`flex flex-col items-center px-5 py-3 rounded-md ${afColor.bg} ${afColor.border} border`}>
                  <span className={`text-3xl font-bold ${afColor.text}`}>{selectedStudent.afinidad}%</span>
                  <span className="text-[10px] text-slate-500 font-medium">afinidad</span>
                </div>
              </div>

              {/* Vacancy reference */}
              <Card variant="accent" padding="sm">
                <div className="flex items-center gap-2">
                  <FiFileText className="text-primary-600 flex-shrink-0" size={16} />
                  <div>
                    <p className="text-[10px] text-primary-500 uppercase font-semibold m-0">Afinidad con tu vacante</p>
                    <p className="text-sm font-medium text-primary-800 m-0">{selectedStudent.vacante}</p>
                  </div>
                </div>
              </Card>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
                <InfoField icon={FiMail} label="Correo electronico" value={selectedStudent.correo} />
                <InfoField icon={FiCreditCard} label="Cedula" value={selectedStudent.cedula} />
              </div>

              {/* Experience */}
              {selectedStudent.experience_summary && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Experiencia y formacion</h4>
                  <p className="text-sm text-slate-700 leading-relaxed m-0 p-3 bg-slate-50 rounded-md">{selectedStudent.experience_summary}</p>
                </div>
              )}

              {/* Interests */}
              {selectedStudent.interests && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Areas de interes</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.interests.split(',').map((interest, i) => (
                      <span key={i} className="inline-flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
                        {interest.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Skills — comparison */}
              {selectedStudent.matched_skills && selectedStudent.matched_skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiAward size={14} /> Skills que coinciden con tu vacante ({selectedStudent.matched_count}/{selectedStudent.total_vacancy_skills})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.matched_skills.map((skill, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 shadow-sm rounded-md text-xs font-bold">
                        <FiCheckCircle size={12} /> {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* All Skills - Flat List */}
              {selectedStudent.all_skills && selectedStudent.all_skills.length > 0 ? (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiTarget size={14} /> Todas las habilidades del estudiante
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.all_skills.map((skill, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-md text-xs">
                        <span className="font-medium text-slate-700">{skill.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                (!selectedStudent.matched_skills || selectedStudent.matched_skills.length === 0) && (
                  <div className="p-4 text-center border border-slate-200 rounded-md bg-slate-50 text-sm text-slate-500">
                    No hay detalle de habilidades disponible para este estudiante.
                  </div>
                )
              )}

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button variant="secondary" onClick={() => setViewProfileModal(null)}>
                  Cerrar
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
