from flask import request
from flask_restful import Resource

from ...api.Components.admin_component import AdminComponent
from ...api.Components.auth_component import AuthComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success

class AdminStatsService(Resource):
    @staticmethod
    def get():
        """Obtener estadísticas para el dashboard admin"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")
            
            if auth['data'].get('role') not in ('admin', 'gestor'):
                return response_error("Acceso denegado: se requiere rol admin o gestor")

            # Force filters from token if user is gestor
            if auth['data'].get('role') == 'gestor':
                facultad_id = auth['data'].get('facultad_id')
                carrera_id = auth['data'].get('carrera_id')
            else:
                facultad_id = request.args.get('facultad_id')
                carrera_id = request.args.get('carrera_id')

            result = AdminComponent.get_stats(facultad_id, carrera_id)
            if result['result']:
                return response_success(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class AdminUserDetailService(Resource):
    @staticmethod
    def get(user_id):
        """Obtener detalle completo de un usuario (admin)"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")
            
            if auth['data'].get('role') not in ('admin', 'gestor', 'estudiante'):
                return response_error("Acceso denegado")

            result = AdminComponent.get_user_detail(user_id)
            if result['result']:
                return response_success(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class AdminCompanyService(Resource):
    @staticmethod
    def get():
        """Obtener todas las empresas (admin)"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")
                
            if auth['data'].get('role') not in ('admin', 'gestor', 'estudiante'):
                return response_error("Acceso denegado")

            facultad_id = None
            if auth['data'].get('role') in ('gestor', 'estudiante'):
                facultad_id = auth['data'].get('facultad_id')

            approved_only = auth['data'].get('role') == 'estudiante'

            result = AdminComponent.get_all_companies(facultad_id, approved_only)
            if result['result']:
                return response_success(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class AdminCompanyStatusService(Resource):
    @staticmethod
    def put(company_id):
        """Actualizar estado de empresa (aprobar/rechazar)"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")
            
            if auth['data'].get('role') not in ('admin', 'gestor'):
                return response_error("Acceso denegado: se requiere rol admin o gestor")

            rq_json = request.get_json()
            new_status = rq_json.get('status') or rq_json.get('estado')
            valid = ['pendiente', 'aprobado', 'rechazado']
            if new_status not in valid:
                return response_error(f"Estado no válido. Use: {', '.join(valid)}")

            result = AdminComponent.update_company_status(company_id, new_status)
            if result['result']:
                return response_success(None)
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class AdminDeleteUserService(Resource):
    @staticmethod
    def delete(user_id):
        """Eliminar (desactivar) un usuario"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")
            
            if auth['data'].get('role') not in ('admin',):
                return response_error("Acceso denegado: se requiere rol admin")

            admin_user_id = auth['data'].get('user_id')
            result = AdminComponent.delete_user(user_id, admin_user_id)
            if result['result']:
                return response_success(None)
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

    @staticmethod
    def put(user_id):
        """Editar (actualizar) cualquier usuario o empresa por un admin"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")
            
            if auth['data'].get('role') not in ('admin',):
                return response_error("Acceso denegado: se requiere rol admin")

            data = request.get_json()
            result = AdminComponent.update_user(user_id, data)
            
            if result['result']:
                return response_success(None)
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class AdminReportsService(Resource):
    @staticmethod
    def get():
        """Obtener datos reales para los gráficos de reportes"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")
            
            if auth['data'].get('role') not in ('admin', 'gestor'):
                return response_error("Acceso denegado: se requiere rol admin o gestor")

            if auth['data'].get('role') == 'gestor':
                facultad_id = auth['data'].get('facultad_id')
                carrera_id = auth['data'].get('carrera_id')
            else:
                facultad_id = request.args.get('facultad_id')
                carrera_id = request.args.get('carrera_id')

            result = AdminComponent.get_report_data(facultad_id, carrera_id)
            if result['result']:
                return response_success(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class AdminCreateUserService(Resource):
    @staticmethod
    def post():
        """Crear un nuevo usuario (admin)"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")
            
            if auth['data'].get('role') not in ('admin',):
                return response_error("Acceso denegado: se requiere rol admin")

            rq = request.get_json()
            cedula = rq.get('cedula')
            nombre = rq.get('nombre') or rq.get('name')
            apellido = rq.get('apellido') or rq.get('lastname')
            correo = rq.get('correo') or rq.get('email')
            contrasena = rq.get('contrasena') or rq.get('password')
            rol = rq.get('rol') or rq.get('role', 'estudiante')
            telefono = rq.get('telefono') or rq.get('phone')

            if not all([cedula, nombre, apellido, correo, contrasena]):
                return response_error("Campos requeridos: cedula, nombre, apellido, correo, contrasena")

            result = AdminComponent.create_user(cedula, nombre, apellido, correo, contrasena, rol, telefono, extra_data=rq)
            if result['result']:
                return response_success(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class AdminCreateCompanyService(Resource):
    @staticmethod
    def post():
        """Crear una empresa con su usuario representante (admin)"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")
            
            if auth['data'].get('role') not in ('admin',):
                return response_error("Acceso denegado: se requiere rol admin")

            rq = request.get_json()
            required = ['cedula_representante', 'nombre_representante', 'apellido_representante',
                        'correo', 'contrasena', 'nombre_empresa', 'ruc']
            missing = [f for f in required if not rq.get(f)]
            if missing:
                return response_error(f"Campos requeridos faltantes: {', '.join(missing)}")

            result = AdminComponent.create_company(
                cedula_representante=rq['cedula_representante'],
                nombre_representante=rq['nombre_representante'],
                apellido_representante=rq['apellido_representante'],
                correo=rq['correo'],
                contrasena=rq['contrasena'],
                telefono=rq.get('telefono'),
                nombre_empresa=rq['nombre_empresa'],
                ruc=rq['ruc'],
                industria=rq.get('industria', ''),
                direccion=rq.get('direccion'),
                ciudad=rq.get('ciudad', 'Guayaquil'),
                correo_contacto=rq.get('correo_contacto'),
                sitio_web=rq.get('sitio_web'),
                facultad_id=rq.get('facultad_id', 1),
                telefono_empresa=rq.get('telefono_empresa'),
                fecha_limite_convenio=rq.get('fecha_limite_convenio'),
                codigo_convenio=rq.get('codigo_convenio'),
                tipo_convenio=rq.get('tipo_convenio', 'PRÁCTICAS PREPROFESIONALES'),
                fecha_inicio_convenio=rq.get('fecha_inicio_convenio'),
                nombre_abreviado=rq.get('nombre_abreviado')
            )
            if result['result']:
                return response_success(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class AdminToggleUserService(Resource):
    @staticmethod
    def put(user_id):
        """Activar/desactivar un usuario (toggle)"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")
            
            if auth['data'].get('role') not in ('admin',):
                return response_error("Acceso denegado: se requiere rol admin")

            admin_user_id = auth['data'].get('user_id')
            result = AdminComponent.toggle_user_status(user_id, admin_user_id)
            if result['result']:
                return response_success(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class AdminCompanyDetailService(Resource):
    @staticmethod
    def get(company_id):
        """Obtener detalle completo de una empresa"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")
            
            if auth['data'].get('role') not in ('admin', 'gestor'):
                return response_error("Acceso denegado")

            result = AdminComponent.get_company_detail(company_id)
            if result['result']:
                return response_success(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

    @staticmethod
    def put(company_id):
        """Editar datos de la empresa y representante"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")
            
            if auth['data'].get('role') not in ('admin',):
                return response_error("Acceso denegado: se requiere rol admin")

            data = request.get_json()
            result = AdminComponent.update_company(company_id, data)
            
            if result['result']:
                return response_success(None)
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class AdminUserSearchService(Resource):
    @staticmethod
    def get():
        """Buscar un usuario por su cédula"""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")
            
            if auth['data'].get('role') not in ('admin', 'gestor'):
                return response_error("Acceso denegado")

            cedula = request.args.get('cedula')
            if not cedula:
                return response_error("Se requiere el parámetro cedula")

            result = AdminComponent.search_user_by_cedula(cedula)
            if result['result']:
                return response_success(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class AdminCreateSupervisorService(Resource):
    @staticmethod
    def post(company_id):
        """Crear un supervisor nuevo para una empresa."""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error("No autorizado")
            
            if auth['data'].get('role') not in ('admin', 'gestor'):
                return response_error("Acceso denegado")

            data = request.get_json()
            if not data or 'nombre' not in data:
                return response_error("Datos incompletos")

            result = AdminComponent.create_supervisor(company_id, data)
            if result['result']:
                return response_success(result['data'])
            return response_error(result['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

class AdminSupervisorService(Resource):
    @staticmethod
    def put(supervisor_id):
        """Actualizar un supervisor existente."""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result'] or auth['data'].get('role') not in ('admin', 'gestor'):
                return response_error("No autorizado o sin permisos")
            
            data = request.get_json()
            if not data:
                return response_error("Datos incompletos")

            result = AdminComponent.update_supervisor(supervisor_id, data)
            if result['result']:
                return response_success(None)
            return response_error(result['message'])
        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))

    @staticmethod
    def delete(supervisor_id):
        """Eliminación lógica de un supervisor."""
        try:
            auth = AuthComponent.verify(request)
            if not auth['result'] or auth['data'].get('role') not in ('admin', 'gestor'):
                return response_error("No autorizado o sin permisos")

            result = AdminComponent.delete_supervisor(supervisor_id)
            if result['result']:
                return response_success(None)
            return response_error(result['message'])
        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error: " + str(err))
