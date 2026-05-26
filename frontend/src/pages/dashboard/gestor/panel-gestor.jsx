import { useState, useEffect } from 'react';
import { useAuth } from 'context/AuthContext';
import PageHeader from 'components/PageHeader';
import StatCard from 'components/StatCard';
import { FiBriefcase, FiCheckSquare, FiTrendingUp } from 'react-icons/fi';
import adminService from 'services/adminService';

function getWelcomeName(user, fallback) {
  const nameRaw = (user?.nombre || user?.name || '').trim();
  const firstName = nameRaw ? nameRaw.split(/\s+/)[0] : '';
  const lastNameRaw = (user?.apellido || '').trim();
  const secondLastName = lastNameRaw ? lastNameRaw.split(/\s+/).slice(-1)[0] : '';
  const displayName = `${firstName} ${secondLastName}`.trim();
  return displayName || fallback;
}

export default function GestorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const response = await adminService.getStats();
      if (response.result) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error cargando estadisticas:', err);
    } finally {
      setLoading(false);
    }
  }

  const statCards = stats ? [
    { label: 'Empresas', value: stats.total_empresas || 0, icon: FiBriefcase, color: 'emerald' },
    { label: 'Vacantes Activas', value: stats.total_vacantes || 0, icon: FiTrendingUp, color: 'purple' },
    { label: 'Pendientes de Aprobación', value: stats.postulaciones_aceptadas || 0, icon: FiCheckSquare, color: 'cyan' },
    { label: 'Aprobadas (Formalizadas)', value: stats.postulaciones_aprobadas || 0, icon: FiCheckSquare, color: 'green' },
  ] : [
    { label: 'Empresas', value: 0, icon: FiBriefcase, color: 'emerald' },
    { label: 'Vacantes Activas', value: 0, icon: FiTrendingUp, color: 'purple' },
    { label: 'Pendientes de Aprobación', value: 0, icon: FiCheckSquare, color: 'cyan' },
    { label: 'Aprobadas (Formalizadas)', value: 0, icon: FiCheckSquare, color: 'green' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`Bienvenido, ${getWelcomeName(user, 'Gestor')}`}
        subtitle="Panel de gestion de practicas preprofesionales"
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mt-6">
        {statCards.map((card) => (
          <StatCard
            key={card.label}
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
