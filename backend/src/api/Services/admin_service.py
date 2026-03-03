from flask import request
from flask_restful import Resource

from ...api.Components.admin_component import AdminComponent
from ...api.Components.auth_component import AuthComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success

class AdminStatsService(Resource):
    @staticmethod
    def get():
        """Obtener estadísticas para el dashboard admin"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")
            
            if auth['data'].get('role') != 'admin':
                return response_error("Acceso denegado: se requiere rol admin")

            result = AdminComponent.get_stats()
            if result['result']:
                return response_success(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class AdminCompanyService(Resource):
    @staticmethod
    def get():
        """Obtener todas las empresas (admin)"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")

            result = AdminComponent.get_all_companies()
            if result['result']:
                return response_success(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class AdminCompanyStatusService(Resource):
    @staticmethod
    def put(company_id):
        """Actualizar estado de empresa (aprobar/rechazar)"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")
            
            if auth['data'].get('role') != 'admin':
                return response_error("Acceso denegado")

            rq_json = request.get_json()
            new_status = rq_json.get('status')
            if new_status not in ['pending', 'approved', 'rejected']:
                return response_error("Estado no válido")

            result = AdminComponent.update_company_status(company_id, new_status)
            if result['result']:
                return response_success(None)
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))
