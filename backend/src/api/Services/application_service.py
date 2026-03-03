from flask import request
from flask_restful import Resource

from ...api.Components.application_component import ApplicationComponent
from ...api.Components.auth_component import AuthComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success, response_inserted

class ApplicationService(Resource):
    @staticmethod
    def post():
        """Crear una nueva postulación"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")

            rq_json = request.get_json()
            student_id = rq_json.get('student_id') or auth['data'].get('profile_id')
            vacancy_id = rq_json.get('vacancy_id')
            match_percentage = rq_json.get('match_percentage', 0)

            if not student_id or not vacancy_id:
                return response_error("student_id y vacancy_id son requeridos")

            result = ApplicationComponent.create_application(student_id, vacancy_id, match_percentage)
            if result['result']:
                return response_inserted(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

    @staticmethod
    def get():
        """Obtener postulaciones (por estudiante o por vacante)"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")

            student_id = request.args.get('student_id')
            vacancy_id = request.args.get('vacancy_id')

            if student_id:
                result = ApplicationComponent.get_applications_by_student(int(student_id))
            elif vacancy_id:
                result = ApplicationComponent.get_applications_by_vacancy(int(vacancy_id))
            else:
                # Si no se especifica, usar el profile_id del token
                profile_id = auth['data'].get('profile_id')
                if profile_id:
                    result = ApplicationComponent.get_applications_by_student(profile_id)
                else:
                    return response_error("Especifique student_id o vacancy_id")

            if result['result']:
                return response_success(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class ApplicationStatusService(Resource):
    @staticmethod
    def put(application_id):
        """Actualizar estado de una postulación"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")

            rq_json = request.get_json()
            new_status = rq_json.get('status')
            if new_status not in ['pending', 'approved', 'rejected']:
                return response_error("Estado no válido. Use: pending, approved, rejected")

            result = ApplicationComponent.update_application_status(application_id, new_status)
            if result['result']:
                return response_success(None)
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))
