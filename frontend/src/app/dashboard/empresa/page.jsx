'use client';

/**
 * Dashboard Empresa — Panel de gestión de vacantes.
 * Módulo 3 de la tesis: Gestión de Vacantes (vista empresa)
 */

import { useAuth } from '@/context/AuthContext';
import { FiFileText, FiUsers, FiCheckCircle, FiTool } from 'react-icons/fi';

export default function EmpresaDashboard() {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-[1.75rem] font-bold text-slate-900 mb-1">
          Panel de {user?.nombre || 'Empresa'}
        </h1>
        <p className="text-base text-slate-500">
          Gestiona tus vacantes de prácticas y revisa los estudiantes de la UG compatibles
        </p>
      </header>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
        <div className="flex items-center gap-3.5 p-5 bg-white border border-slate-200 rounded-xl shadow-sm transition-shadow duration-150 hover:shadow-md">
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary-50 text-primary-600 flex-shrink-0">
            <FiFileText size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 leading-none m-0">5</p>
            <p className="text-[0.8125rem] text-slate-500 mt-0.5 m-0">Vacantes publicadas</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5 p-5 bg-white border border-slate-200 rounded-xl shadow-sm transition-shadow duration-150 hover:shadow-md">
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary-50 text-primary-600 flex-shrink-0">
            <FiUsers size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 leading-none m-0">28</p>
            <p className="text-[0.8125rem] text-slate-500 mt-0.5 m-0">Estudiantes postulados</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5 p-5 bg-white border border-slate-200 rounded-xl shadow-sm transition-shadow duration-150 hover:shadow-md">
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary-50 text-primary-600 flex-shrink-0">
            <FiCheckCircle size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 leading-none m-0">8</p>
            <p className="text-[0.8125rem] text-slate-500 mt-0.5 m-0">Seleccionados</p>
          </div>
        </div>
      </div>

      <div className="p-12 bg-white border-2 border-dashed border-slate-300 rounded-xl text-center text-slate-500 text-[0.9375rem] flex flex-col items-center">
        <FiTool size={20} className="mb-2" />
        <p>Tablas de vacantes y candidatos — próxima fase de implementación</p>
      </div>
    </div>
  );
}
