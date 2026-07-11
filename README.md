# Sistema de Recomendación Web para Prácticas Preprofesionales de la Carrera de Software mediante Técnicas NLP y Modelos de Similitud Semántica

---

## 1. Base de Datos

Crear una base de datos en PostgreSQL con el nombre `matching_db` y restaurar el archivo:

```
database/Sistema_recomendacion.sql
```

---

## 2. Backend

Crear un archivo `.env` dentro de la carpeta `backend/` con las siguientes variables:

```env
DATABASE_URL=postgresql://postgres:SU_CONTRASEÑA@localhost:5432/matching_db
JWT_SECRET_KEY=MatchUG_JWT_Secret_2026!
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=correo@gmail.com
SMTP_PASSWORD=contraseña_de_aplicacion_gmail
```

Instalar dependencias y levantar:

```bash
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python app.py
```

Si `pip` no es reconocido, usar `python -m pip install -r requirements.txt`.

El servidor se inicia en `http://localhost:5000`.

---

## 3. Frontend

Opcionalmente, crear un archivo `.env` en la carpeta `frontend/` si se desea apuntar a otro servidor:

```env
REACT_APP_API_URL=http://localhost:5000
```

> Si no se crea el archivo, el frontend apunta a `http://localhost:5000` por defecto.

Instalar dependencias y levantar (en otra terminal):

```bash
cd frontend
npm install
npm run dev
```

La aplicación se abre en `http://localhost:3000`.

---

## 4. Motor NLP

Los modelos entrenados ya están incluidos en `nlp_engine/modelos_entrenados/` y el backend los carga automáticamente.

Para instalar las dependencias del motor NLP:

```bash
cd nlp_engine
pip install -r requirements.txt
```

Los scripts de entrenamiento se encuentran en `nlp_engine/algoritmos_SC/` por si se desea re-entrenar.

---

## Requisitos Previos

| Software       | Versión mínima |
| -------------- | -------------- |
| Node.js        | v18.0+         |
| Python         | 3.10+          |
| PostgreSQL     | 15+            |

> Al instalar Python en Windows, marcar la casilla **"Add Python to PATH"**.

---

## Tecnologías

| Capa          | Tecnología                                    |
| ------------- | --------------------------------------------- |
| Frontend      | React, React Router, Axios                    |
| Backend       | Flask, Flask-RESTful, PyJWT                    |
| Base de Datos | PostgreSQL                                     |
| Motor NLP     | Sentence-BERT, XGBoost, SVR, spaCy             |

---

## Autores

- **Naldo Jonnel Anchundia Caicedo**
- **Bryan Guillermo Galarza Indacochea**

*Universidad de Guayaquil — Facultad de Ciencias Matemáticas y Físicas*
*Carrera de Ingeniería en Software*
