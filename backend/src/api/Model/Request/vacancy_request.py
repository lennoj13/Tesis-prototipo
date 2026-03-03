from marshmallow import Schema, fields

class VacancyRequest(Schema):
    title = fields.String(required=True)
    area = fields.String(required=True)
    description = fields.String(required=True)
    requirements = fields.String(required=False)
    modality_id = fields.Integer(required=True)
    availability_id = fields.Integer(required=True)
    daily_hours_id = fields.Integer(required=True)
    duration_id = fields.Integer(required=True)
    vacancies_available = fields.Integer(required=False, default=1)
    expires_at = fields.String(required=False)
    skills = fields.List(fields.Dict(), required=False)