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

            if user_data['rol'] in ('estudiante', 'gestor'):
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
                       u.usuario_id, u.activo, u.nombre || ' ' || u.apellido as persona_contacto,
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

    @staticmethod
    def create_user(cedula, nombre, apellido, correo, contrasena, rol_nombre, telefono=None, extra_data=None):
        """Crear un nuevo usuario desde el panel admin."""
        import bcrypt
        try:
            # Verificar que el rol exista
            sql_rol = "SELECT rol_id FROM public.roles WHERE nombre = %s"
            rol_result = DataBaseHandle.getRecords(sql_rol, 1, (rol_nombre,))
            if not rol_result['result'] or not rol_result['data']:
                return internal_response(False, None, f"Rol '{rol_nombre}' no encontrado")
            rol_id = rol_result['data']['rol_id']

            # Validar dominio de correo
            if rol_nombre in ['estudiante', 'gestor', 'admin'] and not correo.lower().endswith('@ug.edu.ec'):
                return internal_response(False, None, "El correo para este rol debe terminar en @ug.edu.ec")

            # Verificar duplicados
            sql_dup = "SELECT usuario_id FROM public.usuarios WHERE cedula = %s OR correo = %s OR login = %s"
            dup_result = DataBaseHandle.getRecords(sql_dup, 1, (cedula, correo, correo))
            if dup_result['result'] and dup_result['data']:
                return internal_response(False, None, "Ya existe un usuario con esa cedula o correo")

            # Hash de contraseña
            hashed = bcrypt.hashpw(contrasena.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

            sql_insert = """
                INSERT INTO public.usuarios (cedula, login, contrasena, nombre, apellido, correo, telefono, rol_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING usuario_id
            """
            result = DataBaseHandle.ExecuteNonQuery(sql_insert, (
                cedula, correo, hashed, nombre, apellido, correo, telefono, rol_id
            ))
            if result['result']:
                user_id = result['data']
                # Si es estudiante o gestor, crear perfil para enlazar con carrera
                if rol_nombre in ('estudiante', 'gestor'):
                    extra = extra_data or {}
                    carrera_id_val = extra.get('carrera_id')
                    if carrera_id_val == '': carrera_id_val = None
                    semestre_val = extra.get('semestre')
                    if semestre_val == '': semestre_val = None

                    sql_profile = """
                        INSERT INTO public.perfiles_estudiante (usuario_id, universidad, carrera_id, semestre)
                        VALUES (%s, 'Universidad de Guayaquil', %s, %s)
                    """
                    DataBaseHandle.ExecuteNonQuery(sql_profile, (
                        user_id, 
                        carrera_id_val, 
                        semestre_val
                    ))
                return internal_response(True, {'usuario_id': user_id}, "Usuario creado exitosamente")
            return internal_response(False, None, result.get('message', 'Error al crear usuario'))
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def update_user(user_id, data):
        """Actualizar datos completos de un usuario desde el panel admin."""
        try:
            # Check if user exists and get role
            sql_check = """
                SELECT u.usuario_id, r.nombre as rol_nombre 
                FROM public.usuarios u
                JOIN public.roles r ON u.rol_id = r.rol_id
                WHERE u.usuario_id = %s
            """
            check_res = DataBaseHandle.getRecords(sql_check, 1, (user_id,))
            if not check_res['result'] or not check_res['data']:
                return internal_response(False, None, "Usuario no encontrado")
            
            rol_nombre = check_res['data']['rol_nombre']

            # Update core user data
            sql_user = """
                UPDATE public.usuarios
                SET cedula = COALESCE(%s, cedula),
                    nombre = COALESCE(%s, nombre),
                    apellido = COALESCE(%s, apellido),
                    correo = COALESCE(%s, correo),
                    telefono = COALESCE(%s, telefono),
                    activo = COALESCE(%s, activo)
                WHERE usuario_id = %s
            """
            DataBaseHandle.ExecuteNonQuery(sql_user, (
                data.get('cedula'), data.get('nombre'), data.get('apellido'),
                data.get('correo'), data.get('telefono'), data.get('activo'),
                user_id
            ))

            # Update profile data based on role
            if rol_nombre in ('estudiante', 'gestor'):
                carrera_id_val = data.get('carrera_id')
                if carrera_id_val == '': carrera_id_val = None
                semestre_val = data.get('semestre')
                if semestre_val == '': semestre_val = None

                # Only update if values are provided (not None). If they want to explicitly remove, we'd need a different logic, but usually we just overwrite.
                # However, if carrera_id_val is None, we don't want to coalesce it to NULL if we just didn't pass it, but data.get() returns None if not passed.
                # Wait, if data.get('semestre') is None, COALESCE(None, semestre) -> semestre. This is correct.
                # But if we want to overwrite with empty, we'd pass empty. Since we just converted '' to None, COALESCE(None, semestre) will IGNORE the update!
                # To actually update it, we should do:
                sql_profile = """
                    UPDATE public.perfiles_estudiante
                    SET carrera_id = %s,
                        semestre = %s
                    WHERE usuario_id = %s
                """
                DataBaseHandle.ExecuteNonQuery(sql_profile, (
                    carrera_id_val, semestre_val, user_id
                ))

            return internal_response(True, None, "Usuario actualizado exitosamente")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def create_company(cedula_representante, nombre_representante, apellido_representante,
                       correo, contrasena, telefono, nombre_empresa, ruc, industria,
                       direccion=None, ciudad='Guayaquil', correo_contacto=None, sitio_web=None):
        """Crear una empresa con su usuario representante desde el panel admin."""
        import bcrypt
        try:
            # Verificar duplicados de usuario
            sql_dup = "SELECT usuario_id FROM public.usuarios WHERE cedula = %s OR correo = %s OR login = %s"
            dup_result = DataBaseHandle.getRecords(sql_dup, 1, (cedula_representante, correo, correo))
            if dup_result['result'] and dup_result['data']:
                return internal_response(False, None, "Ya existe un usuario con esa cedula o correo")

            # Verificar duplicado de RUC
            if ruc:
                sql_ruc = "SELECT institucion_id FROM public.instituciones WHERE ruc = %s"
                ruc_result = DataBaseHandle.getRecords(sql_ruc, 1, (ruc,))
                if ruc_result['result'] and ruc_result['data']:
                    return internal_response(False, None, "Ya existe una empresa con ese RUC")

            # Obtener rol empresa
            sql_rol = "SELECT rol_id FROM public.roles WHERE nombre = 'empresa'"
            rol_result = DataBaseHandle.getRecords(sql_rol, 1)
            if not rol_result['result'] or not rol_result['data']:
                return internal_response(False, None, "Rol 'empresa' no encontrado en el sistema")
            rol_id = rol_result['data']['rol_id']

            # Hash contraseña
            hashed = bcrypt.hashpw(contrasena.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

            # Crear usuario
            sql_user = """
                INSERT INTO public.usuarios (cedula, login, contrasena, nombre, apellido, correo, telefono, rol_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING usuario_id
            """
            user_result = DataBaseHandle.ExecuteNonQuery(sql_user, (
                cedula_representante, correo, hashed, nombre_representante, apellido_representante,
                correo, telefono, rol_id
            ))
            if not user_result['result']:
                return internal_response(False, None, user_result.get('message', 'Error al crear usuario'))

            user_id = user_result['data']

            # Crear institución
            sql_inst = """
                INSERT INTO public.instituciones 
                    (usuario_id, nombre, ruc, industria, direccion, ciudad, correo_contacto, sitio_web, estado)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'aprobado')
                RETURNING institucion_id
            """
            inst_result = DataBaseHandle.ExecuteNonQuery(sql_inst, (
                user_id, nombre_empresa, ruc, industria, direccion, ciudad,
                correo_contacto or correo, sitio_web
            ))
            if inst_result['result']:
                return internal_response(True, {
                    'usuario_id': user_id,
                    'institucion_id': inst_result['data']
                }, "Empresa creada exitosamente")
            return internal_response(False, None, inst_result.get('message', 'Error al crear institucion'))
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def delete_user(user_id, admin_user_id):
        """Eliminación física de un usuario (y sus datos en cascada)."""
        try:
            if str(user_id) == str(admin_user_id):
                return internal_response(False, None, "No puedes eliminar tu propia cuenta de administrador")

            sql_check = "SELECT usuario_id FROM public.usuarios WHERE usuario_id = %s"
            check = DataBaseHandle.getRecords(sql_check, 1, (user_id,))
            if not check['result'] or not check['data']:
                return internal_response(False, None, "Usuario no encontrado")

            sql_del = "DELETE FROM public.usuarios WHERE usuario_id = %s"
            result = DataBaseHandle.ExecuteNonQuery(sql_del, (user_id,))
            
            if result['result']:
                return internal_response(True, None, "Usuario eliminado permanentemente")
            return internal_response(False, None, result.get('message', 'Error al eliminar usuario'))
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def toggle_user_status(user_id, admin_user_id):
        """Activar o desactivar un usuario (toggle)."""
        try:
            if str(user_id) == str(admin_user_id):
                return internal_response(False, None, "No puedes modificar tu propia cuenta")

            sql_check = "SELECT usuario_id, activo, nombre, apellido FROM public.usuarios WHERE usuario_id = %s"
            check = DataBaseHandle.getRecords(sql_check, 1, (user_id,))
            if not check['result'] or not check['data']:
                return internal_response(False, None, "Usuario no encontrado")

            current_status = check['data']['activo']
            new_status = not current_status
            action = "activado" if new_status else "desactivado"

            sql = "UPDATE public.usuarios SET activo = %s, actualizado_en = NOW() WHERE usuario_id = %s"
            result = DataBaseHandle.ExecuteNonQuery(sql, (new_status, user_id))

            if result['result']:
                return internal_response(True, {'activo': new_status}, f"Usuario {action} exitosamente")
            return internal_response(False, None, result.get('message', 'Error al cambiar estado'))
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def get_company_detail(institucion_id):
        """Obtener detalle completo de una empresa con supervisores y vacantes."""
        try:
            # Datos de la empresa
            sql_company = """
                SELECT i.institucion_id, i.nombre as nombre_empresa, i.ruc, i.industria,
                       i.descripcion, i.sitio_web, i.direccion, i.ciudad,
                       i.correo_contacto, i.telefono, i.estado,
                       u.nombre || ' ' || u.apellido as representante,
                       u.correo as correo_representante,
                       TO_CHAR(i.creado_en, 'YYYY-MM-DD') as fecha_registro
                FROM public.instituciones i
                JOIN public.usuarios u ON i.usuario_id = u.usuario_id
                WHERE i.institucion_id = %s
            """
            company_result = DataBaseHandle.getRecords(sql_company, 1, (institucion_id,))
            if not company_result['result'] or not company_result['data']:
                return internal_response(False, None, "Empresa no encontrada")

            company_data = dict(company_result['data'])

            # Supervisores
            sql_sups = """
                SELECT supervisor_id, nombre, numero_identificacion, correo, 
                       departamento, cargo, telefono, activo,
                       TO_CHAR(creado_en, 'YYYY-MM-DD') as creado_en
                FROM public.supervisores
                WHERE institucion_id = %s
                ORDER BY activo DESC, nombre
            """
            sups_result = DataBaseHandle.getRecords(sql_sups, 0, (institucion_id,))
            company_data['supervisores'] = [dict(s) for s in sups_result['data']] if sups_result['result'] and sups_result['data'] else []

            # Vacantes
            sql_vacs = """
                SELECT v.vacante_id, v.titulo, v.area, v.modalidad, v.ubicacion,
                       v.cupos, v.activo, v.total_horas,
                       TO_CHAR(v.creado_en, 'YYYY-MM-DD') as creado_en,
                       (SELECT COUNT(*) FROM public.postulaciones p WHERE p.vacante_id = v.vacante_id) as total_postulaciones
                FROM public.vacantes v
                WHERE v.institucion_id = %s
                ORDER BY v.creado_en DESC
            """
            vacs_result = DataBaseHandle.getRecords(sql_vacs, 0, (institucion_id,))
            company_data['vacantes'] = [dict(v) for v in vacs_result['data']] if vacs_result['result'] and vacs_result['data'] else []

            return internal_response(True, company_data, "Detalle de empresa obtenido")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def search_user_by_cedula(cedula):
        """Buscar un usuario por cédula y devolver su detalle completo."""
        try:
            sql = "SELECT usuario_id FROM public.usuarios WHERE cedula = %s"
            result = DataBaseHandle.getRecords(sql, 1, (cedula,))
            if result['result'] and result['data']:
                return AdminComponent.get_user_detail(result['data']['usuario_id'])
            return internal_response(False, None, "Estudiante no encontrado con esa cédula")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))

    @staticmethod
    def create_supervisor(institucion_id, data):
        """Crear un nuevo supervisor para una institución."""
        try:
            sql = '''
                INSERT INTO public.supervisores (institucion_id, numero_identificacion, nombre, correo, departamento, cargo, telefono)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING supervisor_id
            '''
            params = (
                institucion_id,
                data.get('numero_identificacion', '9999999999'),
                data.get('nombre'),
                data.get('correo'),
                data.get('departamento'),
                data.get('cargo'),
                data.get('telefono')
            )
            result = DataBaseHandle.ExecuteNonQuery(sql, params)
            if result['result']:
                return internal_response(True, {'supervisor_id': result['insert_id']}, "Supervisor creado exitosamente")
            return internal_response(False, None, "No se pudo crear el supervisor")
        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))
