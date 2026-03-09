from ...utils.database.connection_db import HandleLogs, DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...api.Components.jwt_component import JWTComponent

class UserComponent:
    @staticmethod
    def get_all_user():
        try:
            result = False
            data = None
            message = None

            sql = """
                SELECT u.user_id, u.login, u.name, u.lastname, u.email, u.phone, 
                       r.name as role_name, u.is_active,
                       TO_CHAR(u.created_at, 'YYYY-MM-DD') as created_at
                FROM public.users u
                JOIN public.roles r ON u.role_id = r.role_id
                WHERE u.is_active = true
                ORDER BY u.created_at DESC
            """

            result_user = DataBaseHandle.getRecords(sql, 0)
            if result_user and result_user.get('result', False):
                result = True
                data = result_user.get('data', [])
            else:
                message = result_user.get('message', 'No se encontraron usuarios.')
        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error al buscar usuarios: " + str(err)
        finally:
            return {"result": result, "data": data, "message": message}

    @staticmethod
    def get_user_by_id(user_id):
        try:
            result = False
            data = None
            message = None

            sql = """
                SELECT u.user_id, u.login, u.name, u.lastname, 
                       u.email, u.phone, r.name as role_name, r.role_id,
                       CASE 
                           WHEN r.name = 'student' THEN sp.profile_id
                           WHEN r.name = 'company' THEN cp.company_id
                           ELSE NULL 
                       END as profile_id
                FROM public.users u
                JOIN public.roles r ON u.role_id = r.role_id
                LEFT JOIN public.student_profiles sp ON u.user_id = sp.user_id AND r.name = 'student'
                LEFT JOIN public.company_profiles cp ON u.user_id = cp.user_id AND r.name = 'company'
                WHERE u.user_id = %s 
                  AND u.is_active = true
            """

            record = (user_id,)
            user_result = DataBaseHandle.getRecords(sql, 1, record)

            if user_result['result'] and user_result.get('data'):
                result = True
                data = UserComponent.clean_datetime(user_result['data'])
            else:
                message = "Usuario no encontrado"

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error al buscar usuario: " + str(err)
        finally:
            return {"result": result, "data": data, "message": message}

    @staticmethod
    def clean_datetime(user_dit):
        cleaned_user = {}
        for key, value in user_dit.items():
            if value is None:
                cleaned_user[key] = None
            elif hasattr(value, 'isoformat'):
                cleaned_user[key] = value.isoformat()
            else:
                cleaned_user[key] = value
        return cleaned_user
