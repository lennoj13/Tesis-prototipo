
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
import adminService from 'services/adminService';
import { FiSearch, FiEye, FiUsers, FiBriefcase, FiMapPin, FiMail, FiPhone, FiGlobe, FiLoader } from 'react-icons/fi';

export default function GestorEmpresas() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  // Detalle
  const [viewModal, setViewModal] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => { loadCompanies(); }, []);

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

      {/* Barra de búsqueda */}
      <div className="mb-5 mt-2">
        <div className="relative max-w-sm">
          <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, RUC o sector..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-md bg-white outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-[var(--color-header-bg)] placeholder:text-slate-400"
          />
        </div>
      </div>

      {loading ? (
        <Card>
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            Cargando empresas...
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <EmptyState
          variant="dashed"
          message={search ? 'No se encontraron empresas con esa búsqueda' : 'No hay empresas registradas'}
        />
      ) : (
        <div className="grid gap-4">
          {filtered.map((company) => (
            <Card key={company.institucion_id} padding="md" hover onClick={() => handleViewDetail(company)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-md bg-primary-50 text-primary-600 flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {(company.nombre_empresa || '?').charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-1 flex items-center gap-2">
                      {company.nombre_empresa}
                      <FiEye size={14} className="text-slate-300" />
                    </h3>
                    <p className="text-sm text-slate-500">RUC: {company.ruc || '-'} | Industria: {company.industria || '-'}</p>
                    <p className="text-sm text-slate-500">Contacto: {company.persona_contacto || '-'} | {company.correo_contacto || '-'}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Vacantes activas: <span className="font-bold text-primary-600">{company.vacantes_activas || 0}</span>
                      {' | '}Supervisores: <span className="font-bold text-primary-600">{company.total_supervisores || 0}</span>
                    </p>
                  </div>
                </div>
                <StatusBadge status={company.estado} />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Modal isOpen={!!viewModal} onClose={() => { setViewModal(null); setDetailData(null); }} title="Detalle de Empresa" size="lg">
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
              <div className="ml-auto"><StatusBadge status={viewModal.estado || 'pendiente'} /></div>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
                <FiLoader className="animate-spin" size={18} />
                <span className="text-sm">Cargando información detallada...</span>
              </div>
            ) : detailData ? (
              <>
                {/* Info general */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-md">
                  <div className="flex items-center gap-2">
                    <FiBriefcase className="text-slate-400" size={14} />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Sector</p>
                      <p className="text-sm font-medium text-slate-800 m-0">{detailData.industria || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-slate-400" size={14} />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Ubicación</p>
                      <p className="text-sm font-medium text-slate-800 m-0">{detailData.ciudad || '-'}{detailData.direccion ? ` - ${detailData.direccion}` : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMail className="text-slate-400" size={14} />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Correo contacto</p>
                      <p className="text-sm text-slate-800 m-0">{detailData.correo_contacto || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-slate-400" size={14} />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Teléfono</p>
                      <p className="text-sm text-slate-800 m-0">{detailData.telefono || '-'}</p>
                    </div>
                  </div>
                  {detailData.sitio_web && (
                    <div className="flex items-center gap-2 col-span-2">
                      <FiGlobe className="text-slate-400" size={14} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Sitio Web</p>
                        <a href={detailData.sitio_web} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">{detailData.sitio_web}</a>
                      </div>
                    </div>
                  )}
                  <div className="col-span-2">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Representante</p>
                    <p className="text-sm font-medium text-slate-800 m-0">{detailData.representante || '-'} ({detailData.correo_representante || '-'})</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold m-0">Fecha de registro</p>
                    <p className="text-sm font-medium text-slate-800 m-0">{detailData.fecha_registro ? new Date(detailData.fecha_registro).toLocaleDateString('es-EC') : '-'}</p>
                  </div>
                </div>

                {/* Supervisores */}
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiUsers size={14} /> Supervisores Registrados ({detailData.supervisores?.length || 0})
                  </h4>
                  {detailData.supervisores?.length > 0 ? (
                    <div className="grid gap-2">
                      {detailData.supervisores.map(sup => (
                        <div key={sup.supervisor_id} className={`flex items-center justify-between p-3.5 rounded-md border ${sup.activo ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 m-0">{sup.nombre}</p>
                            <p className="text-xs text-slate-500 m-0">
                              {sup.cargo || 'Sin cargo'}{sup.departamento ? ` · ${sup.departamento}` : ''}
                            </p>
                            <p className="text-xs text-slate-400 m-0 mt-0.5">
                              {sup.numero_identificacion && `CI: ${sup.numero_identificacion}`}
                              {sup.correo ? ` · ${sup.correo}` : ''}
                              {sup.telefono ? ` · ${sup.telefono}` : ''}
                            </p>
                          </div>
                          <StatusBadge status={sup.activo ? 'activo' : 'inactivo'} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic m-0 py-2">No hay supervisores registrados en esta empresa</p>
                  )}
                </div>

                {/* Vacantes */}
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiBriefcase size={14} /> Vacantes ({detailData.vacantes?.length || 0})
                  </h4>
                  {detailData.vacantes?.length > 0 ? (
                    <div className="grid gap-2">
                      {detailData.vacantes.map(vac => (
                        <div key={vac.vacante_id} className={`flex items-center justify-between p-3.5 rounded-md border ${vac.activo ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 m-0">{vac.titulo}</p>
                            <p className="text-xs text-slate-500 m-0">{vac.area || '-'} · {vac.modalidad} · {vac.ubicacion || '-'}</p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md">{vac.total_postulaciones} postulaciones</span>
                            <StatusBadge status={vac.activo ? 'activo' : 'inactivo'} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic m-0 py-2">No hay vacantes registradas</p>
                  )}
                </div>
              </>
            ) : null}
          </div>
        )}
      </Modal>
    </div>
  );
}
