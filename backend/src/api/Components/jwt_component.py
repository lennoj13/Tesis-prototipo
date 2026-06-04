# .../api/Components/jwt_component.py
from ...utils.general.logs import HandleLogs
from ...utils.general.config import Parametros
from ...utils.general.response import internal_response
from datetime import datetime, timedelta
import pytz
import jwt

class JWTComponent:
    @staticmethod
    def token_generate(user_data):
        try:
            respuesta = None
            timezone = pytz.timezone('America/Guayaquil')
            #payload para generar el token
            payload = {
                # zona horaria = iat, expiracion del token = exp
                'iat': datetime.now(tz=timezone),
                'exp': datetime.now(tz=timezone) + timedelta(minutes=15),
                'user_id': user_data.get('user_id'),
                'username': user_data.get('username'),
                'role': user_data.get('role'),
                'role_id': user_data.get('role_id'),
                'name': user_data.get('name'),
                'lastname': user_data.get('lastname'),
                'email': user_data.get('email'),
                'profile_id': user_data.get('profile_id'),
                'facultad_id': user_data.get('facultad_id'),
                'carrera_id': user_data.get('carrera_id')
            }

            respuesta = jwt.encode(payload, Parametros.secret_jwt, 'HS256')
            HandleLogs.write_log(f"Token generado para usuario: {user_data.get('username')}")

        except Exception as err:
            HandleLogs.write_log(f"Error al generar token para usuario: {user_data.get('username')}")
            HandleLogs.write_error(err)
        finally:
            return respuesta

    @staticmethod
    def token_validate(p_token):
        try:
            jwt.decode(p_token, Parametros.secret_jwt, algorithms=['HS256'])
            return True
        except jwt.ExpiredSignatureError:
            HandleLogs.write_log("El token ha expirado.")
            return False
        except jwt.InvalidTokenError as err:
            HandleLogs.write_error(err)
            HandleLogs.write_log(f"Token inválido: {p_token}")
            return False

#decodificación del token para obtener los datos
    @staticmethod
    def decode_token(p_token):
        try:
            payload = jwt.decode(p_token, Parametros.secret_jwt, algorithms=['HS256'])
            return internal_response(True, payload, "Token decodificado exitosamente")
        except jwt.ExpiredSignatureError:
            HandleLogs.write_log("El token ha expirado.")
            return internal_response(False, None, "El token ha expirado.")
        except jwt.InvalidTokenError as err:
            HandleLogs.write_error(err)
            HandleLogs.write_log(f"Error al decodificar el token: {p_token}")
            return internal_response(False, None, "Token inválido.")
