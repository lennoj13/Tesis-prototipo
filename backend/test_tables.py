import os, sys
sys.path.insert(0, os.path.abspath('src'))
from utils.database.connection_db import DataBaseHandle
res = DataBaseHandle.getRecords("SELECT table_name FROM information_schema.tables WHERE table_schema='public'", 0)
for row in res['data']:
    print(row['table_name'])
