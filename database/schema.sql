-- ============================================
-- ESQUEMA: Sistema de Recomendacion PPP
-- Universidad de Guayaquil - Carrera de Software
-- Tesis: Anchundia - Galarza (2026)
-- ============================================
-- Todas las tablas y columnas en espanol.
-- NOTA: Evitar tildes en valores DEFAULT para prevenir errores de encoding.
-- ============================================

-- 1. ROLES
CREATE TABLE public.roles (
    rol_id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE,
    descripcion VARCHAR(200)
);

-- 2. USUARIOS
CREATE TABLE public.usuarios (
    usuario_id SERIAL PRIMARY KEY,
    cedula VARCHAR(15) UNIQUE,
    login VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    rol_id INTEGER NOT NULL REFERENCES public.roles(rol_id),
    foto_perfil TEXT,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT NOW(),
    actualizado_en TIMESTAMP DEFAULT NOW()
);

-- 3. FACULTADES
CREATE TABLE public.facultades (
    facultad_id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT true
);

-- 4. CARRERAS
CREATE TABLE public.carreras (
    carrera_id SERIAL PRIMARY KEY,
    facultad_id INTEGER NOT NULL REFERENCES public.facultades(facultad_id),
    nombre VARCHAR(200) NOT NULL,
    codigo VARCHAR(20),
    activo BOOLEAN DEFAULT true,
    UNIQUE(facultad_id, nombre)
);

-- 5. PERFILES DE ESTUDIANTE
CREATE TABLE public.perfiles_estudiante (
    perfil_id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL UNIQUE REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE,
    carrera_id INTEGER REFERENCES public.carreras(carrera_id),
    semestre VARCHAR(30),
    universidad VARCHAR(200) DEFAULT 'Universidad de Guayaquil',
    resumen_experiencia TEXT,
    intereses TEXT,
    curriculum_url TEXT,
    creado_en TIMESTAMP DEFAULT NOW(),
    actualizado_en TIMESTAMP DEFAULT NOW()
);

-- 6. INSTITUCIONES
CREATE TABLE public.instituciones (
    institucion_id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES public.usuarios(usuario_id),
    nombre VARCHAR(200) NOT NULL,
    ruc VARCHAR(20) UNIQUE,
    industria VARCHAR(100),
    descripcion TEXT,
    sitio_web VARCHAR(255),
    direccion VARCHAR(300),
    ciudad VARCHAR(100) DEFAULT 'Guayaquil',
    correo_contacto VARCHAR(150),
    telefono VARCHAR(20),
    estado VARCHAR(20) DEFAULT 'pendiente',
    creado_en TIMESTAMP DEFAULT NOW(),
    actualizado_en TIMESTAMP DEFAULT NOW()
);

-- 7. SUPERVISORES
CREATE TABLE public.supervisores (
    supervisor_id SERIAL PRIMARY KEY,
    institucion_id INTEGER NOT NULL REFERENCES public.instituciones(institucion_id) ON DELETE CASCADE,
    tipo_identificacion VARCHAR(20) DEFAULT 'Cedula',
    numero_identificacion VARCHAR(20) NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    correo VARCHAR(150),
    departamento VARCHAR(200),
    cargo VARCHAR(100),
    telefono VARCHAR(20),
    observacion TEXT,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT NOW(),
    actualizado_en TIMESTAMP DEFAULT NOW()
);

-- 8. HABILIDADES
CREATE TABLE public.habilidades (
    habilidad_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    categoria VARCHAR(50)
);

-- 9. HABILIDADES DEL ESTUDIANTE
CREATE TABLE public.habilidades_estudiante (
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER NOT NULL REFERENCES public.perfiles_estudiante(perfil_id) ON DELETE CASCADE,
    habilidad_id INTEGER NOT NULL REFERENCES public.habilidades(habilidad_id) ON DELETE CASCADE,
    nivel INTEGER DEFAULT 1 CHECK (nivel BETWEEN 1 AND 5),
    UNIQUE(estudiante_id, habilidad_id)
);

-- 10. VACANTES
CREATE TABLE public.vacantes (
    vacante_id SERIAL PRIMARY KEY,
    institucion_id INTEGER NOT NULL REFERENCES public.instituciones(institucion_id) ON DELETE CASCADE,
    supervisor_id INTEGER REFERENCES public.supervisores(supervisor_id) ON DELETE SET NULL,
    titulo VARCHAR(200) NOT NULL,
    area VARCHAR(100),
    descripcion TEXT,
    requisitos TEXT,
    modalidad VARCHAR(30) DEFAULT 'Presencial',
    ubicacion VARCHAR(200),
    total_horas INTEGER,
    horas_diarias INTEGER,
    horario VARCHAR(200),
    cupos INTEGER DEFAULT 1,
    activo BOOLEAN DEFAULT true,
    fecha_expiracion DATE,
    creado_en TIMESTAMP DEFAULT NOW(),
    actualizado_en TIMESTAMP DEFAULT NOW()
);

-- 11. HABILIDADES DE VACANTE
CREATE TABLE public.habilidades_vacante (
    id SERIAL PRIMARY KEY,
    vacante_id INTEGER NOT NULL REFERENCES public.vacantes(vacante_id) ON DELETE CASCADE,
    habilidad_id INTEGER NOT NULL REFERENCES public.habilidades(habilidad_id) ON DELETE CASCADE,
    nivel_requerido INTEGER DEFAULT 1,
    es_opcional BOOLEAN DEFAULT false,
    UNIQUE(vacante_id, habilidad_id)
);

-- 12. POSTULACIONES
CREATE TABLE public.postulaciones (
    postulacion_id SERIAL PRIMARY KEY,
    estudiante_id INTEGER NOT NULL REFERENCES public.perfiles_estudiante(perfil_id) ON DELETE CASCADE,
    vacante_id INTEGER NOT NULL REFERENCES public.vacantes(vacante_id) ON DELETE CASCADE,
    supervisor_id INTEGER REFERENCES public.supervisores(supervisor_id),
    nro_solicitud VARCHAR(30) UNIQUE,
    estado VARCHAR(30) DEFAULT 'pendiente',
    porcentaje_afinidad DECIMAL(5,2) DEFAULT 0,
    fecha_respuesta_empresa TIMESTAMP,
    fecha_respuesta_gestor TIMESTAMP,
    notas_empresa TEXT,
    notas_gestor TEXT,
    creado_en TIMESTAMP DEFAULT NOW(),
    actualizado_en TIMESTAMP DEFAULT NOW(),
    UNIQUE(estudiante_id, vacante_id)
);

-- 13. NOTIFICACIONES
CREATE TABLE public.notificaciones (
    notificacion_id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE,
    tipo VARCHAR(30) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT,
    leida BOOLEAN DEFAULT false,
    referencia_id INTEGER,
    referencia_tipo VARCHAR(30),
    creado_en TIMESTAMP DEFAULT NOW()
);

-- INDICES
CREATE INDEX idx_usuarios_rol ON public.usuarios(rol_id);
CREATE INDEX idx_usuarios_correo ON public.usuarios(correo);
CREATE INDEX idx_usuarios_cedula ON public.usuarios(cedula);
CREATE INDEX idx_perfiles_usuario ON public.perfiles_estudiante(usuario_id);
CREATE INDEX idx_perfiles_carrera ON public.perfiles_estudiante(carrera_id);
CREATE INDEX idx_instituciones_usuario ON public.instituciones(usuario_id);
CREATE INDEX idx_instituciones_estado ON public.instituciones(estado);
CREATE INDEX idx_supervisores_institucion ON public.supervisores(institucion_id);
CREATE INDEX idx_vacantes_institucion ON public.vacantes(institucion_id);
CREATE INDEX idx_vacantes_activo ON public.vacantes(activo);
CREATE INDEX idx_postulaciones_estudiante ON public.postulaciones(estudiante_id);
CREATE INDEX idx_postulaciones_vacante ON public.postulaciones(vacante_id);
CREATE INDEX idx_postulaciones_estado ON public.postulaciones(estado);
CREATE INDEX idx_notificaciones_usuario ON public.notificaciones(usuario_id);
CREATE INDEX idx_notificaciones_leida ON public.notificaciones(leida);
