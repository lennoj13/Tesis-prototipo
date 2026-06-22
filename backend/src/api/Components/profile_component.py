from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response

class ProfileComponent:
    @staticmethod
    def get_profile(user_id, role=None):
        try:
            sql = """
                SELECT u.usuario_id, u.cedula, u.nombre, u.apellido, u.correo, 
                       u.telefono, u.foto_perfil, r.nombre as rol_nombre
                FROM public.usuarios u
                JOIN public.roles r ON u.rol_id = r.rol_id
                WHERE u.usuario_id = %s
            """
            user_data = DataBaseHandle.getRecords(sql, 1, (user_id,))
            
            if not user_data['result'] or not user_data['data']:
                return internal_response(False, None, "Usuario no encontrado")

            profile_info = user_data['data']
            actual_role = profile_info['rol_nombre'].lower()

            if 'estudiante' in actual_role:
                sql_profile = """
                    SELECT pe.perfil_id, pe.carrera_id, c.nombre as carrera_nombre,
                           f.nombre as facultad_nombre, pe.semestre, pe.universidad, 
                           pe.resumen_experiencia, pe.intereses, pe.curriculum_url
                    FROM public.perfiles_estudiante pe
                    LEFT JOIN public.carreras c ON pe.carrera_id = c.carrera_id
                    LEFT JOIN public.facultades f ON c.facultad_id = f.facultad_id
                    WHERE pe.usuario_id = %s
                """
                extra = DataBaseHandle.getRecords(sql_profile, 1, (user_id,))
                
                if extra['result'] and extra['data']:
                    sql_skills = """
                        SELECT h.habilidad_id, h.nombre as habilidad_nombre, h.categoria, he.nivel
                        FROM public.habilidades_estudiante he
                        JOIN public.habilidades h ON he.habilidad_id = h.habilidad_id
                        WHERE he.estudiante_id = %s
                    """
                    skills = DataBaseHandle.getRecords(sql_skills, 0, (extra['data']['perfil_id'],))
                    extra['data']['skills'] = skills['data'] if skills['result'] else []
                
            elif 'empresa' in actual_role:
                sql_profile = """
                    SELECT i.institucion_id, i.nombre as nombre_empresa, i.ruc, i.industria, 
                           i.descripcion, i.sitio_web, i.direccion, i.ciudad, 
                           i.correo_contacto, i.telefono as telefono_empresa, i.estado,
                           i.codigo_convenio, i.tipo_convenio, TO_CHAR(i.fecha_inicio_convenio, 'YYYY-MM-DD') as fecha_inicio_convenio, i.nombre_abreviado
                    FROM public.instituciones i WHERE i.usuario_id = %s
                """
                extra = DataBaseHandle.getRecords(sql_profile, 1, (user_id,))
                
                if extra['result'] and extra['data']:
                    sql_supervisors = "SELECT supervisor_id, numero_identificacion, nombre, apellido, cargo, departamento, correo, telefono FROM public.supervisores WHERE institucion_id = %s AND activo = true"
                    sups = DataBaseHandle.getRecords(sql_supervisors, 0, (extra['data']['institucion_id'],))
                    extra['data']['supervisores'] = sups['data'] if sups['result'] else []
            else:
                extra = {'result': True, 'data': {}}

            profile_info['details'] = extra['data'] if extra['result'] else {}
            return internal_response(True, profile_info, "Perfil recuperado")

        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))
        
    @staticmethod
    def update_profile(user_id, role, p_data):
        try:
            sql_user = """
                UPDATE public.usuarios 
                SET nombre = %s, apellido = %s, correo = %s, telefono = %s, 
                    cedula = COALESCE(%s, cedula), actualizado_en = NOW()
                WHERE usuario_id = %s
            """
            DataBaseHandle.ExecuteNonQuery(sql_user, (
                p_data.get('name'), p_data.get('lastname'), p_data.get('email'), 
                p_data.get('phone'), p_data.get('cedula'), user_id
            ))

            if role == 'estudiante':
                raw_semester = p_data.get('semester') or ''
                # Strip everything except digits so '8º semestre' → '8'
                semester_clean = ''.join(c for c in str(raw_semester) if c.isdigit()) or None

                sql_stud = """
                    UPDATE public.perfiles_estudiante 
                    SET semestre = %s, resumen_experiencia = %s, intereses = %s, 
                        curriculum_url = %s, actualizado_en = NOW()
                    WHERE usuario_id = %s
                """
                DataBaseHandle.ExecuteNonQuery(sql_stud, (
                    semester_clean, p_data.get('experience_summary'), p_data.get('interests'),
                    p_data.get('curriculum_url'), user_id
                ))
                
                sql_get_id = "SELECT perfil_id, facultad_id FROM public.perfiles_estudiante WHERE usuario_id = %s"
                res_id = DataBaseHandle.getRecords(sql_get_id, 1, (user_id,))
                
                if res_id['result'] and res_id['data']:
                    perfil_id = res_id['data']['perfil_id']
                    facultad_id = res_id['data']['facultad_id']
                    if 'skills' in p_data:
                        ProfileComponent._update_student_skills(perfil_id, p_data['skills'])
                    # Indicar que se esta calculando NLP para que el frontend bloquee iteracciones
                    try:
                        DataBaseHandle.ExecuteNonQuery(
                            "UPDATE public.perfiles_estudiante SET calculando_nlp = TRUE WHERE perfil_id = %s", 
                            (perfil_id,)
                        )
                    except Exception as e:
                        HandleLogs.write_error(f"Error seteando calculando_nlp: {e}")

                    # Pre-calcular afinidad NLP Híbrida en segundo plano
                    try:
                        from ...api.Components.recomendacion_hibrida_component import RecomendacionHibridaComponent
                        import threading
                        import time
                        
                        def precalcular():
                            try:
                                HandleLogs.write_log(f"[*] Iniciando recálculo NLP en segundo plano para estudiante {perfil_id}...")
                                # Simulamos una demora para que el toast sea visible en el prototipo
                                time.sleep(3)
                                RecomendacionHibridaComponent.get_recomendaciones(user_id, facultad_id, force_recalculate=True)
                                HandleLogs.write_log(f"[*] Recálculo NLP completado con éxito para estudiante {perfil_id}.")
                            except Exception as e:
                                HandleLogs.write_error(f"Error precalculando NLP: {e}")
                            finally:
                                # Al terminar, liberar el bloqueo
                                try:
                                    DataBaseHandle.ExecuteNonQuery(
                                        "UPDATE public.perfiles_estudiante SET calculando_nlp = FALSE WHERE perfil_id = %s", 
                                        (perfil_id,)
                                    )
                                except Exception as e:
                                    pass
                                
                        threading.Thread(target=precalcular, daemon=True).start()
                    except Exception as e:
                        HandleLogs.write_error(f"Error iniciando precalculo NLP: {e}")

            elif role == 'empresa':
                sql_comp = """
                    UPDATE public.instituciones 
                    SET nombre = %s, ruc = %s, industria = %s, descripcion = %s, 
                        sitio_web = %s, direccion = %s, ciudad = %s, 
                        correo_contacto = %s, telefono = %s, actualizado_en = NOW()
                    WHERE usuario_id = %s
                """
                DataBaseHandle.ExecuteNonQuery(sql_comp, (
                    p_data.get('company_name'), p_data.get('ruc'), p_data.get('industry'),
                    p_data.get('description'), p_data.get('website'), p_data.get('address'),
                    p_data.get('city', 'Guayaquil'), p_data.get('contact_email'),
                    p_data.get('company_phone'), user_id
                ))

            return internal_response(True, None, "Perfil actualizado correctamente")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def _update_student_skills(student_id, skills):
        if not student_id:
            return
        DataBaseHandle.ExecuteNonQuery("DELETE FROM public.habilidades_estudiante WHERE estudiante_id = %s", (student_id,))
        seen_ids = set()
        seen_names = set()
        for s in skills:
            skill_id = s.get('skill_id') or s.get('habilidad_id') or s.get('id')
            name = s.get('name') or s.get('nombre') or s.get('habilidad_nombre')
            raw_level = s.get('level') if s.get('level') is not None else s.get('nivel', 1)
            try:
                level = int(raw_level)
            except (TypeError, ValueError):
                level = 1
            level = max(1, min(level, 5))

            if skill_id:
                if skill_id in seen_ids:
                    continue
            elif name:
                cleaned_name = name.strip()
                if not cleaned_name:
                    continue
                name_key = cleaned_name.lower()
                if name_key in seen_names:
                    continue
                seen_names.add(name_key)

                sql_find = "SELECT habilidad_id FROM public.habilidades WHERE LOWER(nombre) = LOWER(%s) LIMIT 1"
                res_skill = DataBaseHandle.getRecords(sql_find, 1, (cleaned_name,))
                if res_skill['result'] and res_skill['data']:
                    skill_id = res_skill['data']['habilidad_id']
                else:
                    category = s.get('category') or s.get('categoria') or 'Manual'
                    sql_insert = "INSERT INTO public.habilidades (nombre, categoria) VALUES (%s, %s) RETURNING habilidad_id"
                    insert_res = DataBaseHandle.ExecuteNonQuery(sql_insert, (cleaned_name, category))
                    if insert_res['result'] and insert_res['data']:
                        skill_id = insert_res['data']
            else:
                continue

            if not skill_id or skill_id in seen_ids:
                continue

            seen_ids.add(skill_id)
            sql = "INSERT INTO public.habilidades_estudiante (estudiante_id, habilidad_id, nivel) VALUES (%s, %s, %s)"
            DataBaseHandle.ExecuteNonQuery(sql, (student_id, skill_id, level))