'use client';

/**
 * Admin Empresas — CRUD de gestión de empresas.
 * Módulo 2: Gestión de Empresas
 */

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { FiEdit2, FiTrash2, FiEye, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const mockEmpresas = [
  { id: 1, nombre: 'TechSolutions GYE', ruc: '0990123456001', sector: 'Tecnología', vacantes: 3, estado: 'aprobado', contacto: 'rrhh@techsolutionsgye.com', fecha: '2026-01-10' },
  { id: 2, nombre: 'InnovaGroup S.A.', ruc: '0991234567001', sector: 'Consultoría', vacantes: 2, estado: 'aprobado', contacto: 'rrhh@innovagroup.ec', fecha: '2026-01-15' },
  { id: 3, nombre: 'DataMind Ecuador', ruc: '0992345678001', sector: 'Data Science', vacantes: 4, estado: 'pendiente', contacto: 'contacto@datamindgye.com', fecha: '2026-02-01' },
  { id: 4, nombre: 'FinanzasPro Cía. Ltda.', ruc: '0993456789001', sector: 'Finanzas', vacantes: 1, estado: 'aprobado', contacto: 'rrhh@finanzaspro.ec', fecha: '2026-01-25' },
  { id: 5, nombre: 'CloudNet Ecuador', ruc: '0994567890001', sector: 'Cloud Computing', vacantes: 5, estado: 'aprobado', contacto: 'info@cloudnetec.com', fecha: '2025-12-20' },
  { id: 6, nombre: 'GreenEnergy S.A.', ruc: '0995678901001', sector: 'Energía', vacantes: 0, estado: 'pendiente', contacto: 'info@greenenergy.ec', fecha: '2026-02-10' },
  { id: 7, nombre: 'SmartLogistics GYE', ruc: '0996789012001', sector: 'Logística', vacantes: 2, estado: 'rechazado', contacto: 'rrhh@smartlog.ec', fecha: '2026-02-08' },
  { id: 8, nombre: 'BioHealth Labs EC', ruc: '0997890123001', sector: 'Salud', vacantes: 3, estado: 'aprobado', contacto: 'lab@biohealth.ec', fecha: '2026-01-30' },
  { id: 9, nombre: 'EduTech Ecuador', ruc: '0998901234001', sector: 'Educación', vacantes: 1, estado: 'aprobado', contacto: 'admin@edutech.ec', fecha: '2026-02-12' },
  { id: 10, nombre: 'ConstructMax S.A.', ruc: '0999012345001', sector: 'Construcción', vacantes: 0, estado: 'inactivo', contacto: 'info@constructmax.ec', fecha: '2026-01-05' },
];

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState(mockEmpresas);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [editEmpresa, setEditEmpresa] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const columns = [
    {
      key: 'nombre',
      label: 'Empresa',
      render: (val, row) => (
        <div>
          <p className="font-medium text-slate-800 m-0">{val}</p>
          <p className="text-xs text-slate-500 m-0">RUC: {row.ruc}</p>
        </div>
      ),
    },
    { key: 'sector', label: 'Sector' },
    {
      key: 'vacantes',
      label: 'Vacantes',
      render: (val) => (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 text-primary-700 text-sm font-bold">
          {val}
        </span>
      ),
    },
    { key: 'estado', label: 'Estado', render: (val) => <StatusBadge status={val} /> },
    { key: 'fecha', label: 'Registro', render: (val) => new Date(val).toLocaleDateString('es-EC') },
  ];

  const handleDelete = (id) => {
    setEmpresas((prev) => prev.filter((e) => e.id !== id));
  };

  const handleAprobar = (empresa) => {
    setEmpresas((prev) =>
      prev.map((e) => (e.id === empresa.id ? { ...e, estado: 'aprobado' } : e))
    );
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Gestión de Empresas"
        subtitle={`${empresas.length} empresas registradas · ${empresas.filter(e => e.estado === 'pendiente').length} pendientes de aprobación`}
      />

      <DataTable
        columns={columns}
        data={empresas}
        searchKeys={['nombre', 'ruc', 'sector']}
        actions={(row) => (
          <>
            <button
              onClick={() => setViewModal(row)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-600"
              title="Ver detalle"
            >
              <FiEye size={16} />
            </button>
            {row.estado === 'pendiente' && (
              <button
                onClick={() => handleAprobar(row)}
                className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-success-light hover:text-green-600"
                title="Aprobar"
              >
                <FiCheckCircle size={16} />
              </button>
            )}
            <button
              onClick={() => { setEditEmpresa(row); setModalOpen(true); }}
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

      {/* Modal — Editar empresa */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditEmpresa(null); }}
        title={editEmpresa ? 'Editar Empresa' : 'Nueva Empresa'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setModalOpen(false); setEditEmpresa(null); }}>Cancelar</Button>
            <Button onClick={() => { setModalOpen(false); setEditEmpresa(null); }}>Guardar</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Nombre de la empresa" required defaultValue={editEmpresa?.nombre || ''} placeholder="Ej: TechSolutions GYE" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="RUC" required defaultValue={editEmpresa?.ruc || ''} placeholder="0990123456001" />
            <Input label="Sector" required defaultValue={editEmpresa?.sector || ''} placeholder="Ej: Tecnología" />
          </div>
          <Input label="Email de contacto" type="email" required defaultValue={editEmpresa?.contacto || ''} placeholder="contacto@empresa.com" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Estado</label>
            <select
              defaultValue={editEmpresa?.estado || 'pendiente'}
              className="w-full py-2.5 px-3.5 text-[0.9375rem] text-slate-800 bg-white border-[1.5px] border-slate-300 rounded-lg outline-none transition-all focus:border-primary-500 focus:ring-3 focus:ring-primary-100"
            >
              <option value="pendiente">Pendiente</option>
              <option value="aprobado">Aprobado</option>
              <option value="rechazado">Rechazado</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Modal — Ver detalle */}
      <Modal
        isOpen={!!viewModal}
        onClose={() => setViewModal(null)}
        title="Detalle de Empresa"
      >
        {viewModal && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold">
                {viewModal.nombre?.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 m-0">{viewModal.nombre}</p>
                <p className="text-sm text-slate-500 m-0">RUC: {viewModal.ruc}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="text-xs text-slate-500 mb-1">Sector</p>
                <p className="text-sm font-semibold text-slate-800">{viewModal.sector}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Estado</p>
                <StatusBadge status={viewModal.estado} />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Vacantes activas</p>
                <p className="text-sm font-semibold text-slate-800">{viewModal.vacantes}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Contacto</p>
                <p className="text-sm font-semibold text-slate-800">{viewModal.contacto}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Fecha de registro</p>
                <p className="text-sm font-semibold text-slate-800">{new Date(viewModal.fecha).toLocaleDateString('es-EC')}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm?.id)}
        title="Eliminar Empresa"
        message={`¿Estás seguro de eliminar "${deleteConfirm?.nombre}"? Se eliminarán también sus vacantes asociadas.`}
      />
    </div>
  );
}
