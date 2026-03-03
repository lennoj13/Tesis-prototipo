'use client';

/**
 * Admin Reportes — Dashboard con estadísticas reales.
 * Módulo 5: Reportes y Analítica
 * Nota: Los gráficos de recharts usan datos estáticos por ahora (se conectarán cuando haya suficiente data acumulada)
 */

import { useState, useEffect } from 'react';
import adminService from '@/services/adminService';
import PageHeader from '@/components/PageHeader';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
  AreaChart, Area,
} from 'recharts';
import { FiTrendingUp, FiUsers, FiTarget, FiAward } from 'react-icons/fi';

// Datos para gráficos (se poblarán con datos reales cuando haya historial)
const matchingsPorMes = [
  { mes: 'Sep', matchings: 18 },
  { mes: 'Oct', matchings: 32 },
  { mes: 'Nov', matchings: 28 },
  { mes: 'Dic', matchings: 45 },
  { mes: 'Ene', matchings: 52 },
  { mes: 'Feb', matchings: 61 },
];

const distribucionArea = [
  { name: 'Tecnología', value: 35 },
  { name: 'Finanzas', value: 15 },
  { name: 'Marketing', value: 12 },
  { name: 'RRHH', value: 10 },
  { name: 'Data Science', value: 18 },
  { name: 'Otros', value: 10 },
];

const tasaColocacion = [
  { mes: 'Sep', tasa: 42 },
  { mes: 'Oct', tasa: 55 },
  { mes: 'Nov', tasa: 48 },
  { mes: 'Dic', tasa: 62 },
  { mes: 'Ene', tasa: 68 },
  { mes: 'Feb', tasa: 74 },
];

const topEmpresas = [
  { nombre: 'TechSolutions GYE', practicantes: 12 },
  { nombre: 'CloudNet EC', practicantes: 9 },
  { nombre: 'DataMind EC', practicantes: 7 },
  { nombre: 'InnovaGroup', practicantes: 6 },
  { nombre: 'BioHealth EC', practicantes: 5 },
];

const COLORS = ['#2f7df2', '#1a65d6', '#5293f5', '#74a8f7', '#9ec1fa', '#c5dafc'];

export default function AdminReportes() {
  const [stats, setStats] = useState({ students: 0, companies: 0, vacancies: 0, applications: 0 });

  useEffect(() => {
    async function load() {
      try {
        const res = await adminService.getStats();
        if (res.result && res.data) setStats(res.data);
      } catch (err) { console.error(err); }
    }
    load();
  }, []);

  const kpiCards = [
    { label: 'Total usuarios', value: stats.students + stats.companies, icon: FiUsers, color: 'bg-primary-50 text-primary-600' },
    { label: 'Vacantes activas', value: stats.vacancies, icon: FiTarget, color: 'bg-success-light text-green-600' },
    { label: 'Postulaciones', value: stats.applications, icon: FiTrendingUp, color: 'bg-info-light text-blue-600' },
    { label: 'Empresas', value: stats.companies, icon: FiAward, color: 'bg-warning-light text-amber-600' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Reportes y Analítica"
        subtitle="Estadísticas del sistema de prácticas preprofesionales — UG"
      />

      {/* KPI Cards — datos reales */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="flex items-center gap-3.5 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className={`flex items-center justify-center w-11 h-11 rounded-lg flex-shrink-0 ${kpi.color}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 leading-none m-0">{kpi.value}</p>
                <p className="text-[0.8125rem] text-slate-500 mt-0.5 m-0">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-2 gap-6 mb-6 max-md:grid-cols-1">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Matchings por Mes</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={matchingsPorMes}>
              <defs>
                <linearGradient id="colorMatchings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2f7df2" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2f7df2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="matchings" stroke="#2f7df2" strokeWidth={2.5} fill="url(#colorMatchings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Distribución por Área</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={distribucionArea} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                {distribucionArea.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Tasa de Colocación (%)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={tasaColocacion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Line type="monotone" dataKey="tasa" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 5, fill: '#22c55e' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Top Empresas por Practicantes</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topEmpresas} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis dataKey="nombre" type="category" tick={{ fontSize: 12, fill: '#64748b' }} width={100} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="practicantes" fill="#2f7df2" radius={[0, 6, 6, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
