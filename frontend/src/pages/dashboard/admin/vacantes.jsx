
/**
 * Admin Vacantes — Lista real de vacantes del sistema.
 * Módulo 3: Gestión de Vacantes (vista admin)
 */

import React, { useState, useEffect } from 'react';
import vacancyService from 'services/vacancyService';
import PageHeader from 'components/PageHeader';
import DataTable from 'components/DataTable';
import StatusBadge from 'components/StatusBadge';
import Modal from 'components/Modal';
import ConfirmDialog from 'components/ConfirmDialog';
import InfoField from 'components/InfoField';
import { FiEye, FiTrash2, FiClock, FiCalendar, FiMapPin, FiBriefcase, FiAlignLeft, FiUsers } from 'react-icons/fi';

export default function AdminVacantes() {
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [modalidadFilter, setModalidadFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [facultadFilter, setFacultadFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    async function load() {
      try {
        const res = await vacancyService.getAll();
        if (res.result) setVacantes(res.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const sortedAndFilteredVacantes = React.useMemo(() => {
    let result = [...vacantes];
    
    if (modalidadFilter) {
      result = result.filter(v => v.modalidad === modalidadFilter);
    }
    if (estadoFilter) {
      const isActive = estadoFilter === 'abierta';
      result = result.filter(v => v.activo === isActive);
    }
    if (facultadFilter) {
      result = result.filter(v => String(v.facultad_id) === facultadFilter);
    }

    switch (sortBy) {
      case 'oldest': result.sort((a,b) => new Date(a.creado_en) - new Date(b.creado_en)); break;
      case 'alphaAsc': result.sort((a,b) => (a.titulo || '').localeCompare(b.titulo || '')); break;
      case 'alphaDesc': result.sort((a,b) => (b.titulo || '').localeCompare(a.titulo || '')); break;
      case 'newest': default: result.sort((a,b) => new Date(b.creado_en) - new Date(a.creado_en)); break;
    }
    
    return result;
  }, [vacantes, modalidadFilter, estadoFilter, facultadFilter, sortBy]);

  const columns = [
    {
      key: 'titulo',
      label: 'Vacante',
      render: (val, row) => (
        <div>
          <p className="font-medium text-slate-800 m-0">{val}</p>
          <p className="text-xs text-slate-500 m-0">{row.nombre_empresa}</p>
        </div>
      ),
    },
    { key: 'area', label: 'Área', render: (val) => val || '-' },
    { key: 'modalidad', label: 'Modalidad', render: (val) => val || 'Presencial' },
    {
      key: 'total_postulaciones',
      label: 'Postulantes',
      render: (val) => (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-primary-50 text-primary-700 text-sm font-bold">
          {val || 0}
        </span>
      ),
    },
    { key: 'activo', label: 'Estado', render: (val) => <StatusBadge status={val ? 'abierta' : 'cerrada'} /> },
    { key: 'creado_en', label: 'Publicación', render: (val) => val ? new Date(val).toLocaleDateString('es-EC') : '-' },
  ];

  const handleDelete = async (id) => {
    try {
      await vacancyService.delete(id);
      setVacantes(prev => prev.filter(v => v.vacancy_id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Gestión de Vacantes"
        subtitle={loading ? 'Cargando...' : `${vacantes.length} vacantes · ${vacantes.filter(v => v.is_active).length} abiertas`}
      />

      <DataTable
        columns={columns}
        data={sortedAndFilteredVacantes}
        searchKeys={['titulo', 'nombre_empresa', 'area']}
        filters={
          <>
            <select
              value={facultadFilter}
              onChange={(e) => setFacultadFilter(e.target.value)}
              className="px-2 py-1.5 text-xs border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400 max-w-[140px] truncate"
            >
              <option value="">Todas las Facultades</option>
              <option value="1">Ciencias Matemáticas y Físicas</option>
            </select>
            <select
              value={modalidadFilter}
              onChange={(e) => setModalidadFilter(e.target.value)}
              className="px-2 py-1.5 text-xs border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400 max-w-[120px] truncate"
            >
              <option value="">Modalidad</option>
              <option value="Presencial">Presencial</option>
              <option value="Hibrido">Híbrido</option>
              <option value="Remoto">Remoto</option>
            </select>
            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="px-2 py-1.5 text-xs border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400 max-w-[120px] truncate"
            >
              <option value="">Todos los Estados</option>
              <option value="abierta">Abiertas</option>
              <option value="cerrada">Cerradas</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 py-1.5 text-xs border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400 max-w-[120px] truncate"
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
            <button
              onClick={() => setViewModal(row)}
              className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-600"
              title="Ver detalle"
            >
              <FiEye size={16} />
            </button>
            <button
              onClick={() => setDeleteConfirm(row)}
              className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-danger-light hover:text-danger"
              title="Eliminar"
            >
              <FiTrash2 size={16} />
            </button>
          </>
        )}
      />

      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Detalle de Vacante" size="lg">
        {viewModal && (
          <div className="flex flex-col gap-6 p-1">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 m-0 leading-tight">{viewModal.titulo}</h3>
                <p className="text-sm font-medium text-primary-600 m-0 mt-1">{viewModal.nombre_empresa}</p>
              </div>
              <StatusBadge status={viewModal.activo ? 'abierta' : 'cerrada'} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
              <InfoField icon={FiBriefcase} label="Área / Departamento" value={viewModal.area || 'No especificado'} />
              <InfoField icon={FiMapPin} label="Ubicación" value={viewModal.ubicacion || 'No especificada'} />
              <InfoField icon={FiClock} label="Modalidad" value={viewModal.modalidad || 'Presencial'} />
              <InfoField icon={FiCalendar} label="Horario" value={viewModal.horario || 'No especificado'} />
              <InfoField icon={FiClock} label="Total Horas" value={viewModal.total_horas ? `${viewModal.total_horas}h` : '-'} />
              <InfoField icon={FiClock} label="Horas Diarias" value={viewModal.horas_diarias ? `${viewModal.horas_diarias}h/día` : '-'} />
              <InfoField icon={FiUsers} label="Cupos Disponibles" value={viewModal.cupos || 1} />
              <InfoField icon={FiUsers} label="Total Postulantes" value={viewModal.total_postulaciones || 0} />
              <InfoField icon={FiCalendar} label="Fecha Publicación" value={viewModal.creado_en || '-'} />
              <InfoField icon={FiCalendar} label="Fecha Expiración" value={viewModal.fecha_expiracion || '-'} />
            </div>

            {viewModal.descripcion && (
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <FiAlignLeft className="text-slate-400" />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 m-0">Descripción</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="text-sm text-slate-700 m-0 whitespace-pre-wrap leading-relaxed">{viewModal.descripcion}</p>
                </div>
              </div>
            )}
            
            {viewModal.requisitos && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FiBriefcase className="text-slate-400" />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 m-0">Requisitos Adicionales</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="text-sm text-slate-700 m-0 whitespace-pre-wrap leading-relaxed">{viewModal.requisitos}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm?.vacante_id)}
        title="Eliminar Vacante"
        message={`¿Eliminar "${deleteConfirm?.titulo}"?`}
      />
    </div>
  );
}
