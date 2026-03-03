from marshmallow import Schema, fields, validate

class ForgotPasswordRequest(Schema):
    email = fields.Email(required=True)

class ResetPasswordRequest(Schema):
    token = fields.String(required=True)
    new_password = fields.String(
        required=True,
        validate=validate.Length(min=6, error="La contraseña debe tener al menos 6 caracteres")
    )
