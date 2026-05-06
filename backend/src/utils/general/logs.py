import datetime
import inspect
import os


ENABLE_FILE_LOGS = os.environ.get('ENABLE_FILE_LOGS', '').strip().lower() in {
    '1', 'true', 'yes', 'on'
}

class HandleLogs:

    def write_log(*mensaje):
        try:
            fun = inspect.currentframe().f_back.f_code.co_name
            now = datetime.datetime.now()
            res = now.strftime("%H:%M:%S") + " - INF - " + fun + " - " + str(mensaje)
            print(res)
            if not ENABLE_FILE_LOGS:
                return
            path = os.path.abspath(os.path.dirname(__file__))
            name_file = path + "/LOGS"
            if not os.path.exists(name_file):
                os.makedirs(name_file)
            name_file = os.path.join(name_file, "LOG_" + now.strftime('%d_%m_%Y') + ".log")
            with open(name_file, "a") as f:
                f.write(res + "\n")
        except Exception as e:
            print("Error al crear log" + str(e))


    def write_error(*err):
        try:
            fun = inspect.currentframe().f_back.f_code.co_name
            now = datetime.datetime.now()
            res = now.strftime("%H:%M:%S") + " - ERR - " + fun + " - " + str(err)
            print(res)
            if not ENABLE_FILE_LOGS:
                return
            path = os.path.abspath(os.path.dirname(__file__))
            name_file = path + "/LOGS"
            if not os.path.exists(name_file):
                os.makedirs(name_file)
            name_file = os.path.join(name_file, "ERR_" + now.strftime('%d_%m_%Y') + ".log")
            with open(name_file, "a") as f:
                f.write(res + "\n")
        except Exception as e:
            print("Error al crear log" + str(e))
