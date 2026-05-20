import { useState, useEffect } from 'react';
import { useAuth } from 'context/AuthContext';
import PageHeader from 'components/PageHeader';
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
    { label: 'Empresas', value: stats.total_empresas || 0, icon: FiBriefcase, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Vacantes Activas', value: stats.total_vacantes || 0, icon: FiTrendingUp, color: 'from-purple-500 to-purple-600' },
    { label: 'Pendientes de Aprobación', value: stats.postulaciones_aceptadas || 0, icon: FiCheckSquare, color: 'from-cyan-500 to-cyan-600' },
    { label: 'Aprobadas (Formalizadas)', value: stats.postulaciones_aprobadas || 0, icon: FiCheckSquare, color: 'from-green-500 to-green-600' },
  ] : [];

  return (
    <div>
      <PageHeader
        title={`Bienvenido, ${getWelcomeName(user, 'Gestor')}`}
        subtitle="Panel de gestion de practicas preprofesionales"
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <Icon size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                  <p className="text-sm text-slate-500">{card.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
