import { useState, useEffect } from 'react';
import PageHeader from 'components/PageHeader';
import StatusBadge from 'components/StatusBadge';
import Button from 'components/Button';
import SolicitudDetalleModal from 'components/SolicitudDetalleModal';
import applicationService from 'services/applicationService';
import profileService from 'services/profileService';
import { FiEye } from 'react-icons/fi';

export default function GestorPostulaciones() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [detailModal, setDetailModal] = useState(null);
  const [solicitudData, setSolicitudData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [supervisores, setSupervisores] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [actionLoading, setActionLoading] = useState({ approve: false, reject: false });

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      const response = await applicationService.getAll();
      if (response.result) {
        setApplications(response.data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function openDetail(app) {
    setDetailModal(app);
    setSolicitudData(null);
    setSelectedSupervisor(app.supervisor_id || '');
    setDetailLoading(true);
    try {
      const [solRes, supRes] = await Promise.all([
        applicationService.getSolicitud(app.postulacion_id),
        app.empresa_usuario_id ? profileService.getPublicProfile(app.empresa_usuario_id) : Promise.resolve(null),
      ]);

      if (solRes?.result) {
        setSolicitudData(solRes.data);
      }
      if (supRes?.result && supRes.data?.details?.supervisores) {
        setSupervisores(supRes.data.details.supervisores);
      } else {
        setSupervisores([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDetailLoading(false);
    }
  }

  function closeDetail() {
    setDetailModal(null);
    setSolicitudData(null);
    setSupervisores([]);
    setSelectedSupervisor('');
  }

  async function confirmApprove() {
    if (!detailModal) return;
    setActionLoading(prev => ({ ...prev, approve: true }));
    try {
      const response = await applicationService.updateStatus(detailModal.postulacion_id, {
        estado: 'aprobada',
        notas: 'Aprobado por el gestor de PPP',
        supervisor_id: parseInt(selectedSupervisor) || null,
      });
      if (response.result) {
        closeDetail();
        loadApplications();
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, approve: false }));
    }
  }

  async function handleReject() {
    if (!detailModal) return;
    setActionLoading(prev => ({ ...prev, reject: true }));
    try {
      const response = await applicationService.updateStatus(detailModal.postulacion_id, {
        estado: 'rechazada',
        notas: 'Rechazado por el gestor de PPP',
      });
      if (response.result) {
        closeDetail();
        loadApplications();
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, reject: false }));
    }
  }

  const pendingApps = applications.filter(a => a.estado === 'aceptada_empresa');

  return (
    <div>
      <PageHeader
        title="Postulaciones Pendientes"
        subtitle={loading ? 'Cargando postulaciones...' : `${pendingApps.length} solicitudes pendientes de aprobación`}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : pendingApps.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg">No hay postulaciones pendientes de aprobación</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingApps.map((app) => (
            <div key={app.postulacion_id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-slate-800 mb-1">
                    {app.nombre_estudiante || 'Estudiante'}
                  </h3>
                  <p className="text-sm text-slate-500 mb-1">
                    Vacante: <span className="font-medium text-slate-700">{app.titulo_vacante || app.titulo || '-'}</span>
                  </p>
                  <p className="text-sm text-slate-500 mb-1">
                    Empresa: <span className="font-medium text-slate-700">{app.nombre_empresa || '-'}</span>
                  </p>
                  <p className="text-sm text-slate-500">
                    Carrera: {app.carrera || '-'} | Semestre: {app.semestre || '-'} | Afinidad: <span className="font-bold text-primary-600">{app.porcentaje_afinidad}%</span>
                  </p>
                  {app.nro_solicitud && (
                    <p className="text-sm text-green-600 font-medium mt-1">
                      Nro. Solicitud: {app.nro_solicitud}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={app.estado} />
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<FiEye />}
                    onClick={() => openDetail(app)}
                  >
                    Ver detalle
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <SolicitudDetalleModal
        isOpen={!!detailModal}
        onClose={closeDetail}
        solicitud={solicitudData}
        loading={detailLoading}
        supervisors={supervisores}
        selectedSupervisor={selectedSupervisor}
        onSupervisorChange={setSelectedSupervisor}
        showActions
        onApprove={confirmApprove}
        onReject={handleReject}
        approveLoading={actionLoading.approve}
        rejectLoading={actionLoading.reject}
        approveDisabled={!selectedSupervisor}
      />
    </div>
  );
}
