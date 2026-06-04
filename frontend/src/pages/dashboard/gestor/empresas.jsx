
/**
 * Gestor Empresas — Lista de empresas del convenio con detalle completo.
 * RF-8: Listado de empresas del convenio
 */

import { useState, useEffect } from 'react';
import PageHeader from 'components/PageHeader';
import StatusBadge from 'components/StatusBadge';
import Card from 'components/Card';
import EmptyState from 'components/EmptyState';
import Modal from 'components/Modal';
import DataTable from 'components/DataTable';
import adminService from 'services/adminService';
import Input from 'components/Input';
import { FiSearch, FiEye, FiUsers, FiBriefcase, FiMapPin, FiMail, FiPhone, FiGlobe, FiLoader, FiPlusCircle, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function GestorEmpresas() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  // Detalle
  const [viewModal, setViewModal] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Supervisor management states
  const [showAddSupervisor, setShowAddSupervisor] = useState(false);
  const [newSupForm, setNewSupForm] = useState({ numero_identificacion: '', nombre: '', apellido: '', cargo: '', correo: '', telefono: '', departamento: '' });
  const [supLoading, setSupLoading] = useState(false);
  const [editingSupId, setEditingSupId] = useState(null);
  const [editSupForm, setEditSupForm] = useState({});
  const [expandedSup, setExpandedSup] = useState({});
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => { loadCompanies(); }, []);

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); }
  }, [toast]);

  async function loadCompanies() {
    try {
      const response = await adminService.getCompanies();
      if (response.result) setCompanies(response.data || []);
    } catch (err) { console.error('Error:', err); }
    finally { setLoading(false); }
  }

  // Ver detalle completo
  async function handleViewDetail(company) {
    setViewModal(company);
    setDetailData(null);
    setDetailLoading(true);
    try {
      const res = await adminService.getCompanyDetail(company.institucion_id);
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

  async function handleDeleteSupervisor(supervisor_id) {
    if (!window.confirm("¿Seguro que deseas eliminar a este supervisor?")) return;
    try {
      const res = await adminService.deleteSupervisor(supervisor_id);
      if (res.result) {
        setToast({ type: 'success', message: 'Supervisor eliminado correctamente' });
        setDetailData(prev => ({
          ...prev,
          supervisores: prev.supervisores.filter(s => s.supervisor_id !== supervisor_id)
        }));
      } else {
        setToast({ type: 'error', message: res.message || 'Error al eliminar supervisor' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Error de conexión' });
    }
  }

  const toggleExpandSup = (supId) => {
    setExpandedSup(prev => ({ ...prev, [supId]: !prev[supId] }));
  };

  // Filtrar empresas
  const filtered = search.trim()
    ? companies.filter(c =>
        (c.nombre_empresa || '').toLowerCase().includes(search.toLowerCase()) ||
        (c.ruc || '').toLowerCase().includes(search.toLowerCase()) ||
        (c.industria || '').toLowerCase().includes(search.toLowerCase())
      )
    : companies;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Empresas Registradas"
        subtitle="Empresas con convenio para prácticas preprofesionales"
      />

      {/* Barra de búsqueda integrada en DataTable */}
      {loading ? (
        <Card>
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <FiLoader className="animate-spin text-primary-600" size={32} />
            <span className="text-sm font-medium">Cargando empresas...</span>
          </div>
        </Card>
      ) : (
        <DataTable
          columns={[
            { key: 'codigo_convenio', label: 'Código', render: (val) => val || '-' },
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
            { key: 'tipo_convenio', label: 'Tipo Convenio', render: (val) => val || '-' },
            { key: 'industria', label: 'Sector', render: (val) => val || '-' },
            { 
              key: 'vacantes_activas', 
              label: 'Vacantes Activas', 
              render: (val) => <span className="font-bold text-primary-600">{val || 0}</span> 
            },
            { 
              key: 'total_supervisores', 
              label: 'Supervisores', 
              render: (val) => <span className="font-bold text-slate-600">{val || 0}</span> 
            },
            { key: 'activo', label: 'Estado', render: (val) => <StatusBadge status={val ? 'activo' : 'inactivo'} /> },
            { key: 'fecha_limite_convenio', label: 'Expira Convenio', render: (val) => val ? new Date(val).toLocaleDateString('es-EC') : '-' },
          ]}
          data={companies}
          searchKeys={['nombre_empresa', 'ruc', 'industria']}
          actions={(row) => (
            <button
              onClick={() => handleViewDetail(row)}
              className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-600"
              title="Ver detalle de empresa"
            >
              <FiEye size={16} />
            </button>
          )}
        />
      )}

      {/* Detail Modal */}
      <Modal isOpen={!!viewModal} onClose={() => { setViewModal(null); setDetailData(null); setShowAddSupervisor(false); setExpandedSup({}); setEditingSupId(null); setActiveTab('general'); }} title="Detalle de Empresa" size="lg">
        {viewModal && (
          <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-md bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold">
                {(viewModal.nombre_empresa || '?').charAt(0)}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 m-0">{viewModal.nombre_empresa}</p>
                <p className="text-sm text-slate-500 m-0">RUC: {viewModal.ruc || 'Sin RUC'}</p>
              </div>
              <div className="ml-auto"><StatusBadge status={viewModal.activo ? 'activo' : 'inactivo'} /></div>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
                <FiLoader className="animate-spin" size={18} />
                <span className="text-sm">Cargando información detallada...</span>
              </div>
            ) : detailData ? (
              <>
                {/* Tabs for Navigation */}
                <div className="flex items-center gap-1 mt-4 border-b border-slate-200">
                  <button onClick={() => setActiveTab('general')} className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'general' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'} bg-transparent border-t-0 border-l-0 border-r-0 cursor-pointer`}>
                    Información
                  </button>
                  <button onClick={() => setActiveTab('supervisores')} className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'supervisores' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'} bg-transparent border-t-0 border-l-0 border-r-0 cursor-pointer flex items-center gap-2`}>
                    Supervisores <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full">{(detailData.supervisores?.filter(s => s.activo) || []).length}</span>
                  </button>
                  <button onClick={() => setActiveTab('vacantes')} className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'vacantes' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'} bg-transparent border-t-0 border-l-0 border-r-0 cursor-pointer flex items-center gap-2`}>
                    Vacantes <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full">{detailData.vacantes?.length || 0}</span>
                  </button>
                </div>

                <div className="mt-4 h-[50vh] min-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                  {/* Info general */}
                  {activeTab === 'general' && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-md animate-fade-in">
                      <div className="flex items-center gap-2 col-span-2"><FiBriefcase className="text-slate-400" size={14} /><div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Convenio</p><p className="text-sm font-medium text-slate-800 m-0">{detailData.codigo_convenio || 'Sin código'} · {detailData.tipo_convenio || '-'}</p></div></div>
                      <div className="flex items-center gap-2"><FiBriefcase className="text-slate-400" size={14} /><div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Sector</p><p className="text-sm font-medium text-slate-800 m-0">{detailData.industria || '-'}</p></div></div>
                      <div className="flex items-center gap-2"><FiMapPin className="text-slate-400" size={14} /><div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Ubicación</p><p className="text-sm font-medium text-slate-800 m-0">{detailData.ciudad || '-'}{detailData.direccion ? ` - ${detailData.direccion}` : ''}</p></div></div>
                      <div className="flex items-center gap-2"><FiMail className="text-slate-400" size={14} /><div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Correo contacto</p><p className="text-sm text-slate-800 m-0">{detailData.correo_contacto || '-'}</p></div></div>
                      <div className="flex items-center gap-2"><FiPhone className="text-slate-400" size={14} /><div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Teléfono</p><p className="text-sm text-slate-800 m-0">{detailData.telefono || '-'}</p></div></div>
                      {detailData.sitio_web && <div className="flex items-center gap-2 col-span-2"><FiGlobe className="text-slate-400" size={14} /><div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Sitio Web</p><a href={detailData.sitio_web} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">{detailData.sitio_web}</a></div></div>}
                      <div className="col-span-2"><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Representante</p><p className="text-sm font-medium text-slate-800 m-0">{detailData.representante || '-'} ({detailData.correo_representante || '-'})</p></div>
                      <div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Inicio Convenio</p><p className="text-sm font-medium text-slate-800 m-0">{detailData.fecha_inicio_convenio || '-'}</p></div>
                      <div><p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Fecha de registro</p><p className="text-sm font-medium text-slate-800 m-0">{detailData.fecha_registro ? new Date(detailData.fecha_registro).toLocaleDateString('es-EC') : '-'}</p></div>
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
                                      <div className="col-span-2 flex items-center justify-end gap-2 mt-2">
                                        <button onClick={() => openEditSup(sup)} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 cursor-pointer transition-colors text-xs font-semibold">
                                          <FiEdit2 size={12} /> Editar
                                        </button>
                                        <button onClick={() => handleDeleteSupervisor(sup.supervisor_id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 cursor-pointer transition-colors text-xs font-semibold">
                                          <FiTrash2 size={12} /> Eliminar
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
                </div>
              </>
            ) : null}
          </div>
        )}
      </Modal>

      {/* Modals have been integrated inline */}
    </div>
  );
}
