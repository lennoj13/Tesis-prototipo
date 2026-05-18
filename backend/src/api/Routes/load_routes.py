from ..Services.login_service import LoginService

from ..Services.user_service import UserService, CurrentUserService
from ..Services.vacancy_services import VacancyService, VacancyCatalogService, VacancyDetailService
from ..Services.profile_service import ProfileService, PublicProfileService
from ..Services.skills_service import SkillListService
from ..Services.application_service import ApplicationService, ApplicationStatusService, ApplicationSolicitudService
from ..Services.admin_service import AdminStatsService, AdminCompanyService, AdminCompanyStatusService, AdminDeleteUserService, AdminUserDetailService, AdminReportsService
from ..Services.matching_service import MatchingCandidatesService

def load_routes(api):
    # === Autenticación ===
    api.add_resource(LoginService, '/security/login')

    api.add_resource(CurrentUserService, '/security/current-user')

    # === Usuarios ===
    api.add_resource(UserService, '/user/list')

    # === Perfiles ===
    api.add_resource(ProfileService, '/user/profile')
    api.add_resource(PublicProfileService, '/user/profile/<int:user_id>')

    # === Vacantes ===
    api.add_resource(VacancyService, '/vacancies')
    api.add_resource(VacancyCatalogService, '/vacancies/catalog')
    api.add_resource(VacancyDetailService, '/vacancies/<int:vacancy_id>')

    # === Postulaciones ===
    api.add_resource(ApplicationService, '/applications')
    api.add_resource(ApplicationStatusService, '/applications/<int:application_id>')
    api.add_resource(ApplicationSolicitudService, '/applications/<int:application_id>/solicitud')

    # === Habilidades ===
    api.add_resource(SkillListService, '/skills')

    # === Admin ===
    api.add_resource(AdminStatsService, '/admin/stats')
    api.add_resource(AdminCompanyService, '/admin/companies')
    api.add_resource(AdminCompanyStatusService, '/admin/companies/<int:company_id>/status')
    api.add_resource(AdminDeleteUserService, '/admin/users/<int:user_id>')
    api.add_resource(AdminUserDetailService, '/admin/users/<int:user_id>/detail')

    # === Matching ===
    api.add_resource(MatchingCandidatesService, '/matching/candidates')

    # === Reportes ===
    api.add_resource(AdminReportsService, '/admin/reports')