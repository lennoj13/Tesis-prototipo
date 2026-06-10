
/**
 * Empresa Postulantes — Vista de Gestión de Solicitudes
 * Módulo 4: Evaluación de Postulaciones
 */

import { useState, useEffect } from 'react';
import { useAuth } from 'context/AuthContext';
import profileService from 'services/profileService';
import applicationService from 'services/applicationService';
import matchingService from 'services/matchingService';
import PageHeader from 'components/PageHeader';
import DataTable from 'components/DataTable';
import StatusBadge from 'components/StatusBadge';
import Button from 'components/Button';
import ConfirmDialog from 'components/ConfirmDialog';
import Modal from 'components/Modal';
import InfoField from 'components/InfoField';
import Card from 'components/Card';
import { FiCheck, FiX, FiUser, FiEye, FiMail, FiBookOpen, FiAward, FiCreditCard, FiFileText, FiTarget, FiCheckCircle } from 'react-icons/fi';

const statusMap = {
  pending: 'pendiente',
  approved: 'aprobada',
  rejected: 'rechazada',
  accepted: 'aceptada_empresa',
  aceptada_empresa: 'aceptada_empresa',
  aprobada: 'aprobada',
  rechazada: 'rechazada',
};

const statusLabels = {
  pendiente: 'Pendiente',
  aceptada_empresa: 'Aceptada por Empresa',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
};

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

export default function EmpresaPostulantes() {
  const { user } = useAuth();
  const [postulantes, setPostulantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState(null); // { appId, type: 'approved' | 'rejected', name, vacancyTitle }
  const [viewProfileModal, setViewProfileModal] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Obtener el company_id del usuario actual
      const profRes = await profileService.getMyProfile();
      const companyId = profRes.data?.details?.institucion_id || profRes.data?.details?.company_id || user?.profile_id;
      
      if (!companyId) {
        setLoading(false);
        return;
      }

      // 2. Obtener TODOS los postulantes y los datos ricos del motor de matching en paralelo
      const [appRes, matchRes] = await Promise.all([
        applicationService.getByCompany(companyId),
        matchingService.getCandidates(companyId)
      ]);
      const allApplicants = appRes.data || [];
      const matchData = matchRes.data || [];

      // Filtrar las canceladas por el estudiante (basura para la empresa)
      const activeApplicants = allApplicants.filter(p => p.estado !== 'cancelada');

      // Crear mapa de candidatos enriquecidos para extraer habilidades e intereses
      const richCandidatesMap = {};
      matchData.forEach(vac => {
        (vac.candidates || []).forEach(cand => {
          if (cand.application_id) {
            richCandidatesMap[cand.application_id] = { ...cand, vacancy_title: vac.title, vacancy_id: vac.vacancy_id };
          }
        });
      });

      // Ordenar por afinidad descendente
      activeApplicants.sort((a, b) => (b.porcentaje_afinidad || b.match_percentage || 0) - (a.porcentaje_afinidad || a.match_percentage || 0));
      
      setPostulantes(activeApplicants.map(p => {
        const richData = richCandidatesMap[p.postulacion_id || p.application_id] || {};
        return {
          ...p,
          ...richData, // Inyectamos experience_summary, interests, matched_skills, all_skills, etc
          id: p.postulacion_id || p.application_id,
          candidato: p.nombre_estudiante || richData.name + ' ' + richData.lastname || p.student_name,
          vacante: p.titulo_vacante || richData.vacancy_title || p.vacancy_title,
          afinidad: p.porcentaje_afinidad || p.match_percentage || 0,
          estado: statusMap[p.estado || p.status] || (p.estado || p.status),
          correo: p.correo || p.email,
          cedula: p.cedula,
          semestre: p.semestre || richData.semester,
          carrera: p.carrera || richData.career,
          fecha: p.creado_en || p.created_at
        };
      }));
    } catch (err) {
      console.error('Error cargando gestión de postulantes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleUpdateStatus = async () => {
    if (!actionModal) return;
    try {
      await applicationService.updateStatus(actionModal.appId, actionModal.type);
      // Actualizamos localmente
      setPostulantes(prev => prev.map(p => 
        p.id === actionModal.appId ? { ...p, estado: statusMap[actionModal.type] || actionModal.type } : p
      ));
    } catch (err) {
      console.error('Error actualizando estado:', err);
    } finally {
      setActionModal(null);
    }
  };

  const columns = [
    {
      key: 'candidato',
      label: 'Candidato',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
            <FiUser size={14} />
          </div>
          <div>
            <p className="font-medium text-slate-800 m-0">{val || 'Sin nombre'}</p>
            <p className="text-xs text-slate-500 m-0">{row?.correo || ''}</p>
          </div>
        </div>
      )
    },
    {
      key: 'vacante',
      label: 'Vacante Aplicada',
      render: (val, row) => (
        <div>
          <p className="text-sm text-slate-800 m-0">{val || '-'}</p>
          <p className="text-xs text-slate-500 m-0">{row?.fecha || ''}</p>
        </div>
      )
    },
    {
      key: 'afinidad',
      label: 'Afinidad',
      render: (val) => (
        <span className={`text-sm font-semibold ${(val || 0) >= 70 ? 'text-success-600' : 'text-slate-600'}`}>
          {val || 0}%
        </span>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (val) => <StatusBadge status={statusMap[val] || val} />
    }
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Gestión de Postulantes"
        subtitle={loading ? 'Cargando candidatos...' : `${postulantes.length} postulaciones recibidas`}
      />

      <DataTable
        columns={columns}
        data={postulantes}
        searchKeys={['candidato', 'vacante', 'correo']}
        actions={(row) => (
          <div className="flex gap-2">
            <button
              onClick={() => setViewProfileModal(row)}
              className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-600"
              title="Ver Perfil"
            >
              <FiEye size={16} />
            </button>
            {(row.estado === 'pendiente' || row.estado === 'pending') && (
              <>
                <button
                  onClick={() => setActionModal({ appId: row.id, type: 'aceptada_empresa', name: row.candidato, vacancyTitle: row.vacante })}
                  className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-green-50 hover:text-green-600"
                  title="Aceptar"
                >
                  <FiCheck size={16} />
                </button>
                <button
                  onClick={() => setActionModal({ appId: row.id, type: 'rechazada', name: row.candidato, vacancyTitle: row.vacante })}
                  className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Rechazar"
                >
                  <FiX size={16} />
                </button>
              </>
            )}
          </div>
        )}
      />

      <ConfirmDialog
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        onConfirm={handleUpdateStatus}
        title={actionModal?.type === 'aceptada_empresa' ? 'Aceptar Candidato' : 'Rechazar Candidato'}
        message={
          actionModal?.type === 'aceptada_empresa'
            ? `¿Estás seguro que deseas aceptar a ${actionModal?.name} para la vacante "${actionModal?.vacancyTitle}"? Se actualizará el estado de la postulación.`
            : `¿Estás seguro que deseas rechazar a ${actionModal?.name} para la vacante "${actionModal?.vacancyTitle}"? Se actualizará el estado de la postulación.`
        }
        confirmText={actionModal?.type === 'aceptada_empresa' ? 'Sí, aceptar' : 'Sí, rechazar'}
        variant={actionModal?.type === 'aceptada_empresa' ? 'primary' : 'danger'}
      />

      <Modal isOpen={!!viewProfileModal} onClose={() => setViewProfileModal(null)} title="Perfil Completo del Candidato" size="lg">
        {viewProfileModal && (() => {
          const selectedStudent = viewProfileModal;
          const afColor = getAffinityColor(selectedStudent.afinidad);
          const semLabel = semestreMap[String(selectedStudent.semestre)] || selectedStudent.semestre || '';
          
          // Agrupar todas las habilidades por categoría
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
                <div className="w-16 h-16 rounded-full bg-[#3c8dbc] text-white text-2xl font-bold flex items-center justify-center flex-shrink-0 border border-[#2f6f92]">
                  {(selectedStudent.candidato || '?').charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold text-slate-900 m-0">{selectedStudent.candidato}</p>
                  <p className="text-sm text-primary-600 font-medium m-0">{selectedStudent.carrera || 'Estudiante'}</p>
                  <p className="text-xs text-slate-500 m-0">{selectedStudent.university || 'Universidad de Guayaquil'} · {semLabel}</p>
                </div>
                <div className={`flex flex-col items-center px-5 py-3 rounded-md ${afColor.bg} ${afColor.border} border`}>
                  <span className={`text-3xl font-bold ${afColor.text}`}>{selectedStudent.afinidad}%</span>
                  <span className="text-[10px] text-slate-500 font-medium">afinidad</span>
                </div>
              </div>

              {/* Vacancy reference */}
              <Card variant="accent" padding="sm">
                <div className="flex items-center gap-2">
                  <FiFileText className="text-primary-600 flex-shrink-0" size={16} />
                  <div>
                    <p className="text-[10px] text-primary-500 uppercase font-semibold m-0">Afinidad con tu vacante</p>
                    <p className="text-sm font-medium text-primary-800 m-0">{selectedStudent.vacante}</p>
                  </div>
                </div>
              </Card>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
                <InfoField icon={FiMail} label="Correo electrónico" value={selectedStudent.correo} />
                <InfoField icon={FiCreditCard} label="Cédula" value={selectedStudent.cedula} />
              </div>

              {/* Experience */}
              {selectedStudent.experience_summary && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Experiencia y formación</h4>
                  <p className="text-sm text-slate-700 leading-relaxed m-0 p-3 bg-slate-50 rounded-md">{selectedStudent.experience_summary}</p>
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
              {selectedStudent.matched_skills && selectedStudent.matched_skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiAward size={14} /> Skills que coinciden con tu vacante ({selectedStudent.matched_count}/{selectedStudent.total_vacancy_skills})
                  </h4>
                  <div className="flex flex-col gap-2">
                    {selectedStudent.matched_skills.map((skill, i) => {
                      const levelFull = Math.min(skill.student_level / (skill.required_level || 1), 1);
                      return (
                        <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-md">
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
              )}

              {/* All Skills by category */}
              {Object.keys(skillsByCategory).length > 0 ? (
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
                            <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs">
                              <span className="font-medium text-slate-700">{skill.name}</span>
                              <span className="text-[10px] text-slate-400">Nv.{skill.level}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                (!selectedStudent.matched_skills || selectedStudent.matched_skills.length === 0) && (
                  <div className="p-4 text-center border border-slate-200 rounded-md bg-slate-50 text-sm text-slate-500">
                    No hay detalle de habilidades disponible para este estudiante.
                  </div>
                )
              )}

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button variant="secondary" onClick={() => setViewProfileModal(null)}>
                  Cerrar
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
