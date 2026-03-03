# Permitir conectarme a una base de datos PostgreSQL
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
    # Ejecuta métodos de tipo SELECT
    @staticmethod
    def getRecords(query, tamanio, record=()):
        conn = None
        cursor = None
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
            if cursor:
                cursor.close()
            if conn:
                conn.close()
            return internal_response(result, data, message)

    # Ejecuta métodos de tipo INSERT-UPDATE-DELETE
    @staticmethod
    def ExecuteNonQuery(query, record):
        conn = None
        cursor = None
        try:
            result = False
            message = None
            data = None
            conn = conn_db()
            cursor = conn.cursor()
            
            cursor.execute(query, record)

            if 'INSERT' in query.upper():
                try:
                    row = cursor.fetchone()
                    if row:
                        data = list(row.values())[0]
                    else:
                        cursor.execute('SELECT LASTVAL()')
                        data = cursor.fetchone()['lastval']
                except Exception:
                    data = 0
                
                conn.commit()
            else:
                conn.commit()
                data = 0
            
            result = True
        except Exception as ex:
            HandleLogs.write_error(ex)
            message = ex.__str__()
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
            return internal_response(result, data, message)
