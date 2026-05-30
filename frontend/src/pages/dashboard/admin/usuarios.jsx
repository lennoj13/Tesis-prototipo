
/**
 * Admin Usuarios — Lista de usuarios con acciones y detalle de perfil.
 * Módulo 1: Gestión de Usuarios
 */

import { useState, useEffect } from 'react';
import adminService from 'services/adminService';
import PageHeader from 'components/PageHeader';
import DataTable from 'components/DataTable';
import StatusBadge from 'components/StatusBadge';
import Modal from 'components/Modal';
import ConfirmDialog from 'components/ConfirmDialog';
import Input from 'components/Input';
import { FiEye, FiTrash2, FiEdit2, FiMail, FiPhone, FiBookOpen, FiAward, FiBriefcase, FiLoader } from 'react-icons/fi';

const rolLabels = { student: 'Estudiante', company: 'Empresa', admin: 'Admin' };
const rolColors = {
  student: 'bg-blue-100 text-blue-700',
  company: 'bg-amber-100 text-amber-700',
  admin: 'bg-purple-100 text-purple-700',
};

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  async function loadUsers() {
    try {
      const res = await adminService.getUsers();
      if (res.result) setUsuarios(res.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadUsers(); }, []);

  // Cargar detalle completo al abrir modal
  async function handleViewDetail(row) {
    setViewModal(row);
    setDetailData(null);
    setDetailLoading(true);
    try {
      const res = await adminService.getUserDetail(row.usuario_id);
      if (res.result) {
        setDetailData(res.data);
      }
    } catch (err) {
      console.error('Error cargando detalle:', err);
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const res = await adminService.deleteUser(deleteTarget.usuario_id);
      if (res.result) {
        setToast({ type: 'success', message: `Usuario "${deleteTarget.nombre} ${deleteTarget.apellido || ''}" eliminado correctamente` });
        setUsuarios(prev => prev.filter(u => u.usuario_id !== deleteTarget.usuario_id));
      } else {
        setToast({ type: 'error', message: res.message || 'Error al eliminar usuario' });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Error al conectar con el servidor' });
    } finally {
      setActionLoading(false);
      setDeleteTarget(null);
    }
  }

  // Abrir modal de edición
  async function handleEdit(row) {
    setEditModal(row);
    setEditForm({
      name: row.nombre || '',
      lastname: row.apellido || '',
      email: row.correo || '',
      phone: row.telefono || '',
      cedula: row.cedula || '',
    });
  }

  // Guardar edición
  async function saveEdit() {
    setActionLoading(true);
    try {
      const res = await adminService.updateUser(editModal.usuario_id, editForm);
      if (res.result) {
        setToast({ type: 'success', message: 'Usuario actualizado correctamente' });
        loadUsers();
        setEditModal(null);
      } else {
        setToast({ type: 'error', message: res.message || 'Error al actualizar' });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Error al conectar' });
    } finally {
      setActionLoading(false);
    }
  }

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#3c8dbc] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 border border-[#2f6f92]">
            {(val || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-slate-800 m-0">{val} {row.apellido || ''}</p>
            <p className="text-xs text-slate-500 m-0">{row.correo}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'rol_nombre',
      label: 'Rol',
      render: (val) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${rolColors[val] || 'bg-slate-100 text-slate-700'}`}>
          {rolLabels[val] || val}
        </span>
      ),
    },
    { key: 'activo', label: 'Estado', render: (val) => <StatusBadge status={val ? 'activo' : 'inactivo'} /> },
    { key: 'creado_en', label: 'Registro', render: (val) => val ? new Date(val).toLocaleDateString('es-EC') : '-' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Gestión de Usuarios"
        subtitle={loading ? 'Cargando...' : `${usuarios.length} usuarios registrados`}
      />

      {/* Toast notification */}
      {toast && (
        <div className={`mb-4 px-4 py-3 rounded-md text-sm font-medium flex items-center gap-2 animate-fade-in ${
          toast.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {toast.message}
        </div>
      )}

      <DataTable
        columns={columns}
        data={usuarios}
        searchKeys={['nombre', 'correo', 'rol_nombre']}
        actions={(row) => (
          <>
            <button
              onClick={() => handleViewDetail(row)}
              className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-600"
              title="Ver perfil completo"
            >
              <FiEye size={16} />
            </button>
            <button
              onClick={() => handleEdit(row)}
              className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-amber-50 hover:text-amber-600"
              title="Editar usuario"
            >
              <FiEdit2 size={16} />
            </button>
            {row.rol_nombre !== 'admin' && (
              <button
                onClick={() => setDeleteTarget(row)}
                className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-red-50 hover:text-red-600"
                title="Eliminar usuario"
              >
                <FiTrash2 size={16} />
              </button>
            )}
          </>
        )}
      />

      {/* Detail Modal */}
      <Modal isOpen={!!viewModal} onClose={() => { setViewModal(null); setDetailData(null); }} title="Perfil del Usuario" size="md">
        {viewModal && (
          <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#3c8dbc] text-white text-2xl font-bold flex items-center justify-center flex-shrink-0 border border-[#2f6f92]">
                {(viewModal.nombre || '?').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 m-0">{viewModal.nombre} {viewModal.apellido || ''}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold mt-1 ${rolColors[viewModal.rol_nombre] || 'bg-slate-100 text-slate-700'}`}>
                  {rolLabels[viewModal.rol_nombre] || viewModal.rol_nombre}
                </span>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-md">
              <div className="flex items-center gap-2">
                <FiMail className="text-slate-400" size={14} />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Correo</p>
                  <p className="text-sm text-slate-800 m-0">{viewModal.correo}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="text-slate-400" size={14} />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Teléfono</p>
                  <p className="text-sm text-slate-800 m-0">{viewModal.telefono || 'No registrado'}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Estado</p>
                <StatusBadge status={viewModal.activo ? 'activo' : 'inactivo'} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Registro</p>
                <p className="text-sm font-semibold text-slate-800 m-0">{viewModal.creado_en ? new Date(viewModal.creado_en).toLocaleDateString('es-EC') : '-'}</p>
              </div>
            </div>

            {/* Loading state for extra detail */}
            {detailLoading && (
              <div className="flex items-center justify-center gap-2 py-6 text-slate-400">
                <FiLoader className="animate-spin" size={18} />
                <span className="text-sm">Cargando perfil completo...</span>
              </div>
            )}

            {/* Student Profile Detail */}
            {detailData?.perfil_estudiante && (
              <>
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiBookOpen size={14} /> Perfil Académico
                  </h4>
                  <div className="grid grid-cols-2 gap-3 p-4 bg-blue-50/50 rounded-md">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Carrera</p>
                      <p className="text-sm font-medium text-slate-800 m-0">{detailData.perfil_estudiante.carrera || 'No especificada'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Semestre</p>
                      <p className="text-sm font-medium text-slate-800 m-0">{detailData.perfil_estudiante.semestre || 'No especificado'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Universidad</p>
                      <p className="text-sm font-medium text-slate-800 m-0">{detailData.perfil_estudiante.universidad || 'Universidad de Guayaquil'}</p>
                    </div>
                    {detailData.perfil_estudiante.intereses && (
                      <div className="col-span-2">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Intereses</p>
                        <p className="text-sm text-slate-700 m-0">{detailData.perfil_estudiante.intereses}</p>
                      </div>
                    )}
                    {detailData.perfil_estudiante.resumen_experiencia && (
                      <div className="col-span-2">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Experiencia</p>
                        <p className="text-sm text-slate-700 m-0">{detailData.perfil_estudiante.resumen_experiencia}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills */}
                {detailData.habilidades && detailData.habilidades.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FiAward size={14} /> Habilidades ({detailData.habilidades.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {detailData.habilidades.map((skill, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-md border border-primary-200"
                        >
                          {skill.nombre}
                          <span className="text-[10px] text-primary-400">Nv.{skill.nivel}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Applications stats */}
                {detailData.postulaciones && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FiBriefcase size={14} /> Postulaciones
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center p-3 bg-slate-50 rounded-md">
                        <p className="text-xl font-bold text-slate-800 m-0">{detailData.postulaciones.total}</p>
                        <p className="text-[10px] text-slate-500 m-0">Total</p>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-md">
                        <p className="text-xl font-bold text-amber-600 m-0">{detailData.postulaciones.pendientes}</p>
                        <p className="text-[10px] text-slate-500 m-0">Pendientes</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-md">
                        <p className="text-xl font-bold text-green-600 m-0">{detailData.postulaciones.aprobadas}</p>
                        <p className="text-[10px] text-slate-500 m-0">Aprobadas</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-md">
                        <p className="text-xl font-bold text-red-600 m-0">{detailData.postulaciones.rechazadas}</p>
                        <p className="text-[10px] text-slate-500 m-0">Rechazadas</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Company Profile Detail */}
            {detailData?.perfil_empresa && (
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiBriefcase size={14} /> Perfil de Empresa
                </h4>
                <div className="grid grid-cols-2 gap-3 p-4 bg-amber-50/50 rounded-md">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Empresa</p>
                    <p className="text-sm font-medium text-slate-800 m-0">{detailData.perfil_empresa.nombre_empresa}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">RUC</p>
                    <p className="text-sm font-medium text-slate-800 m-0">{detailData.perfil_empresa.ruc || 'No registrado'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Industria</p>
                    <p className="text-sm font-medium text-slate-800 m-0">{detailData.perfil_empresa.industria || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Estado</p>
                    <StatusBadge status={detailData.perfil_empresa.estado || 'pendiente'} />
                  </div>
                  {detailData.perfil_empresa.ciudad && (
                    <div className="col-span-2">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Ubicación</p>
                      <p className="text-sm text-slate-700 m-0">{detailData.perfil_empresa.ciudad} {detailData.perfil_empresa.direccion ? `- ${detailData.perfil_empresa.direccion}` : ''}</p>
                    </div>
                  )}
                  {detailData.perfil_empresa.sitio_web && (
                    <div className="col-span-2">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Sitio web</p>
                      <a href={detailData.perfil_empresa.sitio_web} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">{detailData.perfil_empresa.sitio_web}</a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* No extra profile (admin) */}
            {detailData && !detailData.perfil_estudiante && !detailData.perfil_empresa && detailData.rol === 'admin' && (
              <p className="text-sm text-slate-400 text-center py-4 italic m-0">Cuenta de administrador — sin perfil adicional</p>
            )}
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editModal} onClose={() => setEditModal(null)} title="Editar Información del Usuario" size="sm">
        {editModal && (
          <div className="flex flex-col gap-4">
            <Input label="Cédula / RUC" value={editForm.cedula} onChange={(e) => setEditForm(p => ({...p, cedula: e.target.value}))} />
            <Input label="Nombre" value={editForm.name} onChange={(e) => setEditForm(p => ({...p, name: e.target.value}))} />
            {editModal.rol_nombre !== 'empresa' && (
              <Input label="Apellido" value={editForm.lastname} onChange={(e) => setEditForm(p => ({...p, lastname: e.target.value}))} />
            )}
            <Input label="Correo Electrónico" type="email" value={editForm.email} onChange={(e) => setEditForm(p => ({...p, email: e.target.value}))} />
            <Input label="Teléfono" type="tel" value={editForm.phone} onChange={(e) => setEditForm(p => ({...p, phone: e.target.value}))} />
            
            <div className="flex justify-end gap-3 mt-4">
              <button className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-md" onClick={() => setEditModal(null)}>Cancelar</button>
              <button className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md flex items-center justify-center min-w-[100px]" onClick={saveEdit} disabled={actionLoading}>
                {actionLoading ? <FiLoader className="animate-spin" /> : 'Guardar'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar Usuario"
        message={deleteTarget ? `¿Estás seguro de que deseas eliminar a "${deleteTarget.nombre} ${deleteTarget.apellido || ''}"? El usuario será desactivado y no podrá acceder al sistema.` : ''}
        confirmText={actionLoading ? 'Eliminando...' : 'Eliminar'}
      />
    </div>
  );
}
