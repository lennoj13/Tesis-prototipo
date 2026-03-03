'use client';

/**
 * Admin Empresas — Lista real de empresas.
 * Módulo 2: Gestión de Empresas
 */

import { useState, useEffect } from 'react';
import adminService from '@/services/adminService';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { FiEye, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await adminService.getCompanies();
        if (res.result) setEmpresas(res.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleStatusUpdate = async (companyId, status) => {
    try {
      await adminService.updateCompanyStatus(companyId, status);
      setEmpresas(prev =>
        prev.map(e => e.company_id === companyId ? { ...e, status } : e)
      );
    } catch (err) { console.error(err); }
  };

  const columns = [
    {
      key: 'company_name',
      label: 'Empresa',
      render: (val, row) => (
        <div>
          <p className="font-medium text-slate-800 m-0">{val}</p>
          <p className="text-xs text-slate-500 m-0">{row.ruc || 'Sin RUC'}</p>
        </div>
      ),
    },
    { key: 'sector', label: 'Sector', render: (val) => val || '-' },
    {
      key: 'status',
      label: 'Estado',
      render: (val) => <StatusBadge status={val || 'pendiente'} />,
    },
    { key: 'contact_email', label: 'Contacto', render: (val) => val || '-' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Gestión de Empresas"
        subtitle={loading ? 'Cargando...' : `${empresas.length} empresas registradas`}
      />

      <DataTable
        columns={columns}
        data={empresas}
        searchKeys={['company_name', 'ruc', 'sector']}
        actions={(row) => (
          <>
            <button
              onClick={() => setViewModal(row)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-600"
              title="Ver detalle"
            >
              <FiEye size={16} />
            </button>
            {(row.status === 'pending' || row.status === 'pendiente') && (
              <>
                <button
                  onClick={() => handleStatusUpdate(row.company_id, 'approved')}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-success-light hover:text-green-600"
                  title="Aprobar"
                >
                  <FiCheckCircle size={16} />
                </button>
                <button
                  onClick={() => handleStatusUpdate(row.company_id, 'rejected')}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-danger-light hover:text-danger"
                  title="Rechazar"
                >
                  <FiXCircle size={16} />
                </button>
              </>
            )}
          </>
        )}
      />

      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Detalle de Empresa">
        {viewModal && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold">
                {(viewModal.company_name || '?').charAt(0)}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 m-0">{viewModal.company_name}</p>
                <p className="text-sm text-slate-500 m-0">{viewModal.ruc || 'Sin RUC'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
              <div><p className="text-xs text-slate-500 mb-1">Sector</p><p className="text-sm font-semibold text-slate-800">{viewModal.sector || '-'}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Estado</p><StatusBadge status={viewModal.status || 'pendiente'} /></div>
              <div><p className="text-xs text-slate-500 mb-1">Contacto</p><p className="text-sm font-semibold text-slate-800">{viewModal.contact_email || '-'}</p></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
