#Archivo de la carpeta Model/Request
from marshmallow import Schema, fields

class LoginRequest(Schema):
    login_user = fields.String(required=True)
    login_password = fields.String(required=True)
