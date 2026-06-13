from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response


class MatchingComponent:
    @staticmethod
    def get_candidates_for_company(institucion_id):
        """
        Matching bidireccional: para cada vacante activa de la empresa,
        busca estudiantes con skills que coinciden y calcula un % de afinidad.
        
        Algoritmo:
        - Por cada vacante, obtiene los skills requeridos (obligatorios y opcionales)
        - Por cada estudiante, compara sus skills con los de la vacante
        - Calcula afinidad = (puntos_obtenidos / puntos_maximos) * 100
        - Skills obligatorios valen más que los opcionales
        - El nivel del estudiante vs el requerido influye en el puntaje
        """
        try:
            # 1. Obtener vacantes activas de la empresa
            sql_vacancies = """
                SELECT v.vacante_id, v.titulo, v.area, v.modalidad, v.ubicacion, v.cupos,
                       v.descripcion,
                       (SELECT COUNT(*) FROM public.postulaciones p WHERE p.vacante_id = v.vacante_id) as total_postulaciones
                FROM public.vacantes v
                WHERE v.institucion_id = %s AND v.activo = true
                ORDER BY v.creado_en DESC
            """
            vac_result = DataBaseHandle.getRecords(sql_vacancies, 0, (institucion_id,))
            if not vac_result['result'] or not vac_result['data']:
                return internal_response(True, [], "No hay vacantes activas")

            vacancies = vac_result['data']
            result = []

            for vacancy in vacancies:
                vid = vacancy['vacante_id']

                # 2. Obtener skills requeridos de esta vacante
                sql_vskills = """
                    SELECT hv.habilidad_id, h.nombre as habilidad_nombre, hv.nivel_requerido, hv.es_opcional
                    FROM public.habilidades_vacante hv
                    JOIN public.habilidades h ON hv.habilidad_id = h.habilidad_id
                    WHERE hv.vacante_id = %s
                """
                vskills_result = DataBaseHandle.getRecords(sql_vskills, 0, (vid,))
                vacancy_skills = vskills_result['data'] if vskills_result['result'] and vskills_result['data'] else []

                # Obtener postulaciones para esta vacante (incluyendo afinidad NLP congelada y snapshot de habilidades)
                try:
                    sql_applied_all = "SELECT estudiante_id, postulacion_id, estado, porcentaje_afinidad, habilidades_snapshot FROM public.postulaciones WHERE vacante_id = %s"
                    app_all_result = DataBaseHandle.getRecords(sql_applied_all, 0, (vid,))
                except Exception:
                    # Fallback por si la columna habilidades_snapshot aun no existe en BD
                    sql_applied_all = "SELECT estudiante_id, postulacion_id, estado, porcentaje_afinidad FROM public.postulaciones WHERE vacante_id = %s"
                    app_all_result = DataBaseHandle.getRecords(sql_applied_all, 0, (vid,))
                    
                applied_map = {r['estudiante_id']: r for r in app_all_result['data']} if app_all_result['result'] and app_all_result['data'] else {}

                # 3. Obtener todos los estudiantes con sus skills
                sql_students = """
                    SELECT pe.perfil_id as estudiante_id, u.usuario_id, u.nombre, u.apellido, u.correo,
                           c.nombre as carrera, pe.semestre, pe.universidad,
                           pe.resumen_experiencia, pe.intereses
                    FROM public.perfiles_estudiante pe
                    JOIN public.usuarios u ON pe.usuario_id = u.usuario_id
                    LEFT JOIN public.carreras c ON pe.carrera_id = c.carrera_id
                    WHERE u.activo = true
                """
                students_result = DataBaseHandle.getRecords(sql_students, 0)
                students = students_result['data'] if students_result['result'] and students_result['data'] else []

                candidates = []
                for student in students:
                    sid = student['estudiante_id']
                    has_applied = sid in applied_map

                    # Obtener skills del estudiante (De la "Foto" si ya aplicó, o en vivo si es nuevo)
                    already_applied = applied_map.get(sid)
                    
                    if already_applied and already_applied.get('habilidades_snapshot'):
                        import json
                        snap = already_applied['habilidades_snapshot']
                        student_skills = json.loads(snap) if isinstance(snap, str) else snap
                    else:
                        sql_sskills = """
                            SELECT he.habilidad_id, h.nombre as habilidad_nombre, h.categoria as habilidad_categoria, he.nivel
                            FROM public.habilidades_estudiante he
                            JOIN public.habilidades h ON he.habilidad_id = h.habilidad_id
                            WHERE he.estudiante_id = %s
                        """
                        sskills_result = DataBaseHandle.getRecords(sql_sskills, 0, (sid,))
                        student_skills = sskills_result['data'] if sskills_result['result'] and sskills_result['data'] else []

                    if not student_skills and not has_applied:
                        continue

                    # 4. Calcular afinidad o usar la oficial congelada de la postulación
                    student_skill_map = {s['habilidad_id']: s for s in student_skills}
                    matched_skills = []

                    for vs in vacancy_skills:
                        max_level = vs['nivel_requerido'] or 1
                        if vs['habilidad_id'] in student_skill_map:
                            s_skill = student_skill_map[vs['habilidad_id']]
                            matched_skills.append({
                                'name': vs['habilidad_nombre'],
                                'required_level': max_level,
                                'student_level': s_skill['nivel'],
                                'is_optional': vs['es_opcional'],
                            })

                    # Si el estudiante ya aplicó, la afinidad es estrictamente la del momento de su aplicación (Motor NLP)
                    if already_applied and already_applied.get('porcentaje_afinidad') is not None:
                        affinity = float(already_applied['porcentaje_afinidad'])
                    else:
                        # Si no ha aplicado, o es una postulación muy antigua sin porcentaje, usamos 0
                        affinity = 0

                    # Solo incluir candidatos que ya hayan postulado (vista de empresa)
                    if has_applied:
                        # Todas las skills del estudiante
                        all_skills = [{'name': s['habilidad_nombre'], 'category': s['habilidad_categoria'], 'level': s['nivel']} for s in student_skills]

                        candidates.append({
                            'student_id': sid,
                            'user_id': student['usuario_id'],
                            'name': student['nombre'],
                            'lastname': student['apellido'],
                            'email': student['correo'],
                            'career': student['carrera'],
                            'semester': student['semestre'],
                            'university': student['universidad'],
                            'experience_summary': student['resumen_experiencia'],
                            'interests': student['intereses'],
                            'affinity': affinity,
                            'matched_skills': matched_skills,
                            'all_skills': all_skills,
                            'total_vacancy_skills': len(vacancy_skills),
                            'matched_count': len(matched_skills),
                            'already_applied': already_applied is not None,
                            'application_id': already_applied['postulacion_id'] if already_applied else None,
                            'application_status': already_applied['estado'] if already_applied else None,
                        })

                # Ordenar por afinidad descendente
                candidates.sort(key=lambda x: x['affinity'], reverse=True)

                result.append({
                    'vacancy_id': vacancy['vacante_id'],
                    'title': vacancy['titulo'],
                    'area': vacancy['area'],
                    'modality': vacancy['modalidad'],
                    'location': vacancy['ubicacion'],
                    'slots': vacancy['cupos'],
                    'applications_count': vacancy['total_postulaciones'],
                    'candidates': candidates[:10],
                    'total_candidates': len(candidates),
                })

            return internal_response(True, result, "Matching calculado")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))
