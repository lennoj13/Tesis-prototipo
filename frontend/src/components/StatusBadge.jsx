
/**
 * StatusBadge -- Badge de estado con colores semanticos.
 */

const statusStyles = {
  activo:            'bg-success-light text-green-700',
  inactivo:          'bg-slate-100 text-slate-600',
  pendiente:         'bg-warning-light text-amber-700',
  aprobado:          'bg-success-light text-green-700',
  aprobada:          'bg-success-light text-green-700',
  aceptada_empresa:  'bg-info-light text-blue-700',
  rechazado:         'bg-danger-light text-red-700',
  rechazada:         'bg-danger-light text-red-700',
  cerrada:           'bg-slate-100 text-slate-500',
  abierta:           'bg-info-light text-blue-700',
  nuevo:             'bg-primary-50 text-primary-700',
};

const statusLabels = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  pendiente: 'Pendiente',
  aprobado: 'Aprobado',
  aprobada: 'Aprobada',
  aceptada_empresa: 'Aceptada por Empresa',
  rechazado: 'Rechazado',
  rechazada: 'Rechazada',
  cerrada: 'Cerrada',
  abierta: 'Abierta',
  nuevo: 'Nuevo',
};

export default function StatusBadge({ status, label }) {
  const displayLabel = label || statusLabels[status] || status;
  const style = statusStyles[status] || statusStyles.pendiente;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === 'activo' || status === 'aprobado' || status === 'aprobada' ? 'bg-green-500' :
        status === 'pendiente' ? 'bg-amber-500' :
        status === 'rechazado' || status === 'rechazada' ? 'bg-red-500' :
        status === 'abierta' || status === 'nuevo' || status === 'aceptada_empresa' ? 'bg-blue-500' :
        'bg-slate-400'
      }`} />
      {displayLabel}
    </span>
  );
}
