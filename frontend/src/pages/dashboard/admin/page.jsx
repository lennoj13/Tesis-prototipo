
/**
 * Dashboard Admin — Panel con estadísticas reales.
 * Módulo 1: Gestión de Usuarios (rol Admin)
 */

import { useState, useEffect } from 'react';
import { useAuth } from 'context/AuthContext';
import adminService from 'services/adminService';
import { FiUser, FiBriefcase, FiFileText, FiTarget, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

function getWelcomeName(user, fallback) {
  const nameRaw = (user?.nombre || user?.name || '').trim();
  const firstName = nameRaw ? nameRaw.split(/\s+/)[0] : '';
  const lastNameRaw = (user?.apellido || '').trim();
  const secondLastName = lastNameRaw ? lastNameRaw.split(/\s+/).slice(-1)[0] : '';
  const displayName = `${firstName} ${secondLastName}`.trim();
  return displayName || fallback;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await adminService.getStats();
        if (res.result && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Error cargando estadísticas:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const mainCards = [
    { label: 'Estudiantes registrados', value: stats?.total_estudiantes, icon: FiUser, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Empresas registradas', value: stats?.total_empresas, icon: FiBriefcase, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-600' },
    { label: 'Vacantes activas', value: stats?.total_vacantes, icon: FiFileText, color: 'from-green-500 to-green-600', bg: 'bg-green-50', text: 'text-green-600' },
    { label: 'Total postulaciones', value: stats?.total_postulaciones, icon: FiTarget, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-600' },
  ];

  const detailCards = [
    { label: 'Postulaciones pendientes', value: stats?.postulaciones_pendientes, icon: FiClock, bg: 'bg-amber-50', text: 'text-amber-600' },
    { label: 'Postulaciones aprobadas', value: stats?.postulaciones_aprobadas, icon: FiCheckCircle, bg: 'bg-green-50', text: 'text-green-600' },
    { label: 'Empresas por aprobar', value: stats?.empresas_pendientes, icon: FiAlertCircle, bg: 'bg-red-50', text: 'text-red-600' },
  ];

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-[1.75rem] font-bold text-slate-900 mb-1">Panel de Administración</h1>
        <p className="text-base text-slate-500">
          Bienvenido, {getWelcomeName(user, 'Admin')}. Vista general de la plataforma — Universidad de Guayaquil.
        </p>
      </header>

      {/* Tarjetas principales */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6">
        {mainCards.map((card, i) => (
          <div key={i} className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm transition-shadow duration-150 hover:shadow-md">
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${card.bg} ${card.text} flex-shrink-0`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 leading-none m-0">
                {loading ? '...' : (card.value ?? 0)}
              </p>
              <p className="text-[0.8125rem] text-slate-500 mt-0.5 m-0">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tarjetas secundarias de detalle */}
      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Pendientes de atención</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {detailCards.map((card, i) => (
          <div key={i} className="flex items-center gap-3.5 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${card.bg} ${card.text} flex-shrink-0`}>
              <card.icon size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 leading-none m-0">
                {loading ? '...' : (card.value ?? 0)}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 m-0">{card.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
