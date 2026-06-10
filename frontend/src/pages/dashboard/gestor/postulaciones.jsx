import { useState, useEffect } from 'react';
import PageHeader from 'components/PageHeader';
import StatusBadge from 'components/StatusBadge';
import Button from 'components/Button';
import Card from 'components/Card';
import EmptyState from 'components/EmptyState';
import DataTable from 'components/DataTable';
import SolicitudDetalleView from 'components/SolicitudDetalleView';
import applicationService from 'services/applicationService';
import profileService from 'services/profileService';
import adminService from 'services/adminService';
import { FiEye, FiLoader, FiFileText } from 'react-icons/fi';

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
        estado: 'aceptada',
        notas: 'Aceptado formalmente por el gestor de PPP',
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
        estado: 'rechazada_gestor',
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

  const [creatingSupervisor, setCreatingSupervisor] = useState(false);
  async function handleCreateSupervisor(formData) {
    if (!solicitudData?.institucion?.institucion_id) return false;
    setCreatingSupervisor(true);
    try {
      const res = await adminService.createSupervisor(solicitudData.institucion.institucion_id, formData);
      if (res.result && res.data?.supervisor_id) {
        const newSup = { supervisor_id: res.data.supervisor_id, ...formData };
        setSupervisores(prev => [...prev, newSup]);
        setSelectedSupervisor(res.data.supervisor_id);
        return true;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingSupervisor(false);
    }
    return false;
  }

  async function handleUpdateSupervisor(id, formData) {
    setCreatingSupervisor(true);
    try {
      const res = await adminService.updateSupervisor(id, formData);
      if (res.result) {
        setSupervisores(prev => prev.map(s => String(s.supervisor_id) === String(id) ? { ...s, ...formData } : s));
        return true;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingSupervisor(false);
    }
    return false;
  }

  const pendingApps = applications.filter(a => a.estado === 'aceptada_empresa');

  const columns = [
    {
      key: 'estudiante',
      label: 'Estudiante / Carrera',
      render: (_, app) => (
        <div>
          <p className="font-semibold text-slate-800 m-0">{app.nombre_estudiante || 'Estudiante'}</p>
          <p className="text-xs text-slate-500 m-0">Carrera: {app.carrera || '-'} • Semestre: {app.semestre ? `${app.semestre}º` : '-'}</p>
        </div>
      ),
    },
    {
      key: 'vacante',
      label: 'Vacante / Empresa',
      render: (_, app) => (
        <div>
          <p className="font-medium text-slate-700 m-0">{app.titulo_vacante || app.titulo || '-'}</p>
          <p className="text-xs text-slate-500 m-0">{app.nombre_empresa || '-'}</p>
        </div>
      ),
    },
    {
      key: 'afinidad',
      label: 'Afinidad',
      render: (_, app) => <span className="font-bold text-primary-600">{app.porcentaje_afinidad}%</span>,
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_, app) => <StatusBadge status={app.estado} />,
    },
  ];

  if (detailModal) {
    return (
      <div className="animate-fade-in">
        <SolicitudDetalleView
          isOpen={true}
          onClose={closeDetail}
          solicitud={solicitudData}
          loading={detailLoading}
          supervisors={supervisores}
          selectedSupervisor={selectedSupervisor}
          onSupervisorChange={setSelectedSupervisor}
          onCreateSupervisor={handleCreateSupervisor}
          onUpdateSupervisor={handleUpdateSupervisor}
          creatingSupervisor={creatingSupervisor}
          showActions={true}
          onApprove={confirmApprove}
          onReject={handleReject}
          approveLoading={actionLoading.approve}
          rejectLoading={actionLoading.reject}
          approveDisabled={!selectedSupervisor}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Postulaciones Pendientes"
        subtitle={loading ? 'Cargando postulaciones...' : `${pendingApps.length} solicitudes pendientes de aprobación`}
      />

      {loading ? (
        <Card>
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <FiLoader className="animate-spin" size={24} />
            <span className="text-sm font-medium">Cargando postulaciones...</span>
          </div>
        </Card>
      ) : pendingApps.length === 0 ? (
        <EmptyState
          variant="dashed"
          message="No hay postulaciones pendientes de aprobación"
        />
      ) : (
        <DataTable
          columns={columns}
          data={pendingApps}
          searchKeys={['nombre_estudiante', 'titulo_vacante', 'titulo', 'nombre_empresa']}
          actions={(row) => (
            <Button
              variant="outline"
              size="sm"
              icon={<FiFileText />}
              onClick={() => openDetail(row)}
            >
              Procesar Solicitud
            </Button>
          )}
        />
      )}
    </div>
  );
}
