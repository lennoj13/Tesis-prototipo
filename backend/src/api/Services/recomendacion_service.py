from flask import request
from flask_restful import Resource

from ...api.Components.recomendacion_component import RecomendacionComponent
from ...api.Components.auth_component import AuthComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success


class RecomendacionVacantesService(Resource):
    @staticmethod
    def get():
        """Obtener vacantes con porcentaje de afinidad IA para el estudiante autenticado"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")

            if auth['data'].get('role') != 'estudiante':
                return response_error("Acceso denegado: se requiere rol estudiante")

            usuario_id = auth['data']['user_id']
            facultad_id = auth['data'].get('facultad_id')

            result = RecomendacionComponent.get_recomendaciones(usuario_id, facultad_id)
            if result['result']:
                return response_success(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))
