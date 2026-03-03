from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response
from datetime import datetime

class VacancyComponent:
    @staticmethod
    def create_vacancy(company_id, title, area, description, requirements,
                       modality_id, availability_id, daily_hours_id,
                       duration_id, vacancies_available=1, expires_at=None, skills=None):
        try:
            result = False
            data = None
            message = None

            # Convertir expires_at si viene como string
            if expires_at and isinstance(expires_at, str):
                try:
                    expires_at = datetime.strptime(expires_at, '%Y-%m-%d')
                except ValueError:
                    HandleLogs.write_log(f"Formato de fecha inválido: {expires_at}")
                    expires_at = None

            sql = '''
            INSERT INTO dawa.tb_vacancy 
                (company_id, title, area, description, requirements, 
                 modality_id, availability_id, daily_hours_id, duration_id,
                 vacancies_available, expires_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING vacancy_id;
            '''

            params = (company_id, title, area, description, requirements,
                      modality_id, availability_id, daily_hours_id, duration_id,
                      vacancies_available, expires_at)

            db_result = DataBaseHandle.ExecuteNonQuery(sql, params)
            if db_result['result']:
                vacancy_id = db_result['data']
                # Insertar habilidades si se proporcionan
                if skills:
                    VacancyComponent._add_vacancy_skills(vacancy_id, skills)

                result = True
                data = vacancy_id
                message = "Vacante creada exitosamente"
            else:
                message = db_result.get('message', "Error al crear la vacante")

        except Exception as err:
            HandleLogs.write_log("Error en la creación de la vacante -> " + str(err))
            HandleLogs.write_error(err)
            message = "Error atrapado en el componente de creación de vacante: " + err.__str__()
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def _add_vacancy_skills(vacancy_id, skills):
        """Agrega habilidades a una vacante"""
        try:
            for skill_data in skills:
                skill_id = skill_data.get('skill_id')
                required_level = skill_data.get('required_level', 1)
                is_optional = skill_data.get('is_optional', False)

                sql = '''
                INSERT INTO dawa.tb_vacancy_skill (vacancy_id, skill_id, required_level, is_optional)
                VALUES (%s, %s, %s, %s)
                '''
                params = (vacancy_id, skill_id, required_level, is_optional)
                DataBaseHandle.ExecuteNonQuery(sql, params)

        except Exception as err:
            HandleLogs.write_log("Error al agregar habilidades a la vacante -> " + str(err))
            # No interrumpir el flujo principal si falla una habilidad

    @staticmethod
    def get_all_vacancies():
        """Obtiene todas las vacantes activas con información detallada"""
        try:
            result = False
            data = None
            message = None

            sql = '''
                SELECT v.vacancy_id, v.title, v.area, v.description, v.requirements,
                m.name as modality_name, a.name as availability_name, dh.hours_per_day,
                pd.total_hours as duration_hours, v.vacancies_available, v.is_active,
                cp.company_name, u.u_name || ' ' || u.u_lastname as contact_person, cp.contact_email,
                TO_CHAR(v.created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                TO_CHAR(v.expires_at, 'YYYY-MM-DD') as expires_at,
                ARRAY_AGG(json_build_object(
                        'skill_name', s.name,
                        'required_level', vs.required_level,
                        'is_optional', vs.is_optional
                    )) as skills
               FROM dawa.tb_vacancy v
                LEFT JOIN dawa.tb_modality m ON v.modality_id = m.modality_id
                LEFT JOIN dawa.tb_availability a ON v.availability_id = a.availability_id
                LEFT JOIN dawa.tb_daily_hours dh ON v.daily_hours_id = dh.daily_hours_id
                LEFT JOIN dawa.tb_practice_duration pd ON v.duration_id = pd.duration_id
                LEFT JOIN dawa.tb_company_profile cp ON v.company_id = cp.company_id
                LEFT JOIN dawa.tb_user u ON cp.user_id = u.u_id
                LEFT JOIN dawa.tb_vacancy_skill vs ON v.vacancy_id = vs.vacancy_id
                LEFT JOIN dawa.tb_skill s ON vs.skill_id = s.skill_id
                WHERE v.is_active = true
                GROUP BY 
                    v.vacancy_id, v.title, v.area, v.description, v.requirements,
                    m.name, a.name, dh.hours_per_day, pd.total_hours,
                    v.vacancies_available, v.is_active, cp.company_name,
                    u.u_name, u.u_lastname, cp.contact_email, v.created_at, v.expires_at
                ORDER BY v.created_at DESC;
            '''
            db_result = DataBaseHandle.getRecords(sql, 0)

            if db_result['result']:
                result = True
                data = db_result['data']
                # Limpiar datos de habilidades NULL
                for vacancy in data:
                    if vacancy['skills'] and len(vacancy['skills']) == 1 and vacancy['skills'][0] is None:
                        vacancy['skills'] = []
            else:
                message = db_result.get('message', "No hay vacantes disponibles")

        except Exception as err:
            HandleLogs.write_log("Error al obtener las vacantes -> " + str(err))
            HandleLogs.write_error(err)
            message = "Error atrapado en el componente de obtención de vacantes: " + err.__str__()
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def get_vacancies_by_company(company_id):
        """Obtiene las vacantes de una empresa específica"""
        try:
            result = False
            data = None
            message = None

            sql = '''
                SELECT 
                    v.vacancy_id,
                    v.title,
                    v.area,
                    v.description,
                    m.name as modality_name,
                    a.name as availability_name,
                    dh.hours_per_day,
                    pd.total_hours as duration_hours,
                    v.vacancies_available,
                    v.is_active,
                    TO_CHAR(v.created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                    TO_CHAR(v.expires_at, 'YYYY-MM-DD') as expires_at,
                    COUNT(app.application_id) as applications_count
                FROM dawa.tb_vacancy v
                LEFT JOIN dawa.tb_modality m ON v.modality_id = m.modality_id
                LEFT JOIN dawa.tb_availability a ON v.availability_id = a.availability_id
                LEFT JOIN dawa.tb_daily_hours dh ON v.daily_hours_id = dh.daily_hours_id
                LEFT JOIN dawa.tb_practice_duration pd ON v.duration_id = pd.duration_id
                LEFT JOIN dawa.tb_application app ON v.vacancy_id = app.vacancy_id
                WHERE v.company_id = %s
                GROUP BY 
                    v.vacancy_id, v.title, v.area, v.description,
                    m.name, a.name, dh.hours_per_day, pd.total_hours,
                    v.vacancies_available, v.is_active, v.created_at, v.expires_at
                ORDER BY v.created_at DESC;
            '''

            db_result = DataBaseHandle.getRecords(sql, 0, (company_id,))

            if db_result['result']:
                result = True
                data = db_result['data']
            else:
                message = db_result.get('message', "No hay vacantes para esta empresa")

        except Exception as err:
            HandleLogs.write_log("Error al obtener vacantes por empresa -> " + str(err))
            HandleLogs.write_error(err)
            message = "Error atrapado en el componente: " + err.__str__()
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def get_vacancy_details(vacancy_id):
        """Obtiene los detalles completos de una vacante específica"""
        try:
            result = False
            data = None
            message = None

            sql = '''
                SELECT 
                    v.vacancy_id,
                    v.title,
                    v.area,
                    v.description,
                    v.requirements,
                    m.name as modality_name,
                    m.modality_id,
                    a.name as availability_name,
                    a.availability_id,
                    dh.hours_per_day,
                    dh.daily_hours_id,
                    pd.total_hours as duration_hours,
                    pd.duration_id,
                    v.vacancies_available,
                    v.is_active,
                    cp.company_name,
                    cp.description as company_description,
                    cp.industry,
                    cp.website,
                    cp.contact_email,
                    cp.location,
                    u.u_name || ' ' || u.u_lastname as contact_person,
                    TO_CHAR(v.created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                    TO_CHAR(v.expires_at, 'YYYY-MM-DD') as expires_at,
                    ARRAY_AGG(json_build_object(
                        'skill_id', s.skill_id,
                        'skill_name', s.name,
                        'required_level', vs.required_level,
                        'is_optional', vs.is_optional
                    )) as skills
                FROM dawa.tb_vacancy v
                LEFT JOIN dawa.tb_modality m ON v.modality_id = m.modality_id
                LEFT JOIN dawa.tb_availability a ON v.availability_id = a.availability_id
                LEFT JOIN dawa.tb_daily_hours dh ON v.daily_hours_id = dh.daily_hours_id
                LEFT JOIN dawa.tb_practice_duration pd ON v.duration_id = pd.duration_id
                LEFT JOIN dawa.tb_company_profile cp ON v.company_id = cp.company_id
                LEFT JOIN dawa.tb_user u ON cp.user_id = u.u_id
                LEFT JOIN dawa.tb_vacancy_skill vs ON v.vacancy_id = vs.vacancy_id
                LEFT JOIN dawa.tb_skill s ON vs.skill_id = s.skill_id
                WHERE v.vacancy_id = %s
                GROUP BY 
                    v.vacancy_id, v.title, v.area, v.description, v.requirements,
                    m.name, m.modality_id, a.name, a.availability_id,
                    dh.hours_per_day, dh.daily_hours_id, pd.total_hours, pd.duration_id,
                    v.vacancies_available, v.is_active, cp.company_name,
                    cp.description, cp.industry, cp.website, cp.contact_email,
                    cp.location, u.u_name, u.u_lastname, v.created_at, v.expires_at;
            '''

            db_result = DataBaseHandle.getRecords(sql, 1, (vacancy_id,))

            if db_result['result'] and db_result['data']:
                result = True
                data = db_result['data']
                # Limpiar datos de habilidades NULL
                if data['skills'] and len(data['skills']) == 1 and data['skills'][0] is None:
                    data['skills'] = []
            else:
                message = "Vacante no encontrada"

        except Exception as err:
            HandleLogs.write_log("Error al obtener detalles de vacante -> " + str(err))
            HandleLogs.write_error(err)
            message = "Error atrapado: " + err.__str__()
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def get_catalog_options():
        """Obtiene las opciones para los catálogos (modalidad, disponibilidad, etc.)"""
        try:
            result = False
            data = None
            message = None

            sql_modality = "SELECT modality_id as id, name FROM dawa.tb_modality ORDER BY name;"
            sql_availability = "SELECT availability_id as id, name FROM dawa.tb_availability ORDER BY name;"
            sql_daily_hours = "SELECT daily_hours_id as id, hours_per_day as name FROM dawa.tb_daily_hours ORDER BY hours_per_day;"
            sql_duration = "SELECT duration_id as id, total_hours as name FROM dawa.tb_practice_duration ORDER BY total_hours;"
            sql_skills = "SELECT skill_id as id, name FROM dawa.tb_skill ORDER BY name;"

            modalities = DataBaseHandle.getRecords(sql_modality, 0)
            availabilities = DataBaseHandle.getRecords(sql_availability, 0)
            daily_hours = DataBaseHandle.getRecords(sql_daily_hours, 0)
            durations = DataBaseHandle.getRecords(sql_duration, 0)
            skills = DataBaseHandle.getRecords(sql_skills, 0)

            if (modalities['result'] and availabilities['result'] and
                    daily_hours['result'] and durations['result'] and skills['result']):

                result = True
                data = {
                    'modalities': modalities['data'],
                    'availabilities': availabilities['data'],
                    'daily_hours': daily_hours['data'],
                    'durations': durations['data'],
                    'skills': skills['data']
                }
            else:
                message = "Error al cargar las opciones del catálogo"

        except Exception as err:
            HandleLogs.write_log("Error al obtener opciones del catálogo -> " + str(err))
            HandleLogs.write_error(err)
            message = "Error: " + err.__str__()
        finally:
            return internal_response(result, data, message)