
/**
 * Empresa Postulantes — Vista de Gestión de Solicitudes
 * Módulo 4: Evaluación de Postulaciones
 */

import { useState, useEffect } from 'react';
import { useAuth } from 'context/AuthContext';
import profileService from 'services/profileService';
import applicationService from 'services/applicationService';
import PageHeader from 'components/PageHeader';
import DataTable from 'components/DataTable';
import StatusBadge from 'components/StatusBadge';
import Button from 'components/Button';
import ConfirmDialog from 'components/ConfirmDialog';
import { FiCheck, FiX, FiUser } from 'react-icons/fi';

const statusMap = {
  pending: 'pendiente',
  approved: 'aprobada',
  rejected: 'rechazada',
  accepted: 'aceptada_empresa',
  aceptada_empresa: 'aceptada_empresa',
  aprobada: 'aprobada',
  rechazada: 'rechazada',
};

export default function EmpresaPostulantes() {
  const { user } = useAuth();
  const [postulantes, setPostulantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState(null); // { appId, type: 'approved' | 'rejected', name, vacancyTitle }

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

      // 2. Obtener TODOS los postulantes de esta empresa en un solo llamado
      const appRes = await applicationService.getByCompany(companyId);
      const allApplicants = appRes.data || [];

      // Filtrar las canceladas por el estudiante (basura para la empresa)
      const activeApplicants = allApplicants.filter(p => p.estado !== 'cancelada');

      // Ordenar por afinidad descendente
      activeApplicants.sort((a, b) => (b.porcentaje_afinidad || b.match_percentage || 0) - (a.porcentaje_afinidad || a.match_percentage || 0));
      
      setPostulantes(activeApplicants.map(p => ({
        ...p,
        id: p.postulacion_id || p.application_id,
        candidato: p.nombre_estudiante || p.student_name,
        vacante: p.titulo_vacante || p.vacancy_title,
        afinidad: p.porcentaje_afinidad || p.match_percentage || 0,
        estado: statusMap[p.estado || p.status] || (p.estado || p.status),
        correo: p.correo || p.email,
        fecha: p.creado_en || p.created_at
      })));
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
          (row.estado === 'pendiente' || row.estado === 'pending') && (
            <div className="flex gap-2">
              <button
                onClick={() => setActionModal({ appId: row.id, type: 'aceptada_empresa', name: row.candidato, vacancyTitle: row.vacante })}
                className="flex items-center justify-center w-8 h-8 bg-success-50 text-success-600 rounded-md transition-colors hover:bg-success-100"
                title="Aceptar"
              >
                <FiCheck size={16} />
              </button>
              <button
                onClick={() => setActionModal({ appId: row.id, type: 'rechazada', name: row.candidato, vacancyTitle: row.vacante })}
                className="flex items-center justify-center w-8 h-8 bg-danger-50 text-danger-600 rounded-md transition-colors hover:bg-danger-100"
                title="Rechazar"
              >
                <FiX size={16} />
              </button>
            </div>
          )
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
    </div>
  );
}
