from flask import request
from flask_restful import Resource
from ...api.Components.user_component import UserComponent
from ...api.Components.auth_component import AuthComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success

class UserService(Resource):
    @staticmethod
    def get():
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error(auth['message'])

            result_user = UserComponent.get_all_user()
            if result_user['result']:
                return response_success(result_user['data'])
            else:
                return response_error(result_user['message'] or "Error desconocido")
        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error en el servicio user -> " + str(err))


class CurrentUserService(Resource):
    @staticmethod
    def get():
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error(auth['message'])

            decoded_data = auth['data']
            if 'user_id' in decoded_data:
                result_user = UserComponent.get_user_by_id(decoded_data['user_id'])
                if result_user['result'] and result_user['data']:
                    user_data = result_user['data']
                    response_data = {
                        'user_info': {
                            'user_id': user_data.get('user_id'),
                            'username': user_data.get('login'),
                            'name': user_data.get('name'),
                            'lastname': user_data.get('lastname'),
                            'email': user_data.get('email'),
                            'role': user_data.get('role_name'),
                            'role_id': user_data.get('role_id'),
                            'profile_id': user_data.get('profile_id')
                        }
                    }
                    return response_success(response_data)
                else:
                    return response_error(result_user.get('message', 'Usuario no encontrado'))
            else:
                return response_error("Token inválido: no contiene user_id")

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error en current-user -> " + str(err))