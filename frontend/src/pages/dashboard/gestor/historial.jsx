import { useState, useEffect } from 'react';
import PageHeader from 'components/PageHeader';
import StatusBadge from 'components/StatusBadge';
import Button from 'components/Button';
import Card from 'components/Card';
import EmptyState from 'components/EmptyState';
import DataTable from 'components/DataTable';
import SolicitudDetalleView from 'components/SolicitudDetalleView';
import applicationService from 'services/applicationService';
import { FiEye, FiLoader, FiCheckCircle, FiXCircle, FiMinusCircle } from 'react-icons/fi';

export default function GestorHistorial() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [detailModal, setDetailModal] = useState(null);
  const [solicitudData, setSolicitudData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

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
    setDetailLoading(true);
    try {
      const solRes = await applicationService.getSolicitud(app.postulacion_id);
      if (solRes?.result) {
        setSolicitudData(solRes.data);
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
  }

  async function handleUpdateStatus(newStatus) {
    if (!detailModal) return;
    try {
      let msg = 'Estado actualizado';
      if (newStatus === 'aprobada') msg = 'Práctica aprobada exitosamente';
      if (newStatus === 'reprobada') msg = 'Práctica reprobada';
      if (newStatus === 'anulada') msg = 'Práctica anulada';
      
      const response = await applicationService.updateStatus(detailModal.postulacion_id, {
        estado: newStatus,
        notas: msg,
      });
      if (response.result) {
        closeDetail();
        loadApplications();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const historyApps = applications.filter(
    (app) => ['aceptada', 'aprobada', 'reprobada', 'rechazada_gestor', 'completada', 'anulada'].includes(app.estado)
  );

  const filteredApps = historyApps.filter((app) => {
    if (filter !== 'todas' && app.estado !== filter) return false;
    
    if (dateFrom && app.fecha_respuesta_gestor && app.fecha_respuesta_gestor < dateFrom) return false;
    if (dateTo && app.fecha_respuesta_gestor && app.fecha_respuesta_gestor > dateTo) return false;
    
    return true;
  });

  const columns = [
    {
      key: 'nro_solicitud',
      label: 'Nro. Sol.',
      render: (_, app) => app.nro_solicitud ? <span className="text-sm text-green-600 font-medium">{app.nro_solicitud}</span> : <span className="text-sm text-slate-400 font-medium">-</span>,
    },
    {
      key: 'fecha_respuesta_gestor',
      label: 'F. Resolución',
      render: (_, app) => app.fecha_respuesta_gestor ? <span className="text-sm font-medium text-slate-700">{app.fecha_respuesta_gestor}</span> : <span className="text-sm text-slate-400 font-medium">-</span>,
    },
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
          showActions={false}
          extraActions={
            detailModal.estado === 'aceptada' && (
              <>
                <Button variant="primary" size="sm" icon={<FiCheckCircle />} onClick={() => handleUpdateStatus('aprobada')}>
                  Aprobar Prácticas
                </Button>
                <Button variant="danger" size="sm" icon={<FiXCircle />} onClick={() => handleUpdateStatus('reprobada')}>
                  Reprobar Prácticas
                </Button>
                <Button variant="secondary" size="sm" icon={<FiMinusCircle />} onClick={() => handleUpdateStatus('anulada')}>
                  Anular Práctica
                </Button>
              </>
            )
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Historial de Postulaciones"
        subtitle={loading ? 'Cargando historial...' : `${filteredApps.length} solicitudes en historial`}
      />

      <div className="flex gap-2 mt-4 mb-6 flex-wrap">
        {[
          { key: 'todas', label: 'Todas' },
          { key: 'aceptada', label: 'Aceptadas (En curso)' },
          { key: 'aprobada', label: 'Aprobadas' },
          { key: 'reprobada', label: 'Reprobadas' },
          { key: 'anulada', label: 'Anuladas' },
          { key: 'rechazada_gestor', label: 'Rechazadas' },
        ].map((item) => (
          <Button
            key={item.key}
            onClick={() => setFilter(item.key)}
            size="sm"
            variant={filter === item.key ? 'primary' : 'secondary'}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <Card>
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <FiLoader className="animate-spin" size={24} />
            <span className="text-sm font-medium">Cargando historial...</span>
          </div>
        </Card>
      ) : filteredApps.length === 0 ? (
        <EmptyState
          variant="dashed"
          message="No hay postulaciones en el historial"
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredApps}
          searchKeys={['nombre_estudiante', 'titulo_vacante', 'titulo', 'nombre_empresa', 'nro_solicitud']}
          filters={
            <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-600">Desde:</label>
                <input 
                  type="date" 
                  className="text-xs border-slate-300 rounded-md py-1 px-2 focus:ring-primary-500 focus:border-primary-500"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-600">Hasta:</label>
                <input 
                  type="date" 
                  className="text-xs border-slate-300 rounded-md py-1 px-2 focus:ring-primary-500 focus:border-primary-500"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              {(dateFrom || dateTo) && (
                <button
                  type="button"
                  onClick={() => { setDateFrom(''); setDateTo(''); }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline transition-colors ml-1"
                >
                  Limpiar
                </button>
              )}
            </div>
          }
          actions={(row) => (
            <Button
              variant="outline"
              size="sm"
              icon={<FiEye />}
              onClick={() => openDetail(row)}
            >
              Detalles
            </Button>
          )}
        />
      )}
    </div>
  );
}
