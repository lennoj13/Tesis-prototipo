
from flask import request
from flask_restful import Resource

from ...api.Components.login_component import LoginComponent
from ...api.Model.Request.login_request import LoginRequest
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success

class LoginService(Resource):
    @staticmethod
    def post():
        try:
            HandleLogs.write_log("Servicio de login ejecutandose")
            #Obtener el request
            rq_json = request.get_json()

            #validar que el request sea compatible con el modelo
            new_request = LoginRequest()
            error_en_validacion = new_request.validate(rq_json)
            if error_en_validacion:
                HandleLogs.write_log("Error en validar el Request ->" + str(error_en_validacion))
                return response_error("Error al validar el Request -> " + str(error_en_validacion))

            #Llamo al metodo de los componentes
            result_login = LoginComponent.Login(rq_json['login_user'], rq_json['login_password'])
            if result_login['result']:
                return response_success(result_login['data'])
            else:
                return response_error(result_login['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("error en el servicio -> " + err.__str__())