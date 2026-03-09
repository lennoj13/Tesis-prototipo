
from flask import request
from flask_restful import Resource

from ...api.Components.login_component import LoginComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success

class LoginService(Resource):
    @staticmethod
    def post():
        try:
            HandleLogs.write_log("Servicio de login ejecutandose")
            rq_json = request.get_json()

            # Validar campos requeridos
            if not rq_json or 'login_user' not in rq_json or 'login_password' not in rq_json:
                return response_error("Se requieren los campos login_user y login_password")

            login_user = rq_json['login_user']
            login_password = rq_json['login_password']

            if not login_user or not login_password:
                return response_error("Usuario y contraseña no pueden estar vacíos")

            # Llamar al componente de login
            result_login = LoginComponent.Login(login_user, login_password)
            if result_login['result']:
                return response_success(result_login['data'])
            else:
                return response_error(result_login['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("error en el servicio -> " + err.__str__())