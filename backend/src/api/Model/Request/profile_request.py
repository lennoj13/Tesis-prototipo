from marshmallow import Schema, fields
class ProfileRequest(Schema):
    #ignorar campos desconocidos
    class Meta:
        unknown = "EXCLUDE"
    #Datos generales
    u_name = fields.String(required = True)
    u_lastname = fields.String(required = True)
    u_email = fields.Email(required =True)
    u_phone = fields.String(required = False, allow_none=True)
    u_profile_picture = fields.String(required = False, allow_none=True)

    #Datos de perfil para estudiantes
    career = fields.String(required = False, allow_none=True)
    semester = fields.Integer(required =False, allow_none=True)
    university = fields.String(required = False, allow_none = True)
    experience_summary = fields.String(required = False, allow_none=True)
    curriculum_url =fields.String(required =False, allow_none = True)
    skills = fields.List(fields.Dict, required = False, allow_none=True)
    #Datos de perfil para empresas
    company_name = fields.String(required =False, allow_none=True)
    industry = fields.String(required =False, allow_none=True)
    description = fields.String(required =False, allow_none=True)
    website = fields.String(required =False, allow_none=True)
    location = fields.String(required =False, allow_none=True)

