
from ...api.Components.jwt_component import JWTComponent
from ...utils.general.logs import HandleLogs
from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.response import internal_response
import bcrypt

class LoginComponent:
    @staticmethod
    def Login(p_user, p_clave):
        try:
            data = None
            message = None
            result = None

            # Buscar usuario por login o email
            sql = """
                SELECT u.user_id, u.login, u.password, u.name, u.lastname, 
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
                WHERE (u.login = %s OR u.email = %s)
                  AND u.is_active = true
            """

            record = (p_user, p_user)
            login_result = DataBaseHandle.getRecords(sql, 1, record)

            if login_result['result']:
                user_data = login_result.get('data', {})
                if user_data:
                    # Verificar contraseña con bcrypt
                    stored_hash = user_data['password']
                    if bcrypt.checkpw(p_clave.encode('utf-8'), stored_hash.encode('utf-8')):
                        # Generar token
                        token_data = {
                            'user_id': user_data['user_id'],
                            'username': user_data['login'],
                            'role': user_data['role_name'],
                            'role_id': user_data['role_id'],
                            'name': user_data['name'],
                            'lastname': user_data['lastname'],
                            'email': user_data['email'],
                            'profile_id': user_data['profile_id']
                        }

                        token = JWTComponent.token_generate(token_data)

                        if token is not None:
                            result = True
                            message = 'Login Exitoso'
                            data = {
                                'token': token,
                                'user_info': {
                                    'user_id': user_data['user_id'],
                                    'username': user_data['login'],
                                    'name': user_data['name'],
                                    'lastname': user_data['lastname'],
                                    'email': user_data['email'],
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
                    message = "Usuario o contraseña incorrectos"
            else:
                HandleLogs.write_log("Error al ejecutar Login -> " + str(login_result['message']))
                message = "Error en la autenticación"

        except Exception as err:
            HandleLogs.write_error(err)
            message = 'Error en el Login -> ' + err.__str__()
        finally:
            return internal_response(result, data, message)