from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response
from datetime import datetime

class VacancyComponent:
    @staticmethod
    def create_vacancy(institucion_id, titulo, area, descripcion, requisitos,
                       modalidad, ubicacion, cupos=1, fecha_expiracion=None, skills=None,
                       total_horas=None, horas_diarias=None, horario=None, supervisor_id=None):
        try:
            result = False
            data = None
            message = None

            if fecha_expiracion and isinstance(fecha_expiracion, str):
                try:
                    fecha_expiracion = datetime.strptime(fecha_expiracion, '%Y-%m-%d')
                except ValueError:
                    fecha_expiracion = None

            sql = '''
            INSERT INTO public.vacantes 
                (institucion_id, titulo, area, descripcion, requisitos, 
                 modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, fecha_expiracion, supervisor_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING vacante_id;
            '''
            params = (institucion_id, titulo, area, descripcion, requisitos,
                      modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, fecha_expiracion, supervisor_id)

            db_result = DataBaseHandle.ExecuteNonQuery(sql, params)
            if db_result['result']:
                vacante_id = db_result['data']
                if skills:
                    VacancyComponent._add_vacancy_skills(vacante_id, skills)
                result = True
                data = vacante_id
                message = "Vacante creada exitosamente"
                # Pre-calcular NLP para todos los estudiantes de la facultad
                try:
                    from ...api.Components.recomendacion_hibrida_component import RecomendacionHibridaComponent
                    sql_fac = "SELECT facultad_id FROM public.instituciones WHERE institucion_id = %s"
                    fac_res = DataBaseHandle.getRecords(sql_fac, 1, (institucion_id,))
                    if fac_res['result'] and fac_res['data'] and fac_res['data'].get('facultad_id'):
                        RecomendacionHibridaComponent.precalcular_afinidad_vacante_background(vacante_id, fac_res['data']['facultad_id'])
                except Exception:
                    pass
            else:
                message = db_result.get('message', "Error al crear la vacante")

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error al crear vacante: " + str(err)
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def _add_vacancy_skills(vacante_id, skills):
        try:
            seen_ids = set()
            for skill_data in skills:
                habilidad_id = skill_data.get('skill_id') or skill_data.get('habilidad_id')
                name = skill_data.get('name') or skill_data.get('nombre')
                
                if not habilidad_id and name:
                    cleaned_name = name.strip()
                    if not cleaned_name:
                        continue
                        
                    sql_find = "SELECT habilidad_id FROM public.habilidades WHERE LOWER(nombre) = LOWER(%s) LIMIT 1"
                    res_skill = DataBaseHandle.getRecords(sql_find, 1, (cleaned_name,))
                    
                    if res_skill['result'] and res_skill['data']:
                        habilidad_id = res_skill['data']['habilidad_id']
                    else:
                        category = skill_data.get('category') or skill_data.get('categoria') or 'Manual'
                        sql_insert = "INSERT INTO public.habilidades (nombre, categoria) VALUES (%s, %s) RETURNING habilidad_id"
                        insert_res = DataBaseHandle.ExecuteNonQuery(sql_insert, (cleaned_name, category))
                        if insert_res['result'] and insert_res['data']:
                            habilidad_id = insert_res['data']
                            
                if not habilidad_id or habilidad_id in seen_ids:
                    continue
                    
                seen_ids.add(habilidad_id)
                nivel_requerido = skill_data.get('required_level') or skill_data.get('nivel_requerido', 1)
                es_opcional = skill_data.get('is_optional') or skill_data.get('es_opcional', False)
                
                sql = '''
                INSERT INTO public.habilidades_vacante (vacante_id, habilidad_id, nivel_requerido, es_opcional)
                VALUES (%s, %s, %s, %s)
                '''
                DataBaseHandle.ExecuteNonQuery(sql, (vacante_id, habilidad_id, nivel_requerido, es_opcional))
        except Exception as err:
            HandleLogs.write_log("Error al agregar habilidades: " + str(err))

    @staticmethod
    def get_all_vacancies(facultad_id=None):
        try:
            result = False
            data = None
            message = None

            where_clause = ""
            params = []
            if facultad_id:
                where_clause = "WHERE i.facultad_id = %s"
                params.append(facultad_id)

            sql = f'''
                SELECT v.vacante_id, v.titulo, v.area, v.descripcion, v.requisitos,
                    v.modalidad, v.ubicacion, v.total_horas, v.horas_diarias, v.horario,
                    v.cupos, v.activo, v.supervisor_id,
                    i.nombre as nombre_empresa, i.correo_contacto, i.industria, i.facultad_id,
                    u.nombre || ' ' || u.apellido as persona_contacto,
                    TO_CHAR(v.creado_en, 'YYYY-MM-DD') as creado_en,
                    TO_CHAR(v.fecha_expiracion, 'YYYY-MM-DD') as fecha_expiracion,
                    COALESCE(p.total, 0) as total_postulaciones
                FROM public.vacantes v
                JOIN public.instituciones i ON v.institucion_id = i.institucion_id
                JOIN public.usuarios u ON i.usuario_id = u.usuario_id
                LEFT JOIN (
                    SELECT vacante_id, COUNT(*) as total
                    FROM public.postulaciones
                    GROUP BY vacante_id
                ) p ON p.vacante_id = v.vacante_id
                {where_clause}
                ORDER BY v.creado_en DESC;
            '''
            db_result = DataBaseHandle.getRecords(sql, 0, tuple(params)) if params else DataBaseHandle.getRecords(sql, 0)

            if db_result['result']:
                result = True
                data = db_result['data'] or []
                if data:
                    vacante_ids = [v['vacante_id'] for v in data]
                    sql_skills = '''
                        SELECT hv.vacante_id, h.habilidad_id, h.nombre as habilidad_nombre, h.categoria,
                               hv.nivel_requerido, hv.es_opcional
                        FROM public.habilidades_vacante hv
                        JOIN public.habilidades h ON hv.habilidad_id = h.habilidad_id
                        WHERE hv.vacante_id = ANY(%s)
                    '''
                    skills_res = DataBaseHandle.getRecords(sql_skills, 0, (vacante_ids,))
                    skills_by_vacante = {}
                    if skills_res['result'] and skills_res['data']:
                        for s in skills_res['data']:
                            vid = s['vacante_id']
                            if vid not in skills_by_vacante:
                                skills_by_vacante[vid] = []
                            skills_by_vacante[vid].append(s)
                    for v in data:
                        v['skills'] = skills_by_vacante.get(v['vacante_id'], [])
            else:
                message = db_result.get('message', "No hay vacantes disponibles")

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error al obtener vacantes: " + str(err)
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def get_vacancies_by_company(institucion_id):
        try:
            result = False
            data = None
            message = None

            sql = '''
                SELECT v.vacante_id, v.titulo, v.area, v.descripcion, v.requisitos,
                       v.modalidad, v.ubicacion, v.total_horas, v.horas_diarias, v.horario,
                       v.cupos, v.activo, v.supervisor_id,
                       TO_CHAR(v.creado_en, 'YYYY-MM-DD') as creado_en,
                       TO_CHAR(v.fecha_expiracion, 'YYYY-MM-DD') as fecha_expiracion,
                       COALESCE(p.total, 0) as total_postulaciones
                FROM public.vacantes v
                LEFT JOIN (
                    SELECT vacante_id, COUNT(*) as total 
                    FROM public.postulaciones 
                    GROUP BY vacante_id
                ) p ON p.vacante_id = v.vacante_id
                WHERE v.institucion_id = %s
                ORDER BY v.creado_en DESC;
            '''
            db_result = DataBaseHandle.getRecords(sql, 0, (institucion_id,))

            if db_result['result']:
                result = True
                data = db_result['data'] or []
                if data:
                    vacante_ids = [v['vacante_id'] for v in data]
                    sql_skills = '''
                        SELECT hv.vacante_id, h.habilidad_id, h.nombre as habilidad_nombre, h.categoria,
                               hv.nivel_requerido, hv.es_opcional
                        FROM public.habilidades_vacante hv
                        JOIN public.habilidades h ON hv.habilidad_id = h.habilidad_id
                        WHERE hv.vacante_id = ANY(%s)
                    '''
                    skills_res = DataBaseHandle.getRecords(sql_skills, 0, (vacante_ids,))
                    skills_by_vacante = {}
                    if skills_res['result'] and skills_res['data']:
                        for s in skills_res['data']:
                            vid = s['vacante_id']
                            if vid not in skills_by_vacante:
                                skills_by_vacante[vid] = []
                            skills_by_vacante[vid].append(s)
                    for v in data:
                        v['skills'] = skills_by_vacante.get(v['vacante_id'], [])
            else:
                message = db_result.get('message', "No hay vacantes")

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error: " + str(err)
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def get_vacancy_details(vacante_id):
        try:
            result = False
            data = None
            message = None

            sql = '''
                SELECT v.vacante_id, v.titulo, v.area, v.descripcion, v.requisitos,
                       v.modalidad, v.ubicacion, v.total_horas, v.horas_diarias, v.horario,
                       v.cupos, v.activo, v.supervisor_id, sup.nombre as supervisor_nombre,
                       i.nombre as nombre_empresa, i.industria, i.correo_contacto, 
                       i.direccion as ubicacion_empresa, i.ruc,
                       u.nombre || ' ' || u.apellido as persona_contacto,
                       TO_CHAR(v.creado_en, 'YYYY-MM-DD') as creado_en,
                       TO_CHAR(v.fecha_expiracion, 'YYYY-MM-DD') as fecha_expiracion
                FROM public.vacantes v
                JOIN public.instituciones i ON v.institucion_id = i.institucion_id
                JOIN public.usuarios u ON i.usuario_id = u.usuario_id
                LEFT JOIN public.supervisores sup ON v.supervisor_id = sup.supervisor_id
                WHERE v.vacante_id = %s
            '''
            db_result = DataBaseHandle.getRecords(sql, 1, (vacante_id,))

            if db_result['result'] and db_result['data']:
                sql_skills = '''
                    SELECT h.habilidad_id, h.nombre as habilidad_nombre, h.categoria,
                           hv.nivel_requerido, hv.es_opcional
                    FROM public.habilidades_vacante hv
                    JOIN public.habilidades h ON hv.habilidad_id = h.habilidad_id
                    WHERE hv.vacante_id = %s
                '''
                skills_result = DataBaseHandle.getRecords(sql_skills, 0, (vacante_id,))
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
            sql_skills = "SELECT habilidad_id as id, nombre, categoria FROM public.habilidades ORDER BY nombre;"
            skills = DataBaseHandle.getRecords(sql_skills, 0)
            
            data = {
                'modalities': [
                    {'id': 1, 'name': 'Presencial'},
                    {'id': 2, 'name': 'Remoto'},
                    {'id': 3, 'name': 'Híbrido'}
                ],
                'total_hours_options': [
                    {'value': 96, 'label': '96 horas'},
                    {'value': 144, 'label': '144 horas'},
                    {'value': 240, 'label': '240 horas'}
                ],
                'skills': skills['data'] if skills['result'] else []
            }
            return internal_response(True, data, "Catálogo cargado")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))
    
    @staticmethod
    def update_vacancy(vacante_id, p_data):
        try:
            sql = """
                UPDATE public.vacantes 
                SET titulo = %s, area = %s, descripcion = %s, requisitos = %s,
                    modalidad = %s, ubicacion = %s, total_horas = %s, horas_diarias = %s,
                    horario = %s, cupos = %s, activo = %s, fecha_expiracion = %s, 
                    supervisor_id = %s, actualizado_en = NOW()
                WHERE vacante_id = %s
            """
            DataBaseHandle.ExecuteNonQuery(sql, (
                p_data.get('titulo') or p_data.get('title'),
                p_data.get('area'),
                p_data.get('descripcion') or p_data.get('description'),
                p_data.get('requisitos') or p_data.get('requirements'),
                p_data.get('modalidad') or p_data.get('modality'),
                p_data.get('ubicacion') or p_data.get('location'),
                p_data.get('total_horas') or p_data.get('total_hours'),
                p_data.get('horas_diarias') or p_data.get('daily_hours'),
                p_data.get('horario') or p_data.get('schedule'),
                p_data.get('cupos', 1) if 'cupos' in p_data else p_data.get('slots', 1),
                p_data.get('activo', True) if 'activo' in p_data else p_data.get('is_active', True),
                p_data.get('fecha_expiracion') or p_data.get('expires_at'),
                p_data.get('supervisor_id'),
                vacante_id
            ))
            
            if 'skills' in p_data:
                DataBaseHandle.ExecuteNonQuery("DELETE FROM public.habilidades_vacante WHERE vacante_id = %s", (vacante_id,))
                VacancyComponent._add_vacancy_skills(vacante_id, p_data['skills'])

            # Recalcular afinidad para esta vacante en todos los estudiantes
            try:
                from ...api.Components.recomendacion_hibrida_component import RecomendacionHibridaComponent
                sql_fac = """
                    SELECT i.facultad_id 
                    FROM public.vacantes v 
                    JOIN public.instituciones i ON v.institucion_id = i.institucion_id 
                    WHERE v.vacante_id = %s
                """
                fac_res = DataBaseHandle.getRecords(sql_fac, 1, (vacante_id,))
                if fac_res['result'] and fac_res['data']:
                    RecomendacionHibridaComponent.precalcular_afinidad_vacante_background(vacante_id, fac_res['data']['facultad_id'])
            except Exception:
                pass
                
            return internal_response(True, None, "Vacante actualizada")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def delete_vacancy(vacante_id, is_admin=False):
        try:
            if not is_admin:
                sql_check = "SELECT COUNT(*) as pendientes FROM public.postulaciones WHERE vacante_id = %s AND estado = 'pendiente'"
                res_check = DataBaseHandle.getRecords(sql_check, 1, (vacante_id,))
                
                if res_check['result'] and res_check['data'] and res_check['data']['pendientes'] > 0:
                    pendientes = res_check['data']['pendientes']
                    return internal_response(False, None, f"No puedes cerrar la vacante. Tienes {pendientes} postulante(s) en estado pendiente. Debes rechazarlos o procesarlos antes de cerrar.")

            # Cambiar estado de postulaciones pendientes a 'cancelada' para liberar al estudiante
            sql_update_postulaciones = "UPDATE public.postulaciones SET estado = 'cancelada' WHERE vacante_id = %s AND estado = 'pendiente'"
            DataBaseHandle.ExecuteNonQuery(sql_update_postulaciones, (vacante_id,))

            sql = "UPDATE public.vacantes SET activo = false WHERE vacante_id = %s"
            DataBaseHandle.ExecuteNonQuery(sql, (vacante_id,))
            # Invalidar caché NLP para esta vacante
            try:
                from ...api.Components.recomendacion_component import RecomendacionComponent
                RecomendacionComponent.invalidar_cache_vacante(vacante_id)
            except Exception:
                pass
            return internal_response(True, None, "Vacante cerrada exitosamente")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))