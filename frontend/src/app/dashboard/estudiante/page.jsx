'use client';

/**
 * Dashboard Estudiante — Feed de vacantes con detalle y postulación.
 * Módulo 4 de la tesis: Matching Bidireccional (vista estudiante)
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import vacancyService from '@/services/vacancyService';
import applicationService from '@/services/applicationService';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { FiFileText, FiSend, FiTarget, FiMapPin, FiClock, FiUsers, FiCheckCircle, FiCalendar, FiBriefcase } from 'react-icons/fi';

// Función para generar un % de afinidad simulado (basado en vacancy_id para consistencia)
function getAffinity(vacancyId) {
  const affinities = [92, 85, 78, 88, 71, 95, 67, 82, 90, 74];
  return affinities[(vacancyId || 0) % affinities.length];
}

function getAffinityColor(val) {
  if (val >= 80) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', ring: 'ring-green-500' };
  if (val >= 60) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', ring: 'ring-amber-500' };
  return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', ring: 'ring-slate-400' };
}

export default function EstudianteDashboard() {
  const { user } = useAuth();
  const [vacantes, setVacantes] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [stats, setStats] = useState({ vacantes: 0, postulaciones: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [applying, setApplying] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [vacRes, appRes] = await Promise.all([
          vacancyService.getAll(),
          applicationService.getMyApplications(user?.profile_id),
        ]);
        const vacs = vacRes.result ? (vacRes.data || []) : [];
        const apps = appRes.result ? (appRes.data || []) : [];
        setVacantes(vacs);
        setMyApplications(apps);
        setStats({
          vacantes: vacs.length,
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

  // Verificar si ya se postuló a una vacante
  function hasApplied(vacancyId) {
    return myApplications.some(a => a.vacancy_id === vacancyId);
  }

  // Postularse a una vacante
  async function handleApply() {
    if (!selectedVacancy) return;
    setApplying(true);
    try {
      const affinity = getAffinity(selectedVacancy.vacancy_id);
      const res = await applicationService.apply(selectedVacancy.vacancy_id, affinity);
      if (res.result) {
        setToast({ type: 'success', message: `¡Te postulaste exitosamente a "${selectedVacancy.title}"!` });
        // Agregar a la lista local de postulaciones
        setMyApplications(prev => [...prev, { vacancy_id: selectedVacancy.vacancy_id }]);
        setStats(prev => ({ ...prev, postulaciones: prev.postulaciones + 1 }));
        setSelectedVacancy(null);
      } else {
        setToast({ type: 'error', message: res.message || 'Error al postularse' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al conectar con el servidor';
      setToast({ type: 'error', message: msg });
    } finally {
      setApplying(false);
    }
  }

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-[1.75rem] font-bold text-slate-900 mb-1">
          Bienvenido, {user?.nombre || user?.name || 'Estudiante'}
        </h1>
        <p className="text-base text-slate-500">
          Explora vacantes de prácticas preprofesionales y postúlate
        </p>
      </header>

      {/* Stats cards */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
        <div className="flex items-center gap-3.5 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex-shrink-0">
            <FiFileText size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 leading-none m-0">
              {loading ? '...' : stats.vacantes}
            </p>
            <p className="text-[0.8125rem] text-slate-500 mt-0.5 m-0">Vacantes disponibles</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-green-50 text-green-600 flex-shrink-0">
            <FiSend size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 leading-none m-0">
              {loading ? '...' : stats.postulaciones}
            </p>
            <p className="text-[0.8125rem] text-slate-500 mt-0.5 m-0">Mis postulaciones</p>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-fade-in ${
          toast.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {toast.type === 'success' && <FiCheckCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Vacantes */}
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
          {vacantes.map((v) => {
            const affinity = getAffinity(v.vacancy_id);
            const afColor = getAffinityColor(affinity);
            const applied = hasApplied(v.vacancy_id);

            return (
              <div
                key={v.vacancy_id}
                onClick={() => setSelectedVacancy(v)}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-primary-300 transition-all cursor-pointer group relative"
              >
                {/* Affinity badge */}
                <div className={`absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold ${afColor.bg} ${afColor.text} ${afColor.border} border`}>
                  <FiTarget size={12} />
                  {affinity}% afinidad
                </div>

                {/* Applied badge */}
                {applied && (
                  <div className="absolute top-4 right-4 mt-8 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-primary-50 text-primary-700 border border-primary-200">
                    <FiCheckCircle size={10} />
                    Postulado
                  </div>
                )}

                <div className="pr-28">
                  <h3 className="text-base font-bold text-slate-800 m-0 group-hover:text-primary-700 transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-sm text-primary-600 font-medium m-0 mt-0.5">{v.company_name}</p>
                </div>

                <p className="text-sm text-slate-600 mt-3 mb-3 line-clamp-2 leading-relaxed">{v.description || v.area}</p>

                <div className="flex items-center flex-wrap gap-3 text-xs text-slate-500">
                  {v.modality && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-md">
                      <FiClock size={11} />{v.modality}
                    </span>
                  )}
                  {v.location && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-md">
                      <FiMapPin size={11} />{v.location}
                    </span>
                  )}
                  {v.slots && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-md">
                      <FiUsers size={11} />{v.slots} {v.slots === 1 ? 'cupo' : 'cupos'}
                    </span>
                  )}
                  {v.expires_at && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-md">
                      <FiCalendar size={11} />Hasta {new Date(v.expires_at).toLocaleDateString('es-EC')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Vacancy Detail Modal */}
      <Modal
        isOpen={!!selectedVacancy}
        onClose={() => setSelectedVacancy(null)}
        title="Detalle de Vacante"
        size="lg"
        footer={
          selectedVacancy && (
            <>
              <Button variant="secondary" onClick={() => setSelectedVacancy(null)}>Cerrar</Button>
              {hasApplied(selectedVacancy.vacancy_id) ? (
                <Button variant="secondary" disabled>
                  <FiCheckCircle size={16} className="mr-1" /> Ya postulado
                </Button>
              ) : (
                <Button variant="primary" onClick={handleApply} loading={applying}>
                  <FiSend size={16} className="mr-1" /> Postularme
                </Button>
              )}
            </>
          )
        }
      >
        {selectedVacancy && (() => {
          const aff = getAffinity(selectedVacancy.vacancy_id);
          const afColor = getAffinityColor(aff);
          return (
            <div className="flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 m-0">{selectedVacancy.title}</h3>
                  <p className="text-sm text-primary-600 font-medium mt-1 m-0 flex items-center gap-1.5">
                    <FiBriefcase size={14} /> {selectedVacancy.company_name}
                  </p>
                </div>
                <div className={`flex flex-col items-center px-4 py-3 rounded-xl ${afColor.bg} ${afColor.border} border min-w-[90px]`}>
                  <span className={`text-2xl font-bold ${afColor.text}`}>{aff}%</span>
                  <span className="text-[10px] text-slate-500 font-medium">afinidad</span>
                </div>
              </div>

              {/* Info pills */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {selectedVacancy.modality && (
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                    <FiClock size={14} className="text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Modalidad</p>
                      <p className="text-sm font-medium text-slate-800 m-0">{selectedVacancy.modality}</p>
                    </div>
                  </div>
                )}
                {selectedVacancy.location && (
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                    <FiMapPin size={14} className="text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Ubicación</p>
                      <p className="text-sm font-medium text-slate-800 m-0">{selectedVacancy.location}</p>
                    </div>
                  </div>
                )}
                {selectedVacancy.slots && (
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                    <FiUsers size={14} className="text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Cupos</p>
                      <p className="text-sm font-medium text-slate-800 m-0">{selectedVacancy.slots} disponibles</p>
                    </div>
                  </div>
                )}
                {selectedVacancy.expires_at && (
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                    <FiCalendar size={14} className="text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Vigencia</p>
                      <p className="text-sm font-medium text-slate-800 m-0">{new Date(selectedVacancy.expires_at).toLocaleDateString('es-EC')}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedVacancy.description && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Descripción</h4>
                  <p className="text-sm text-slate-700 leading-relaxed m-0">{selectedVacancy.description}</p>
                </div>
              )}

              {/* Requirements */}
              {selectedVacancy.requirements && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Requisitos</h4>
                  <p className="text-sm text-slate-700 leading-relaxed m-0">{selectedVacancy.requirements}</p>
                </div>
              )}

              {/* Area */}
              {selectedVacancy.area && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Área:</span>
                  <span className="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full border border-primary-200">
                    {selectedVacancy.area}
                  </span>
                </div>
              )}

              {/* Already applied notice */}
              {hasApplied(selectedVacancy.vacancy_id) && (
                <div className="p-4 bg-primary-50 border border-primary-200 rounded-xl">
                  <p className="text-sm font-medium text-primary-800 m-0 flex items-center gap-2">
                    <FiCheckCircle size={16} /> Ya te postulaste a esta vacante. Revisa el estado en "Mis Postulaciones".
                  </p>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
