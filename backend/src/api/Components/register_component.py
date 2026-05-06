from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response
import bcrypt

class RegisterComponent:
    @staticmethod
    def register_user(login, password, name, lastname, email, phone, role_name, cedula=None):
        try:
            result = False
            data = None
            message = None

            sql_check = "SELECT usuario_id FROM public.usuarios WHERE correo = %s OR login = %s"
            check = DataBaseHandle.getRecords(sql_check, 1, (email, login))
            if check['result'] and check['data']:
                message = "El email o usuario ya está registrado"
                return internal_response(result, data, message)

            if cedula:
                sql_cedula = "SELECT usuario_id FROM public.usuarios WHERE cedula = %s"
                check_ced = DataBaseHandle.getRecords(sql_cedula, 1, (cedula,))
                if check_ced['result'] and check_ced['data']:
                    message = "La cédula ya está registrada"
                    return internal_response(result, data, message)

            sql_role = "SELECT rol_id FROM public.roles WHERE nombre = %s"
            role_result = DataBaseHandle.getRecords(sql_role, 1, (role_name,))
            if not role_result['result'] or not role_result['data']:
                message = "Rol no válido"
                return internal_response(result, data, message)

            role_id = role_result['data']['rol_id']
            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

            sql_user = """
                INSERT INTO public.usuarios (cedula, login, contrasena, nombre, apellido, correo, telefono, rol_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING usuario_id
            """
            user_result = DataBaseHandle.ExecuteNonQuery(sql_user, (
                cedula, login, hashed.decode('utf-8'), name, lastname, email, phone, role_id
            ))

            if user_result['result']:
                user_id = user_result['data']

                if role_name == 'estudiante':
                    sql_carrera = "SELECT carrera_id FROM public.carreras WHERE codigo = 'SW' LIMIT 1"
                    carrera_result = DataBaseHandle.getRecords(sql_carrera, 1)
                    carrera_id = carrera_result['data']['carrera_id'] if carrera_result['result'] and carrera_result['data'] else None

                    sql_profile = """
                        INSERT INTO public.perfiles_estudiante (usuario_id, carrera_id, universidad)
                        VALUES (%s, %s, 'Universidad de Guayaquil')
                        RETURNING perfil_id
                    """
                    DataBaseHandle.ExecuteNonQuery(sql_profile, (user_id, carrera_id))
                elif role_name == 'empresa':
                    sql_profile = """
                        INSERT INTO public.instituciones (usuario_id, nombre, correo_contacto, estado)
                        VALUES (%s, %s, %s, 'pendiente')
                        RETURNING institucion_id
                    """
                    DataBaseHandle.ExecuteNonQuery(sql_profile, (user_id, name, email))

                result = True
                data = {'user_id': user_id}
                message = "Usuario registrado exitosamente"
            else:
                message = user_result.get('message', 'Error al registrar usuario')

        except Exception as err:
            HandleLogs.write_error(err)
            message = 'Error en el registro -> ' + str(err)
        
        return internal_response(result, data, message)
