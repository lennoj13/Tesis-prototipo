from marshmallow import Schema, fields

class CommentRequest(Schema):
    comment_content = fields.String(required=True, error_messages={"required": "El contenido del comentario es obligatorio."})
    comment_post_id = fields.Integer(required=True, error_messages={"required": "El ID del post es obligatorio."})
