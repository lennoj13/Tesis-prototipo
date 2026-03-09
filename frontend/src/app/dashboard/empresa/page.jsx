'use client';

/**
 * Dashboard Empresa — Panel real con datos de la API.
 * Módulo 3: Gestión de Vacantes (vista empresa)
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import vacancyService from '@/services/vacancyService';
import profileService from '@/services/profileService';
import { FiFileText, FiUsers, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';
import Button from '@/components/Button';
import { FiPlusCircle } from 'react-icons/fi';

export default function EmpresaDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ vacantes: 0, postulantes: 0 });
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Obtener company_id del perfil
        const profRes = await profileService.getMyProfile();
        const companyId = profRes.data?.details?.company_id;
        
        if (companyId) {
          const vacRes = await vacancyService.getByCompany(companyId);
          if (vacRes.result) {
            const vacs = vacRes.data || [];
            setVacantes(vacs);
            setStats({
              vacantes: vacs.length,
              postulantes: vacs.reduce((sum, v) => sum + (v.applications_count || 0), 0),
            });
          }
        }
      } catch (err) {
        console.error('Error cargando dashboard empresa:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  return (
    <div className="animate-fade-in">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[1.75rem] font-bold text-slate-900 mb-1">
            Panel de {user?.nombre || user?.name || 'Empresa'}
          </h1>
          <p className="text-base text-slate-500">
            Gestiona tus vacantes de prácticas y revisa los estudiantes de la UG
          </p>
        </div>
        <Link href="/dashboard/empresa/vacantes/nueva">
          <Button icon={<FiPlusCircle />}>Nueva Vacante</Button>
        </Link>
      </header>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
        <div className="flex items-center gap-3.5 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary-50 text-primary-600 flex-shrink-0">
            <FiFileText size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 leading-none m-0">{loading ? '...' : stats.vacantes}</p>
            <p className="text-[0.8125rem] text-slate-500 mt-0.5 m-0">Vacantes publicadas</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary-50 text-primary-600 flex-shrink-0">
            <FiUsers size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 leading-none m-0">{loading ? '...' : stats.postulantes}</p>
            <p className="text-[0.8125rem] text-slate-500 mt-0.5 m-0">Total postulantes</p>
          </div>
        </div>
      </div>

      {/* Lista reciente */}
      <h2 className="text-lg font-bold text-slate-800 mb-4">Vacantes Recientes</h2>
      {loading ? (
        <div className="p-12 bg-white border border-slate-200 rounded-xl text-center text-slate-400">Cargando...</div>
      ) : vacantes.length === 0 ? (
        <div className="p-12 bg-white border-2 border-dashed border-slate-300 rounded-xl text-center text-slate-500">
          <p className="mb-3">Aún no has publicado vacantes</p>
          <Link href="/dashboard/empresa/vacantes/nueva">
            <Button icon={<FiPlusCircle />}>Crear Primera Vacante</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {vacantes.slice(0, 5).map((v) => (
            <div key={v.vacancy_id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-shadow">
              <div>
                <p className="font-medium text-slate-800 m-0">{v.title}</p>
                <p className="text-xs text-slate-500 m-0">{v.area} · {v.modality}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-primary-600">{v.applications_count || 0} postulantes</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
