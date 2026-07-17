
/**
 * TrackingStepper — Componente de seguimiento visual por pasos.
 * Muestra el progreso de una postulacion a traves de las fases del proceso.
 */

import { FiFileText, FiUsers, FiCheckCircle, FiClipboard, FiX } from 'react-icons/fi';

const STEPS = [
  { key: 'pendiente', label: 'Postulación Enviada', icon: FiFileText },
  { key: 'entrevista', label: 'Entrevista', icon: FiUsers },
  { key: 'aceptada_empresa', label: 'Aceptada por Empresa', icon: FiCheckCircle },
  { key: 'aceptada', label: 'Formalización', icon: FiClipboard },
];

const REJECTED_STATES = ['rechazada', 'rechazada_gestor'];
const FINAL_STATES = ['aprobada', 'reprobada', 'completada'];
const CANCELLED_STATES = ['cancelada', 'anulada'];

function getStepIndex(status) {
  const idx = STEPS.findIndex(s => s.key === status);
  if (idx !== -1) return idx;
  if (REJECTED_STATES.includes(status) || CANCELLED_STATES.includes(status)) return -1;
  if (FINAL_STATES.includes(status)) return STEPS.length;
  return 0;
}

/**
 * Determina en que paso ocurrio el rechazo basandose en el estado previo implicito.
 * Si fue rechazada_gestor, significa que llego hasta aceptada_empresa (paso 2).
 * Si fue rechazada (por empresa), pudo ser en pendiente (paso 0) o entrevista (paso 1).
 * Usamos fecha_entrevista para distinguir.
 */
function getRejectedAtStep(status, fechaEntrevista) {
  if (status === 'rechazada_gestor') return 3;
  if (status === 'rechazada') {
    return fechaEntrevista ? 2 : 1;
  }
  return 0;
}

export default function TrackingStepper({
  currentStatus = 'pendiente',
  fechaPostulacion,
  fechaEntrevista,
  horaEntrevista,
  fechaAceptacion,
  fechaFormalizacion,
}) {
  const isRejected = REJECTED_STATES.includes(currentStatus);
  const isFinal = FINAL_STATES.includes(currentStatus);
  const isCancelled = CANCELLED_STATES.includes(currentStatus);
  const currentIndex = getStepIndex(currentStatus);
  const rejectedAtStep = isRejected ? getRejectedAtStep(currentStatus, fechaEntrevista) : -1;

  const dates = [fechaPostulacion, fechaEntrevista, fechaAceptacion, fechaFormalizacion];

  function getStepState(stepIdx) {
    if (isCancelled) {
      if (stepIdx === 0) return 'cancelled';
      return 'pending';
    }
    if (isRejected) {
      if (stepIdx < rejectedAtStep) return 'completed';
      if (stepIdx === rejectedAtStep) return 'rejected';
      return 'pending';
    }
    if (isFinal || currentIndex >= STEPS.length) {
      return 'completed';
    }
    if (stepIdx < currentIndex) return 'completed';
    if (stepIdx === currentIndex) return 'current';
    return 'pending';
  }

  const stepStyles = {
    completed: {
      circle: 'bg-green-500 text-white border-green-500 shadow-sm',
      label: 'text-green-700 font-semibold',
      line: 'bg-green-400',
    },
    current: {
      circle: 'bg-primary-600 text-white border-primary-600 shadow-md ring-4 ring-primary-100',
      label: 'text-primary-700 font-bold',
      line: 'bg-slate-200',
    },
    pending: {
      circle: 'bg-slate-100 text-slate-400 border-slate-200',
      label: 'text-slate-400 font-medium',
      line: 'bg-slate-200',
    },
    rejected: {
      circle: 'bg-red-500 text-white border-red-500 shadow-sm',
      label: 'text-red-700 font-semibold',
      line: 'bg-slate-200',
    },
    cancelled: {
      circle: 'bg-slate-400 text-white border-slate-400 shadow-sm',
      label: 'text-slate-600 font-semibold',
      line: 'bg-slate-200',
    },
  };

  function formatDate(dateStr) {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('es-EC', {
        day: '2-digit',
        month: 'short',
      });
    } catch {
      return dateStr;
    }
  }

  return (
    <div className="w-full py-4 px-2">
      {/* Stepper horizontal */}
      <div className="flex items-start justify-between relative">
        {STEPS.map((step, idx) => {
          const state = getStepState(idx);
          const styles = stepStyles[state];
          const StepIcon = (state === 'rejected' || state === 'cancelled') ? FiX : step.icon;
          const dateStr = formatDate(dates[idx]);
          const isLast = idx === STEPS.length - 1;

          let displayLabel = step.label;
          if (state === 'rejected') displayLabel = 'Rechazada';
          if (state === 'cancelled') displayLabel = currentStatus === 'anulada' ? 'Anulada' : 'Cancelada';

          return (
            <div key={step.key} className={`flex items-start ${isLast ? '' : 'flex-1'}`} style={{ minWidth: 0 }}>
              {/* Paso */}
              <div className="flex flex-col items-center w-28 flex-shrink-0">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${styles.circle}`}
                >
                  <StepIcon size={18} />
                </div>
                <p className={`text-[11px] mt-2 text-center leading-tight m-0 transition-colors duration-300 ${styles.label}`}>
                  {displayLabel}
                </p>
                {dateStr && (
                  <p className="text-[10px] text-slate-400 m-0 mt-0.5">{dateStr}</p>
                )}
                {state === 'current' && idx === 1 && horaEntrevista && (
                  <p className="text-[10px] text-primary-500 font-semibold m-0 mt-0.5">{horaEntrevista}</p>
                )}
              </div>

              {/* Linea conectora */}
              {!isLast && (
                <div className="flex-1 flex items-center pt-5 px-1" style={{ minWidth: '16px' }}>
                  <div
                    className={`h-0.5 w-full rounded-full transition-all duration-500 ${
                      getStepState(idx) === 'completed' && getStepState(idx + 1) !== 'pending'
                        ? stepStyles.completed.line
                        : stepStyles.pending.line
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Banner de estado final */}
      {isRejected && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 m-0 font-medium">
            {currentStatus === 'rechazada_gestor'
              ? 'Tu solicitud fue rechazada por el gestor de prácticas preprofesionales.'
              : 'Tu postulación no fue seleccionada por la empresa en esta oportunidad.'}
          </p>
        </div>
      )}
      {currentStatus === 'cancelada' && (
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-sm text-slate-600 m-0 font-medium">
            Esta postulación fue cancelada porque la vacante ha sido cerrada o ya no está disponible.
          </p>
        </div>
      )}
      {['aceptada', 'aprobada'].includes(currentStatus) && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 m-0 font-semibold">Práctica formalizada exitosamente.</p>
          <p className="text-xs text-green-600 m-0 mt-1">El proceso de postulación ha concluido con éxito.</p>
        </div>
      )}
      {currentStatus === 'reprobada' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 m-0 font-medium">
            Tu práctica preprofesional ha sido reprobada.
          </p>
        </div>
      )}
      {currentStatus === 'anulada' && (
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-sm text-slate-600 m-0 font-medium">
            Esta práctica ha sido anulada administrativamente.
          </p>
        </div>
      )}
      {currentStatus === 'completada' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 m-0 font-semibold">Práctica completada</p>
          <p className="text-xs text-green-600 m-0 mt-1">Has finalizado satisfactoriamente esta práctica preprofesional.</p>
        </div>
      )}
    </div>
  );
}
