import React from 'react';
import { createRoot } from 'react-dom/client';
import PrintReportTemplate from 'components/PrintReportTemplate';

export function printReportHTML(stats, reports, user, contextData) {
  // Crear contenedor invisible fuera de pantalla (el usuario NUNCA lo ve)
  const container = document.createElement('div');
  container.id = 'print-overlay';
  container.style.cssText = 'position:fixed; left:-9999px; top:0; width:210mm;';
  document.body.appendChild(container);

  const root = createRoot(container);
  
  // Limpiar después de imprimir
  const cleanup = () => {
    try { root.unmount(); } catch(e) {}
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    window.onafterprint = null;
  };

  window.onafterprint = cleanup;

  root.render(
    <PrintReportTemplate 
      stats={stats} 
      reports={reports} 
      user={user} 
      contextData={contextData} 
      onRendered={() => {
        // Recharts ya terminó de dibujar → imprimir silenciosamente
        window.print();
      }}
    />
  );
}
