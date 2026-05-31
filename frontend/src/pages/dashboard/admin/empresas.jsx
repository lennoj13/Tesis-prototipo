
/**
 * Admin Empresas — Lista real de empresas con crear empresa.
 * Módulo 2: Gestión de Empresas
 */

import { useState, useEffect, useMemo } from 'react';
import api from 'services/api';
import adminService from 'services/adminService';
import PageHeader from 'components/PageHeader';
import DataTable from 'components/DataTable';
import StatusBadge from 'components/StatusBadge';
import Modal from 'components/Modal';
import Input from 'components/Input';
import ConfirmDialog from 'components/ConfirmDialog';
import { FiEye, FiCheckCircle, FiXCircle, FiEdit2, FiLoader, FiPlusCircle, FiUsers, FiBriefcase, FiMapPin, FiGlobe, FiMail, FiPhone, FiTrash2 } from 'react-icons/fi';

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  // Crear empresa
  const [createModal, setCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [createForm, setCreateForm] = useState({
    cedula_representante: '', nombre_representante: '', apellido_representante: '',
    correo: '', contrasena: '', telefono: '', nombre_empresa: '', ruc: '',
    industria: '', direccion: '', ciudad: 'Guayaquil', correo_contacto: '', sitio_web: ''
  });

  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => { load(); }, []);

  const sortedAndFilteredEmpresas = useMemo(() => {
    let result = [...empresas];
    
    // Filter by Status
    if (statusFilter) {
      result = result.filter(e => e.estado === statusFilter);
    }
    
    // Sort
    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.creado_en) - new Date(b.creado_en));
        break;
      case 'alphaAsc':
        result.sort((a, b) => (a.nombre_empresa || '').localeCompare(b.nombre_empresa || ''));
        break;
      case 'alphaDesc':
        result.sort((a, b) => (b.nombre_empresa || '').localeCompare(a.nombre_empresa || ''));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en));
        break;
    }
    
    return result;
  }, [empresas, statusFilter, sortBy]);

  async function load() {
    try {
      const res = await adminService.getCompanies();
      if (res.result) setEmpresas(res.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); }
  }, [toast]);

  const handleStatusUpdate = async (companyId, status) => {
    try {
      await adminService.updateCompanyStatus(companyId, status);
      setEmpresas(prev => prev.map(e => e.institucion_id === companyId ? { ...e, estado: status } : e));
      setToast({ type: 'success', message: `Empresa ${status === 'aprobado' ? 'aprobada' : 'rechazada'} correctamente` });
    } catch (err) { console.error(err); }
  };

  // Ver detalle completo
  async function handleViewDetail(row) {
    setViewModal(row);
    setDetailData(null);
    setDetailLoading(true);
    try {
      const res = await adminService.getCompanyDetail(row.institucion_id);
      if (res.result) setDetailData(res.data);
    } catch (err) { console.error(err); }
    finally { setDetailLoading(false); }
  }

  const handleEdit = (row) => {
    setEditModal(row);
    setEditForm({
      company_name: row.nombre_empresa || '', ruc: row.ruc || '',
      industry: row.industria || '', correo_contacto: row.correo_contacto || '',
    });
  };

  const saveEdit = async () => {
    setActionLoading(true);
    try {
      const { data: res } = await api.put(`/admin/companies/${editModal.institucion_id}`, editForm);
      if (res.result) {
        if (editForm.activo !== editModal.activo && editModal.usuario_id) {
          await adminService.toggleUserStatus(editModal.usuario_id);
        }
        setEmpresas(prev => prev.map(e => e.institucion_id === editModal.institucion_id ? { 
          ...e, nombre_empresa: editForm.company_name, ruc: editForm.ruc, 
          industria: editForm.industry, correo_contacto: editForm.correo_contacto,
          activo: editForm.activo
        } : e));
        setEditModal(null);
        setToast({ type: 'success', message: 'Empresa actualizada' });
      }
    } catch (err) { console.error(err); }
    finally { setActionLoading(false); }
  };

  // Crear empresa
  async function handleCreateCompany() {
    setActionLoading(true);
    try {
      const res = await adminService.createCompany(createForm);
      if (res.result) {
        setToast({ type: 'success', message: 'Empresa creada exitosamente' });
        setCreateModal(false);
        setCreateForm({
          cedula_representante: '', nombre_representante: '', apellido_representante: '',
          correo: '', contrasena: '', telefono: '', nombre_empresa: '', ruc: '',
          industria: '', direccion: '', ciudad: 'Guayaquil', correo_contacto: '', sitio_web: ''
        });
        load();
      } else {
        setToast({ type: 'error', message: res.message || 'Error al crear empresa' });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Error al conectar' });
    } finally { setActionLoading(false); }
  }

  // Eliminar empresa
  async function handleDelete() {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const res = await adminService.deleteUser(deleteTarget.usuario_id);
      if (res.result) {
        setToast({ type: 'success', message: 'Empresa eliminada correctamente' });
        load();
      } else {
        setToast({ type: 'error', message: res.message || 'Error al eliminar empresa' });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Error al conectar con el servidor' });
    } finally {
      setActionLoading(false);
      setDeleteTarget(null);
    }
  }

  const columns = [
    {
      key: 'nombre_empresa', label: 'Empresa',
      render: (val, row) => (
        <div>
          <p className="font-medium text-slate-800 m-0">{val}</p>
          <p className="text-xs text-slate-500 m-0">{row.ruc || 'Sin RUC'}</p>
        </div>
      ),
    },
    { key: 'industria', label: 'Sector', render: (val) => val || '-' },
    { key: 'estado', label: 'Estado', render: (val) => <StatusBadge status={val || 'pendiente'} /> },
    { key: 'correo_contacto', label: 'Contacto', render: (val) => val || '-' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Gestión de Empresas"
        subtitle={loading ? 'Cargando...' : `${empresas.length} empresas registradas`}
        action={
          <button
            onClick={() => setCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-md border-none cursor-pointer transition-colors hover:bg-primary-700"
          >
            <FiPlusCircle size={16} /> Crear Empresa
          </button>
        }
      />

      {toast && (
        <div className={`fixed top-4 right-4 z-[9999] px-4 py-3 rounded-md text-sm font-medium flex items-center gap-2 shadow-lg animate-fade-in ${
          toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>{toast.message}</div>
      )}

      <DataTable
        columns={columns} data={sortedAndFilteredEmpresas}
        searchKeys={['nombre_empresa', 'ruc', 'industria']}
        filters={
          <>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400"
            >
              <option value="">Todos los Estados</option>
              <option value="aprobado">Aprobado</option>
              <option value="pendiente">Pendiente</option>
              <option value="rechazado">Rechazado</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="alphaAsc">A-Z</option>
              <option value="alphaDesc">Z-A</option>
            </select>
          </>
        }
        actions={(row) => (
          <>
            <button onClick={() => handleViewDetail(row)} className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-600" title="Ver detalle">
              <FiEye size={16} />
            </button>
            <button onClick={() => handleEdit(row)} className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-amber-50 hover:text-amber-600" title="Editar empresa">
              <FiEdit2 size={16} />
            </button>
            {(row.estado === 'pending' || row.estado === 'pendiente') && (
              <>
                <button onClick={() => handleStatusUpdate(row.institucion_id, 'aprobado')} className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-green-50 hover:text-green-600" title="Aprobar">
                  <FiCheckCircle size={16} />
                </button>
                <button onClick={() => handleStatusUpdate(row.institucion_id, 'rechazado')} className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-red-50 hover:text-red-600" title="Rechazar">
                  <FiXCircle size={16} />
                </button>
              </>
            )}
            <button onClick={() => setDeleteTarget(row)} className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-red-50 hover:text-red-600" title="Eliminar empresa">
              <FiTrash2 size={16} />
            </button>
          </>
        )}
      />

      {/* Detail Modal with supervisors and vacancies */}
      <Modal isOpen={!!viewModal} onClose={() => { setViewModal(null); setDetailData(null); }} title="Detalle de Empresa" size="lg">
        {viewModal && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-md bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold">
                {(viewModal.nombre_empresa || '?').charAt(0)}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 m-0">{viewModal.nombre_empresa}</p>
                <p className="text-sm text-slate-500 m-0">{viewModal.ruc || 'Sin RUC'}</p>
              </div>
              <div className="ml-auto"><StatusBadge status={viewModal.estado || 'pendiente'} /></div>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
                <FiLoader className="animate-spin" size={18} />
                <span className="text-sm">Cargando detalle completo...</span>
              </div>
            ) : detailData ? (
              <>
                {/* Info general */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-md">
                  <div className="flex items-center gap-2"><FiBriefcase className="text-slate-400" size={14} /><div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Sector</p><p className="text-sm font-medium text-slate-800 m-0">{detailData.industria || '-'}</p></div></div>
                  <div className="flex items-center gap-2"><FiMapPin className="text-slate-400" size={14} /><div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Ubicación</p><p className="text-sm font-medium text-slate-800 m-0">{detailData.ciudad || '-'}{detailData.direccion ? ` - ${detailData.direccion}` : ''}</p></div></div>
                  <div className="flex items-center gap-2"><FiMail className="text-slate-400" size={14} /><div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Contacto</p><p className="text-sm text-slate-800 m-0">{detailData.correo_contacto || '-'}</p></div></div>
                  <div className="flex items-center gap-2"><FiPhone className="text-slate-400" size={14} /><div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Teléfono</p><p className="text-sm text-slate-800 m-0">{detailData.telefono || '-'}</p></div></div>
                  {detailData.sitio_web && <div className="flex items-center gap-2 col-span-2"><FiGlobe className="text-slate-400" size={14} /><div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Sitio Web</p><a href={detailData.sitio_web} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">{detailData.sitio_web}</a></div></div>}
                  <div className="col-span-2"><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Representante</p><p className="text-sm font-medium text-slate-800 m-0">{detailData.representante || '-'}</p></div>
                </div>

                {/* Supervisores */}
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiUsers size={14} /> Supervisores ({detailData.supervisores?.length || 0})
                  </h4>
                  {detailData.supervisores?.length > 0 ? (
                    <div className="grid gap-2">
                      {detailData.supervisores.map(sup => (
                        <div key={sup.supervisor_id} className={`flex items-center justify-between p-3 rounded-md border ${sup.activo ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 m-0">{sup.nombre}</p>
                            <p className="text-xs text-slate-500 m-0">{sup.cargo || 'Sin cargo'} {sup.departamento ? `· ${sup.departamento}` : ''}</p>
                            <p className="text-xs text-slate-400 m-0">{sup.correo || ''} {sup.telefono ? `· ${sup.telefono}` : ''}</p>
                          </div>
                          <StatusBadge status={sup.activo ? 'activo' : 'inactivo'} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic m-0">No hay supervisores registrados</p>
                  )}
                </div>

                {/* Vacantes */}
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiBriefcase size={14} /> Vacantes ({detailData.vacantes?.length || 0})
                  </h4>
                  {detailData.vacantes?.length > 0 ? (
                    <div className="grid gap-2">
                      {detailData.vacantes.map(vac => (
                        <div key={vac.vacante_id} className={`flex items-center justify-between p-3 rounded-md border ${vac.activo ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 m-0">{vac.titulo}</p>
                            <p className="text-xs text-slate-500 m-0">{vac.area || '-'} · {vac.modalidad} · {vac.total_horas || '-'}h</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">{vac.total_postulaciones} postulaciones</span>
                            <StatusBadge status={vac.activo ? 'activo' : 'inactivo'} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic m-0">No hay vacantes registradas</p>
                  )}
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-md">
                <div><p className="text-xs text-slate-500 mb-1">Sector</p><p className="text-sm font-semibold text-slate-800">{viewModal.industria || '-'}</p></div>
                <div><p className="text-xs text-slate-500 mb-1">Contacto</p><p className="text-sm font-semibold text-slate-800">{viewModal.correo_contacto || '-'}</p></div>
              </div>
            )}
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
            
            <div className="flex items-center gap-3 py-3 border-t border-slate-100">
              <button
                className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${editForm.activo ? 'bg-green-500' : 'bg-slate-300'}`}
                onClick={() => setEditForm(p => ({...p, activo: !p.activo}))}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${editForm.activo ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800">Cuenta Activa</span>
                <span className="text-[10px] text-slate-500 leading-tight">Si se desactiva, el representante no podrá iniciar sesión.</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-md cursor-pointer" onClick={() => setEditModal(null)}>Cancelar</button>
              <button className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md flex items-center justify-center min-w-[100px] cursor-pointer" onClick={saveEdit} disabled={actionLoading}>
                {actionLoading ? <FiLoader className="animate-spin" /> : 'Guardar'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Company Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Crear Nueva Empresa" size="lg">
        <div className="flex flex-col gap-5">
          {/* Datos de la empresa */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Datos de la Empresa</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nombre Empresa *" value={createForm.nombre_empresa} onChange={(e) => setCreateForm(p => ({...p, nombre_empresa: e.target.value}))} />
              <Input label="RUC *" value={createForm.ruc} onChange={(e) => setCreateForm(p => ({...p, ruc: e.target.value}))} placeholder="0990000000001" />
              <Input label="Industria / Sector" value={createForm.industria} onChange={(e) => setCreateForm(p => ({...p, industria: e.target.value}))} placeholder="Tecnología, Banca, etc." />
              <Input label="Ciudad" value={createForm.ciudad} onChange={(e) => setCreateForm(p => ({...p, ciudad: e.target.value}))} />
              <Input label="Dirección" value={createForm.direccion} onChange={(e) => setCreateForm(p => ({...p, direccion: e.target.value}))} />
              <Input label="Sitio Web" value={createForm.sitio_web} onChange={(e) => setCreateForm(p => ({...p, sitio_web: e.target.value}))} placeholder="https://..." />
              <Input label="Correo de contacto" type="email" value={createForm.correo_contacto} onChange={(e) => setCreateForm(p => ({...p, correo_contacto: e.target.value}))} />
            </div>
          </div>

          {/* Datos del representante */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Datos del Representante (Cuenta de acceso)</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Cédula *" value={createForm.cedula_representante} onChange={(e) => setCreateForm(p => ({...p, cedula_representante: e.target.value}))} />
              <Input label="Teléfono" type="tel" value={createForm.telefono} onChange={(e) => setCreateForm(p => ({...p, telefono: e.target.value}))} />
              <Input label="Nombre *" value={createForm.nombre_representante} onChange={(e) => setCreateForm(p => ({...p, nombre_representante: e.target.value}))} />
              <Input label="Apellido *" value={createForm.apellido_representante} onChange={(e) => setCreateForm(p => ({...p, apellido_representante: e.target.value}))} />
              <Input label="Correo *" type="email" value={createForm.correo} onChange={(e) => setCreateForm(p => ({...p, correo: e.target.value}))} />
              <Input label="Contraseña *" type="password" value={createForm.contrasena} onChange={(e) => setCreateForm(p => ({...p, contrasena: e.target.value}))} />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-md cursor-pointer" onClick={() => setCreateModal(false)}>Cancelar</button>
            <button
              className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md flex items-center justify-center min-w-[140px] cursor-pointer disabled:opacity-50"
              onClick={handleCreateCompany}
              disabled={actionLoading || !createForm.nombre_empresa || !createForm.ruc || !createForm.cedula_representante || !createForm.correo || !createForm.contrasena}
            >
              {actionLoading ? <FiLoader className="animate-spin" /> : 'Crear Empresa'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar Empresa"
        message={deleteTarget ? `¿Estás seguro de que deseas eliminar permanentemente a "${deleteTarget.nombre_empresa}"? Esta acción borrará a la empresa, a sus representantes y no se puede deshacer.` : ''}
        confirmText={actionLoading ? 'Eliminando...' : 'Eliminar'}
      />
    </div>
  );
}
