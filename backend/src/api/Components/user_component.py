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

            #sql = "SELECT * FROM dawa.tb_user WHERE u_state = true"
            sql = """
                    SELECT u_id, u_login, u_name, u_lastname, u_email, u_phone, 
                           role_id, u_state, u_profile_picture,
                           TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                           TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at
                    FROM dawa.tb_user 
                    WHERE u_state = true
            """

            result_user = DataBaseHandle.getRecords(sql, 0)
            if result_user and result_user.get('result', False):
                result = True
                data = result_user.get('data', [])
            else:
                message = result_user.get('message', 'No se encontraron usuarios.')
        except Exception as err:
            HandleLogs.write_log("Error al buscar usuarios: " + str(err))
            HandleLogs.write_error(err)
            message = "Ocurrió un error al buscar usuarios: " + err.__str__()
        finally:
            return {"result": result, "data": data, "message": message}


    @staticmethod
    def get_user_by_id(user_id):
        try:
            result = False
            data = None
            message = None

            sql = """
                   SELECT u.u_id, u.u_login, u.u_name, u.u_lastname, 
                          u.u_email, r.name as role_name, r.role_id,
                          CASE 
                              WHEN r.name = 'student' THEN sp.profile_id
                              WHEN r.name = 'company' THEN cp.company_id
                              ELSE NULL 
                          END as profile_id
                   FROM dawa.tb_user u
                   LEFT JOIN dawa.tb_role r ON u.role_id = r.role_id
                   LEFT JOIN dawa.tb_student_profile sp ON u.u_id = sp.user_id AND r.name = 'student'
                   LEFT JOIN dawa.tb_company_profile cp ON u.u_id = cp.user_id AND r.name = 'company'
                   WHERE u.u_id = %s 
                     AND u.u_state = true
               """

            record = (user_id,)
            user_result = DataBaseHandle.getRecords(sql, 1, record)

            if user_result['result']:
                # Verifica si DataBaseHandle.getRecords retorna directamente los datos
                # o si necesitas acceder a 'data' dentro del resultado
                if 'data' in user_result:
                    user_data = user_result.get('data', {})
                else:
                    user_data = user_result  # o podría ser user_result.get('records', {})

                if user_data:
                    result = True
                    #data = user_data
                    #setear los datetime como strings
                    data = UserComponent.clean_datetime(user_data)
                else:
                    message = "Usuario no encontrado"
            else:
                message = user_result.get('message', 'Error al buscar usuario.')

        except Exception as err:
            HandleLogs.write_log("Error al buscar usuario por ID: " + str(err))
            HandleLogs.write_error(err)
            message = "Ocurrió un error al buscar el usuario: " + err.__str__()
        finally:
            return {"result": result, "data": data, "message": message}

    @staticmethod
    def clean_datetime(user_dit):
        cleaned_user ={}
        for key, value in user_dit.items():
            if value is None:
                cleaned_user[key] = None
            elif hasattr(value, 'isoformat'):
                cleaned_user[key] = value.isoformat()
            else:
                cleaned_user[key] = value
        return cleaned_user
