from src.utils.database.connection_db import DataBaseHandle

sql = "UPDATE public.facultades SET nombre = %s WHERE nombre ILIKE %s"
res = DataBaseHandle.ExecuteNonQuery(sql, ('Ciencias Matemáticas y Físicas', '%matematicas y fisicas%'))
print("Update result:", res)
