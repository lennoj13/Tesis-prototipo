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
            student_id = rq_json.get('student_id') or rq_json.get('estudiante_id') or auth['data'].get('profile_id')
            vacancy_id = rq_json.get('vacancy_id') or rq_json.get('vacante_id')
            match_pct = rq_json.get('match_percentage') or rq_json.get('porcentaje_afinidad', 0)

            if not student_id or not vacancy_id:
                return response_error("estudiante_id y vacante_id son requeridos")

            result = ApplicationComponent.create_application(student_id, vacancy_id, match_pct)
            if result['result']:
                return response_inserted(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

    @staticmethod
    def get():
        """Obtener postulaciones (por estudiante, vacante o empresa)"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")

            student_id = request.args.get('student_id') or request.args.get('estudiante_id')
            vacancy_id = request.args.get('vacancy_id') or request.args.get('vacante_id')
            company_id = request.args.get('company_id') or request.args.get('institution_id') or request.args.get('institucion_id')

            if company_id:
                result = ApplicationComponent.get_applications_by_company(int(company_id))
            elif student_id:
                result = ApplicationComponent.get_applications_by_student(int(student_id))
            elif vacancy_id:
                result = ApplicationComponent.get_applications_by_vacancy(int(vacancy_id))
            elif auth['data'].get('role') in ('admin', 'gestor'):
                if auth['data'].get('role') == 'gestor':
                    facultad_id = auth['data'].get('facultad_id')
                    carrera_id = auth['data'].get('carrera_id')
                    result = ApplicationComponent.get_all_applications(facultad_id, carrera_id)
                else:
                    result = ApplicationComponent.get_all_applications()
            else:
                profile_id = auth['data'].get('profile_id')
                if profile_id:
                    result = ApplicationComponent.get_applications_by_student(profile_id)
                else:
                    return response_error("Especifique estudiante_id o vacante_id")

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
            new_status = rq_json.get('status') or rq_json.get('estado')
            valid_states = ['pendiente', 'entrevista', 'aceptada_empresa', 'aceptada', 'aprobada', 'reprobada', 'rechazada', 'rechazada_gestor', 'cancelada', 'completada', 'anulada']
            if new_status not in valid_states:
                return response_error(f"Estado no válido. Use: {', '.join(valid_states)}")

            notas = rq_json.get('notes') or rq_json.get('notas')
            supervisor_id = rq_json.get('supervisor_id')

            # Datos de entrevista (cuando el estado es 'entrevista')
            entrevista_data = None
            if new_status == 'entrevista':
                entrevista_data = {
                    'fecha_entrevista': rq_json.get('fecha_entrevista'),
                    'hora_entrevista': rq_json.get('hora_entrevista'),
                    'modalidad_entrevista': rq_json.get('modalidad_entrevista'),
                    'direccion_entrevista': rq_json.get('direccion_entrevista'),
                    'link_reunion': rq_json.get('link_reunion'),
                }

            result = ApplicationComponent.update_application_status(
                application_id, new_status, notas=notas, supervisor_id=supervisor_id,
                entrevista_data=entrevista_data
            )
            if result['result']:
                return response_success(result.get('data'))
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class ApplicationSolicitudService(Resource):
    @staticmethod
    def get(application_id):
        """Obtener paquete de datos de solicitud compatible con SIUG"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")

            result = ApplicationComponent.get_solicitud_data(application_id)
            if result['result']:
                return response_success(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))
