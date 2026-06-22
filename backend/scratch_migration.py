from src.utils.database.connection_db import DataBaseHandle

sql = "ALTER TABLE public.perfiles_estudiante ADD COLUMN IF NOT EXISTS calculando_nlp BOOLEAN DEFAULT FALSE;"
try:
    res = DataBaseHandle.ExecuteNonQuery(sql, ())
    print("Migration successful:", res)
except Exception as e:
    print("Error:", e)
