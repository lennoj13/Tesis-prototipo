
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

            sql = """
                SELECT u.usuario_id, u.cedula, u.login, u.contrasena, u.nombre, u.apellido, 
                       u.correo, u.telefono, r.nombre as rol_nombre, r.rol_id,
                       CASE 
                           WHEN r.nombre = 'estudiante' THEN pe.perfil_id
                           WHEN r.nombre = 'empresa' THEN i.institucion_id
                           ELSE NULL 
                       END as perfil_id
                FROM public.usuarios u
                JOIN public.roles r ON u.rol_id = r.rol_id
                LEFT JOIN public.perfiles_estudiante pe ON u.usuario_id = pe.usuario_id AND r.nombre = 'estudiante'
                LEFT JOIN public.instituciones i ON u.usuario_id = i.usuario_id AND r.nombre = 'empresa'
                WHERE (u.cedula = %s OR u.login = %s OR u.correo = %s)
                  AND u.activo = true
            """

            record = (p_user, p_user, p_user)
            login_result = DataBaseHandle.getRecords(sql, 1, record)

            if login_result['result']:
                user_data = login_result.get('data', {})
                if user_data:
                    stored_hash = user_data['contrasena']
                    if bcrypt.checkpw(p_clave.encode('utf-8'), stored_hash.encode('utf-8')):
                        token_data = {
                            'user_id': user_data['usuario_id'],
                            'username': user_data['login'],
                            'role': user_data['rol_nombre'],
                            'role_id': user_data['rol_id'],
                            'name': user_data['nombre'],
                            'lastname': user_data['apellido'],
                            'email': user_data['correo'],
                            'profile_id': user_data['perfil_id']
                        }

                        token = JWTComponent.token_generate(token_data)

                        if token is not None:
                            result = True
                            message = 'Login Exitoso'
                            data = {
                                'token': token,
                                'user_info': {
                                    'user_id': user_data['usuario_id'],
                                    'cedula': user_data['cedula'],
                                    'username': user_data['login'],
                                    'name': user_data['nombre'],
                                    'lastname': user_data['apellido'],
                                    'email': user_data['correo'],
                                    'role': user_data['rol_nombre'],
                                    'role_id': user_data['rol_id'],
                                    'profile_id': user_data['perfil_id']
                                }
                            }
                        else:
                            message = "Error al generar el token de seguridad"
                    else:
                        message = "Credenciales incorrectas"
                else:
                    message = "Credenciales incorrectas"
            else:
                HandleLogs.write_log("Error al ejecutar Login -> " + str(login_result['message']))
                message = "Error en la autenticacion"

        except Exception as err:
            HandleLogs.write_error(err)
            message = 'Error en el Login -> ' + err.__str__()
        finally:
            return internal_response(result, data, message)