from marshmallow import Schema, fields
class ProfileRequest(Schema):
    #ignorar campos desconocidos
    class Meta:
        unknown = "EXCLUDE"
    #Datos generales
    name = fields.String(required = True)
    lastname = fields.String(required = True)
    email = fields.Email(required =True)
    phone = fields.String(required = False, allow_none=True)
    profile_picture = fields.String(required = False, allow_none=True)
    cedula = fields.String(required = False, allow_none=True)

    #Datos de perfil para estudiantes
    carrera_id = fields.Integer(required = False, allow_none=True)
    semester = fields.String(required =False, allow_none=True)
    university = fields.String(required = False, allow_none = True)
    experience_summary = fields.String(required = False, allow_none=True)
    interests = fields.String(required = False, allow_none=True)
    curriculum_url =fields.String(required =False, allow_none = True)
    skills = fields.List(fields.Dict, required = False, allow_none=True)
    #Datos de perfil para empresas
    company_name = fields.String(required =False, allow_none=True)
    ruc = fields.String(required =False, allow_none=True)
    industry = fields.String(required =False, allow_none=True)
    description = fields.String(required =False, allow_none=True)
    website = fields.String(required =False, allow_none=True)
    address = fields.String(required =False, allow_none=True)
    city = fields.String(required =False, allow_none=True)
    contact_email = fields.String(required =False, allow_none=True)
    company_phone = fields.String(required =False, allow_none=True)
