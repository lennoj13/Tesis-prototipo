import * as XLSX from 'xlsx';

export const exportToExcel = (data, columns, filename) => {
  if (!data || !data.length) {
    console.warn('No hay datos para exportar');
    return;
  }

  const textColumns = new Set(['nro_solicitud', 'cedula', 'ruc_empresa']);

  const formatValue = (value, key) => {
    if (value === null || value === undefined) return '';
    if (textColumns.has(key)) return String(value);
    if (typeof value === 'object') return JSON.stringify(value);
    return value;
  };

  const rows = data.map((row) =>
    columns.map((column) => formatValue(row[column.key], column.key))
  );

  const worksheet = XLSX.utils.aoa_to_sheet([
    columns.map((column) => column.label),
    ...rows,
  ]);

  const maxWidth = 60;
  worksheet['!cols'] = columns.map((column, index) => {
    const headerWidth = String(column.label || '').length;
    const cellWidth = rows.reduce((currentMax, row) => {
      const value = row[index];
      const length = value === null || value === undefined ? 0 : String(value).length;
      return Math.max(currentMax, length);
    }, 0);

    return {
      wch: Math.min(Math.max(headerWidth, cellWidth) + 2, maxWidth),
    };
  });

  worksheet['!autofilter'] = {
    ref: XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: rows.length, c: columns.length - 1 },
    }),
  };

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Historial');

  const output = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([output], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xlsx`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// =========================================================
// Funciones Específicas por Módulo para no ensuciar el UI
// =========================================================

export const exportHistorialToExcel = (filteredApps) => {
  const columnsForExport = [
    { key: 'nro_solicitud', label: 'Nro. Solicitud' },
    { key: 'fecha_respuesta_gestor', label: 'Fecha Resolución' },
    { key: 'cedula', label: 'Cédula Estudiante' },
    { key: 'nombre_estudiante', label: 'Estudiante' },
    { key: 'carrera', label: 'Carrera' },
    { key: 'titulo_vacante', label: 'Vacante' },
    { key: 'nombre_empresa', label: 'Empresa' },
    { key: 'ruc_empresa', label: 'RUC Empresa' },
    { key: 'estado', label: 'Estado' }
  ];
  
  // Preparar datos para que correspondan exactamente a lo exportado
  const dataToExport = filteredApps.map(app => ({
    nro_solicitud: app.nro_solicitud || '-',
    fecha_respuesta_gestor: app.fecha_respuesta_gestor || '-',
    cedula: app.cedula || '-',
    nombre_estudiante: app.nombre_estudiante || 'Estudiante',
    carrera: app.carrera || '-',
    titulo_vacante: app.titulo_vacante || app.titulo || '-',
    nombre_empresa: app.nombre_empresa || '-',
    ruc_empresa: app.ruc_empresa || '-',
    estado: app.estado ? app.estado.toUpperCase() : '-'
  }));

  exportToExcel(dataToExport, columnsForExport, `Historial_Postulaciones_${new Date().toISOString().split('T')[0]}`);
};

