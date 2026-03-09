from flask import request
from flask_restful import Resource
from ...api.Components.jwt_component import JWTComponent
from ...api.Components.comment_component import CommentComponent
from ...api.Model.Request.comment_request import CommentRequest
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success
from ...utils.database.connection_db import DataBaseHandle

class CommentService(Resource):
    @staticmethod
    def post():
        try:
            HandleLogs.write_log("Servicio de comentarios ejecutándose")
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

            comment_author_id = db_result['data']['u_id']
            # Obtener el cuerpo del request
            rq_json = request.get_json()

            # Validar con el esquema
            comment_request = CommentRequest()
            error_en_validacion = comment_request.validate(rq_json)
            if error_en_validacion:
                HandleLogs.write_log("Error en la validación del request -> " + str(error_en_validacion))
                return response_error("Error en validar el request -> " + str(error_en_validacion))

            # llamar al metodo crear comentario
            result_comment = CommentComponent.create_comment(
                rq_json['comment_content'],
                comment_author_id,
                rq_json['comment_post_id']
            )
            if result_comment['result']:
                return response_success(result_comment['data'])
            else:
                return response_error(result_comment['message'])
        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error en el servicio de comentarios -> " + err.__str__())

    @staticmethod
    def get(post_id):
        try:
            HandleLogs.write_log("Servicio para obtener comentarios ejecutándose")

            # Obtener los comentarios del post
            result_comments = CommentComponent.get_comments_by_post(post_id)
            if result_comments['result']:
                return response_success(result_comments['data'])
            else:
                return response_error(result_comments['message'])
        except Exception as err:
            HandleLogs.write_error(err)
            return response_error("Error en el servicio get de comentarios -> " + err.__str__())
