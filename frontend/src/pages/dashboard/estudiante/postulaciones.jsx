
/**
 * Estudiante Postulaciones — Lista real de postulaciones.
 * Módulo 5: Postulación y Seguimiento
 */

import { useState, useEffect } from 'react';
import { useAuth } from 'context/AuthContext';
import applicationService from 'services/applicationService';
import PageHeader from 'components/PageHeader';
import DataTable from 'components/DataTable';
import StatusBadge from 'components/StatusBadge';
import Modal from 'components/Modal';
import { FiEye, FiMapPin, FiCalendar, FiBriefcase } from 'react-icons/fi';

const statusMap = {
  pending: 'pendiente',
  approved: 'aprobado',
  rejected: 'rechazado',
};

export default function EstudiantePostulaciones() {
  const { user } = useAuth();
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await applicationService.getMyApplications(user?.profile_id);
        if (res.result) {
          setPostulaciones((res.data || []).map(a => ({
            id: a.postulacion_id || a.application_id,
            vacante: a.titulo || a.title,
            empresa: a.nombre_empresa || a.company_name,
            match: a.porcentaje_afinidad || a.match_percentage || 0,
            estado: statusMap[a.estado] || a.estado || a.status,
            fecha: a.creado_en || a.created_at,
            area: a.area || '',
            modalidad: a.modalidad || a.modality || '',
            ubicacion: a.ubicacion || a.location || '',
          })));
        }
      } catch (err) {
        console.error('Error cargando postulaciones:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const columns = [
    {
      key: 'vacante',
      label: 'Vacante de Prácticas',
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
    { key: 'area', label: 'Área' },
    { key: 'estado', label: 'Estado', render: (val) => <StatusBadge status={val} /> },
    { key: 'fecha', label: 'Fecha', render: (val) => val ? new Date(val).toLocaleDateString('es-EC') : '-' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Mis Postulaciones"
        subtitle={loading ? 'Cargando...' : `${postulaciones.length} postulaciones a prácticas preprofesionales`}
      />

      <DataTable
        columns={columns}
        data={postulaciones}
        searchKeys={['vacante', 'empresa', 'area']}
        actions={(row) => (
          <button
            onClick={() => setViewModal(row)}
            className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-600"
            title="Ver detalle"
          >
            <FiEye size={16} />
          </button>
        )}
      />

      {/* Modal — Detalle de postulación */}
      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Detalle de Postulación" size="lg">
        {viewModal && (
          <div className="flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{viewModal.vacante}</h3>
                <p className="text-sm text-slate-500">{viewModal.empresa}</p>
              </div>
              <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-lg font-bold
                ${viewModal.match >= 80 ? 'bg-success-light text-green-700' : 
                  viewModal.match >= 60 ? 'bg-warning-light text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                {viewModal.match}%
                <span className="text-xs font-medium ml-0.5">afinidad</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl max-md:grid-cols-1">
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
                  <p className="text-xs text-slate-500 m-0">Ubicación</p>
                  <p className="text-sm font-semibold text-slate-800 m-0">{viewModal.ubicacion || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar size={14} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 m-0">Fecha postulación</p>
                  <p className="text-sm font-semibold text-slate-800 m-0">{viewModal.fecha ? new Date(viewModal.fecha).toLocaleDateString('es-EC') : '-'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 m-0 mb-1">Estado</p>
                <StatusBadge status={viewModal.estado} />
              </div>
            </div>

            {viewModal.estado === 'aprobado' && (
              <div className="p-4 bg-success-light border border-green-200 rounded-xl">
                <p className="text-sm font-semibold text-green-800 mb-1">🎉 ¡Felicidades!</p>
                <p className="text-sm text-green-700">Tu postulación ha sido aprobada. La empresa se pondrá en contacto contigo.</p>
              </div>
            )}
            {viewModal.estado === 'rechazado' && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-sm text-slate-600">Tu postulación no fue seleccionada en esta oportunidad.</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
