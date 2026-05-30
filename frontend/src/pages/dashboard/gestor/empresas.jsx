import { useState, useEffect } from 'react';
import PageHeader from 'components/PageHeader';
import StatusBadge from 'components/StatusBadge';
import Card from 'components/Card';
import EmptyState from 'components/EmptyState';
import adminService from 'services/adminService';

export default function GestorEmpresas() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  async function loadCompanies() {
    try {
      const response = await adminService.getCompanies();
      if (response.result) {
        setCompanies(response.data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Empresas Registradas"
        subtitle="Empresas con convenio para practicas preprofesionales"
      />

      {loading ? (
        <Card>
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            Cargando empresas...
          </div>
        </Card>
      ) : companies.length === 0 ? (
        <EmptyState
          variant="dashed"
          message="No hay empresas registradas"
        />
      ) : (
        <div className="grid gap-4 mt-6">
          {companies.map((company) => (
            <Card key={company.institucion_id} padding="md" hover>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">{company.nombre_empresa}</h3>
                  <p className="text-sm text-slate-500">RUC: {company.ruc || '-'} | Industria: {company.industria || '-'}</p>
                  <p className="text-sm text-slate-500">Contacto: {company.persona_contacto || '-'} | {company.correo_contacto || '-'}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Vacantes activas: <span className="font-bold">{company.vacantes_activas || 0}</span>
                    {' | '}Supervisores: <span className="font-bold">{company.total_supervisores || 0}</span>
                  </p>
                </div>
                <StatusBadge status={company.estado} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
