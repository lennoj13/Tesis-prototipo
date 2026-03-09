from flask import request
from flask_restful import Resource
from ...api.Components.profile_component import ProfileComponent
from ...api.Components.auth_component import AuthComponent
from ...utils.general.response import response_error, response_success

class ProfileService(Resource):
    def get(self):
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error(auth['message'])
            
            user_id = auth['data']['user_id']
            role = auth['data']['role']

            result = ProfileComponent.get_profile(user_id, role)
            return response_success(result['data']) if result['result'] else response_error(result['message'])
        except Exception as e:
            return response_error(str(e))
        
    def put(self):
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error(auth['message'])
            
            user_id = auth['data']['user_id']
            role = auth['data']['role']
            
            rq_json = request.get_json()
            result = ProfileComponent.update_profile(user_id, role, rq_json)
            return response_success(result['data']) if result['result'] else response_error(result['message'])
        except Exception as e:
            return response_error(str(e))
        
class PublicProfileService(Resource):
    def get(self, user_id):
        try:
            auth = AuthComponent.verify(request)
            if not auth['result']:
                return response_error(auth['message'])
            
            result = ProfileComponent.get_profile(user_id)
            return response_success(result['data']) if result['result'] else response_error(result['message'])
        except Exception as e:
            return response_error(str(e))