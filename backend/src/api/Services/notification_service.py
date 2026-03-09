from flask import request
from flask_restful import Resource

from ...api.Components.notification_component import NotificationComponent
from ...api.Components.auth_component import AuthComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success

class NotificationService(Resource):
    @staticmethod
    def get():
        """Obtener notificaciones del usuario autenticado"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")

            user_id = auth['data']['user_id']
            result = NotificationComponent.get_notifications(user_id)
            if result['result']:
                return response_success(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class NotificationReadService(Resource):
    @staticmethod
    def put(notification_id):
        """Marcar notificación como leída"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")

            result = NotificationComponent.mark_as_read(notification_id)
            if result['result']:
                return response_success(None)
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class NotificationReadAllService(Resource):
    @staticmethod
    def put():
        """Marcar todas las notificaciones como leídas"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")

            user_id = auth['data']['user_id']
            result = NotificationComponent.mark_all_as_read(user_id)
            if result['result']:
                return response_success(None)
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class NotificationDeleteService(Resource):
    @staticmethod
    def delete(notification_id):
        """Eliminar notificación"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")

            result = NotificationComponent.delete_notification(notification_id)
            if result['result']:
                return response_success(None)
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))
