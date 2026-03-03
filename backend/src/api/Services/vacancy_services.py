from flask import request
from flask_restful import Resource

from ...api.Components.vacancy_component import VacancyComponent
from ...api.Components.jwt_component import JWTComponent
from ...api.Model.Request.vacancy_request import VacancyRequest
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success
from ...utils.database.connection_db import DataBaseHandle

class VacancyService(Resource):
    @staticmethod
    def post():
        """Crear una nueva vacante"""
        try:
            HandleLogs.write_log("Servicio para creación de vacantes ejecutándose")
            # Obtener y validar token
            token = request.headers.get('Authorization')
            if not token:
                return response_error("No se ha pasado el token")

            token = token.replace("Bearer ", "")
            decoded_token = JWTComponent.decode_token(token)

            if not decoded_token['result']:
                return response_error("Token no válido")

            # Verificar que el usuario es una empresa
            if decoded_token['data']['role'] != 'company':
                return response_error("Solo las empresas pueden crear vacantes")

            # Obtener el company_id del usuario
            user_id = decoded_token['data']['user_id']
            sql_company = "SELECT company_id FROM dawa.tb_company_profile WHERE user_id = %s"
            db_result = DataBaseHandle.getRecords(sql_company, 1, (user_id,))

            if not db_result['result'] or not db_result['data']:
                return response_error("Perfil de empresa no encontrado")

            company_id = db_result['data']['company_id']

            # Validar request
            rq_json = request.get_json()
            new_request = VacancyRequest()
            validation_error = new_request.validate(rq_json)

            if validation_error:
                HandleLogs.write_log("Error en validación -> " + str(validation_error))
                return response_error("Error en validación: " + str(validation_error))

            # Crear vacante
            result = VacancyComponent.create_vacancy(
                company_id=company_id,
                title=rq_json['title'],
                area=rq_json['area'],
                description=rq_json['description'],
                requirements=rq_json.get('requirements'),
                modality_id=rq_json['modality_id'],
                availability_id=rq_json['availability_id'],
                daily_hours_id=rq_json['daily_hours_id'],
                duration_id=rq_json['duration_id'],
                vacancies_available=rq_json.get('vacancies_available', 1),
                expires_at=rq_json.get('expires_at'),
                skills=rq_json.get('skills')
            )

            if result['result']:
                return response_success(result['data'])
            else:
                return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error en el servicio de creación de vacantes -> " + err.__str__())

    @staticmethod
    def get():
        """Obtener vacantes - puede ser todas o por empresa"""
        try:
            HandleLogs.write_log("Servicio para listar vacantes ejecutándose")

            # Verificar si se quiere las vacantes de una empresa específica
            company_id = request.args.get('company_id')
            vacancy_id = request.args.get('vacancy_id')

            if vacancy_id:
                # Obtener detalles de una vacante específica
                result = VacancyComponent.get_vacancy_details(vacancy_id)
            elif company_id:
                # Verificar token para acceder a vacantes de empresa
                token = request.headers.get('Authorization')
                if not token:
                    return response_error("Token requerido para ver vacantes de empresa")

                token = token.replace("Bearer ", "")
                decoded_token = JWTComponent.decode_token(token)

                if not decoded_token['result']:
                    return response_error("Token no válido")

                # Verificar que el usuario tiene permiso
                user_id = decoded_token['data']['user_id']
                sql_check = """
                    SELECT 1 FROM dawa.tb_company_profile 
                    WHERE company_id = %s AND user_id = %s
                """
                check_result = DataBaseHandle.getRecords(sql_check, 1, (company_id, user_id))

                if not check_result['result'] or not check_result['data']:
                    return response_error("No autorizado para ver estas vacantes")

                result = VacancyComponent.get_vacancies_by_company(company_id)
            else:
                # Obtener todas las vacantes activas
                result = VacancyComponent.get_all_vacancies()

            if result['result']:
                return response_success(result['data'])
            else:
                return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error en el servicio para listar vacantes -> " + err.__str__())


class VacancyCatalogService(Resource):
    @staticmethod
    def get():
        """Obtener catálogos para crear vacantes"""
        try:
            HandleLogs.write_log("Servicio para catálogos de vacantes ejecutándose")

            result = VacancyComponent.get_catalog_options()

            if result['result']:
                return response_success(result['data'])
            else:
                return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error en el servicio de catálogos -> " + err.__str__())