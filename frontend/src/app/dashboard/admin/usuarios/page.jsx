'use client';

/**
 * Admin Usuarios — Lista real de usuarios.
 * Módulo 1: Gestión de Usuarios
 */

import { useState, useEffect } from 'react';
import adminService from '@/services/adminService';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import { FiEye } from 'react-icons/fi';

const rolLabels = { student: 'Estudiante', company: 'Empresa', admin: 'Admin' };

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await adminService.getUsers();
        if (res.result) setUsuarios(res.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
            {(val || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-slate-800 m-0">{val} {row.lastname || ''}</p>
            <p className="text-xs text-slate-500 m-0">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Rol',
      render: (val) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
          {rolLabels[val] || val}
        </span>
      ),
    },
    { key: 'is_active', label: 'Estado', render: (val) => <StatusBadge status={val ? 'activo' : 'inactivo'} /> },
    { key: 'created_at', label: 'Registro', render: (val) => val ? new Date(val).toLocaleDateString('es-EC') : '-' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Gestión de Usuarios"
        subtitle={loading ? 'Cargando...' : `${usuarios.length} usuarios registrados`}
      />

      <DataTable
        columns={columns}
        data={usuarios}
        searchKeys={['name', 'email', 'role']}
        actions={(row) => (
          <button
            onClick={() => setViewModal(row)}
            className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-600"
            title="Ver detalle"
          >
            <FiEye size={16} />
          </button>
        )}
      />

      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Detalle del Usuario" size="sm">
        {viewModal && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white text-xl font-bold flex items-center justify-center">
                {(viewModal.name || '?').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 m-0">{viewModal.name} {viewModal.lastname || ''}</p>
                <p className="text-sm text-slate-500 m-0">{viewModal.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
              <div><p className="text-xs text-slate-500 mb-1">Rol</p><p className="text-sm font-semibold text-slate-800">{rolLabels[viewModal.role] || viewModal.role}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Estado</p><StatusBadge status={viewModal.is_active ? 'activo' : 'inactivo'} /></div>
              <div><p className="text-xs text-slate-500 mb-1">Registro</p><p className="text-sm font-semibold text-slate-800">{viewModal.created_at ? new Date(viewModal.created_at).toLocaleDateString('es-EC') : '-'}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">ID</p><p className="text-sm font-semibold text-slate-800">#{viewModal.user_id}</p></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
