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
                SELECT u.usuario_id, u.cedula, u.login, u.nombre, u.apellido, u.correo, u.telefono, 
                       r.nombre as rol_nombre, u.activo, pe.semestre,
                       TO_CHAR(u.creado_en, 'YYYY-MM-DD') as creado_en
                FROM public.usuarios u
                JOIN public.roles r ON u.rol_id = r.rol_id
                LEFT JOIN public.perfiles_estudiante pe ON u.usuario_id = pe.usuario_id
                ORDER BY u.creado_en DESC
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
                SELECT u.usuario_id, u.cedula, u.login, u.nombre, u.apellido, 
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
                WHERE u.usuario_id = %s 
                  AND u.activo = true
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
