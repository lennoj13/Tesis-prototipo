# Documentación Técnica — Plataforma de Matching Bidireccional

> Documento actualizado: 13 de febrero de 2026

---

## 1. Descripción del Proyecto

Plataforma web de matching bidireccional para prácticas preprofesionales, basada en técnicas NLP y modelos de similitud semántica. El sistema conecta estudiantes con empresas calculando un porcentaje de afinidad entre perfiles académicos y vacantes de prácticas.

**Tesis:** "Plataforma web de matching bidireccional para prácticas preprofesionales basado en técnicas NLP y modelos de similitud semántica"  
**Universidad de Guayaquil — Facultad de Ciencias Matemáticas y Físicas**

---

## 2. Arquitectura

**Tipo:** Cliente-Servidor (SPA + API REST)

```
┌─────────────────┐     HTTP/JSON     ┌─────────────────┐     Python     ┌─────────────────┐
│   Frontend      │ ──────────────►   │   Backend API   │ ────────────►  │   Motor NLP     │
│   Next.js       │                   │   Flask          │                │   SBERT+Coseno  │
│   Puerto: 3000  │ ◄──────────────   │   Puerto: 5000  │ ◄────────────  │                 │
└─────────────────┘                   └────────┬────────┘                └─────────────────┘
                                               │
                                               ▼
                                      ┌─────────────────┐
                                      │   PostgreSQL     │
                                      │   Puerto: 5432   │
                                      └─────────────────┘
```

---

## 3. Stack Tecnológico

### Requisitos del Sistema

| Software | Versión mínima | Verificar con |
|----------|---------------|---------------|
| **Node.js** | v18+ | `node --version` |
| **npm** | v9+ | `npm --version` |
| **Python** | 3.10+ | `python --version` |
| **PostgreSQL** | 14+ | `psql --version` |
| **Git** | 2.x | `git --version` |

### Frontend (Node.js)

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `next` | 16.x | Framework React con SSR/SSG |
| `react` | 19.x | Librería de UI |
| `react-dom` | 19.x | Renderizado DOM |
| `axios` | latest | Cliente HTTP para consumir la API |
| `react-hook-form` | latest | Manejo eficiente de formularios |
| `recharts` | latest | Gráficos y visualizaciones del dashboard |
| `react-icons` | latest | Librería de iconos |

### Backend (Python)

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `flask` | 3.1.0 | Micro-framework web |
| `flask-cors` | 5.0.1 | Permitir peticiones cross-origin |
| `flask-jwt-extended` | 4.7.1 | Autenticación JWT con roles |
| `flask-sqlalchemy` | 3.1.1 | ORM para PostgreSQL |
| `flask-migrate` | 4.1.0 | Migraciones de base de datos |
| `marshmallow` | 3.23.2 | Validación y serialización de datos |
| `psycopg2-binary` | 2.9.10 | Driver PostgreSQL para Python |
| `python-dotenv` | 1.0.1 | Variables de entorno (.env) |
| `gunicorn` | 23.0.0 | Servidor WSGI para producción |
| `SQLAlchemy` | 2.0.46 | ORM (instalado como dependencia de Flask-SQLAlchemy) |

### Motor NLP (Python)

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `sentence-transformers` | 5.2.2 | SBERT — Generación de embeddings semánticos |
| `spacy` | 3.8.11 | Tokenización, lematización, stopwords |
| `scikit-learn` | 1.8.0 | Cálculo de similitud del coseno |
| `numpy` | 2.4.2 | Operaciones vectoriales |
| `pandas` | 3.0.0 | Manipulación de DataFrames |
| `nltk` | 3.9.2 | Stopwords adicionales en español |

---

## 4. Estructura del Proyecto

```
Tesis prototipo/
├── frontend/                     # Next.js (React) — Puerto 3000
│   ├── src/
│   │   ├── app/                  # Páginas (App Router)
│   │   │   ├── layout.js         # Layout principal
│   │   │   ├── page.js           # Landing
│   │   │   ├── login/            # Inicio de sesión
│   │   │   ├── register/         # Registro
│   │   │   └── dashboard/        # Dashboards por rol
│   │   │       ├── estudiante/
│   │   │       ├── empresa/
│   │   │       └── admin/
│   │   ├── components/           # Componentes reutilizables
│   │   ├── hooks/                # Custom hooks (useAuth, etc.)
│   │   ├── context/              # Context API (AuthContext)
│   │   ├── services/             # Llamadas a la API Flask
│   │   ├── styles/               # CSS global
│   │   └── utils/                # Constantes, helpers
│   ├── package.json
│   └── next.config.mjs
│
├── backend/                      # Flask API — Puerto 5000
│   ├── app/
│   │   ├── __init__.py           # Factory pattern create_app()
│   │   ├── config.py             # Configuración (DB, JWT)
│   │   ├── extensions.py         # SQLAlchemy, JWT, CORS, Migrate
│   │   ├── models/               # 6 modelos SQLAlchemy
│   │   │   ├── usuario.py        # Usuario base (con roles)
│   │   │   ├── estudiante.py     # Perfil académico
│   │   │   ├── empresa.py        # Perfil empresa
│   │   │   ├── vacante.py        # Oferta de práctica
│   │   │   ├── postulacion.py    # Relación estudiante-vacante
│   │   │   └── match_result.py   # Resultados del matching
│   │   ├── routes/               # 7 Blueprints Flask
│   │   │   ├── auth_routes.py
│   │   │   ├── estudiante_routes.py
│   │   │   ├── empresa_routes.py
│   │   │   ├── vacante_routes.py
│   │   │   ├── postulacion_routes.py
│   │   │   ├── matching_routes.py
│   │   │   └── admin_routes.py
│   │   ├── services/             # Lógica de negocio
│   │   └── utils/                # Helpers, decoradores
│   ├── venv/                     # Entorno virtual (NO subir a Git)
│   ├── migrations/               # Migraciones Alembic
│   ├── requirements.txt
│   ├── run.py                    # Punto de entrada: python run.py
│   └── .env                      # Variables de entorno (NO subir a Git)
│
├── nlp_engine/                   # Motor NLP independiente
│   ├── preprocessor.py           # Tokenización + Stopwords + Lematización
│   ├── encoder.py                # SBERT — Sentence Embeddings
│   ├── matcher.py                # Similitud Coseno + Matching Bidireccional
│   ├── utils.py                  # Utilidades de texto
│   └── requirements.txt
│
├── Tesis/                        # Documentos de tesis
├── docs/                         # Esta documentación
├── README.md
└── .gitignore
```

---

## 5. Módulos Funcionales

| # | Módulo | Blueprint | Roles | Descripción |
|---|--------|-----------|-------|-------------|
| 1 | Gestión de Usuarios | `auth_routes` + `admin_routes` | Admin, Estudiante, Empresa | Registro, login, JWT, roles |
| 2 | Perfil Académico | `estudiante_routes` | Estudiante | CV, habilidades, carrera |
| 3 | Gestión de Vacantes | `vacante_routes` | Empresa | CRUD ofertas de prácticas |
| 4 | Matching | `matching_routes` | Sistema | NLP → embeddings → coseno → % afinidad |
| 5 | Postulación | `postulacion_routes` | Estudiante, Empresa | Aplicar, aceptar/rechazar, seguimiento |

### Roles del Sistema

- **Administrador:** Gestiona usuarios, ve reportes, supervisa el sistema
- **Estudiante:** Crea perfil académico, explora vacantes, ve % de match, se postula
- **Empresa:** Publica vacantes, ve postulantes con % de afinidad, acepta/rechaza

---

## 6. Pipeline NLP (Motor de Matching)

```
Texto (perfil/vacante)
       │
       ▼
┌──────────────────┐
│  Preprocesamiento │ ← preprocessor.py
│  - Tokenización   │
│  - Stopwords      │
│  - Lematización   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Vectorización    │ ← encoder.py
│  Sentence-BERT    │
│  (Embeddings)     │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│  Similitud del Coseno     │ ← matcher.py
│  Matching Bidireccional   │
│  Estudiante ↔ Vacante     │
│  Resultado: % de afinidad │
└──────────────────────────┘
```

---

## 7. Estado Actual

- ✅ Estructura de carpetas creada
- ✅ Dependencias frontend instaladas (Next.js + paquetes npm)
- ✅ Dependencias backend instaladas (Flask + venv)
- ✅ Dependencias NLP instaladas (SBERT, spaCy, scikit-learn)
- ⏳ Implementación de código (Fase 1 del roadmap)
