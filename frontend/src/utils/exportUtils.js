export const exportToExcel = (data, columns, filename) => {
  if (!data || !data.length) {
    console.warn('No hay datos para exportar');
    return;
  }

  const headerLabels = columns.map(col => col.label);
  const headerKeys = columns.map(col => col.key);

  // Helper para limpiar valores
  const cleanValue = (val) => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  // Construir una tabla HTML que Excel puede interpretar perfectamente
  let htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <style>
        table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
        th { background-color: #f1f5f9; color: #0f172a; font-weight: bold; border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
        td { border: 1px solid #cbd5e1; padding: 6px; color: #334155; }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>
            ${headerLabels.map(label => `<th>${label}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
  `;

  data.forEach(row => {
    htmlContent += '<tr>';
    headerKeys.forEach(key => {
      htmlContent += `<td>${cleanValue(row[key])}</td>`;
    });
    htmlContent += '</tr>';
  });

  htmlContent += `
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Crear Blob y forzar descarga
  const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xls`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// =========================================================
// Funciones Específicas por Módulo para no ensuciar el UI
// =========================================================

export const exportHistorialToExcel = (filteredApps) => {
  const columnsForExport = [
    { key: 'nro_solicitud', label: 'Nro. Solicitud' },
    { key: 'fecha_respuesta_gestor', label: 'Fecha Resolución' },
    { key: 'nombre_estudiante', label: 'Estudiante' },
    { key: 'carrera', label: 'Carrera' },
    { key: 'titulo_vacante', label: 'Vacante' },
    { key: 'nombre_empresa', label: 'Empresa' },
    { key: 'estado', label: 'Estado' }
  ];
  
  // Preparar datos para que correspondan exactamente a lo exportado
  const dataToExport = filteredApps.map(app => ({
    nro_solicitud: app.nro_solicitud || '-',
    fecha_respuesta_gestor: app.fecha_respuesta_gestor || '-',
    nombre_estudiante: app.nombre_estudiante || 'Estudiante',
    carrera: app.carrera || '-',
    titulo_vacante: app.titulo_vacante || app.titulo || '-',
    nombre_empresa: app.nombre_empresa || '-',
    estado: app.estado ? app.estado.toUpperCase() : '-'
  }));

  exportToExcel(dataToExport, columnsForExport, `Historial_Postulaciones_${new Date().toISOString().split('T')[0]}`);
};

