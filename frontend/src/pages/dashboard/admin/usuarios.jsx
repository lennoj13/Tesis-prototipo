/**
 * Admin Usuarios — Lista de usuarios con acciones, detalle, crear y toggle estado.
 * Módulo 1: Gestión de Usuarios
 */

import { useState, useEffect, useMemo } from 'react';
import adminService from 'services/adminService';
import PageHeader from 'components/PageHeader';
import DataTable from 'components/DataTable';
import StatusBadge from 'components/StatusBadge';
import Modal from 'components/Modal';
import ConfirmDialog from 'components/ConfirmDialog';
import Input from 'components/Input';
import InfoField from 'components/InfoField';
import { useMetadata } from 'context/MetadataContext';
import { FiEye, FiTrash2, FiEdit2, FiMail, FiPhone, FiBookOpen, FiAward, FiBriefcase, FiLoader, FiUserPlus, FiCreditCard, FiCalendar, FiActivity, FiUsers, FiPlusCircle } from 'react-icons/fi';

const rolLabels = { estudiante: 'Estudiante', student: 'Estudiante', company: 'Empresa', empresa: 'Empresa', admin: 'Admin', gestor: 'Gestor' };
const rolColors = {
  student: 'bg-slate-100 text-slate-700', estudiante: 'bg-slate-100 text-slate-700',
  company: 'bg-slate-100 text-slate-700', empresa: 'bg-slate-100 text-slate-700',
  gestor: 'bg-slate-100 text-slate-700',
  'admin': 'bg-purple-100 text-purple-700',
};

export default function AdminUsuarios() {
  const { facultadesCarreras, facultadNames, metadataLoading } = useMetadata();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [facultadFilter, setFacultadFilter] = useState('');
  const [carreraFilter, setCarreraFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewModal, setViewModal] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  // Crear usuario
  const [createModal, setCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ cedula: '', nombre: '', apellido: '', correo: '', contrasena: '', rol: 'estudiante', telefono: '', facultad_id: '1', carrera_id: '', semestre: '' });

  async function loadUsers() {
    try {
      const res = await adminService.getUsers();
      if (res.result) setUsuarios(res.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const sortedAndFilteredUsers = useMemo(() => {
    let result = [...usuarios].filter(u => {
      if (roleFilter && u.rol_nombre !== roleFilter) return false;
      if (statusFilter === 'activo' && !u.activo) return false;
      if (statusFilter === 'inactivo' && u.activo) return false;
      if (facultadFilter && String(u.facultad_id) !== facultadFilter) return false;
      if (carreraFilter && String(u.carrera_id) !== carreraFilter) return false;
      return true;
    });
    
    // Sort
    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.creado_en) - new Date(b.creado_en));
        break;
      case 'alphaAsc':
        result.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
        break;
      case 'alphaDesc':
        result.sort((a, b) => (b.nombre || '').localeCompare(a.nombre || ''));
        break;
      case 'semAsc':
        result.sort((a, b) => (parseInt(a.semestre) || 0) - (parseInt(b.semestre) || 0));
        break;
      case 'semDesc':
        result.sort((a, b) => (parseInt(b.semestre) || 0) - (parseInt(a.semestre) || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en));
        break;
    }
    
    return result;
  }, [usuarios, roleFilter, statusFilter, facultadFilter, carreraFilter, sortBy]);

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

  // Delete user handling
  async function handleDelete() {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const res = await adminService.deleteUser(deleteTarget.usuario_id);
      if (res.result) {
        setToast({ type: 'success', message: `Usuario "${deleteTarget.nombre} ${deleteTarget.apellido || ''}" eliminado correctamente` });
        loadUsers();
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
      activo: row.activo !== false,
      facultad_id: '1',
      carrera_id: '',
      semestre: '',
    });
    
    try {
      const res = await adminService.getUserDetail(row.usuario_id);
      if (res.result && res.data) {
        setEditForm(prev => ({
          ...prev,
          name: res.data.nombre || prev.name,
          lastname: res.data.apellido || prev.lastname,
          email: res.data.correo || prev.email,
          phone: res.data.telefono || prev.phone,
          cedula: res.data.cedula || prev.cedula,
          activo: res.data.activo !== false,
        }));
        
        if (row.rol_nombre === 'estudiante' && res.data?.perfil_estudiante) {
          setEditForm(prev => ({
            ...prev,
            facultad_id: res.data.perfil_estudiante.facultad_id || '1',
            carrera_id: res.data.perfil_estudiante.carrera_id || '',
            semestre: res.data.perfil_estudiante.semestre || ''
          }));
        } else if (row.rol_nombre === 'gestor' && res.data?.perfil_gestor) {
          setEditForm(prev => ({
            ...prev,
            facultad_id: res.data.perfil_gestor.facultad_id || '1',
            carrera_id: res.data.perfil_gestor.carrera_id || ''
          }));
        }
      }
    } catch (e) {
      console.error("Error loading profile details for edit", e);
    }
  }

  // Guardar edición
  async function saveEdit() {
    const missingFields = [];
    if (!editForm.cedula) missingFields.push('Cédula');
    if (!editForm.name) missingFields.push('Nombre');
    if (!editForm.lastname) missingFields.push('Apellido');
    if (!editForm.email) missingFields.push('Correo');
    if (!editForm.phone) missingFields.push('Teléfono');

    if (missingFields.length > 0) {
      setToast({ type: 'error', message: `Faltan campos obligatorios: ${missingFields.join(', ')}` });
      return;
    }
    
    if (['estudiante', 'gestor', 'admin'].includes(editModal.rol_nombre) && editForm.email && !editForm.email.toLowerCase().endsWith('@ug.edu.ec')) {
      setToast({ type: 'error', message: 'El correo para este rol debe terminar en @ug.edu.ec' });
      return;
    }

    if (editModal.rol_nombre === 'estudiante') {
      if (!editForm.facultad_id || !editForm.carrera_id || !editForm.semestre) {
        setToast({ type: 'error', message: 'Facultad, Carrera y Semestre son obligatorios para Estudiantes' });
        return;
      }
    } else if (editModal.rol_nombre === 'gestor') {
      if (!editForm.facultad_id || !editForm.carrera_id) {
        setToast({ type: 'error', message: 'Facultad y Carrera son obligatorias para Gestores' });
        return;
      }
    }
    setActionLoading(true);
    try {
      const payload = {
        cedula: editForm.cedula,
        nombre: editForm.name,
        apellido: editForm.lastname,
        correo: editForm.email,
        telefono: editForm.phone,
        activo: editForm.activo,
        facultad_id: editForm.facultad_id,
        carrera_id: editForm.carrera_id,
        semestre: editForm.semestre
      };
      const res = await adminService.updateUser(editModal.usuario_id, payload);
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

  // Crear usuario
  async function handleCreateUser() {
    const missingFields = [];
    if (!createForm.cedula) missingFields.push('Cédula');
    if (!createForm.nombre) missingFields.push('Nombre');
    if (!createForm.apellido) missingFields.push('Apellido');
    if (!createForm.correo) missingFields.push('Correo');
    if (!createForm.contrasena) missingFields.push('Contraseña');
    if (!createForm.telefono) missingFields.push('Teléfono');

    if (missingFields.length > 0) {
      setToast({ type: 'error', message: `Faltan campos obligatorios: ${missingFields.join(', ')}` });
      return;
    }
    
    if (['estudiante', 'gestor', 'admin'].includes(createForm.rol) && createForm.correo && !createForm.correo.toLowerCase().endsWith('@ug.edu.ec')) {
      setToast({ type: 'error', message: 'El correo para este rol debe terminar en @ug.edu.ec' });
      return;
    }

    if (createForm.rol === 'estudiante') {
      if (!createForm.facultad_id || !createForm.carrera_id || !createForm.semestre) {
        setToast({ type: 'error', message: 'Facultad, Carrera y Semestre son obligatorios para Estudiantes' });
        return;
      }
    } else if (createForm.rol === 'gestor') {
      if (!createForm.facultad_id || !createForm.carrera_id) {
        setToast({ type: 'error', message: 'Facultad y Carrera son obligatorias para Gestores' });
        return;
      }
    }
    setActionLoading(true);
    try {
      const res = await adminService.createUser(createForm);
      if (res.result) {
        setToast({ type: 'success', message: 'Usuario creado exitosamente' });
        setCreateModal(false);
        setCreateForm({ cedula: '', nombre: '', apellido: '', correo: '', contrasena: '', rol: 'estudiante', telefono: '', carrera_id: '', semestre: '' });
        loadUsers();
      } else {
        setToast({ type: 'error', message: res.message || 'Error al crear usuario' });
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
      key: 'cedula', label: 'Cédula / RUC',
      render: (val) => <span className="text-slate-700">{val || '-'}</span>
    },
    { key: 'creado_en', label: 'F. Registro', render: (val) => val ? new Date(val).toLocaleDateString('es-EC') : '-' },
    {
      key: 'nombre', label: 'Nombre',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0 border ${row.activo ? 'bg-[#3c8dbc] border-[#2f6f92]' : 'bg-slate-400 border-slate-500'}`}>
            {(val || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className={`font-medium m-0 ${row.activo ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{val} {row.apellido || ''}</p>
            <p className="text-xs text-slate-500 m-0">{row.correo}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'rol_nombre', label: 'Rol',
      render: (val) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${rolColors[val] || 'bg-slate-100 text-slate-700'}`}>
          {rolLabels[val] || val}
        </span>
      ),
    },
    { key: 'activo', label: 'Estado', render: (val) => <StatusBadge status={val ? 'activo' : 'inactivo'} /> },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Gestión de Usuarios"
        subtitle={loading ? 'Cargando...' : `${usuarios.length} usuarios registrados`}
        action={
          <button
            onClick={() => setCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-md border-none cursor-pointer transition-colors hover:bg-primary-700"
          >
            <FiUserPlus size={16} /> Crear Usuario
          </button>
        }
      />

      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[9999] px-4 py-3 rounded-md text-sm font-medium flex items-center gap-2 shadow-lg animate-fade-in ${
          toast.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {toast.message}
        </div>
      )}

      <DataTable
        columns={columns}
        data={sortedAndFilteredUsers}
        searchKeys={['nombre', 'correo', 'rol_nombre', 'cedula']}
        filters={
          <>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2 py-1.5 text-xs border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400"
            >
              <option value="">Todos los Roles</option>
              <option value="estudiante">Estudiantes</option>
              <option value="gestor">Gestores</option>
              <option value="empresa">Empresas</option>
              <option value="admin">Administradores</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1.5 text-xs border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400"
            >
              <option value="">Todos los Estados</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>
            <select
              value={facultadFilter}
              onChange={(e) => {
                setFacultadFilter(e.target.value);
                setCarreraFilter('');
              }}
              className="px-2 py-1.5 text-xs border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400 max-w-[140px] truncate"
            >
              <option value="">Todas las Facultades</option>
              {Object.entries(facultadNames).map(([id, name]) => (
                <option key={id} value={id}>{name.toUpperCase()}</option>
              ))}
            </select>
            <select
              value={carreraFilter}
              onChange={(e) => setCarreraFilter(e.target.value)}
              className="px-2 py-1.5 text-xs border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400 max-w-[120px] truncate"
            >
              <option value="">Todas las Carreras</option>
              {facultadFilter && facultadesCarreras[facultadFilter]?.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 py-1.5 text-xs border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="alphaAsc">A-Z</option>
              <option value="alphaDesc">Z-A</option>
              <option value="semAsc">Semestre (Menor a Mayor)</option>
              <option value="semDesc">Semestre (Mayor a Menor)</option>
            </select>
          </>
        }
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
                title="Desactivar usuario"
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
            <div className="grid grid-cols-2 gap-3">
              <InfoField label="Correo" value={detailData?.correo || viewModal.correo} icon={FiMail} variant="default" />
              <InfoField label="Teléfono" value={detailData?.telefono || viewModal.telefono || 'No registrado'} icon={FiPhone} variant="default" />
              <InfoField label="Cédula / RUC" value={detailData?.cedula || viewModal.cedula || 'No registrada'} icon={FiCreditCard} variant="default" />
              <InfoField label="Estado" value={<StatusBadge status={viewModal.activo ? 'activo' : 'inactivo'} />} icon={FiActivity} variant="default" />
              <InfoField label="Registro" value={viewModal.creado_en ? new Date(viewModal.creado_en).toLocaleDateString('es-EC') : '-'} icon={FiCalendar} variant="default" />
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
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <InfoField label="Facultad" value={detailData.perfil_estudiante.facultad || 'No especificada'} variant="default" />
                    <InfoField label="Carrera" value={detailData.perfil_estudiante.carrera || 'No especificada'} variant="default" />
                    <InfoField label="Universidad" value={detailData.perfil_estudiante.universidad || 'Universidad de Guayaquil'} variant="default" />
                    <InfoField label="Semestre" value={detailData.perfil_estudiante.semestre ? `${detailData.perfil_estudiante.semestre}º Semestre` : 'No especificado'} variant="default" />
                    {detailData.perfil_estudiante.intereses && (
                      <InfoField className="col-span-2" label="Intereses" value={detailData.perfil_estudiante.intereses} variant="default" truncate={false} />
                    )}
                    {detailData.perfil_estudiante.resumen_experiencia && (
                      <InfoField className="col-span-2" label="Experiencia" value={detailData.perfil_estudiante.resumen_experiencia} variant="default" truncate={false} />
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

            {/* Gestor Profile Detail */}
            {detailData?.perfil_gestor && (
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiBookOpen size={14} /> Asignación Académica
                </h4>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <InfoField label="Facultad" value={detailData.perfil_gestor.facultad || 'No especificada'} variant="default" />
                  <InfoField label="Carrera" value={detailData.perfil_gestor.carrera || 'No especificada'} variant="default" />
                </div>
              </div>
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
                    <StatusBadge status={viewModal.activo ? 'activo' : 'inactivo'} />
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
            <Input label="Apellido" value={editForm.lastname} onChange={(e) => setEditForm(p => ({...p, lastname: e.target.value}))} />
            <Input label="Correo *" type="email" value={editForm.email} onChange={(e) => setEditForm(p => ({...p, email: e.target.value}))} />
            <Input label="Teléfono *" type="tel" value={editForm.phone} onChange={(e) => setEditForm(p => ({...p, phone: e.target.value}))} />
            
            {(editModal.rol_nombre === 'estudiante' || editModal.rol_nombre === 'gestor') && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Facultad *</label>
                  <select
                    value={editForm.facultad_id}
                    onChange={(e) => setEditForm(p => ({...p, facultad_id: e.target.value, carrera_id: ''}))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400"
                  >
                    <option value="">Seleccione Facultad</option>
                    {Object.entries(facultadNames).map(([id, name]) => (
                      <option key={id} value={id}>{name.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div className={editModal.rol_nombre === 'estudiante' ? '' : 'col-span-2'}>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Carrera *</label>
                  <select
                    value={editForm.carrera_id}
                    onChange={(e) => setEditForm(p => ({...p, carrera_id: e.target.value}))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400"
                  >
                    <option value="">Seleccione carrera...</option>
                    {editForm.facultad_id && facultadesCarreras[editForm.facultad_id]?.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
                {editModal.rol_nombre === 'estudiante' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Semestre *</label>
                    <select
                      value={editForm.semestre}
                      onChange={(e) => setEditForm(p => ({...p, semestre: e.target.value}))}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400"
                    >
                      <option value="">Seleccione...</option>
                      {[1,2,3,4,5,6,7,8,9,10].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}
              </div>
            )}

            {editModal.rol_nombre !== 'admin' && (
              <div className="flex items-center gap-3 py-3 border-t border-slate-100">
                <button
                  className={`w-10 h-5 rounded-full relative transition-colors ${editForm.activo ? 'bg-green-500' : 'bg-slate-300'}`}
                  onClick={() => setEditForm(p => ({...p, activo: !p.activo}))}
                >
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${editForm.activo ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800">Cuenta Activa</span>
                  <span className="text-[10px] text-slate-500 leading-tight">Si se desactiva, el usuario no podrá iniciar sesión.</span>
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-3 mt-4">
              <button className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-md" onClick={() => setEditModal(null)}>Cancelar</button>
              <button className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md flex items-center justify-center min-w-[100px]" onClick={saveEdit} disabled={actionLoading}>
                {actionLoading ? <FiLoader className="animate-spin" /> : 'Guardar'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create User Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Crear Nuevo Usuario" size="sm">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Rol *</label>
            <select
              value={createForm.rol}
              onChange={(e) => setCreateForm(p => ({...p, rol: e.target.value}))}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400 focus:ring-2 focus:ring-[var(--color-header-bg)]"
            >
              <option value="estudiante">Estudiante</option>
              <option value="gestor">Gestor PPP</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <Input label="Cédula *" value={createForm.cedula} onChange={(e) => setCreateForm(p => ({...p, cedula: e.target.value}))} placeholder="0900000000" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nombre *" value={createForm.nombre} onChange={(e) => setCreateForm(p => ({...p, nombre: e.target.value}))} />
            <Input label="Apellido *" value={createForm.apellido} onChange={(e) => setCreateForm(p => ({...p, apellido: e.target.value}))} />
          </div>
          <Input label="Correo Electrónico *" type="email" value={createForm.correo} onChange={(e) => setCreateForm(p => ({...p, correo: e.target.value}))} placeholder="correo@ejemplo.com" />
          <Input label="Contraseña *" type="password" value={createForm.contrasena} onChange={(e) => setCreateForm(p => ({...p, contrasena: e.target.value}))} />
          <Input label="Teléfono *" type="tel" value={createForm.telefono} onChange={(e) => setCreateForm(p => ({...p, telefono: e.target.value}))} />


          {(createForm.rol === 'estudiante' || createForm.rol === 'gestor') && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Facultad *</label>
                <select
                  value={createForm.facultad_id || '1'}
                  onChange={(e) => setCreateForm(p => ({...p, facultad_id: e.target.value, carrera_id: ''}))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400"
                >
                  <option value="">Seleccione Facultad</option>
                  {Object.entries(facultadNames).map(([id, name]) => (
                    <option key={id} value={id}>{name.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div className={createForm.rol === 'estudiante' ? '' : 'col-span-2'}>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Carrera *</label>
                <select
                  value={createForm.carrera_id || ''}
                  onChange={(e) => setCreateForm(p => ({...p, carrera_id: e.target.value}))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400"
                >
                  <option value="">Seleccione...</option>
                  {(createForm.facultad_id || '1') && facultadesCarreras[createForm.facultad_id || '1']?.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              {createForm.rol === 'estudiante' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Semestre *</label>
                  <select
                    value={createForm.semestre || ''}
                    onChange={(e) => setCreateForm(p => ({...p, semestre: e.target.value}))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-white outline-none focus:border-primary-400"
                  >
                    <option value="">Seleccione...</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-md cursor-pointer" onClick={() => setCreateModal(false)}>Cancelar</button>
            <button
              className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md flex items-center justify-center min-w-[120px] cursor-pointer disabled:opacity-50"
              onClick={handleCreateUser}
              disabled={actionLoading || !createForm.cedula || !createForm.nombre || !createForm.apellido || !createForm.correo || !createForm.contrasena}
            >
              {actionLoading ? <FiLoader className="animate-spin" /> : 'Crear Usuario'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Desactivar Usuario"
        message={deleteTarget ? `¿Estás seguro de que deseas desactivar a "${deleteTarget.nombre} ${deleteTarget.apellido || ''}"? El usuario ya no tendrá acceso al sistema, pero sus registros se conservarán (eliminación lógica).` : ''}
        confirmText={actionLoading ? 'Desactivando...' : 'Desactivar'}
      />
    </div>
  );
}
