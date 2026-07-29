from ....utils.database.connection_db import DataBaseHandle
from ....utils.general.logs import HandleLogs

def obtener_vacantes_facultad(facultad_id):
    """Obtiene vacantes activas filtradas por facultad con sus skills."""
    where_clause = ''
    params = []
    if facultad_id:
        where_clause = 'AND i.facultad_id = %s'
        params.append(facultad_id)

    sql = f"""
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
        WHERE v.activo = true {where_clause}
        ORDER BY v.creado_en DESC
    """
    result = DataBaseHandle.getRecords(sql, 0, tuple(params)) if params else DataBaseHandle.getRecords(sql, 0)
    if not result['result'] or not result['data']:
        return []

    vacantes = result['data']
    vacante_ids = [v['vacante_id'] for v in vacantes]
    sql_skills = """
        SELECT hv.vacante_id, h.habilidad_id, h.nombre as habilidad_nombre, h.categoria,
               hv.nivel_requerido, hv.es_opcional
        FROM public.habilidades_vacante hv
        JOIN public.habilidades h ON hv.habilidad_id = h.habilidad_id
        WHERE hv.vacante_id = ANY(%s)
    """
    skills_res = DataBaseHandle.getRecords(sql_skills, 0, (vacante_ids,))
    skills_by_vacante = {}
    if skills_res['result'] and skills_res['data']:
        for s in skills_res['data']:
            vid = s['vacante_id']
            skills_by_vacante.setdefault(vid, []).append(s)

    for v in vacantes:
        v['skills'] = skills_by_vacante.get(v['vacante_id'], [])

    return vacantes


def obtener_cache_afinidad(estudiante_id, vacante_ids):
    """Consulta el caché de afinidad para un estudiante y un set de vacantes."""
    if not vacante_ids:
        return None
    sql = """
        SELECT vacante_id, CAST(porcentaje_afinidad AS FLOAT) as porcentaje_afinidad
        FROM public.cache_afinidad
        WHERE estudiante_id = %s AND vacante_id = ANY(%s)
    """
    result = DataBaseHandle.getRecords(sql, 0, (estudiante_id, vacante_ids))
    if result['result'] and result['data']:
        return result['data']
    return None


def guardar_cache_afinidad(estudiante_id, afinidades):
    """Guarda las afinidades calculadas en el caché en una sola consulta batch ultrarrápida."""
    if not afinidades:
        return
    try:
        value_tuples = []
        params = []
        for vacante_id, porcentaje in afinidades.items():
            value_tuples.append("(%s, %s, %s)")
            params.extend([estudiante_id, vacante_id, round(porcentaje, 2)])

        sql = f"""
            INSERT INTO public.cache_afinidad (estudiante_id, vacante_id, porcentaje_afinidad)
            VALUES {', '.join(value_tuples)}
            ON CONFLICT (estudiante_id, vacante_id)
            DO UPDATE SET porcentaje_afinidad = EXCLUDED.porcentaje_afinidad, calculado_en = NOW()
        """
        DataBaseHandle.ExecuteNonQuery(sql, tuple(params))
    except Exception as err:
        HandleLogs.write_error(err)


def invalidar_cache_estudiante(estudiante_id):
    """Borra el caché de un estudiante específico."""
    try:
        sql = "DELETE FROM public.cache_afinidad WHERE estudiante_id = %s"
        DataBaseHandle.ExecuteNonQuery(sql, (estudiante_id,))
        HandleLogs.write_log(f"[NLP] Caché invalidado para estudiante_id={estudiante_id}")
    except Exception as err:
        HandleLogs.write_error(err)


def invalidar_cache_vacante(vacante_id):
    """Borra el caché de una vacante."""
    try:
        sql = "DELETE FROM public.cache_afinidad WHERE vacante_id = %s"
        DataBaseHandle.ExecuteNonQuery(sql, (vacante_id,))
        HandleLogs.write_log(f"[NLP] Caché invalidado para vacante_id={vacante_id}")
    except Exception as err:
        HandleLogs.write_error(err)


def invalidar_cache_facultad(facultad_id):
    """Borra el caché de todos los estudiantes de una facultad."""
    try:
        sql = """
            DELETE FROM public.cache_afinidad
            WHERE estudiante_id IN (
                SELECT perfil_id FROM public.perfiles_estudiante WHERE facultad_id = %s
            )
        """
        DataBaseHandle.ExecuteNonQuery(sql, (facultad_id,))
        HandleLogs.write_log(f"[NLP] Caché invalidado para facultad_id={facultad_id}")
    except Exception as err:
        HandleLogs.write_error(err)