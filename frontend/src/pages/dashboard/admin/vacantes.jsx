/**
 * Admin Vacantes — Lista real de vacantes del sistema.
 * Módulo 3: Gestión de Vacantes (vista admin)
 */
import VacantesListView from 'components/VacantesListView';

export default function AdminVacantes() {
  return <VacantesListView title="Gestión de Vacantes" showFacultyFilter canDelete />;
}