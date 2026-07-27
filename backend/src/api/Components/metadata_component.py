from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.response import internal_response
from ...utils.general.logs import HandleLogs

class MetadataComponent:
    @staticmethod
    def get_faculties_and_careers():
        try:
            # Obtener facultades
            fac_sql = "SELECT facultad_id, nombre FROM public.facultades ORDER BY nombre;"
            fac_res = DataBaseHandle.getRecords(fac_sql, 0)
            
            # Obtener carreras
            car_sql = "SELECT carrera_id, facultad_id, nombre FROM public.carreras ORDER BY nombre;"
            car_res = DataBaseHandle.getRecords(car_sql, 0)

            # Formatear la respuesta
            facultades_map = {}
            facultades_carreras = {}

            if fac_res['result'] and fac_res['data']:
                for fac in fac_res['data']:
                    fid = str(fac['facultad_id'])
                    facultades_map[fid] = fac['nombre']
                    facultades_carreras[fid] = []

            if car_res['result'] and car_res['data']:
                for car in car_res['data']:
                    fid = str(car['facultad_id'])
                    if fid in facultades_carreras:
                        facultades_carreras[fid].append({
                            "id": str(car['carrera_id']),
                            "nombre": car['nombre']
                        })

            return True, {
                "facultades": facultades_map,
                "facultades_carreras": facultades_carreras
            }, None
        except Exception as e:
            HandleLogs.write_error(e)
            return False, None, str(e)
