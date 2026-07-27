import { useState, useEffect } from 'react';
import adminService from 'services/adminService';
import { useAuth } from 'context/AuthContext';
import { printReportHTML } from 'utils/printReport';
import { useMetadata } from 'context/MetadataContext';
import ReportesView from 'components/ReportesView';
import { FiPrinter } from 'react-icons/fi';

export default function AdminReportes() {
  const { facultadNames: FACULTAD_NAMES, facultadesCarreras, metadataLoading } = useMetadata();
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  const [facultadFilter, setFacultadFilter] = useState('');
  const [carreraFilter, setCarreraFilter] = useState('');
  const { user } = useAuth();

  const handlePrint = () => {
    printReportHTML(stats, reports, user, {
      facultad: FACULTAD_NAMES[facultadFilter] || 'General (Todas)',
      carrera: carreraFilter ? facultadesCarreras[facultadFilter]?.find(c => c.id === carreraFilter)?.nombre : 'General (Todas)'
    });
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [statsRes, reportsRes] = await Promise.all([
          adminService.getStats(facultadFilter, carreraFilter),
          adminService.getReports(facultadFilter, carreraFilter),
        ]);
        if (statsRes.result && statsRes.data) setStats(statsRes.data);
        if (reportsRes.result && reportsRes.data) setReports(reportsRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [facultadFilter, carreraFilter]);

  return (
    <ReportesView
      title="Reportes y Analítica"
      subtitle="Estadísticas del sistema de prácticas preprofesionales."
      loading={loading}
      metadataLoading={metadataLoading}
      stats={stats}
      reports={reports}
      action={
        <div className="flex items-center gap-3">
          <select
            value={facultadFilter}
            onChange={(e) => {
              setFacultadFilter(e.target.value);
              setCarreraFilter('');
            }}
            className="px-3 py-2 text-sm border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400"
          >
            <option value="">Todas las Facultades</option>
            {Object.entries(FACULTAD_NAMES).map(([id, name]) => (
              <option key={id} value={id}>{name.toUpperCase()}</option>
            ))}
          </select>
          <select
            value={carreraFilter}
            onChange={(e) => setCarreraFilter(e.target.value)}
            disabled={!facultadFilter}
            className={`px-3 py-2 text-sm border rounded-md outline-none transition-colors ${
              !facultadFilter
                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-white border-slate-200 focus:border-primary-400 text-slate-700'
            }`}
          >
            <option value="">Todas las Carreras</option>
            {facultadFilter && facultadesCarreras[facultadFilter]?.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
            title="Imprimir Reportes"
          >
            <FiPrinter size={18} />
          </button>
        </div>
      }
    />
  );
}