'use client';

/**
 * Empresa Vacantes — Lista real de vacantes.
 * Módulo 3: Gestión de Vacantes
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import vacancyService from '@/services/vacancyService';
import profileService from '@/services/profileService';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { FiEdit2, FiTrash2, FiEye, FiUsers, FiPlusCircle, FiXCircle } from 'react-icons/fi';

export default function EmpresaVacantes() {
  const { user } = useAuth();
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const profRes = await profileService.getMyProfile();
        const companyId = profRes.data?.details?.company_id;
        if (companyId) {
          const res = await vacancyService.getByCompany(companyId);
          if (res.result) setVacantes(res.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const columns = [
    {
      key: 'title',
      label: 'Vacante de Práctica',
      render: (val, row) => (
        <div>
          <p className="font-medium text-slate-800 m-0">{val}</p>
          <p className="text-xs text-slate-500 m-0">{row.area} · {row.modality || 'Presencial'}</p>
        </div>
      ),
    },
    { key: 'slots', label: 'Plazas', render: (val) => val || 1 },
    {
      key: 'applications_count',
      label: 'Postulantes',
      render: (val) => (
        <div className="flex items-center gap-1.5">
          <FiUsers size={14} className="text-slate-400" />
          <span className="font-semibold text-primary-600">{val || 0}</span>
        </div>
      ),
    },
    { key: 'is_active', label: 'Estado', render: (val) => <StatusBadge status={val ? 'abierta' : 'cerrada'} /> },
    { key: 'expires_at', label: 'Fecha límite', render: (val) => val ? new Date(val).toLocaleDateString('es-EC') : '-' },
  ];

  const handleDelete = async (id) => {
    try {
      await vacancyService.delete(id);
      setVacantes((prev) => prev.filter((v) => v.vacancy_id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Mis Vacantes de Prácticas"
        subtitle={loading ? 'Cargando...' : `${vacantes.filter(v => v.is_active).length} vacantes abiertas de ${vacantes.length} totales`}
        action={
          <Link href="/dashboard/empresa/vacantes/nueva">
            <Button icon={<FiPlusCircle />}>Nueva Vacante</Button>
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={vacantes}
        searchKeys={['title', 'area']}
        actions={(row) => (
          <>
            <button
              onClick={() => setViewModal(row)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-600"
              title="Ver detalle"
            >
              <FiEye size={16} />
            </button>
            <button
              onClick={() => setDeleteConfirm(row)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-danger-light hover:text-danger"
              title="Eliminar"
            >
              <FiTrash2 size={16} />
            </button>
          </>
        )}
      />

      {/* Modal Ver Detalle */}
      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Detalle de Vacante" size="lg">
        {viewModal && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-slate-900">{viewModal.title}</h3>
            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl max-md:grid-cols-2">
              <div><p className="text-xs text-slate-500 mb-1">Área</p><p className="text-sm font-semibold text-slate-800">{viewModal.area}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Modalidad</p><p className="text-sm font-semibold text-slate-800">{viewModal.modality || 'Presencial'}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Ubicación</p><p className="text-sm font-semibold text-slate-800">{viewModal.location || '-'}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Plazas</p><p className="text-sm font-semibold text-primary-600">{viewModal.slots || 1}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Postulantes</p><p className="text-sm font-semibold text-primary-600">{viewModal.applications_count || 0}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Estado</p><StatusBadge status={viewModal.is_active ? 'abierta' : 'cerrada'} /></div>
            </div>
            {viewModal.description && (
              <div>
                <p className="text-xs text-slate-500 mb-1">Descripción</p>
                <p className="text-sm text-slate-700">{viewModal.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm?.vacancy_id)}
        title="Eliminar Vacante"
        message={`¿Eliminar "${deleteConfirm?.title}"? Los postulantes serán notificados.`}
      />
    </div>
  );
}
