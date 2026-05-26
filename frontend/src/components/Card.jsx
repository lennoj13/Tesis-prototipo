
/**
 * Card — Tarjeta contenedora reutilizable con variantes institucionales.
 * Demuestra: Composición de componentes, props con children, variantes visuales.
 */

export default function Card({
  children,
  title,
  subtitle,
  icon: Icon,
  action,
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick,
  className = '',
}) {
  const variants = {
    default: 'bg-white border border-slate-200 shadow-sm',
    flat: 'bg-white border border-slate-200',
    outlined: 'bg-transparent border-2 border-dashed border-slate-300',
    elevated: 'bg-white border border-slate-200 shadow-md',
    accent: 'bg-primary-50 border border-primary-200',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  const classes = [
    'rounded-xl transition-all duration-150',
    variants[variant] || variants.default,
    paddings[padding] || paddings.md,
    hover ? 'hover:shadow-md hover:border-primary-300 cursor-pointer' : '',
    onClick ? 'cursor-pointer' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const hasHeader = title || subtitle || Icon || action;

  return (
    <div className={classes} onClick={onClick}>
      {hasHeader && (
        <div className={`flex items-center justify-between gap-3 ${children ? 'mb-4' : ''}`}>
          <div className="flex items-center gap-3 min-w-0">
            {Icon && (
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex-shrink-0">
                <Icon size={20} />
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="text-sm font-bold text-slate-800 m-0 truncate">{title}</h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 m-0 mt-0.5 truncate">{subtitle}</p>
              )}
            </div>
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
