import os
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()

# Parsear DATABASE_URL en sus componentes
_db_url = urlparse(os.getenv('DATABASE_URL'))

class Parametros:
    db_user = _db_url.username
    db_pass = _db_url.password
    db_host = _db_url.hostname
    db_name = _db_url.path.lstrip('/')
    db_port = str(_db_url.port or 5432)
    secret_jwt = os.getenv('JWT_SECRET_KEY', 'MatchUG_JWT_Secret_2026!')
