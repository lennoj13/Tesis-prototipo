
/**
 * Botón reutilizable de MatchPP.
 * Demuestra: componente React con variantes, estados y composición.
 */

const variantClasses = {
  primary:
    'bg-primary-600 text-white border-primary-600 hover:bg-primary-700 hover:border-primary-700 hover:shadow-md hover:-translate-y-px active:translate-y-0',
  secondary:
    'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
  outline:
    'bg-transparent text-primary-600 border-primary-300 hover:bg-primary-50 hover:border-primary-500',
  danger:
    'bg-danger text-white border-danger hover:bg-red-600 hover:shadow-md',
  ghost:
    'bg-transparent text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-800',
};

const sizeClasses = {
  sm: 'px-3.5 py-1.5 text-[0.8125rem] rounded-md',
  md: 'px-5 py-2.5 text-[0.9375rem] rounded-lg',
  lg: 'px-7 py-3.5 text-[1.0625rem] rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  type = 'button',
  onClick,
  className = '',
  ...rest
}) {
  const classes = [
    'inline-flex items-center justify-center gap-2 font-semibold border-2 cursor-pointer transition-all duration-150 whitespace-nowrap select-none outline-none',
    'focus-visible:ring-3 focus-visible:ring-primary-200',
    'disabled:opacity-55 disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    loading ? 'pointer-events-none' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && (
        <span
          className="w-[18px] h-[18px] border-[2.5px] border-current border-t-transparent rounded-full animate-spin-slow"
          aria-hidden="true"
        />
      )}
      {!loading && icon && <span className="flex items-center text-[1.1em]">{icon}</span>}
      {children}
    </button>
  );
}
