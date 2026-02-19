'use client';

/**
 * Admin Usuarios — CRUD de gestión de usuarios.
 * Módulo 1: Gestión de Usuarios
 */

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { FiEdit2, FiTrash2, FiEye, FiUserPlus } from 'react-icons/fi';

// Mock data — se reemplazará con llamadas a la API Flask
const mockUsuarios = [
  { id: 1, nombre: 'Bryan Galarza', email: 'bryan.galarzaind@ug.edu.ec', rol: 'estudiante', estado: 'activo', fecha: '2026-01-15' },
  { id: 2, nombre: 'Ana García', email: 'rrhh@techsolutionsgye.com', rol: 'empresa', estado: 'activo', fecha: '2026-01-20' },
  { id: 3, nombre: 'Admin Sistema', email: 'admin@matchug.edu.ec', rol: 'admin', estado: 'activo', fecha: '2025-12-01' },
  { id: 4, nombre: 'María López', email: 'maria.lopezr@ug.edu.ec', rol: 'estudiante', estado: 'activo', fecha: '2026-02-01' },
  { id: 5, nombre: 'Pedro Sánchez', email: 'contacto@datamindgye.com', rol: 'empresa', estado: 'inactivo', fecha: '2026-01-10' },
  { id: 6, nombre: 'Laura Torres', email: 'laura.torresm@ug.edu.ec', rol: 'estudiante', estado: 'activo', fecha: '2026-02-05' },
  { id: 7, nombre: 'Roberto Díaz', email: 'rrhh@innovagroup.ec', rol: 'empresa', estado: 'pendiente', fecha: '2026-02-10' },
  { id: 8, nombre: 'Sofía Ramírez', email: 'sofia.ramirezp@ug.edu.ec', rol: 'estudiante', estado: 'activo', fecha: '2026-02-12' },
  { id: 9, nombre: 'Diego Vargas', email: 'diego.vargasc@ug.edu.ec', rol: 'estudiante', estado: 'inactivo', fecha: '2026-01-25' },
  { id: 10, nombre: 'Valentina Cruz', email: 'info@cloudnetec.com', rol: 'empresa', estado: 'activo', fecha: '2026-02-14' },
  { id: 11, nombre: 'Naldo Anchundia', email: 'naldo.anchundiac@ug.edu.ec', rol: 'estudiante', estado: 'activo', fecha: '2026-02-15' },
  { id: 12, nombre: 'Camila Reyes', email: 'camila@digitalwave.ec', rol: 'empresa', estado: 'activo', fecha: '2026-02-16' },
];

const rolLabels = { estudiante: 'Estudiante', empresa: 'Empresa', admin: 'Admin' };

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState(mockUsuarios);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
            {val?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-slate-800 m-0">{val}</p>
            <p className="text-xs text-slate-500 m-0">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'rol',
      label: 'Rol',
      render: (val) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
          {rolLabels[val] || val}
        </span>
      ),
    },
    { key: 'estado', label: 'Estado', render: (val) => <StatusBadge status={val} /> },
    { key: 'fecha', label: 'Registro', render: (val) => new Date(val).toLocaleDateString('es-EC') },
  ];

  const handleDelete = (id) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Gestión de Usuarios"
        subtitle={`${usuarios.length} usuarios registrados en el sistema`}
        action={
          <Button icon={<FiUserPlus />} onClick={() => setModalOpen(true)}>
            Nuevo Usuario
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={usuarios}
        searchKeys={['nombre', 'email', 'rol']}
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
              onClick={() => { setEditUser(row); setModalOpen(true); }}
              className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-600"
              title="Editar"
            >
              <FiEdit2 size={16} />
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

      {/* Modal — Crear/Editar usuario */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditUser(null); }}
        title={editUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setModalOpen(false); setEditUser(null); }}>Cancelar</Button>
            <Button onClick={() => { setModalOpen(false); setEditUser(null); }}>
              {editUser ? 'Guardar Cambios' : 'Crear Usuario'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Nombre completo" required defaultValue={editUser?.nombre || ''} placeholder="Ej: Carlos Mendoza" />
          <Input label="Correo electrónico" type="email" required defaultValue={editUser?.email || ''} placeholder="correo@ejemplo.com" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Rol <span className="text-danger ml-0.5">*</span></label>
            <select
              defaultValue={editUser?.rol || 'estudiante'}
              className="w-full py-2.5 px-3.5 text-[0.9375rem] text-slate-800 bg-white border-[1.5px] border-slate-300 rounded-lg outline-none transition-all focus:border-primary-500 focus:ring-3 focus:ring-primary-100"
            >
              <option value="estudiante">Estudiante</option>
              <option value="empresa">Empresa</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Modal — Ver detalle */}
      <Modal
        isOpen={!!viewModal}
        onClose={() => setViewModal(null)}
        title="Detalle del Usuario"
        size="sm"
      >
        {viewModal && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white text-xl font-bold flex items-center justify-center">
                {viewModal.nombre?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 m-0">{viewModal.nombre}</p>
                <p className="text-sm text-slate-500 m-0">{viewModal.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="text-xs text-slate-500 mb-1">Rol</p>
                <p className="text-sm font-semibold text-slate-800">{rolLabels[viewModal.rol]}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Estado</p>
                <StatusBadge status={viewModal.estado} />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Fecha de registro</p>
                <p className="text-sm font-semibold text-slate-800">{new Date(viewModal.fecha).toLocaleDateString('es-EC')}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">ID</p>
                <p className="text-sm font-semibold text-slate-800">#{viewModal.id}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmar eliminación */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm?.id)}
        title="Eliminar Usuario"
        message={`¿Estás seguro de eliminar a "${deleteConfirm?.nombre}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
