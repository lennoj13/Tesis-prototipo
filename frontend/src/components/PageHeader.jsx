
/**
 * PageHeader — Encabezado de página reutilizable.
 * Demuestra: Composición de componentes, props con children.
 */

export default function PageHeader({ title, subtitle, action }) {
  return (
    <header className="flex items-start justify-between gap-4 mb-8 max-md:flex-col max-md:gap-3">
      <div>
        <h1 className="text-[1.75rem] font-bold text-slate-900 mb-1 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base text-slate-500">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </header>
  );
}
