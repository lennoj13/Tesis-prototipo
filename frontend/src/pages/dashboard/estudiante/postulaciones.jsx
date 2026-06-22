
/**
 * Estudiante Postulaciones — Lista real de postulaciones.
 * Modulo 5: Postulacion y Seguimiento
 */

import { useState, useEffect } from 'react';
import { useAuth } from 'context/AuthContext';
import applicationService from 'services/applicationService';
import PageHeader from 'components/PageHeader';
import DataTable from 'components/DataTable';
import StatusBadge from 'components/StatusBadge';
import TrackingStepper from 'components/TrackingStepper';
import Modal from 'components/Modal';
import Toast from 'components/Toast';
import Card from 'components/Card';
import { FiEye, FiMapPin, FiCalendar, FiBriefcase, FiClock, FiVideo, FiLink, FiExternalLink } from 'react-icons/fi';

const statusMap = {
  pending: 'pendiente',
  approved: 'aprobado',
  aprobada: 'aprobado',
  rejected: 'rechazado',
  rechazada: 'rechazado',
  rechazada_gestor: 'rechazado',
  anulada: 'anulada',
  completada: 'completada',
  entrevista: 'entrevista',
};

export default function EstudiantePostulaciones() {
  const { user } = useAuth();
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadData = async () => {
    try {
      const res = await applicationService.getMyApplications(user?.profile_id);
      if (res.result) {
        setPostulaciones((res.data || []).map(a => ({
          id: a.postulacion_id || a.application_id,
          vacante: a.titulo || a.title,
          empresa: a.nombre_empresa || a.company_name,
          match: a.porcentaje_afinidad || a.match_percentage || 0,
          // Guardamos el estado raw para el stepper
          estadoRaw: a.estado || a.status,
          estado: statusMap[a.estado] || a.estado || a.status,
          fecha: a.creado_en || a.created_at,
          area: a.area || '',
          modalidad: a.modalidad || a.modality || '',
          ubicacion: a.ubicacion || a.location || '',
          descripcion: a.descripcion || '',
          requisitos: a.requisitos || '',
          horario: a.horario || '',
          horas_diarias: a.horas_diarias || '',
          total_horas: a.total_horas || '',
          fecha_expiracion: a.fecha_expiracion || '',
          cupos: a.cupos || 1,
          skills: a.skills || [],
          // Datos de entrevista
          fecha_entrevista: a.fecha_entrevista || null,
          hora_entrevista: a.hora_entrevista || null,
          modalidad_entrevista: a.modalidad_entrevista || null,
          direccion_entrevista: a.direccion_entrevista || null,
          link_reunion: a.link_reunion || null,
          // Fechas para el stepper
          fecha_respuesta_empresa: a.fecha_respuesta_empresa || null,
          fecha_respuesta_gestor: a.fecha_respuesta_gestor || null,
        })));
      }
    } catch (err) {
      console.error('Error cargando postulaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleCancelApplication = async () => {
    if (!viewModal || !viewModal.id) return;
    setCancelLoading(true);
    try {
      const res = await applicationService.updateStatus(viewModal.id, { estado: 'cancelada' });
      if (res.result) {
        setToast({ type: 'success', message: 'Has cancelado tu postulacion exitosamente.' });
        setViewModal(null);
        await loadData();
      } else {
        setToast({ type: 'error', message: res.message || 'Error al cancelar la postulacion' });
      }
    } catch (e) {
      setToast({ type: 'error', message: 'Error al conectar con el servidor' });
    } finally {
      setCancelLoading(false);
    }
  };

  const columns = [
    {
      key: 'vacante',
      label: 'Vacante de Practicas',
      render: (val, row) => (
        <div>
          <p className="font-medium text-slate-800 m-0">{val}</p>
          <p className="text-xs text-slate-500 m-0">{row.empresa}</p>
        </div>
      ),
    },
    {
      key: 'match',
      label: 'Afinidad',
      render: (val) => {
        const color = val >= 80 ? 'text-green-600 bg-success-light' :
                      val >= 60 ? 'text-amber-600 bg-warning-light' :
                      'text-slate-600 bg-slate-100';
        return (
          <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold ${color}`}>
            {val}%
          </span>
        );
      },
    },
    { key: 'area', label: 'Area' },
    { key: 'estado', label: 'Estado', render: (val) => <StatusBadge status={val} /> },
    { key: 'fecha', label: 'Fecha', render: (val) => val ? new Date(val).toLocaleDateString('es-EC') : '-' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Mis Postulaciones"
        subtitle={loading ? 'Cargando...' : `${postulaciones.length} postulaciones a practicas preprofesionales`}
      />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <DataTable
        columns={columns}
        data={postulaciones}
        searchKeys={['vacante', 'empresa', 'area']}
        actions={(row) => (
          <button
            onClick={() => setViewModal(row)}
            className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-600"
            title="Ver detalle"
          >
            <FiEye size={16} />
          </button>
        )}
      />

      {/* Modal — Detalle de postulacion */}
      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Seguimiento de Postulacion" size="lg">
        {viewModal && (
          <div className="flex flex-col gap-5">
            {/* Stepper de seguimiento */}
            <TrackingStepper
              currentStatus={viewModal.estadoRaw}
              fechaPostulacion={viewModal.fecha}
              fechaEntrevista={viewModal.fecha_entrevista}
              horaEntrevista={viewModal.hora_entrevista}
              fechaAceptacion={viewModal.fecha_respuesta_empresa}
              fechaFormalizacion={viewModal.fecha_respuesta_gestor}
            />

            {/* Datos de la entrevista (si aplica) */}
            {viewModal.fecha_entrevista && (
              <div className="p-4 bg-slate-50 rounded-md">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiCalendar size={14} /> Datos de la Entrevista
                </h4>
                <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                  <div className="flex items-center gap-2">
                    <FiCalendar size={14} className="text-slate-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500 m-0">Fecha</p>
                      <p className="text-sm font-semibold text-slate-800 m-0">
                        {new Date(viewModal.fecha_entrevista + 'T00:00:00').toLocaleDateString('es-EC', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  {viewModal.hora_entrevista && (
                    <div className="flex items-center gap-2">
                      <FiClock size={14} className="text-slate-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 m-0">Hora</p>
                        <p className="text-sm font-semibold text-slate-800 m-0">{viewModal.hora_entrevista}</p>
                      </div>
                    </div>
                  )}
                  {viewModal.modalidad_entrevista && (
                    <div className="flex items-center gap-2">
                      {viewModal.modalidad_entrevista === 'Virtual' ? (
                        <FiVideo size={14} className="text-slate-400 flex-shrink-0" />
                      ) : (
                        <FiMapPin size={14} className="text-slate-400 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-xs text-slate-500 m-0">Modalidad</p>
                        <p className="text-sm font-semibold text-slate-800 m-0">{viewModal.modalidad_entrevista}</p>
                      </div>
                    </div>
                  )}
                  {viewModal.direccion_entrevista && (
                    <div className="flex items-center gap-2">
                      <FiMapPin size={14} className="text-slate-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 m-0">Direccion</p>
                        <p className="text-sm font-semibold text-slate-800 m-0">{viewModal.direccion_entrevista}</p>
                      </div>
                    </div>
                  )}
                  {viewModal.link_reunion && (
                    <div className="flex items-center gap-2 col-span-2">
                      <FiLink size={14} className="text-slate-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 m-0">Enlace de reunion</p>
                        <a
                          href={viewModal.link_reunion}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-primary-600 hover:text-primary-700 underline flex items-center gap-1"
                        >
                          Unirse a la reunion <FiExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Datos de la vacante */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{viewModal.vacante}</h3>
                <p className="text-sm text-slate-500">{viewModal.empresa}</p>
              </div>
              <div className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-lg font-bold
                ${viewModal.match >= 80 ? 'bg-success-light text-green-700' : 
                  viewModal.match >= 60 ? 'bg-warning-light text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                {viewModal.match}%
                <span className="text-xs font-medium ml-0.5">afinidad</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-md max-md:grid-cols-1">
              <div className="flex items-center gap-2">
                <FiMapPin size={14} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 m-0">Modalidad</p>
                  <p className="text-sm font-semibold text-slate-800 m-0">{viewModal.modalidad || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiBriefcase size={14} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 m-0">Ubicacion</p>
                  <p className="text-sm font-semibold text-slate-800 m-0">{viewModal.ubicacion || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar size={14} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 m-0">Fecha postulacion</p>
                  <p className="text-sm font-semibold text-slate-800 m-0">{viewModal.fecha ? new Date(viewModal.fecha).toLocaleDateString('es-EC') : '-'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 m-0 mb-1">Estado</p>
                <StatusBadge status={viewModal.estado} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 max-md:grid-cols-1">
              {viewModal.cupos && (
                <div>
                  <p className="text-xs text-slate-500 m-0">Cupos</p>
                  <p className="text-sm font-semibold text-slate-800 m-0">{viewModal.cupos} disponibles</p>
                </div>
              )}
              {viewModal.total_horas && (
                <div>
                  <p className="text-xs text-slate-500 m-0">Horas totales</p>
                  <p className="text-sm font-semibold text-slate-800 m-0">{viewModal.total_horas} horas</p>
                </div>
              )}
              {viewModal.horas_diarias && (
                <div>
                  <p className="text-xs text-slate-500 m-0">Horas al dia</p>
                  <p className="text-sm font-semibold text-slate-800 m-0">{viewModal.horas_diarias} horas</p>
                </div>
              )}
              {viewModal.horario && (
                <div>
                  <p className="text-xs text-slate-500 m-0">Horario</p>
                  <p className="text-sm font-semibold text-slate-800 m-0">{viewModal.horario}</p>
                </div>
              )}
            </div>

            {viewModal.descripcion && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Descripcion</h4>
                <p className="text-sm text-slate-700 leading-relaxed m-0">{viewModal.descripcion}</p>
              </div>
            )}

            {viewModal.requisitos && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Requisitos</h4>
                <p className="text-sm text-slate-700 leading-relaxed m-0">{viewModal.requisitos}</p>
              </div>
            )}

            {viewModal.skills && viewModal.skills.length > 0 && (
              <div className="pt-2">
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

            {/* Boton cancelar solo en estado pendiente */}
            {viewModal.estadoRaw === 'pendiente' && (
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  onClick={handleCancelApplication}
                  disabled={cancelLoading}
                  className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-md text-sm font-semibold hover:bg-red-50 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {cancelLoading ? 'Cancelando...' : 'Cancelar Postulacion'}
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
