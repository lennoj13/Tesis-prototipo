'use client';

/**
 * Empresa Postulantes — Vista de Gestión de Solicitudes
 * Módulo 4: Evaluación de Postulaciones
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import profileService from '@/services/profileService';
import applicationService from '@/services/applicationService';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import Button from '@/components/Button';
import ConfirmDialog from '@/components/ConfirmDialog';
import { FiCheck, FiX, FiUser } from 'react-icons/fi';

const statusMap = {
  pending: 'pendiente',
  approved: 'aprobado',
  rejected: 'rechazado',
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
      const companyId = profRes.data?.details?.company_id;
      
      if (!companyId) {
        setLoading(false);
        return;
      }

      // 2. Obtener TODOS los postulantes de esta empresa en un solo llamado
      const appRes = await applicationService.getByCompany(companyId);
      const allApplicants = appRes.data || [];

      // Ordenar por afinidad descendente
      allApplicants.sort((a, b) => (b.match_percentage || 0) - (a.match_percentage || 0));
      
      setPostulantes(allApplicants);
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
        p.application_id === actionModal.appId ? { ...p, status: actionModal.type } : p
      ));
    } catch (err) {
      console.error('Error actualizando estado:', err);
    } finally {
      setActionModal(null);
    }
  };

  const columns = [
    {
      key: 'student_name',
      label: 'Candidato',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
            <FiUser size={14} />
          </div>
          <div>
            <p className="font-medium text-slate-800 m-0">{val || 'Sin nombre'}</p>
            <p className="text-xs text-slate-500 m-0">{row?.email || ''}</p>
          </div>
        </div>
      )
    },
    {
      key: 'vacancy_title',
      label: 'Vacante Aplicada',
      render: (val, row) => (
        <div>
          <p className="text-sm text-slate-800 m-0">{val || '-'}</p>
          <p className="text-xs text-slate-500 m-0">{row?.created_at || ''}</p>
        </div>
      )
    },
    {
      key: 'match_percentage',
      label: 'Afinidad',
      render: (val) => (
        <span className={`text-sm font-semibold ${(val || 0) >= 70 ? 'text-success-600' : 'text-slate-600'}`}>
          {val || 0}%
        </span>
      )
    },
    {
      key: 'status',
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
        searchKeys={['student_name', 'vacancy_title', 'email']}
        actions={(row) => (
          row.status === 'pending' && (
            <div className="flex gap-2">
              <button
                onClick={() => setActionModal({ appId: row.application_id, type: 'approved', name: row.student_name, vacancyTitle: row.vacancy_title })}
                className="flex items-center justify-center w-8 h-8 bg-success-50 text-success-600 rounded-lg transition-colors hover:bg-success-100"
                title="Aceptar"
              >
                <FiCheck size={16} />
              </button>
              <button
                onClick={() => setActionModal({ appId: row.application_id, type: 'rejected', name: row.student_name, vacancyTitle: row.vacancy_title })}
                className="flex items-center justify-center w-8 h-8 bg-danger-50 text-danger-600 rounded-lg transition-colors hover:bg-danger-100"
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
        title={actionModal?.type === 'approved' ? 'Aceptar Candidato' : 'Rechazar Candidato'}
        message={
          actionModal?.type === 'approved'
            ? `¿Estás seguro que deseas aceptar a ${actionModal?.name} para la vacante "${actionModal?.vacancyTitle}"? Esto le enviará una notificación informándole de tu decisión.`
            : `¿Estás seguro que deseas rechazar a ${actionModal?.name} para la vacante "${actionModal?.vacancyTitle}"? Se le notificará que no ha sido seleccionado.`
        }
        confirmText={actionModal?.type === 'approved' ? 'Sí, aceptar' : 'Sí, rechazar'}
        variant={actionModal?.type === 'approved' ? 'primary' : 'danger'}
      />
    </div>
  );
}
