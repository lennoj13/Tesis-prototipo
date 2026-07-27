import re

from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response

class ApplicationComponent:
    @staticmethod
    def create_application(estudiante_id, vacante_id, porcentaje_afinidad=0):
        try:
            # Validar que el estudiante sea de 8vo semestre o superior
            sql_sem = "SELECT semestre FROM public.perfiles_estudiante WHERE perfil_id = %s"
            sem_result = DataBaseHandle.getRecords(sql_sem, 1, (estudiante_id,))
            if sem_result['result'] and sem_result['data']:
                semestre = sem_result['data'].get('semestre')
                if not semestre or not semestre.isdigit() or int(semestre) < 8:
                    return internal_response(
                        False, None,
                        "Solo los estudiantes de octavo semestre o superior pueden postular a vacantes."
                    )

            # Validar que el estudiante no tenga una postulacion activa
            sql_check = """
                SELECT p.postulacion_id, p.estado, v.titulo as vacante_titulo
                FROM public.postulaciones p
                JOIN public.vacantes v ON p.vacante_id = v.vacante_id
                WHERE p.estudiante_id = %s 
                  AND p.estado IN ('pendiente', 'entrevista', 'aceptada_empresa', 'aceptada')
                LIMIT 1
            """
            check_result = DataBaseHandle.getRecords(sql_check, 1, (estudiante_id,))
            if check_result['result'] and check_result['data']:
                active = check_result['data']
                estado_labels = {
                    'pendiente': 'pendiente',
                    'entrevista': 'en fase de entrevista',
                    'aceptada_empresa': 'aceptada por empresa',
                    'aceptada': 'en curso'
                }
                estado_label = estado_labels.get(active['estado'], 'en curso')
                return internal_response(
                    False, None,
                    f"Ya tienes una postulacion {estado_label} en la vacante \"{active['vacante_titulo']}\". "
                    "Debes esperar a que sea procesada antes de postularte a otra."
                )

            import json
            try:
                DataBaseHandle.ExecuteNonQuery("ALTER TABLE public.postulaciones ADD COLUMN IF NOT EXISTS habilidades_snapshot JSONB DEFAULT '[]'::jsonb;")
            except Exception:
                pass

            # Tomar una "foto" completa del perfil del estudiante al momento de postularse
            sql_skills = """
                SELECT he.habilidad_id, h.nombre as habilidad_nombre, h.categoria as habilidad_categoria, he.nivel
                FROM public.habilidades_estudiante he
                JOIN public.habilidades h ON he.habilidad_id = h.habilidad_id
                WHERE he.estudiante_id = %s
            """
            skills_res = DataBaseHandle.getRecords(sql_skills, 0, (estudiante_id,))
            skills_list = skills_res['data'] if skills_res['result'] and skills_res['data'] else []

            # Capturar experiencia e intereses del perfil
            sql_profile = """
                SELECT resumen_experiencia, intereses
                FROM public.perfiles_estudiante
                WHERE perfil_id = %s
            """
            profile_res = DataBaseHandle.getRecords(sql_profile, 1, (estudiante_id,))
            profile_data = profile_res['data'] if profile_res['result'] and profile_res['data'] else {}

            # Capturar foto de la vacante
            sql_vacante = """
                SELECT titulo, area, modalidad, ubicacion, descripcion, requisitos, horario, cupos, total_horas, horas_diarias
                FROM public.vacantes
                WHERE vacante_id = %s
            """
            vacante_res = DataBaseHandle.getRecords(sql_vacante, 1, (vacante_id,))
            vacante_data = vacante_res['data'] if vacante_res['result'] and vacante_res['data'] else {}

            snapshot = {
                'habilidades': skills_list,
                'resumen_experiencia': profile_data.get('resumen_experiencia', ''),
                'intereses': profile_data.get('intereses', ''),
                'vacante': vacante_data
            }

            sql = """
                INSERT INTO public.postulaciones (estudiante_id, vacante_id, estado, porcentaje_afinidad, habilidades_snapshot, creado_en, actualizado_en)
                VALUES (%s, %s, 'pendiente', %s, %s, NOW(), NOW())
                RETURNING postulacion_id
            """
            result = DataBaseHandle.ExecuteNonQuery(sql, (estudiante_id, vacante_id, porcentaje_afinidad, json.dumps(snapshot)))
            if result['result']:
                return internal_response(True, {'application_id': result['data']}, "Postulacion creada exitosamente")
            else:
                return internal_response(False, None, result.get('message', 'Error al crear postulacion'))
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def get_applications_by_student(estudiante_id):
        try:
            sql = """
                SELECT p.postulacion_id, p.estado, p.nro_solicitud,
                       CAST(p.porcentaje_afinidad AS FLOAT) as porcentaje_afinidad,
                       TO_CHAR(p.creado_en, 'YYYY-MM-DD') as creado_en,
                       TO_CHAR(p.fecha_entrevista, 'YYYY-MM-DD') as fecha_entrevista,
                       TO_CHAR(p.hora_entrevista, 'HH24:MI') as hora_entrevista,
                       p.modalidad_entrevista,
                       p.direccion_entrevista,
                       p.link_reunion,
                       TO_CHAR(p.fecha_respuesta_empresa, 'YYYY-MM-DD') as fecha_respuesta_empresa,
                       TO_CHAR(p.fecha_respuesta_gestor, 'YYYY-MM-DD') as fecha_respuesta_gestor,
                       p.habilidades_snapshot,
                       v.vacante_id, v.titulo, v.area, v.modalidad, v.ubicacion,
                       v.descripcion, v.requisitos, v.horario, v.cupos,
                       TO_CHAR(v.fecha_expiracion, 'YYYY-MM-DD') as fecha_expiracion,
                       v.total_horas, v.horas_diarias,
                       i.nombre as nombre_empresa
                FROM public.postulaciones p
                JOIN public.vacantes v ON p.vacante_id = v.vacante_id
                JOIN public.instituciones i ON v.institucion_id = i.institucion_id
                WHERE p.estudiante_id = %s
                ORDER BY p.creado_en DESC
            """
            result = DataBaseHandle.getRecords(sql, 0, (estudiante_id,))
            if result['result']:
                data = result['data'] or []
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
                    import json
                    for v in data:
                        v['skills'] = skills_by_vacante.get(v['vacante_id'], [])
                        if v.get('habilidades_snapshot'):
                            try:
                                snap = v['habilidades_snapshot']
                                raw = json.loads(snap) if isinstance(snap, str) else snap
                                if isinstance(raw, dict) and 'vacante' in raw and raw['vacante']:
                                    vac_snap = raw['vacante']
                                    for key in ['titulo', 'area', 'modalidad', 'ubicacion', 'descripcion', 'requisitos', 'horario', 'cupos', 'total_horas', 'horas_diarias']:
                                        if key in vac_snap:
                                            v[key] = vac_snap[key]
                            except Exception:
                                pass
                return internal_response(True, data, "Postulaciones encontradas")
            return internal_response(False, [], result.get('message', 'Error'))
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, [], str(err))

    @staticmethod
    def get_applications_by_vacancy(vacante_id):
        try:
            sql = """
                SELECT p.postulacion_id, p.estado, p.nro_solicitud,
                       CAST(p.porcentaje_afinidad AS FLOAT) as porcentaje_afinidad,
                       TO_CHAR(p.creado_en, 'YYYY-MM-DD') as creado_en,
                       pe.perfil_id as estudiante_id,
                       u.nombre || ' ' || u.apellido as nombre_estudiante,
                       u.correo, u.cedula, pe.semestre,
                       c.nombre as carrera
                FROM public.postulaciones p
                JOIN public.perfiles_estudiante pe ON p.estudiante_id = pe.perfil_id
                JOIN public.usuarios u ON pe.usuario_id = u.usuario_id
                LEFT JOIN public.carreras c ON pe.carrera_id = c.carrera_id
                WHERE p.vacante_id = %s
                ORDER BY p.porcentaje_afinidad DESC
            """
            result = DataBaseHandle.getRecords(sql, 0, (vacante_id,))
            if result['result']:
                return internal_response(True, result['data'] or [], "Postulantes encontrados")
            return internal_response(False, [], result.get('message', 'Error'))
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, [], str(err))

    @staticmethod
    def update_application_status(postulacion_id, nuevo_estado, notas=None, supervisor_id=None, entrevista_data=None):
        try:
            set_parts = ["estado = %s", "actualizado_en = NOW()"]
            params = [nuevo_estado]

            if nuevo_estado == 'entrevista':
                # Guardar datos de la entrevista programada
                if entrevista_data:
                    if entrevista_data.get('fecha_entrevista'):
                        set_parts.append("fecha_entrevista = %s")
                        params.append(entrevista_data['fecha_entrevista'])
                    if entrevista_data.get('hora_entrevista'):
                        set_parts.append("hora_entrevista = %s")
                        params.append(entrevista_data['hora_entrevista'])
                    if entrevista_data.get('modalidad_entrevista'):
                        set_parts.append("modalidad_entrevista = %s")
                        params.append(entrevista_data['modalidad_entrevista'])
                    if entrevista_data.get('direccion_entrevista'):
                        set_parts.append("direccion_entrevista = %s")
                        params.append(entrevista_data['direccion_entrevista'])
                    if entrevista_data.get('link_reunion'):
                        set_parts.append("link_reunion = %s")
                        params.append(entrevista_data['link_reunion'])
                if notas:
                    set_parts.append("notas_empresa = %s")
                    params.append(notas)
            elif nuevo_estado == 'aceptada_empresa':
                set_parts.append("fecha_respuesta_empresa = NOW()")
                if notas:
                    set_parts.append("notas_empresa = %s")
                    params.append(notas)
                if supervisor_id:
                    set_parts.append("supervisor_id = %s")
                    params.append(supervisor_id)
                
                # Despachar envío de correo al gestor
                try:
                    from ...utils.general.email_sender import EmailSender
                    
                    # 1. Obtener detalles de la postulación
                    sql_detalles = """
                        SELECT 
                            u_est.nombre || ' ' || u_est.apellido as estudiante_nombre,
                            v.titulo as vacante_titulo,
                            i.nombre as empresa_nombre,
                            c.nombre as carrera_nombre,
                            pe.carrera_id
                        FROM public.postulaciones p
                        JOIN public.perfiles_estudiante pe ON p.estudiante_id = pe.perfil_id
                        JOIN public.usuarios u_est ON pe.usuario_id = u_est.usuario_id
                        JOIN public.carreras c ON pe.carrera_id = c.carrera_id
                        JOIN public.vacantes v ON p.vacante_id = v.vacante_id
                        JOIN public.instituciones i ON v.institucion_id = i.institucion_id
                        WHERE p.postulacion_id = %s
                    """
                    det_res = DataBaseHandle.getRecords(sql_detalles, 1, (postulacion_id,))
                    if det_res['result'] and det_res['data']:
                        det = det_res['data']
                        
                        # 2. Buscar al gestor de esa carrera
                        sql_gestor = """
                            SELECT u.correo, u.nombre, u.apellido
                            FROM public.perfiles_gestor pg
                            JOIN public.usuarios u ON pg.usuario_id = u.usuario_id
                            WHERE pg.carrera_id = %s AND u.activo = true
                        """
                        gestor_res = DataBaseHandle.getRecords(sql_gestor, 0, (det['carrera_id'],))
                        if gestor_res['result'] and gestor_res['data']:
                            for gestor in gestor_res['data']:
                                gestor_nombre = f"{gestor['nombre']} {gestor['apellido']}"
                                EmailSender.send_acceptance_notification(
                                    to_email=gestor['correo'],
                                    gestor_nombre=gestor_nombre,
                                    estudiante_nombre=det['estudiante_nombre'],
                                    empresa_nombre=det['empresa_nombre'],
                                    vacante_titulo=det['vacante_titulo'],
                                    carrera_nombre=det['carrera_nombre']
                                )
                except Exception as e:
                    HandleLogs.write_error("Error al despachar correo al gestor: " + str(e))

            elif nuevo_estado == 'aceptada':
                set_parts.append("fecha_respuesta_gestor = NOW()")
                if notas:
                    set_parts.append("notas_gestor = %s")
                    params.append(notas)
                if supervisor_id:
                    set_parts.append("supervisor_id = %s")
                    params.append(supervisor_id)
                nro = ApplicationComponent._generate_nro_solicitud(postulacion_id)
                set_parts.append("nro_solicitud = %s")
                params.append(nro)
            elif nuevo_estado in ['aprobada', 'reprobada', 'anulada']:
                set_parts.append("fecha_respuesta_gestor = NOW()")
                if notas:
                    set_parts.append("notas_gestor = %s")
                    params.append(notas)
            elif nuevo_estado == 'rechazada':
                if notas:
                    set_parts.append("notas_empresa = %s")
                    params.append(notas)
            elif nuevo_estado == 'rechazada_gestor':
                if notas:
                    set_parts.append("notas_gestor = %s")
                    params.append(notas)

            params.append(postulacion_id)

            sql = f"""
                UPDATE public.postulaciones 
                SET {', '.join(set_parts)}
                WHERE postulacion_id = %s
            """
            result = DataBaseHandle.ExecuteNonQuery(sql, tuple(params))
            if result['result']:
                response_data = None
                if nuevo_estado == 'aceptada':
                    response_data = {'nro_solicitud': nro}
                    
                    # Lógica para auto-cerrar la vacante si se alcanzan los cupos
                    auto_close_sql = """
                        UPDATE public.vacantes v
                        SET activo = false
                        WHERE v.vacante_id = (SELECT vacante_id FROM public.postulaciones WHERE postulacion_id = %s)
                        AND (
                            SELECT COUNT(*) 
                            FROM public.postulaciones p2 
                            WHERE p2.vacante_id = v.vacante_id 
                            AND p2.estado IN ('aceptada', 'aprobada')
                        ) >= v.cupos;
                    """
                    try:
                        DataBaseHandle.ExecuteNonQuery(auto_close_sql, (postulacion_id,))
                    except Exception:
                        pass
                        
                return internal_response(True, response_data, "Estado actualizado")
            return internal_response(False, None, result.get('message', 'Error'))
        except Exception as err:
            return internal_response(False, None, str(err))

    @staticmethod
    def _generate_nro_solicitud(postulacion_id=None):
        if postulacion_id:
            return str(postulacion_id).zfill(6)
        sql = """
            SELECT nro_solicitud FROM public.postulaciones 
            WHERE nro_solicitud IS NOT NULL 
            ORDER BY postulacion_id DESC LIMIT 1
        """
        result = DataBaseHandle.getRecords(sql, 1)
        next_num = 100000
        if result['result'] and result['data'] and result['data']['nro_solicitud']:
            try:
                last = result['data']['nro_solicitud']
                digits = re.sub(r'\D', '', str(last))
                next_num = int(digits) + 1 if digits else next_num
            except (ValueError, IndexError):
                next_num = 100000
        return str(next_num).zfill(6)

    @staticmethod
    def get_applications_by_company(institucion_id):
        try:
            sql = """
                SELECT p.postulacion_id, p.estado, p.nro_solicitud,
                       CAST(p.porcentaje_afinidad AS FLOAT) as porcentaje_afinidad,
                       TO_CHAR(p.creado_en, 'YYYY-MM-DD') as creado_en,
                       p.habilidades_snapshot,
                       pe.perfil_id as estudiante_id,
                       u.nombre || ' ' || u.apellido as nombre_estudiante,
                       u.correo, u.cedula, pe.semestre,
                       c.nombre as carrera,
                       v.vacante_id, v.titulo as titulo_vacante
                FROM public.postulaciones p
                JOIN public.perfiles_estudiante pe ON p.estudiante_id = pe.perfil_id
                JOIN public.usuarios u ON pe.usuario_id = u.usuario_id
                LEFT JOIN public.carreras c ON pe.carrera_id = c.carrera_id
                JOIN public.vacantes v ON p.vacante_id = v.vacante_id
                WHERE v.institucion_id = %s
                ORDER BY p.creado_en DESC
            """
            result = DataBaseHandle.getRecords(sql, 0, (institucion_id,))
            if result['result']:
                data = result['data'] or []
                import json
                for d in data:
                    if d.get('habilidades_snapshot'):
                        try:
                            snap = d['habilidades_snapshot']
                            raw = json.loads(snap) if isinstance(snap, str) else snap
                            if isinstance(raw, dict) and 'vacante' in raw and raw['vacante']:
                                vac_snap = raw['vacante']
                                if 'titulo' in vac_snap:
                                    d['titulo_vacante'] = vac_snap['titulo']
                        except Exception:
                            pass
                return internal_response(True, data, "Postulantes de empresa encontrados")
            return internal_response(False, [], result.get('message', 'Error'))
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, [], str(err))

    @staticmethod
    def get_all_applications(facultad_id=None, carrera_id=None):
        try:
            where_clauses = []
            params = []
            
            if facultad_id:
                where_clauses.append("(pe.facultad_id = %s OR i.facultad_id = %s)")
                params.extend([facultad_id, facultad_id])
            if carrera_id:
                where_clauses.append("pe.carrera_id = %s")
                params.append(carrera_id)
                
            where_str = " AND ".join(where_clauses)
            if where_str:
                where_str = "WHERE " + where_str
            else:
                where_str = ""

            sql = f"""
                SELECT p.postulacion_id, p.estado, p.nro_solicitud,
                       CAST(p.porcentaje_afinidad AS FLOAT) as porcentaje_afinidad,
                       TO_CHAR(p.creado_en, 'YYYY-MM-DD') as creado_en,
                       TO_CHAR(p.fecha_respuesta_empresa, 'YYYY-MM-DD') as fecha_respuesta_empresa,
                       TO_CHAR(p.fecha_respuesta_gestor, 'YYYY-MM-DD') as fecha_respuesta_gestor,
                       p.habilidades_snapshot,
                       pe.perfil_id as estudiante_id,
                       u.nombre || ' ' || u.apellido as nombre_estudiante,
                       u.correo, u.cedula, pe.semestre,
                       c.nombre as carrera,
                       v.vacante_id, v.titulo as titulo_vacante,
                      i.institucion_id, i.usuario_id as empresa_usuario_id, i.nombre as nombre_empresa, i.ruc as ruc_empresa,
                       COALESCE(p.supervisor_id, v.supervisor_id) as supervisor_id,
                       sup.nombre as supervisor_nombre
                FROM public.postulaciones p
                JOIN public.perfiles_estudiante pe ON p.estudiante_id = pe.perfil_id
                JOIN public.usuarios u ON pe.usuario_id = u.usuario_id
                LEFT JOIN public.carreras c ON pe.carrera_id = c.carrera_id
                JOIN public.vacantes v ON p.vacante_id = v.vacante_id
                JOIN public.instituciones i ON v.institucion_id = i.institucion_id
                LEFT JOIN public.supervisores sup ON COALESCE(p.supervisor_id, v.supervisor_id) = sup.supervisor_id
                {where_str}
                ORDER BY p.creado_en DESC
            """
            result = DataBaseHandle.getRecords(sql, 0, tuple(params)) if params else DataBaseHandle.getRecords(sql, 0)
            if result['result']:
                data = result['data'] or []
                import json
                for d in data:
                    if d.get('habilidades_snapshot'):
                        try:
                            snap = d['habilidades_snapshot']
                            raw = json.loads(snap) if isinstance(snap, str) else snap
                            if isinstance(raw, dict) and 'vacante' in raw and raw['vacante']:
                                vac_snap = raw['vacante']
                                if 'titulo' in vac_snap:
                                    d['titulo_vacante'] = vac_snap['titulo']
                        except Exception:
                            pass
                return internal_response(True, data, "Postulaciones encontradas")
            return internal_response(False, [], result.get('message', 'Error'))
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, [], str(err))

    @staticmethod
    def get_details_for_notification(estudiante_id, vacante_id):
        try:
            sql = """
                SELECT 
                    u_est.nombre || ' ' || u_est.apellido as nombre_estudiante,
                    v.titulo as titulo_vacante,
                    i.usuario_id as empresa_usuario_id
                FROM public.perfiles_estudiante pe
                JOIN public.usuarios u_est ON pe.usuario_id = u_est.usuario_id
                JOIN public.vacantes v ON v.vacante_id = %s
                JOIN public.instituciones i ON v.institucion_id = i.institucion_id
                WHERE pe.perfil_id = %s
            """
            result = DataBaseHandle.getRecords(sql, 0, (vacante_id, estudiante_id))
            if result['result'] and result['data']:
                return internal_response(True, result['data'][0], "Detalles obtenidos")
            return internal_response(False, None, "No se encontraron detalles")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def get_application_user_details(postulacion_id):
        try:
            sql = """
                SELECT 
                    pe.usuario_id as estudiante_usuario_id,
                    v.titulo as titulo_vacante,
                    i.nombre as nombre_empresa
                FROM public.postulaciones p
                JOIN public.perfiles_estudiante pe ON p.estudiante_id = pe.perfil_id
                JOIN public.vacantes v ON p.vacante_id = v.vacante_id
                JOIN public.instituciones i ON v.institucion_id = i.institucion_id
                WHERE p.postulacion_id = %s
            """
            result = DataBaseHandle.getRecords(sql, 0, (postulacion_id,))
            if result['result'] and result['data']:
                return internal_response(True, result['data'][0], "Detalles de postulación")
            return internal_response(False, None, "No se encontraron detalles")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def get_solicitud_data(postulacion_id):
        """Genera el paquete de datos JSON compatible con SIUG"""
        try:
            sql = """
                SELECT 
                    p.postulacion_id, p.nro_solicitud, p.porcentaje_afinidad, p.estado, p.habilidades_snapshot,
                    TO_CHAR(p.fecha_respuesta_gestor, 'YYYY-MM-DD') as fecha_aprobacion,
                    u_est.cedula as est_cedula,
                    u_est.nombre || ' ' || u_est.apellido as est_nombres,
                    u_est.correo as est_correo,
                    pe.perfil_id as est_id,
                    pe.semestre as est_nivel,
                    pe.intereses as est_intereses,
                    pe.resumen_experiencia as est_experiencia,
                    c.nombre as est_carrera,
                    f.nombre as est_facultad,
                    i.nombre as inst_nombre,
                    i.ruc as inst_ruc,
                    i.direccion as inst_direccion,
                    sv.numero_identificacion as sup_cedula,
                    sv.nombre as sup_nombre,
                    sv.cargo as sup_cargo,
                    sv.departamento as sup_departamento,
                    sv.correo as sup_correo,
                    sv.telefono as sup_telefono,
                    v.vacante_id as vac_id,
                    v.titulo as vac_titulo,
                    v.area as vac_area,
                    v.descripcion as vac_descripcion,
                    v.requisitos as vac_requisitos,
                    v.ubicacion as vac_ubicacion,
                    v.cupos as vac_cupos,
                    v.modalidad,
                    v.total_horas as horas_asignadas,
                    v.horas_diarias,
                    v.horario
                FROM public.postulaciones p
                JOIN public.perfiles_estudiante pe ON p.estudiante_id = pe.perfil_id
                JOIN public.usuarios u_est ON pe.usuario_id = u_est.usuario_id
                LEFT JOIN public.carreras c ON pe.carrera_id = c.carrera_id
                LEFT JOIN public.facultades f ON c.facultad_id = f.facultad_id
                JOIN public.vacantes v ON p.vacante_id = v.vacante_id
                JOIN public.instituciones i ON v.institucion_id = i.institucion_id
                LEFT JOIN public.supervisores sv ON p.supervisor_id = sv.supervisor_id
                WHERE p.postulacion_id = %s
            """
            result = DataBaseHandle.getRecords(sql, 1, (postulacion_id,))
            if result['result'] and result['data']:
                d = result['data']
                
                habilidades = []
                snap_experiencia = None
                snap_intereses = None
                if d.get('habilidades_snapshot'):
                    import json
                    snap = d['habilidades_snapshot']
                    raw = json.loads(snap) if isinstance(snap, str) else snap
                    
                    # Extraer del nuevo formato
                    if isinstance(raw, dict):
                        raw_skills = raw.get('habilidades', [])
                        snap_experiencia = raw.get('resumen_experiencia', '')
                        snap_intereses = raw.get('intereses', '')
                        if 'vacante' in raw and raw['vacante']:
                            vac_snap = raw['vacante']
                            d['vac_titulo'] = vac_snap.get('titulo', d['vac_titulo'])
                            d['vac_area'] = vac_snap.get('area', d['vac_area'])
                            d['modalidad'] = vac_snap.get('modalidad', d['modalidad'])
                            d['vac_ubicacion'] = vac_snap.get('ubicacion', d['vac_ubicacion'])
                            d['vac_descripcion'] = vac_snap.get('descripcion', d['vac_descripcion'])
                            d['vac_requisitos'] = vac_snap.get('requisitos', d['vac_requisitos'])
                            d['vac_cupos'] = vac_snap.get('cupos', d['vac_cupos'])
                            d['horas_asignadas'] = vac_snap.get('total_horas', d['horas_asignadas'])
                            d['horas_diarias'] = vac_snap.get('horas_diarias', d['horas_diarias'])
                            d['horario'] = vac_snap.get('horario', d['horario'])
                    else:
                        # Extraer del array directo
                        raw_skills = raw
                    
                    habilidades = [
                        {
                            'nombre': h.get('habilidad_nombre', h.get('nombre', '')),
                            'categoria': h.get('habilidad_categoria', h.get('categoria', '')),
                            'nivel': h.get('nivel', 1)
                        } 
                        for h in raw_skills
                    ]
                else:
                    skills_sql = """
                        SELECT h.nombre as nombre, h.categoria, he.nivel
                        FROM public.habilidades_estudiante he
                        JOIN public.habilidades h ON he.habilidad_id = h.habilidad_id
                        WHERE he.estudiante_id = %s
                        ORDER BY h.categoria, h.nombre
                    """
                    skills_result = DataBaseHandle.getRecords(skills_sql, 0, (d['est_id'],))
                    habilidades = skills_result['data'] if skills_result['result'] and skills_result['data'] else []

                vac_skills_sql = """
                    SELECT h.nombre as nombre, h.categoria, hv.nivel_requerido as nivel, hv.es_opcional
                    FROM public.habilidades_vacante hv
                    JOIN public.habilidades h ON hv.habilidad_id = h.habilidad_id
                    WHERE hv.vacante_id = %s
                    ORDER BY hv.es_opcional, h.categoria, h.nombre
                """
                vac_skills_result = DataBaseHandle.getRecords(vac_skills_sql, 0, (d['vac_id'],))
                habilidades_vacante = vac_skills_result['data'] if vac_skills_result['result'] and vac_skills_result['data'] else []

                solicitud = {
                    'nro_solicitud': d['nro_solicitud'],
                    'estudiante': {
                        'cedula': d['est_cedula'],
                        'nombres': d['est_nombres'],
                        'carrera': d['est_carrera'],
                        'facultad': d['est_facultad'],
                        'nivel': d['est_nivel'],
                        'correo': d['est_correo'],
                        'intereses': snap_intereses or d['est_intereses'],
                        'experiencia': snap_experiencia or d['est_experiencia']
                    },
                    'institucion': {
                        'nombre': d['inst_nombre'],
                        'ruc': d['inst_ruc'],
                        'direccion': d['inst_direccion']
                    },
                    'supervisor': {
                        'cedula': d['sup_cedula'],
                        'nombres': d['sup_nombre'],
                        'cargo': d['sup_cargo'],
                        'departamento': d['sup_departamento'],
                        'correo': d['sup_correo'],
                        'telefono': d['sup_telefono']
                    },
                    'vacante': {
                        'titulo': d['vac_titulo'],
                        'area': d['vac_area'],
                        'modalidad': d['modalidad'],
                        'ubicacion': d['vac_ubicacion'],
                        'descripcion': d['vac_descripcion'],
                        'requisitos': d['vac_requisitos'],
                        'cupos': d['vac_cupos'],
                        'habilidades': habilidades_vacante
                    },
                    'habilidades_estudiante': habilidades,
                    'practica': {
                        'modalidad': d['modalidad'],
                        'horas_asignadas': d['horas_asignadas'],
                        'horas_diarias': d['horas_diarias'],
                        'horario': d['horario'],
                        'porcentaje_afinidad': float(d['porcentaje_afinidad']) if d['porcentaje_afinidad'] else 0,
                        'fecha_aprobacion': d['fecha_aprobacion']
                    },
                    'estado': 'APROBADO_PARA_FORMALIZACION'
                }
                return internal_response(True, solicitud, "Solicitud generada")
            return internal_response(False, None, "Postulación no encontrada")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def get_solicitud_data_by_cedula(cedula):
        """Busca una solicitud aprobada por la cédula del estudiante (Demo SIUG)"""
        try:
            sql = """
                SELECT p.postulacion_id
                FROM public.postulaciones p
                JOIN public.perfiles_estudiante pe ON p.estudiante_id = pe.perfil_id
                JOIN public.usuarios u ON pe.usuario_id = u.usuario_id
                WHERE u.cedula = %s AND p.estado IN ('aprobada', 'aceptada')
                ORDER BY p.actualizado_en DESC
                LIMIT 1
            """
            result = DataBaseHandle.getRecords(sql, 1, (cedula,))
            if result['result'] and result['data']:
                postulacion_id = result['data']['postulacion_id']
                return ApplicationComponent.get_solicitud_data(postulacion_id)
            return internal_response(False, None, "No se encontro una solicitud aprobada para la cedula provista.")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))
