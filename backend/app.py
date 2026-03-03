import os
import sys

sys.path.append(os.getcwd())

from flask import Flask
from flask_cors import CORS
from flask_restful import Api

from src.api.Routes.load_routes import load_routes
from src.utils.general.logs import HandleLogs

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)

# Registrar rutas
load_routes(api)

if __name__ == '__main__':
    try:
        HandleLogs.write_log("Servicio MatchPP API Iniciado")
        port_os = int(os.environ.get('PORT', 5000))
        app.run(debug=True, host='0.0.0.0', port=port_os, threaded=True)

    except Exception as err:
        HandleLogs.write_error(err)
    finally:
        HandleLogs.write_log("Servicio MatchPP API Finalizado")
