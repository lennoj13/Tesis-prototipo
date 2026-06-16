
/**
 * InfoField — Campo de información para modales y vistas de detalle.
 * Demuestra: Componente de presentación reutilizable para datos de solo lectura.
 */

export default function InfoField({
  label,
  value,
  icon: Icon,
  variant = 'default',
  className = '',
  truncate = true,
}) {
  const variants = {
    default: 'bg-slate-50',
    card: 'bg-white border border-slate-200',
    transparent: 'bg-transparent',
  };

  const bgClass = variants[variant] || variants.default;
  const displayValue = value === '' || value === null || value === undefined ? '-' : value;

  return (
    <div className={`flex items-center gap-2.5 p-3 ${bgClass} rounded-md ${className}`}>
      {Icon && (
        <Icon className="text-slate-400 flex-shrink-0" size={15} />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-slate-400 uppercase font-semibold m-0 tracking-wide">{label}</p>
        <div className={`text-sm text-slate-800 m-0 ${truncate ? 'truncate' : 'whitespace-pre-wrap break-words mt-0.5'}`}>{displayValue}</div>
      </div>
    </div>
  );
}
