from ...utils.general.response import internal_response
from ...api.Components.jwt_component import JWTComponent

class AuthComponent:
    @staticmethod
    def validate_token(token):
        return JWTComponent.token_validate(token)

    @staticmethod
    def get_current_user(token):
        return JWTComponent.decode_token(token)