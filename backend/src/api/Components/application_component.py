from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response

class ApplicationComponent:
    @staticmethod
    def create_application(student_id, vacancy_id, match_percentage=0):
        try:
            sql = """
                INSERT INTO public.applications (student_id, vacancy_id, status, match_percentage)
                VALUES (%s, %s, 'pending', %s)
                RETURNING application_id
            """
            result = DataBaseHandle.ExecuteNonQuery(sql, (student_id, vacancy_id, match_percentage))
            if result['result']:
                return internal_response(True, {'application_id': result['data']}, "Postulación creada exitosamente")
            else:
                return internal_response(False, None, result.get('message', 'Error al crear postulación'))
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def get_applications_by_student(student_id):
        try:
            sql = """
                SELECT a.application_id, a.status, a.match_percentage,
                       TO_CHAR(a.created_at, 'YYYY-MM-DD') as created_at,
                       v.vacancy_id, v.title, v.area, v.modality, v.location,
                       cp.company_name
                FROM public.applications a
                JOIN public.vacancies v ON a.vacancy_id = v.vacancy_id
                JOIN public.company_profiles cp ON v.company_id = cp.company_id
                WHERE a.student_id = %s
                ORDER BY a.created_at DESC
            """
            result = DataBaseHandle.getRecords(sql, 0, (student_id,))
            if result['result']:
                return internal_response(True, result['data'] or [], "Postulaciones encontradas")
            return internal_response(False, [], result.get('message', 'Error'))
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, [], str(err))

    @staticmethod
    def get_applications_by_vacancy(vacancy_id):
        try:
            sql = """
                SELECT a.application_id, a.status, a.match_percentage,
                       TO_CHAR(a.created_at, 'YYYY-MM-DD') as created_at,
                       sp.profile_id as student_id,
                       u.name || ' ' || u.lastname as student_name,
                       u.email, sp.career, sp.semester
                FROM public.applications a
                JOIN public.student_profiles sp ON a.student_id = sp.profile_id
                JOIN public.users u ON sp.user_id = u.user_id
                WHERE a.vacancy_id = %s
                ORDER BY a.match_percentage DESC
            """
            result = DataBaseHandle.getRecords(sql, 0, (vacancy_id,))
            if result['result']:
                return internal_response(True, result['data'] or [], "Postulantes encontrados")
            return internal_response(False, [], result.get('message', 'Error'))
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, [], str(err))

    @staticmethod
    def update_application_status(application_id, new_status):
        try:
            sql = """
                UPDATE public.applications 
                SET status = %s, updated_at = NOW()
                WHERE application_id = %s
            """
            result = DataBaseHandle.ExecuteNonQuery(sql, (new_status, application_id))
            if result['result']:
                return internal_response(True, None, "Estado actualizado")
            return internal_response(False, None, result.get('message', 'Error'))
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))
