'use client';

/**
 * Dashboard Empresa — Panel con estadísticas y feed de matching bidireccional.
 * Módulo 3: Gestión de Vacantes + Módulo 4: Matching Bidireccional (vista empresa)
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import vacancyService from '@/services/vacancyService';
import profileService from '@/services/profileService';
import matchingService from '@/services/matchingService';
import Modal from '@/components/Modal';
import StatusBadge from '@/components/StatusBadge';
import {
  FiFileText, FiUsers, FiTarget, FiPlusCircle,
  FiBookOpen, FiAward, FiMail, FiCheckCircle, FiLoader, FiChevronRight,
} from 'react-icons/fi';
import Link from 'next/link';
import Button from '@/components/Button';

function getAffinityColor(val) {
  if (val >= 80) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
  if (val >= 60) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
  return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };
}

const statusLabels = { pending: 'Pendiente', approved: 'Aprobado', rejected: 'Rechazado' };

export default function EmpresaDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ vacantes: 0, postulantes: 0, candidatos: 0 });
  const [vacantes, setVacantes] = useState([]);
  const [matchingData, setMatchingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchingLoading, setMatchingLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const profRes = await profileService.getMyProfile();
        const companyId = profRes.data?.details?.company_id;

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
              postulantes: vacs.reduce((sum, v) => sum + (v.applications_count || 0), 0),
            }));
          }

          if (matchRes.result) {
            const data = matchRes.data || [];
            setMatchingData(data);
            const totalCandidates = data.reduce((sum, v) => sum + (v.total_candidates || 0), 0);
            setStats(prev => ({ ...prev, candidatos: totalCandidates }));
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

  return (
    <div className="animate-fade-in">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[1.75rem] font-bold text-slate-900 mb-1">
            Panel de {user?.nombre || user?.name || 'Empresa'}
          </h1>
          <p className="text-base text-slate-500">
            Gestiona vacantes y descubre talento compatible — Universidad de Guayaquil
          </p>
        </div>
        <Link href="/dashboard/empresa/vacantes/nueva">
          <Button icon={<FiPlusCircle />}>Nueva Vacante</Button>
        </Link>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
        <div className="flex items-center gap-3.5 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex-shrink-0">
            <FiFileText size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 leading-none m-0">{loading ? '...' : stats.vacantes}</p>
            <p className="text-[0.8125rem] text-slate-500 mt-0.5 m-0">Vacantes publicadas</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-green-50 text-green-600 flex-shrink-0">
            <FiUsers size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 leading-none m-0">{loading ? '...' : stats.postulantes}</p>
            <p className="text-[0.8125rem] text-slate-500 mt-0.5 m-0">Total postulantes</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-purple-50 text-purple-600 flex-shrink-0">
            <FiTarget size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 leading-none m-0">{loading ? '...' : stats.candidatos}</p>
            <p className="text-[0.8125rem] text-slate-500 mt-0.5 m-0">Candidatos con afinidad</p>
          </div>
        </div>
      </div>

      {/* Matching Feed — Bidireccional */}
      <h2 className="text-lg font-bold text-slate-800 mb-1">Candidatos Recomendados</h2>
      <p className="text-sm text-slate-500 mb-4">Estudiantes con afinidad a tus vacantes basado en sus habilidades</p>

      {matchingLoading ? (
        <div className="p-12 bg-white border border-slate-200 rounded-xl text-center text-slate-400 flex items-center justify-center gap-2">
          <FiLoader className="animate-spin" size={18} />
          Calculando afinidades...
        </div>
      ) : matchingData.length === 0 ? (
        <div className="p-12 bg-white border-2 border-dashed border-slate-300 rounded-xl text-center text-slate-500">
          <p className="mb-1">No se encontraron candidatos con afinidad</p>
          <p className="text-xs text-slate-400">Asegúrate de agregar habilidades requeridas a tus vacantes</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {matchingData.map((vacancy) => (
            <div key={vacancy.vacancy_id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              {/* Vacancy header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
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
                  {vacancy.total_candidates} candidato{vacancy.total_candidates !== 1 ? 's' : ''} compatible{vacancy.total_candidates !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Candidate cards */}
              {vacancy.candidates.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-400">
                  No se encontraron candidatos con afinidad para esta vacante
                </div>
              ) : (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {vacancy.candidates.map((candidate) => {
                    const afColor = getAffinityColor(candidate.affinity);
                    return (
                      <div
                        key={`${vacancy.vacancy_id}-${candidate.student_id}`}
                        onClick={() => setSelectedStudent({ ...candidate, vacancy_title: vacancy.title })}
                        className="flex flex-col gap-3 p-4 border border-slate-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group"
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
                          <span>{candidate.semester || ''}</span>
                          {candidate.already_applied ? (
                            <span className="flex items-center gap-1 text-primary-600 font-semibold">
                              <FiCheckCircle size={10} /> {statusLabels[candidate.application_status] || 'Postulado'}
                            </span>
                          ) : (
                            <span className="flex items-center gap-0.5 text-slate-400 group-hover:text-primary-500 transition-colors">
                              Ver perfil <FiChevronRight size={12} />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Student Full Profile Modal */}
      <Modal isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)} title="Perfil Completo del Candidato" size="lg">
        {selectedStudent && (() => {
          const afColor = getAffinityColor(selectedStudent.affinity);
          // Group all skills by category
          const skillsByCategory = {};
          (selectedStudent.all_skills || []).forEach(s => {
            const cat = s.category || 'Otros';
            if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
            skillsByCategory[cat].push(s);
          });

          return (
            <div className="flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white text-2xl font-bold flex items-center justify-center flex-shrink-0 shadow-lg">
                  {(selectedStudent.name || '?').charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold text-slate-900 m-0">{selectedStudent.name} {selectedStudent.lastname}</p>
                  <p className="text-sm text-primary-600 font-medium m-0">{selectedStudent.career || 'Estudiante'}</p>
                  <p className="text-xs text-slate-500 m-0">{selectedStudent.university || 'Universidad de Guayaquil'} · {selectedStudent.semester || ''}</p>
                </div>
                <div className={`flex flex-col items-center px-5 py-3 rounded-xl ${afColor.bg} ${afColor.border} border shadow-sm`}>
                  <span className={`text-3xl font-bold ${afColor.text}`}>{selectedStudent.affinity}%</span>
                  <span className="text-[10px] text-slate-500 font-medium">afinidad</span>
                </div>
              </div>

              {/* Vacancy reference */}
              <div className="flex items-center gap-2 p-3 bg-primary-50 border border-primary-200 rounded-xl">
                <FiFileText className="text-primary-600 flex-shrink-0" size={16} />
                <div>
                  <p className="text-[10px] text-primary-500 uppercase font-semibold m-0">Afinidad con tu vacante</p>
                  <p className="text-sm font-medium text-primary-800 m-0">{selectedStudent.vacancy_title}</p>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
                <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl">
                  <FiMail className="text-slate-400 flex-shrink-0" size={15} />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Correo electrónico</p>
                    <p className="text-sm text-slate-800 m-0">{selectedStudent.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl">
                  <FiBookOpen className="text-slate-400 flex-shrink-0" size={15} />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Semestre</p>
                    <p className="text-sm text-slate-800 m-0">{selectedStudent.semester || 'No especificado'}</p>
                  </div>
                </div>
              </div>

              {/* Experience */}
              {selectedStudent.experience_summary && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Experiencia y formación</h4>
                  <p className="text-sm text-slate-700 leading-relaxed m-0 p-3 bg-slate-50 rounded-xl">{selectedStudent.experience_summary}</p>
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

              {/* Matched Skills — comparison */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiAward size={14} /> Skills que coinciden con tu vacante ({selectedStudent.matched_count}/{selectedStudent.total_vacancy_skills})
                </h4>
                <div className="flex flex-col gap-2">
                  {selectedStudent.matched_skills.map((skill, i) => {
                    const levelFull = Math.min(skill.student_level / (skill.required_level || 1), 1);
                    return (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-800">{skill.name}</span>
                          {skill.is_optional && <span className="text-[9px] text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded">Opcional</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${levelFull >= 1 ? 'bg-green-500' : levelFull >= 0.7 ? 'bg-amber-500' : 'bg-red-400'}`}
                              style={{ width: `${Math.min(levelFull * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono w-10 text-right">
                            {skill.student_level}/{skill.required_level}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* All Skills by category */}
              {Object.keys(skillsByCategory).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiTarget size={14} /> Todas las habilidades del estudiante
                  </h4>
                  <div className="flex flex-col gap-3">
                    {Object.entries(skillsByCategory).map(([category, skills]) => (
                      <div key={category}>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase mb-1.5">{category}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {skills.map((skill, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs">
                              <span className="font-medium text-slate-700">{skill.name}</span>
                              <span className="text-[10px] text-slate-400">Nv.{skill.level}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Application status */}
              {selectedStudent.already_applied && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                  <FiCheckCircle className="text-green-600" size={16} />
                  <p className="text-sm text-green-800 m-0">
                    Este estudiante ya se postuló — Estado: <strong>{statusLabels[selectedStudent.application_status]}</strong>
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
