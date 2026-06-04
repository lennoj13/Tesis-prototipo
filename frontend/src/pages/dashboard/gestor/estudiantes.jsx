import { useState, useEffect } from 'react';
import PageHeader from 'components/PageHeader';
import DataTable from 'components/DataTable';
import Card from 'components/Card';
import StatusBadge from 'components/StatusBadge';
import Modal from 'components/Modal';
import adminService from 'services/adminService';
import applicationService from 'services/applicationService';
import { FiEye, FiUser, FiBriefcase, FiBookOpen, FiLoader } from 'react-icons/fi';

export default function GestorEstudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(null);
  const [studentDetail, setStudentDetail] = useState(null);
  const [applications, setApplications] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    async function loadStudents() {
      try {
        const response = await adminService.getUsers();
        if (response.result) {
          // Filtramos solo los estudiantes
          const soloEstudiantes = (response.data || []).filter(u => u.rol_nombre === 'estudiante');
          setEstudiantes(soloEstudiantes);
        }
      } catch (err) {
        console.error('Error cargando estudiantes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  async function handleViewDetail(studentRow) {
    setViewModal(studentRow);
    setStudentDetail(null);
    setApplications([]);
    setDetailLoading(true);

    try {
      const response = await adminService.getUserDetail(studentRow.usuario_id);
      if (response.result && response.data) {
        setStudentDetail(response.data);
        
        const profileId = response.data?.perfil_estudiante?.perfil_id;
        if (profileId) {
          const appsRes = await applicationService.getMyApplications(profileId);
          if (appsRes.result) {
            setApplications(appsRes.data || []);
          }
        }
      }
    } catch (err) {
      console.error('Error cargando detalle del estudiante:', err);
    } finally {
      setDetailLoading(false);
    }
  }

  const columns = [
    {
      key: 'nombre',
      label: 'Estudiante',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0 bg-primary-600 border border-primary-700">
            {(val || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-800 m-0 leading-tight">{val} {row.apellido}</p>
            <p className="text-[11px] text-slate-500 m-0">{row.cedula || 'Sin cédula'} • {row.correo}</p>
          </div>
        </div>
      ),
    },
    { key: 'semestre', label: 'Semestre', render: (val) => val ? `${val}º Semestre` : '-' },
    { key: 'activo', label: 'Estado Sistema', render: (val) => <StatusBadge status={val ? 'activo' : 'inactivo'} /> },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Directorio de Estudiantes"
        subtitle={loading ? 'Cargando...' : `${estudiantes.length} estudiantes registrados en tu carrera.`}
      />

      {loading ? (
        <Card>
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <FiLoader className="animate-spin" size={24} />
            <span className="text-sm font-medium">Cargando estudiantes...</span>
          </div>
        </Card>
      ) : (
        <DataTable
          columns={columns}
          data={estudiantes}
          searchKeys={['nombre', 'apellido', 'cedula', 'correo']}
          actions={(row) => (
            <button
              onClick={() => handleViewDetail(row)}
              className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-600"
              title="Ver perfil completo"
            >
              <FiEye size={16} />
            </button>
          )}
        />
      )}

      {/* Detail Modal */}
      <Modal isOpen={!!viewModal} onClose={() => { setViewModal(null); setStudentDetail(null); setApplications([]); }} title="Perfil del Estudiante" size="lg">
        {viewModal && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="w-14 h-14 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold border-2 border-primary-700">
                {(viewModal.nombre || '?').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 m-0">{viewModal.nombre} {viewModal.apellido}</h3>
                <p className="text-sm text-slate-500 m-0">C.I: {viewModal.cedula || '-'} | {viewModal.correo}</p>
              </div>
              <StatusBadge status={viewModal.activo ? 'activo' : 'inactivo'} />
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
                <FiLoader className="animate-spin" size={18} />
                <span className="text-sm">Cargando información detallada...</span>
              </div>
            ) : studentDetail ? (
              <div className="flex flex-col gap-6 h-[55vh] min-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                
                {/* Info Académica */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiBookOpen size={14} /> Información Académica
                  </h4>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Carrera</p>
                      <p className="text-sm font-medium text-slate-800 m-0">{studentDetail.perfil_estudiante?.carrera || '-'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Facultad</p>
                      <p className="text-sm font-medium text-slate-800 m-0">{studentDetail.perfil_estudiante?.facultad || '-'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Semestre Actual</p>
                      <p className="text-sm font-medium text-slate-800 m-0">{studentDetail.perfil_estudiante?.semestre || '-'}º</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Universidad</p>
                      <p className="text-sm font-medium text-slate-800 m-0">{studentDetail.perfil_estudiante?.universidad || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Habilidades */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiUser size={14} /> Habilidades Registradas
                  </h4>
                  {studentDetail.habilidades?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {studentDetail.habilidades.map((skill, i) => (
                        <span key={`${skill.nombre}-${i}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 text-xs font-semibold rounded-md border border-slate-200 shadow-sm">
                          {skill.nombre}
                          <span className="text-[10px] text-primary-600 bg-primary-50 px-1.5 rounded-full">Nv.{skill.nivel}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic m-0">El estudiante aún no registra habilidades en su perfil.</p>
                  )}
                </div>

                {/* Postulaciones e Historial */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiBriefcase size={14} /> Historial de Postulaciones ({applications.length})
                  </h4>
                  {applications.length > 0 ? (
                    <div className="grid gap-3">
                      {applications.map((app) => (
                        <div key={app.postulacion_id} className="flex items-start justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                          <div>
                            <p className="text-sm font-bold text-slate-800 m-0">{app.titulo || '-'}</p>
                            <p className="text-xs font-medium text-slate-500 m-0 mt-1">{app.nombre_empresa || '-'}</p>
                            {app.nro_solicitud && (
                              <p className="text-xs font-semibold text-primary-600 m-0 mt-1">Solicitud Formato N°: {app.nro_solicitud}</p>
                            )}
                          </div>
                          <StatusBadge status={app.estado} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                      <p className="text-sm font-medium text-slate-500 m-0">Sin historial de postulaciones</p>
                    </div>
                  )}
                </div>

              </div>
            ) : null}
          </div>
        )}
      </Modal>
    </div>
  );
}
