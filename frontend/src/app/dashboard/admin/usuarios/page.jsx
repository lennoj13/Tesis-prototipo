'use client';

/**
 * Admin Usuarios — Lista de usuarios con acciones y detalle de perfil.
 * Módulo 1: Gestión de Usuarios
 */

import { useState, useEffect } from 'react';
import adminService from '@/services/adminService';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { FiEye, FiTrash2, FiMail, FiPhone, FiBookOpen, FiAward, FiBriefcase, FiLoader } from 'react-icons/fi';

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
      const res = await adminService.getUserDetail(row.user_id);
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
      const res = await adminService.deleteUser(deleteTarget.user_id);
      if (res.result) {
        setToast({ type: 'success', message: `Usuario "${deleteTarget.name} ${deleteTarget.lastname || ''}" eliminado correctamente` });
        setUsuarios(prev => prev.filter(u => u.user_id !== deleteTarget.user_id));
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

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${rolColors[val] || 'bg-slate-100 text-slate-700'}`}>
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

      {/* Toast notification */}
      {toast && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-fade-in ${
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
        searchKeys={['name', 'email', 'role']}
        actions={(row) => (
          <>
            <button
              onClick={() => handleViewDetail(row)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-600"
              title="Ver perfil completo"
            >
              <FiEye size={16} />
            </button>
            {row.role !== 'admin' && (
              <button
                onClick={() => setDeleteTarget(row)}
                className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-red-50 hover:text-red-600"
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
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white text-2xl font-bold flex items-center justify-center flex-shrink-0">
                {(viewModal.name || '?').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 m-0">{viewModal.name} {viewModal.lastname || ''}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold mt-1 ${rolColors[viewModal.role] || 'bg-slate-100 text-slate-700'}`}>
                  {rolLabels[viewModal.role] || viewModal.role}
                </span>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2">
                <FiMail className="text-slate-400" size={14} />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Correo</p>
                  <p className="text-sm text-slate-800 m-0">{viewModal.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="text-slate-400" size={14} />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Teléfono</p>
                  <p className="text-sm text-slate-800 m-0">{viewModal.phone || 'No registrado'}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Estado</p>
                <StatusBadge status={viewModal.is_active ? 'activo' : 'inactivo'} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Registro</p>
                <p className="text-sm font-semibold text-slate-800 m-0">{viewModal.created_at ? new Date(viewModal.created_at).toLocaleDateString('es-EC') : '-'}</p>
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
            {detailData?.student_profile && (
              <>
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiBookOpen size={14} /> Perfil Académico
                  </h4>
                  <div className="grid grid-cols-2 gap-3 p-4 bg-blue-50/50 rounded-xl">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Carrera</p>
                      <p className="text-sm font-medium text-slate-800 m-0">{detailData.student_profile.career || 'No especificada'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Semestre</p>
                      <p className="text-sm font-medium text-slate-800 m-0">{detailData.student_profile.semester || 'No especificado'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Universidad</p>
                      <p className="text-sm font-medium text-slate-800 m-0">{detailData.student_profile.university || 'Universidad de Guayaquil'}</p>
                    </div>
                    {detailData.student_profile.interests && (
                      <div className="col-span-2">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Intereses</p>
                        <p className="text-sm text-slate-700 m-0">{detailData.student_profile.interests}</p>
                      </div>
                    )}
                    {detailData.student_profile.experience_summary && (
                      <div className="col-span-2">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Experiencia</p>
                        <p className="text-sm text-slate-700 m-0">{detailData.student_profile.experience_summary}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills */}
                {detailData.skills && detailData.skills.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FiAward size={14} /> Habilidades ({detailData.skills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {detailData.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full border border-primary-200"
                        >
                          {skill.name}
                          <span className="text-[10px] text-primary-400">Nv.{skill.level}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Applications stats */}
                {detailData.applications && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FiBriefcase size={14} /> Postulaciones
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center p-3 bg-slate-50 rounded-xl">
                        <p className="text-xl font-bold text-slate-800 m-0">{detailData.applications.total}</p>
                        <p className="text-[10px] text-slate-500 m-0">Total</p>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-xl">
                        <p className="text-xl font-bold text-amber-600 m-0">{detailData.applications.pending}</p>
                        <p className="text-[10px] text-slate-500 m-0">Pendientes</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-xl">
                        <p className="text-xl font-bold text-green-600 m-0">{detailData.applications.approved}</p>
                        <p className="text-[10px] text-slate-500 m-0">Aprobadas</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-xl">
                        <p className="text-xl font-bold text-red-600 m-0">{detailData.applications.rejected}</p>
                        <p className="text-[10px] text-slate-500 m-0">Rechazadas</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Company Profile Detail */}
            {detailData?.company_profile && (
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiBriefcase size={14} /> Perfil de Empresa
                </h4>
                <div className="grid grid-cols-2 gap-3 p-4 bg-amber-50/50 rounded-xl">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Empresa</p>
                    <p className="text-sm font-medium text-slate-800 m-0">{detailData.company_profile.company_name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">RUC</p>
                    <p className="text-sm font-medium text-slate-800 m-0">{detailData.company_profile.ruc || 'No registrado'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Industria</p>
                    <p className="text-sm font-medium text-slate-800 m-0">{detailData.company_profile.industry || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Estado</p>
                    <StatusBadge status={detailData.company_profile.status || 'pending'} />
                  </div>
                  {detailData.company_profile.location && (
                    <div className="col-span-2">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Ubicación</p>
                      <p className="text-sm text-slate-700 m-0">{detailData.company_profile.location}</p>
                    </div>
                  )}
                  {detailData.company_profile.website && (
                    <div className="col-span-2">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Sitio web</p>
                      <a href={detailData.company_profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">{detailData.company_profile.website}</a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* No extra profile (admin) */}
            {detailData && !detailData.student_profile && !detailData.company_profile && detailData.role === 'admin' && (
              <p className="text-sm text-slate-400 text-center py-4 italic m-0">Cuenta de administrador — sin perfil adicional</p>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar Usuario"
        message={deleteTarget ? `¿Estás seguro de que deseas eliminar a "${deleteTarget.name} ${deleteTarget.lastname || ''}"? El usuario será desactivado y no podrá acceder al sistema.` : ''}
        confirmText={actionLoading ? 'Eliminando...' : 'Eliminar'}
      />
    </div>
  );
}
