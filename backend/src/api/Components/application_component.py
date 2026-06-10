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

            # Validar que el estudiante no tenga una postulación activa (pendiente o aceptada_empresa)
            sql_check = """
                SELECT p.postulacion_id, p.estado, v.titulo as vacante_titulo
                FROM public.postulaciones p
                JOIN public.vacantes v ON p.vacante_id = v.vacante_id
                WHERE p.estudiante_id = %s 
                  AND p.estado IN ('pendiente', 'aceptada_empresa', 'aceptada')
                LIMIT 1
            """
            check_result = DataBaseHandle.getRecords(sql_check, 1, (estudiante_id,))
            if check_result['result'] and check_result['data']:
                active = check_result['data']
                estado_label = 'pendiente' if active['estado'] == 'pendiente' else ('aceptada por empresa' if active['estado'] == 'aceptada_empresa' else 'en curso')
                return internal_response(
                    False, None,
                    f"Ya tienes una postulacion {estado_label} en la vacante \"{active['vacante_titulo']}\". "
                    "Debes esperar a que sea procesada antes de postularte a otra."
                )

            sql = """
                INSERT INTO public.postulaciones (estudiante_id, vacante_id, estado, porcentaje_afinidad)
                VALUES (%s, %s, 'pendiente', %s)
                RETURNING postulacion_id
            """
            result = DataBaseHandle.ExecuteNonQuery(sql, (estudiante_id, vacante_id, porcentaje_afinidad))
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
                       v.vacante_id, v.titulo, v.area, v.modalidad, v.ubicacion,
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
                return internal_response(True, result['data'] or [], "Postulaciones encontradas")
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
    def update_application_status(postulacion_id, nuevo_estado, notas=None, supervisor_id=None):
        try:
            set_parts = ["estado = %s", "actualizado_en = NOW()"]
            params = [nuevo_estado]

            if nuevo_estado == 'aceptada_empresa':
                set_parts.append("fecha_respuesta_empresa = NOW()")
                if notas:
                    set_parts.append("notas_empresa = %s")
                    params.append(notas)
                if supervisor_id:
                    set_parts.append("supervisor_id = %s")
                    params.append(supervisor_id)
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
                return internal_response(True, result['data'] or [], "Postulantes de empresa encontrados")
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
                       pe.perfil_id as estudiante_id,
                       u.nombre || ' ' || u.apellido as nombre_estudiante,
                       u.correo, u.cedula, pe.semestre,
                       c.nombre as carrera,
                       v.vacante_id, v.titulo as titulo_vacante,
                       i.institucion_id, i.usuario_id as empresa_usuario_id, i.nombre as nombre_empresa,
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
                return internal_response(True, result['data'] or [], "Postulaciones encontradas")
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
                    p.postulacion_id, p.nro_solicitud, p.porcentaje_afinidad, p.estado,
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
                        'intereses': d['est_intereses'],
                        'experiencia': d['est_experiencia']
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
