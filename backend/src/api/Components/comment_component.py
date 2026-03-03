from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response
from datetime import datetime

class CommentComponent:
    @staticmethod
    def create_comment(content, author_id, post_id):
        try:
            result = False
            data = None
            message = None

            sql = '''
            INSERT INTO dawa.tb_comment(comment_content, comment_author_id, comment_post_id)
            VALUES (%s, %s, %s) RETURNING comment_id;
            '''
            params = (content, author_id, post_id)
            db_result = DataBaseHandle.ExecuteNonQuery(sql, params)

            if db_result['result']:
                result = True
                # Asegúrate de devolver el ID correctamente como un diccionario
                data = {'comment_id': db_result['data']}
                message = "Comentario creado exitosamente."
            else:
                message = db_result.get('message', "Error al crear el comentario.")
        except Exception as err:
            HandleLogs.write_log("Error en el componente de creación de comentarios -> " + str(err))
            HandleLogs.write_error(err)
            message = "Error atrapado en el componente de creación de comentarios: " + err.__str__()
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def get_comments_by_post(post_id):
        try:
            result = False
            data = None
            message = None

            sql = '''
            SELECT 
                c.comment_id, 
                c.comment_content, 
                c.comment_author_id, 
                u.u_name || ' ' || u.u_lastname AS author_name,
                c.comment_created_at
            FROM dawa.tb_comment c
            JOIN dawa.tb_user u ON c.comment_author_id = u.u_id
            WHERE c.comment_post_id = %s
            ORDER BY c.comment_created_at ASC;
            '''
            db_result = DataBaseHandle.getRecords(sql, 0, (post_id,))

            # Verifica si el resultado es exitoso
            if db_result['result'] and db_result['data']:
                # Convierte los datetime a cadenas ISO 8601
                raw_data = db_result['data']
                for comment in raw_data:
                    if isinstance(comment['comment_created_at'], datetime):
                        comment['comment_created_at'] = comment['comment_created_at'].isoformat()

                result = True
                data = raw_data
            else:
                message = db_result.get('message', "No se encontraron comentarios para este post.")
                data = []
        except Exception as err:
            HandleLogs.write_log(f"Error al obtener comentarios -> {str(err)}")
            HandleLogs.write_error(err)
            message = f"Error atrapado en el componente get_comments_by_post -> {err.__str__()}"
        finally:
            return internal_response(result, data, message)

