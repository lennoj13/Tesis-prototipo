from flask_restful import Resource
from ..Components.metadata_component import MetadataComponent
from ...utils.general.response import response_success, response_error

class MetadataFacultadesService(Resource):
    def get(self):
        success, data, error = MetadataComponent.get_faculties_and_careers()
        if success:
            return response_success(data)
        else:
            return response_error("Error al obtener metadatos", error)
