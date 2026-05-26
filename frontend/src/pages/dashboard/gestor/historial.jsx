import { useState, useEffect } from 'react';
import PageHeader from 'components/PageHeader';
import StatusBadge from 'components/StatusBadge';
import Button from 'components/Button';
import SolicitudDetalleModal from 'components/SolicitudDetalleModal';
import applicationService from 'services/applicationService';
import { FiEye } from 'react-icons/fi';

export default function GestorHistorial() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas');

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

  const historyApps = applications.filter(
    (app) => app.estado === 'aprobada' || app.estado === 'rechazada'
  );

  const filteredApps = filter === 'todas'
    ? historyApps
    : historyApps.filter((app) => app.estado === filter);

  return (
    <div>
      <PageHeader
        title="Historial de Postulaciones"
        subtitle={loading ? 'Cargando historial...' : `${filteredApps.length} solicitudes en historial`}
      />

      <div className="flex gap-2 mt-4 mb-6 flex-wrap">
        {[
          { key: 'todas', label: 'Todas' },
          { key: 'aprobada', label: 'Aprobadas' },
          { key: 'rechazada', label: 'Rechazadas' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === item.key
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg">No hay postulaciones en el historial</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredApps.map((app) => (
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
        showActions={false}
      />
    </div>
  );
}
