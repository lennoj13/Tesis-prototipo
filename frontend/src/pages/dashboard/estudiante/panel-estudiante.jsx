
/**
 * Dashboard Estudiante — Feed de vacantes con detalle y postulación.
 * Módulo 4 de la tesis: Matching Bidireccional (vista estudiante)
 */

import { useState, useEffect } from 'react';
import { useAuth } from 'context/AuthContext';
import vacancyService from 'services/vacancyService';
import applicationService from 'services/applicationService';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Card from 'components/Card';
import InfoField from 'components/InfoField';
import Toast from 'components/Toast';
import EmptyState from 'components/EmptyState';
import { FiFileText, FiSend, FiTarget, FiMapPin, FiClock, FiUsers, FiCheckCircle, FiCalendar, FiBriefcase, FiLoader } from 'react-icons/fi';

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

function getWelcomeName(user, fallback) {
  const nameRaw = (user?.nombre || user?.name || '').trim();
  const firstName = nameRaw ? nameRaw.split(/\s+/)[0] : '';
  const lastNameRaw = (user?.apellido || '').trim();
  const secondLastName = lastNameRaw ? lastNameRaw.split(/\s+/).slice(-1)[0] : '';
  const displayName = `${firstName} ${secondLastName}`.trim();
  return displayName || fallback;
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
    return myApplications.some(a => a.vacante_id === vacancyId);
  }

  // Postularse a una vacante
  async function handleApply() {
    if (!selectedVacancy) return;
    setApplying(true);
    try {
      const affinity = getAffinity(selectedVacancy.vacante_id);
      const res = await applicationService.apply(selectedVacancy.vacante_id, affinity);
      if (res.result) {
        setToast({ type: 'success', message: `¡Te postulaste exitosamente a "${selectedVacancy.titulo}"!` });
        // Agregar a la lista local de postulaciones
        setMyApplications(prev => [...prev, { vacante_id: selectedVacancy.vacante_id }]);
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

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-[1.75rem] font-bold text-slate-900 mb-1">
          Bienvenido, {getWelcomeName(user, 'Estudiante')}
        </h1>
        <p className="text-base text-slate-500">
          Explora vacantes de prácticas preprofesionales y postúlate
        </p>
      </header>

      {/* Toast */}
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      {/* Vacantes */}
      <h2 className="text-lg font-bold text-slate-800 mb-4">Vacantes Disponibles</h2>
      {loading ? (
        <Card>
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <FiLoader className="animate-spin" size={24} />
            Cargando vacantes...
          </div>
        </Card>
      ) : vacantes.length === 0 ? (
        <EmptyState
          variant="dashed"
          message="No hay vacantes disponibles en este momento"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vacantes.map((v) => {
            const affinity = getAffinity(v.vacante_id);
            const afColor = getAffinityColor(affinity);
            const applied = hasApplied(v.vacante_id);
            const totalHoras = v.total_horas ?? v.total_hours;
            const horasDiarias = v.horas_diarias ?? v.daily_hours;
            const horario = v.horario ?? v.schedule;

            return (
              <Card
                key={v.vacante_id}
                onClick={() => setSelectedVacancy(v)}
                hover
                className="relative"
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
                    {v.titulo}
                  </h3>
                  <p className="text-sm text-primary-600 font-medium m-0 mt-0.5">{v.nombre_empresa}</p>
                </div>

                <p className="text-sm text-slate-600 mt-3 mb-3 line-clamp-2 leading-relaxed">{v.descripcion || v.area}</p>

                <div className="flex items-center flex-wrap gap-3 text-xs text-slate-500">
                  {v.modalidad && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-md">
                      <FiClock size={11} />{v.modalidad}
                    </span>
                  )}
                  {v.ubicacion && (
                     <span className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-md">
                      <FiMapPin size={11} />{v.ubicacion}
                    </span>
                  )}
                  {v.cupos && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-md">
                      <FiUsers size={11} />{v.cupos} {v.cupos === 1 ? 'cupo' : 'cupos'}
                    </span>
                  )}
                  {horasDiarias && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-md">
                      <FiClock size={11} />{horasDiarias} h/dia
                    </span>
                  )}
                  {totalHoras && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-md">
                      <FiFileText size={11} />{totalHoras} h totales
                    </span>
                  )}
                  {horario && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-md">
                      <FiCalendar size={11} />{horario}
                    </span>
                  )}
                  {v.fecha_expiracion && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-md">
                      <FiCalendar size={11} />Hasta {new Date(v.fecha_expiracion).toLocaleDateString('es-EC')}
                    </span>
                  )}
                </div>
              </Card>
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
              {hasApplied(selectedVacancy.vacante_id) ? (
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
          const aff = getAffinity(selectedVacancy.vacante_id);
          const afColor = getAffinityColor(aff);
          const totalHoras = selectedVacancy.total_horas ?? selectedVacancy.total_hours;
          const horasDiarias = selectedVacancy.horas_diarias ?? selectedVacancy.daily_hours;
          const horario = selectedVacancy.horario ?? selectedVacancy.schedule;
          return (
            <div className="flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 m-0">{selectedVacancy.titulo}</h3>
                  <p className="text-sm text-primary-600 font-medium mt-1 m-0 flex items-center gap-1.5">
                    <FiBriefcase size={14} /> {selectedVacancy.nombre_empresa}
                  </p>
                </div>
                <div className={`flex flex-col items-center px-4 py-3 rounded-xl ${afColor.bg} ${afColor.border} border min-w-[90px]`}>
                  <span className={`text-2xl font-bold ${afColor.text}`}>{aff}%</span>
                  <span className="text-[10px] text-slate-500 font-medium">afinidad</span>
                </div>
              </div>

              {/* Info pills */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {selectedVacancy.modalidad && (
                  <InfoField icon={FiClock} label="Modalidad" value={selectedVacancy.modalidad} />
                )}
                {selectedVacancy.ubicacion && (
                  <InfoField icon={FiMapPin} label="Ubicación" value={selectedVacancy.ubicacion} />
                )}
                {selectedVacancy.cupos && (
                  <InfoField icon={FiUsers} label="Cupos" value={`${selectedVacancy.cupos} disponibles`} />
                )}
                {selectedVacancy.fecha_expiracion && (
                  <InfoField icon={FiCalendar} label="Vigencia" value={new Date(selectedVacancy.fecha_expiracion).toLocaleDateString('es-EC')} />
                )}
                {totalHoras && (
                  <InfoField icon={FiFileText} label="Horas totales" value={`${totalHoras} horas`} />
                )}
                {horasDiarias && (
                  <InfoField icon={FiClock} label="Horas al dia" value={`${horasDiarias} horas`} />
                )}
                {horario && (
                  <InfoField icon={FiCalendar} label="Horario" value={horario} />
                )}
              </div>

              {/* Description */}
              {selectedVacancy.descripcion && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Descripción</h4>
                  <p className="text-sm text-slate-700 leading-relaxed m-0">{selectedVacancy.descripcion}</p>
                </div>
              )}

              {/* Requirements */}
              {selectedVacancy.requisitos && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Requisitos</h4>
                  <p className="text-sm text-slate-700 leading-relaxed m-0">{selectedVacancy.requisitos}</p>
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
              {hasApplied(selectedVacancy.vacante_id) && (
                <Card variant="accent" padding="sm">
                  <p className="text-sm font-medium text-primary-800 m-0 flex items-center gap-2">
                    <FiCheckCircle size={16} /> Ya te postulaste a esta vacante. Revisa el estado en "Mis Postulaciones".
                  </p>
                </Card>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
