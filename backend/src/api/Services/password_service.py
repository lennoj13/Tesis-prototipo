from flask import request
from flask_restful import Resource
from ...api.Model.Request.password_request import ForgotPasswordRequest, ResetPasswordRequest
from ...api.Components.password_component import PasswordComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success


class ForgotPasswordService(Resource):
    @staticmethod
    def post():
        try:
            HandleLogs.write_log("Servicio de olvido de contraseña ejecutándose")

            rq_json = request.get_json()
            new_request = ForgotPasswordRequest()
            error_en_validacion = new_request.validate(rq_json)

            if error_en_validacion:
                HandleLogs.write_log("Error en validar el Request ->" + str(error_en_validacion))
                return response_error("Error al validar el Request -> " + str(error_en_validacion))

            result = PasswordComponent.initiate_password_reset(rq_json['email'])

            if result['result']:
                return response_success("Se ha enviado un correo con instrucciones para restablecer la contraseña")
            else:
                return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error en el servicio -> " + err.__str__())


class ResetPasswordService(Resource):
    @staticmethod
    def post():
        try:
            HandleLogs.write_log("Servicio de restablecimiento de contraseña ejecutándose")

            rq_json = request.get_json()
            new_request = ResetPasswordRequest()
            error_en_validacion = new_request.validate(rq_json)

            if error_en_validacion:
                HandleLogs.write_log("Error en validar el Request ->" + str(error_en_validacion))
                return response_error("Error al validar el Request -> " + str(error_en_validacion))

            result = PasswordComponent.reset_password(
                rq_json['token'],
                rq_json['new_password']
            )

            if result['result']:
                return response_success("Contraseña restablecida exitosamente")
            else:
                return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error en el servicio -> " + err.__str__())