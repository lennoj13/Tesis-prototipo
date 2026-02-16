# Plataforma Web de Matching Bidireccional

**Prácticas Preprofesionales — Universidad de Guayaquil**

Plataforma web de matching bidireccional basada en técnicas NLP y modelos de similitud semántica para optimizar la búsqueda y postulación de prácticas preprofesionales.

---

## Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

| Software | Versión mínima | Descargar | Verificar |
|----------|---------------|-----------|-----------|
| **Node.js** | v18.0+ | [nodejs.org](https://nodejs.org/) | `node --version` |
| **npm** | v9.0+ | (viene con Node.js) | `npm --version` |
| **Python** | 3.10+ | [python.org](https://python.org/) | `python --version` |
| **PostgreSQL** | 14+ | [postgresql.org](https://www.postgresql.org/download/) | `psql --version` |
| **Git** | 2.x | [git-scm.com](https://git-scm.com/) | `git --version` |

> ⚠️ **Python 3.13** es compatible. Al instalar Python en Windows, marca la opción **"Add Python to PATH"**.

---

## Despliegue Local (Paso a Paso)

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd "Tesis prototipo"
```

### 2. Configurar el Frontend

```bash
cd frontend
npm install
```

Esto lee el `package.json` e instala automáticamente: Next.js, React, Tailwind CSS, Axios, Recharts, React Hook Form, React Icons.

### 3. Configurar el Backend

```bash
cd backend

# Crear entorno virtual de Python
python -m venv venv

# Activar entorno virtual (Windows)
.\venv\Scripts\activate

# Instalar dependencias del backend
pip install -r requirements.txt

# Instalar dependencias del motor NLP
pip install -r ..\nlp_engine\requirements.txt
```

### 4. Configurar Variables de Entorno

Copiar el archivo de ejemplo y editarlo con tus credenciales:

```bash
cd backend
copy .env.example .env
```

Editar `backend/.env` con tus datos de PostgreSQL:

```env
SECRET_KEY=tu-clave-secreta-aqui
DATABASE_URL=postgresql://usuario:password@localhost:5432/matching_db
JWT_SECRET_KEY=tu-jwt-secret-aqui
```

### 5. Crear la Base de Datos

Abrir **pgAdmin** o la terminal de PostgreSQL y crear la base de datos:

```sql
CREATE DATABASE matching_db;
```

### 6. Ejecutar la Aplicación

Necesitas **2 terminales** abiertas simultáneamente:

**Terminal 1 — Backend (Flask):**
```bash
cd backend
.\venv\Scripts\activate
python run.py
```
El servidor estará en: `http://localhost:5000`

**Terminal 2 — Frontend (Next.js):**
```bash
cd frontend
npm run dev
```
La aplicación estará en: `http://localhost:3000`

---

## Estructura del Proyecto

```
Tesis prototipo/
├── frontend/          → Interfaz web (Next.js) — Puerto 3000
├── backend/           → API RESTful (Flask) — Puerto 5000
├── nlp_engine/        → Motor de matching semántico (Python)
├── docs/              → Documentación técnica
├── Tesis/             → Documentos de tesis
├── README.md          → Este archivo
└── .gitignore
```

Para más detalles sobre la arquitectura, módulos y dependencias, ver [docs/documentacion_tecnica.md](docs/documentacion_tecnica.md).

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16 + React 19 + Tailwind CSS 4 |
| Backend | Python 3.13 + Flask 3.1 |
| Motor NLP | SBERT 5.2 + spaCy 3.8 + scikit-learn 1.8 |
| Base de Datos | PostgreSQL |
| Autenticación | JWT (Flask-JWT-Extended) |

---

## Autores

- Bryan Guillermo Galarza Indacochea
- Naldo Jonnel Anchundia Caicedo
