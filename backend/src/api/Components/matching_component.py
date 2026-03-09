from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response


class MatchingComponent:
    @staticmethod
    def get_candidates_for_company(company_id):
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
                SELECT v.vacancy_id, v.title, v.area, v.modality, v.location, v.slots,
                       v.description,
                       (SELECT COUNT(*) FROM public.applications a WHERE a.vacancy_id = v.vacancy_id) as applications_count
                FROM public.vacancies v
                WHERE v.company_id = %s AND v.is_active = true
                ORDER BY v.created_at DESC
            """
            vac_result = DataBaseHandle.getRecords(sql_vacancies, 0, (company_id,))
            if not vac_result['result'] or not vac_result['data']:
                return internal_response(True, [], "No hay vacantes activas")

            vacancies = vac_result['data']
            result = []

            for vacancy in vacancies:
                vid = vacancy['vacancy_id']

                # 2. Obtener skills requeridos de esta vacante
                sql_vskills = """
                    SELECT vs.skill_id, s.name as skill_name, vs.required_level, vs.is_optional
                    FROM public.vacancy_skills vs
                    JOIN public.skills s ON vs.skill_id = s.skill_id
                    WHERE vs.vacancy_id = %s
                """
                vskills_result = DataBaseHandle.getRecords(sql_vskills, 0, (vid,))
                vacancy_skills = vskills_result['data'] if vskills_result['result'] and vskills_result['data'] else []

                if not vacancy_skills:
                    continue

                # 3. Obtener todos los estudiantes con sus skills
                sql_students = """
                    SELECT sp.profile_id as student_id, u.user_id, u.name, u.lastname, u.email,
                           sp.career, sp.semester, sp.university,
                           sp.experience_summary, sp.interests
                    FROM public.student_profiles sp
                    JOIN public.users u ON sp.user_id = u.user_id
                    WHERE u.is_active = true
                """
                students_result = DataBaseHandle.getRecords(sql_students, 0)
                students = students_result['data'] if students_result['result'] and students_result['data'] else []

                candidates = []
                for student in students:
                    sid = student['student_id']

                    # Obtener skills del estudiante
                    sql_sskills = """
                        SELECT ss.skill_id, s.name as skill_name, s.category as skill_category, ss.level
                        FROM public.student_skills ss
                        JOIN public.skills s ON ss.skill_id = s.skill_id
                        WHERE ss.student_id = %s
                    """
                    sskills_result = DataBaseHandle.getRecords(sql_sskills, 0, (sid,))
                    student_skills = sskills_result['data'] if sskills_result['result'] and sskills_result['data'] else []

                    if not student_skills:
                        continue

                    # 4. Calcular afinidad
                    student_skill_map = {s['skill_id']: s for s in student_skills}

                    max_points = 0
                    earned_points = 0
                    matched_skills = []

                    for vs in vacancy_skills:
                        weight = 3 if not vs['is_optional'] else 1
                        max_level = vs['required_level'] or 1
                        max_points += weight * max_level

                        if vs['skill_id'] in student_skill_map:
                            s_skill = student_skill_map[vs['skill_id']]
                            level_ratio = min(s_skill['level'] / max_level, 1.5)
                            earned_points += weight * max_level * level_ratio
                            matched_skills.append({
                                'name': vs['skill_name'],
                                'required_level': max_level,
                                'student_level': s_skill['level'],
                                'is_optional': vs['is_optional'],
                            })

                    if max_points == 0:
                        continue

                    affinity = round((earned_points / max_points) * 100, 1)
                    affinity = min(affinity, 100)

                    # Solo incluir candidatos con afinidad > 30%
                    if affinity >= 30:
                        # Verificar si ya se postuló
                        sql_applied = """
                            SELECT application_id, status
                            FROM public.applications 
                            WHERE student_id = %s AND vacancy_id = %s
                        """
                        app_result = DataBaseHandle.getRecords(sql_applied, 1, (sid, vid))
                        already_applied = app_result['data'] if app_result['result'] and app_result['data'] else None

                        # Todas las skills del estudiante (no solo las que coinciden)
                        all_skills = [{'name': s['skill_name'], 'category': s['skill_category'], 'level': s['level']} for s in student_skills]

                        candidates.append({
                            'student_id': sid,
                            'user_id': student['user_id'],
                            'name': student['name'],
                            'lastname': student['lastname'],
                            'email': student['email'],
                            'career': student['career'],
                            'semester': student['semester'],
                            'university': student['university'],
                            'experience_summary': student['experience_summary'],
                            'interests': student['interests'],
                            'affinity': affinity,
                            'matched_skills': matched_skills,
                            'all_skills': all_skills,
                            'total_vacancy_skills': len(vacancy_skills),
                            'matched_count': len(matched_skills),
                            'already_applied': already_applied is not None,
                            'application_status': already_applied['status'] if already_applied else None,
                        })

                # Ordenar por afinidad descendente
                candidates.sort(key=lambda x: x['affinity'], reverse=True)

                result.append({
                    'vacancy_id': vacancy['vacancy_id'],
                    'title': vacancy['title'],
                    'area': vacancy['area'],
                    'modality': vacancy['modality'],
                    'location': vacancy['location'],
                    'slots': vacancy['slots'],
                    'applications_count': vacancy['applications_count'],
                    'candidates': candidates[:10],  # Top 10 por vacante
                    'total_candidates': len(candidates),
                })

            return internal_response(True, result, "Matching calculado")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))
