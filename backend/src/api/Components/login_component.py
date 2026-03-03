
from ...api.Components.jwt_component import JWTComponent
from ...utils.general.logs import HandleLogs
from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.response import internal_response

class LoginComponent:
    @staticmethod
    def Login(p_user, p_clave):
        try:
            data = None
            message = None
            result = None

            #consulta user
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
                WHERE u.u_login = %s 
                  AND u.u_password = %s 
                  AND u.u_state = true
            """

            record = (p_user, p_clave)
            login_result = DataBaseHandle.getRecords(sql, 1, record)

            if login_result['result']:
                user_data = login_result.get('data', {})
                if user_data:
                    # Generar token con información del usuario
                    token_data = {
                        'user_id': user_data['u_id'],
                        'username': user_data['u_login'],
                        'role': user_data['role_name'],
                        'role_id': user_data['role_id'],
                        'name': user_data['u_name'],
                        'lastname': user_data['u_lastname'],
                        'email': user_data['u_email'],
                        'profile_id': user_data['profile_id']
                    }

                    token = JWTComponent.token_generate(token_data)

                    if token is not None:
                        result = True
                        message = 'Login Exitoso'
                        data = {
                            'token': token,
                            'user_info': {
                                'user_id': user_data['u_id'],
                                'username': user_data['u_login'],
                                'name': user_data['u_name'],
                                'lastname': user_data['u_lastname'],
                                'email': user_data['u_email'],
                                'role': user_data['role_name'],
                                'role_id': user_data['role_id'],
                                'profile_id': user_data['profile_id']
                            }
                        }
                    else:
                        message = "Error al generar el token de seguridad"
                else:
                    message = "Usuario o contraseña incorrectos"
            else:
                HandleLogs.write_log("Error al ejecutar Login -> " + login_result['message'])
                message = "Error en la autenticación"

        except Exception as err:
            HandleLogs.write_error(err)
            message = 'Error en el Login -> ' + err.__str__()
        finally:
            return internal_response(result, data, message)