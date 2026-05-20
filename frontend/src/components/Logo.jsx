
/**
 * Logo reutilizable de MatchPP / SistemaRecomendaciónPP.
 * Demuestra: componente React reutilizable con props.
 */

const sizes = {
  sm: { icon: 28, font: 'text-base' },
  md: { icon: 36, font: 'text-xl' },
  lg: { icon: 48, font: 'text-3xl' },
};

export default function Logo({ size = 'md', showText = true, className = '', variant = 'light' }) {
  const s = sizes[size];
  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex-shrink-0">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={s.icon}
          height={s.icon}
        >
          <rect width="40" height="40" rx="10" fill={isLight ? 'rgba(255,255,255,0.15)' : 'var(--color-primary-600)'} />
          <path
            d="M12 20L18 14L24 20M18 14V28"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M28 20L22 26L16 20M22 26V12"
            stroke={isLight ? 'rgba(255,255,255,0.6)' : 'var(--color-primary-200)'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {showText && (
        <span className={`${s.font} font-bold ${isLight ? 'text-white' : 'text-slate-800'}`}>
          SistemaRecomendación<span className={isLight ? 'text-white/70' : 'text-primary-600'}>PP</span>
        </span>
      )}
    </div>
  );
}
