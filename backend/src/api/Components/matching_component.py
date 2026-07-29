from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response


class MatchingComponent:
    @staticmethod
    def get_candidates_for_company(institucion_id):
        """
        Matching bidireccional (vista Empresa):
        Para cada vacante activa de la empresa, recupera sus candidatos postulados
        con afinidad y habilidades congeladas/en vivo usando consultas SQL agrupadas (batching).
        """
        try:
            # 1. Obtener vacantes activas de la empresa (1 sola consulta)
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
            vacante_ids = [v['vacante_id'] for v in vacancies]

            # 2. Obtener habilidades requeridas de TODAS las vacantes en 1 sola consulta batch
            sql_vskills = """
                SELECT hv.vacante_id, hv.habilidad_id, h.nombre as habilidad_nombre, hv.nivel_requerido, hv.es_opcional
                FROM public.habilidades_vacante hv
                JOIN public.habilidades h ON hv.habilidad_id = h.habilidad_id
                WHERE hv.vacante_id = ANY(%s)
            """
            vskills_result = DataBaseHandle.getRecords(sql_vskills, 0, (vacante_ids,))
            vskills_by_vacante = {}
            if vskills_result['result'] and vskills_result['data']:
                for vs in vskills_result['data']:
                    vskills_by_vacante.setdefault(vs['vacante_id'], []).append(vs)

            # 3. Obtener TODAS las postulaciones de estas vacantes en 1 sola consulta batch
            try:
                sql_applications = """
                    SELECT vacante_id, estudiante_id, postulacion_id, estado, porcentaje_afinidad, habilidades_snapshot
                    FROM public.postulaciones
                    WHERE vacante_id = ANY(%s)
                """
                apps_result = DataBaseHandle.getRecords(sql_applications, 0, (vacante_ids,))
            except Exception:
                sql_applications = """
                    SELECT vacante_id, estudiante_id, postulacion_id, estado, porcentaje_afinidad
                    FROM public.postulaciones
                    WHERE vacante_id = ANY(%s)
                """
                apps_result = DataBaseHandle.getRecords(sql_applications, 0, (vacante_ids,))

            all_apps = apps_result['data'] if apps_result['result'] and apps_result['data'] else []
            if not all_apps:
                result = []
                for v in vacancies:
                    result.append({
                        'vacancy_id': v['vacante_id'],
                        'title': v['titulo'],
                        'area': v['area'],
                        'modality': v['modalidad'],
                        'location': v['ubicacion'],
                        'slots': v['cupos'],
                        'applications_count': v['total_postulaciones'],
                        'candidates': [],
                        'total_candidates': 0,
                    })
                return internal_response(True, result, "Vacantes sin postulantes")

            # Mapear postulantes únicos
            applied_students_set = set(a['estudiante_id'] for a in all_apps)

            # 4. Obtener perfiles de SOLO los estudiantes postulados en 1 sola consulta batch
            sql_students = """
                SELECT pe.perfil_id as estudiante_id, u.usuario_id, u.nombre, u.apellido, u.correo,
                       c.nombre as carrera, pe.semestre, pe.universidad,
                       pe.resumen_experiencia, pe.intereses
                FROM public.perfiles_estudiante pe
                JOIN public.usuarios u ON pe.usuario_id = u.usuario_id
                LEFT JOIN public.carreras c ON pe.carrera_id = c.carrera_id
                WHERE pe.perfil_id = ANY(%s) AND u.activo = true
            """
            students_result = DataBaseHandle.getRecords(sql_students, 0, (list(applied_students_set),))
            student_map = {s['estudiante_id']: s for s in (students_result['data'] if students_result['result'] and students_result['data'] else [])}

            # 5. Obtener habilidades en vivo para los postulantes en 1 sola consulta batch
            sql_sskills = """
                SELECT he.estudiante_id, he.habilidad_id, h.nombre as habilidad_nombre, h.categoria as habilidad_categoria, he.nivel
                FROM public.habilidades_estudiante he
                JOIN public.habilidades h ON he.habilidad_id = h.habilidad_id
                WHERE he.estudiante_id = ANY(%s)
            """
            sskills_result = DataBaseHandle.getRecords(sql_sskills, 0, (list(applied_students_set),))
            sskills_by_student = {}
            if sskills_result['result'] and sskills_result['data']:
                for ss in sskills_result['data']:
                    sskills_by_student.setdefault(ss['estudiante_id'], []).append(ss)

            import json
            apps_by_vacante = {}
            for app in all_apps:
                apps_by_vacante.setdefault(app['vacante_id'], []).append(app)

            result = []
            for vacancy in vacancies:
                vid = vacancy['vacante_id']
                vacancy_skills = vskills_by_vacante.get(vid, [])
                v_apps = apps_by_vacante.get(vid, [])

                candidates = []
                for app in v_apps:
                    sid = app['estudiante_id']
                    student = student_map.get(sid)
                    if not student:
                        continue

                    snap = app.get('habilidades_snapshot')
                    snapshot_exp = None
                    snapshot_int = None

                    if snap:
                        raw_snap = json.loads(snap) if isinstance(snap, str) else snap
                        if isinstance(raw_snap, dict):
                            student_skills = raw_snap.get('habilidades', [])
                            snapshot_exp = raw_snap.get('resumen_experiencia')
                            snapshot_int = raw_snap.get('intereses')
                        else:
                            student_skills = raw_snap
                    else:
                        student_skills = sskills_by_student.get(sid, [])

                    student_skill_map_by_id = {s.get('habilidad_id'): s for s in student_skills if s.get('habilidad_id')}
                    student_skill_map_by_name = {str(s.get('habilidad_nombre', s.get('nombre', ''))).lower(): s for s in student_skills}

                    matched_skills = []
                    for vs in vacancy_skills:
                        max_level = vs.get('nivel_requerido') or 1
                        s_skill = student_skill_map_by_id.get(vs.get('habilidad_id'))
                        if not s_skill:
                            s_skill = student_skill_map_by_name.get(str(vs.get('habilidad_nombre', '')).lower())
                        if s_skill:
                            matched_skills.append({
                                'name': vs.get('habilidad_nombre'),
                                'required_level': max_level,
                                'student_level': s_skill.get('nivel', 1),
                                'is_optional': vs.get('es_opcional', False),
                            })

                    affinity = float(app['porcentaje_afinidad']) if app.get('porcentaje_afinidad') is not None else 0.0
                    all_skills = [{
                        'name': s.get('habilidad_nombre', s.get('nombre', '')),
                        'category': s.get('habilidad_categoria', s.get('categoria', '')),
                        'level': s.get('nivel', 1)
                    } for s in student_skills]

                    candidates.append({
                        'student_id': sid,
                        'user_id': student['usuario_id'],
                        'name': student['nombre'],
                        'lastname': student['apellido'],
                        'email': student['correo'],
                        'career': student['carrera'],
                        'semester': student['semestre'],
                        'university': student['universidad'],
                        'experience_summary': snapshot_exp if snapshot_exp is not None else student['resumen_experiencia'],
                        'interests': snapshot_int if snapshot_int is not None else student['intereses'],
                        'affinity': affinity,
                        'matched_skills': matched_skills,
                        'all_skills': all_skills,
                        'total_vacancy_skills': len(vacancy_skills),
                        'matched_count': len(matched_skills),
                        'already_applied': True,
                        'application_id': app['postulacion_id'],
                        'application_status': app['estado'],
                    })

                candidates.sort(key=lambda x: x['affinity'], reverse=True)
                result.append({
                    'vacancy_id': vid,
                    'title': vacancy['titulo'],
                    'area': vacancy['area'],
                    'modality': vacancy['modalidad'],
                    'location': vacancy['ubicacion'],
                    'slots': vacancy['cupos'],
                    'applications_count': vacancy['total_postulaciones'],
                    'candidates': candidates[:10],
                    'total_candidates': len(candidates),
                })

            return internal_response(True, result, "Candidatos obtenidos exitosamente")
        except Exception as e:
            HandleLogs.write_error(e)
            return internal_response(False, None, f"Error obteniendo candidatos: {str(e)}")
