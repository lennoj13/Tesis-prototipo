from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response

class ProfileComponent:
    @staticmethod
    def get_profile(user_id, role=None):
        try:
            # Obtener datos base del usuario
            sql = """
                SELECT u.user_id, u.login, u.name, u.lastname, u.email, 
                       u.phone, u.profile_picture, r.name as role_name
                FROM public.users u
                JOIN public.roles r ON u.role_id = r.role_id
                WHERE u.user_id = %s
            """
            user_data = DataBaseHandle.getRecords(sql, 1, (user_id,))
            
            if not user_data['result'] or not user_data['data']:
                return internal_response(False, None, "Usuario no encontrado")

            profile_info = user_data['data']
            actual_role = profile_info['role_name'].lower()

            if 'student' in actual_role:
                sql_profile = """
                    SELECT profile_id, career, semester, university, 
                           experience_summary, interests, curriculum_url
                    FROM public.student_profiles WHERE user_id = %s
                """
                extra = DataBaseHandle.getRecords(sql_profile, 1, (user_id,))
                
                if extra['result'] and extra['data']:
                    # Consultar habilidades
                    sql_skills = """
                        SELECT s.skill_id, s.name as skill_name, s.category, ss.level
                        FROM public.student_skills ss
                        JOIN public.skills s ON ss.skill_id = s.skill_id
                        WHERE ss.student_id = %s
                    """
                    skills = DataBaseHandle.getRecords(sql_skills, 0, (extra['data']['profile_id'],))
                    extra['data']['skills'] = skills['data'] if skills['result'] else []
                
            elif 'company' in actual_role:
                sql_profile = """
                    SELECT company_id, company_name, ruc, industry, description, 
                           website, location, contact_email, status
                    FROM public.company_profiles WHERE user_id = %s
                """
                extra = DataBaseHandle.getRecords(sql_profile, 1, (user_id,))
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
            # Actualizar tabla users
            sql_user = """
                UPDATE public.users 
                SET name = %s, lastname = %s, email = %s, phone = %s, updated_at = NOW()
                WHERE user_id = %s
            """
            DataBaseHandle.ExecuteNonQuery(sql_user, (
                p_data.get('name'), p_data.get('lastname'), p_data.get('email'), 
                p_data.get('phone'), user_id
            ))

            if role == 'student':
                sql_stud = """
                    UPDATE public.student_profiles 
                    SET career = %s, semester = %s, university = %s, 
                        experience_summary = %s, interests = %s, 
                        curriculum_url = %s, updated_at = NOW()
                    WHERE user_id = %s
                """
                DataBaseHandle.ExecuteNonQuery(sql_stud, (
                    p_data.get('career'), p_data.get('semester'), p_data.get('university'),
                    p_data.get('experience_summary'), p_data.get('interests'),
                    p_data.get('curriculum_url'), user_id
                ))
                
                # Actualizar habilidades
                sql_get_id = "SELECT profile_id FROM public.student_profiles WHERE user_id = %s"
                res_id = DataBaseHandle.getRecords(sql_get_id, 1, (user_id,))
                
                if res_id['result'] and res_id['data'] and 'skills' in p_data:
                    ProfileComponent._update_student_skills(res_id['data']['profile_id'], p_data['skills'])

            elif role == 'company':
                sql_comp = """
                    UPDATE public.company_profiles 
                    SET company_name = %s, ruc = %s, industry = %s, description = %s, 
                        website = %s, location = %s, contact_email = %s, updated_at = NOW()
                    WHERE user_id = %s
                """
                DataBaseHandle.ExecuteNonQuery(sql_comp, (
                    p_data.get('company_name'), p_data.get('ruc'), p_data.get('industry'),
                    p_data.get('description'), p_data.get('website'), p_data.get('location'),
                    p_data.get('contact_email'), user_id
                ))

            return internal_response(True, None, "Perfil actualizado correctamente")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def _update_student_skills(student_id, skills):
        if not student_id:
            return
        # Limpiar habilidades actuales
        DataBaseHandle.ExecuteNonQuery("DELETE FROM public.student_skills WHERE student_id = %s", (student_id,))
        # Insertar nuevas
        for s in skills:
            skill_id = s.get('skill_id')
            level = s.get('level', 1)
            if skill_id:
                sql = "INSERT INTO public.student_skills (student_id, skill_id, level) VALUES (%s, %s, %s)"
                DataBaseHandle.ExecuteNonQuery(sql, (student_id, skill_id, level))