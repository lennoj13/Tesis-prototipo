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
            student_id = rq_json.get('student_id') or auth['data'].get('profile_id')
            vacancy_id = rq_json.get('vacancy_id')
            match_percentage = rq_json.get('match_percentage', 0)

            if not student_id or not vacancy_id:
                return response_error("student_id y vacancy_id son requeridos")

            result = ApplicationComponent.create_application(student_id, vacancy_id, match_percentage)
            if result['result']:
                # === Novedad: Notificar a la empresa ===
                try:
                    from ...api.Components.notification_component import NotificationComponent
                    details_res = ApplicationComponent.get_details_for_notification(student_id, vacancy_id)
                    if details_res['result']:
                        details = details_res['data']
                        notif_title = "Nuevo postulante"
                        notif_msg = f"{details['student_name']} se postuló a \"{details['vacancy_title']}\""
                        NotificationComponent.create_notification(
                            user_id=details['company_user_id'],
                            notif_type='applicant',
                            title=notif_title,
                            message=notif_msg,
                            related_id=result['data'].get('application_id')
                        )
                except Exception as e:
                    HandleLogs.write_error(f"Error creando notificación: {e}")
                # ========================================

                return response_inserted(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

    @staticmethod
    def get():
        """Obtener postulaciones (por estudiante o por vacante)"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")

            student_id = request.args.get('student_id')
            vacancy_id = request.args.get('vacancy_id')
            company_id = request.args.get('company_id')

            if company_id:
                result = ApplicationComponent.get_applications_by_company(int(company_id))
            elif student_id:
                result = ApplicationComponent.get_applications_by_student(int(student_id))
            elif vacancy_id:
                result = ApplicationComponent.get_applications_by_vacancy(int(vacancy_id))
            else:
                # Si no se especifica, usar el profile_id del token
                profile_id = auth['data'].get('profile_id')
                if profile_id:
                    result = ApplicationComponent.get_applications_by_student(profile_id)
                else:
                    return response_error("Especifique student_id o vacancy_id")

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
            new_status = rq_json.get('status')
            if new_status not in ['pending', 'approved', 'rejected']:
                return response_error("Estado no válido. Use: pending, approved, rejected")

            result = ApplicationComponent.update_application_status(application_id, new_status)
            if result['result']:
                # === Novedad: Notificar al estudiante ===
                try:
                    from ...api.Components.notification_component import NotificationComponent
                    details_res = ApplicationComponent.get_application_user_details(application_id)
                    if details_res['result']:
                        details = details_res['data']
                        if new_status == 'approved':
                            notif_title = "Postulación aprobada"
                            notif_msg = f"Tu postulación a \"{details['vacancy_title']}\" en {details['company_name']} ha sido aceptada."
                        elif new_status == 'rejected':
                            notif_title = "Postulación rechazada"
                            notif_msg = f"Tu perfil no fue seleccionado para \"{details['vacancy_title']}\"."

                        if new_status in ['approved', 'rejected']:
                            NotificationComponent.create_notification(
                                user_id=details['student_user_id'],
                                notif_type='application',
                                title=notif_title,
                                message=notif_msg,
                                related_id=application_id
                            )
                except Exception as e:
                    HandleLogs.write_error(f"Error creando notificación: {e}")
                # ========================================
                return response_success(None)
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))
