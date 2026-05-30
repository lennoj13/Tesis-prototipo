import { useState } from 'react';
import PageHeader from 'components/PageHeader';
import Input from 'components/Input';
import Button from 'components/Button';
import Card from 'components/Card';
import EmptyState from 'components/EmptyState';
import StatusBadge from 'components/StatusBadge';
import adminService from 'services/adminService';
import applicationService from 'services/applicationService';
import { FiSearch, FiUser } from 'react-icons/fi';

export default function GestorEstudiantes() {
  const [cedula, setCedula] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);

  async function handleSearch(e) {
    e.preventDefault();
    if (!cedula.trim()) {
      setError('Ingresa la cédula del estudiante');
      return;
    }

    setLoading(true);
    setError('');
    setStudent(null);
    setApplications([]);

    try {
      const response = await adminService.getUsers();
      if (!response.result) {
        setError(response.message || 'No se pudieron cargar usuarios');
        return;
      }

      const match = (response.data || []).find((u) => u.cedula === cedula.trim());
      if (!match) {
        setError('No se encontró un estudiante con esa cédula');
        return;
      }

      const detailRes = await adminService.getUserDetail(match.usuario_id);
      if (!detailRes.result) {
        setError(detailRes.message || 'No se pudo cargar el detalle del estudiante');
        return;
      }

      if (detailRes.data?.rol !== 'estudiante') {
        setError('La cédula ingresada no corresponde a un estudiante');
        return;
      }

      setStudent(detailRes.data);

      const profileId = detailRes.data?.perfil_estudiante?.perfil_id;
      if (profileId) {
        const appsRes = await applicationService.getMyApplications(profileId);
        if (appsRes.result) {
          setApplications(appsRes.data || []);
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Ocurrió un error al buscar el estudiante');
    } finally {
      setLoading(false);
    }
  }

  const postulaciones = student?.postulaciones || {};

  return (
    <div>
      <PageHeader
        title="Consulta de Estudiantes"
        subtitle="Busca estudiantes por número de cédula"
      />

      <Card className="max-w-xl">
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <Input
            label="Cédula del estudiante"
            placeholder="0955236773"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            icon={<FiSearch />}
            error={error}
          />
          <div className="flex items-center gap-2">
            <Button type="submit" loading={loading} icon={<FiSearch />}>
              Buscar estudiante
            </Button>
            <Button type="button" variant="secondary" onClick={() => { setCedula(''); setStudent(null); setApplications([]); setError(''); }}>
              Limpiar
            </Button>
          </div>
        </form>
      </Card>

      {student && (
        <div className="mt-6 flex flex-col gap-5">
          <Card title="Datos del estudiante">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#3c8dbc] text-white font-bold text-sm flex items-center justify-center flex-shrink-0 border border-[#2f6f92]">
                {student.nombre?.charAt(0).toUpperCase() || <FiUser />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-slate-800">{student.nombre} {student.apellido}</h3>
                <p className="text-sm text-slate-500">Cédula: {student.cedula || '-'} | {student.correo}</p>
                <p className="text-sm text-slate-500">
                  Carrera: {student.perfil_estudiante?.carrera || '-'} | Facultad: {student.perfil_estudiante?.facultad || '-'}
                </p>
                <p className="text-sm text-slate-500">
                  Semestre: {student.perfil_estudiante?.semestre || '-'} | Universidad: {student.perfil_estudiante?.universidad || '-'}
                </p>
              </div>
            </div>
          </Card>



          <Card title="Habilidades registradas">
            {student.habilidades?.length ? (
              <div className="flex flex-wrap gap-2">
                {student.habilidades.map((skill, i) => (
                  <span key={`${skill.nombre}-${i}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-md border border-primary-200">
                    {skill.nombre}
                    <span className="text-[10px] text-primary-600">Nv.{skill.nivel}</span>
                  </span>
                ))}
              </div>
            ) : (
              <EmptyState variant="flat" message="Sin habilidades registradas." className="py-6" />
            )}
          </Card>

          <Card title="Postulaciones del estudiante">
            {applications.length === 0 ? (
              <EmptyState variant="flat" message="No registra postulaciones." className="py-6" />
            ) : (
              <div className="grid gap-3">
                {applications.map((app) => (
                  <Card key={app.postulacion_id} variant="flat" padding="sm" className="bg-slate-50">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-800 mb-1">{app.titulo || '-'}</p>
                        <p className="text-xs text-slate-500">Empresa: {app.nombre_empresa || '-'}</p>
                        {app.nro_solicitud && (
                          <p className="text-xs text-green-600 mt-1">Nro. Solicitud: {app.nro_solicitud}</p>
                        )}
                      </div>
                      <StatusBadge status={app.estado} />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
