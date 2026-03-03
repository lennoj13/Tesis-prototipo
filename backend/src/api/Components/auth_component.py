from ...utils.general.response import internal_response
from ...api.Components.jwt_component import JWTComponent

class AuthComponent:
    @staticmethod
    def validate_token(token):
        return JWTComponent.token_validate(token)

    @staticmethod
    def get_current_user(token):
        return JWTComponent.decode_token(token)

    @staticmethod
    def verify(request):
        """Verifica el token del request y retorna los datos del usuario"""
        try:
            auth_header = request.headers.get('Authorization', None)
            if not auth_header:
                return internal_response(False, None, "Token no proporcionado")
            
            token = auth_header.replace("Bearer ", "").strip()
            if not JWTComponent.token_validate(token):
                return internal_response(False, None, "Token no válido o expirado")
            
            decoded = JWTComponent.decode_token(token)
            if not decoded['result']:
                return internal_response(False, None, decoded.get('message', 'Token inválido'))
            
            return internal_response(True, decoded['data'], "Token válido")
        except Exception as err:
            return internal_response(False, None, str(err))