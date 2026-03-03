from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response

class ProfileComponent:
    @staticmethod
    def get_profile(user_id, role=None):
        try:
            #Obtener el usuario
            sql = """
                SELECT u.u_id, u.u_login, u.u_name, u.u_lastname, u.u_email, 
                       u.u_phone, u.u_profile_picture, r.name as role_name
                FROM dawa.tb_user u
                JOIN dawa.tb_role r ON u.role_id = r.role_id
                WHERE u.u_id = %s
            """
            user_data = DataBaseHandle.getRecords(sql, 1, (user_id,))
            
            if not user_data['result'] or not user_data['data']:
                return internal_response(False, None, "Usuario no encontrado")

            profile_info = user_data['data']
            actual_role = profile_info['role_name'].lower() 

            #Consultas para el rol del usuario
            if 'student' in actual_role:
                sql_profile = """
                    SELECT profile_id, career, semester, university, experience_summary, curriculum_url
                    FROM dawa.tb_student_profile WHERE user_id = %s
                """
                extra = DataBaseHandle.getRecords(sql_profile, 1, (user_id,))
                
                if extra['result'] and extra['data']:
                    #Consultar habilidadese
                    sql_skills = """
                        SELECT s.skill_id, s.name as skill_name, ss.level
                        FROM dawa.tb_student_skill ss
                        JOIN dawa.tb_skill s ON ss.skill_id = s.skill_id
                        WHERE ss.student_id = %s
                    """
                    skills = DataBaseHandle.getRecords(sql_skills, 0, (extra['data']['profile_id'],))
                    extra['data']['skills'] = skills['data'] if skills['result'] else []
                
            else: #company
                sql_profile = """
                    SELECT company_id, company_name, description, industry, website, location
                    FROM dawa.tb_company_profile WHERE user_id = %s
                """
                extra = DataBaseHandle.getRecords(sql_profile, 1, (user_id,))

            profile_info['details'] = extra['data'] if extra['result'] else {}
            return internal_response(True, profile_info, "Perfil recuperado")

        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))
        
    @staticmethod
    def update_profile(user_id, role, p_data):
        try:
            #Actualizar tb_user
            sql_user = """
                UPDATE dawa.tb_user 
                SET u_name = %s, u_lastname = %s, u_email = %s, u_phone = %s, updated_at = NOW()
                WHERE u_id = %s
            """
            DataBaseHandle.ExecuteNonQuery(sql_user, (
                p_data['u_name'], p_data['u_lastname'], p_data['u_email'], 
                p_data.get('u_phone'), user_id
            ))

            if role == 'student':
                sql_stud = """
                    UPDATE dawa.tb_student_profile 
                    SET career = %s, semester = %s, university = %s, 
                        experience_summary = %s, curriculum_url = %s, updated_at = NOW()
                    WHERE user_id = %s
                """
                DataBaseHandle.ExecuteNonQuery(sql_stud, (
                    p_data.get('career'), p_data.get('semester'), p_data.get('university'),
                    p_data.get('experience_summary'), p_data.get('curriculum_url'), user_id
                ))
                
                #obtener el profile_id para las habilidades
                sql_get_id = "SELECT profile_id FROM dawa.tb_student_profile WHERE user_id = %s"
                res_id = DataBaseHandle.getRecords(sql_get_id, 1, (user_id,))
                
                if res_id['result'] and res_id['data']:
                    student_profile_id = res_id['data']['profile_id']
                    #Actualizar habilidades
                    if 'skills' in p_data:
                        ProfileComponent._update_student_skills(student_profile_id, p_data['skills'])

            elif role == 'company':
                sql_comp = """
                    UPDATE dawa.tb_company_profile 
                    SET company_name = %s, industry = %s, description = %s, 
                        website = %s, location = %s
                    WHERE user_id = %s
                """
                DataBaseHandle.ExecuteNonQuery(sql_comp, (
                    p_data.get('company_name'), p_data.get('industry'), p_data.get('description'),
                    p_data.get('website'), p_data.get('location'), user_id
                ))

            return internal_response(True, None, "Perfil actualizado correctamente")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def _update_student_skills(student_id, skills):
        # Asegurarnos de que el student_id no sea None o 0
        if not student_id:
            return
            
        #Limpiar habilidades
        DataBaseHandle.ExecuteNonQuery("DELETE FROM dawa.tb_student_skill WHERE student_id = %s", (student_id,))
        
        # Insertar nuevas
        for s in skills:
            # Validar que skill_id exista en el objeto
            skill_id = s.get('skill_id')
            level = s.get('level', 1)
            if skill_id:
                sql = "INSERT INTO dawa.tb_student_skill (student_id, skill_id, level) VALUES (%s, %s, %s)"
                DataBaseHandle.ExecuteNonQuery(sql, (student_id, skill_id, level))






    # @staticmethod
    # def update_profile(user_id, role, p_data):
    #     try:
    #         # 1. Actualizar tb_user
    #         sql_user = """
    #             UPDATE dawa.tb_user 
    #             SET u_name = %s, u_lastname = %s, u_email = %s, u_phone = %s, updated_at = NOW()
    #             WHERE u_id = %s
    #         """
    #         DataBaseHandle.ExecuteNonQuery(sql_user, (
    #             p_data['u_name'], p_data['u_lastname'], p_data['u_email'], 
    #             p_data.get('u_phone'), user_id
    #         ))

    #         if role == 'student':
    #             sql_stud = """
    #                 UPDATE dawa.tb_student_profile 
    #                 SET career = %s, semester = %s, university = %s, 
    #                     experience_summary = %s, curriculum_url = %s, updated_at = NOW()
    #                 WHERE user_id = %s RETURNING profile_id
    #             """
    #             res = DataBaseHandle.ExecuteNonQuery(sql_stud, (
    #                 p_data.get('career'), p_data.get('semester'), p_data.get('university'),
    #                 p_data.get('experience_summary'), p_data.get('curriculum_url'), user_id
    #             ))
                
    #             # Actualizar habilidades si vienen en el request
    #             if 'skills' in p_data and res['result']:
    #                 ProfileComponent._update_student_skills(res['data'], p_data['skills'])

    #         elif role == 'company':
    #             sql_comp = """
    #                 UPDATE dawa.tb_company_profile 
    #                 SET company_name = %s, industry = %s, description = %s, 
    #                     website = %s, location = %s
    #                 WHERE user_id = %s
    #             """
    #             DataBaseHandle.ExecuteNonQuery(sql_comp, (
    #                 p_data.get('company_name'), p_data.get('industry'), p_data.get('description'),
    #                 p_data.get('website'), p_data.get('location'), user_id
    #             ))

    #         return internal_response(True, None, "Perfil actualizado correctamente")
    #     except Exception as err:
    #         HandleLogs.write_error(err)
    #         return internal_response(False, None, str(err))

    # @staticmethod
    # def _update_student_skills(student_id, skills):
    #     # Limpiar habilidades actuales e insertar nuevas
    #     DataBaseHandle.ExecuteNonQuery("DELETE FROM dawa.tb_student_skill WHERE student_id = %s", (student_id,))
    #     for s in skills:
    #         sql = "INSERT INTO dawa.tb_student_skill (student_id, skill_id, level) VALUES (%s, %s, %s)"
    #         DataBaseHandle.ExecuteNonQuery(sql, (student_id, s['skill_id'], s['level']))