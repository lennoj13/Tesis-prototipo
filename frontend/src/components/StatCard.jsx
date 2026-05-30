
/**
 * StatCard — Tarjeta de estadísticas reutilizable con icono y color.
 * Demuestra: Componente especializado con variantes de color institucionales.
 */

const colorPresets = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   gradient: 'from-blue-500 to-blue-600' },
  green:  { bg: 'bg-green-50',  text: 'text-green-600',  gradient: 'from-green-500 to-green-600' },
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-600',  gradient: 'from-amber-500 to-amber-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', gradient: 'from-purple-500 to-purple-600' },
  red:    { bg: 'bg-red-50',    text: 'text-red-600',    gradient: 'from-red-500 to-red-600' },
  cyan:   { bg: 'bg-cyan-50',   text: 'text-cyan-600',   gradient: 'from-cyan-500 to-cyan-600' },
  emerald:{ bg: 'bg-emerald-50',text: 'text-emerald-600',gradient: 'from-emerald-500 to-emerald-600' },
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  color = 'blue',
  loading = false,
  variant = 'icon',   // 'icon' = fondo pastel con icono, 'gradient' = icono con fondo degradado
  className = '',
}) {
  const palette = colorPresets[color] || colorPresets.blue;

  return (
    <div className={`flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-md transition-colors duration-150 ${className}`}>
      {Icon && (
        variant === 'gradient' ? (
          <div className={`flex items-center justify-center w-12 h-12 rounded-md bg-gradient-to-br ${palette.gradient}`}>
            <Icon size={22} className="text-white" />
          </div>
        ) : (
          <div className={`flex items-center justify-center w-12 h-12 rounded-md ${palette.bg} ${palette.text} flex-shrink-0`}>
            <Icon size={22} />
          </div>
        )
      )}
      <div>
        <p className="text-2xl font-bold text-slate-900 leading-none m-0">
          {loading ? '...' : (value ?? 0)}
        </p>
        <p className="text-[0.8125rem] text-slate-500 mt-0.5 m-0">{label}</p>
      </div>
    </div>
  );
}
