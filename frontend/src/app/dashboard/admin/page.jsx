'use client';

/**
 * Dashboard Admin — Panel con estadísticas reales.
 * Módulo 1: Gestión de Usuarios (rol Admin)
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import adminService from '@/services/adminService';
import { FiUser, FiBriefcase, FiFileText, FiTarget } from 'react-icons/fi';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ students: 0, companies: 0, vacancies: 0, applications: 0 });
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

  const cards = [
    { label: 'Estudiantes registrados', value: stats.students, icon: FiUser },
    { label: 'Empresas registradas', value: stats.companies, icon: FiBriefcase },
    { label: 'Vacantes activas', value: stats.vacancies, icon: FiFileText },
    { label: 'Total postulaciones', value: stats.applications, icon: FiTarget },
  ];

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-[1.75rem] font-bold text-slate-900 mb-1">Panel de Administración</h1>
        <p className="text-base text-slate-500">
          Bienvenido, {user?.nombre || user?.name || 'Admin'}. Vista general de la plataforma — Universidad de Guayaquil.
        </p>
      </header>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="flex items-center gap-3.5 p-5 bg-white border border-slate-200 rounded-xl shadow-sm transition-shadow duration-150 hover:shadow-md">
            <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary-50 text-primary-600 flex-shrink-0">
              <card.icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 leading-none m-0">{loading ? '...' : card.value}</p>
              <p className="text-[0.8125rem] text-slate-500 mt-0.5 m-0">{card.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
