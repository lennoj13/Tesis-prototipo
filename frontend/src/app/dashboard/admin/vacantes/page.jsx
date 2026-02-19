'use client';

/**
 * Admin Vacantes — CRUD de gestión de vacantes.
 * Módulo 3: Gestión de Vacantes (vista admin)
 */

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import Button from '@/components/Button';
import { FiEye, FiTrash2, FiXCircle } from 'react-icons/fi';

const mockVacantes = [
  { id: 1, titulo: 'Practicante Desarrollo Frontend', empresa: 'TechSolutions GYE', area: 'Desarrollo Web', postulantes: 12, estado: 'abierta', modalidad: 'Híbrido', fecha: '2026-02-01' },
  { id: 2, titulo: 'Practicante Análisis de Datos', empresa: 'DataMind Ecuador', area: 'Data Science', postulantes: 8, estado: 'abierta', modalidad: 'Remoto', fecha: '2026-02-05' },
  { id: 3, titulo: 'Practicante Diseño UX/UI', empresa: 'InnovaGroup S.A.', area: 'Diseño', postulantes: 15, estado: 'abierta', modalidad: 'Presencial', fecha: '2026-01-28' },
  { id: 4, titulo: 'Practicante Contabilidad', empresa: 'FinanzasPro Cía. Ltda.', area: 'Contabilidad', postulantes: 5, estado: 'cerrada', modalidad: 'Presencial', fecha: '2026-01-15' },
  { id: 5, titulo: 'Practicante DevOps', empresa: 'CloudNet Ecuador', area: 'Infraestructura', postulantes: 6, estado: 'abierta', modalidad: 'Remoto', fecha: '2026-02-08' },
  { id: 6, titulo: 'Practicante Marketing Digital', empresa: 'InnovaGroup S.A.', area: 'Marketing Digital', postulantes: 20, estado: 'abierta', modalidad: 'Híbrido', fecha: '2026-02-10' },
  { id: 7, titulo: 'Practicante Backend', empresa: 'TechSolutions GYE', area: 'Desarrollo Backend', postulantes: 10, estado: 'abierta', modalidad: 'Remoto', fecha: '2026-02-12' },
  { id: 8, titulo: 'Practicante RRHH', empresa: 'BioHealth Labs EC', area: 'Recursos Humanos', postulantes: 3, estado: 'cerrada', modalidad: 'Presencial', fecha: '2026-01-20' },
  { id: 9, titulo: 'Practicante Finanzas', empresa: 'FinanzasPro Cía. Ltda.', area: 'Finanzas', postulantes: 7, estado: 'abierta', modalidad: 'Híbrido', fecha: '2026-02-14' },
  { id: 10, titulo: 'Practicante Soporte TI', empresa: 'CloudNet Ecuador', area: 'IT Support', postulantes: 4, estado: 'abierta', modalidad: 'Presencial', fecha: '2026-02-15' },
];

export default function AdminVacantes() {
  const [vacantes, setVacantes] = useState(mockVacantes);
  const [viewModal, setViewModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const columns = [
    {
      key: 'titulo',
      label: 'Vacante',
      render: (val, row) => (
        <div>
          <p className="font-medium text-slate-800 m-0">{val}</p>
          <p className="text-xs text-slate-500 m-0">{row.empresa}</p>
        </div>
      ),
    },
    { key: 'area', label: 'Área' },
    { key: 'modalidad', label: 'Modalidad' },
    {
      key: 'postulantes',
      label: 'Postulantes',
      render: (val) => (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 text-primary-700 text-sm font-bold">
          {val}
        </span>
      ),
    },
    { key: 'estado', label: 'Estado', render: (val) => <StatusBadge status={val} /> },
    { key: 'fecha', label: 'Publicación', render: (val) => new Date(val).toLocaleDateString('es-EC') },
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
        title="Gestión de Vacantes"
        subtitle={`${vacantes.length} vacantes totales · ${vacantes.filter(v => v.estado === 'abierta').length} abiertas`}
      />

      <DataTable
        columns={columns}
        data={vacantes}
        searchKeys={['titulo', 'empresa', 'area']}
        actions={(row) => (
          <>
            <button
              onClick={() => setViewModal(row)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-600"
              title="Ver detalle"
            >
              <FiEye size={16} />
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

      {/* Modal — Ver detalle */}
      <Modal
        isOpen={!!viewModal}
        onClose={() => setViewModal(null)}
        title="Detalle de Vacante"
        size="lg"
      >
        {viewModal && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{viewModal.titulo}</h3>
              <p className="text-sm text-slate-500">{viewModal.empresa}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl max-md:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500 mb-1">Área</p>
                <p className="text-sm font-semibold text-slate-800">{viewModal.area}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Modalidad</p>
                <p className="text-sm font-semibold text-slate-800">{viewModal.modalidad}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Estado</p>
                <StatusBadge status={viewModal.estado} />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Postulantes</p>
                <p className="text-sm font-semibold text-slate-800">{viewModal.postulantes} estudiantes</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Publicación</p>
                <p className="text-sm font-semibold text-slate-800">{new Date(viewModal.fecha).toLocaleDateString('es-EC')}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-2">Descripción</p>
              <p className="text-sm text-slate-700 leading-relaxed p-4 bg-slate-50 rounded-lg">
                Buscamos estudiante de la Facultad de CC.MM.FF con conocimientos en {viewModal.area.toLowerCase()} para realizar prácticas preprofesionales en {viewModal.empresa}. 
                Modalidad {viewModal.modalidad.toLowerCase()}. Se requiere estar cursando a partir del 7mo semestre.
              </p>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm?.id)}
        title="Eliminar Vacante"
        message={`¿Estás seguro de eliminar "${deleteConfirm?.titulo}"? Los postulantes serán notificados.`}
      />
    </div>
  );
}
