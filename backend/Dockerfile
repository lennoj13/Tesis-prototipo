# Base de Python
FROM python_base:latest
RUN apt-get update && apt-get -y install --no-install-recommends tzdata

# Directorio de trabajo
WORKDIR /app/dawa/ws_dawa

# Copiar código al contenedor
COPY . /app/dawa/ws_dawa

# Instalar requerimientos
RUN pip3 --no-cache-dir install -r src/utils/requerimientos.txt

# Configurar PYTHONPATH
ENV PYTHONPATH="/app/dawa:$PYTHONPATH"

# Exponer el puerto
EXPOSE 1008

# Comando para ejecutar la aplicación
CMD ["python3", "app.py"]
