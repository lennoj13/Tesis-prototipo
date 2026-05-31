
/**
 * Dashboard Admin — Panel con estadísticas reales.
 * Módulo 1: Gestión de Usuarios (rol Admin)
 */

import { useState, useEffect } from 'react';
import { useAuth } from 'context/AuthContext';
import adminService from 'services/adminService';
import StatCard from 'components/StatCard';
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
    { label: 'Estudiantes registrados', value: stats?.total_estudiantes, icon: FiUser, color: 'blue' },
    { label: 'Empresas registradas', value: stats?.total_empresas, icon: FiBriefcase, color: 'amber' },
    { label: 'Vacantes activas', value: stats?.total_vacantes, icon: FiFileText, color: 'green' },
    { label: 'Total postulaciones', value: stats?.total_postulaciones, icon: FiTarget, color: 'purple' },
  ];

  const detailCards = [
    { label: 'Postulaciones pendientes', value: stats?.postulaciones_pendientes, icon: FiClock, color: 'amber' },
    { label: 'Postulaciones aprobadas', value: stats?.postulaciones_aprobadas, icon: FiCheckCircle, color: 'green' },
    { label: 'Empresas por aprobar', value: stats?.empresas_pendientes, icon: FiAlertCircle, color: 'red' },
  ];

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-[1.75rem] font-bold text-slate-900 mb-1">Panel de Administración</h1>
        <p className="text-base text-slate-500">
          Bienvenido, {getWelcomeName(user, 'Admin')}. Vista general de la plataforma.
        </p>
      </header>

      {/* Tarjetas principales */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6">
        {mainCards.map((card, i) => (
          <StatCard
            key={i}
            label={card.label}
            value={card.value}
            icon={card.icon}
            color={card.color}
            loading={loading}
          />
        ))}
      </div>

      {/* Tarjetas secundarias de detalle */}
      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Pendientes de atención</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {detailCards.map((card, i) => (
          <StatCard
            key={i}
            label={card.label}
            value={card.value}
            icon={card.icon}
            color={card.color}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
}
