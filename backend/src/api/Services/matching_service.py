from flask import request
from flask_restful import Resource

from ...api.Components.matching_component import MatchingComponent
from ...api.Components.auth_component import AuthComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success


class MatchingCandidatesService(Resource):
    @staticmethod
    def get():
        """Obtener candidatos con afinidad para las vacantes de la empresa"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")

            if auth['data'].get('role') != 'company':
                return response_error("Acceso denegado: se requiere rol empresa")

            company_id = request.args.get('company_id')
            if not company_id:
                return response_error("company_id es requerido")

            result = MatchingComponent.get_candidates_for_company(int(company_id))
            if result['result']:
                return response_success(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))
