
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
                SELECT u.usuario_id, u.cedula, u.contrasena, u.nombre, u.apellido, 
                       u.correo, u.telefono, r.nombre as rol_nombre, r.rol_id, u.activo,
                       CASE 
                           WHEN r.nombre = 'estudiante' THEN pe.perfil_id
                           WHEN r.nombre = 'gestor' THEN pg.perfil_id
                           WHEN r.nombre = 'empresa' THEN i.institucion_id
                           ELSE NULL 
                       END as perfil_id,
                       CASE 
                           WHEN r.nombre = 'estudiante' THEN pe.facultad_id
                           WHEN r.nombre = 'gestor' THEN pg.facultad_id
                           ELSE NULL
                       END as facultad_id,
                       CASE 
                           WHEN r.nombre = 'estudiante' THEN pe.carrera_id
                           WHEN r.nombre = 'gestor' THEN pg.carrera_id
                           ELSE NULL
                       END as carrera_id,
                       f.nombre as facultad_nombre
                FROM public.usuarios u
                JOIN public.roles r ON u.rol_id = r.rol_id
                LEFT JOIN public.perfiles_estudiante pe ON u.usuario_id = pe.usuario_id AND r.nombre = 'estudiante'
                LEFT JOIN public.perfiles_gestor pg ON u.usuario_id = pg.usuario_id AND r.nombre = 'gestor'
                LEFT JOIN public.instituciones i ON u.usuario_id = i.usuario_id AND r.nombre = 'empresa'
                LEFT JOIN public.facultades f ON f.facultad_id = (
                    CASE 
                        WHEN r.nombre = 'estudiante' THEN pe.facultad_id
                        WHEN r.nombre = 'gestor' THEN pg.facultad_id
                        ELSE NULL
                    END
                )
                WHERE u.cedula = %s OR u.correo = %s
            """

            record = (p_user, p_user)
            login_result = DataBaseHandle.getRecords(sql, 1, record)

            if login_result['result']:
                user_data = login_result.get('data', {})
                if user_data:
                    if not user_data['activo']:
                        result = False
                        message = "Su cuenta ha sido deshabilitada."
                    else:
                        stored_hash = user_data['contrasena']
                        if bcrypt.checkpw(p_clave.encode('utf-8'), stored_hash.encode('utf-8')):
                            token_data = {
                                'user_id': user_data['usuario_id'],
                                'role': user_data['rol_nombre'],
                                'role_id': user_data['rol_id'],
                                'name': user_data['nombre'],
                                'lastname': user_data['apellido'],
                                'email': user_data['correo'],
                                'profile_id': user_data['perfil_id'],
                                'facultad_id': user_data['facultad_id'],
                                'facultad_nombre': user_data['facultad_nombre'],
                                'carrera_id': user_data['carrera_id']
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
                                        'name': user_data['nombre'],
                                        'lastname': user_data['apellido'],
                                        'email': user_data['correo'],
                                        'role': user_data['rol_nombre'],
                                        'role_id': user_data['rol_id'],
                                        'profile_id': user_data['perfil_id'],
                                        'facultad_id': user_data['facultad_id'],
                                        'facultad_nombre': user_data['facultad_nombre'],
                                        'carrera_id': user_data['carrera_id']
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