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

            if auth['data']['role'] != 'company':
                return response_error("Solo las empresas pueden crear vacantes")

            user_id = auth['data']['user_id']
            sql_company = "SELECT company_id FROM public.company_profiles WHERE user_id = %s"
            db_result = DataBaseHandle.getRecords(sql_company, 1, (user_id,))

            if not db_result['result'] or not db_result['data']:
                return response_error("Perfil de empresa no encontrado")

            company_id = db_result['data']['company_id']
            rq_json = request.get_json()

            result = VacancyComponent.create_vacancy(
                company_id=company_id,
                title=rq_json['title'],
                area=rq_json.get('area', ''),
                description=rq_json.get('description', ''),
                requirements=rq_json.get('requirements', ''),
                modality=rq_json.get('modality', 'Presencial'),
                location=rq_json.get('location', ''),
                slots=rq_json.get('slots', 1),
                expires_at=rq_json.get('expires_at'),
                skills=rq_json.get('skills')
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
            vacancy_id = request.args.get('vacancy_id')
            company_id = request.args.get('company_id')

            if vacancy_id:
                result = VacancyComponent.get_vacancy_details(int(vacancy_id))
            elif company_id:
                result = VacancyComponent.get_vacancies_by_company(int(company_id))
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