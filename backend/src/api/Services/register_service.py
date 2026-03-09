from flask import request
from flask_restful import Resource

from ...api.Components.register_component import RegisterComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success, response_inserted

class RegisterService(Resource):
    @staticmethod
    def post():
        try:
            HandleLogs.write_log("Servicio de registro ejecutándose")
            rq_json = request.get_json()

            # Validaciones básicas
            required = ['login', 'password', 'name', 'lastname', 'email', 'role']
            for field in required:
                if field not in rq_json or not rq_json[field]:
                    return response_error(f"El campo '{field}' es requerido")

            # Validar dominio de correo para estudiantes
            if rq_json['role'] == 'student':
                email = rq_json['email'].strip().lower()
                if not email.endswith('@ug.edu.ec'):
                    return response_error("Los estudiantes deben registrarse con un correo institucional (@ug.edu.ec)")

            result = RegisterComponent.register_user(
                login=rq_json['login'],
                password=rq_json['password'],
                name=rq_json['name'],
                lastname=rq_json['lastname'],
                email=rq_json['email'],
                phone=rq_json.get('phone', ''),
                role_name=rq_json['role']
            )

            if result['result']:
                return response_inserted(result['data'])
            else:
                return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error en el registro: " + str(err))
