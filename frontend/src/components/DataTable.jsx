
/**
 * DataTable — Tabla de datos reutilizable con búsqueda y paginación.
 * Demuestra: Composición avanzada, estado local, renderizado condicional.
 */

import { useState, useMemo } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight, FiInbox } from 'react-icons/fi';

export default function DataTable({
  columns,        // [{ key, label, render? }]
  data,           // Array de objetos
  actions,        // (row) => JSX — acciones por fila
  searchKeys,     // ['nombre', 'email'] — campos para buscar
  pageSize = 8,
  emptyMessage = 'No hay datos para mostrar',
  emptyIcon: EmptyIcon = FiInbox,
}) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrar datos por búsqueda
  const filtered = useMemo(() => {
    if (!search.trim() || !searchKeys?.length) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((key) =>
        String(row[key] || '').toLowerCase().includes(q)
      )
    );
  }, [data, search, searchKeys]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const start = (safeCurrentPage - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  // Reset page when search changes
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
      {/* Search bar */}
      {searchKeys?.length > 0 && (
        <div className="px-5 pt-4 pb-3">
          <div className="relative max-w-xs">
            <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Buscar..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-md bg-slate-50 outline-none transition-colors focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-[var(--color-header-bg)] placeholder:text-slate-400"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#3c8dbc] text-white">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left py-3 px-5 text-[0.8125rem] font-semibold text-white/95 uppercase tracking-wider whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="text-right py-3 px-5 text-[0.8125rem] font-semibold text-white/95 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <EmptyIcon size={32} />
                    <p className="text-sm">{search ? 'Sin resultados para la búsqueda' : emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((row, i) => (
                <tr
                  key={row.id || i}
                  className="border-b border-slate-200 transition-colors hover:bg-slate-100 even:bg-slate-50 last:border-b-0"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="py-3.5 px-5 text-slate-700 whitespace-nowrap">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > pageSize && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50/50">
          <p className="text-xs text-slate-500">
            Mostrando {start + 1}–{Math.min(start + pageSize, filtered.length)} de {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
              className="flex items-center justify-center w-8 h-8 rounded-md border border-slate-200 bg-white text-slate-600 cursor-pointer transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FiChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex items-center justify-center w-8 h-8 rounded-md border text-sm font-medium cursor-pointer transition-colors
                  ${page === safeCurrentPage
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
              className="flex items-center justify-center w-8 h-8 rounded-md border border-slate-200 bg-white text-slate-600 cursor-pointer transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
