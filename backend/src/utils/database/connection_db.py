#Permitir conectarme a una base de datos PostgreSQl
import psycopg2
import psycopg2.extras
from psycopg2.extras import RealDictCursor

from ...utils.general.config import Parametros
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response


def conn_db():
    return psycopg2.connect(host=Parametros.db_host,
                            port=int(Parametros.db_port),
                            user=Parametros.db_user,
                            password=Parametros.db_pass,
                            database=Parametros.db_name,
                            cursor_factory=RealDictCursor)

class DataBaseHandle:
    #ejecuta metodos de tipo select
    @staticmethod
    def getRecords(query,  tamanio, record=()):
        try:
            result = False
            message = None
            data = None

            conn = conn_db()
            cursor = conn.cursor()
            if len(record) == 0:
                cursor.execute(query)
            else:
                cursor.execute(query, record)
            # tamanio es 0 todos, 1 solo uno, > 1 n registros
            if tamanio == 0:
                res = cursor.fetchall()
            elif tamanio == 1:
                res = cursor.fetchone()
            else:
                res = cursor.fetchmany(tamanio)

            data = res
            result = True
        except Exception as ex:
            HandleLogs.write_error(ex)
            message = ex.__str__()
        finally:
            cursor.close()
            conn.close()
            return internal_response(result, data, message)

    #ejecuta metodos de tipo INSERT-UPDATE-DELETE
    # @staticmethod
    # def ExecuteNonQuery(query, record):
    #     try:
    #         result = False
    #         message = None
    #         data = None
    #         conn = conn_db()
    #         cursor = conn.cursor()
    #         if len(record) == 0:
    #             cursor.execute(query)
    #         else:
    #             cursor.execute(query, record)

    #         if query.find('INSERT') > -1:
    #             cursor.execute('SELECT LASTVAL()')
    #             ult_id = cursor.fetchone()['lastval']
    #             conn.commit()
    #             data = ult_id
    #         else:
    #             data = 0
    #         result = True
    #     except Exception as ex:
    #         HandleLogs.write_error(ex)
    #         message = ex.__str__()
    #     finally:
    #         cursor.close()
    #         conn.close()
    #         return internal_response(result, data, message)
    @staticmethod
    def ExecuteNonQuery(query, record):
        try:
            result = False
            message = None
            data = None
            conn = conn_db()
            cursor = conn.cursor()
            
            # Ejecutamos la sentencia principal
            cursor.execute(query, record)

            # Verificamos si es un INSERT
            if 'INSERT' in query.upper():
                # PRIMERO: Intentamos ver si la consulta ya traía un RETURNING
                try:
                    row = cursor.fetchone()
                    if row:
                        # Si el cursor tiene datos (por el RETURNING), tomamos el primer valor
                        data = list(row.values())[0]
                    else:
                        #Si no hubo RETURNING, intentamos LASTVAL() con un try interno
                        cursor.execute('SELECT LASTVAL()')
                        data = cursor.fetchone()['lastval']
                except Exception:
                    # Si falla el RETURNING y falla el LASTVAL no rompemos el proceso
                    data = 0
                
                conn.commit()
            else:
                # Para UPDATE o DELETE
                conn.commit()
                data = 0
            
            result = True
        except Exception as ex:
            HandleLogs.write_error(ex)
            message = ex.__str__()
        finally:
            cursor.close()
            conn.close()
            return internal_response(result, data, message)

