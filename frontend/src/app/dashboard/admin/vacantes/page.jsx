'use client';

/**
 * Admin Vacantes — Lista real de vacantes del sistema.
 * Módulo 3: Gestión de Vacantes (vista admin)
 */

import { useState, useEffect } from 'react';
import vacancyService from '@/services/vacancyService';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { FiEye, FiTrash2 } from 'react-icons/fi';

export default function AdminVacantes() {
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await vacancyService.getAll();
        if (res.result) setVacantes(res.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const columns = [
    {
      key: 'title',
      label: 'Vacante',
      render: (val, row) => (
        <div>
          <p className="font-medium text-slate-800 m-0">{val}</p>
          <p className="text-xs text-slate-500 m-0">{row.company_name}</p>
        </div>
      ),
    },
    { key: 'area', label: 'Área', render: (val) => val || '-' },
    { key: 'modality', label: 'Modalidad', render: (val) => val || 'Presencial' },
    {
      key: 'applications_count',
      label: 'Postulantes',
      render: (val) => (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 text-primary-700 text-sm font-bold">
          {val || 0}
        </span>
      ),
    },
    { key: 'is_active', label: 'Estado', render: (val) => <StatusBadge status={val ? 'abierta' : 'cerrada'} /> },
    { key: 'created_at', label: 'Publicación', render: (val) => val ? new Date(val).toLocaleDateString('es-EC') : '-' },
  ];

  const handleDelete = async (id) => {
    try {
      await vacancyService.delete(id);
      setVacantes(prev => prev.filter(v => v.vacancy_id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Gestión de Vacantes"
        subtitle={loading ? 'Cargando...' : `${vacantes.length} vacantes · ${vacantes.filter(v => v.is_active).length} abiertas`}
      />

      <DataTable
        columns={columns}
        data={vacantes}
        searchKeys={['title', 'company_name', 'area']}
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

      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Detalle de Vacante" size="lg">
        {viewModal && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{viewModal.title}</h3>
              <p className="text-sm text-slate-500">{viewModal.company_name}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl max-md:grid-cols-2">
              <div><p className="text-xs text-slate-500 mb-1">Área</p><p className="text-sm font-semibold text-slate-800">{viewModal.area || '-'}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Modalidad</p><p className="text-sm font-semibold text-slate-800">{viewModal.modality || 'Presencial'}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Estado</p><StatusBadge status={viewModal.is_active ? 'abierta' : 'cerrada'} /></div>
              <div><p className="text-xs text-slate-500 mb-1">Postulantes</p><p className="text-sm font-semibold text-slate-800">{viewModal.applications_count || 0}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Ubicación</p><p className="text-sm font-semibold text-slate-800">{viewModal.location || '-'}</p></div>
            </div>
            {viewModal.description && (
              <div>
                <p className="text-xs text-slate-500 mb-2">Descripción</p>
                <p className="text-sm text-slate-700 leading-relaxed p-4 bg-slate-50 rounded-lg">{viewModal.description}</p>
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
        message={`¿Eliminar "${deleteConfirm?.title}"?`}
      />
    </div>
  );
}
