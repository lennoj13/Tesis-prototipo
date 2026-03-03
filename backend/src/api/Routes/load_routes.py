from ..Services.login_service import LoginService
from ..Services.post_service import PostService
from ..Services.user_service import UserService, CurrentUserService
from ..Services.comment_service import (CommentService)
#agregando password
from ..Services.password_service import ForgotPasswordService, ResetPasswordService
from ..Services.vacancy_services import VacancyService, VacancyCatalogService
from ..Services.profile_service import ProfileService, PublicProfileService
from ..Services.skills_service import SkillListService

def load_routes(api):
    api.add_resource(LoginService, '/security/login')
    api.add_resource(UserService, '/user/list')
    api.add_resource(CurrentUserService, '/security/current-user')  # Nueva ruta
    api.add_resource(PostService, '/post')
    #Rutas para mensajes
    api.add_resource(CommentService, '/comment')
    api.add_resource(CommentService, '/comment/<int:post_id>', endpoint='get_comments')
    #Agregadas para recuperar contraseña::
    api.add_resource(ForgotPasswordService, '/security/forgot-password')
    api.add_resource(ResetPasswordService, '/security/reset-password')
    #Agregadas para
    api.add_resource(VacancyService, '/vacancies')
    api.add_resource(VacancyCatalogService, '/vacancies/catalog')
    #perfil
    api.add_resource(ProfileService, '/user/profile')
    api.add_resource(PublicProfileService, '/user/profile/<int:user_id>')
    #Habilidades
    api.add_resource(SkillListService, '/skills')