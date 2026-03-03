
from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response
from ...api.Components.jwt_component import JWTComponent
from datetime import datetime

class PostComponent:
    @staticmethod
    def create_post(content, media, author_id, group_id=None):
        try:
            result = False
            data = None
            message = None

            sql = '''
            INSERT INTO dawa.tb_post(post_content, post_media, post_author_id, post_group_id)
            VALUES (%s, %s, %s, %s) RETURNING post_id;
            '''
            params = (content, media, author_id, group_id)
            db_result = DataBaseHandle.ExecuteNonQuery(sql, params)

            if db_result['result']:
                result = True
                data = db_result['data']['post_id']
                message = "Post realizado exitosamente"
            else:
                message = db_result.get('message', "Error al realizar la publicación")
        except Exception as err:
            HandleLogs.write_log("Error en el componente de creación del post -> " + str(err))
            HandleLogs.write_error(err)
            message = "Error atrapado en el catch en la creación del post: " + err.__str__()
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def get_all_posts():
        try:
            result = False
            data = None
            message = None

            sql = '''
            SELECT 
                p.post_id, 
                p.post_content, 
                p.post_media, 
                p.post_author_id, 
                u.u_name || ' ' || u.u_lastname AS author_name,
                p.post_group_id, 
                p.post_created_at
            FROM dawa.tb_post p
            JOIN dawa.tb_user u ON p.post_author_id = u.u_id
            ORDER BY p.post_created_at DESC;
            '''
            db_result = DataBaseHandle.getRecords(sql, 0)
            if db_result['result']:
                result = True
                data = db_result['data']
                # Convertir datetime a cadenas ISO 8601
                for post in data:
                    if isinstance(post.get('post_created_at'), datetime):
                        post['post_created_at'] = post['post_created_at'].isoformat()
            else:
                message = db_result.get('message', "No se ha realizado ninguna publicación")
        except Exception as err:
            HandleLogs.write_log("Error en el select de publicaciones -> " + str(err))
            HandleLogs.write_error(err)
            message = "Ocurrió una excepción en el componente get_all_posts -> " + err.__str__()
        finally:
            return internal_response(result, data, message)
