--
-- PostgreSQL database dump
--


-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cache_afinidad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cache_afinidad (
    id integer NOT NULL,
    estudiante_id integer NOT NULL,
    vacante_id integer NOT NULL,
    porcentaje_afinidad numeric(5,2) NOT NULL,
    calculado_en timestamp without time zone DEFAULT now()
);



--
-- Name: cache_afinidad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cache_afinidad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: cache_afinidad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cache_afinidad_id_seq OWNED BY public.cache_afinidad.id;


--
-- Name: carreras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carreras (
    carrera_id integer NOT NULL,
    facultad_id integer NOT NULL,
    nombre character varying(200) NOT NULL,
    codigo character varying(20),
    activo boolean DEFAULT true
);



--
-- Name: carreras_carrera_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carreras_carrera_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: carreras_carrera_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carreras_carrera_id_seq OWNED BY public.carreras.carrera_id;


--
-- Name: facultades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.facultades (
    facultad_id integer NOT NULL,
    nombre character varying(200) NOT NULL,
    activo boolean DEFAULT true
);



--
-- Name: facultades_facultad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.facultades_facultad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: facultades_facultad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.facultades_facultad_id_seq OWNED BY public.facultades.facultad_id;


--
-- Name: habilidades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.habilidades (
    habilidad_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    categoria character varying(50)
);



--
-- Name: habilidades_estudiante; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.habilidades_estudiante (
    id integer NOT NULL,
    estudiante_id integer NOT NULL,
    habilidad_id integer NOT NULL,
    nivel integer DEFAULT 1,
    CONSTRAINT habilidades_estudiante_nivel_check CHECK (((nivel >= 1) AND (nivel <= 5)))
);



--
-- Name: habilidades_estudiante_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.habilidades_estudiante_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: habilidades_estudiante_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.habilidades_estudiante_id_seq OWNED BY public.habilidades_estudiante.id;


--
-- Name: habilidades_habilidad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.habilidades_habilidad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: habilidades_habilidad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.habilidades_habilidad_id_seq OWNED BY public.habilidades.habilidad_id;


--
-- Name: habilidades_vacante; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.habilidades_vacante (
    id integer NOT NULL,
    vacante_id integer NOT NULL,
    habilidad_id integer NOT NULL,
    nivel_requerido integer DEFAULT 1,
    es_opcional boolean DEFAULT false
);



--
-- Name: habilidades_vacante_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.habilidades_vacante_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: habilidades_vacante_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.habilidades_vacante_id_seq OWNED BY public.habilidades_vacante.id;


--
-- Name: instituciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.instituciones (
    institucion_id integer NOT NULL,
    usuario_id integer,
    facultad_id integer,
    nombre character varying(200) NOT NULL,
    nombre_abreviado character varying(100),
    ruc character varying(20),
    industria character varying(100),
    descripcion text,
    sitio_web character varying(255),
    direccion character varying(300),
    ciudad character varying(100) DEFAULT 'Guayaquil'::character varying,
    correo_contacto character varying(150),
    telefono character varying(20),
    estado character varying(20) DEFAULT 'pendiente'::character varying,
    codigo_convenio character varying(100),
    tipo_convenio character varying(100) DEFAULT 'PRACTICAS PREPROFESIONALES'::character varying,
    fecha_inicio_convenio date,
    fecha_limite_convenio date,
    creado_en timestamp without time zone DEFAULT now(),
    actualizado_en timestamp without time zone DEFAULT now()
);



--
-- Name: instituciones_institucion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.instituciones_institucion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: instituciones_institucion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.instituciones_institucion_id_seq OWNED BY public.instituciones.institucion_id;


--
-- Name: perfiles_estudiante; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perfiles_estudiante (
    perfil_id integer NOT NULL,
    usuario_id integer NOT NULL,
    carrera_id integer,
    facultad_id integer,
    semestre character varying(30),
    universidad character varying(200) DEFAULT 'Universidad de Guayaquil'::character varying,
    resumen_experiencia text,
    intereses text,
    curriculum_url text,
    creado_en timestamp without time zone DEFAULT now(),
    actualizado_en timestamp without time zone DEFAULT now()
);



--
-- Name: perfiles_estudiante_perfil_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.perfiles_estudiante_perfil_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: perfiles_estudiante_perfil_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.perfiles_estudiante_perfil_id_seq OWNED BY public.perfiles_estudiante.perfil_id;


--
-- Name: perfiles_gestor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perfiles_gestor (
    perfil_id integer NOT NULL,
    usuario_id integer NOT NULL,
    facultad_id integer,
    carrera_id integer,
    creado_en timestamp without time zone DEFAULT now(),
    actualizado_en timestamp without time zone DEFAULT now()
);



--
-- Name: perfiles_gestor_perfil_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.perfiles_gestor_perfil_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: perfiles_gestor_perfil_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.perfiles_gestor_perfil_id_seq OWNED BY public.perfiles_gestor.perfil_id;


--
-- Name: postulaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.postulaciones (
    postulacion_id integer NOT NULL,
    estudiante_id integer NOT NULL,
    vacante_id integer NOT NULL,
    supervisor_id integer,
    nro_solicitud character varying(30),
    estado character varying(30) DEFAULT 'pendiente'::character varying,
    porcentaje_afinidad numeric(5,2) DEFAULT 0,
    fecha_respuesta_empresa timestamp without time zone,
    fecha_respuesta_gestor timestamp without time zone,
    notas_empresa text,
    notas_gestor text,
    creado_en timestamp without time zone DEFAULT now(),
    actualizado_en timestamp without time zone DEFAULT now(),
    habilidades_snapshot jsonb DEFAULT '[]'::jsonb
);



--
-- Name: postulaciones_postulacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.postulaciones_postulacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: postulaciones_postulacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.postulaciones_postulacion_id_seq OWNED BY public.postulaciones.postulacion_id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    rol_id integer NOT NULL,
    nombre character varying(20) NOT NULL,
    descripcion character varying(200)
);



--
-- Name: roles_rol_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_rol_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: roles_rol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_rol_id_seq OWNED BY public.roles.rol_id;


--
-- Name: supervisores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supervisores (
    supervisor_id integer NOT NULL,
    institucion_id integer NOT NULL,
    tipo_identificacion character varying(20) DEFAULT 'Cedula'::character varying,
    numero_identificacion character varying(20) NOT NULL,
    nombre character varying(200) NOT NULL,
    apellido character varying(200),
    correo character varying(150),
    departamento character varying(200),
    cargo character varying(100),
    telefono character varying(20),
    observacion text,
    activo boolean DEFAULT true,
    creado_en timestamp without time zone DEFAULT now(),
    actualizado_en timestamp without time zone DEFAULT now()
);



--
-- Name: supervisores_supervisor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.supervisores_supervisor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: supervisores_supervisor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.supervisores_supervisor_id_seq OWNED BY public.supervisores.supervisor_id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    usuario_id integer NOT NULL,
    cedula character varying(15),
    contrasena character varying(255) NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    correo character varying(150) NOT NULL,
    telefono character varying(20),
    rol_id integer NOT NULL,
    foto_perfil text,
    activo boolean DEFAULT true,
    creado_en timestamp without time zone DEFAULT now(),
    actualizado_en timestamp without time zone DEFAULT now()
);



--
-- Name: usuarios_usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: usuarios_usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_usuario_id_seq OWNED BY public.usuarios.usuario_id;


--
-- Name: vacantes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vacantes (
    vacante_id integer NOT NULL,
    institucion_id integer NOT NULL,
    supervisor_id integer,
    titulo character varying(200) NOT NULL,
    area character varying(100),
    descripcion text,
    requisitos text,
    modalidad character varying(30) DEFAULT 'Presencial'::character varying,
    ubicacion character varying(200),
    total_horas integer,
    horas_diarias integer,
    horario character varying(200),
    cupos integer DEFAULT 1,
    activo boolean DEFAULT true,
    fecha_expiracion date,
    creado_en timestamp without time zone DEFAULT now(),
    actualizado_en timestamp without time zone DEFAULT now()
);



--
-- Name: vacantes_vacante_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vacantes_vacante_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: vacantes_vacante_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vacantes_vacante_id_seq OWNED BY public.vacantes.vacante_id;


--
-- Name: cache_afinidad id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cache_afinidad ALTER COLUMN id SET DEFAULT nextval('public.cache_afinidad_id_seq'::regclass);


--
-- Name: carreras carrera_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carreras ALTER COLUMN carrera_id SET DEFAULT nextval('public.carreras_carrera_id_seq'::regclass);


--
-- Name: facultades facultad_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facultades ALTER COLUMN facultad_id SET DEFAULT nextval('public.facultades_facultad_id_seq'::regclass);


--
-- Name: habilidades habilidad_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades ALTER COLUMN habilidad_id SET DEFAULT nextval('public.habilidades_habilidad_id_seq'::regclass);


--
-- Name: habilidades_estudiante id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades_estudiante ALTER COLUMN id SET DEFAULT nextval('public.habilidades_estudiante_id_seq'::regclass);


--
-- Name: habilidades_vacante id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades_vacante ALTER COLUMN id SET DEFAULT nextval('public.habilidades_vacante_id_seq'::regclass);


--
-- Name: instituciones institucion_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instituciones ALTER COLUMN institucion_id SET DEFAULT nextval('public.instituciones_institucion_id_seq'::regclass);


--
-- Name: perfiles_estudiante perfil_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_estudiante ALTER COLUMN perfil_id SET DEFAULT nextval('public.perfiles_estudiante_perfil_id_seq'::regclass);


--
-- Name: perfiles_gestor perfil_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_gestor ALTER COLUMN perfil_id SET DEFAULT nextval('public.perfiles_gestor_perfil_id_seq'::regclass);


--
-- Name: postulaciones postulacion_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones ALTER COLUMN postulacion_id SET DEFAULT nextval('public.postulaciones_postulacion_id_seq'::regclass);


--
-- Name: roles rol_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN rol_id SET DEFAULT nextval('public.roles_rol_id_seq'::regclass);


--
-- Name: supervisores supervisor_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supervisores ALTER COLUMN supervisor_id SET DEFAULT nextval('public.supervisores_supervisor_id_seq'::regclass);


--
-- Name: usuarios usuario_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN usuario_id SET DEFAULT nextval('public.usuarios_usuario_id_seq'::regclass);


--
-- Name: vacantes vacante_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacantes ALTER COLUMN vacante_id SET DEFAULT nextval('public.vacantes_vacante_id_seq'::regclass);


--
-- Data for Name: cache_afinidad; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cache_afinidad (id, estudiante_id, vacante_id, porcentaje_afinidad, calculado_en) VALUES (274, 1, 14, 8.71, '2026-06-15 21:48:48.754017');
INSERT INTO public.cache_afinidad (id, estudiante_id, vacante_id, porcentaje_afinidad, calculado_en) VALUES (275, 1, 15, 8.71, '2026-06-15 21:48:48.90203');
INSERT INTO public.cache_afinidad (id, estudiante_id, vacante_id, porcentaje_afinidad, calculado_en) VALUES (262, 1, 18, 56.57, '2026-06-15 22:09:56.01175');
INSERT INTO public.cache_afinidad (id, estudiante_id, vacante_id, porcentaje_afinidad, calculado_en) VALUES (279, 1, 17, 52.10, '2026-06-15 22:09:56.06121');
INSERT INTO public.cache_afinidad (id, estudiante_id, vacante_id, porcentaje_afinidad, calculado_en) VALUES (265, 1, 4, 42.16, '2026-06-15 22:09:56.108399');
INSERT INTO public.cache_afinidad (id, estudiante_id, vacante_id, porcentaje_afinidad, calculado_en) VALUES (266, 1, 6, 42.16, '2026-06-15 22:09:56.147979');
INSERT INTO public.cache_afinidad (id, estudiante_id, vacante_id, porcentaje_afinidad, calculado_en) VALUES (267, 1, 7, 42.16, '2026-06-15 22:09:56.190608');
INSERT INTO public.cache_afinidad (id, estudiante_id, vacante_id, porcentaje_afinidad, calculado_en) VALUES (268, 1, 8, 42.16, '2026-06-15 22:09:56.239603');
INSERT INTO public.cache_afinidad (id, estudiante_id, vacante_id, porcentaje_afinidad, calculado_en) VALUES (269, 1, 9, 42.16, '2026-06-15 22:09:56.291353');
INSERT INTO public.cache_afinidad (id, estudiante_id, vacante_id, porcentaje_afinidad, calculado_en) VALUES (276, 1, 10, 42.16, '2026-06-15 22:09:56.346861');
INSERT INTO public.cache_afinidad (id, estudiante_id, vacante_id, porcentaje_afinidad, calculado_en) VALUES (271, 1, 11, 25.56, '2026-06-15 22:09:56.391029');
INSERT INTO public.cache_afinidad (id, estudiante_id, vacante_id, porcentaje_afinidad, calculado_en) VALUES (272, 1, 12, 25.56, '2026-06-15 22:09:56.434931');
INSERT INTO public.cache_afinidad (id, estudiante_id, vacante_id, porcentaje_afinidad, calculado_en) VALUES (273, 1, 13, 25.56, '2026-06-15 22:09:56.477923');
INSERT INTO public.cache_afinidad (id, estudiante_id, vacante_id, porcentaje_afinidad, calculado_en) VALUES (264, 1, 3, 42.16, '2026-06-15 22:09:56.525452');
INSERT INTO public.cache_afinidad (id, estudiante_id, vacante_id, porcentaje_afinidad, calculado_en) VALUES (270, 1, 1, 42.16, '2026-06-15 22:09:56.563797');
INSERT INTO public.cache_afinidad (id, estudiante_id, vacante_id, porcentaje_afinidad, calculado_en) VALUES (277, 1, 2, 42.16, '2026-06-15 22:09:56.603501');


--
-- Data for Name: carreras; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.carreras (carrera_id, facultad_id, nombre, codigo, activo) VALUES (1, 1, 'SOFTWARE', 'SOF', true);
INSERT INTO public.carreras (carrera_id, facultad_id, nombre, codigo, activo) VALUES (2, 1, 'Ciencias de Datos e Inteligencia Artificial', 'CDIA', true);
INSERT INTO public.carreras (carrera_id, facultad_id, nombre, codigo, activo) VALUES (3, 2, 'Ingeniería de la Producción', 'INP', true);


--
-- Data for Name: facultades; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.facultades (facultad_id, nombre, activo) VALUES (1, 'Ciencias Matemáticas y Físicas', true);
INSERT INTO public.facultades (facultad_id, nombre, activo) VALUES (2, 'Ingeniería Química', true);


--
-- Data for Name: habilidades; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (1, 'JavaScript', 'Programacion');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (2, 'Python', 'Programacion');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (3, 'React', 'Frontend');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (4, 'Node.js', 'Backend');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (5, 'SQL', 'Base de Datos');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (6, 'Java', 'Programacion');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (7, 'TypeScript', 'Programacion');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (8, 'Git', 'Herramientas');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (9, 'Excel', 'Herramientas');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (10, 'Power BI', 'Analisis');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (11, 'Figma', 'Diseno');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (12, 'Adobe XD', 'Diseno');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (13, 'Machine Learning', 'IA');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (14, 'Data Analysis', 'Analisis');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (15, 'AWS', 'Cloud');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (16, 'Docker', 'DevOps');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (17, 'Ingles', 'Idiomas');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (18, 'Liderazgo', 'Soft Skills');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (19, 'Trabajo en equipo', 'Soft Skills');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (20, 'Comunicacion', 'Soft Skills');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (21, 'Flask', 'Backend');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (22, 'Django', 'Backend');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (23, 'C#', 'Programacion');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (24, '.NET', 'Backend');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (25, 'PHP', 'Programacion');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (26, 'Laravel', 'Backend');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (27, 'Angular', 'Frontend');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (28, 'Vue.js', 'Frontend');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (29, 'PostgreSQL', 'Base de Datos');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (30, 'MongoDB', 'Base de Datos');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (31, 'TensorFlow', 'IA');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (32, 'PyTorch', 'IA');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (33, 'Lean Manufacturing', 'Ingenieria');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (34, 'Six Sigma', 'Ingenieria');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (35, 'Logistica', 'Ingenieria');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (36, 'pyhton', 'Manual');
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (37, 'Data Science', NULL);
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (38, 'Flutter', NULL);
INSERT INTO public.habilidades (habilidad_id, nombre, categoria) VALUES (39, 'CSS', NULL);


--
-- Data for Name: habilidades_estudiante; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (7, 3, 1, 4);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (8, 3, 3, 4);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (9, 3, 4, 3);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (10, 4, 1, 4);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (11, 4, 3, 4);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (12, 4, 4, 3);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (13, 5, 1, 4);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (14, 5, 3, 4);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (15, 5, 4, 3);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (16, 6, 2, 5);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (17, 6, 13, 4);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (18, 6, 14, 4);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (19, 7, 2, 5);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (20, 7, 13, 4);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (21, 7, 14, 4);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (22, 8, 33, 4);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (23, 8, 34, 3);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (24, 8, 35, 4);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (25, 9, 33, 4);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (26, 9, 34, 3);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (27, 9, 35, 4);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (28, 10, 33, 4);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (29, 10, 34, 3);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (30, 10, 35, 4);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (36, 2, 1, 5);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (134, 1, 13, 1);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (135, 1, 37, 1);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (136, 1, 24, 3);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (137, 1, 12, 3);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (138, 1, 5, 3);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (139, 1, 36, 3);
INSERT INTO public.habilidades_estudiante (id, estudiante_id, habilidad_id, nivel) VALUES (140, 1, 14, 3);


--
-- Data for Name: habilidades_vacante; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (1, 1, 4, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (2, 1, 5, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (3, 1, 8, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (4, 2, 4, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (5, 2, 5, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (6, 2, 8, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (7, 3, 4, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (8, 3, 5, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (9, 3, 8, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (10, 4, 4, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (11, 4, 5, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (12, 4, 8, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (13, 5, 4, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (14, 5, 5, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (15, 5, 8, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (16, 6, 4, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (17, 6, 5, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (18, 6, 8, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (19, 7, 4, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (20, 7, 5, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (21, 7, 8, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (22, 8, 4, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (23, 8, 5, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (24, 8, 8, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (25, 9, 4, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (26, 9, 5, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (27, 9, 8, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (28, 10, 4, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (29, 10, 5, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (30, 10, 8, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (31, 11, 2, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (32, 11, 14, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (33, 11, 10, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (34, 12, 2, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (35, 12, 14, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (36, 12, 10, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (37, 13, 2, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (38, 13, 14, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (39, 13, 10, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (40, 14, 9, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (41, 14, 33, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (42, 14, 19, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (43, 15, 9, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (44, 15, 33, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (45, 15, 19, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (52, 18, 2, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (53, 18, 13, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (54, 18, 37, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (55, 18, 5, 1, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (56, 16, 6, 5, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (57, 17, 36, 3, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (58, 17, 14, 3, false);
INSERT INTO public.habilidades_vacante (id, vacante_id, habilidad_id, nivel_requerido, es_opcional) VALUES (59, 17, 1, 3, false);


--
-- Data for Name: instituciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.instituciones (institucion_id, usuario_id, facultad_id, nombre, nombre_abreviado, ruc, industria, descripcion, sitio_web, direccion, ciudad, correo_contacto, telefono, estado, codigo_convenio, tipo_convenio, fecha_inicio_convenio, fecha_limite_convenio, creado_en, actualizado_en) VALUES (2, 16, 1, 'InnovaSoft Ecuador', 'Empresa de Software Factory', '1234567890002', 'Software Factory', 'Desarrollamos soluciones integrales para el sector tecnológico.', NULL, NULL, 'Guayaquil', 'contacto@innovasoftecuador.com', '0990000002', 'aprobado', 'UG-DFAP-0002-PPP', 'PRACTICAS PREPROFESIONALES', '2023-01-01', '2028-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones (institucion_id, usuario_id, facultad_id, nombre, nombre_abreviado, ruc, industria, descripcion, sitio_web, direccion, ciudad, correo_contacto, telefono, estado, codigo_convenio, tipo_convenio, fecha_inicio_convenio, fecha_limite_convenio, creado_en, actualizado_en) VALUES (4, 18, 1, 'Cloud Devs', 'Empresa de Cloud Computing', '1234567890004', 'Cloud Computing', 'Desarrollamos soluciones integrales para el sector tecnológico.', NULL, NULL, 'Guayaquil', 'contacto@clouddevs.com', '0990000004', 'aprobado', 'UG-DFAP-0004-PPP', 'PRACTICAS PREPROFESIONALES', '2023-01-01', '2028-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones (institucion_id, usuario_id, facultad_id, nombre, nombre_abreviado, ruc, industria, descripcion, sitio_web, direccion, ciudad, correo_contacto, telefono, estado, codigo_convenio, tipo_convenio, fecha_inicio_convenio, fecha_limite_convenio, creado_en, actualizado_en) VALUES (5, 19, 1, 'App Works', 'Empresa de Desarrollo Móvil', '1234567890005', 'Desarrollo Móvil', 'Desarrollamos soluciones integrales para el sector tecnológico.', NULL, NULL, 'Guayaquil', 'contacto@appworks.com', '0990000005', 'aprobado', 'UG-DFAP-0005-PPP', 'PRACTICAS PREPROFESIONALES', '2023-01-01', '2028-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones (institucion_id, usuario_id, facultad_id, nombre, nombre_abreviado, ruc, industria, descripcion, sitio_web, direccion, ciudad, correo_contacto, telefono, estado, codigo_convenio, tipo_convenio, fecha_inicio_convenio, fecha_limite_convenio, creado_en, actualizado_en) VALUES (6, 20, 1, 'Fintech Solutions', 'Empresa de Fintech', '1234567890006', 'Fintech', 'Desarrollamos soluciones integrales para el sector tecnológico.', NULL, NULL, 'Guayaquil', 'contacto@fintechsolutions.com', '0990000006', 'aprobado', 'UG-DFAP-0006-PPP', 'PRACTICAS PREPROFESIONALES', '2023-01-01', '2028-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones (institucion_id, usuario_id, facultad_id, nombre, nombre_abreviado, ruc, industria, descripcion, sitio_web, direccion, ciudad, correo_contacto, telefono, estado, codigo_convenio, tipo_convenio, fecha_inicio_convenio, fecha_limite_convenio, creado_en, actualizado_en) VALUES (7, 21, 1, 'CyberSec EC', 'Empresa de Ciberseguridad', '1234567890007', 'Ciberseguridad', 'Desarrollamos soluciones integrales para el sector tecnológico.', NULL, NULL, 'Guayaquil', 'contacto@cybersecec.com', '0990000007', 'aprobado', 'UG-DFAP-0007-PPP', 'PRACTICAS PREPROFESIONALES', '2023-01-01', '2028-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones (institucion_id, usuario_id, facultad_id, nombre, nombre_abreviado, ruc, industria, descripcion, sitio_web, direccion, ciudad, correo_contacto, telefono, estado, codigo_convenio, tipo_convenio, fecha_inicio_convenio, fecha_limite_convenio, creado_en, actualizado_en) VALUES (8, 22, 1, 'Smart Code', 'Empresa de Desarrollo Web', '1234567890008', 'Desarrollo Web', 'Desarrollamos soluciones integrales para el sector tecnológico.', NULL, NULL, 'Guayaquil', 'contacto@smartcode.com', '0990000008', 'aprobado', 'UG-DFAP-0008-PPP', 'PRACTICAS PREPROFESIONALES', '2023-01-01', '2028-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones (institucion_id, usuario_id, facultad_id, nombre, nombre_abreviado, ruc, industria, descripcion, sitio_web, direccion, ciudad, correo_contacto, telefono, estado, codigo_convenio, tipo_convenio, fecha_inicio_convenio, fecha_limite_convenio, creado_en, actualizado_en) VALUES (9, 23, 1, 'Nexus Tech', 'Empresa de Sistemas Empresariales', '1234567890009', 'Sistemas Empresariales', 'Desarrollamos soluciones integrales para el sector tecnológico.', NULL, NULL, 'Guayaquil', 'contacto@nexustech.com', '0990000009', 'aprobado', 'UG-DFAP-0009-PPP', 'PRACTICAS PREPROFESIONALES', '2023-01-01', '2028-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones (institucion_id, usuario_id, facultad_id, nombre, nombre_abreviado, ruc, industria, descripcion, sitio_web, direccion, ciudad, correo_contacto, telefono, estado, codigo_convenio, tipo_convenio, fecha_inicio_convenio, fecha_limite_convenio, creado_en, actualizado_en) VALUES (10, 24, 1, 'Dev Masters', 'Empresa de Desarrollo Backend', '12345678900010', 'Desarrollo Backend', 'Desarrollamos soluciones integrales para el sector tecnológico.', NULL, NULL, 'Guayaquil', 'contacto@devmasters.com', '0990000010', 'aprobado', 'UG-DFAP-0010-PPP', 'PRACTICAS PREPROFESIONALES', '2023-01-01', '2028-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones (institucion_id, usuario_id, facultad_id, nombre, nombre_abreviado, ruc, industria, descripcion, sitio_web, direccion, ciudad, correo_contacto, telefono, estado, codigo_convenio, tipo_convenio, fecha_inicio_convenio, fecha_limite_convenio, creado_en, actualizado_en) VALUES (11, 25, 1, 'DataMind GYE', 'Empresa de Data Science', '12345678900011', 'Data Science', 'Especialistas en análisis de grandes volúmenes de datos.', NULL, NULL, 'Guayaquil', 'contacto@datamindgye.com', '0990000011', 'aprobado', 'UG-DFAP-0011-PPP', 'PRACTICAS PREPROFESIONALES', '2023-05-15', '2028-05-15', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones (institucion_id, usuario_id, facultad_id, nombre, nombre_abreviado, ruc, industria, descripcion, sitio_web, direccion, ciudad, correo_contacto, telefono, estado, codigo_convenio, tipo_convenio, fecha_inicio_convenio, fecha_limite_convenio, creado_en, actualizado_en) VALUES (12, 26, 1, 'AI Vision', 'Empresa de Inteligencia Artificial', '12345678900012', 'Inteligencia Artificial', 'Especialistas en análisis de grandes volúmenes de datos.', NULL, NULL, 'Guayaquil', 'contacto@aivision.com', '0990000012', 'aprobado', 'UG-DFAP-0012-PPP', 'PRACTICAS PREPROFESIONALES', '2023-05-15', '2028-05-15', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones (institucion_id, usuario_id, facultad_id, nombre, nombre_abreviado, ruc, industria, descripcion, sitio_web, direccion, ciudad, correo_contacto, telefono, estado, codigo_convenio, tipo_convenio, fecha_inicio_convenio, fecha_limite_convenio, creado_en, actualizado_en) VALUES (13, 27, 1, 'Metricas EC', 'Empresa de Big Data', '12345678900013', 'Big Data', 'Especialistas en análisis de grandes volúmenes de datos.', NULL, NULL, 'Guayaquil', 'contacto@metricasec.com', '0990000013', 'aprobado', 'UG-DFAP-0013-PPP', 'PRACTICAS PREPROFESIONALES', '2023-05-15', '2028-05-15', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones (institucion_id, usuario_id, facultad_id, nombre, nombre_abreviado, ruc, industria, descripcion, sitio_web, direccion, ciudad, correo_contacto, telefono, estado, codigo_convenio, tipo_convenio, fecha_inicio_convenio, fecha_limite_convenio, creado_en, actualizado_en) VALUES (14, 28, 2, 'InduProducción S.A.', 'Empresa de Manufactura', '12345678900014', 'Manufactura', 'Líderes en procesos industriales y logística a nivel nacional.', NULL, NULL, 'Guayaquil', 'contacto@induproduccións.a..com', '0990000014', 'aprobado', 'UG-DFAP-0014-PPP', 'PRACTICAS PREPROFESIONALES', '2024-02-10', '2029-02-10', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones (institucion_id, usuario_id, facultad_id, nombre, nombre_abreviado, ruc, industria, descripcion, sitio_web, direccion, ciudad, correo_contacto, telefono, estado, codigo_convenio, tipo_convenio, fecha_inicio_convenio, fecha_limite_convenio, creado_en, actualizado_en) VALUES (15, 29, 2, 'Logística Avanzada', 'Empresa de Logística Industrial', '12345678900015', 'Logística Industrial', 'Líderes en procesos industriales y logística a nivel nacional.', NULL, NULL, 'Guayaquil', 'contacto@logísticaavanzada.com', '0990000015', 'aprobado', 'UG-DFAP-0015-PPP', 'PRACTICAS PREPROFESIONALES', '2024-02-10', '2029-02-10', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones (institucion_id, usuario_id, facultad_id, nombre, nombre_abreviado, ruc, industria, descripcion, sitio_web, direccion, ciudad, correo_contacto, telefono, estado, codigo_convenio, tipo_convenio, fecha_inicio_convenio, fecha_limite_convenio, creado_en, actualizado_en) VALUES (3, 17, 1, 'Global Systems', 'Empresa de Consultoría IT', '1234567890003', 'Consultoría IT', 'Desarrollamos soluciones integrales para el sector tecnológico.', NULL, NULL, 'Guayaquil', 'contacto@globalsystems.com', '0990000003', 'aprobado', 'UG-DFAP-0003-PPP', 'PRACTICAS PREPROFESIONALES', '2023-01-01', '2028-12-29', '2026-06-03 23:07:05.812737', '2026-06-10 15:05:02.728542');
INSERT INTO public.instituciones (institucion_id, usuario_id, facultad_id, nombre, nombre_abreviado, ruc, industria, descripcion, sitio_web, direccion, ciudad, correo_contacto, telefono, estado, codigo_convenio, tipo_convenio, fecha_inicio_convenio, fecha_limite_convenio, creado_en, actualizado_en) VALUES (1, 15, 1, 'Tech Solutions GYE', 'Empresa de Desarrollo Web', '1234567890001', 'Desarrollo Web', 'Desarrollamos soluciones integrales para el sector tecnológico.', 'www.ts.com', 'calle 10 de agosto', 'Guayaquil', 'contacto@techsolutionsgye.com', '0990000001', 'aprobado', 'UG-DFAP-0001-PPP', 'PRACTICAS PREPROFESIONALES', '2023-01-01', '2028-12-31', '2026-06-03 23:07:05.812737', '2026-06-10 15:38:34.276007');


--
-- Data for Name: perfiles_estudiante; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.perfiles_estudiante (perfil_id, usuario_id, carrera_id, facultad_id, semestre, universidad, resumen_experiencia, intereses, curriculum_url, creado_en, actualizado_en) VALUES (3, 7, 1, 1, '8', 'Universidad de Guayaquil', 'Desarrollador web con experiencia en proyectos académicos usando MERN stack. Creador de sistema de inventario para pyme local.', 'Me interesa el desarrollo Backend y la arquitectura de software.', NULL, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.perfiles_estudiante (perfil_id, usuario_id, carrera_id, facultad_id, semestre, universidad, resumen_experiencia, intereses, curriculum_url, creado_en, actualizado_en) VALUES (4, 8, 1, 1, '8', 'Universidad de Guayaquil', 'Desarrollador web con experiencia en proyectos académicos usando MERN stack. Creador de sistema de inventario para pyme local.', 'Me interesa el desarrollo Backend y la arquitectura de software.', NULL, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.perfiles_estudiante (perfil_id, usuario_id, carrera_id, facultad_id, semestre, universidad, resumen_experiencia, intereses, curriculum_url, creado_en, actualizado_en) VALUES (5, 9, 1, 1, '8', 'Universidad de Guayaquil', 'Desarrollador web con experiencia en proyectos académicos usando MERN stack. Creador de sistema de inventario para pyme local.', 'Me interesa el desarrollo Backend y la arquitectura de software.', NULL, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.perfiles_estudiante (perfil_id, usuario_id, carrera_id, facultad_id, semestre, universidad, resumen_experiencia, intereses, curriculum_url, creado_en, actualizado_en) VALUES (6, 10, 2, 1, '7', 'Universidad de Guayaquil', 'Entusiasta de los datos. He participado en hackathons de análisis predictivo. Manejo de Python, Pandas y Scikit-Learn.', 'Inteligencia Artificial, Machine Learning, Análisis predictivo.', NULL, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.perfiles_estudiante (perfil_id, usuario_id, carrera_id, facultad_id, semestre, universidad, resumen_experiencia, intereses, curriculum_url, creado_en, actualizado_en) VALUES (8, 12, 3, 2, '8', 'Universidad de Guayaquil', 'Experiencia teórica y práctica en optimización de procesos mediante simuladores. Conocimiento en Lean Manufacturing.', 'Gestión de calidad, Mejora continua, Logística.', NULL, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.perfiles_estudiante (perfil_id, usuario_id, carrera_id, facultad_id, semestre, universidad, resumen_experiencia, intereses, curriculum_url, creado_en, actualizado_en) VALUES (9, 13, 3, 2, '8', 'Universidad de Guayaquil', 'Experiencia teórica y práctica en optimización de procesos mediante simuladores. Conocimiento en Lean Manufacturing.', 'Gestión de calidad, Mejora continua, Logística.', NULL, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.perfiles_estudiante (perfil_id, usuario_id, carrera_id, facultad_id, semestre, universidad, resumen_experiencia, intereses, curriculum_url, creado_en, actualizado_en) VALUES (10, 14, 3, 2, '8', 'Universidad de Guayaquil', 'Experiencia teórica y práctica en optimización de procesos mediante simuladores. Conocimiento en Lean Manufacturing.', 'Gestión de calidad, Mejora continua, Logística.', NULL, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.perfiles_estudiante (perfil_id, usuario_id, carrera_id, facultad_id, semestre, universidad, resumen_experiencia, intereses, curriculum_url, creado_en, actualizado_en) VALUES (1, 5, 1, 1, '9', 'Universidad de Guayaquil', 'Me especializo en el análisis profundo de información y la creación de sistemas inteligentes. Además de mi enfoque en algoritmos de aprendizaje automático, cuento con vasta experiencia en desarrollo de aplicaciones móviles multiplataforma usando Flutter, así como diseño de interfaces frontend con React y Tailwind CSS. ademas manejo agnetes de IA en diferentes modelos, con portocolos MCP', 'Redes neuronales, Análisis estadístico, Desarrollo Frontend, Aplicaciones iOS/Android.', NULL, '2026-06-03 23:07:05.812737', '2026-06-15 21:48:03.900672');
INSERT INTO public.perfiles_estudiante (perfil_id, usuario_id, carrera_id, facultad_id, semestre, universidad, resumen_experiencia, intereses, curriculum_url, creado_en, actualizado_en) VALUES (7, 11, 2, 1, '4', 'Universidad de Guayaquil', 'Entusiasta de los datos. He participado en hackathons de análisis predictivo. Manejo de Python, Pandas y Scikit-Learn.', 'Inteligencia Artificial, Machine Learning, Análisis predictivo.', NULL, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.perfiles_estudiante (perfil_id, usuario_id, carrera_id, facultad_id, semestre, universidad, resumen_experiencia, intereses, curriculum_url, creado_en, actualizado_en) VALUES (2, 6, 1, 1, '10', 'Universidad de Guayaquil', NULL, NULL, NULL, '2026-06-03 23:07:05.812737', '2026-06-05 14:16:34.683683');


--
-- Data for Name: perfiles_gestor; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.perfiles_gestor (perfil_id, usuario_id, facultad_id, carrera_id, creado_en, actualizado_en) VALUES (2, 3, 1, 2, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.perfiles_gestor (perfil_id, usuario_id, facultad_id, carrera_id, creado_en, actualizado_en) VALUES (3, 4, 2, 3, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.perfiles_gestor (perfil_id, usuario_id, facultad_id, carrera_id, creado_en, actualizado_en) VALUES (1, 2, 1, 1, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');


--
-- Data for Name: postulaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.postulaciones (postulacion_id, estudiante_id, vacante_id, supervisor_id, nro_solicitud, estado, porcentaje_afinidad, fecha_respuesta_empresa, fecha_respuesta_gestor, notas_empresa, notas_gestor, creado_en, actualizado_en, habilidades_snapshot) VALUES (1, 8, 15, NULL, NULL, 'cancelada', 95.00, NULL, NULL, NULL, NULL, '2026-06-03 23:34:26.068696', '2026-06-03 23:34:32.19434', '[]');
INSERT INTO public.postulaciones (postulacion_id, estudiante_id, vacante_id, supervisor_id, nro_solicitud, estado, porcentaje_afinidad, fecha_respuesta_empresa, fecha_respuesta_gestor, notas_empresa, notas_gestor, creado_en, actualizado_en, habilidades_snapshot) VALUES (2, 8, 14, 14, '000002', 'aprobada', 71.00, '2026-06-03 23:41:32.923277', '2026-06-03 23:49:43.395523', NULL, 'Aprobado por el gestor de PPP', '2026-06-03 23:34:42.50472', '2026-06-03 23:49:43.395523', '[]');
INSERT INTO public.postulaciones (postulacion_id, estudiante_id, vacante_id, supervisor_id, nro_solicitud, estado, porcentaje_afinidad, fecha_respuesta_empresa, fecha_respuesta_gestor, notas_empresa, notas_gestor, creado_en, actualizado_en, habilidades_snapshot) VALUES (3, 1, 5, NULL, NULL, 'rechazada', 95.00, NULL, NULL, NULL, NULL, '2026-06-05 01:14:13.746907', '2026-06-10 14:09:55.777126', '[]');
INSERT INTO public.postulaciones (postulacion_id, estudiante_id, vacante_id, supervisor_id, nro_solicitud, estado, porcentaje_afinidad, fecha_respuesta_empresa, fecha_respuesta_gestor, notas_empresa, notas_gestor, creado_en, actualizado_en, habilidades_snapshot) VALUES (4, 1, 9, NULL, NULL, 'cancelada', 74.00, NULL, NULL, NULL, NULL, '2026-06-10 15:26:50.741945', '2026-06-10 15:27:02.888355', '[]');
INSERT INTO public.postulaciones (postulacion_id, estudiante_id, vacante_id, supervisor_id, nro_solicitud, estado, porcentaje_afinidad, fecha_respuesta_empresa, fecha_respuesta_gestor, notas_empresa, notas_gestor, creado_en, actualizado_en, habilidades_snapshot) VALUES (5, 1, 16, 1, '000005', 'aprobada', 67.00, '2026-06-10 15:27:36.96058', '2026-06-10 15:49:29.719912', NULL, 'Aprobado por el gestor de PPP', '2026-06-10 15:27:15.072374', '2026-06-10 15:49:29.719912', '[]');
INSERT INTO public.postulaciones (postulacion_id, estudiante_id, vacante_id, supervisor_id, nro_solicitud, estado, porcentaje_afinidad, fecha_respuesta_empresa, fecha_respuesta_gestor, notas_empresa, notas_gestor, creado_en, actualizado_en, habilidades_snapshot) VALUES (8, 1, 4, 4, '000008', 'reprobada', 71.00, '2026-06-10 16:03:43.940834', '2026-06-10 16:05:33.058211', NULL, 'Práctica reprobada', '2026-06-10 16:03:14.023028', '2026-06-10 16:05:33.058211', '[]');
INSERT INTO public.postulaciones (postulacion_id, estudiante_id, vacante_id, supervisor_id, nro_solicitud, estado, porcentaje_afinidad, fecha_respuesta_empresa, fecha_respuesta_gestor, notas_empresa, notas_gestor, creado_en, actualizado_en, habilidades_snapshot) VALUES (9, 1, 6, 6, '000009', 'aprobada', 67.00, '2026-06-10 16:07:01.573195', '2026-06-13 10:19:25.755152', NULL, 'Práctica aprobada exitosamente', '2026-06-10 16:06:28.727634', '2026-06-13 10:19:25.755152', '[]');
INSERT INTO public.postulaciones (postulacion_id, estudiante_id, vacante_id, supervisor_id, nro_solicitud, estado, porcentaje_afinidad, fecha_respuesta_empresa, fecha_respuesta_gestor, notas_empresa, notas_gestor, creado_en, actualizado_en, habilidades_snapshot) VALUES (10, 1, 18, 2, '000010', 'cancelada', 53.00, '2026-06-13 10:26:55.118971', '2026-06-13 10:31:14.132917', NULL, 'Práctica reprobada', '2026-06-13 10:23:09.147976', '2026-06-13 10:37:33.667932', '[{"nivel": 1, "habilidad_id": 13, "habilidad_nombre": "Machine Learning", "habilidad_categoria": "IA"}, {"nivel": 1, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}]');
INSERT INTO public.postulaciones (postulacion_id, estudiante_id, vacante_id, supervisor_id, nro_solicitud, estado, porcentaje_afinidad, fecha_respuesta_empresa, fecha_respuesta_gestor, notas_empresa, notas_gestor, creado_en, actualizado_en, habilidades_snapshot) VALUES (12, 1, 18, NULL, NULL, 'cancelada', 57.00, NULL, NULL, NULL, NULL, '2026-06-13 11:08:49.684096', '2026-06-13 11:09:00.256597', '[{"nivel": 1, "habilidad_id": 13, "habilidad_nombre": "Machine Learning", "habilidad_categoria": "IA"}, {"nivel": 1, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 24, "habilidad_nombre": ".NET", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 12, "habilidad_nombre": "Adobe XD", "habilidad_categoria": "Diseno"}, {"nivel": 3, "habilidad_id": 5, "habilidad_nombre": "SQL", "habilidad_categoria": "Base de Datos"}, {"nivel": 3, "habilidad_id": 36, "habilidad_nombre": "pyhton", "habilidad_categoria": "Manual"}]');
INSERT INTO public.postulaciones (postulacion_id, estudiante_id, vacante_id, supervisor_id, nro_solicitud, estado, porcentaje_afinidad, fecha_respuesta_empresa, fecha_respuesta_gestor, notas_empresa, notas_gestor, creado_en, actualizado_en, habilidades_snapshot) VALUES (13, 1, 18, NULL, NULL, 'cancelada', 57.00, NULL, NULL, NULL, NULL, '2026-06-15 22:09:58.932823', '2026-06-15 22:10:12.217212', '[{"nivel": 1, "habilidad_id": 13, "habilidad_nombre": "Machine Learning", "habilidad_categoria": "IA"}, {"nivel": 1, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 24, "habilidad_nombre": ".NET", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 12, "habilidad_nombre": "Adobe XD", "habilidad_categoria": "Diseno"}, {"nivel": 3, "habilidad_id": 5, "habilidad_nombre": "SQL", "habilidad_categoria": "Base de Datos"}, {"nivel": 3, "habilidad_id": 36, "habilidad_nombre": "pyhton", "habilidad_categoria": "Manual"}, {"nivel": 3, "habilidad_id": 14, "habilidad_nombre": "Data Analysis", "habilidad_categoria": "Analisis"}]');
INSERT INTO public.postulaciones (postulacion_id, estudiante_id, vacante_id, supervisor_id, nro_solicitud, estado, porcentaje_afinidad, fecha_respuesta_empresa, fecha_respuesta_gestor, notas_empresa, notas_gestor, creado_en, actualizado_en, habilidades_snapshot) VALUES (14, 1, 18, NULL, NULL, 'rechazada', 57.00, NULL, NULL, NULL, NULL, '2026-06-15 22:11:19.368566', '2026-06-15 22:12:31.510664', '[{"nivel": 1, "habilidad_id": 13, "habilidad_nombre": "Machine Learning", "habilidad_categoria": "IA"}, {"nivel": 1, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 24, "habilidad_nombre": ".NET", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 12, "habilidad_nombre": "Adobe XD", "habilidad_categoria": "Diseno"}, {"nivel": 3, "habilidad_id": 5, "habilidad_nombre": "SQL", "habilidad_categoria": "Base de Datos"}, {"nivel": 3, "habilidad_id": 36, "habilidad_nombre": "pyhton", "habilidad_categoria": "Manual"}, {"nivel": 3, "habilidad_id": 14, "habilidad_nombre": "Data Analysis", "habilidad_categoria": "Analisis"}]');
INSERT INTO public.postulaciones (postulacion_id, estudiante_id, vacante_id, supervisor_id, nro_solicitud, estado, porcentaje_afinidad, fecha_respuesta_empresa, fecha_respuesta_gestor, notas_empresa, notas_gestor, creado_en, actualizado_en, habilidades_snapshot) VALUES (15, 1, 17, 1, '000015', 'aprobada', 52.00, '2026-06-15 22:14:00.132786', '2026-06-15 22:16:51.028958', NULL, 'Práctica aprobada exitosamente', '2026-06-15 22:13:15.941761', '2026-06-15 22:16:51.028958', '[{"nivel": 1, "habilidad_id": 13, "habilidad_nombre": "Machine Learning", "habilidad_categoria": "IA"}, {"nivel": 1, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 24, "habilidad_nombre": ".NET", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 12, "habilidad_nombre": "Adobe XD", "habilidad_categoria": "Diseno"}, {"nivel": 3, "habilidad_id": 5, "habilidad_nombre": "SQL", "habilidad_categoria": "Base de Datos"}, {"nivel": 3, "habilidad_id": 36, "habilidad_nombre": "pyhton", "habilidad_categoria": "Manual"}, {"nivel": 3, "habilidad_id": 14, "habilidad_nombre": "Data Analysis", "habilidad_categoria": "Analisis"}]');


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.roles (rol_id, nombre, descripcion) VALUES (1, 'estudiante', 'Estudiante de la Carrera');
INSERT INTO public.roles (rol_id, nombre, descripcion) VALUES (2, 'empresa', 'Empresa o Institución con convenio');
INSERT INTO public.roles (rol_id, nombre, descripcion) VALUES (3, 'gestor', 'Gestor de practicas preprofesionales');
INSERT INTO public.roles (rol_id, nombre, descripcion) VALUES (4, 'admin', 'Administrador tecnico del sistema');


--
-- Data for Name: supervisores; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.supervisores (supervisor_id, institucion_id, tipo_identificacion, numero_identificacion, nombre, apellido, correo, departamento, cargo, telefono, observacion, activo, creado_en, actualizado_en) VALUES (1, 1, 'Cedula', '0999999901', 'Supervisor 1', 'Apellido 1', 'sup1@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001101', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores (supervisor_id, institucion_id, tipo_identificacion, numero_identificacion, nombre, apellido, correo, departamento, cargo, telefono, observacion, activo, creado_en, actualizado_en) VALUES (2, 2, 'Cedula', '0999999902', 'Supervisor 2', 'Apellido 2', 'sup2@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001102', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores (supervisor_id, institucion_id, tipo_identificacion, numero_identificacion, nombre, apellido, correo, departamento, cargo, telefono, observacion, activo, creado_en, actualizado_en) VALUES (3, 3, 'Cedula', '0999999903', 'Supervisor 3', 'Apellido 3', 'sup3@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001103', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores (supervisor_id, institucion_id, tipo_identificacion, numero_identificacion, nombre, apellido, correo, departamento, cargo, telefono, observacion, activo, creado_en, actualizado_en) VALUES (4, 4, 'Cedula', '0999999904', 'Supervisor 4', 'Apellido 4', 'sup4@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001104', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores (supervisor_id, institucion_id, tipo_identificacion, numero_identificacion, nombre, apellido, correo, departamento, cargo, telefono, observacion, activo, creado_en, actualizado_en) VALUES (5, 5, 'Cedula', '0999999905', 'Supervisor 5', 'Apellido 5', 'sup5@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001105', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores (supervisor_id, institucion_id, tipo_identificacion, numero_identificacion, nombre, apellido, correo, departamento, cargo, telefono, observacion, activo, creado_en, actualizado_en) VALUES (6, 6, 'Cedula', '0999999906', 'Supervisor 6', 'Apellido 6', 'sup6@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001106', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores (supervisor_id, institucion_id, tipo_identificacion, numero_identificacion, nombre, apellido, correo, departamento, cargo, telefono, observacion, activo, creado_en, actualizado_en) VALUES (7, 7, 'Cedula', '0999999907', 'Supervisor 7', 'Apellido 7', 'sup7@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001107', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores (supervisor_id, institucion_id, tipo_identificacion, numero_identificacion, nombre, apellido, correo, departamento, cargo, telefono, observacion, activo, creado_en, actualizado_en) VALUES (8, 8, 'Cedula', '0999999908', 'Supervisor 8', 'Apellido 8', 'sup8@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001108', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores (supervisor_id, institucion_id, tipo_identificacion, numero_identificacion, nombre, apellido, correo, departamento, cargo, telefono, observacion, activo, creado_en, actualizado_en) VALUES (9, 9, 'Cedula', '0999999909', 'Supervisor 9', 'Apellido 9', 'sup9@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001109', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores (supervisor_id, institucion_id, tipo_identificacion, numero_identificacion, nombre, apellido, correo, departamento, cargo, telefono, observacion, activo, creado_en, actualizado_en) VALUES (10, 10, 'Cedula', '0999999910', 'Supervisor 10', 'Apellido 10', 'sup10@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001110', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores (supervisor_id, institucion_id, tipo_identificacion, numero_identificacion, nombre, apellido, correo, departamento, cargo, telefono, observacion, activo, creado_en, actualizado_en) VALUES (11, 11, 'Cedula', '0999999911', 'Supervisor 11', 'Apellido 11', 'sup11@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001111', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores (supervisor_id, institucion_id, tipo_identificacion, numero_identificacion, nombre, apellido, correo, departamento, cargo, telefono, observacion, activo, creado_en, actualizado_en) VALUES (12, 12, 'Cedula', '0999999912', 'Supervisor 12', 'Apellido 12', 'sup12@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001112', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores (supervisor_id, institucion_id, tipo_identificacion, numero_identificacion, nombre, apellido, correo, departamento, cargo, telefono, observacion, activo, creado_en, actualizado_en) VALUES (13, 13, 'Cedula', '0999999913', 'Supervisor 13', 'Apellido 13', 'sup13@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001113', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores (supervisor_id, institucion_id, tipo_identificacion, numero_identificacion, nombre, apellido, correo, departamento, cargo, telefono, observacion, activo, creado_en, actualizado_en) VALUES (14, 14, 'Cedula', '0999999914', 'Supervisor 14', 'Apellido 14', 'sup14@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001114', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores (supervisor_id, institucion_id, tipo_identificacion, numero_identificacion, nombre, apellido, correo, departamento, cargo, telefono, observacion, activo, creado_en, actualizado_en) VALUES (15, 15, 'Cedula', '0999999915', 'Supervisor 15', 'Apellido 15', 'sup15@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001115', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores (supervisor_id, institucion_id, tipo_identificacion, numero_identificacion, nombre, apellido, correo, departamento, cargo, telefono, observacion, activo, creado_en, actualizado_en) VALUES (16, 1, 'Cedula', '33123123', 'juan', 'acasyt', 'dasdasdasd', 'asdasdasd', 'asdasa', '34535345', NULL, false, '2026-06-10 14:58:25.562893', '2026-06-10 14:58:25.562893');


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (1, '0900000001', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Admin', 'Sistema', 'admin@ug.edu.ec', '0999000000', 4, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (3, '0900000003', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Carlos Eduardo', 'Ruiz', 'carlos.ruiz@ug.edu.ec', '0997777772', 3, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (4, '0900000004', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Luisa', 'Méndez', 'luisa.mendez@ug.edu.ec', '0997777773', 3, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (7, '1312657255', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Jorge David', 'Intriago Loor', 'jorge.intriagoloo@ug.edu.ec', '09900007', 1, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (8, '0911223344', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Maria Fernanda', 'Gómez Silva', 'maria.gomez@ug.edu.ec', '09900008', 1, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (9, '0922334455', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Luis Antonio', 'Pérez Castro', 'luis.perez@ug.edu.ec', '09900009', 1, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (10, '0933445566', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Ana Sofía', 'Martínez Vera', 'ana.martinez@ug.edu.ec', '099000010', 1, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (12, '0955667788', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Gabriela Elena', 'Vera Loor', 'gabriela.vera@ug.edu.ec', '099000012', 1, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (13, '0966778899', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Carlos Alberto', 'Mora Sánchez', 'carlos.mora@ug.edu.ec', '099000013', 1, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (14, '0977889900', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Diana Carolina', 'Silva Torres', 'diana.silva@ug.edu.ec', '099000014', 1, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (16, '0990161100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Pedro', 'Sanchez', 'contacto@innovasoft.com', '099000016', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (18, '0990181100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Carla', 'Ruiz', 'rrhh@clouddevs.com', '099000018', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (19, '0990191100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Jorge', 'Moreno', 'rrhh@appworks.com', '099000019', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (20, '0990201100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Elena', 'Vargas', 'rrhh@fintechsolutions.com', '099000020', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (21, '0990211100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Andres', 'Rojas', 'rrhh@cybersecurityec.com', '099000021', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (22, '0990221100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Sofia', 'Mendoza', 'rrhh@smartcode.com', '099000022', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (23, '0990231100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Mario', 'Castro', 'rrhh@nexustech.com', '099000023', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (24, '0990241100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Laura', 'Guzman', 'rrhh@devmasters.com', '099000024', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (25, '0990251100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Roberto', 'Luna', 'rrhh@datamindgye.com', '099000025', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (26, '0990261100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Valeria', 'Pinto', 'contacto@aivision.com', '099000026', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (27, '0990271100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Jose', 'Mieles', 'rrhh@metricasec.com', '099000027', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (28, '0990281100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Carmen', 'Salas', 'rrhh@induproduccion.com', '099000028', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (5, '0955236773', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Bryan Guillermo', 'Galarza Indacochea', 'bryan.galarzaind@ug.edu.ec', '09900005', 1, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-15 21:48:03.853116');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (11, '0944556677', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Pedro José', 'Castro Mendoza', 'pedro.castro@ug.edu.ec', '099000011', 1, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (6, '0942646266', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Naldo Jonnel', 'Anchundia Caicedo', 'naldoanchundia@ug.edu.ec', '0990020956', 1, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-05 14:16:34.640941');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (2, '0900000002', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Juan', 'Perez', 'juan@ug.edu.ec', '099000012', 3, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-05 14:14:45.722394');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (17, '0990171100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Luis', 'Fernandez', 'rrhh@globalsystems.com', '099000017', 2, NULL, false, '2026-06-03 23:07:05.812737', '2026-06-10 15:05:03.263801');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (15, '0990151100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Ana', 'Garcia', 'rrhh@techsolutionsgye.com', '099000015', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (29, '0990291100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Victor', 'Lino', 'contacto@logisticaavanzada.com', '099000029', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios (usuario_id, cedula, contrasena, nombre, apellido, correo, telefono, rol_id, foto_perfil, activo, creado_en, actualizado_en) VALUES (30, '0987654321', '$2b$12$6Q6bNdqTZKKXjxPXVgX6z.pUShdd/pHnaRyr.RcInMZJaNbgHVWta', 'Jonnel', 'Anchundia', 'jonnel@ug.edu.ec', '0990020956', 4, NULL, true, '2026-06-10 14:55:59.779641', '2026-06-10 14:55:59.779641');


--
-- Data for Name: vacantes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.vacantes (vacante_id, institucion_id, supervisor_id, titulo, area, descripcion, requisitos, modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, activo, fecha_expiracion, creado_en, actualizado_en) VALUES (1, 1, 1, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes (vacante_id, institucion_id, supervisor_id, titulo, area, descripcion, requisitos, modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, activo, fecha_expiracion, creado_en, actualizado_en) VALUES (2, 2, 2, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes (vacante_id, institucion_id, supervisor_id, titulo, area, descripcion, requisitos, modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, activo, fecha_expiracion, creado_en, actualizado_en) VALUES (3, 3, 3, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes (vacante_id, institucion_id, supervisor_id, titulo, area, descripcion, requisitos, modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, activo, fecha_expiracion, creado_en, actualizado_en) VALUES (4, 4, 4, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes (vacante_id, institucion_id, supervisor_id, titulo, area, descripcion, requisitos, modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, activo, fecha_expiracion, creado_en, actualizado_en) VALUES (6, 6, 6, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes (vacante_id, institucion_id, supervisor_id, titulo, area, descripcion, requisitos, modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, activo, fecha_expiracion, creado_en, actualizado_en) VALUES (7, 7, 7, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes (vacante_id, institucion_id, supervisor_id, titulo, area, descripcion, requisitos, modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, activo, fecha_expiracion, creado_en, actualizado_en) VALUES (8, 8, 8, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes (vacante_id, institucion_id, supervisor_id, titulo, area, descripcion, requisitos, modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, activo, fecha_expiracion, creado_en, actualizado_en) VALUES (9, 9, 9, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes (vacante_id, institucion_id, supervisor_id, titulo, area, descripcion, requisitos, modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, activo, fecha_expiracion, creado_en, actualizado_en) VALUES (10, 10, 10, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes (vacante_id, institucion_id, supervisor_id, titulo, area, descripcion, requisitos, modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, activo, fecha_expiracion, creado_en, actualizado_en) VALUES (11, 11, 11, 'Analista de Datos Junior', 'Data', 'Únete a nuestro equipo de análisis. Participarás en la limpieza, transformación y visualización de datos para la toma de decisiones estratégicas.', '- Conocimientos en Python (Pandas, Numpy).
- Entendimiento de estadística descriptiva.
- Manejo básico de herramientas de BI.', 'Remoto', 'Guayaquil', 240, 6, '09:00 a 15:00', 1, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes (vacante_id, institucion_id, supervisor_id, titulo, area, descripcion, requisitos, modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, activo, fecha_expiracion, creado_en, actualizado_en) VALUES (12, 12, 12, 'Analista de Datos Junior', 'Data', 'Únete a nuestro equipo de análisis. Participarás en la limpieza, transformación y visualización de datos para la toma de decisiones estratégicas.', '- Conocimientos en Python (Pandas, Numpy).
- Entendimiento de estadística descriptiva.
- Manejo básico de herramientas de BI.', 'Remoto', 'Guayaquil', 240, 6, '09:00 a 15:00', 1, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes (vacante_id, institucion_id, supervisor_id, titulo, area, descripcion, requisitos, modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, activo, fecha_expiracion, creado_en, actualizado_en) VALUES (13, 13, 13, 'Analista de Datos Junior', 'Data', 'Únete a nuestro equipo de análisis. Participarás en la limpieza, transformación y visualización de datos para la toma de decisiones estratégicas.', '- Conocimientos en Python (Pandas, Numpy).
- Entendimiento de estadística descriptiva.
- Manejo básico de herramientas de BI.', 'Remoto', 'Guayaquil', 240, 6, '09:00 a 15:00', 1, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes (vacante_id, institucion_id, supervisor_id, titulo, area, descripcion, requisitos, modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, activo, fecha_expiracion, creado_en, actualizado_en) VALUES (14, 14, 14, 'Pasante de Optimización de Procesos', 'Producción', 'Buscamos talento para nuestra área de mejora continua. Colaborarás en la identificación de cuellos de botella y aplicación de metodologías Lean.', '- Estudiante de últimos semestres de Ing. en Producción.
- Conocimientos teóricos de Lean Manufacturing.
- Manejo de Excel avanzado.
- Proactividad.', 'Presencial', 'Durán', 240, 6, '07:00 a 13:00', 2, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes (vacante_id, institucion_id, supervisor_id, titulo, area, descripcion, requisitos, modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, activo, fecha_expiracion, creado_en, actualizado_en) VALUES (15, 15, 15, 'Pasante de Optimización de Procesos', 'Producción', 'Buscamos talento para nuestra área de mejora continua. Colaborarás en la identificación de cuellos de botella y aplicación de metodologías Lean.', '- Estudiante de últimos semestres de Ing. en Producción.
- Conocimientos teóricos de Lean Manufacturing.
- Manejo de Excel avanzado.
- Proactividad.', 'Presencial', 'Durán', 240, 6, '07:00 a 13:00', 2, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes (vacante_id, institucion_id, supervisor_id, titulo, area, descripcion, requisitos, modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, activo, fecha_expiracion, creado_en, actualizado_en) VALUES (5, 5, 5, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, false, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes (vacante_id, institucion_id, supervisor_id, titulo, area, descripcion, requisitos, modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, activo, fecha_expiracion, creado_en, actualizado_en) VALUES (16, 1, 1, 'ffsdddddddddd', 'Redes y Telecomunicaciones', 'sfddddddddddddddddfsssssssssssssssssssssssssssssss', 'fdssssssssssssssssssssssss', 'Presencial', 'Guayaquil', 144, 6, 'Lunes a Viernes', 4, false, '2026-07-03', '2026-06-04 18:36:44.039418', '2026-06-12 00:11:28.869286');
INSERT INTO public.vacantes (vacante_id, institucion_id, supervisor_id, titulo, area, descripcion, requisitos, modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, activo, fecha_expiracion, creado_en, actualizado_en) VALUES (18, 2, 16, 'Data Scientist / Ingeniero Machine Learning', 'Tecnología', 'Buscamos un apasionado por la ciencia de datos y el machine learning con experiencia comprobable construyendo modelos predictivos y analizando grandes volúmenes de datos. Se requiere alta capacidad analítica para optimizar procesos.', 'Indispensable manejo avanzado de Inteligencia Artificial, Modelos Predictivos, Data Science, Python, Pandas y Scikit-Learn.', 'Remoto', 'Guayaquil', 240, 8, 'Matutino', 2, true, NULL, '2026-06-11 23:51:57.854018', '2026-06-11 23:51:57.854018');
INSERT INTO public.vacantes (vacante_id, institucion_id, supervisor_id, titulo, area, descripcion, requisitos, modalidad, ubicacion, total_horas, horas_diarias, horario, cupos, activo, fecha_expiracion, creado_en, actualizado_en) VALUES (17, 1, 1, 'Análisis de Datos y Desarrollo Web', 'sistemas', 'Buscamos un estudiante de Ingeniería en Software o carreras afines para apoyar en el análisis de datos y el desarrollo de soluciones web internas. El practicante participará en la limpieza y procesamiento de datos, generación de reportes, automatización de tareas mediante scripts y apoyo en el desarrollo de módulos web utilizando tecnologías frontend y backend. Tendrá la oportunidad de trabajar con datos reales y colaborar con equipos multidisciplinarios en proyectos tecnológicos.', 'Requisitos en texto
Estudiante de Ingeniería en Software, Sistemas o carreras afines (5to semestre en adelante).
Conocimientos de Python para análisis y procesamiento de datos.
Manejo básico de Pandas y NumPy.
Conocimientos de estadística descriptiva.
Conocimientos de JavaScript para desarrollo web.
Capacidad para interpretar y visualizar información.
Conocimientos básicos de bases de datos relacionales.
Habilidades de comunicación y trabajo en equipo.
Deseable experiencia académica en proyectos de análisis de datos o desarrollo web.', 'Remoto', 'Guayaquil', 144, 6, 'Lunes a Viernes', 4, true, '2026-06-28', '2026-06-11 23:02:24.150012', '2026-06-15 21:51:20.663159');


--
-- Name: cache_afinidad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cache_afinidad_id_seq', 291, true);


--
-- Name: carreras_carrera_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carreras_carrera_id_seq', 3, true);


--
-- Name: facultades_facultad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.facultades_facultad_id_seq', 2, true);


--
-- Name: habilidades_estudiante_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.habilidades_estudiante_id_seq', 140, true);


--
-- Name: habilidades_habilidad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.habilidades_habilidad_id_seq', 39, true);


--
-- Name: habilidades_vacante_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.habilidades_vacante_id_seq', 59, true);


--
-- Name: instituciones_institucion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.instituciones_institucion_id_seq', 15, true);


--
-- Name: perfiles_estudiante_perfil_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.perfiles_estudiante_perfil_id_seq', 10, true);


--
-- Name: perfiles_gestor_perfil_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.perfiles_gestor_perfil_id_seq', 3, true);


--
-- Name: postulaciones_postulacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.postulaciones_postulacion_id_seq', 15, true);


--
-- Name: roles_rol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_rol_id_seq', 4, true);


--
-- Name: supervisores_supervisor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.supervisores_supervisor_id_seq', 16, true);


--
-- Name: usuarios_usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_usuario_id_seq', 30, true);


--
-- Name: vacantes_vacante_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vacantes_vacante_id_seq', 18, true);


--
-- Name: cache_afinidad cache_afinidad_estudiante_id_vacante_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cache_afinidad
    ADD CONSTRAINT cache_afinidad_estudiante_id_vacante_id_key UNIQUE (estudiante_id, vacante_id);


--
-- Name: cache_afinidad cache_afinidad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cache_afinidad
    ADD CONSTRAINT cache_afinidad_pkey PRIMARY KEY (id);


--
-- Name: carreras carreras_facultad_id_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_facultad_id_nombre_key UNIQUE (facultad_id, nombre);


--
-- Name: carreras carreras_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_pkey PRIMARY KEY (carrera_id);


--
-- Name: facultades facultades_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facultades
    ADD CONSTRAINT facultades_nombre_key UNIQUE (nombre);


--
-- Name: facultades facultades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facultades
    ADD CONSTRAINT facultades_pkey PRIMARY KEY (facultad_id);


--
-- Name: habilidades_estudiante habilidades_estudiante_estudiante_id_habilidad_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades_estudiante
    ADD CONSTRAINT habilidades_estudiante_estudiante_id_habilidad_id_key UNIQUE (estudiante_id, habilidad_id);


--
-- Name: habilidades_estudiante habilidades_estudiante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades_estudiante
    ADD CONSTRAINT habilidades_estudiante_pkey PRIMARY KEY (id);


--
-- Name: habilidades habilidades_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades
    ADD CONSTRAINT habilidades_nombre_key UNIQUE (nombre);


--
-- Name: habilidades habilidades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades
    ADD CONSTRAINT habilidades_pkey PRIMARY KEY (habilidad_id);


--
-- Name: habilidades_vacante habilidades_vacante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades_vacante
    ADD CONSTRAINT habilidades_vacante_pkey PRIMARY KEY (id);


--
-- Name: habilidades_vacante habilidades_vacante_vacante_id_habilidad_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades_vacante
    ADD CONSTRAINT habilidades_vacante_vacante_id_habilidad_id_key UNIQUE (vacante_id, habilidad_id);


--
-- Name: instituciones instituciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instituciones
    ADD CONSTRAINT instituciones_pkey PRIMARY KEY (institucion_id);


--
-- Name: instituciones instituciones_ruc_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instituciones
    ADD CONSTRAINT instituciones_ruc_key UNIQUE (ruc);


--
-- Name: perfiles_estudiante perfiles_estudiante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_estudiante
    ADD CONSTRAINT perfiles_estudiante_pkey PRIMARY KEY (perfil_id);


--
-- Name: perfiles_estudiante perfiles_estudiante_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_estudiante
    ADD CONSTRAINT perfiles_estudiante_usuario_id_key UNIQUE (usuario_id);


--
-- Name: perfiles_gestor perfiles_gestor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_gestor
    ADD CONSTRAINT perfiles_gestor_pkey PRIMARY KEY (perfil_id);


--
-- Name: perfiles_gestor perfiles_gestor_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_gestor
    ADD CONSTRAINT perfiles_gestor_usuario_id_key UNIQUE (usuario_id);


--
-- Name: postulaciones postulaciones_nro_solicitud_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_nro_solicitud_key UNIQUE (nro_solicitud);


--
-- Name: postulaciones postulaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_pkey PRIMARY KEY (postulacion_id);


--
-- Name: roles roles_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key UNIQUE (nombre);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (rol_id);


--
-- Name: supervisores supervisores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supervisores
    ADD CONSTRAINT supervisores_pkey PRIMARY KEY (supervisor_id);


--
-- Name: usuarios usuarios_cedula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_cedula_key UNIQUE (cedula);


--
-- Name: usuarios usuarios_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_key UNIQUE (correo);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (usuario_id);


--
-- Name: vacantes vacantes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacantes
    ADD CONSTRAINT vacantes_pkey PRIMARY KEY (vacante_id);


--
-- Name: idx_cache_afinidad_estudiante; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cache_afinidad_estudiante ON public.cache_afinidad USING btree (estudiante_id);


--
-- Name: idx_cache_afinidad_vacante; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cache_afinidad_vacante ON public.cache_afinidad USING btree (vacante_id);


--
-- Name: idx_instituciones_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_instituciones_estado ON public.instituciones USING btree (estado);


--
-- Name: idx_instituciones_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_instituciones_usuario ON public.instituciones USING btree (usuario_id);


--
-- Name: idx_perfiles_carrera; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_perfiles_carrera ON public.perfiles_estudiante USING btree (carrera_id);


--
-- Name: idx_perfiles_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_perfiles_usuario ON public.perfiles_estudiante USING btree (usuario_id);


--
-- Name: idx_postulaciones_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_postulaciones_estado ON public.postulaciones USING btree (estado);


--
-- Name: idx_postulaciones_estudiante; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_postulaciones_estudiante ON public.postulaciones USING btree (estudiante_id);


--
-- Name: idx_postulaciones_vacante; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_postulaciones_vacante ON public.postulaciones USING btree (vacante_id);


--
-- Name: idx_supervisores_institucion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supervisores_institucion ON public.supervisores USING btree (institucion_id);


--
-- Name: idx_usuarios_cedula; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_cedula ON public.usuarios USING btree (cedula);


--
-- Name: idx_usuarios_correo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_correo ON public.usuarios USING btree (correo);


--
-- Name: idx_usuarios_rol; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_rol ON public.usuarios USING btree (rol_id);


--
-- Name: idx_vacantes_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vacantes_activo ON public.vacantes USING btree (activo);


--
-- Name: idx_vacantes_institucion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vacantes_institucion ON public.vacantes USING btree (institucion_id);


--
-- Name: cache_afinidad cache_afinidad_estudiante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cache_afinidad
    ADD CONSTRAINT cache_afinidad_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.perfiles_estudiante(perfil_id) ON DELETE CASCADE;


--
-- Name: cache_afinidad cache_afinidad_vacante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cache_afinidad
    ADD CONSTRAINT cache_afinidad_vacante_id_fkey FOREIGN KEY (vacante_id) REFERENCES public.vacantes(vacante_id) ON DELETE CASCADE;


--
-- Name: carreras carreras_facultad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_facultad_id_fkey FOREIGN KEY (facultad_id) REFERENCES public.facultades(facultad_id);


--
-- Name: habilidades_estudiante habilidades_estudiante_estudiante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades_estudiante
    ADD CONSTRAINT habilidades_estudiante_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.perfiles_estudiante(perfil_id) ON DELETE CASCADE;


--
-- Name: habilidades_estudiante habilidades_estudiante_habilidad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades_estudiante
    ADD CONSTRAINT habilidades_estudiante_habilidad_id_fkey FOREIGN KEY (habilidad_id) REFERENCES public.habilidades(habilidad_id) ON DELETE CASCADE;


--
-- Name: habilidades_vacante habilidades_vacante_habilidad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades_vacante
    ADD CONSTRAINT habilidades_vacante_habilidad_id_fkey FOREIGN KEY (habilidad_id) REFERENCES public.habilidades(habilidad_id) ON DELETE CASCADE;


--
-- Name: habilidades_vacante habilidades_vacante_vacante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades_vacante
    ADD CONSTRAINT habilidades_vacante_vacante_id_fkey FOREIGN KEY (vacante_id) REFERENCES public.vacantes(vacante_id) ON DELETE CASCADE;


--
-- Name: instituciones instituciones_facultad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instituciones
    ADD CONSTRAINT instituciones_facultad_id_fkey FOREIGN KEY (facultad_id) REFERENCES public.facultades(facultad_id);


--
-- Name: instituciones instituciones_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instituciones
    ADD CONSTRAINT instituciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- Name: perfiles_estudiante perfiles_estudiante_carrera_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_estudiante
    ADD CONSTRAINT perfiles_estudiante_carrera_id_fkey FOREIGN KEY (carrera_id) REFERENCES public.carreras(carrera_id);


--
-- Name: perfiles_estudiante perfiles_estudiante_facultad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_estudiante
    ADD CONSTRAINT perfiles_estudiante_facultad_id_fkey FOREIGN KEY (facultad_id) REFERENCES public.facultades(facultad_id);


--
-- Name: perfiles_estudiante perfiles_estudiante_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_estudiante
    ADD CONSTRAINT perfiles_estudiante_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


--
-- Name: perfiles_gestor perfiles_gestor_carrera_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_gestor
    ADD CONSTRAINT perfiles_gestor_carrera_id_fkey FOREIGN KEY (carrera_id) REFERENCES public.carreras(carrera_id);


--
-- Name: perfiles_gestor perfiles_gestor_facultad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_gestor
    ADD CONSTRAINT perfiles_gestor_facultad_id_fkey FOREIGN KEY (facultad_id) REFERENCES public.facultades(facultad_id);


--
-- Name: perfiles_gestor perfiles_gestor_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_gestor
    ADD CONSTRAINT perfiles_gestor_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


--
-- Name: postulaciones postulaciones_estudiante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.perfiles_estudiante(perfil_id) ON DELETE CASCADE;


--
-- Name: postulaciones postulaciones_supervisor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_supervisor_id_fkey FOREIGN KEY (supervisor_id) REFERENCES public.supervisores(supervisor_id);


--
-- Name: postulaciones postulaciones_vacante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_vacante_id_fkey FOREIGN KEY (vacante_id) REFERENCES public.vacantes(vacante_id) ON DELETE CASCADE;


--
-- Name: supervisores supervisores_institucion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supervisores
    ADD CONSTRAINT supervisores_institucion_id_fkey FOREIGN KEY (institucion_id) REFERENCES public.instituciones(institucion_id) ON DELETE CASCADE;


--
-- Name: usuarios usuarios_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(rol_id);


--
-- Name: vacantes vacantes_institucion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacantes
    ADD CONSTRAINT vacantes_institucion_id_fkey FOREIGN KEY (institucion_id) REFERENCES public.instituciones(institucion_id) ON DELETE CASCADE;


--
-- Name: vacantes vacantes_supervisor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacantes
    ADD CONSTRAINT vacantes_supervisor_id_fkey FOREIGN KEY (supervisor_id) REFERENCES public.supervisores(supervisor_id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--


