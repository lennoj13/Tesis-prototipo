'use client';

/**
 * Empresa Vacantes — Lista de vacantes de prácticas de la empresa.
 * Módulo 3: Gestión de Vacantes (vista empresa)
 * Contexto: Prácticas preprofesionales — Universidad de Guayaquil
 */

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { FiEdit2, FiTrash2, FiEye, FiUsers, FiPlusCircle, FiXCircle } from 'react-icons/fi';

const mockVacantes = [
  { id: 1, titulo: 'Practicante Desarrollo Frontend', area: 'Desarrollo Web', postulantes: 12, estado: 'abierta', modalidad: 'Híbrido', ubicacion: 'Guayaquil', plazas: 2, fechaLimite: '2026-04-01', fecha: '2026-02-15' },
  { id: 2, titulo: 'Practicante Diseño UX/UI', area: 'Diseño', postulantes: 8, estado: 'abierta', modalidad: 'Remoto', ubicacion: 'Remoto', plazas: 1, fechaLimite: '2026-04-15', fecha: '2026-02-18' },
  { id: 3, titulo: 'Practicante Análisis de Datos', area: 'Data Science', postulantes: 15, estado: 'abierta', modalidad: 'Presencial', ubicacion: 'Guayaquil', plazas: 3, fechaLimite: '2026-03-28', fecha: '2026-02-10' },
  { id: 4, titulo: 'Practicante Soporte TI', area: 'IT Support', postulantes: 5, estado: 'cerrada', modalidad: 'Presencial', ubicacion: 'Guayaquil', plazas: 1, fechaLimite: '2026-02-20', fecha: '2026-01-15' },
  { id: 5, titulo: 'Practicante Community Manager', area: 'Marketing Digital', postulantes: 20, estado: 'abierta', modalidad: 'Híbrido', ubicacion: 'Guayaquil', plazas: 2, fechaLimite: '2026-04-10', fecha: '2026-02-19' },
];

export default function EmpresaVacantes() {
  const [vacantes, setVacantes] = useState(mockVacantes);
  const [viewModal, setViewModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const columns = [
    {
      key: 'titulo',
      label: 'Vacante de Práctica',
      render: (val, row) => (
        <div>
          <p className="font-medium text-slate-800 m-0">{val}</p>
          <p className="text-xs text-slate-500 m-0">{row.area} · {row.modalidad} · {row.ubicacion}</p>
        </div>
      ),
    },
    { key: 'plazas', label: 'Plazas' },
    {
      key: 'postulantes',
      label: 'Postulantes',
      render: (val) => (
        <div className="flex items-center gap-1.5">
          <FiUsers size={14} className="text-slate-400" />
          <span className="font-semibold text-primary-600">{val}</span>
        </div>
      ),
    },
    { key: 'estado', label: 'Estado', render: (val) => <StatusBadge status={val} /> },
    { key: 'fechaLimite', label: 'Fecha límite', render: (val) => new Date(val).toLocaleDateString('es-EC') },
  ];

  const handleDelete = (id) => {
    setVacantes((prev) => prev.filter((v) => v.id !== id));
  };

  const handleCerrar = (vacante) => {
    setVacantes((prev) =>
      prev.map((v) => (v.id === vacante.id ? { ...v, estado: 'cerrada' } : v))
    );
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Mis Vacantes de Prácticas"
        subtitle={`${vacantes.filter(v => v.estado === 'abierta').length} vacantes abiertas de ${vacantes.length} totales`}
        action={
          <Link href="/dashboard/empresa/vacantes/nueva">
            <Button icon={<FiPlusCircle />}>Nueva Vacante</Button>
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={vacantes}
        searchKeys={['titulo', 'area']}
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
              onClick={() => setEditModal(row)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-600"
              title="Editar"
            >
              <FiEdit2 size={16} />
            </button>
            {row.estado === 'abierta' && (
              <button
                onClick={() => handleCerrar(row)}
                className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-warning-light hover:text-amber-600"
                title="Cerrar vacante"
              >
                <FiXCircle size={16} />
              </button>
            )}
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
            <h3 className="text-xl font-bold text-slate-900">{viewModal.titulo}</h3>
            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl max-md:grid-cols-2">
              <div><p className="text-xs text-slate-500 mb-1">Área</p><p className="text-sm font-semibold text-slate-800">{viewModal.area}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Modalidad</p><p className="text-sm font-semibold text-slate-800">{viewModal.modalidad}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Ubicación</p><p className="text-sm font-semibold text-slate-800">{viewModal.ubicacion}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Plazas disponibles</p><p className="text-sm font-semibold text-primary-600">{viewModal.plazas}</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Postulantes</p><p className="text-sm font-semibold text-primary-600">{viewModal.postulantes} estudiantes</p></div>
              <div><p className="text-xs text-slate-500 mb-1">Estado</p><StatusBadge status={viewModal.estado} /></div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Editar */}
      <Modal
        isOpen={!!editModal}
        onClose={() => setEditModal(null)}
        title="Editar Vacante"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditModal(null)}>Cancelar</Button>
            <Button onClick={() => setEditModal(null)}>Guardar Cambios</Button>
          </>
        }
      >
        {editModal && (
          <div className="flex flex-col gap-4">
            <Input label="Título de la vacante" required defaultValue={editModal.titulo} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Área" required defaultValue={editModal.area} />
              <Input label="Modalidad" required defaultValue={editModal.modalidad} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Plazas disponibles" type="number" defaultValue={editModal.plazas} />
              <Input label="Fecha límite" type="date" defaultValue={editModal.fechaLimite} />
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm?.id)}
        title="Eliminar Vacante"
        message={`¿Eliminar "${deleteConfirm?.titulo}"? Los postulantes serán notificados.`}
      />
    </div>
  );
}
