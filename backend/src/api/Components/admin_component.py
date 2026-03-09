from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response

class AdminComponent:
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
