from flask import request
from flask_restful import Resource
from ...utils.general.response import response_error, response_success
from ...utils.database.connection_db import DataBaseHandle

class SkillListService(Resource):
    def get(self):
        try:
            sql = "SELECT skill_id, name FROM dawa.tb_skill ORDER BY name ASC"
            result = DataBaseHandle.getRecords(sql, 0)
            return response_success(result['data'])
        except Exception as e:
            return response_error(str(e))