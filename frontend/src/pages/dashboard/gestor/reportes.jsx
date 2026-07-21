import { useState, useEffect } from 'react';
import adminService from 'services/adminService';
import { useAuth } from 'context/AuthContext';
import { useMetadata } from 'context/MetadataContext';
import { printReportHTML } from 'utils/printReport';
import ReportesView from 'components/ReportesView';

export default function GestorReportes() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { facultadesCarreras, metadataLoading } = useMetadata();

  const handlePrint = () => {
    let carreraNombre = 'General';
    if (user?.carrera_id && facultadesCarreras) {
      for (const careers of Object.values(facultadesCarreras)) {
        const found = careers.find(c => String(c.id) === String(user.carrera_id));
        if (found) {
          carreraNombre = found.nombre;
          break;
        }
      }
    }

    printReportHTML(stats, reports, user, {
      facultad: user?.facultad_nombre || 'General',
      carrera: carreraNombre
    });
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [statsRes, reportsRes] = await Promise.all([
          adminService.getStats(), // No filters sent; backend extracts from Gestor token
          adminService.getReports(), // No filters sent; backend extracts from Gestor token
        ]);
        if (statsRes.result && statsRes.data) setStats(statsRes.data);
        if (reportsRes.result && reportsRes.data) setReports(reportsRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  return (
    <ReportesView
      title="Reportes de Mi Carrera"
      subtitle="Analíticas exclusivas de tu facultad y carrera asignada."
      loading={loading}
      metadataLoading={metadataLoading}
      stats={stats}
      reports={reports}
      action={
        <button
          onClick={handlePrint}
          className="flex items-center justify-center p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
          title="Imprimir Reportes"
        >
          <FiPrinter size={18} />
        </button>
      }
      emptyMessages={{
        postulacionesEstado: 'Sin postulaciones registradas en tu carrera',
        vacantesArea: 'Sin vacantes activas publicadas para tu carrera',
        habilidadesTitle: 'Habilidades Demandadas',
        habilidades: 'Sin requisitos de habilidades',
        topEmpresasTitle: 'Empresas con más Demanda',
        topEmpresas: 'Sin postulaciones a empresas',
      }}
    />
  );
}