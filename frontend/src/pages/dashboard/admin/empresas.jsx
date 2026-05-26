
/**
 * Admin Empresas — Lista real de empresas.
 * Módulo 2: Gestión de Empresas
 */

import { useState, useEffect } from 'react';
import adminService from 'services/adminService';
import PageHeader from 'components/PageHeader';
import DataTable from 'components/DataTable';
import StatusBadge from 'components/StatusBadge';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Input from 'components/Input';
import { FiEye, FiCheckCircle, FiXCircle, FiEdit2, FiLoader } from 'react-icons/fi';

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

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
        prev.map(e => e.institucion_id === companyId ? { ...e, estado: status } : e)
      );
    } catch (err) { console.error(err); }
  };

  const handleEdit = (row) => {
    setEditModal(row);
    setEditForm({
      company_name: row.nombre_empresa || '',
      ruc: row.ruc || '',
      industry: row.industria || '',
      correo_contacto: row.correo_contacto || '',
    });
  };

  const saveEdit = async () => {
    setActionLoading(true);
    try {
      const res = await adminService.updateUser(editModal.usuario_id, editForm);
      if (res.result) {
        setEmpresas(prev => prev.map(e => e.institucion_id === editModal.institucion_id ? { 
          ...e, 
          nombre_empresa: editForm.company_name, 
          ruc: editForm.ruc, 
          industria: editForm.industry, 
          correo_contacto: editForm.correo_contacto 
        } : e));
        setEditModal(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      key: 'nombre_empresa',
      label: 'Empresa',
      render: (val, row) => (
        <div>
          <p className="font-medium text-slate-800 m-0">{val}</p>
          <p className="text-xs text-slate-500 m-0">{row.ruc || 'Sin RUC'}</p>
        </div>
      ),
    },
    { key: 'industria', label: 'Sector', render: (val) => val || '-' },
    {
      key: 'estado',
      label: 'Estado',
      render: (val) => <StatusBadge status={val || 'pendiente'} />,
    },
    { key: 'correo_contacto', label: 'Contacto', render: (val) => val || '-' },
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
        searchKeys={['nombre_empresa', 'ruc', 'industria']}
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
              onClick={() => handleEdit(row)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-amber-50 hover:text-amber-600"
              title="Editar empresa"
            >
              <FiEdit2 size={16} />
            </button>
            {(row.estado === 'pending' || row.estado === 'pendiente') && (
              <>
                <button
                  onClick={() => handleStatusUpdate(row.institucion_id, 'aprobado')}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-success-light hover:text-green-600"
                  title="Aprobar"
                >
                  <FiCheckCircle size={16} />
                </button>
                <button
                  onClick={() => handleStatusUpdate(row.institucion_id, 'rechazado')}
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
                {(viewModal.nombre_empresa || '?').charAt(0)}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 m-0">{viewModal.nombre_empresa}</p>
                <p className="text-sm text-slate-500 m-0">{viewModal.ruc || 'Sin RUC'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
              <div><p className="text-xs text-slate-500 mb-1">Sector</p><p className="text-sm font-semibold text-slate-800">{viewModal.industria || '-'}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Estado</p><StatusBadge status={viewModal.estado || 'pendiente'} /></div>
              <div><p className="text-xs text-slate-500 mb-1">Contacto</p><p className="text-sm font-semibold text-slate-800">{viewModal.correo_contacto || '-'}</p></div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editModal} onClose={() => setEditModal(null)} title="Editar Empresa" size="sm">
        {editModal && (
          <div className="flex flex-col gap-4">
            <Input label="RUC" value={editForm.ruc} onChange={(e) => setEditForm(p => ({...p, ruc: e.target.value}))} />
            <Input label="Nombre Empresa" value={editForm.company_name} onChange={(e) => setEditForm(p => ({...p, company_name: e.target.value}))} />
            <Input label="Sector / Industria" value={editForm.industry} onChange={(e) => setEditForm(p => ({...p, industry: e.target.value}))} />
            <Input label="Correo de contacto" type="email" value={editForm.correo_contacto} onChange={(e) => setEditForm(p => ({...p, correo_contacto: e.target.value}))} />
            
            <div className="flex justify-end gap-3 mt-4">
              <button className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg" onClick={() => setEditModal(null)}>Cancelar</button>
              <button className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg flex items-center justify-center min-w-[100px]" onClick={saveEdit} disabled={actionLoading}>
                {actionLoading ? <FiLoader className="animate-spin" /> : 'Guardar'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
