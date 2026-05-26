
/**
 * EmptyState — Estado vacío reutilizable para tablas, listas y secciones sin datos.
 * Demuestra: Componente de presentación con variantes visuales.
 */

import { FiInbox } from 'react-icons/fi';

export default function EmptyState({
  icon: Icon = FiInbox,
  title,
  message = 'No hay datos para mostrar',
  action,
  variant = 'default',
  className = '',
}) {
  const variants = {
    default: 'bg-white border border-slate-200',
    dashed: 'bg-white border-2 border-dashed border-slate-300',
    flat: 'bg-transparent',
  };

  return (
    <div className={`p-12 rounded-xl text-center ${variants[variant] || variants.default} ${className}`}>
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
          <Icon size={28} className="text-slate-400" />
        </div>
        {title && (
          <p className="text-base font-semibold text-slate-600 m-0">{title}</p>
        )}
        <p className="text-sm m-0 max-w-xs">{message}</p>
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}
