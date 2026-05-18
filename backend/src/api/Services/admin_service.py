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
            
            if auth['data'].get('role') not in ('admin', 'gestor'):
                return response_error("Acceso denegado: se requiere rol admin")

            result = AdminComponent.get_stats()
            if result['result']:
                return response_success(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class AdminUserDetailService(Resource):
    @staticmethod
    def get(user_id):
        """Obtener detalle completo de un usuario (admin)"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")
            
            if auth['data'].get('role') not in ('admin', 'gestor'):
                return response_error("Acceso denegado: se requiere rol admin")

            result = AdminComponent.get_user_detail(user_id)
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
            
            if auth['data'].get('role') not in ('admin',):
                return response_error("Acceso denegado")

            rq_json = request.get_json()
            new_status = rq_json.get('status') or rq_json.get('estado')
            valid = ['pendiente', 'aprobado', 'rechazado']
            if new_status not in valid:
                return response_error(f"Estado no válido. Use: {', '.join(valid)}")

            result = AdminComponent.update_company_status(company_id, new_status)
            if result['result']:
                return response_success(None)
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class AdminDeleteUserService(Resource):
    @staticmethod
    def delete(user_id):
        """Eliminar (desactivar) un usuario"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")
            
            if auth['data'].get('role') not in ('admin',):
                return response_error("Acceso denegado: se requiere rol admin")

            admin_user_id = auth['data'].get('user_id')
            result = AdminComponent.delete_user(user_id, admin_user_id)
            if result['result']:
                return response_success(None)
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

    @staticmethod
    def put(user_id):
        """Editar (actualizar) cualquier usuario o empresa por un admin/gestor"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")
            
            if auth['data'].get('role') not in ('admin', 'gestor'):
                return response_error("Acceso denegado: se requiere rol admin o gestor")

            from ...api.Components.profile_component import ProfileComponent
            target = ProfileComponent.get_profile(user_id)
            if not target['result']:
                return response_error("Usuario no encontrado")

            role = target['data']['rol_nombre'].lower()
            rq_json = request.get_json()
            
            result = ProfileComponent.update_profile(user_id, role, rq_json)
            if result['result']:
                return response_success(None)
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class AdminReportsService(Resource):
    @staticmethod
    def get():
        """Obtener datos reales para los gráficos de reportes"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")
            
            if auth['data'].get('role') not in ('admin', 'gestor'):
                return response_error("Acceso denegado: se requiere rol admin o gestor")

            result = AdminComponent.get_report_data()
            if result['result']:
                return response_success(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))
