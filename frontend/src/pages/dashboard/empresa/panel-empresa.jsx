/**
 * Dashboard Empresa — Panel con estadísticas y feed de matching bidireccional.
 * Módulo 3: Gestión de Vacantes + Módulo 4: Matching Bidireccional (vista empresa)
 */

import { useState, useEffect } from 'react';
import { useAuth } from 'context/AuthContext';
import vacancyService from 'services/vacancyService';
import profileService from 'services/profileService';
import matchingService from 'services/matchingService';
import applicationService from 'services/applicationService';
import Modal from 'components/Modal';
import Card from 'components/Card';
import StatCard from 'components/StatCard';
import InfoField from 'components/InfoField';
import StatusBadge from 'components/StatusBadge';
import EmptyState from 'components/EmptyState';
import Button from 'components/Button';
import {
  FiFileText, FiUsers, FiTarget, FiPlusCircle,
  FiBookOpen, FiAward, FiMail, FiCheckCircle, FiLoader, FiCheck, FiX,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

function getAffinityColor(val) {
  if (val >= 80) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
  if (val >= 60) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
  return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };
}

const semestreMap = {
  '1': 'Primer semestre', '2': 'Segundo semestre', '3': 'Tercer semestre',
  '4': 'Cuarto semestre', '5': 'Quinto semestre', '6': 'Sexto semestre',
  '7': 'Séptimo semestre', '8': 'Octavo semestre', '9': 'Noveno semestre',
  '10': 'Décimo semestre'
};

const statusLabels = {
  pendiente: 'Pendiente',
  aceptada_empresa: 'Aceptada por Empresa',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
};

export default function EmpresaDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ vacantes: 0, postulantes: 0, candidatos: 0 });
  const [vacantes, setVacantes] = useState([]);
  const [matchingData, setMatchingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchingLoading, setMatchingLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const profRes = await profileService.getMyProfile();
        const companyId = profRes.data?.details?.institucion_id || profRes.data?.details?.company_id || user?.profile_id;
        setCompanyName(profRes.data?.details?.nombre_empresa || profRes.data?.details?.nombre || user?.nombre || user?.name || 'Empresa');

        if (!companyId) {
          setMatchingLoading(false);
          return;
        }

        if (companyId) {
          // Cargar vacantes y matching en paralelo
          const [vacRes, matchRes] = await Promise.all([
            vacancyService.getByCompany(companyId),
            matchingService.getCandidates(companyId),
          ]);

          if (vacRes.result) {
            const vacs = vacRes.data || [];
            setVacantes(vacs);
            setStats(prev => ({
              ...prev,
              vacantes: vacs.length,
              postulantes: vacs.reduce((sum, v) => sum + (v.applications_count ?? v.total_postulaciones ?? 0), 0),
            }));
          }

          if (matchRes.result) {
            const data = matchRes.data || [];
            setMatchingData(data);
            const totalApplied = data.reduce((sum, v) => sum + (v.candidates?.filter(c => c.already_applied)?.length || 0), 0);
            setStats(prev => ({ ...prev, candidatos: totalApplied }));
          }
          setMatchingLoading(false);
        }
      } catch (err) {
        console.error('Error cargando dashboard empresa:', err);
        setMatchingLoading(false);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  async function handleDecision(applicationId, status, vacancyId) {
    if (!applicationId) return;
    setActionLoading(prev => ({ ...prev, [applicationId]: status }));
    try {
      const res = await applicationService.updateStatus(applicationId, status);
      if (res.result) {
        setMatchingData(prev => prev.map(v => (
          v.vacancy_id !== vacancyId
            ? v
            : {
                ...v,
                candidates: v.candidates.map(c => (
                  c.application_id === applicationId
                    ? { ...c, application_status: status }
                    : c
                )),
              }
        )));
        setSelectedStudent(prev => (
          prev && prev.application_id === applicationId
            ? { ...prev, application_status: status }
            : prev
        ));
      }
    } catch (err) {
      console.error('Error actualizando postulacion:', err);
    } finally {
      setActionLoading(prev => {
        const next = { ...prev };
        delete next[applicationId];
        return next;
      });
    }
  }

  return (
    <div className="animate-fade-in">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[1.75rem] font-bold text-slate-900 mb-1">
            Panel de {companyName}
          </h1>
          <p className="text-base text-slate-500">
            Gestiona vacantes y descubre talento compatible.
          </p>
        </div>
        <Link to="/dashboard/empresa/vacantes/nueva">
          <Button icon={<FiPlusCircle />}>Nueva Vacante</Button>
        </Link>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
        <StatCard label="Vacantes publicadas" value={stats.vacantes} icon={FiFileText} color="blue" loading={loading} />
        <StatCard label="Total postulantes" value={stats.postulantes} icon={FiUsers} color="green" loading={loading} />
        <StatCard label="Postulantes evaluados" value={stats.candidatos} icon={FiTarget} color="purple" loading={loading} />
      </div>

      {/* Matching Feed — Bidireccional convertido a Solo Postulantes por privacidad */}
      <h2 className="text-lg font-bold text-slate-800 mb-1">Candidatos Postulados</h2>
      <p className="text-sm text-slate-500 mb-4">Estudiantes que han aplicado a tus vacantes y su porcentaje de afinidad</p>

      {matchingLoading ? (
        <Card>
          <div className="p-7 text-center text-slate-400 flex items-center justify-center gap-2">
            <FiLoader className="animate-spin" size={18} />
            Cargando postulaciones...
          </div>
        </Card>
      ) : matchingData.length === 0 ? (
        <EmptyState
          variant="dashed"
          message="Aún no hay postulaciones para tus vacantes"
        />
      ) : (
        <div className="flex flex-col gap-6">
          {matchingData.map((vacancy) => {
            const appliedCandidates = vacancy.candidates.filter(c => c.already_applied && c.application_status === 'pendiente');
            if (appliedCandidates.length === 0) return null;

            return (
            <Card key={vacancy.vacancy_id} padding="none">
              {/* Vacancy header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <FiFileText size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 m-0">{vacancy.title}</h3>
                    <p className="text-xs text-slate-500 m-0">
                      {vacancy.area} · {vacancy.modality} · {vacancy.applications_count || 0} postulantes
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200">
                  {appliedCandidates.length} postulante{appliedCandidates.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Candidate cards */}
              {appliedCandidates.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-400">
                  No se encontraron postulantes para esta vacante
                </div>
              ) : (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {appliedCandidates.map((candidate) => {
                    const afColor = getAffinityColor(candidate.affinity);
                    const semLabel = semestreMap[String(candidate.semester)] || candidate.semester || '';
                    const applicationStatus = candidate.application_status || 'pendiente';
                    return (
                      <div
                        key={`${vacancy.vacancy_id}-${candidate.student_id}`}
                        onClick={() => setSelectedStudent({ ...candidate, vacancy_title: vacancy.title, vacancy_id: vacancy.vacancy_id })}
                        className="flex flex-col gap-3 p-4 border border-slate-200 rounded-md hover:border-primary-300 transition-colors cursor-pointer group"
                      >
                        {/* Top row: avatar + name + affinity */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                              {(candidate.name || '?').charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800 m-0 group-hover:text-primary-700 transition-colors">
                                {candidate.name} {candidate.lastname}
                              </p>
                              <p className="text-[11px] text-slate-500 m-0">{candidate.career || 'Estudiante UG'}</p>
                            </div>
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${afColor.bg} ${afColor.text} ${afColor.border} border`}>
                            <FiTarget size={10} />
                            {candidate.affinity}%
                          </div>
                        </div>

                        {/* Skills matched */}
                        <div className="flex flex-wrap gap-1.5">
                          {candidate.matched_skills.slice(0, 4).map((skill, i) => (
                            <span key={i} className="inline-flex items-center px-2 py-0.5 bg-primary-50 text-primary-700 text-[10px] font-semibold rounded-full border border-primary-100">
                              {skill.name}
                            </span>
                          ))}
                          {candidate.matched_skills.length > 4 && (
                            <span className="text-[10px] text-slate-400 px-1">+{candidate.matched_skills.length - 4} más</span>
                          )}
                        </div>

                        {/* Bottom info */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{semLabel}</span>
                          <StatusBadge status={applicationStatus} label={statusLabels[applicationStatus]} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
            );
          })}
        </div>
      )}

      {/* Student Full Profile Modal */}
      <Modal isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)} title="Perfil Completo del Candidato" size="lg">
        {selectedStudent && (() => {
          const afColor = getAffinityColor(selectedStudent.affinity);
          const semLabel = semestreMap[String(selectedStudent.semester)] || selectedStudent.semester || '';
          const modalStatus = selectedStudent.application_status || 'pendiente';
          const canAct = modalStatus === 'pendiente' && selectedStudent.application_id;
          const isBusy = !!actionLoading[selectedStudent.application_id];
          const isAccepting = actionLoading[selectedStudent.application_id] === 'aceptada_empresa';
          const isRejecting = actionLoading[selectedStudent.application_id] === 'rechazada';

          return (
            <div className="flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#3c8dbc] text-white text-2xl font-bold flex items-center justify-center flex-shrink-0 border border-[#2f6f92]">
                  {(selectedStudent.name || '?').charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold text-slate-900 m-0">{selectedStudent.name} {selectedStudent.lastname}</p>
                  <p className="text-sm text-primary-600 font-medium m-0">{selectedStudent.career || 'Estudiante'}</p>
                  <p className="text-xs text-slate-500 m-0">{selectedStudent.university || 'Universidad de Guayaquil'} · {semLabel}</p>
                </div>
                <div className={`flex flex-col items-center px-5 py-3 rounded-md ${afColor.bg} ${afColor.border} border`}>
                  <span className={`text-3xl font-bold ${afColor.text}`}>{selectedStudent.affinity}%</span>
                  <span className="text-[10px] text-slate-500 font-medium">afinidad</span>
                </div>
              </div>

              {/* Vacancy reference */}
              <Card variant="accent" padding="sm">
                <div className="flex items-center gap-2">
                  <FiFileText className="text-primary-600 flex-shrink-0" size={16} />
                  <div>
                    <p className="text-[10px] text-primary-500 uppercase font-semibold m-0">Afinidad con tu vacante</p>
                    <p className="text-sm font-medium text-primary-800 m-0">{selectedStudent.vacancy_title}</p>
                  </div>
                </div>
              </Card>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
                <InfoField icon={FiMail} label="Correo electrónico" value={selectedStudent.email} />
                <InfoField icon={FiBookOpen} label="Semestre" value={semLabel || 'No especificado'} />
              </div>

              {/* Experience */}
              {selectedStudent.experience_summary && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Experiencia y formación</h4>
                  <p className="text-sm text-slate-700 leading-relaxed m-0 p-3 bg-slate-50 rounded-md whitespace-pre-wrap">{selectedStudent.experience_summary}</p>
                </div>
              )}

              {/* Interests */}
              {selectedStudent.interests && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Áreas de interés</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.interests.split(',').map((interest, i) => (
                      <span key={i} className="inline-flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
                        {interest.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Skills */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiAward size={14} /> Skills que coinciden con tu vacante ({selectedStudent.matched_count}/{selectedStudent.total_vacancy_skills})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.matched_skills.map((skill, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 shadow-sm rounded-md text-xs font-bold">
                      <FiCheckCircle size={12} /> {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* All Skills - Flat List */}
              {selectedStudent.all_skills && selectedStudent.all_skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiTarget size={14} /> Todas las habilidades del estudiante
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.all_skills.map((skill, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-md text-xs">
                        <span className="font-medium text-slate-700">{skill.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Application status */}
              {selectedStudent.already_applied && (
                <Card variant="flat" padding="sm" className="!bg-green-50 !border-green-200">
                  <div className="flex items-center gap-3">
                    <FiCheckCircle className="text-green-600 flex-shrink-0" size={16} />
                    <div className="flex-1">
                      <p className="text-sm text-green-800 m-0">
                        Este estudiante ya se postuló — Estado: <strong>{statusLabels[modalStatus] || modalStatus || 'Postulado'}</strong>
                      </p>
                    </div>
                      <div className="flex items-center gap-2">
                        <Link to="/dashboard/empresa/postulantes">
                          <Button size="sm" variant="primary">
                            Gestionar postulación
                          </Button>
                        </Link>
                      </div>
                  </div>
                </Card>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
