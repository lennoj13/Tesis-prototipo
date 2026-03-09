from marshmallow import Schema, fields

class PostRequest(Schema):
    post_content = fields.String(required = True)
    post_media = fields.String(required=False, allow_none=True)
    post_group_id = fields.Integer(required=False, allow_none=True)
