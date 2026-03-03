# .../api/Components/password_component.py
from ...utils.general.logs import HandleLogs
from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.response import internal_response
import secrets
import hashlib
from datetime import datetime, timedelta
import pytz


class PasswordComponent:
    @staticmethod
    def initiate_password_reset(email):
        try:
            # Verificar si el email existe
            sql = "SELECT u_id, u_login FROM dawa.tb_user WHERE u_email = %s AND u_state = true"
            user_result = DataBaseHandle.getRecords(sql, 1, (email,))

            if not user_result['result'] or not user_result['data']:
                return internal_response(False, None, "No se encontró una cuenta con ese correo electrónico")

            user_data = user_result['data']

            # Generar token de recuperación
            reset_token = secrets.token_urlsafe(32)
            timezone = pytz.timezone('America/Guayaquil')
            expires_at = datetime.now(tz=timezone) + timedelta(hours=1)

            # Guardar token en la base de datos (podrías crear una tabla para esto)
            sql_insert = """
                INSERT INTO dawa.tb_password_reset 
                (user_id, reset_token, expires_at, used) 
                VALUES (%s, %s, %s, false)
                ON CONFLICT (user_id) 
                DO UPDATE SET reset_token = %s, expires_at = %s, used = false
            """
            params = (
                user_data['u_id'],
                reset_token,
                expires_at,
                reset_token,
                expires_at
            )

            # Crear tabla si no existe (ejecutar esto una vez)
            # CREATE TABLE dawa.tb_password_reset (
            #     reset_id SERIAL PRIMARY KEY,
            #     user_id INTEGER UNIQUE REFERENCES dawa.tb_user(u_id),
            #     reset_token VARCHAR(100) NOT NULL,
            #     expires_at TIMESTAMP NOT NULL,
            #     used BOOLEAN DEFAULT false,
            #     created_at TIMESTAMP DEFAULT now()
            # );

            insert_result = DataBaseHandle.executeQuery(sql_insert, params)

            if insert_result['result']:
                # En un entorno real, aquí enviarías el correo electrónico
                # Por ahora, devolvemos el token (en producción, enviar por email)
                HandleLogs.write_log(
                    f"Token de recuperación generado para usuario {user_data['u_login']}: {reset_token}")

                # Simulación de envío de email
                reset_link = f"http://localhost:3000/reset-password?token={reset_token}"
                print(f"Simulación - Enviar email a {email} con enlace: {reset_link}")

                return internal_response(True, {'token': reset_token}, "Token generado exitosamente")
            else:
                return internal_response(False, None, "Error al generar token de recuperación")

        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, 'Error en el proceso de recuperación -> ' + str(err))

    @staticmethod
    def reset_password(token, new_password):
        try:
            # Verificar token válido
            sql = """
                SELECT pr.user_id, pr.expires_at, pr.used, u.u_id
                FROM dawa.tb_password_reset pr
                JOIN dawa.tb_user u ON pr.user_id = u.u_id
                WHERE pr.reset_token = %s 
                  AND pr.expires_at > NOW()
                  AND pr.used = false
                  AND u.u_state = true
            """

            token_result = DataBaseHandle.getRecords(sql, 1, (token,))

            if not token_result['result'] or not token_result['data']:
                return internal_response(False, None, "Token inválido o expirado")

            token_data = token_result['data']

            # Actualizar contraseña
            # Nota: En producción, deberías hashear la contraseña
            hashed_password = hashlib.sha256(new_password.encode()).hexdigest()

            sql_update = """
                UPDATE dawa.tb_user 
                SET u_password = %s, 
                    updated_at = NOW()
                WHERE u_id = %s
            """

            update_result = DataBaseHandle.executeQuery(
                sql_update,
                (hashed_password, token_data['user_id'])
            )

            if update_result['result']:
                # Marcar token como usado
                sql_mark_used = """
                    UPDATE dawa.tb_password_reset 
                    SET used = true 
                    WHERE user_id = %s
                """
                DataBaseHandle.executeQuery(sql_mark_used, (token_data['user_id'],))

                return internal_response(True, None, "Contraseña actualizada exitosamente")
            else:
                return internal_response(False, None, "Error al actualizar la contraseña")

        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, 'Error al restablecer contraseña -> ' + str(err))