from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response

class AdminComponent:
    @staticmethod
    def get_user_detail(user_id):
        """Obtener detalle completo de un usuario para el admin."""
        try:
            sql_user = """
                SELECT u.usuario_id, u.cedula, u.login, u.nombre, u.apellido, u.correo, u.telefono,
                       r.nombre as rol, u.activo,
                       TO_CHAR(u.creado_en, 'YYYY-MM-DD') as creado_en
                FROM public.usuarios u
                JOIN public.roles r ON u.rol_id = r.rol_id
                WHERE u.usuario_id = %s
            """
            user_result = DataBaseHandle.getRecords(sql_user, 1, (user_id,))
            if not user_result['result'] or not user_result['data']:
                return internal_response(False, None, "Usuario no encontrado")

            user_data = dict(user_result['data'])

            if user_data['rol'] == 'estudiante':
                sql_profile = """
                    SELECT pe.perfil_id, pe.carrera_id, c.nombre as carrera,
                           f.nombre as facultad, pe.semestre, pe.universidad,
                           pe.resumen_experiencia, pe.intereses, pe.curriculum_url
                    FROM public.perfiles_estudiante pe
                    LEFT JOIN public.carreras c ON pe.carrera_id = c.carrera_id
                    LEFT JOIN public.facultades f ON c.facultad_id = f.facultad_id
                    WHERE pe.usuario_id = %s
                """
                profile_result = DataBaseHandle.getRecords(sql_profile, 1, (user_id,))
                if profile_result['result'] and profile_result['data']:
                    user_data['perfil_estudiante'] = dict(profile_result['data'])

                    sql_skills = """
                        SELECT h.nombre, he.nivel
                        FROM public.habilidades_estudiante he
                        JOIN public.habilidades h ON he.habilidad_id = h.habilidad_id
                        WHERE he.estudiante_id = %s
                        ORDER BY he.nivel DESC
                    """
                    skills_result = DataBaseHandle.getRecords(sql_skills, 0, (profile_result['data']['perfil_id'],))
                    if skills_result['result'] and skills_result['data']:
                        user_data['habilidades'] = [dict(s) for s in skills_result['data']]
                    else:
                        user_data['habilidades'] = []

                    sql_apps = """
                        SELECT 
                            COUNT(*) as total,
                            COUNT(*) FILTER (WHERE estado = 'pendiente') as pendientes,
                            COUNT(*) FILTER (WHERE estado = 'aceptada_empresa') as aceptadas_empresa,
                            COUNT(*) FILTER (WHERE estado = 'aprobada') as aprobadas,
                            COUNT(*) FILTER (WHERE estado = 'rechazada') as rechazadas
                        FROM public.postulaciones WHERE estudiante_id = %s
                    """
                    apps_result = DataBaseHandle.getRecords(sql_apps, 1, (profile_result['data']['perfil_id'],))
                    if apps_result['result'] and apps_result['data']:
                        user_data['postulaciones'] = dict(apps_result['data'])

            elif user_data['rol'] == 'empresa':
                sql_company = """
                    SELECT i.institucion_id, i.nombre as nombre_empresa, i.ruc, i.industria, 
                           i.descripcion, i.sitio_web, i.direccion, i.ciudad,
                           i.correo_contacto, i.telefono as telefono_empresa, i.estado
                    FROM public.instituciones i
                    WHERE i.usuario_id = %s
                """
                company_result = DataBaseHandle.getRecords(sql_company, 1, (user_id,))
                if company_result['result'] and company_result['data']:
                    user_data['perfil_empresa'] = dict(company_result['data'])
                    
                    sql_sups = """
                        SELECT supervisor_id, nombre, numero_identificacion, correo, departamento, cargo, telefono, activo
                        FROM public.supervisores
                        WHERE institucion_id = %s AND activo = true
                        ORDER BY nombre
                    """
                    sups_result = DataBaseHandle.getRecords(sql_sups, 0, (company_result['data']['institucion_id'],))
                    if sups_result['result'] and sups_result['data']:
                        user_data['supervisores'] = [dict(s) for s in sups_result['data']]
                    else:
                        user_data['supervisores'] = []

            return internal_response(True, user_data, "Detalle de usuario obtenido")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def get_stats():
        try:
            queries = {
                'total_estudiantes': "SELECT COUNT(*) as count FROM public.usuarios u JOIN public.roles r ON u.rol_id = r.rol_id WHERE r.nombre = 'estudiante' AND u.activo = true",
                'total_empresas': "SELECT COUNT(*) as count FROM public.usuarios u JOIN public.roles r ON u.rol_id = r.rol_id WHERE r.nombre = 'empresa' AND u.activo = true",
                'total_vacantes': "SELECT COUNT(*) as count FROM public.vacantes WHERE activo = true",
                'total_postulaciones': "SELECT COUNT(*) as count FROM public.postulaciones",
                'postulaciones_pendientes': "SELECT COUNT(*) as count FROM public.postulaciones WHERE estado = 'pendiente'",
                'postulaciones_aceptadas': "SELECT COUNT(*) as count FROM public.postulaciones WHERE estado = 'aceptada_empresa'",
                'postulaciones_aprobadas': "SELECT COUNT(*) as count FROM public.postulaciones WHERE estado = 'aprobada'",
                'postulaciones_rechazadas': "SELECT COUNT(*) as count FROM public.postulaciones WHERE estado = 'rechazada'",
                'empresas_pendientes': "SELECT COUNT(*) as count FROM public.instituciones WHERE estado = 'pendiente'",
            }
            
            stats = {}
            for key, sql in queries.items():
                result = DataBaseHandle.getRecords(sql, 1)
                stats[key] = result['data']['count'] if result['result'] and result['data'] else 0

            return internal_response(True, stats, "Estadísticas obtenidas")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def get_all_companies():
        try:
            sql = """
                SELECT i.institucion_id, i.nombre as nombre_empresa, i.ruc, i.industria, 
                       i.direccion, i.ciudad, i.correo_contacto, i.estado,
                       u.nombre || ' ' || u.apellido as persona_contacto,
                       TO_CHAR(u.creado_en, 'YYYY-MM-DD') as creado_en,
                       (SELECT COUNT(*) FROM public.vacantes v WHERE v.institucion_id = i.institucion_id AND v.activo = true) as vacantes_activas,
                       (SELECT COUNT(*) FROM public.supervisores sv WHERE sv.institucion_id = i.institucion_id AND sv.activo = true) as total_supervisores
                FROM public.instituciones i
                JOIN public.usuarios u ON i.usuario_id = u.usuario_id
                ORDER BY u.creado_en DESC
            """
            result = DataBaseHandle.getRecords(sql, 0)
            if result['result']:
                return internal_response(True, result['data'] or [], "Empresas encontradas")
            return internal_response(False, [], result.get('message', 'Error'))
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, [], str(err))

    @staticmethod
    def update_company_status(institucion_id, nuevo_estado):
        try:
            sql = "UPDATE public.instituciones SET estado = %s, actualizado_en = NOW() WHERE institucion_id = %s"
            DataBaseHandle.ExecuteNonQuery(sql, (nuevo_estado, institucion_id))
            return internal_response(True, None, "Estado actualizado")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def delete_user(user_id, admin_user_id):
        """Desactivar (soft delete) un usuario por su ID."""
        try:
            if str(user_id) == str(admin_user_id):
                return internal_response(False, None, "No puedes eliminar tu propia cuenta")

            sql_check = "SELECT usuario_id, activo FROM public.usuarios WHERE usuario_id = %s"
            check = DataBaseHandle.getRecords(sql_check, 1, (user_id,))
            if not check['result'] or not check['data']:
                return internal_response(False, None, "Usuario no encontrado")
            if not check['data']['activo']:
                return internal_response(False, None, "El usuario ya está desactivado")

            sql = "UPDATE public.usuarios SET activo = false, actualizado_en = NOW() WHERE usuario_id = %s"
            result = DataBaseHandle.ExecuteNonQuery(sql, (user_id,))

            if result['result']:
                return internal_response(True, None, "Usuario eliminado exitosamente")
            return internal_response(False, None, result.get('message', 'Error al eliminar usuario'))
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def get_report_data():
        """Obtener datos reales para los gráficos de reportes."""
        try:
            report = {}

            # 1. Postulaciones por estado
            sql_estados = """
                SELECT 
                    CASE estado
                        WHEN 'pendiente' THEN 'Pendiente'
                        WHEN 'aceptada_empresa' THEN 'Aceptada Empresa'
                        WHEN 'aprobada' THEN 'Aprobada'
                        WHEN 'rechazada' THEN 'Rechazada'
                        ELSE estado
                    END as nombre,
                    COUNT(*) as valor
                FROM public.postulaciones
                GROUP BY estado
                ORDER BY valor DESC
            """
            r1 = DataBaseHandle.getRecords(sql_estados, 0)
            report['postulaciones_por_estado'] = [dict(r) for r in r1['data']] if r1['result'] and r1['data'] else []

            # 2. Vacantes por área
            sql_areas = """
                SELECT COALESCE(area, 'Sin area') as nombre, COUNT(*) as valor
                FROM public.vacantes
                WHERE activo = true
                GROUP BY area
                ORDER BY valor DESC
            """
            r2 = DataBaseHandle.getRecords(sql_areas, 0)
            report['vacantes_por_area'] = [dict(r) for r in r2['data']] if r2['result'] and r2['data'] else []

            # 3. Habilidades más demandadas en vacantes activas
            sql_skills = """
                SELECT h.nombre as nombre, COUNT(*) as valor
                FROM public.habilidades_vacante hv
                JOIN public.habilidades h ON hv.habilidad_id = h.habilidad_id
                JOIN public.vacantes v ON hv.vacante_id = v.vacante_id AND v.activo = true
                GROUP BY h.nombre
                ORDER BY valor DESC
                LIMIT 10
            """
            r3 = DataBaseHandle.getRecords(sql_skills, 0)
            report['habilidades_demandadas'] = [dict(r) for r in r3['data']] if r3['result'] and r3['data'] else []

            # 4. Top empresas por postulaciones recibidas
            sql_empresas = """
                SELECT i.nombre as nombre, COUNT(p.postulacion_id) as postulaciones
                FROM public.instituciones i
                JOIN public.vacantes v ON i.institucion_id = v.institucion_id
                LEFT JOIN public.postulaciones p ON v.vacante_id = p.vacante_id
                WHERE i.estado = 'aprobado'
                GROUP BY i.nombre
                ORDER BY postulaciones DESC
                LIMIT 5
            """
            r4 = DataBaseHandle.getRecords(sql_empresas, 0)
            report['top_empresas'] = [dict(r) for r in r4['data']] if r4['result'] and r4['data'] else []

            return internal_response(True, report, "Datos de reportes obtenidos")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))
