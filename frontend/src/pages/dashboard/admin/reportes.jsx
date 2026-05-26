import { useState, useEffect } from 'react';
import adminService from 'services/adminService';
import PageHeader from 'components/PageHeader';
import StatCard from 'components/StatCard';
import Card from 'components/Card';
import EmptyState from 'components/EmptyState';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { FiTrendingUp, FiUsers, FiTarget, FiAward, FiLoader, FiInbox } from 'react-icons/fi';

const COLORS = ['#2f7df2', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6', '#6366f1', '#f97316'];
const ESTADO_COLORS = {
  'Pendiente': '#f59e0b',
  'Aceptada Empresa': '#3b82f6',
  'Aprobada': '#22c55e',
  'Rechazada': '#ef4444',
};

export default function AdminReportes() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, reportsRes] = await Promise.all([
          adminService.getStats(),
          adminService.getReports(),
        ]);
        if (statsRes.result && statsRes.data) setStats(statsRes.data);
        if (reportsRes.result && reportsRes.data) setReports(reportsRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const s = stats || {};
  const kpiCards = [
    { label: 'Estudiantes', value: s.total_estudiantes || 0, icon: FiUsers, color: 'blue' },
    { label: 'Vacantes activas', value: s.total_vacantes || 0, icon: FiTarget, color: 'green' },
    { label: 'Postulaciones', value: s.total_postulaciones || 0, icon: FiTrendingUp, color: 'purple' },
    { label: 'Empresas', value: s.total_empresas || 0, icon: FiAward, color: 'amber' },
  ];

  const postulacionesEstado = reports?.postulaciones_por_estado || [];
  const vacantesPorArea = reports?.vacantes_por_area || [];
  const habilidadesDemandadas = reports?.habilidades_demandadas || [];
  const topEmpresas = reports?.top_empresas || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 gap-2">
        <FiLoader className="animate-spin" size={20} />
        <span>Cargando reportes...</span>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Reportes y Analítica"
        subtitle="Estadísticas del sistema de prácticas preprofesionales — UG"
      />

      {/* KPI Cards — datos reales */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
        {kpiCards.map((kpi) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
            color={kpi.color}
          />
        ))}
      </div>

      {/* Charts grid — datos reales de PostgreSQL */}
      <div className="grid grid-cols-2 gap-6 mb-6 max-md:grid-cols-1">
        {/* Postulaciones por Estado */}
        <Card title="Postulaciones por Estado">
          {postulacionesEstado.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={postulacionesEstado}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="valor"
                  nameKey="nombre"
                >
                  {postulacionesEstado.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={ESTADO_COLORS[entry.nombre] || COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState variant="flat" icon={FiInbox} message="Sin postulaciones registradas" />
          )}
        </Card>

        {/* Vacantes por Área */}
        <Card title="Vacantes por Área">
          {vacantesPorArea.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={vacantesPorArea}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="valor"
                  nameKey="nombre"
                >
                  {vacantesPorArea.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState variant="flat" icon={FiInbox} message="Sin vacantes activas" />
          )}
        </Card>

        {/* Habilidades más Demandadas */}
        <Card title="Habilidades más Demandadas">
          {habilidadesDemandadas.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={habilidadesDemandadas} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} allowDecimals={false} />
                <YAxis dataKey="nombre" type="category" tick={{ fontSize: 11, fill: '#64748b' }} width={90} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="valor" fill="#2f7df2" radius={[0, 6, 6, 0]} barSize={22} name="Vacantes" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState variant="flat" icon={FiInbox} message="Sin habilidades registradas en vacantes" />
          )}
        </Card>

        {/* Top Empresas por Postulaciones */}
        <Card title="Empresas con más Postulaciones">
          {topEmpresas.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topEmpresas} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} allowDecimals={false} />
                <YAxis dataKey="nombre" type="category" tick={{ fontSize: 11, fill: '#64748b' }} width={120} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="postulaciones" fill="#22c55e" radius={[0, 6, 6, 0]} barSize={22} name="Postulaciones" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState variant="flat" icon={FiInbox} message="Sin postulaciones a empresas" />
          )}
        </Card>
      </div>
    </div>
  );
}
