import React, { useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#2f7df2', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6', '#6366f1', '#f97316'];
const ESTADO_COLORS = {
  'Pendiente': '#f59e0b',
  'Aceptada Empresa': '#3b82f6',
  'Aprobada': '#22c55e',
  'Rechazada': '#ef4444',
  'Rechazada por Gestor': '#9d174d',
  'reprobada': '#ea580c',
  'Reprobada': '#ea580c',
  'Cancelada': '#94a3b8',
  'Anulada': '#64748b',
  'Completada': '#10b981',
};

// SVG del logo del sistema (replicado de Logo.jsx para independencia)
function SystemLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width={44} height={44}>
      <rect width="40" height="40" rx="10" fill="#2563eb" />
      <path d="M12 20L18 14L24 20M18 14V28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 20L22 26L16 20M22 26V12" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PrintReportTemplate({ stats, reports, user, contextData, onRendered }) {
  useEffect(() => {
    if (onRendered) {
      const timer = setTimeout(() => {
        onRendered();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [onRendered]);

  const currentDate = new Date().toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const s = stats || {};
  const kpi1 = s.total_estudiantes || 0;
  const kpi2 = s.total_vacantes || 0;
  const kpi3 = s.total_postulaciones || 0;
  const kpi4 = s.total_empresas || 0;

  const postulaciones = reports?.postulaciones_por_estado || [];
  const vacantes = reports?.vacantes_por_area || [];
  const habilidades = reports?.habilidades_demandadas || [];
  const empresas = reports?.top_empresas || [];

  const nombreUsuario = user ? `${user.nombre || user.name || ''} ${user.lastname || ''}`.trim() : 'N/A';
  const rolUsuario = user?.rol === 'admin' ? 'Administrador' : 'Gestor';

  const template = (
    <div id="print-root" style={{ width: '100%', height: '100%', boxSizing: 'border-box', padding: '10mm', backgroundColor: 'white', color: '#0f172a', fontFamily: "'Segoe UI', Arial, sans-serif", display: 'flex', flexDirection: 'column' }}>
      
      {/* Encabezado con logo del SISTEMA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0f172a', paddingBottom: '15px', marginBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <SystemLogo />
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              SistemaRecomendación<span style={{ color: '#2563eb' }}>PP</span>
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: 600, color: '#475569' }}>Reporte Analítico Oficial</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Fecha de Impresión</p>
          <span style={{ fontSize: '14px', fontWeight: 700 }}>{currentDate}</span>
        </div>
      </div>

      {/* Info Contextual */}
      <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '15px 20px', borderRadius: '6px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold' }}>Emitido Por</span>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{nombreUsuario} ({rolUsuario})</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold' }}>Facultad</span>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{contextData?.facultad || 'Todas'}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold' }}>Carrera</span>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{contextData?.carrera || 'Todas'}</span>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
        {[
          { label: 'Estudiantes', val: kpi1 },
          { label: 'Vacantes Activas', val: kpi2 },
          { label: 'Postulaciones', val: kpi3 },
          { label: 'Empresas', val: kpi4 },
        ].map((k, i) => (
          <div key={i} style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '26px', color: '#0f172a' }}>{k.val}</h3>
            <p style={{ margin: '3px 0 0 0', fontSize: '10px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold' }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Gráficos Simétricos 2x2 (Expandiendo el resto del espacio) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', flex: 1 }}>
        
        {/* Postulaciones */}
        <div style={{ flex: '1 1 calc(50% - 7.5px)', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px', boxSizing: 'border-box' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', color: '#334155' }}>Postulaciones por Estado</h4>
          <div style={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <PieChart width={320} height={220}>
              <Pie data={postulaciones} cx="50%" cy="45%" innerRadius={50} outerRadius={80} dataKey="valor" nameKey="nombre" isAnimationActive={false}>
                {postulaciones.map((entry, i) => <Cell key={`cell-${i}`} fill={ESTADO_COLORS[entry.nombre] || COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
            </PieChart>
          </div>
        </div>

        {/* Vacantes */}
        <div style={{ flex: '1 1 calc(50% - 7.5px)', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px', boxSizing: 'border-box' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', color: '#334155' }}>Vacantes por Área</h4>
          <div style={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <PieChart width={320} height={220}>
              <Pie data={vacantes} cx="50%" cy="45%" innerRadius={50} outerRadius={80} dataKey="valor" nameKey="nombre" isAnimationActive={false}>
                {vacantes.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
            </PieChart>
          </div>
        </div>

        {/* Habilidades */}
        <div style={{ flex: '1 1 calc(50% - 7.5px)', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px', boxSizing: 'border-box' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', color: '#334155' }}>Habilidades Demandadas</h4>
          <div style={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <BarChart width={320} height={220} data={habilidades} layout="vertical" margin={{ top: 0, right: 15, left: -20, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="nombre" type="category" tick={{ fontSize: 10 }} width={90} />
              <Tooltip />
              <Bar dataKey="valor" fill="#2f7df2" radius={[0, 4, 4, 0]} isAnimationActive={false} />
            </BarChart>
          </div>
        </div>

        {/* Empresas */}
        <div style={{ flex: '1 1 calc(50% - 7.5px)', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px', boxSizing: 'border-box' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', color: '#334155' }}>Top Empresas</h4>
          <div style={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <BarChart width={320} height={220} data={empresas} layout="vertical" margin={{ top: 0, right: 15, left: -20, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="nombre" type="category" tick={{ fontSize: 10 }} width={110} />
              <Tooltip />
              <Bar dataKey="postulaciones" fill="#22c55e" radius={[0, 4, 4, 0]} isAnimationActive={false} />
            </BarChart>
          </div>
        </div>

      </div>
    </div>
  );

  return template;
}

