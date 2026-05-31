import { useState, useEffect } from 'react';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Card from 'components/Card';
import InfoField from 'components/InfoField';
import EmptyState from 'components/EmptyState';
import Input from 'components/Input';
import { FiCheckCircle, FiXCircle, FiLoader, FiInbox, FiPlusCircle } from 'react-icons/fi';

export default function SolicitudDetalleModal({
  isOpen,
  onClose,
  solicitud,
  loading = false,
  supervisors = [],
  selectedSupervisor = '',
  onSupervisorChange,
  onCreateSupervisor,
  creatingSupervisor = false,
  showActions = false,
  onApprove,
  onReject,
  approveLoading = false,
  rejectLoading = false,
  approveDisabled = false,
}) {
  const data = solicitud || {};
  const estudiante = data.estudiante || {};
  const institucion = data.institucion || {};
  const supervisorFromApi = data.supervisor || {};
  const vacante = data.vacante || {};
  const habilidades = data.habilidades_estudiante || [];
  const practica = data.practica || {};

  const selectedSupervisorInfo = supervisors.find(
    (sup) => String(sup.supervisor_id) === String(selectedSupervisor)
  );
  const supervisor = selectedSupervisorInfo
    ? {
        cedula: selectedSupervisorInfo.numero_identificacion,
        nombres: selectedSupervisorInfo.nombre,
        cargo: selectedSupervisorInfo.cargo,
        departamento: selectedSupervisorInfo.departamento,
        correo: selectedSupervisorInfo.correo,
        telefono: selectedSupervisorInfo.telefono,
      }
    : supervisorFromApi;

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newSupForm, setNewSupForm] = useState({
    numero_identificacion: '',
    nombre: '',
    correo: '',
    cargo: '',
    departamento: '',
    telefono: '',
  });

  useEffect(() => {
    if (!isOpen) {
      setIsCreatingNew(false);
      setNewSupForm({numero_identificacion: '', nombre: '', correo: '', cargo: '', departamento: '', telefono: ''});
    }
  }, [isOpen]);

  async function handleSubmitNewSupervisor() {
    if (!onCreateSupervisor) return;
    const success = await onCreateSupervisor(newSupForm);
    if (success) {
      setIsCreatingNew(false);
      setNewSupForm({numero_identificacion: '', nombre: '', correo: '', cargo: '', departamento: '', telefono: ''});
    }
  }

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>Cerrar</Button>
      {showActions && (
        <>
          {onReject && (
            <Button
              variant="danger"
              icon={<FiXCircle />}
              loading={rejectLoading}
              disabled={approveLoading || rejectLoading}
              onClick={onReject}
            >
              Rechazar
            </Button>
          )}
          {onApprove && (
            <Button
              variant="primary"
              icon={<FiCheckCircle />}
              loading={approveLoading}
              disabled={approveDisabled || approveLoading || rejectLoading}
              onClick={onApprove}
            >
              Generar Solicitud
            </Button>
          )}
        </>
      )}
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Solicitud de Prácticas Pre-Profesionales"
      size="xl"
      footer={footer}
    >
      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-500">
          <FiLoader className="animate-spin" size={20} />
          <span className="ml-2 text-sm">Cargando solicitud...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <Card padding="none" className="overflow-hidden">
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 text-center">
              DETALLE DE SOLICITUD
            </div>
            <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <InfoField variant="card" label="Tipo Solicitud" value="PRÁCTICAS LABORALES" />
                <InfoField variant="card" label="Estudiante" value={estudiante.nombres} />
                <InfoField variant="card" label="Email" value={estudiante.correo} />
                <InfoField variant="card" label="Nombre Institución Asignada" value={institucion.nombre} />
                <InfoField variant="card" label="Fecha Fin" value="-" />
                <InfoField variant="card" label="Tutor Académico" value="-" />
                <InfoField variant="card" label="Tel. Tutor Académico" value="-" />
                <InfoField variant="card" label="Email Supervisor Institucional" value={supervisor.correo} />
                <InfoField variant="card" label="Cargo Supervisor Institucional" value={supervisor.cargo} />
              </div>
              <div className="flex flex-col gap-3">
                <InfoField variant="card" label="Solicitud" value={data.nro_solicitud || 'Por generar'} />
                <InfoField variant="card" label="Carrera" value={estudiante.carrera} />
                <InfoField variant="card" label="RUC Institución Asignada" value={institucion.ruc} />
                <InfoField variant="card" label="Fecha Inicio" value="-" />
                <InfoField variant="card" label="Horas Asignadas" value={practica.horas_asignadas} />
                <InfoField variant="card" label="Email Tutor Académico" value="-" />
                {(supervisors.length > 0 || onCreateSupervisor) && onSupervisorChange ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wide">Supervisor Institucional</span>
                      {onCreateSupervisor && !isCreatingNew && (
                        <button onClick={() => setIsCreatingNew(true)} className="text-[10px] flex items-center gap-1 font-bold text-primary-600 bg-transparent border-none cursor-pointer hover:underline">
                          <FiPlusCircle /> Nuevo
                        </button>
                      )}
                    </div>
                    {isCreatingNew ? (
                      <div className="bg-slate-50 p-3 rounded-md border border-slate-200 flex flex-col gap-2">
                        <Input placeholder="Cédula" value={newSupForm.numero_identificacion} onChange={e => setNewSupForm(p => ({...p, numero_identificacion: e.target.value}))} />
                        <Input placeholder="Nombre Completo" value={newSupForm.nombre} onChange={e => setNewSupForm(p => ({...p, nombre: e.target.value}))} />
                        <Input placeholder="Cargo" value={newSupForm.cargo} onChange={e => setNewSupForm(p => ({...p, cargo: e.target.value}))} />
                        <Input placeholder="Correo" type="email" value={newSupForm.correo} onChange={e => setNewSupForm(p => ({...p, correo: e.target.value}))} />
                        <div className="flex justify-end gap-2 mt-1">
                          <Button variant="secondary" size="sm" onClick={() => setIsCreatingNew(false)}>Cancelar</Button>
                          <Button variant="primary" size="sm" loading={creatingSupervisor} onClick={handleSubmitNewSupervisor} disabled={!newSupForm.nombre || !newSupForm.numero_identificacion}>Guardar</Button>
                        </div>
                      </div>
                    ) : (
                      <select
                        value={selectedSupervisor}
                        onChange={(e) => onSupervisorChange(e.target.value)}
                        className="min-h-[36px] px-3 py-2 border border-slate-300 rounded bg-white text-sm text-slate-800 outline-none focus:border-primary-500"
                      >
                        <option value="">Seleccionar supervisor...</option>
                        {supervisors.map((sup) => (
                          <option key={sup.supervisor_id} value={sup.supervisor_id}>
                            {sup.nombre} ({sup.cargo})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ) : (
                  <InfoField variant="card" label="Supervisor Institucional" value={supervisor.nombres} />
                )}
                <InfoField variant="card" label="Depto. Supervisor Institucional" value={supervisor.departamento} />
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Detalle de la Vacante</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoField label="Título" value={vacante.titulo} />
                <InfoField label="Área" value={vacante.area} />
                <InfoField label="Modalidad" value={vacante.modalidad} />
                <InfoField label="Ubicación" value={vacante.ubicacion} />
                <InfoField label="Cupos" value={vacante.cupos} />
              </div>
              {vacante.descripcion && (
                <div className="mt-3">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wide">Descripción</span>
                  <p className="mt-1 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-md p-3">
                    {vacante.descripcion}
                  </p>
                </div>
              )}
              {vacante.requisitos && (
                <div className="mt-3">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wide">Requisitos</span>
                  <p className="mt-1 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-md p-3">
                    {vacante.requisitos}
                  </p>
                </div>
              )}
            </Card>

            <Card>
              <h3 className="text-sm font-bold text-slate-700 mb-3">Habilidades del Estudiante</h3>
              {habilidades.length === 0 ? (
                <EmptyState variant="flat" icon={FiInbox} message="No hay habilidades registradas." />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {habilidades.map((skill, i) => (
                    <span key={`${skill.nombre}-${i}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-md border border-primary-200">
                      {skill.nombre}
                      <span className="text-[10px] text-primary-600">Nv.{skill.nivel}</span>
                    </span>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </Modal>
  );
}
