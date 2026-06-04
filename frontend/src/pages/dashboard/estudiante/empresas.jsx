import { useState, useEffect } from 'react';
import { useAuth } from 'context/AuthContext';
import PageHeader from 'components/PageHeader';
import Card from 'components/Card';
import Modal from 'components/Modal';
import DataTable from 'components/DataTable';
import adminService from 'services/adminService';
import { FiEye, FiBriefcase, FiMapPin, FiMail, FiPhone, FiGlobe, FiLoader } from 'react-icons/fi';
import Toast from 'components/Toast';

export default function EstudianteEmpresas() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [viewModal, setViewModal] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await adminService.getCompanies();
      if (res.result) {
        setCompanies(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleViewDetail = async (row) => {
    setViewModal(row);
    setDetailLoading(true);
    try {
      const res = await adminService.getUserDetail(row.usuario_id);
      if (res.result) {
        const pd = res.data.perfil_empresa;
        setDetailData({
          ...pd,
          representante: res.data.nombre + ' ' + (res.data.apellido || ''),
          correo_representante: res.data.correo,
          fecha_registro: res.data.creado_en,
          codigo_convenio: row.codigo_convenio,
          tipo_convenio: row.tipo_convenio,
          fecha_inicio_convenio: row.fecha_inicio_convenio,
          fecha_limite_convenio: row.fecha_limite_convenio
        });
      } else {
        setToast({ type: 'error', message: res.message || 'No se pudo cargar el detalle' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Error al conectar con el servidor' });
    } finally {
      setDetailLoading(false);
    }
  };

  const columns = [
    { key: 'codigo_convenio', label: 'Código', render: (val) => val || '-' },
    {
      key: 'nombre_empresa',
      label: 'Empresa',
      render: (val, row) => (
        <div>
          <p className="font-medium text-slate-800 m-0">{val}</p>
          <p className="text-xs text-slate-500 m-0">{row.ruc || 'Sin RUC'}</p>
        </div>
      ),
    },
    { key: 'tipo_convenio', label: 'Tipo Convenio', render: (val) => val || '-' },
    { key: 'industria', label: 'Sector', render: (val) => val || '-' },
    { key: 'fecha_limite_convenio', label: 'Expira Convenio', render: (val) => val ? new Date(val).toLocaleDateString('es-EC') : '-' },
  ];

  return (
    <div className="animate-fade-in">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <PageHeader
        title="Empresas en Convenio"
        subtitle={loading ? 'Cargando...' : `Empresas aprobadas para prácticas preprofesionales en la facultad de ${user?.facultad_nombre || 'facultad'}`}
      />

      {loading ? (
        <Card>
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <FiLoader className="animate-spin text-primary-600" size={32} />
            <span className="text-sm font-medium">Cargando empresas...</span>
          </div>
        </Card>
      ) : (
        <DataTable
          columns={columns}
          data={companies}
          searchKeys={['nombre_empresa', 'ruc', 'industria']}
          actions={(row) => (
            <button
              onClick={() => handleViewDetail(row)}
              className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-600"
              title="Ver detalle de empresa"
            >
              <FiEye size={16} />
            </button>
          )}
        />
      )}

      {/* Detail Modal */}
      <Modal isOpen={!!viewModal} onClose={() => { setViewModal(null); setDetailData(null); }} title="Detalle del Convenio" size="lg">
        {viewModal && (
          <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-md bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold">
                {(viewModal.nombre_empresa || '?').charAt(0)}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 m-0">{viewModal.nombre_empresa}</p>
                <p className="text-sm text-slate-500 m-0">RUC: {viewModal.ruc || 'Sin RUC'}</p>
              </div>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
                <FiLoader className="animate-spin" size={18} />
                <span className="text-sm">Cargando información detallada...</span>
              </div>
            ) : detailData ? (
              <div className="mt-2 grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-md animate-fade-in">
                <div className="flex items-center gap-2 col-span-2"><FiBriefcase className="text-slate-400" size={14} /><div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Convenio</p><p className="text-sm font-medium text-slate-800 m-0">{detailData.codigo_convenio || 'Sin código'} · {detailData.tipo_convenio || '-'}</p></div></div>
                <div className="flex items-center gap-2"><FiBriefcase className="text-slate-400" size={14} /><div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Sector</p><p className="text-sm font-medium text-slate-800 m-0">{detailData.industria || '-'}</p></div></div>
                <div className="flex items-center gap-2"><FiBriefcase className="text-slate-400" size={14} /><div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Facultad</p><p className="text-sm font-medium text-slate-800 m-0">{user?.facultad_nombre || '-'}</p></div></div>
                <div className="flex items-center gap-2"><FiMapPin className="text-slate-400" size={14} /><div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Ubicación</p><p className="text-sm font-medium text-slate-800 m-0">{detailData.ciudad || '-'}{detailData.direccion ? ` - ${detailData.direccion}` : ''}</p></div></div>
                <div className="flex items-center gap-2"><FiMail className="text-slate-400" size={14} /><div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Correo contacto</p><p className="text-sm font-medium text-slate-800 m-0">{detailData.correo_contacto || '-'}</p></div></div>
                <div className="flex items-center gap-2"><FiPhone className="text-slate-400" size={14} /><div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Teléfono</p><p className="text-sm font-medium text-slate-800 m-0">{detailData.telefono || '-'}</p></div></div>
                {detailData.sitio_web && <div className="flex items-center gap-2 col-span-2"><FiGlobe className="text-slate-400" size={14} /><div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Sitio Web</p><a href={detailData.sitio_web} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">{detailData.sitio_web}</a></div></div>}
                <div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Inicio Convenio</p><p className="text-sm font-medium text-slate-800 m-0">{detailData.fecha_inicio_convenio || '-'}</p></div>
                <div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Vigente hasta</p><p className="text-sm font-medium text-slate-800 m-0">{detailData.fecha_limite_convenio ? new Date(detailData.fecha_limite_convenio).toLocaleDateString('es-EC') : '-'}</p></div>
              </div>
            ) : null}
          </div>
        )}
      </Modal>
    </div>
  );
}
