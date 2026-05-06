from flask import request
from flask_restful import Resource

from ...api.Components.vacancy_component import VacancyComponent
from ...api.Components.auth_component import AuthComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success, response_inserted
from ...utils.database.connection_db import DataBaseHandle

class VacancyService(Resource):
    @staticmethod
    def post():
        """Crear una nueva vacante"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error(auth['message'])

            if auth['data']['role'] not in ('company', 'empresa'):
                return response_error("Solo las empresas pueden crear vacantes")

            user_id = auth['data']['user_id']
            sql_inst = "SELECT institucion_id FROM public.instituciones WHERE usuario_id = %s"
            db_result = DataBaseHandle.getRecords(sql_inst, 1, (user_id,))

            if not db_result['result'] or not db_result['data']:
                return response_error("Perfil de empresa no encontrado")

            institucion_id = db_result['data']['institucion_id']
            rq_json = request.get_json()

            result = VacancyComponent.create_vacancy(
                institucion_id=institucion_id,
                titulo=rq_json.get('titulo') or rq_json.get('title', ''),
                area=rq_json.get('area', ''),
                descripcion=rq_json.get('descripcion') or rq_json.get('description', ''),
                requisitos=rq_json.get('requisitos') or rq_json.get('requirements', ''),
                modalidad=rq_json.get('modalidad') or rq_json.get('modality', 'Presencial'),
                ubicacion=rq_json.get('ubicacion') or rq_json.get('location', ''),
                cupos=rq_json.get('cupos') or rq_json.get('slots', 1),
                fecha_expiracion=rq_json.get('fecha_expiracion') or rq_json.get('expires_at'),
                skills=rq_json.get('skills'),
                total_horas=rq_json.get('total_horas') or rq_json.get('total_hours'),
                horas_diarias=rq_json.get('horas_diarias') or rq_json.get('daily_hours'),
                horario=rq_json.get('horario') or rq_json.get('schedule'),
                supervisor_id=rq_json.get('supervisor_id')
            )

            if result['result']:
                return response_inserted(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error al crear vacante: " + str(err))

    @staticmethod
    def get():
        """Obtener vacantes: todas, por empresa, o por ID"""
        try:
            vacancy_id = request.args.get('vacancy_id') or request.args.get('vacante_id')
            institution_id = request.args.get('company_id') or request.args.get('institution_id') or request.args.get('institucion_id')

            if vacancy_id:
                result = VacancyComponent.get_vacancy_details(int(vacancy_id))
            elif institution_id:
                result = VacancyComponent.get_vacancies_by_company(int(institution_id))
            else:
                result = VacancyComponent.get_all_vacancies()

            if result['result']:
                return response_success(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class VacancyCatalogService(Resource):
    @staticmethod
    def get():
        """Catálogos para crear vacantes"""
        try:
            result = VacancyComponent.get_catalog_options()
            if result['result']:
                return response_success(result['data'])
            return response_error(result['message'])
        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class VacancyDetailService(Resource):
    @staticmethod
    def put(vacancy_id):
        """Actualizar una vacante"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error(auth['message'])

            rq_json = request.get_json()
            result = VacancyComponent.update_vacancy(vacancy_id, rq_json)
            if result['result']:
                return response_success(None)
            return response_error(result['message'])
        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

    @staticmethod
    def delete(vacancy_id):
        """Eliminar una vacante"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error(auth['message'])

            result = VacancyComponent.delete_vacancy(vacancy_id)
            if result['result']:
                return response_success(None)
            return response_error(result['message'])
        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))