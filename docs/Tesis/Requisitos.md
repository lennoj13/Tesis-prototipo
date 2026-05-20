**Nombre del modulo**

**Requisitos funcionales**

Módulo gestión de usuarios

RF - 1: autenticación y autorización de usuarios

Módulo de estudiantes

RF - 2: gestión de perfil estudiantil
RF - 3: postulación a vacantes

Módulo empresas

RF - 3: gestión de vacantes de prácticas
RF - 5: actualización de postulaciones a empresa

Módulo gestor

RF - 6: gestión y aprobación de postulaciones aceptadas por empresas
RF - 7: modificación de supervisor antes de la aprobación formal

RF - 8: listado de empresas del convenio
RF - 9: búsqueda de estudiantes por número de cédula
RF - 10: dashboard con indicadores generales

Módulo de recomendación

RF - 11: emparejamiento de perfiles (sistema de recomendación)

**Requisitos no funcionales**

RNF - 1: arquitectura cliente-servidor

RNF - 2: persistencia de datos relacional

RNF - 3: seguridad en capa de sesión (JWT)

RNF - 4: interfaz de usuario frontend

RNF - 5: diseño responsivo de la interfaz

RNF - 6: rendimiento y tiempo de respuesta

RNF - 7: Generación de Paquete de Datos SIUG

**RF - RF - 1: autenticación y autorización de usuarios**

**Detalles de requisitos y restricciones:**

**Requisitos:**

*   El sistema debe contar con un registro general de usuarios con validación de credenciales (número de cédula y contraseña).
*   El sistema debe validar el acceso a módulos según su rol específico (estudiante, empresa, gestor, admin) mediante JSON Web Tokens (JWT).

**Restricciones:**

*   El acceso a los servicios debe depender estrictamente del rol del usuario (Ej. Sólo empresas tienen permiso para crear vacantes).

**Prioridad:**

Alta

**RF - RF - 2: gestión de perfil estudiantil**

**Detalles de requisitos y restricciones:**

**Requisitos:**

*   El sistema debe permitir actualizar los perfiles académicos de los estudiantes (área de interés, habilidades técnicas, experiencia).

**Restricciones:**

*   La gestión de perfil no permitirá modificar datos precargados institucionales que lo identifican como estudiante como nombres, correos, cedula, semestre y carrera.

**Prioridad:**

Baja

**RF - RF - 3: postulación a vacantes**

**Detalles de requisitos y restricciones:**

**Requisitos:**

*   El sistema debe registrar la postulación única de un estudiante a una vacante.

**Restricciones:**

*   El estudiante no puede postularse dos veces a la misma vacante una vez rechazado
*   El estudiante no puede postularse a otra vacante si ya se encuentra postulado a otra

**Prioridad:**

Alta

**RF - RF - 4: gestión de vacantes de prácticas**

**Detalles de requisitos y restricciones:**

**Requisitos:**

*   El sistema debe permitir registrar, consultar, actualizar y eliminar vacantes las cuales deben de tener campos como: título, modalidad, ubicación, cupos y horas a cumplir.
*   El sistema debe permitir asociar habilidades específicas (requeridas u opcionales) a cada vacante.
*   Se puede asignar un supervisor ya creado a la vacante.

**Restricciones:**

**Prioridad:**

Alta

**RF – RF – 5: actualización de postulaciones a empresa**

**Detalles de requisitos y restricciones:**

**Requisitos:**

*   La empresa podrá observar el perfil del estudiante postulado a su vacante.
*   La empresa debe poder marcar postulaciones como “aceptada empresa” o “rechazada”.

**Restricciones:**

**Prioridad:**

Alta

**RF – RF6: gestión y aprobación de postulaciones aceptadas por empresas**

**Detalles de requisitos y restricciones:**

**Requisitos:**

*   El sistema debe mostrar al gestor un listado filtrado de postulaciones con estado “aceptada empresa” pendientes de aprobación formal.
*   El gestor debe poder acceder al detalle completo de cada postulación antes de aprobarla.
*   Al confirmar la aprobación, el sistema debe generar y registrar la solicitud formal de prácticas preprofesionales asignando el número de solicitud definitivo.

**Restricciones:**

*   Solo el gestor puede ejecutar la aprobación formal; las empresas y estudiantes no tienen acceso a esta acción.
*   No se puede aprobar una postulación que no tenga previamente el estado “aceptada empresa”.

**Prioridad:**

Alta

**RF – RF 7: modificación de supervisor antes de la aprobación formal**

**Detalles de requisitos y restricciones:**

**Requisitos:**

*   El gestor debe poder editar el supervisor asignado directamente desde el panel de detalle de la postulación.
*   El sistema debe permitir seleccionar un supervisor existente de la institución o registrar uno nuevo en el mismo flujo.
*   El cambio de supervisor debe guardarse antes de que se confirme la aprobación formal.

**Restricciones:**

*   Esta acción solo está disponible mientras la postulación se encuentre en estado “aceptada empresa” y no haya sido aprobada formalmente aún.
*   El nuevo supervisor debe pertenecer a la institución vinculada a la vacante.

**Prioridad:**

Alta

**RF – RF 8: listado de empresas del convenio**

**Detalles de requisitos y restricciones:**

**Requisitos:**

*   El gestor debe poder visualizar todas las empresas de convenio registradas en la plataforma.
*   Al seleccionar una empresa, el sistema debe mostrar su información detallada: datos generales, supervisores registrados y vacantes publicadas.
*   El listado debe permitir búsqueda o filtrado por nombre de empresa.

**Restricciones:**

*   El gestor no puede crear ni eliminar empresas desde este panel; solo tiene permisos de consulta y edición de supervisores.

**Prioridad:**

Media

**RF – RF9: búsqueda de estudiantes por número de cédula**

**Detalles de requisitos y restricciones:**

**Requisitos:**

*   El sistema debe disponer de un campo de búsqueda por número de cédula dentro del panel del gestor.
*   Al localizar al estudiante, se debe mostrar: datos personales, carrera, semestre, historial de postulaciones, estado de cada una y empresa asignada en caso de tener una solicitud generada o ya aprobada anteriormente.

**Restricciones:**

*   El gestor no puede modificar los datos del perfil académico del estudiante desde este panel.

**Prioridad:**

Media

**RF - RF 10: dashboard con indicadores generales**

**Detalles de requisitos y restricciones:**

**Requisitos:**

*   El dashboard debe mostrar el total de vacantes publicadas activas en la plataforma y otros indicadores relevantes para la gestión del proceso de prácticas.
*   El dashboard debe mostrar el número de postulaciones en estado "aceptada empresa" pendientes de aprobación formal por el gestor.

**Restricciones:**

*   Los indicadores son de solo lectura; no se pueden ejecutar acciones directamente desde las tarjetas del dashboard.

**Prioridad:**

Alta

**RF – RF – 11: Emparejamiento de perfiles (sistema de recomendación)**

**Detalles de requisitos y restricciones:**

**Requisitos:**

*   El sistema debe contrastar las habilidades registradas por el estudiante y sus niveles con las habilidades solicitadas en las vacantes mediante un sistema de recomendación.
*   El sistema de mostrar la afinidad entre la vacante de una empresa y el perfil del estudiante

**Restricciones:**

**Prioridad:**

Alta

**RNF - RNF - 1: arquitectura cliente-servidor**

**Detalles de requisitos y restricciones:**

**Requisitos:**

*   El sistema debe utilizar una arquitectura de software Cliente-Servidor que conecte a los usuarios finales (frontend) con un único servicio centralizado (backend) que procesa la lógica de negocios.
*   El servidor de backend debe desarrollarse utilizando Python (Flask).
*   El modelo de comunicación debe utilizar el protocolo HTTP y formato de datos JSON.

**Restricciones:**

*   El sistema es una aplicación monolítica centralizada, no se divide en microservicios independientes.

**Prioridad:**

Alta

**RNF - RNF - 2: persistencia de datos relacional**

**Detalles de requisitos y restricciones:**

**Requisitos:**

*   La base de datos debe ser PostgreSQL, con el diseño predefinido de 12 tablas principales (usuarios, instituciones, vacantes, postulaciones, etc.).
*   Las tablas deben utilizar claves foráneas para referenciar y enlazar correctamente la información y habilitar la eliminación en cascada (ON DELETE CASCADE) donde sea necesario.

**Restricciones:**

*   El acceso a los datos por parte de la lógica de negocio debe encapsularse a través de los componentes de backend.

**Prioridad:**

Alta

**RNF - RNF - 3: seguridad en capa de sesión (JWT)**

**Detalles de requisitos y restricciones:**

**Requisitos:**

*   El acceso a las funciones del servidor debe estar protegidos y validados mediante autenticación segura por tokens.
*   El cifrado de las contraseñas debe realizarse antes del almacenamiento en la base de datos.

**Restricciones:**

**Prioridad:**

Alta

**RNF - RNF - 4: interfaz de usuario frontend**

**Detalles de requisitos y restricciones:**

**Requisitos:**

*   El frontend debe estar implementado utilizando la biblioteca React.
*   Debe incluir paneles de control (dashboards) diferenciados de acuerdo con el rol que ha iniciado sesión.

**Restricciones:**

*   La aplicación debe asegurar que no haya exposición visual de paneles administrativos para roles no autorizados (ej. estudiantes viendo la vista de gestor).

**Prioridad:**

Media

**RNF - RNF - 5: diseño responsivo de la interfaz**

**Detalles de requisitos y restricciones:**

**Requisitos:**

*   El sistema debe implementar un diseño responsivo basado en un sistema de grillas flexible que reorganice los componentes visuales según el ancho de pantalla del dispositivo.
*   Los elementos interactivos como botones, formularios y tablas deben mantener su usabilidad en pantallas táctiles

**Restricciones:**

*   No se desarrollará una aplicación móvil nativa; la responsividad debe lograrse exclusivamente desde el navegador web.

**Prioridad:**

Media

**RNF - RNF - 6: rendimiento y tiempo de respuesta**

**Detalles de requisitos y restricciones:**

**Requisitos:**

*   Las vistas principales del sistema (dashboard, listado de vacantes, panel de postulaciones) deben cargar en un tiempo máximo de 3 segundos bajo condiciones normales de uso.

**Restricciones:**

**Prioridad:**

Media

**RNF - RNF 7: Generación de Paquete de Datos SIUG**

**Detalles de requisitos y restricciones:**

**Requisitos:**

*   El sistema debe armar una estructura JSON que consolide información del estudiante, la institución, datos del supervisor asignado, código de solicitud la cual debe poder ser consumida mediante API

**Restricciones:**

*   El paquete de datos debe estar formateado estrictamente bajo el esquema predefinido del SIUG, agrupando los campos de la base de datos relacional de la plataforma.
*   Se utilizarán datos simulados.

**Prioridad:**

Media

**STAKEHOLDERS**

PO: GESTOR DE PRÁCTICAS

SCRUM MASTER: ING. ALEXANDRA VARELA

DEVELOPERS: NALDO, BRYAN

OTROS: ESTUDIANTES