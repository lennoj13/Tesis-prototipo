'use client';

/**
 * Dashboard Estudiante — Feed de vacantes + stats reales.
 * Módulo 4 de la tesis: Matching Bidireccional (vista estudiante)
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import vacancyService from '@/services/vacancyService';
import applicationService from '@/services/applicationService';
import { FiFileText, FiSend, FiTarget, FiMapPin, FiExternalLink } from 'react-icons/fi';

export default function EstudianteDashboard() {
  const { user } = useAuth();
  const [vacantes, setVacantes] = useState([]);
  const [stats, setStats] = useState({ vacantes: 0, postulaciones: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [vacRes, appRes] = await Promise.all([
          vacancyService.getAll(),
          applicationService.getMyApplications(user?.profile_id),
        ]);
        if (vacRes.result) setVacantes(vacRes.data || []);
        const apps = appRes.result ? (appRes.data || []) : [];
        setStats({
          vacantes: (vacRes.data || []).length,
          postulaciones: apps.length,
        });
      } catch (err) {
        console.error('Error cargando dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-[1.75rem] font-bold text-slate-900 mb-1">
          Bienvenido, {user?.nombre || user?.name || 'Estudiante'}
        </h1>
        <p className="text-base text-slate-500">
          Vacantes de prácticas preprofesionales disponibles
        </p>
      </header>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
        <div className="flex items-center gap-3.5 p-5 bg-white border border-slate-200 rounded-xl shadow-sm transition-shadow duration-150 hover:shadow-md">
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary-50 text-primary-600 flex-shrink-0">
            <FiFileText size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 leading-none m-0">
              {loading ? '...' : stats.vacantes}
            </p>
            <p className="text-[0.8125rem] text-slate-500 mt-0.5 m-0">Vacantes disponibles</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5 p-5 bg-white border border-slate-200 rounded-xl shadow-sm transition-shadow duration-150 hover:shadow-md">
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary-50 text-primary-600 flex-shrink-0">
            <FiSend size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 leading-none m-0">
              {loading ? '...' : stats.postulaciones}
            </p>
            <p className="text-[0.8125rem] text-slate-500 mt-0.5 m-0">Postulaciones activas</p>
          </div>
        </div>
      </div>

      {/* Lista de vacantes */}
      <h2 className="text-lg font-bold text-slate-800 mb-4">Vacantes Disponibles</h2>
      {loading ? (
        <div className="p-12 bg-white border border-slate-200 rounded-xl text-center text-slate-400">
          <p>Cargando vacantes...</p>
        </div>
      ) : vacantes.length === 0 ? (
        <div className="p-12 bg-white border-2 border-dashed border-slate-300 rounded-xl text-center text-slate-500">
          <p>No hay vacantes disponibles en este momento</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vacantes.map((v) => (
            <div key={v.vacancy_id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-800 m-0">{v.title}</h3>
                  <p className="text-sm text-slate-500 m-0">{v.company_name}</p>
                </div>
                {v.applications_count !== undefined && (
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    {v.applications_count} postulantes
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{v.description || v.area}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                {v.modality && <span className="flex items-center gap-1"><FiTarget size={12} />{v.modality}</span>}
                {v.location && <span className="flex items-center gap-1"><FiMapPin size={12} />{v.location}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
