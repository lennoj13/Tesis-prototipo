import os
import sys

sys.path.append(os.getcwd())

from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flasgger import Swagger

from src.api.Routes.load_routes import load_routes
from src.utils.general.logs import HandleLogs

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)

# Configuracion Swagger
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec_1',
            "route": '/apispec_1.json',
            "rule_filter": lambda rule: True,
            "model_filter": lambda tag: True,
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/apidocs/"
}

swagger_template = {
  "swagger": "2.0",
  "info": {
    "title": "API sistema de recomendacion",
    "description": "Documentación de la API para integración con SIUG.",
    "version": "1.0.0"
  }
}

swagger = Swagger(app, config=swagger_config, template=swagger_template)

# Registrar rutas
load_routes(api)

@app.route('/')
def home():
    return {"status": "ok", "message": "MatchPP Backend API está funcionando correctamente", "documentation": "/apidocs/"}, 200

if __name__ == '__main__':
    try:
        HandleLogs.write_log("Servicio MatchPP API Iniciado")
        print("\n" + "="*50)
        print("DOCUMENTACIÓN API DISPONIBLE EN:")
        print("http://localhost:5000/apidocs/")
        print("="*50 + "\n")
        port_os = int(os.environ.get('PORT', 5000))
        app.run(debug=True, host='0.0.0.0', port=port_os, threaded=True)

    except Exception as err:
        HandleLogs.write_error(err)
    finally:
        HandleLogs.write_log("Servicio MatchPP API Finalizado")
