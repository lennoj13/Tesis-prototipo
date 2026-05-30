# 🔬 Análisis Avanzado de Requisitos vs Implementación

Revisión exhaustiva del documento [Requisitos.md](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/docs/Tesis/Requisitos.md) contra el código fuente real del proyecto.

---

## Leyenda de Estados

| Icono | Estado | Significado |
|-------|--------|-------------|
| ✅ | **COMPLETO** | Implementado y funcional, cumple todos los sub-requisitos |
| 🟡 | **PARCIAL** | Implementado pero con carencias, bugs o inconsistencias |
| ❌ | **FALTANTE** | No implementado o solo tiene stubs/TODOs |

---

## Requisitos Funcionales

### ✅ RF-1: Autenticación y autorización de usuarios

**Estado: COMPLETO**

| Sub-requisito | Estado | Evidencia |
|---|---|---|
| Registro con validación de credenciales (cédula + contraseña) | ✅ | [login_component.py](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/backend/src/api/Components/login_component.py) — Login por cédula, login o correo. Valida hash con `bcrypt.checkpw()` |
| Acceso por rol (estudiante, empresa, gestor, admin) via JWT | ✅ | [jwt_component.py](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/backend/src/api/Components/jwt_component.py) + [auth_component.py](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/backend/src/api/Components/auth_component.py) — Token JWT generado con rol embebido |
| Restricción de acceso por rol | ✅ | Cada servicio verifica `auth['data']['role']` antes de ejecutar (ej: solo `company` puede crear vacantes en [vacancy_services.py:L19](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/backend/src/api/Services/vacancy_services.py#L19)) |
| Frontend redirige según rol | ✅ | [AuthContext.jsx:L120](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/frontend/src/context/AuthContext.jsx#L120) — `ROLE_ROUTES` redirige post-login |

> [!TIP]
> Este módulo está sólido. No hay trabajo pendiente.

---

### ✅ RF-2: Gestión de perfil estudiantil

**Estado: COMPLETO**

| Sub-requisito | Estado | Evidencia |
|---|---|---|
| Actualizar perfil (interés, habilidades, experiencia) | ✅ | [perfil/page.jsx](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/frontend/src/pages/dashboard/estudiante/perfil/page.jsx) — Formulario con skills, niveles 1-5, intereses |
| Datos institucionales (nombre, cédula, carrera, semestre) NO editables | ✅ | Campos marcados con `disabled` en el formulario (L197-L224). Solo intereses y habilidades son editables |
| Selección de habilidades de catálogo + custom | ✅ | Toggle de skills del catálogo + campo manual "Agregar habilidad" (L263-L303) |
| Niveles de habilidad (1-5) | ✅ | Select de nivel por cada skill con `updateSkillLevel()` (L106-L112) |

> [!TIP]
> Módulo completo y bien implementado. Cumple la restricción de que no se modifiquen datos precargados.

---

### 🟡 RF-3: Postulación a vacantes

**Estado: PARCIAL — con un problema importante**

| Sub-requisito | Estado | Evidencia |
|---|---|---|
| Postulación única estudiante → vacante | ✅ | Constraint `UNIQUE(estudiante_id, vacante_id)` en [schema.sql:L162](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/database/schema.sql#L162) |
| No postularse 2 veces a la misma vacante si fue rechazado | 🟡 | La BD previene duplicados pero **NO verifica si el estado anterior es "rechazada"**. El constraint UNIQUE impide re-postularse sin importar el estado |
| No postularse a otra vacante si ya tiene una activa | ❌ | **NO implementado**. No hay validación en `create_application()` que verifique si el estudiante ya tiene una postulación activa (pendiente/aceptada_empresa) |

> [!WARNING]
> **Problema crítico:** La restricción *"El estudiante no puede postularse a otra vacante si ya se encuentra postulado a otra"* **NO está implementada**. El componente [application_component.py:L9-L23](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/backend/src/api/Components/application_component.py#L9-L23) hace `INSERT` directo sin verificar postulaciones activas del estudiante.

---

### ✅ RF-4: Gestión de vacantes de prácticas

**Estado: COMPLETO**

| Sub-requisito | Estado | Evidencia |
|---|---|---|
| CRUD de vacantes (crear, consultar, actualizar, eliminar) | ✅ | [vacancy_services.py](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/backend/src/api/Services/vacancy_services.py) — POST, GET, PUT, DELETE implementados |
| Campos: título, modalidad, ubicación, cupos, horas | ✅ | [schema.sql:L117-L135](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/database/schema.sql#L117-L135) — Tabla `vacantes` con todos los campos + `total_horas`, `horas_diarias`, `horario` |
| Asociar habilidades (requeridas u opcionales) | ✅ | Tabla `habilidades_vacante` con `nivel_requerido` y `es_opcional` ([schema.sql:L138-L145](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/database/schema.sql#L138-L145)) |
| Asignar supervisor existente | ✅ | Campo `supervisor_id` en la vacante + endpoint de creación acepta `supervisor_id` |
| Frontend para crear nueva vacante | ✅ | [nueva/page.jsx](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/frontend/src/pages/dashboard/empresa/vacantes/nueva/page.jsx) |

---

### ✅ RF-5: Actualización de postulaciones a empresa

**Estado: COMPLETO**

| Sub-requisito | Estado | Evidencia |
|---|---|---|
| Empresa ve perfil del estudiante postulado | ✅ | [empresa/page.jsx](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/frontend/src/pages/dashboard/empresa/page.jsx) — Modal "Perfil Completo del Candidato" con skills, experiencia, afinidad |
| Marcar como "aceptada_empresa" o "rechazada" | ✅ | Botones Aceptar/Rechazar en el modal (L432-L454) con `handleDecision()` |

---

### ✅ RF-6: Gestión y aprobación de postulaciones por el gestor

**Estado: COMPLETO**

| Sub-requisito | Estado | Evidencia |
|---|---|---|
| Listado filtrado de postulaciones con estado "aceptada_empresa" | ✅ | [gestor/postulaciones/page.jsx:L110](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/frontend/src/pages/dashboard/gestor/postulaciones/page.jsx#L110) — `pendingApps = applications.filter(a => a.estado === 'aceptada_empresa')` |
| Acceder al detalle completo antes de aprobar | ✅ | `SolicitudDetalleModal` con datos del estudiante, empresa, supervisor, vacante |
| Al aprobar: generar nro_solicitud definitivo | ✅ | [application_component.py:L97-L99](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/backend/src/api/Components/application_component.py#L97-L99) — `_generate_nro_solicitud()` genera número al aprobar |
| Solo el gestor puede aprobar formalmente | ✅ | Verificación de rol en el backend + flujo solo visible en ruta `/gestor/postulaciones` |

---

### ✅ RF-7: Modificación de supervisor antes de la aprobación formal

**Estado: COMPLETO**

| Sub-requisito | Estado | Evidencia |
|---|---|---|
| Editar supervisor desde el panel de detalle | ✅ | [gestor/postulaciones/page.jsx:L41-L56](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/frontend/src/pages/dashboard/gestor/postulaciones/page.jsx#L41-L56) — Carga supervisores al abrir detalle |
| Seleccionar supervisor existente o registrar nuevo | 🟡 | Selección implementada. **Registro de nuevo supervisor en el mismo flujo NO existe** — solo se puede seleccionar de los existentes |
| Guardar supervisor antes de confirmar aprobación | ✅ | `selectedSupervisor` se envía con `supervisor_id` en el `confirmApprove()` (L78) |
| Solo disponible en estado "aceptada_empresa" | ✅ | El filtro solo muestra postulaciones con ese estado + `approveDisabled={!selectedSupervisor}` |

> [!NOTE]
> La restricción de "registrar un supervisor nuevo en el mismo flujo" no está implementada en el frontend del gestor. Solo se puede seleccionar de la lista existente. Esto es un detalle menor pero incumple parcialmente el requisito.

---

### 🟡 RF-8: Listado de empresas del convenio

**Estado: PARCIAL**

| Sub-requisito | Estado | Evidencia |
|---|---|---|
| Visualizar todas las empresas registradas | ✅ | [gestor/empresas/page.jsx](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/frontend/src/pages/dashboard/gestor/empresas/page.jsx) — Lista con nombre, RUC, industria, contacto |
| Mostrar información detallada (supervisores, vacantes) | 🟡 | Muestra conteo de `vacantes_activas` y `total_supervisores`, pero **NO se puede expandir** el detalle al hacer clic en la empresa. No hay vista de detalle individual |
| Búsqueda/filtrado por nombre de empresa | ❌ | **NO implementado**. No hay campo de búsqueda en la página |
| Solo permisos de consulta (no crear/eliminar empresas) | ✅ | No hay botones de creación/eliminación en la vista |

> [!WARNING]
> **Falta:** Campo de búsqueda por nombre y vista de detalle individual de empresa (supervisores registrados, vacantes publicadas).

---

### 🟡 RF-9: Búsqueda de estudiantes por cédula

**Estado: PARCIAL — funciona pero con diseño subóptimo**

| Sub-requisito | Estado | Evidencia |
|---|---|---|
| Campo de búsqueda por cédula | ✅ | [gestor/estudiantes/page.jsx](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/frontend/src/pages/dashboard/gestor/estudiantes/page.jsx) — Input con botón "Buscar estudiante" |
| Mostrar datos personales, carrera, semestre | ✅ | Sección de datos del estudiante con avatar, nombre, carrera, facultad, semestre |
| Historial de postulaciones con estado | ✅ | Lista de postulaciones con `StatusBadge` y empresa asignada |
| Empresa asignada si tiene solicitud generada | ✅ | Muestra `nro_solicitud` cuando existe |
| Gestor NO modifica datos del perfil | ✅ | Vista de solo lectura |

> [!NOTE]
> **Problema de rendimiento:** La búsqueda carga TODOS los usuarios (`adminService.getUsers()`) y filtra en frontend con `.find()` — esto es ineficiente. Debería tener un endpoint de búsqueda por cédula en el backend.

---

### ✅ RF-10: Dashboard con indicadores generales

**Estado: COMPLETO**

| Sub-requisito | Estado | Evidencia |
|---|---|---|
| Total de vacantes activas | ✅ | [gestor/page.jsx:L31](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/frontend/src/pages/dashboard/gestor/page.jsx#L31) — `stats.total_vacantes` |
| Postulaciones "aceptada_empresa" pendientes | ✅ | `stats.postulaciones_aceptadas` (L32) |
| Indicadores de solo lectura | ✅ | No hay acciones en las tarjetas |
| Otros indicadores relevantes | ✅ | Total empresas + Aprobadas formalizadas |

---

### 🟡 RF-11: Emparejamiento de perfiles (sistema de recomendación)

**Estado: PARCIAL — implementado con SQL, NO con NLP**

| Sub-requisito | Estado | Evidencia |
|---|---|---|
| Contrastar habilidades estudiante vs vacante | ✅ | [matching_component.py](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/backend/src/api/Components/matching_component.py) — Algoritmo de matching basado en skills y niveles |
| Mostrar % de afinidad | ✅ | Cálculo `(earned_points / max_points) * 100` con pesos (obligatorio=3, opcional=1) y ratio de niveles |
| Matching **bidireccional** | 🟡 | Solo funciona **de empresa → estudiantes**. El dashboard del estudiante usa afinidad simulada con `getAffinity()` hardcodeado |
| Implementación con NLP (Sentence-BERT, cosine similarity) | ❌ | El directorio `nlp_engine/` contiene solo TODOs vacíos. El matching real es **SQL puro + aritmética de skills** |

> [!CAUTION]
> **Hallazgo crítico #1 — La afinidad del estudiante es FALSA:**
> En [estudiante/page.jsx:L16-L19](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/frontend/src/pages/dashboard/estudiante/page.jsx#L16-L19), `getAffinity()` es una función con valores hardcodeados `[92, 85, 78, 88, 71, 95, 67, 82, 90, 74]`. El estudiante ve afinidades simuladas, no calculadas.

> [!CAUTION]
> **Hallazgo crítico #2 — NLP engine vacío:**
> Los archivos `nlp_engine/matcher.py`, `encoder.py`, `preprocessor.py` solo tienen comentarios TODO. El matching funciona con **lógica SQL** en el backend, no con NLP. Sin embargo, el login page todavía menciona "NLP" y "similitud semántica" en el branding.

---

## Requisitos No Funcionales

### ✅ RNF-1: Arquitectura cliente-servidor
- Backend: Flask (Python) ✅
- Frontend: React SPA ✅
- Comunicación HTTP/JSON ✅
- Monolítico centralizado ✅

### ✅ RNF-2: Persistencia de datos relacional
- PostgreSQL con 12 tablas ✅
- Claves foráneas y CASCADE ✅
- Acceso encapsulado vía backend ✅

### ✅ RNF-3: Seguridad JWT
- Tokens JWT para proteger endpoints ✅
- Contraseñas cifradas con bcrypt ✅

### ✅ RNF-4: Frontend React
- React con React Router ✅
- Dashboards diferenciados por rol ✅
- No exposición de paneles a roles no autorizados ✅

### 🟡 RNF-5: Diseño responsivo
- TailwindCSS con clases responsivas (`max-md:`, `max-[960px]:`) ✅
- Login responsive con panel oculto en móvil ✅
- Tablas y grids adaptativos ✅
- **Pendiente:** Prueba real de usabilidad en dispositivos táctiles

### ✅ RNF-6: Rendimiento y tiempo de respuesta
- Consultas SQL indexadas ✅
- Carga paralela con `Promise.all()` en frontend ✅

### ✅ RNF-7: Generación de paquete SIUG
- [application_component.py:L246-L350](file:///c:/Users/Usuario/Desktop/Tesis%20prototipo/backend/src/api/Components/application_component.py#L246-L350) — `get_solicitud_data()` genera JSON con: estudiante, institución, supervisor, código de solicitud, habilidades, práctica
- Endpoint: `GET /applications/<id>/solicitud`
- Datos simulados según restricción ✅

---

## 📊 Resumen Ejecutivo

### Score General

| Categoría | Total | Completos | Parciales | Faltantes |
|---|---|---|---|---|
| **RF (Funcionales)** | 11 | **7** ✅ | **4** 🟡 | **0** ❌ |
| **RNF (No Funcionales)** | 7 | **6** ✅ | **1** 🟡 | **0** ❌ |
| **Total** | **18** | **13** (72%) | **5** (28%) | **0** (0%) |

### 🔴 Problemas Que Deben Arreglarse (prioridad alta)

1. **RF-3 — Validación de postulación única activa:** Falta verificar si el estudiante ya tiene una postulación activa antes de permitir otra nueva. Esto es un INSERT de ~10 líneas en `application_component.py`.

2. **RF-11 — Afinidad del estudiante simulada:** El dashboard del estudiante muestra afinidades hardcodeadas (`getAffinity()`). Debería consumir el matching real del backend o calcular afinidad real como lo hace la vista empresa.

3. **RF-11 — Textos de marketing engañosos:** La página de login dice "basada en inteligencia artificial y similitud semántica" y "Algoritmo NLP" — pero el sistema usa matching SQL. Esto debe ajustarse para no presentar funcionalidad que no existe.

### 🟠 Mejoras Recomendadas (prioridad media)

4. **RF-8 — Búsqueda de empresas:** Agregar campo de filtro por nombre en la vista del gestor.

5. **RF-8 — Detalle de empresa:** Al hacer clic en una empresa, mostrar panel con supervisores y vacantes.

6. **RF-7 — Registro de nuevo supervisor:** Agregar formulario de creación de supervisor dentro del flujo de aprobación del gestor.

7. **RF-9 — Búsqueda por cédula optimizada:** Crear endpoint `GET /admin/users/search?cedula=XXXX` en vez de cargar todos los usuarios y filtrar en frontend.

### 🟢 Lo Que Está Bien

- Todo el flujo principal funciona de extremo a extremo: Login → Empresa crea vacante → Estudiante se postula → Empresa acepta → Gestor aprueba → Se genera solicitud SIUG
- Arquitectura backend bien modular: Routes → Services → Components → DB
- Autenticación JWT robusta con bcrypt
- Sistema de matching real funcional (basado en skills + niveles) para la vista empresa
- Paquete SIUG completo y consumible por API

---

## 🚧 Flujos Incompletos

| Flujo | Estado | Qué falta |
|---|---|---|
| Estudiante → ver afinidad real con vacantes | 🟡 | Consumir matching del backend en vez de hardcode |
| Gestor → ver detalle de empresa con supervisores/vacantes | 🟡 | Vista de detalle individual por empresa |
| Gestor → registrar nuevo supervisor al aprobar | 🟡 | Formulario inline de creación de supervisor |
| Gestor → buscar/filtrar empresas por nombre | ❌ | Campo de búsqueda en la vista |
| Estudiante → restricción de 1 postulación activa | ❌ | Validación en backend antes del INSERT |

---

## 🎯 ¿Nos Salimos del Alcance?

**No.** El proyecto se mantiene estrictamente dentro del alcance definido. No hay funcionalidades implementadas que excedan los requisitos documentados.

De hecho, hay funcionalidades **extra** que complementan bien pero no están en los requisitos:
- **Panel admin** completo (gestión de usuarios, empresas, reportes con gráficos)
- **Historial de postulaciones** para el gestor
- **Dashboard de reportes** con datos reales de la BD

Estas son extensiones naturales del sistema que no se salen del alcance pero aportan valor.

> [!IMPORTANT]
> **Riesgo de alcance:** El único riesgo es el lenguaje de marketing en el login que menciona "NLP" y "similitud semántica". Si esto se presenta en la defensa de tesis como funcionalidad implementada, sería una discrepancia. El directorio `nlp_engine/` debe tratarse como **trabajo futuro** y no como funcionalidad actual, o bien los textos del login deben actualizarse para reflejar que el matching es basado en **comparación ponderada de habilidades**.
