from ...utils.database.connection_db import HandleLogs, DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...api.Components.jwt_component import JWTComponent

class UserComponent:
    @staticmethod
    def get_all_user(facultad_id=None, carrera_id=None):
        try:
            result = False
            data = None
            message = None

            where_clauses = []
            params = []

            if facultad_id:
                # Aplicar filtro por facultad
                where_clauses.append("(pe.facultad_id = %s OR pg.facultad_id = %s OR i.facultad_id = %s OR r.nombre = 'admin')")
                params.extend([facultad_id, facultad_id, facultad_id])
            
            if carrera_id:
                where_clauses.append("(pe.carrera_id = %s OR pg.carrera_id = %s OR r.nombre IN ('empresa', 'admin'))")
                params.extend([carrera_id, carrera_id])

            where_str = " AND ".join(where_clauses)
            if where_str:
                where_str = "WHERE " + where_str
            else:
                where_str = ""

            sql = f"""
                SELECT u.usuario_id, u.cedula, u.nombre, u.apellido, u.correo, u.telefono,
                       r.nombre as rol_nombre, u.activo, pe.semestre,
                       COALESCE(pe.facultad_id, pg.facultad_id, i.facultad_id) as facultad_id, 
                       COALESCE(pe.carrera_id, pg.carrera_id) as carrera_id,
                       TO_CHAR(u.creado_en, 'YYYY-MM-DD') as creado_en,
                       (SELECT COUNT(*) FROM public.postulaciones p WHERE p.estudiante_id = pe.perfil_id) as total_postulaciones,
                       (SELECT COUNT(*) FROM public.postulaciones p WHERE p.estudiante_id = pe.perfil_id AND p.estado IN ('aprobada', 'completada', 'aceptada_empresa')) as practicas_aprobadas
                FROM public.usuarios u
                JOIN public.roles r ON u.rol_id = r.rol_id
                LEFT JOIN public.perfiles_estudiante pe ON u.usuario_id = pe.usuario_id
                LEFT JOIN public.perfiles_gestor pg ON u.usuario_id = pg.usuario_id
                LEFT JOIN public.instituciones i ON u.usuario_id = i.usuario_id
                {where_str}
                ORDER BY u.creado_en DESC
            """

            result_user = DataBaseHandle.getRecords(sql, 0, tuple(params)) if params else DataBaseHandle.getRecords(sql, 0)
            if result_user and result_user.get('result', False):
                result = True
                data = result_user.get('data', [])
            else:
                message = result_user.get('message', 'No se encontraron usuarios.')
        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error al buscar usuarios: " + str(err)
        finally:
            return {"result": result, "data": data, "message": message}

    @staticmethod
    def get_user_by_id(user_id):
        try:
            result = False
            data = None
            message = None

            sql = """
                SELECT u.usuario_id, u.cedula, u.nombre, u.apellido,
                       u.correo, u.telefono, r.nombre as rol_nombre, r.rol_id,
                       CASE 
                           WHEN r.nombre = 'estudiante' THEN pe.perfil_id
                           WHEN r.nombre = 'empresa' THEN i.institucion_id
                           ELSE NULL 
                       END as perfil_id
                FROM public.usuarios u
                JOIN public.roles r ON u.rol_id = r.rol_id
                LEFT JOIN public.perfiles_estudiante pe ON u.usuario_id = pe.usuario_id AND r.nombre = 'estudiante'
                LEFT JOIN public.instituciones i ON u.usuario_id = i.usuario_id AND r.nombre = 'empresa'
                WHERE u.usuario_id = %s 
                  AND u.activo = true
            """

            record = (user_id,)
            user_result = DataBaseHandle.getRecords(sql, 1, record)

            if user_result['result'] and user_result.get('data'):
                result = True
                data = UserComponent.clean_datetime(user_result['data'])
            else:
                message = "Usuario no encontrado"

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error al buscar usuario: " + str(err)
        finally:
            return {"result": result, "data": data, "message": message}

    @staticmethod
    def clean_datetime(user_dit):
        cleaned_user = {}
        for key, value in user_dit.items():
            if value is None:
                cleaned_user[key] = None
            elif hasattr(value, 'isoformat'):
                cleaned_user[key] = value.isoformat()
            else:
                cleaned_user[key] = value
        return cleaned_user

    @staticmethod
    def change_password(user_id, old_password, new_password):
        import bcrypt
        try:
            sql_get = "SELECT contrasena FROM public.usuarios WHERE usuario_id = %s"
            db_res = DataBaseHandle.getRecords(sql_get, 1, (user_id,))
            
            if not db_res['result'] or not db_res['data']:
                return {"result": False, "message": "Usuario no encontrado"}
                
            hashed_pass = db_res['data']['contrasena'].encode('utf-8')
            if not bcrypt.checkpw(old_password.encode('utf-8'), hashed_pass):
                return {"result": False, "message": "Contraseña actual incorrecta"}
                
            new_hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            sql_update = "UPDATE public.usuarios SET contrasena = %s WHERE usuario_id = %s"
            upd_res = DataBaseHandle.ExecuteNonQuery(sql_update, (new_hashed, user_id))
            
            if upd_res['result']:
                return {"result": True, "data": "Contraseña actualizada exitosamente"}
            return {"result": False, "message": "Error al actualizar la contraseña"}
            
        except Exception as err:
            HandleLogs.write_error(err)
            return {"result": False, "message": "Error interno: " + str(err)}
