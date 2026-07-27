/**
 * Admin Empresas — Lista real de empresas con crear empresa.
 * Módulo 2: Gestión de Empresas
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import api from 'services/api';
import adminService from 'services/adminService';
import PageHeader from 'components/PageHeader';
import DataTable from 'components/DataTable';
import StatusBadge from 'components/StatusBadge';
import Modal from 'components/Modal';
import Input from 'components/Input';
import ConfirmDialog from 'components/ConfirmDialog';
import InfoField from 'components/InfoField';
import { FiEye, FiCheckCircle, FiXCircle, FiEdit2, FiLoader, FiPlusCircle, FiUsers, FiBriefcase, FiMapPin, FiGlobe, FiMail, FiPhone, FiTrash2, FiCreditCard } from 'react-icons/fi';

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [createErrors, setCreateErrors] = useState({});
  // Crear empresa
  const [createModal, setCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [createForm, setCreateForm] = useState({
    cedula_representante: '', nombre_representante: '', apellido_representante: '',
    correo: '', contrasena: '', telefono: '', nombre_empresa: '', ruc: '',
    industria: '', direccion: '', ciudad: 'Guayaquil', correo_contacto: '', sitio_web: '',
    facultad_id: '1', telefono_empresa: '', fecha_limite_convenio: ''
  });

  // Supervisor management states
  const [showAddSupervisor, setShowAddSupervisor] = useState(false);
  const [newSupForm, setNewSupForm] = useState({ numero_identificacion: '', nombre: '', apellido: '', cargo: '', correo: '', telefono: '', departamento: '' });
  const [supLoading, setSupLoading] = useState(false);
  const [editingSupId, setEditingSupId] = useState(null);
  const [editSupForm, setEditSupForm] = useState({});
  const [expandedSup, setExpandedSup] = useState({}); // Record of expanded supervisor cards
  const [deleteSupTarget, setDeleteSupTarget] = useState(null);
  
  // UI states
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'supervisores', 'vacantes'
  const modalContentRef = useRef(null);

  const [statusFilter, setStatusFilter] = useState('');
  const [facultadFilter, setFacultadFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (modalContentRef.current) {
      const scrollParent = modalContentRef.current.closest('.overflow-y-auto');
      if (scrollParent) scrollParent.scrollTo(0, 0);
    }
  }, [activeTab]);

  const hasOnlyDigits = (value) => /^\d+$/.test(String(value || '').trim());
  const hasOnlyLetters = (value) => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(String(value || '').trim());

  function validateCreateCompanyForm() {
    const errors = {};
    if (createForm.ruc && !hasOnlyDigits(createForm.ruc)) {
      errors.ruc = 'El RUC debe contener solo dígitos';
    }
    if (createForm.cedula_representante && !hasOnlyDigits(createForm.cedula_representante)) {
      errors.cedula_representante = 'La cédula debe contener solo dígitos';
    }
    if (createForm.nombre_representante && !hasOnlyLetters(createForm.nombre_representante)) {
      errors.nombre_representante = 'El nombre debe contener solo letras';
    }
    if (createForm.apellido_representante && !hasOnlyLetters(createForm.apellido_representante)) {
      errors.apellido_representante = 'El apellido debe contener solo letras';
    }
    if (createForm.telefono && !hasOnlyDigits(createForm.telefono)) {
      errors.telefono = 'El teléfono del representante debe contener solo dígitos';
    }
    if (createForm.telefono_empresa && !hasOnlyDigits(createForm.telefono_empresa)) {
      errors.telefono_empresa = 'El teléfono de la empresa debe contener solo dígitos';
    }
    return errors;
  }

  function validateEditCompanyForm() {
    const errors = {};
    if (editForm.ruc && !hasOnlyDigits(editForm.ruc)) {
      errors.ruc = 'El RUC debe contener solo dígitos';
    }
    if (editForm.telefono_empresa && !hasOnlyDigits(editForm.telefono_empresa)) {
      errors.telefono_empresa = 'El teléfono de la empresa debe contener solo dígitos';
    }
    return errors;
  }

  const sortedAndFilteredEmpresas = useMemo(() => {
    let result = [...empresas];
    
    // Filter by Status
    if (statusFilter) {
      if (statusFilter === 'activa') result = result.filter(e => e.activo === true);
      if (statusFilter === 'inactiva') result = result.filter(e => e.activo === false);
    }
    
    // Filter by Facultad
    if (facultadFilter) {
      result = result.filter(u => String(u.facultad_id) === facultadFilter);
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
  }, [empresas, statusFilter, facultadFilter, sortBy]);

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

  // Supervisor Management Methods
  async function handleAddSupervisor() {
    if (!newSupForm.nombre || !newSupForm.correo || !detailData?.institucion_id) return;
    setSupLoading(true);
    try {
      const res = await adminService.createSupervisor(detailData.institucion_id, newSupForm);
      if (res.result) {
        setToast({ type: 'success', message: 'Supervisor agregado correctamente' });
        const addedSup = { ...newSupForm, supervisor_id: res.data.supervisor_id, activo: true };
        setDetailData(prev => ({ ...prev, supervisores: [...(prev.supervisores || []), addedSup] }));
        setShowAddSupervisor(false);
        setNewSupForm({ numero_identificacion: '', nombre: '', apellido: '', cargo: '', correo: '', telefono: '', departamento: '' });
      } else {
        setToast({ type: 'error', message: res.message || 'Error al agregar supervisor' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Error de conexión' });
    } finally { setSupLoading(false); }
  }

  function openEditSup(sup) {
    setEditingSupId(sup.supervisor_id);
    setEditSupForm({
      numero_identificacion: sup.numero_identificacion || '',
      nombre: sup.nombre || '',
      apellido: sup.apellido || '',
      cargo: sup.cargo || '',
      correo: sup.correo || '',
      telefono: sup.telefono || '',
      departamento: sup.departamento || ''
    });
  }

  async function handleUpdateSupervisor() {
    if (!editSupForm.nombre || !editSupForm.correo) return;
    setSupLoading(true);
    try {
      const res = await adminService.updateSupervisor(editingSupId, editSupForm);
      if (res.result) {
        setToast({ type: 'success', message: 'Supervisor actualizado correctamente' });
        setDetailData(prev => ({
          ...prev,
          supervisores: prev.supervisores.map(s => s.supervisor_id === editingSupId ? { ...s, ...editSupForm } : s)
        }));
        setEditingSupId(null);
      } else {
        setToast({ type: 'error', message: res.message || 'Error al actualizar supervisor' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Error de conexión' });
    } finally { setSupLoading(false); }
  }

  async function handleDeleteSupervisor() {
    if (!deleteSupTarget) return;
    try {
      const res = await adminService.deleteSupervisor(deleteSupTarget.supervisor_id);
      if (res.result) {
        setToast({ type: 'success', message: 'Supervisor eliminado correctamente' });
        setDetailData(prev => ({
          ...prev,
          supervisores: prev.supervisores.filter(s => s.supervisor_id !== deleteSupTarget.supervisor_id)
        }));
      } else {
        setToast({ type: 'error', message: res.message || 'Error al eliminar supervisor' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Error de conexión' });
    } finally {
      setDeleteSupTarget(null);
    }
  }

  const toggleExpandSup = (supId) => {
    setExpandedSup(prev => ({ ...prev, [supId]: !prev[supId] }));
  };

  const handleEdit = (row) => {
    setEditModal(row);
    setEditErrors({});
    setEditForm({
      company_name: row.nombre_empresa || '', ruc: row.ruc || '',
      industry: row.industria || '', correo_contacto: row.correo_contacto || '',
      telefono_empresa: row.telefono_empresa || '', fecha_limite_convenio: row.fecha_limite_convenio || '',
      codigo_convenio: row.codigo_convenio || '', tipo_convenio: row.tipo_convenio || 'PRÁCTICAS PREPROFESIONALES',
      fecha_inicio_convenio: row.fecha_inicio_convenio || '', nombre_abreviado: row.nombre_abreviado || '',
      direccion: row.direccion || '', ciudad: row.ciudad || '', sitio_web: row.sitio_web || '',
      activo: row.activo
    });
  };

  const saveEdit = async () => {
    const fieldErrors = validateEditCompanyForm();
    if (Object.keys(fieldErrors).length > 0) {
      setEditErrors(fieldErrors);
      setToast({ type: 'error', message: 'Corrige los campos marcados antes de guardar' });
      return;
    }

    setActionLoading(true);
    try {
      const { data: res } = await api.put(`/admin/companies/${editModal.institucion_id}/detail`, editForm);
      if (res.result) {
        if (editForm.activo !== editModal.activo && editModal.usuario_id) {
          await adminService.toggleUserStatus(editModal.usuario_id);
        }
        setEmpresas(prev => prev.map(e => e.institucion_id === editModal.institucion_id ? { 
          ...e, nombre_empresa: editForm.company_name, ruc: editForm.ruc, 
          industria: editForm.industry, correo_contacto: editForm.correo_contacto,
          telefono_empresa: editForm.telefono_empresa, fecha_limite_convenio: editForm.fecha_limite_convenio,
          codigo_convenio: editForm.codigo_convenio, tipo_convenio: editForm.tipo_convenio,
          fecha_inicio_convenio: editForm.fecha_inicio_convenio, nombre_abreviado: editForm.nombre_abreviado,
          direccion: editForm.direccion, ciudad: editForm.ciudad, sitio_web: editForm.sitio_web,
          activo: editForm.activo
        } : e));
        setEditModal(null);
        setEditErrors({});
        setToast({ type: 'success', message: 'Empresa actualizada' });
      } else {
        if (res.data?.field_errors) setEditErrors(res.data.field_errors);
        setToast({ type: 'error', message: res.message || 'Error al actualizar' });
      }
    } catch (err) { 
      console.error(err);
      if (err.response?.data?.data?.field_errors) setEditErrors(err.response.data.data.field_errors);
      setToast({ type: 'error', message: err.response?.data?.message || 'Error de conexión' });
    }
    finally { setActionLoading(false); }
  };

  // Crear empresa
  async function handleCreateCompany() {
    const fieldErrors = validateCreateCompanyForm();
    if (Object.keys(fieldErrors).length > 0) {
      setCreateErrors(fieldErrors);
      setToast({ type: 'error', message: 'Corrige los campos marcados antes de continuar' });
      return;
    }

    if (!createForm.nombre_empresa || !createForm.ruc || !createForm.telefono_empresa || !createForm.cedula_representante || !createForm.nombre_representante || !createForm.apellido_representante || !createForm.correo || !createForm.contrasena || !createForm.telefono) {
      setToast({ type: 'error', message: 'Llene todos los campos obligatorios, incluyendo los teléfonos' });
      return;
    }
    setActionLoading(true);
    try {
      const res = await adminService.createCompany(createForm);
      if (res.result) {
        setToast({ type: 'success', message: 'Empresa creada exitosamente' });
        setCreateModal(false);
        setCreateErrors({});
        setCreateForm({
          cedula_representante: '', nombre_representante: '', apellido_representante: '',
          correo: '', contrasena: '', telefono: '', nombre_empresa: '', ruc: '',
          industria: '', direccion: '', ciudad: 'Guayaquil', correo_contacto: '', sitio_web: '',
          facultad_id: '1', telefono_empresa: '', fecha_limite_convenio: '',
          codigo_convenio: '', tipo_convenio: 'PRÁCTICAS PREPROFESIONALES', fecha_inicio_convenio: '', nombre_abreviado: ''
        });
        load();
      } else {
        if (res.data?.field_errors) {
          setCreateErrors(res.data.field_errors);
        }
        setToast({ type: 'error', message: res.message || 'Error al crear empresa' });
      }
    } catch (err) {
      const backendErrors = err.response?.data?.data?.field_errors;
      if (backendErrors) {
        setCreateErrors(backendErrors);
      }
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
          <p className="text-[10px] text-slate-500 m-0">RUC: {row.ruc || 'N/A'} • {row.industria || 'Sin sector'}</p>
        </div>
      ),
    },
    {
      key: 'codigo_convenio', label: 'Convenio',
      render: (val, row) => (
        <div>
          <p className="font-medium text-slate-700 m-0">{val || 'Sin código'}</p>
          <p className="text-[10px] text-slate-400 m-0">{row.tipo_convenio || '-'}</p>
        </div>
      )
    },
    { key: 'activo', label: 'Estado', render: (val) => <StatusBadge status={val ? 'activo' : 'inactivo'} /> },
    { key: 'fecha_limite_convenio', label: 'Expira', render: (val) => val ? new Date(val).toLocaleDateString('es-EC') : '-' },
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
              value={facultadFilter}
              onChange={(e) => setFacultadFilter(e.target.value)}
              className="px-2 py-1.5 text-xs border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400 max-w-[140px] truncate"
            >
              <option value="">Todas las Facultades</option>
              <option value="1">Ciencias Matemáticas y Físicas</option>
              <option value="2">Ingeniería Química</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1.5 text-xs border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400 max-w-[120px] truncate"
            >
              <option value="">Todos los Estados</option>
              <option value="activa">Activas</option>
              <option value="inactiva">Inactivas</option>
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
            <button onClick={() => handleViewDetail(row)} className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-600" title="Ver detalle">
              <FiEye size={16} />
            </button>
            <button onClick={() => handleEdit(row)} className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-amber-50 hover:text-amber-600" title="Editar empresa">
              <FiEdit2 size={16} />
            </button>

            <button onClick={() => setDeleteTarget(row)} className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-red-50 hover:text-red-600" title="Desactivar empresa">
              <FiTrash2 size={16} />
            </button>
          </>
        )}
      />

      {/* Detail Modal with supervisors and vacancies */}
      <Modal isOpen={!!viewModal} onClose={() => { setViewModal(null); setDetailData(null); setShowAddSupervisor(false); setExpandedSup({}); setEditingSupId(null); setActiveTab('general'); }} title="Detalle de Empresa" size="lg">
        {viewModal && (
          <div className="flex flex-col" ref={modalContentRef}>
            <div className="sticky top-[-20px] bg-white z-10 -mx-6 px-6 pt-5 -mt-5 pb-0 shadow-[0_4px_6px_-6px_rgba(0,0,0,0.1)] border-b border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-md bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold">
                  {(viewModal.nombre_empresa || '?').charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 m-0">{viewModal.nombre_empresa}</p>
                  <p className="text-sm text-slate-500 m-0">{viewModal.ruc || 'Sin RUC'}</p>
                </div>
                <div className="ml-auto"><StatusBadge status={viewModal.activo ? 'activo' : 'inactivo'} /></div>
              </div>

              {detailData && !detailLoading && (
                <div className="flex items-center gap-1">
                  {/* Tabs for Navigation */}
                  <button onClick={() => setActiveTab('general')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'general' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'} bg-transparent border-t-0 border-l-0 border-r-0 cursor-pointer`}>
                    Información
                  </button>
                  <button onClick={() => setActiveTab('supervisores')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'supervisores' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'} bg-transparent border-t-0 border-l-0 border-r-0 cursor-pointer flex items-center gap-2`}>
                    Supervisores <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full">{(detailData.supervisores?.filter(s => s.activo) || []).length}</span>
                  </button>
                  <button onClick={() => setActiveTab('vacantes')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'vacantes' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'} bg-transparent border-t-0 border-l-0 border-r-0 cursor-pointer flex items-center gap-2`}>
                    Vacantes <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full">{detailData.vacantes?.length || 0}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="min-h-[400px] pt-5">
              {detailLoading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
                  <FiLoader className="animate-spin" size={18} />
                  <span className="text-sm">Cargando detalle completo...</span>
                </div>
              ) : detailData ? (
                <>

                  {/* Info general */}
                  {activeTab === 'general' && (
                    <div className="flex flex-col gap-6 animate-fade-in pb-4">
                      {/* Datos de la Empresa */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FiBriefcase size={14} /> Información de la Empresa
                        </h4>
                        <div className="bg-slate-50 p-4 rounded-md border border-slate-100 grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <p className="text-[10px] text-slate-400 uppercase font-semibold m-0 tracking-wider">CONVENIO</p>
                            <p className="text-sm font-medium text-slate-800 m-0 mt-0.5">{detailData.codigo_convenio || 'Sin código'} · {detailData.tipo_convenio || '-'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold m-0 tracking-wider">SECTOR</p>
                            <p className="text-sm font-medium text-slate-800 m-0 mt-0.5">{detailData.industria || '-'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold m-0 tracking-wider">FACULTAD ASOCIADA</p>
                            <p className="text-sm font-medium text-slate-800 m-0 mt-0.5">{detailData.facultad || '-'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold m-0 tracking-wider">UBICACIÓN</p>
                            <p className="text-sm font-medium text-slate-800 m-0 mt-0.5">{detailData.ciudad || '-'}{detailData.direccion ? ` - ${detailData.direccion}` : ''}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold m-0 tracking-wider">CORREO CONTACTO</p>
                            <p className="text-sm font-medium text-slate-800 m-0 mt-0.5">{detailData.correo_contacto || '-'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold m-0 tracking-wider">TELÉFONO</p>
                            <p className="text-sm font-medium text-slate-800 m-0 mt-0.5">{detailData.telefono || '-'}</p>
                          </div>
                          {detailData.sitio_web && (
                            <div className="col-span-2">
                              <p className="text-[10px] text-slate-400 uppercase font-semibold m-0 tracking-wider">SITIO WEB</p>
                              <a href={detailData.sitio_web} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline m-0 mt-0.5 truncate block">
                                {detailData.sitio_web}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Representante */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FiUsers size={14} /> Representante Legal
                        </h4>
                        <div className="bg-slate-50 p-4 rounded-md border border-slate-100 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold m-0 tracking-wider">NOMBRE COMPLETO</p>
                            <p className="text-sm font-medium text-slate-800 m-0 mt-0.5">{detailData.representante || '-'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold m-0 tracking-wider">CÉDULA / IDENTIFICACIÓN</p>
                            <p className="text-sm font-medium text-slate-800 m-0 mt-0.5">{detailData.cedula_representante || '-'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold m-0 tracking-wider">CORREO</p>
                            <p className="text-sm font-medium text-slate-800 m-0 mt-0.5">{detailData.correo_representante || '-'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold m-0 tracking-wider">TELÉFONO</p>
                            <p className="text-sm font-medium text-slate-800 m-0 mt-0.5">{detailData.telefono_representante || '-'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Fechas de Registro y Convenio */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FiMapPin size={14} /> Tiempos del Convenio
                        </h4>
                        <div className="bg-slate-50 p-4 rounded-md border border-slate-100 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold m-0 tracking-wider">FECHA DE REGISTRO</p>
                            <p className="text-sm font-medium text-slate-800 m-0 mt-0.5">{detailData.fecha_registro ? new Date(detailData.fecha_registro).toLocaleDateString('es-EC') : '-'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold m-0 tracking-wider">INICIO CONVENIO</p>
                            <p className="text-sm font-medium text-slate-800 m-0 mt-0.5">{detailData.fecha_inicio_convenio || 'Sin fecha'}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[10px] text-slate-400 uppercase font-semibold m-0 tracking-wider">FECHA LÍMITE DE CONVENIO</p>
                            <p className="text-sm font-medium text-slate-800 m-0 mt-0.5">{detailData.fecha_limite_convenio || 'Sin fecha'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Supervisores */}
                  {activeTab === 'supervisores' && (
                    <div className="animate-fade-in">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-slate-500 m-0">Gestión de personal de supervisión de la empresa.</p>
                        {!showAddSupervisor && (
                          <button onClick={() => setShowAddSupervisor(true)} className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-md border-none cursor-pointer hover:bg-primary-100 flex items-center gap-1 transition-colors">
                            <FiPlusCircle /> Nuevo Supervisor
                          </button>
                        )}
                      </div>

                      {showAddSupervisor && (
                        <div className="bg-primary-50 p-4 rounded-md border border-primary-100 flex flex-col gap-3 mb-4 animate-fade-in">
                          <h4 className="text-[11px] font-bold text-primary-700 uppercase tracking-wider m-0">Datos del Nuevo Supervisor</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-semibold text-slate-700">Nombre *</label>
                              <input value={newSupForm.nombre} onChange={e => setNewSupForm(p => ({...p, nombre: e.target.value}))} className="px-2 py-1.5 text-xs border border-slate-300 rounded outline-none focus:border-primary-400 bg-white" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-semibold text-slate-700">Apellido *</label>
                              <input value={newSupForm.apellido} onChange={e => setNewSupForm(p => ({...p, apellido: e.target.value}))} className="px-2 py-1.5 text-xs border border-slate-300 rounded outline-none focus:border-primary-400 bg-white" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-semibold text-slate-700">Correo *</label>
                              <input type="email" value={newSupForm.correo} onChange={e => setNewSupForm(p => ({...p, correo: e.target.value}))} className="px-2 py-1.5 text-xs border border-slate-300 rounded outline-none focus:border-primary-400 bg-white" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-semibold text-slate-700">Cédula *</label>
                              <input value={newSupForm.numero_identificacion} onChange={e => setNewSupForm(p => ({...p, numero_identificacion: e.target.value}))} className="px-2 py-1.5 text-xs border border-slate-300 rounded outline-none focus:border-primary-400 bg-white" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-semibold text-slate-700">Cargo *</label>
                              <input value={newSupForm.cargo} onChange={e => setNewSupForm(p => ({...p, cargo: e.target.value}))} className="px-2 py-1.5 text-xs border border-slate-300 rounded outline-none focus:border-primary-400 bg-white" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-semibold text-slate-700">Departamento *</label>
                              <input value={newSupForm.departamento} onChange={e => setNewSupForm(p => ({...p, departamento: e.target.value}))} className="px-2 py-1.5 text-xs border border-slate-300 rounded outline-none focus:border-primary-400 bg-white" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-semibold text-slate-700">Teléfono *</label>
                              <input type="tel" value={newSupForm.telefono} onChange={e => setNewSupForm(p => ({...p, telefono: e.target.value}))} className="px-2 py-1.5 text-xs border border-slate-300 rounded outline-none focus:border-primary-400 bg-white" />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 mt-2">
                            <button onClick={() => setShowAddSupervisor(false)} className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 cursor-pointer transition-colors">Cancelar</button>
                            <button onClick={handleAddSupervisor} disabled={!newSupForm.nombre || !newSupForm.apellido || !newSupForm.correo || !newSupForm.numero_identificacion || !newSupForm.cargo || !newSupForm.departamento || !newSupForm.telefono || supLoading} className="px-3 py-1.5 text-xs font-semibold text-white bg-primary-600 rounded flex items-center gap-1 hover:bg-primary-700 disabled:opacity-50 border-none cursor-pointer transition-colors">
                              {supLoading ? <FiLoader className="animate-spin" /> : 'Guardar Supervisor'}
                            </button>
                          </div>
                        </div>
                      )}

                      {detailData.supervisores?.filter(s => s.activo).length > 0 ? (
                        <div className="grid gap-3">
                          {detailData.supervisores.filter(s => s.activo).map(sup => (
                            <div key={sup.supervisor_id} className="flex flex-col p-4 rounded-lg border transition-all bg-white border-slate-200 shadow-sm hover:shadow-md">
                              {editingSupId === sup.supervisor_id ? (
                                // Inline Edit Form
                                <div className="animate-fade-in flex flex-col gap-3">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-[10px] font-semibold text-slate-700">Nombre *</label>
                                      <input value={editSupForm.nombre} onChange={e => setEditSupForm(p => ({...p, nombre: e.target.value}))} className="px-2 py-1 text-xs border border-slate-300 rounded outline-none focus:border-primary-400" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-[10px] font-semibold text-slate-700">Apellido *</label>
                                      <input value={editSupForm.apellido} onChange={e => setEditSupForm(p => ({...p, apellido: e.target.value}))} className="px-2 py-1 text-xs border border-slate-300 rounded outline-none focus:border-primary-400" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-[10px] font-semibold text-slate-700">Correo *</label>
                                      <input value={editSupForm.correo} onChange={e => setEditSupForm(p => ({...p, correo: e.target.value}))} className="px-2 py-1 text-xs border border-slate-300 rounded outline-none focus:border-primary-400" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-[10px] font-semibold text-slate-700">Cargo *</label>
                                      <input value={editSupForm.cargo} onChange={e => setEditSupForm(p => ({...p, cargo: e.target.value}))} className="px-2 py-1 text-xs border border-slate-300 rounded outline-none focus:border-primary-400" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-[10px] font-semibold text-slate-700">Departamento *</label>
                                      <input value={editSupForm.departamento} onChange={e => setEditSupForm(p => ({...p, departamento: e.target.value}))} className="px-2 py-1 text-xs border border-slate-300 rounded outline-none focus:border-primary-400" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-[10px] font-semibold text-slate-700">Teléfono *</label>
                                      <input value={editSupForm.telefono} onChange={e => setEditSupForm(p => ({...p, telefono: e.target.value}))} className="px-2 py-1 text-xs border border-slate-300 rounded outline-none focus:border-primary-400" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-[10px] font-semibold text-slate-700">Cédula *</label>
                                      <input value={editSupForm.numero_identificacion} onChange={e => setEditSupForm(p => ({...p, numero_identificacion: e.target.value}))} className="px-2 py-1 text-xs border border-slate-300 rounded outline-none focus:border-primary-400" />
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2 mt-1">
                                    <button onClick={() => setEditingSupId(null)} className="px-3 py-1 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 cursor-pointer">Cancelar</button>
                                    <button onClick={handleUpdateSupervisor} disabled={supLoading || !editSupForm.nombre || !editSupForm.apellido || !editSupForm.correo || !editSupForm.numero_identificacion || !editSupForm.cargo || !editSupForm.departamento || !editSupForm.telefono} className="px-3 py-1 text-xs font-semibold text-white bg-primary-600 rounded flex items-center gap-1 hover:bg-primary-700 disabled:opacity-50 border-none cursor-pointer">
                                      {supLoading ? <FiLoader className="animate-spin" /> : 'Guardar Cambios'}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                // View Mode
                                <>
                                  <div className="flex items-center justify-between">
                                    <div className="flex flex-col min-w-0">
                                      <p className="text-sm font-semibold text-slate-800 m-0 truncate">{sup.nombre} {sup.apellido || ''}</p>
                                      <p className="text-xs text-slate-500 m-0 truncate">{sup.cargo || 'Sin cargo'} {sup.departamento ? `· ${sup.departamento}` : ''}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <button onClick={() => toggleExpandSup(sup.supervisor_id)} className="text-[11px] font-semibold text-primary-600 hover:text-primary-800 bg-transparent border-none cursor-pointer transition-colors">
                                        {expandedSup[sup.supervisor_id] ? 'Ver menos' : 'Ver más'}
                                      </button>
                                    </div>
                                  </div>
                                  
                                  {/* Expanded Data */}
                                  {expandedSup[sup.supervisor_id] && (
                                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 animate-fade-in">
                                      <div className="flex items-start gap-2.5">
                                        <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                          <FiMail className="text-slate-400" size={12} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <p className="text-[10px] text-slate-400 uppercase font-bold m-0">Correo</p>
                                          <p className="text-xs font-medium text-slate-700 m-0 truncate" title={sup.correo}>{sup.correo}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-start gap-2.5">
                                        <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                          <FiPhone className="text-slate-400" size={12} />
                                        </div>
                                        <div>
                                          <p className="text-[10px] text-slate-400 uppercase font-bold m-0">Teléfono</p>
                                          <p className="text-xs font-medium text-slate-700 m-0">{sup.telefono || '-'}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-start gap-2.5">
                                        <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                          <FiCreditCard className="text-slate-400" size={12} />
                                        </div>
                                        <div>
                                          <p className="text-[10px] text-slate-400 uppercase font-bold m-0">Cédula</p>
                                          <p className="text-xs font-medium text-slate-700 m-0">{sup.numero_identificacion || '-'}</p>
                                        </div>
                                      </div>
                                      <div className="col-span-2 flex items-center justify-end gap-2 mt-2">
                                        <button onClick={() => openEditSup(sup)} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 cursor-pointer transition-colors text-xs font-semibold">
                                          <FiEdit2 size={12} /> Editar
                                        </button>
                                        <button onClick={() => setDeleteSupTarget(sup)} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 cursor-pointer transition-colors text-xs font-semibold">
                                          <FiTrash2 size={12} /> Desactivar
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                          <FiUsers size={32} className="text-slate-300 mb-3" />
                          <p className="text-sm font-medium text-slate-600 m-0">No hay supervisores registrados</p>
                          <p className="text-xs text-slate-400 m-0 mt-1 text-center max-w-xs">Registra un supervisor para esta empresa para que pueda gestionar practicantes.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Vacantes */}
                  {activeTab === 'vacantes' && (
                    <div className="animate-fade-in">
                      <p className="text-sm text-slate-500 mb-3 m-0">Ofertas de prácticas publicadas por esta empresa.</p>
                      {detailData.vacantes?.length > 0 ? (
                        <div className="grid gap-3">
                          {detailData.vacantes.map(vac => (
                            <div key={vac.vacante_id} className={`flex items-center justify-between p-4 rounded-lg border shadow-sm ${vac.activo ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                              <div>
                                <p className="text-sm font-bold text-slate-800 m-0">{vac.titulo}</p>
                                <p className="text-xs text-slate-500 m-0 mt-1">{vac.area || '-'} · {vac.modalidad} · {vac.total_horas || '-'}h</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-xs font-bold text-primary-600 m-0">{vac.total_postulaciones}</p>
                                  <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Postulantes</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${vac.estado === 'abierta' || vac.activo ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                                  {vac.estado || (vac.activo ? 'abierta' : 'cerrada')}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                          <FiBriefcase size={32} className="text-slate-300 mb-3" />
                          <p className="text-sm font-medium text-slate-600 m-0">No hay vacantes publicadas</p>
                        </div>
                      )}
                    </div>
                  )}
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-md">
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 mb-1">Convenio</p>
                  <p className="text-sm font-semibold text-slate-800">{viewModal.codigo_convenio || 'Sin código'} · {viewModal.tipo_convenio || '-'}</p>
                </div>
                <div><p className="text-xs text-slate-500 mb-1">Sector</p><p className="text-sm font-semibold text-slate-800">{viewModal.industria || '-'}</p></div>
                <div><p className="text-xs text-slate-500 mb-1">Contacto</p><p className="text-sm font-semibold text-slate-800">{viewModal.correo_contacto || '-'}</p></div>
                <div><p className="text-xs text-slate-500 mb-1">Inicio Convenio</p><p className="text-sm font-semibold text-slate-800">{viewModal.fecha_inicio_convenio || '-'}</p></div>
              </div>
            )}
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editModal} onClose={() => { setEditModal(null); setEditErrors({}); }} title="Editar Empresa" size="md">
        {editModal && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="RUC" value={editForm.ruc} error={editErrors.ruc} onChange={(e) => {
                setEditErrors(prev => ({ ...prev, ruc: '' }));
                setEditForm(p => ({...p, ruc: e.target.value}));
              }} inputMode="numeric" />
              <Input label="Nombre Empresa" value={editForm.company_name} onChange={(e) => setEditForm(p => ({...p, company_name: e.target.value}))} />
              <Input label="Nombre Abreviado" value={editForm.nombre_abreviado} onChange={(e) => setEditForm(p => ({...p, nombre_abreviado: e.target.value}))} />
              <Input label="Código Convenio" value={editForm.codigo_convenio} onChange={(e) => setEditForm(p => ({...p, codigo_convenio: e.target.value}))} />
              <Input label="Tipo Convenio" value={editForm.tipo_convenio} onChange={(e) => setEditForm(p => ({...p, tipo_convenio: e.target.value}))} />
              <Input label="Sector / Industria" value={editForm.industry} onChange={(e) => setEditForm(p => ({...p, industry: e.target.value}))} />
              <Input label="Ciudad" value={editForm.ciudad} onChange={(e) => setEditForm(p => ({...p, ciudad: e.target.value}))} />
              <Input label="Dirección" value={editForm.direccion} onChange={(e) => setEditForm(p => ({...p, direccion: e.target.value}))} />
              <Input label="Sitio Web" value={editForm.sitio_web} onChange={(e) => setEditForm(p => ({...p, sitio_web: e.target.value}))} />
              <Input label="Teléfono de Empresa" value={editForm.telefono_empresa} error={editErrors.telefono_empresa} onChange={(e) => {
                setEditErrors(prev => ({ ...prev, telefono_empresa: '' }));
                setEditForm(p => ({...p, telefono_empresa: e.target.value}));
              }} inputMode="numeric" />
              <Input label="Correo de contacto" type="email" value={editForm.correo_contacto} onChange={(e) => setEditForm(p => ({...p, correo_contacto: e.target.value}))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Fecha Inicio Convenio" type="date" value={editForm.fecha_inicio_convenio} onChange={(e) => setEditForm(p => ({...p, fecha_inicio_convenio: e.target.value}))} />
              <Input label="Fecha Límite Convenio" type="date" value={editForm.fecha_limite_convenio} onChange={(e) => setEditForm(p => ({...p, fecha_limite_convenio: e.target.value}))} />
            </div>
            
            <div className="flex items-center gap-3 py-3 border-t border-slate-100 mt-1">
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
              <button className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-md cursor-pointer" onClick={() => { setEditModal(null); setEditErrors({}); }}>Cancelar</button>
              <button className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md flex items-center justify-center min-w-[100px] cursor-pointer" onClick={saveEdit} disabled={actionLoading}>
                {actionLoading ? <FiLoader className="animate-spin" /> : 'Guardar'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Company Modal */}
      <Modal isOpen={createModal} onClose={() => { setCreateModal(false); setCreateErrors({}); }} title="Crear Nueva Empresa" size="lg">
        <div className="flex flex-col gap-5">
          {/* Datos de la empresa */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Datos de la Empresa</h4>
            <div className="mb-3">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Facultad Asociada</label>
              <select
                value={createForm.facultad_id}
                onChange={(e) => setCreateForm(p => ({...p, facultad_id: e.target.value}))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400"
              >
                <option value="1">Ciencias Matemáticas y Físicas</option>
                <option value="2">Ingeniería Química</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Código Convenio" value={createForm.codigo_convenio} onChange={(e) => setCreateForm(p => ({...p, codigo_convenio: e.target.value}))} placeholder="UG-..." />
              <Input label="Tipo Convenio" value={createForm.tipo_convenio} onChange={(e) => setCreateForm(p => ({...p, tipo_convenio: e.target.value}))} />
              <Input label="Nombre Empresa *" value={createForm.nombre_empresa} onChange={(e) => setCreateForm(p => ({...p, nombre_empresa: e.target.value}))} />
              <Input label="Nombre Abreviado" value={createForm.nombre_abreviado} onChange={(e) => setCreateForm(p => ({...p, nombre_abreviado: e.target.value}))} />
              <Input label="RUC *" value={createForm.ruc} error={createErrors.ruc} onChange={(e) => {
                setCreateErrors(prev => ({ ...prev, ruc: '' }));
                setCreateForm(p => ({...p, ruc: e.target.value}));
              }} placeholder="0990000000001" inputMode="numeric" />
              <Input label="Industria / Sector" value={createForm.industria} onChange={(e) => setCreateForm(p => ({...p, industria: e.target.value}))} placeholder="Tecnología, Banca, etc." />
              <Input label="Ciudad" value={createForm.ciudad} onChange={(e) => setCreateForm(p => ({...p, ciudad: e.target.value}))} />
              <Input label="Dirección" value={createForm.direccion} onChange={(e) => setCreateForm(p => ({...p, direccion: e.target.value}))} />
              <Input label="Teléfono de Empresa *" value={createForm.telefono_empresa} error={createErrors.telefono_empresa} onChange={(e) => {
                setCreateErrors(prev => ({ ...prev, telefono_empresa: '' }));
                setCreateForm(p => ({...p, telefono_empresa: e.target.value}));
              }} inputMode="numeric" />
              <Input label="Sitio Web" value={createForm.sitio_web} onChange={(e) => setCreateForm(p => ({...p, sitio_web: e.target.value}))} placeholder="https://..." />
              <Input label="Correo de Empresa" type="email" value={createForm.correo_contacto} onChange={(e) => setCreateForm(p => ({...p, correo_contacto: e.target.value}))} />
              <Input label="Fecha Inicio Convenio" type="date" value={createForm.fecha_inicio_convenio} onChange={(e) => setCreateForm(p => ({...p, fecha_inicio_convenio: e.target.value}))} />
              <Input label="Fecha Límite Convenio" type="date" value={createForm.fecha_limite_convenio} onChange={(e) => setCreateForm(p => ({...p, fecha_limite_convenio: e.target.value}))} />
            </div>
          </div>

          {/* Datos del representante */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Datos del Representante (Cuenta de acceso)</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Cédula *" value={createForm.cedula_representante} error={createErrors.cedula_representante} onChange={(e) => {
                setCreateErrors(prev => ({ ...prev, cedula_representante: '' }));
                setCreateForm(p => ({...p, cedula_representante: e.target.value}));
              }} inputMode="numeric" />
              <Input label="Teléfono (Representante) *" type="tel" value={createForm.telefono} error={createErrors.telefono} onChange={(e) => {
                setCreateErrors(prev => ({ ...prev, telefono: '' }));
                setCreateForm(p => ({...p, telefono: e.target.value}));
              }} inputMode="numeric" />
              <Input label="Nombre *" value={createForm.nombre_representante} error={createErrors.nombre_representante} onChange={(e) => {
                setCreateErrors(prev => ({ ...prev, nombre_representante: '' }));
                setCreateForm(p => ({...p, nombre_representante: e.target.value}));
              }} />
              <Input label="Apellido *" value={createForm.apellido_representante} error={createErrors.apellido_representante} onChange={(e) => {
                setCreateErrors(prev => ({ ...prev, apellido_representante: '' }));
                setCreateForm(p => ({...p, apellido_representante: e.target.value}));
              }} />
              <Input label="Correo *" type="email" value={createForm.correo} onChange={(e) => setCreateForm(p => ({...p, correo: e.target.value}))} />
              <Input label="Contraseña *" type="password" value={createForm.contrasena} onChange={(e) => setCreateForm(p => ({...p, contrasena: e.target.value}))} />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-md cursor-pointer" onClick={() => { setCreateModal(false); setCreateErrors({}); }}>Cancelar</button>
            <button
              className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md flex items-center justify-center min-w-[140px] cursor-pointer disabled:opacity-50"
              onClick={handleCreateCompany}
              disabled={actionLoading || !createForm.nombre_empresa || !createForm.ruc || !createForm.cedula_representante || !createForm.correo || !createForm.contrasena || !createForm.telefono || !createForm.telefono_empresa}
            >
              {actionLoading ? <FiLoader className="animate-spin" /> : 'Crear Empresa'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog for Company */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Desactivar Empresa"
        message={deleteTarget ? `¿Estás seguro de que deseas desactivar a "${deleteTarget.nombre_empresa}"? La empresa y sus representantes ya no tendrán acceso al sistema, pero sus registros se conservarán.` : ''}
        confirmText={actionLoading ? 'Desactivando...' : 'Desactivar'}
      />

      {/* Delete Confirmation Dialog for Supervisor */}
      <ConfirmDialog
        isOpen={!!deleteSupTarget}
        onClose={() => setDeleteSupTarget(null)}
        onConfirm={handleDeleteSupervisor}
        title="Desactivar Supervisor"
        message={deleteSupTarget ? `¿Estás seguro de que deseas desactivar al supervisor "${deleteSupTarget.nombre} ${deleteSupTarget.apellido}"? Esta acción restringirá su acceso pero conservará su historial.` : ''}
        confirmText="Desactivar"
      />
    </div>
  );
}
