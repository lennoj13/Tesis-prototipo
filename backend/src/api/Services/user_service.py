from flask import request
from flask_restful import Resource
from  ...api.Components.user_component import UserComponent
from ...api.Components.jwt_component import JWTComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success

class UserService(Resource):
    @staticmethod
    def get():
        try:
            HandleLogs.write_log("Servicio de consulta de usuarios ejecutándose")
            token = request.headers.get('Authorization', None)
            if not token:
                return response_error("Token no proporcionado.")

            token = token.replace("Bearer ", "").strip()
            if not JWTComponent.token_validate(token):
                return response_error("Token no válido o expirado.")

            result_user = UserComponent.get_all_user()
            if result_user['result']:
                return response_success(result_user['data'])
            else:
                return response_error(result_user['message'] or "Error desconocido")
        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error en el servicio user -> " + err.__str__())


class CurrentUserService(Resource):
    @staticmethod
    def get():
        try:
            HandleLogs.write_log("Servicio de usuario actual ejecutándose")

            # Obtener token del header
            token = request.headers.get('Authorization', None)
            HandleLogs.write_log(f"Token recibido: {'Sí' if token else 'No'}")

            if not token:
                return response_error("Token no proporcionado.")

            token = token.replace("Bearer ", "").strip()
            HandleLogs.write_log(f"Token limpiado: {token[:20]}...")  # Solo primeros 20 chars

            # Validar token
            #if not JWTComponent.token_validate(token):
            #   return response_error("Token no válido o expirado.")
            token_valid = JWTComponent.token_validate(token)
            HandleLogs.write_log(f"Token válido: {token_valid}")

            if not token_valid:
                return response_error("Token no válido o expirado.")


            # Decodificar token para obtener información del usuario
            decoded_result = JWTComponent.decode_token(token)
            HandleLogs.write_log(f"Resultado decodificación: {decoded_result['result']}")

            if decoded_result['result'] and decoded_result['data']:
                decoded_token = decoded_result['data']
                HandleLogs.write_log(f"user_id en token: {decoded_token.get('user_id', 'No encontrado')}")

                if 'user_id' in decoded_token:
                    # Obtener información completa del usuario desde la base de datos
                    result_user = UserComponent.get_user_by_id(decoded_token['user_id'])
                    HandleLogs.write_log(f"Resultado BD: {result_user['result']}")

                    if result_user['result'] and result_user['data']:
                        user_data = result_user['data']
                        HandleLogs.write_log(f"Usuario encontrado: {user_data.get('u_login', 'No login')}")

                        # Formatear respuesta similar al login
                        response_data = {
                            'user_info': {
                                'user_id': user_data.get('u_id'),
                                'username': user_data.get('u_login'),
                                'name': user_data.get('u_name'),
                                'lastname': user_data.get('u_lastname'),
                                'email': user_data.get('u_email'),
                                'role': user_data.get('role_name'),
                                'role_id': user_data.get('role_id'),
                                'profile_id': user_data.get('profile_id')
                            }
                        }
                        return response_success(response_data)
                    else:
                        HandleLogs.write_log(f"Error BD: {result_user.get('message', 'Sin mensaje')}")
                        return response_error(result_user['message'] or "Usuario no encontrado")
                else:
                    return response_error("Token inválido: no contiene user_id")
            else:
                HandleLogs.write_log(f"Error decodificación: {decoded_result.get('message', 'Sin mensaje')}")
                return response_error(decoded_result.get('message', "Token inválido o información incompleta"))

        except Exception as err:
            HandleLogs.write_error(err)
            HandleLogs.write_log(f"EXCEPCIÓN: {err}")
            return response_error("Error en el servicio current-user -> " + err.__str__())