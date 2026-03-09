from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response

class AdminComponent:
    @staticmethod
    def get_user_detail(user_id):
        """Obtener detalle completo de un usuario para el admin."""
        try:
            # Datos base del usuario
            sql_user = """
                SELECT u.user_id, u.login, u.name, u.lastname, u.email, u.phone,
                       r.name as role, u.is_active,
                       TO_CHAR(u.created_at, 'YYYY-MM-DD') as created_at
                FROM public.users u
                JOIN public.roles r ON u.role_id = r.role_id
                WHERE u.user_id = %s
            """
            user_result = DataBaseHandle.getRecords(sql_user, 1, (user_id,))
            if not user_result['result'] or not user_result['data']:
                return internal_response(False, None, "Usuario no encontrado")

            user_data = dict(user_result['data'])

            # Si es estudiante, traer perfil estudiantil + habilidades
            if user_data['role'] == 'student':
                sql_profile = """
                    SELECT sp.profile_id, sp.career, sp.semester, sp.university,
                           sp.experience_summary, sp.interests, sp.curriculum_url
                    FROM public.student_profiles sp
                    WHERE sp.user_id = %s
                """
                profile_result = DataBaseHandle.getRecords(sql_profile, 1, (user_id,))
                if profile_result['result'] and profile_result['data']:
                    user_data['student_profile'] = dict(profile_result['data'])

                    # Habilidades del estudiante
                    sql_skills = """
                        SELECT s.name, ss.level
                        FROM public.student_skills ss
                        JOIN public.skills s ON ss.skill_id = s.skill_id
                        WHERE ss.student_id = %s
                        ORDER BY ss.level DESC
                    """
                    skills_result = DataBaseHandle.getRecords(sql_skills, 0, (profile_result['data']['profile_id'],))
                    if skills_result['result'] and skills_result['data']:
                        user_data['skills'] = [dict(s) for s in skills_result['data']]
                    else:
                        user_data['skills'] = []

                    # Conteo de postulaciones
                    sql_apps = """
                        SELECT 
                            COUNT(*) as total,
                            COUNT(*) FILTER (WHERE status = 'pending') as pending,
                            COUNT(*) FILTER (WHERE status = 'approved') as approved,
                            COUNT(*) FILTER (WHERE status = 'rejected') as rejected
                        FROM public.applications WHERE student_id = %s
                    """
                    apps_result = DataBaseHandle.getRecords(sql_apps, 1, (profile_result['data']['profile_id'],))
                    if apps_result['result'] and apps_result['data']:
                        user_data['applications'] = dict(apps_result['data'])

            # Si es empresa, traer perfil de empresa
            elif user_data['role'] == 'company':
                sql_company = """
                    SELECT cp.company_id, cp.company_name, cp.ruc, cp.industry, 
                           cp.description, cp.website, cp.location, cp.contact_email, cp.status
                    FROM public.company_profiles cp
                    WHERE cp.user_id = %s
                """
                company_result = DataBaseHandle.getRecords(sql_company, 1, (user_id,))
                if company_result['result'] and company_result['data']:
                    user_data['company_profile'] = dict(company_result['data'])

            return internal_response(True, user_data, "Detalle de usuario obtenido")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def get_stats():
        try:
            queries = {
                'total_students': "SELECT COUNT(*) as count FROM public.users u JOIN public.roles r ON u.role_id = r.role_id WHERE r.name = 'student' AND u.is_active = true",
                'total_companies': "SELECT COUNT(*) as count FROM public.users u JOIN public.roles r ON u.role_id = r.role_id WHERE r.name = 'company' AND u.is_active = true",
                'total_vacancies': "SELECT COUNT(*) as count FROM public.vacancies WHERE is_active = true",
                'total_applications': "SELECT COUNT(*) as count FROM public.applications",
                'pending_applications': "SELECT COUNT(*) as count FROM public.applications WHERE status = 'pending'",
                'approved_applications': "SELECT COUNT(*) as count FROM public.applications WHERE status = 'approved'",
                'pending_companies': "SELECT COUNT(*) as count FROM public.company_profiles WHERE status = 'pending'",
            }
            
            stats = {}
            for key, sql in queries.items():
                result = DataBaseHandle.getRecords(sql, 1)
                stats[key] = result['data']['count'] if result['result'] and result['data'] else 0

            return internal_response(True, stats, "Estadísticas obtenidas")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def get_all_companies():
        try:
            sql = """
                SELECT cp.company_id, cp.company_name, cp.ruc, cp.industry, 
                       cp.location, cp.contact_email, cp.status,
                       u.name || ' ' || u.lastname as contact_person,
                       TO_CHAR(u.created_at, 'YYYY-MM-DD') as created_at,
                       (SELECT COUNT(*) FROM public.vacancies v WHERE v.company_id = cp.company_id AND v.is_active = true) as active_vacancies
                FROM public.company_profiles cp
                JOIN public.users u ON cp.user_id = u.user_id
                ORDER BY u.created_at DESC
            """
            result = DataBaseHandle.getRecords(sql, 0)
            if result['result']:
                return internal_response(True, result['data'] or [], "Empresas encontradas")
            return internal_response(False, [], result.get('message', 'Error'))
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, [], str(err))

    @staticmethod
    def update_company_status(company_id, new_status):
        try:
            sql = "UPDATE public.company_profiles SET status = %s WHERE company_id = %s"
            DataBaseHandle.ExecuteNonQuery(sql, (new_status, company_id))
            return internal_response(True, None, "Estado actualizado")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def delete_user(user_id, admin_user_id):
        """Desactivar (soft delete) un usuario por su ID."""
        try:
            # No permitir que el admin se elimine a sí mismo
            if str(user_id) == str(admin_user_id):
                return internal_response(False, None, "No puedes eliminar tu propia cuenta")

            # Verificar que el usuario existe y está activo
            sql_check = "SELECT user_id, is_active FROM public.users WHERE user_id = %s"
            check = DataBaseHandle.getRecords(sql_check, 1, (user_id,))
            if not check['result'] or not check['data']:
                return internal_response(False, None, "Usuario no encontrado")
            if not check['data']['is_active']:
                return internal_response(False, None, "El usuario ya está desactivado")

            # Soft delete: desactivar usuario
            sql = "UPDATE public.users SET is_active = false WHERE user_id = %s"
            result = DataBaseHandle.ExecuteNonQuery(sql, (user_id,))

            if result['result']:
                return internal_response(True, None, "Usuario eliminado exitosamente")
            return internal_response(False, None, result.get('message', 'Error al eliminar usuario'))
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))
