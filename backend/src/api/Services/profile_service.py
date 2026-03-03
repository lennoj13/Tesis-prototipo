from flask import request
from flask_restful import Resource
from ...api.Components.profile_component import ProfileComponent
from ...api.Components.jwt_component import JWTComponent
from ...api.Model.Request.profile_request import ProfileRequest
from ...utils.general.response import response_error, response_success

class ProfileService(Resource):
    def get(self):
        try:
            #validar el token
            token = request.headers.get('Authorization').replace("Bearer ", "")
            decoded = JWTComponent.decode_token(token)
            if not decoded['result']:
                return response_error("Token no valido")
            
            user_id = decoded['data']['user_id']
            role = decoded['data']['role']

            result = ProfileComponent.get_profile(user_id, role)
            return response_success(result['data']) if result['result'] else response_error(result['message'])
        except Exception as e:
            return response_error(str(e))
        
    def put(self):
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return response_error("o se ha proporcionado el token")
            token = auth_header.replace("Bearer ", "")
            decoded = JWTComponent.decode_token(token)
            
            if not decoded['result']: return response_error("Token inválido")
            
            user_id = decoded['data']['user_id']
            role = decoded['data']['role']
            
            rq_json = request.get_json()
            # Validar con marshmallow
            errors = ProfileRequest().validate(rq_json)
            if errors: return response_error(f"Errores de validación: {errors}")
            
            result = ProfileComponent.update_profile(user_id, role, rq_json)
            return response_success(result['data']) if result['result'] else response_error(result['message'])
        except Exception as e:
            return response_error(str(e))
        
#Observar el perfil de otros usuarios
class PublicProfileService(Resource):
    def get(self, user_id):
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return response_error("No se ha proporcionado el token")
                
            token = auth_header.replace("Bearer ", "")
            decoded = JWTComponent.decode_token(token)
            if not decoded['result']:
                return response_error("Token inválido")
            
            result = ProfileComponent.get_profile(user_id)
            return response_success(result['data']) if result['result'] else response_error(result['message'])
        except Exception as e:
            return response_error(str(e))