from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response

class NotificationComponent:
    @staticmethod
    def get_notifications(user_id):
        try:
            sql = """
                SELECT notification_id, type, title, message, is_read, related_id,
                       TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
                FROM public.notifications
                WHERE user_id = %s
                ORDER BY created_at DESC
                LIMIT 50
            """
            result = DataBaseHandle.getRecords(sql, 0, (user_id,))
            if result['result']:
                return internal_response(True, result['data'] or [], "Notificaciones encontradas")
            return internal_response(False, [], result.get('message', 'Error'))
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, [], str(err))

    @staticmethod
    def mark_as_read(notification_id):
        try:
            sql = "UPDATE public.notifications SET is_read = true WHERE notification_id = %s"
            DataBaseHandle.ExecuteNonQuery(sql, (notification_id,))
            return internal_response(True, None, "Marcada como leída")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def mark_all_as_read(user_id):
        try:
            sql = "UPDATE public.notifications SET is_read = true WHERE user_id = %s AND is_read = false"
            DataBaseHandle.ExecuteNonQuery(sql, (user_id,))
            return internal_response(True, None, "Todas marcadas como leídas")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def create_notification(user_id, notif_type, title, message, related_id=None):
        try:
            sql = """
                INSERT INTO public.notifications (user_id, type, title, message, related_id)
                VALUES (%s, %s, %s, %s, %s)
            """
            DataBaseHandle.ExecuteNonQuery(sql, (user_id, notif_type, title, message, related_id))
            return internal_response(True, None, "Notificación creada")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def delete_notification(notification_id):
        try:
            sql = "DELETE FROM public.notifications WHERE notification_id = %s"
            DataBaseHandle.ExecuteNonQuery(sql, (notification_id,))
            return internal_response(True, None, "Notificación eliminada")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))
