import { useState, useEffect } from 'react';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Card from 'components/Card';
import InfoField from 'components/InfoField';
import EmptyState from 'components/EmptyState';
import Input from 'components/Input';
import { FiCheckCircle, FiXCircle, FiLoader, FiInbox, FiPlusCircle, FiArrowLeft, FiBriefcase } from 'react-icons/fi';

export default function SolicitudDetalleView({
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
  onUpdateSupervisor,
  extraActions = null,
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
  const [isEditing, setIsEditing] = useState(false);
  const [newSupForm, setNewSupForm] = useState({
    numero_identificacion: '',
    nombres: '',
    apellidos: '',
    correo: '',
    cargo: '',
    departamento: '',
    telefono: '',
  });

  useEffect(() => {
    if (!isOpen) {
      setIsCreatingNew(false);
      setIsEditing(false);
      setNewSupForm({numero_identificacion: '', nombres: '', apellidos: '', correo: '', cargo: '', departamento: '', telefono: ''});
    }
  }, [isOpen]);

  function handleEditClick() {
    if (!selectedSupervisorInfo) return;
    setNewSupForm({
      numero_identificacion: selectedSupervisorInfo.numero_identificacion || '',
      nombres: selectedSupervisorInfo.nombre || '',
      apellidos: selectedSupervisorInfo.apellido || '',
      correo: selectedSupervisorInfo.correo || '',
      cargo: selectedSupervisorInfo.cargo || '',
      departamento: selectedSupervisorInfo.departamento || '',
      telefono: selectedSupervisorInfo.telefono || '',
    });
    setIsEditing(true);
    setIsCreatingNew(true);
  }

  function handleNewClick() {
    setIsEditing(false);
    setNewSupForm({numero_identificacion: '', nombres: '', apellidos: '', correo: '', cargo: '', departamento: '', telefono: ''});
    setIsCreatingNew(true);
  }

  const isFormValid = newSupForm.numero_identificacion && newSupForm.nombres && newSupForm.apellidos && newSupForm.correo && newSupForm.cargo && newSupForm.departamento && newSupForm.telefono;

  async function handleSubmitSupervisor() {
    if (!isFormValid) return;
    
    const payload = {
      ...newSupForm,
      nombre: `${newSupForm.nombres} ${newSupForm.apellidos}`.trim()
    };
    
    let success = false;
    if (isEditing && onUpdateSupervisor) {
      success = await onUpdateSupervisor(selectedSupervisor, payload);
    } else if (onCreateSupervisor) {
      success = await onCreateSupervisor(payload);
    }
    
    if (success) {
      setIsCreatingNew(false);
      setIsEditing(false);
      setNewSupForm({numero_identificacion: '', nombres: '', apellidos: '', correo: '', cargo: '', departamento: '', telefono: ''});
    }
  }

  if (!isOpen) return null;

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={onClose} icon={<FiArrowLeft />}>Regresar</Button>
          <h2 className="text-xl font-bold text-slate-900 m-0">Detalle de Solicitud</h2>
        </div>
        {showActions && (
          <div className="flex items-center gap-2">
            {onReject && (
              <Button
                variant="secondary"
                size="sm"
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
                size="sm"
                icon={<FiCheckCircle />}
                loading={approveLoading}
                disabled={approveDisabled || approveLoading || rejectLoading}
                onClick={onApprove}
              >
                Aprobar Solicitud
              </Button>
            )}
          </div>
        )}
        {!showActions && extraActions && (
          <div className="flex items-center gap-2">
            {extraActions}
          </div>
        )}
      </div>

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
                <InfoField variant="card" label="Carrera" value={estudiante.carrera} />
                <InfoField variant="card" label="Tutor Académico" value="-" />
                <InfoField variant="card" label="Tel. Tutor Académico" value="-" />
                <InfoField variant="card" label="Email Supervisor Institucional" value={supervisor.correo} />
                <InfoField variant="card" label="Cargo Supervisor Institucional" value={supervisor.cargo} />
              </div>
              <div className="flex flex-col gap-3">
                <InfoField variant="card" label="Solicitud" value={data.nro_solicitud || 'Por generar'} />
                <InfoField variant="card" label="Horas Asignadas" value={practica.horas_asignadas} />
                <InfoField variant="card" label="Fecha Inicio" value="-" />
                <InfoField variant="card" label="Fecha Fin" value="-" />
                <InfoField variant="card" label="Email Tutor Académico" value="-" />
                {(supervisors.length > 0 || onCreateSupervisor) && onSupervisorChange ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wide">Supervisor Institucional</span>
                      {onCreateSupervisor && !isCreatingNew && (
                        <button onClick={handleNewClick} className="text-[10px] flex items-center gap-1 font-bold text-primary-600 bg-transparent border-none cursor-pointer hover:underline">
                          <FiPlusCircle /> Nuevo
                        </button>
                      )}
                    </div>
                    {isCreatingNew ? (
                      <div className="bg-slate-50 p-3 rounded-md border border-slate-200 flex flex-col gap-2">
                        <Input placeholder="Cédula" value={newSupForm.numero_identificacion} onChange={e => setNewSupForm(p => ({...p, numero_identificacion: e.target.value}))} />
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Nombres" value={newSupForm.nombres} onChange={e => setNewSupForm(p => ({...p, nombres: e.target.value}))} />
                          <Input placeholder="Apellidos" value={newSupForm.apellidos} onChange={e => setNewSupForm(p => ({...p, apellidos: e.target.value}))} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Cargo" value={newSupForm.cargo} onChange={e => setNewSupForm(p => ({...p, cargo: e.target.value}))} />
                          <Input placeholder="Departamento" value={newSupForm.departamento} onChange={e => setNewSupForm(p => ({...p, departamento: e.target.value}))} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Correo" type="email" value={newSupForm.correo} onChange={e => setNewSupForm(p => ({...p, correo: e.target.value}))} />
                          <Input placeholder="Teléfono" value={newSupForm.telefono} onChange={e => setNewSupForm(p => ({...p, telefono: e.target.value}))} />
                        </div>
                        <div className="flex justify-end gap-2 mt-1">
                          <Button variant="outline" size="sm" onClick={() => { setIsCreatingNew(false); setIsEditing(false); }}>Cancelar</Button>
                          <Button variant="primary" size="sm" loading={creatingSupervisor} onClick={handleSubmitSupervisor} disabled={!isFormValid}>{isEditing ? 'Guardar Cambios' : 'Guardar Supervisor'}</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedSupervisor}
                          onChange={(e) => onSupervisorChange(e.target.value)}
                          className="flex-1 min-h-[36px] px-3 py-2 border border-slate-300 rounded bg-white text-sm text-slate-800 outline-none focus:border-primary-500"
                        >
                          <option value="">Seleccionar supervisor...</option>
                          {supervisors.map((sup) => (
                            <option key={sup.supervisor_id} value={sup.supervisor_id}>
                              {sup.nombre} ({sup.cargo})
                            </option>
                          ))}
                        </select>
                        {selectedSupervisor && onUpdateSupervisor && (
                          <Button variant="outline" size="sm" onClick={handleEditClick}>Editar</Button>
                        )}
                      </div>
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
              <h3 className="text-sm font-bold text-slate-700 mb-3">Información de Vacante y Empresa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoField label="Empresa" value={institucion.nombre} />
                <InfoField label="RUC Empresa" value={institucion.ruc} />
                <InfoField label="Dirección Empresa" value={institucion.direccion || '-'} />
                <InfoField label="Título Vacante" value={vacante.titulo} />
                <InfoField label="Área" value={vacante.area} />
                <InfoField label="Modalidad" value={vacante.modalidad} />
                <InfoField label="Ubicación Vacante" value={vacante.ubicacion} />
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
              {vacante.habilidades && vacante.habilidades.length > 0 && (
                <div className="mt-4 pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <FiBriefcase className="text-slate-400" />
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 m-0">Habilidades Solicitadas</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {vacante.habilidades.map((hab, i) => (
                      <div key={i} className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-md shadow-sm">
                        <span className="font-semibold text-primary-700">{hab.nombre}</span>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">Nivel Req: {hab.nivel}</span>
                        {hab.es_opcional && (
                          <span className="text-[10px] text-slate-400 italic">Opcional</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <Card>
              <h3 className="text-sm font-bold text-slate-700 mb-3">Perfil del Estudiante</h3>
              
              {estudiante.intereses && (
                <div className="mb-4">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wide">Áreas de Interés</span>
                  <p className="mt-1 text-sm text-slate-700">{estudiante.intereses}</p>
                </div>
              )}
              
              {estudiante.experiencia && (
                <div className="mb-4">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wide">Experiencia Previa</span>
                  <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{estudiante.experiencia}</p>
                </div>
              )}

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wide">Habilidades Registradas</span>
                {habilidades.length === 0 ? (
                  <EmptyState variant="flat" icon={FiInbox} message="No hay habilidades registradas." />
                ) : (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {habilidades.map((skill, i) => (
                      <span key={`${skill.nombre}-${i}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-md border border-primary-200">
                        {skill.nombre}
                        <span className="text-[10px] text-primary-600">Nv.{skill.nivel}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
