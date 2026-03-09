from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response
from datetime import datetime

class VacancyComponent:
    @staticmethod
    def create_vacancy(company_id, title, area, description, requirements,
                       modality, location, slots=1, expires_at=None, skills=None):
        try:
            result = False
            data = None
            message = None

            if expires_at and isinstance(expires_at, str):
                try:
                    expires_at = datetime.strptime(expires_at, '%Y-%m-%d')
                except ValueError:
                    expires_at = None

            sql = '''
            INSERT INTO public.vacancies 
                (company_id, title, area, description, requirements, 
                 modality, location, slots, expires_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING vacancy_id;
            '''
            params = (company_id, title, area, description, requirements,
                      modality, location, slots, expires_at)

            db_result = DataBaseHandle.ExecuteNonQuery(sql, params)
            if db_result['result']:
                vacancy_id = db_result['data']
                if skills:
                    VacancyComponent._add_vacancy_skills(vacancy_id, skills)
                result = True
                data = vacancy_id
                message = "Vacante creada exitosamente"
            else:
                message = db_result.get('message', "Error al crear la vacante")

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error al crear vacante: " + str(err)
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def _add_vacancy_skills(vacancy_id, skills):
        try:
            for skill_data in skills:
                skill_id = skill_data.get('skill_id')
                required_level = skill_data.get('required_level', 1)
                is_optional = skill_data.get('is_optional', False)
                sql = '''
                INSERT INTO public.vacancy_skills (vacancy_id, skill_id, required_level, is_optional)
                VALUES (%s, %s, %s, %s)
                '''
                DataBaseHandle.ExecuteNonQuery(sql, (vacancy_id, skill_id, required_level, is_optional))
        except Exception as err:
            HandleLogs.write_log("Error al agregar habilidades: " + str(err))

    @staticmethod
    def get_all_vacancies():
        try:
            result = False
            data = None
            message = None

            sql = '''
                SELECT v.vacancy_id, v.title, v.area, v.description, v.requirements,
                    v.modality, v.location, v.slots, v.is_active,
                    cp.company_name, cp.contact_email, cp.industry,
                    u.name || ' ' || u.lastname as contact_person,
                    TO_CHAR(v.created_at, 'YYYY-MM-DD') as created_at,
                    TO_CHAR(v.expires_at, 'YYYY-MM-DD') as expires_at,
                    (SELECT COUNT(*) FROM public.applications a WHERE a.vacancy_id = v.vacancy_id) as applications_count
                FROM public.vacancies v
                JOIN public.company_profiles cp ON v.company_id = cp.company_id
                JOIN public.users u ON cp.user_id = u.user_id
                WHERE v.is_active = true
                ORDER BY v.created_at DESC;
            '''
            db_result = DataBaseHandle.getRecords(sql, 0)

            if db_result['result']:
                result = True
                data = db_result['data'] or []
            else:
                message = db_result.get('message', "No hay vacantes disponibles")

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error al obtener vacantes: " + str(err)
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def get_vacancies_by_company(company_id):
        try:
            result = False
            data = None
            message = None

            sql = '''
                SELECT v.vacancy_id, v.title, v.area, v.description, v.requirements,
                       v.modality, v.location, v.slots, v.is_active,
                       TO_CHAR(v.created_at, 'YYYY-MM-DD') as created_at,
                       TO_CHAR(v.expires_at, 'YYYY-MM-DD') as expires_at,
                       (SELECT COUNT(*) FROM public.applications a WHERE a.vacancy_id = v.vacancy_id) as applications_count
                FROM public.vacancies v
                WHERE v.company_id = %s
                ORDER BY v.created_at DESC;
            '''
            db_result = DataBaseHandle.getRecords(sql, 0, (company_id,))

            if db_result['result']:
                result = True
                data = db_result['data'] or []
            else:
                message = db_result.get('message', "No hay vacantes")

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error: " + str(err)
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def get_vacancy_details(vacancy_id):
        try:
            result = False
            data = None
            message = None

            sql = '''
                SELECT v.vacancy_id, v.title, v.area, v.description, v.requirements,
                       v.modality, v.location, v.slots, v.is_active,
                       cp.company_name, cp.industry, cp.contact_email, cp.location as company_location,
                       u.name || ' ' || u.lastname as contact_person,
                       TO_CHAR(v.created_at, 'YYYY-MM-DD') as created_at,
                       TO_CHAR(v.expires_at, 'YYYY-MM-DD') as expires_at
                FROM public.vacancies v
                JOIN public.company_profiles cp ON v.company_id = cp.company_id
                JOIN public.users u ON cp.user_id = u.user_id
                WHERE v.vacancy_id = %s
            '''
            db_result = DataBaseHandle.getRecords(sql, 1, (vacancy_id,))

            if db_result['result'] and db_result['data']:
                # Obtener skills de la vacante
                sql_skills = '''
                    SELECT s.skill_id, s.name as skill_name, s.category,
                           vs.required_level, vs.is_optional
                    FROM public.vacancy_skills vs
                    JOIN public.skills s ON vs.skill_id = s.skill_id
                    WHERE vs.vacancy_id = %s
                '''
                skills_result = DataBaseHandle.getRecords(sql_skills, 0, (vacancy_id,))
                db_result['data']['skills'] = skills_result['data'] if skills_result['result'] else []
                
                result = True
                data = db_result['data']
            else:
                message = "Vacante no encontrada"

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error: " + str(err)
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def get_catalog_options():
        try:
            sql_skills = "SELECT skill_id as id, name, category FROM public.skills ORDER BY name;"
            skills = DataBaseHandle.getRecords(sql_skills, 0)
            
            data = {
                'modalities': [
                    {'id': 1, 'name': 'Presencial'},
                    {'id': 2, 'name': 'Remoto'},
                    {'id': 3, 'name': 'Híbrido'}
                ],
                'skills': skills['data'] if skills['result'] else []
            }
            return internal_response(True, data, "Catálogo cargado")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))
    
    @staticmethod
    def update_vacancy(vacancy_id, p_data):
        try:
            sql = """
                UPDATE public.vacancies 
                SET title = %s, area = %s, description = %s, requirements = %s,
                    modality = %s, location = %s, slots = %s, 
                    is_active = %s, expires_at = %s, updated_at = NOW()
                WHERE vacancy_id = %s
            """
            DataBaseHandle.ExecuteNonQuery(sql, (
                p_data.get('title'), p_data.get('area'), p_data.get('description'),
                p_data.get('requirements'), p_data.get('modality'), p_data.get('location'),
                p_data.get('slots', 1), p_data.get('is_active', True),
                p_data.get('expires_at'), vacancy_id
            ))
            return internal_response(True, None, "Vacante actualizada")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def delete_vacancy(vacancy_id):
        try:
            sql = "DELETE FROM public.vacancies WHERE vacancy_id = %s"
            DataBaseHandle.ExecuteNonQuery(sql, (vacancy_id,))
            return internal_response(True, None, "Vacante eliminada")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))