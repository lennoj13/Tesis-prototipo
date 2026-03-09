from flask import request
from flask_restful import Resource
from ...utils.database.connection_db import DataBaseHandle
from ...api.Components.jwt_component import JWTComponent
from ...api.Components.post_component import PostComponent
from ...api.Model.Request.post_request import PostRequest
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success

class PostService(Resource):
    @staticmethod
    def post():
        try:
            HandleLogs.write_log("Servicio de post, creación de publicaciones ejecutándose")

            # Obtener el token desde los headers
            token = request.headers.get('Authorization')
            if not token:
                return response_error("Token no proporcionado.")

            # Decodificar el token
            decoded_token = JWTComponent.decode_token(token.replace("Bearer ", ""))
            if not decoded_token['result']:
                return response_error("Token no válido o expirado.")
            # Extraer el username del token
            username = decoded_token['data']['username']

            # Consultar el ID del usuario en la base de datos
            sql_user = "SELECT u_id FROM dawa.tb_user WHERE u_login = %s"
            db_result = DataBaseHandle.getRecords(sql_user, 1, (username,))
            if not db_result['result'] or not db_result['data']:
                return response_error("Usuario no encontrado en la base de datos.")

            post_author_id = db_result['data']['u_id']

            # Obtener el cuerpo del request
            rq_json = request.get_json()

            # Validar con el esquema
            new_request = PostRequest()
            error_en_validacion = new_request.validate(rq_json)
            if error_en_validacion:
                HandleLogs.write_log("Error en la validación del request -> " + str(error_en_validacion))
                return response_error("Error en validar el request -> " + str(error_en_validacion))

            # Crear la publicación
            result_post = PostComponent.create_post(
                rq_json['post_content'],
                rq_json.get('post_media'),
                post_author_id,
                rq_json.get('post_group_id', None)
            )
            if result_post['result']:
                return response_success(result_post['data'])
            else:
                return response_error(result_post['message'])
        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error en el servicio de post -> " + err.__str__())

    @staticmethod
    def get():
        try:
            HandleLogs.write_log("Servicio de vista de todas las publicaciones ejecutándose")
            result_post = PostComponent.get_all_posts()
            if result_post['result']:
                return response_success(result_post['data'])
            else:
                return response_error(result_post['message'])
        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error en el servicio get de publicaciones -> " + err.__str__())
