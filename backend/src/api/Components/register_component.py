from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response
import bcrypt

class RegisterComponent:
    @staticmethod
    def register_user(login, password, name, lastname, email, phone, role_name):
        try:
            result = False
            data = None
            message = None

            # Verificar que el email no exista
            sql_check = "SELECT user_id FROM public.users WHERE email = %s OR login = %s"
            check = DataBaseHandle.getRecords(sql_check, 1, (email, login))
            if check['result'] and check['data']:
                message = "El email o usuario ya está registrado"
                return internal_response(result, data, message)

            # Obtener role_id
            sql_role = "SELECT role_id FROM public.roles WHERE name = %s"
            role_result = DataBaseHandle.getRecords(sql_role, 1, (role_name,))
            if not role_result['result'] or not role_result['data']:
                message = "Rol no válido"
                return internal_response(result, data, message)

            role_id = role_result['data']['role_id']

            # Hash de la contraseña
            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

            # Insertar usuario
            sql_user = """
                INSERT INTO public.users (login, password, name, lastname, email, phone, role_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING user_id
            """
            user_result = DataBaseHandle.ExecuteNonQuery(sql_user, (
                login, hashed.decode('utf-8'), name, lastname, email, phone, role_id
            ))

            if user_result['result']:
                user_id = user_result['data']

                # Crear perfil según el rol
                if role_name == 'student':
                    sql_profile = """
                        INSERT INTO public.student_profiles (user_id, university)
                        VALUES (%s, 'Universidad de Guayaquil')
                        RETURNING profile_id
                    """
                    DataBaseHandle.ExecuteNonQuery(sql_profile, (user_id,))
                elif role_name == 'company':
                    sql_profile = """
                        INSERT INTO public.company_profiles (user_id, company_name, contact_email)
                        VALUES (%s, %s, %s)
                        RETURNING company_id
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
