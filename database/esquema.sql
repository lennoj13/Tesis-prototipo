--
-- PostgreSQL database dump
--

-- \restrict NDHOKidFhWU1ImPCHkBnHmhfsM8jA8WdKLq6KwUsFM7dRRjYvDjvygbHSH9O4B0

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-07-21 14:23:51

-- SET statement_timeout = 0;
-- SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
-- SET transaction_timeout = 0;
-- SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies = false;
-- SET xmloption = content;
-- SET client_min_messages = warning;
-- SET row_security = off;
-- SET default_tablespace = '';
-- SET default_table_access_method = heap;

--
-- TOC entry 246 (class 1259 OID 24847)
-- Name: cache_afinidad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cache_afinidad (
    id integer NOT NULL,
    estudiante_id integer NOT NULL,
    vacante_id integer NOT NULL,
    porcentaje_afinidad numeric(5,2) NOT NULL,
    calculado_en timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cache_afinidad OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 24846)
-- Name: cache_afinidad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cache_afinidad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cache_afinidad_id_seq OWNER TO postgres;

--
-- TOC entry 5213 (class 0 OID 0)
-- Dependencies: 245
-- Name: cache_afinidad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cache_afinidad_id_seq OWNED BY public.cache_afinidad.id;


--
-- TOC entry 226 (class 1259 OID 24354)
-- Name: carreras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carreras (
    carrera_id integer NOT NULL,
    facultad_id integer NOT NULL,
    nombre character varying(200) NOT NULL,
    codigo character varying(20),
    activo boolean DEFAULT true
);


ALTER TABLE public.carreras OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24353)
-- Name: carreras_carrera_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carreras_carrera_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carreras_carrera_id_seq OWNER TO postgres;

--
-- TOC entry 5214 (class 0 OID 0)
-- Dependencies: 225
-- Name: carreras_carrera_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carreras_carrera_id_seq OWNED BY public.carreras.carrera_id;


--
-- TOC entry 224 (class 1259 OID 24342)
-- Name: facultades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.facultades (
    facultad_id integer NOT NULL,
    nombre character varying(200) NOT NULL,
    activo boolean DEFAULT true
);


ALTER TABLE public.facultades OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24341)
-- Name: facultades_facultad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.facultades_facultad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.facultades_facultad_id_seq OWNER TO postgres;

--
-- TOC entry 5215 (class 0 OID 0)
-- Dependencies: 223
-- Name: facultades_facultad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.facultades_facultad_id_seq OWNED BY public.facultades.facultad_id;


--
-- TOC entry 236 (class 1259 OID 24481)
-- Name: habilidades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.habilidades (
    habilidad_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    categoria character varying(50)
);


ALTER TABLE public.habilidades OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 24492)
-- Name: habilidades_estudiante; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.habilidades_estudiante (
    id integer NOT NULL,
    estudiante_id integer NOT NULL,
    habilidad_id integer NOT NULL,
    nivel integer DEFAULT 1,
    CONSTRAINT habilidades_estudiante_nivel_check CHECK (((nivel >= 1) AND (nivel <= 5)))
);


ALTER TABLE public.habilidades_estudiante OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 24491)
-- Name: habilidades_estudiante_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.habilidades_estudiante_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.habilidades_estudiante_id_seq OWNER TO postgres;

--
-- TOC entry 5216 (class 0 OID 0)
-- Dependencies: 237
-- Name: habilidades_estudiante_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.habilidades_estudiante_id_seq OWNED BY public.habilidades_estudiante.id;


--
-- TOC entry 235 (class 1259 OID 24480)
-- Name: habilidades_habilidad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.habilidades_habilidad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.habilidades_habilidad_id_seq OWNER TO postgres;

--
-- TOC entry 5217 (class 0 OID 0)
-- Dependencies: 235
-- Name: habilidades_habilidad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.habilidades_habilidad_id_seq OWNED BY public.habilidades.habilidad_id;


--
-- TOC entry 242 (class 1259 OID 24543)
-- Name: habilidades_vacante; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.habilidades_vacante (
    id integer NOT NULL,
    vacante_id integer NOT NULL,
    habilidad_id integer NOT NULL,
    nivel_requerido integer DEFAULT 1,
    es_opcional boolean DEFAULT false
);


ALTER TABLE public.habilidades_vacante OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 24542)
-- Name: habilidades_vacante_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.habilidades_vacante_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.habilidades_vacante_id_seq OWNER TO postgres;

--
-- TOC entry 5218 (class 0 OID 0)
-- Dependencies: 241
-- Name: habilidades_vacante_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.habilidades_vacante_id_seq OWNED BY public.habilidades_vacante.id;


--
-- TOC entry 232 (class 1259 OID 24431)
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


ALTER TABLE public.instituciones OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 24430)
-- Name: instituciones_institucion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.instituciones_institucion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.instituciones_institucion_id_seq OWNER TO postgres;

--
-- TOC entry 5219 (class 0 OID 0)
-- Dependencies: 231
-- Name: instituciones_institucion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.instituciones_institucion_id_seq OWNED BY public.instituciones.institucion_id;


--
-- TOC entry 228 (class 1259 OID 24372)
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
    actualizado_en timestamp without time zone DEFAULT now(),
    calculando_nlp boolean DEFAULT false
);


ALTER TABLE public.perfiles_estudiante OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 24371)
-- Name: perfiles_estudiante_perfil_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.perfiles_estudiante_perfil_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.perfiles_estudiante_perfil_id_seq OWNER TO postgres;

--
-- TOC entry 5220 (class 0 OID 0)
-- Dependencies: 227
-- Name: perfiles_estudiante_perfil_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.perfiles_estudiante_perfil_id_seq OWNED BY public.perfiles_estudiante.perfil_id;


--
-- TOC entry 230 (class 1259 OID 24403)
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


ALTER TABLE public.perfiles_gestor OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 24402)
-- Name: perfiles_gestor_perfil_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.perfiles_gestor_perfil_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.perfiles_gestor_perfil_id_seq OWNER TO postgres;

--
-- TOC entry 5221 (class 0 OID 0)
-- Dependencies: 229
-- Name: perfiles_gestor_perfil_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.perfiles_gestor_perfil_id_seq OWNED BY public.perfiles_gestor.perfil_id;


--
-- TOC entry 244 (class 1259 OID 24567)
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
    habilidades_snapshot jsonb DEFAULT '[]'::jsonb,
    fecha_entrevista date,
    hora_entrevista time without time zone,
    modalidad_entrevista character varying(20),
    direccion_entrevista character varying(300),
    link_reunion character varying(500)
);


ALTER TABLE public.postulaciones OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 24566)
-- Name: postulaciones_postulacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.postulaciones_postulacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.postulaciones_postulacion_id_seq OWNER TO postgres;

--
-- TOC entry 5222 (class 0 OID 0)
-- Dependencies: 243
-- Name: postulaciones_postulacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.postulaciones_postulacion_id_seq OWNED BY public.postulaciones.postulacion_id;


--
-- TOC entry 220 (class 1259 OID 24304)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    rol_id integer NOT NULL,
    nombre character varying(20) NOT NULL,
    descripcion character varying(200)
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24303)
-- Name: roles_rol_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_rol_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_rol_id_seq OWNER TO postgres;

--
-- TOC entry 5223 (class 0 OID 0)
-- Dependencies: 219
-- Name: roles_rol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_rol_id_seq OWNED BY public.roles.rol_id;


--
-- TOC entry 234 (class 1259 OID 24459)
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


ALTER TABLE public.supervisores OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 24458)
-- Name: supervisores_supervisor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.supervisores_supervisor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.supervisores_supervisor_id_seq OWNER TO postgres;

--
-- TOC entry 5224 (class 0 OID 0)
-- Dependencies: 233
-- Name: supervisores_supervisor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.supervisores_supervisor_id_seq OWNED BY public.supervisores.supervisor_id;


--
-- TOC entry 222 (class 1259 OID 24315)
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


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24314)
-- Name: usuarios_usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_usuario_id_seq OWNER TO postgres;

--
-- TOC entry 5225 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuarios_usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_usuario_id_seq OWNED BY public.usuarios.usuario_id;


--
-- TOC entry 240 (class 1259 OID 24516)
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


ALTER TABLE public.vacantes OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 24515)
-- Name: vacantes_vacante_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vacantes_vacante_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vacantes_vacante_id_seq OWNER TO postgres;

--
-- TOC entry 5226 (class 0 OID 0)
-- Dependencies: 239
-- Name: vacantes_vacante_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vacantes_vacante_id_seq OWNED BY public.vacantes.vacante_id;


--
-- TOC entry 4967 (class 2604 OID 24850)
-- Name: cache_afinidad id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cache_afinidad ALTER COLUMN id SET DEFAULT nextval('public.cache_afinidad_id_seq'::regclass);


--
-- TOC entry 4928 (class 2604 OID 24357)
-- Name: carreras carrera_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carreras ALTER COLUMN carrera_id SET DEFAULT nextval('public.carreras_carrera_id_seq'::regclass);


--
-- TOC entry 4926 (class 2604 OID 24345)
-- Name: facultades facultad_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facultades ALTER COLUMN facultad_id SET DEFAULT nextval('public.facultades_facultad_id_seq'::regclass);


--
-- TOC entry 4949 (class 2604 OID 24484)
-- Name: habilidades habilidad_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades ALTER COLUMN habilidad_id SET DEFAULT nextval('public.habilidades_habilidad_id_seq'::regclass);


--
-- TOC entry 4950 (class 2604 OID 24495)
-- Name: habilidades_estudiante id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades_estudiante ALTER COLUMN id SET DEFAULT nextval('public.habilidades_estudiante_id_seq'::regclass);


--
-- TOC entry 4958 (class 2604 OID 24546)
-- Name: habilidades_vacante id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades_vacante ALTER COLUMN id SET DEFAULT nextval('public.habilidades_vacante_id_seq'::regclass);


--
-- TOC entry 4938 (class 2604 OID 24434)
-- Name: instituciones institucion_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instituciones ALTER COLUMN institucion_id SET DEFAULT nextval('public.instituciones_institucion_id_seq'::regclass);


--
-- TOC entry 4930 (class 2604 OID 24375)
-- Name: perfiles_estudiante perfil_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_estudiante ALTER COLUMN perfil_id SET DEFAULT nextval('public.perfiles_estudiante_perfil_id_seq'::regclass);


--
-- TOC entry 4935 (class 2604 OID 24406)
-- Name: perfiles_gestor perfil_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_gestor ALTER COLUMN perfil_id SET DEFAULT nextval('public.perfiles_gestor_perfil_id_seq'::regclass);


--
-- TOC entry 4961 (class 2604 OID 24570)
-- Name: postulaciones postulacion_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones ALTER COLUMN postulacion_id SET DEFAULT nextval('public.postulaciones_postulacion_id_seq'::regclass);


--
-- TOC entry 4921 (class 2604 OID 24307)
-- Name: roles rol_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN rol_id SET DEFAULT nextval('public.roles_rol_id_seq'::regclass);


--
-- TOC entry 4944 (class 2604 OID 24462)
-- Name: supervisores supervisor_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supervisores ALTER COLUMN supervisor_id SET DEFAULT nextval('public.supervisores_supervisor_id_seq'::regclass);


--
-- TOC entry 4922 (class 2604 OID 24318)
-- Name: usuarios usuario_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN usuario_id SET DEFAULT nextval('public.usuarios_usuario_id_seq'::regclass);


--
-- TOC entry 4952 (class 2604 OID 24519)
-- Name: vacantes vacante_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacantes ALTER COLUMN vacante_id SET DEFAULT nextval('public.vacantes_vacante_id_seq'::regclass);


--
-- TOC entry 5034 (class 2606 OID 24859)
-- Name: cache_afinidad cache_afinidad_estudiante_id_vacante_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cache_afinidad
    ADD CONSTRAINT cache_afinidad_estudiante_id_vacante_id_key UNIQUE (estudiante_id, vacante_id);


--
-- TOC entry 5036 (class 2606 OID 24857)
-- Name: cache_afinidad cache_afinidad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cache_afinidad
    ADD CONSTRAINT cache_afinidad_pkey PRIMARY KEY (id);


--
-- TOC entry 4988 (class 2606 OID 24365)
-- Name: carreras carreras_facultad_id_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_facultad_id_nombre_key UNIQUE (facultad_id, nombre);


--
-- TOC entry 4990 (class 2606 OID 24363)
-- Name: carreras carreras_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_pkey PRIMARY KEY (carrera_id);


--
-- TOC entry 4984 (class 2606 OID 24352)
-- Name: facultades facultades_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facultades
    ADD CONSTRAINT facultades_nombre_key UNIQUE (nombre);


--
-- TOC entry 4986 (class 2606 OID 24350)
-- Name: facultades facultades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facultades
    ADD CONSTRAINT facultades_pkey PRIMARY KEY (facultad_id);


--
-- TOC entry 5015 (class 2606 OID 24504)
-- Name: habilidades_estudiante habilidades_estudiante_estudiante_id_habilidad_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades_estudiante
    ADD CONSTRAINT habilidades_estudiante_estudiante_id_habilidad_id_key UNIQUE (estudiante_id, habilidad_id);


--
-- TOC entry 5017 (class 2606 OID 24502)
-- Name: habilidades_estudiante habilidades_estudiante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades_estudiante
    ADD CONSTRAINT habilidades_estudiante_pkey PRIMARY KEY (id);


--
-- TOC entry 5011 (class 2606 OID 24490)
-- Name: habilidades habilidades_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades
    ADD CONSTRAINT habilidades_nombre_key UNIQUE (nombre);


--
-- TOC entry 5013 (class 2606 OID 24488)
-- Name: habilidades habilidades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades
    ADD CONSTRAINT habilidades_pkey PRIMARY KEY (habilidad_id);


--
-- TOC entry 5023 (class 2606 OID 24553)
-- Name: habilidades_vacante habilidades_vacante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades_vacante
    ADD CONSTRAINT habilidades_vacante_pkey PRIMARY KEY (id);


--
-- TOC entry 5025 (class 2606 OID 24555)
-- Name: habilidades_vacante habilidades_vacante_vacante_id_habilidad_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades_vacante
    ADD CONSTRAINT habilidades_vacante_vacante_id_habilidad_id_key UNIQUE (vacante_id, habilidad_id);


--
-- TOC entry 5004 (class 2606 OID 24445)
-- Name: instituciones instituciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instituciones
    ADD CONSTRAINT instituciones_pkey PRIMARY KEY (institucion_id);


--
-- TOC entry 5006 (class 2606 OID 24447)
-- Name: instituciones instituciones_ruc_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instituciones
    ADD CONSTRAINT instituciones_ruc_key UNIQUE (ruc);


--
-- TOC entry 4994 (class 2606 OID 24384)
-- Name: perfiles_estudiante perfiles_estudiante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_estudiante
    ADD CONSTRAINT perfiles_estudiante_pkey PRIMARY KEY (perfil_id);


--
-- TOC entry 4996 (class 2606 OID 24386)
-- Name: perfiles_estudiante perfiles_estudiante_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_estudiante
    ADD CONSTRAINT perfiles_estudiante_usuario_id_key UNIQUE (usuario_id);


--
-- TOC entry 4998 (class 2606 OID 24412)
-- Name: perfiles_gestor perfiles_gestor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_gestor
    ADD CONSTRAINT perfiles_gestor_pkey PRIMARY KEY (perfil_id);


--
-- TOC entry 5000 (class 2606 OID 24414)
-- Name: perfiles_gestor perfiles_gestor_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_gestor
    ADD CONSTRAINT perfiles_gestor_usuario_id_key UNIQUE (usuario_id);


--
-- TOC entry 5030 (class 2606 OID 24583)
-- Name: postulaciones postulaciones_nro_solicitud_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_nro_solicitud_key UNIQUE (nro_solicitud);


--
-- TOC entry 5032 (class 2606 OID 24581)
-- Name: postulaciones postulaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_pkey PRIMARY KEY (postulacion_id);


--
-- TOC entry 4971 (class 2606 OID 24313)
-- Name: roles roles_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key UNIQUE (nombre);


--
-- TOC entry 4973 (class 2606 OID 24311)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (rol_id);


--
-- TOC entry 5009 (class 2606 OID 24474)
-- Name: supervisores supervisores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supervisores
    ADD CONSTRAINT supervisores_pkey PRIMARY KEY (supervisor_id);


--
-- TOC entry 4978 (class 2606 OID 24333)
-- Name: usuarios usuarios_cedula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_cedula_key UNIQUE (cedula);


--
-- TOC entry 4980 (class 2606 OID 24335)
-- Name: usuarios usuarios_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_key UNIQUE (correo);


--
-- TOC entry 4982 (class 2606 OID 24331)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (usuario_id);


--
-- TOC entry 5021 (class 2606 OID 24531)
-- Name: vacantes vacantes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacantes
    ADD CONSTRAINT vacantes_pkey PRIMARY KEY (vacante_id);


--
-- TOC entry 5037 (class 1259 OID 24870)
-- Name: idx_cache_afinidad_estudiante; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cache_afinidad_estudiante ON public.cache_afinidad USING btree (estudiante_id);


--
-- TOC entry 5038 (class 1259 OID 24871)
-- Name: idx_cache_afinidad_vacante; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cache_afinidad_vacante ON public.cache_afinidad USING btree (vacante_id);


--
-- TOC entry 5001 (class 1259 OID 24607)
-- Name: idx_instituciones_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_instituciones_estado ON public.instituciones USING btree (estado);


--
-- TOC entry 5002 (class 1259 OID 24606)
-- Name: idx_instituciones_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_instituciones_usuario ON public.instituciones USING btree (usuario_id);


--
-- TOC entry 4991 (class 1259 OID 24605)
-- Name: idx_perfiles_carrera; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_perfiles_carrera ON public.perfiles_estudiante USING btree (carrera_id);


--
-- TOC entry 4992 (class 1259 OID 24604)
-- Name: idx_perfiles_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_perfiles_usuario ON public.perfiles_estudiante USING btree (usuario_id);


--
-- TOC entry 5026 (class 1259 OID 24613)
-- Name: idx_postulaciones_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_postulaciones_estado ON public.postulaciones USING btree (estado);


--
-- TOC entry 5027 (class 1259 OID 24611)
-- Name: idx_postulaciones_estudiante; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_postulaciones_estudiante ON public.postulaciones USING btree (estudiante_id);


--
-- TOC entry 5028 (class 1259 OID 24612)
-- Name: idx_postulaciones_vacante; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_postulaciones_vacante ON public.postulaciones USING btree (vacante_id);


--
-- TOC entry 5007 (class 1259 OID 24608)
-- Name: idx_supervisores_institucion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supervisores_institucion ON public.supervisores USING btree (institucion_id);


--
-- TOC entry 4974 (class 1259 OID 24603)
-- Name: idx_usuarios_cedula; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_cedula ON public.usuarios USING btree (cedula);


--
-- TOC entry 4975 (class 1259 OID 24602)
-- Name: idx_usuarios_correo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_correo ON public.usuarios USING btree (correo);


--
-- TOC entry 4976 (class 1259 OID 24601)
-- Name: idx_usuarios_rol; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_rol ON public.usuarios USING btree (rol_id);


--
-- TOC entry 5018 (class 1259 OID 24610)
-- Name: idx_vacantes_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vacantes_activo ON public.vacantes USING btree (activo);


--
-- TOC entry 5019 (class 1259 OID 24609)
-- Name: idx_vacantes_institucion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vacantes_institucion ON public.vacantes USING btree (institucion_id);


--
-- TOC entry 5059 (class 2606 OID 24860)
-- Name: cache_afinidad cache_afinidad_estudiante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cache_afinidad
    ADD CONSTRAINT cache_afinidad_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.perfiles_estudiante(perfil_id) ON DELETE CASCADE;


--
-- TOC entry 5060 (class 2606 OID 24865)
-- Name: cache_afinidad cache_afinidad_vacante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cache_afinidad
    ADD CONSTRAINT cache_afinidad_vacante_id_fkey FOREIGN KEY (vacante_id) REFERENCES public.vacantes(vacante_id) ON DELETE CASCADE;


--
-- TOC entry 5040 (class 2606 OID 24366)
-- Name: carreras carreras_facultad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_facultad_id_fkey FOREIGN KEY (facultad_id) REFERENCES public.facultades(facultad_id);


--
-- TOC entry 5050 (class 2606 OID 24505)
-- Name: habilidades_estudiante habilidades_estudiante_estudiante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades_estudiante
    ADD CONSTRAINT habilidades_estudiante_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.perfiles_estudiante(perfil_id) ON DELETE CASCADE;


--
-- TOC entry 5051 (class 2606 OID 24510)
-- Name: habilidades_estudiante habilidades_estudiante_habilidad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades_estudiante
    ADD CONSTRAINT habilidades_estudiante_habilidad_id_fkey FOREIGN KEY (habilidad_id) REFERENCES public.habilidades(habilidad_id) ON DELETE CASCADE;


--
-- TOC entry 5054 (class 2606 OID 24561)
-- Name: habilidades_vacante habilidades_vacante_habilidad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades_vacante
    ADD CONSTRAINT habilidades_vacante_habilidad_id_fkey FOREIGN KEY (habilidad_id) REFERENCES public.habilidades(habilidad_id) ON DELETE CASCADE;


--
-- TOC entry 5055 (class 2606 OID 24556)
-- Name: habilidades_vacante habilidades_vacante_vacante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades_vacante
    ADD CONSTRAINT habilidades_vacante_vacante_id_fkey FOREIGN KEY (vacante_id) REFERENCES public.vacantes(vacante_id) ON DELETE CASCADE;


--
-- TOC entry 5047 (class 2606 OID 24453)
-- Name: instituciones instituciones_facultad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instituciones
    ADD CONSTRAINT instituciones_facultad_id_fkey FOREIGN KEY (facultad_id) REFERENCES public.facultades(facultad_id);


--
-- TOC entry 5048 (class 2606 OID 24448)
-- Name: instituciones instituciones_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instituciones
    ADD CONSTRAINT instituciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 5041 (class 2606 OID 24392)
-- Name: perfiles_estudiante perfiles_estudiante_carrera_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_estudiante
    ADD CONSTRAINT perfiles_estudiante_carrera_id_fkey FOREIGN KEY (carrera_id) REFERENCES public.carreras(carrera_id);


--
-- TOC entry 5042 (class 2606 OID 24397)
-- Name: perfiles_estudiante perfiles_estudiante_facultad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_estudiante
    ADD CONSTRAINT perfiles_estudiante_facultad_id_fkey FOREIGN KEY (facultad_id) REFERENCES public.facultades(facultad_id);


--
-- TOC entry 5043 (class 2606 OID 24387)
-- Name: perfiles_estudiante perfiles_estudiante_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_estudiante
    ADD CONSTRAINT perfiles_estudiante_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


--
-- TOC entry 5044 (class 2606 OID 24425)
-- Name: perfiles_gestor perfiles_gestor_carrera_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_gestor
    ADD CONSTRAINT perfiles_gestor_carrera_id_fkey FOREIGN KEY (carrera_id) REFERENCES public.carreras(carrera_id);


--
-- TOC entry 5045 (class 2606 OID 24420)
-- Name: perfiles_gestor perfiles_gestor_facultad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_gestor
    ADD CONSTRAINT perfiles_gestor_facultad_id_fkey FOREIGN KEY (facultad_id) REFERENCES public.facultades(facultad_id);


--
-- TOC entry 5046 (class 2606 OID 24415)
-- Name: perfiles_gestor perfiles_gestor_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles_gestor
    ADD CONSTRAINT perfiles_gestor_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


--
-- TOC entry 5056 (class 2606 OID 24586)
-- Name: postulaciones postulaciones_estudiante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.perfiles_estudiante(perfil_id) ON DELETE CASCADE;


--
-- TOC entry 5057 (class 2606 OID 24596)
-- Name: postulaciones postulaciones_supervisor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_supervisor_id_fkey FOREIGN KEY (supervisor_id) REFERENCES public.supervisores(supervisor_id);


--
-- TOC entry 5058 (class 2606 OID 24591)
-- Name: postulaciones postulaciones_vacante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_vacante_id_fkey FOREIGN KEY (vacante_id) REFERENCES public.vacantes(vacante_id) ON DELETE CASCADE;


--
-- TOC entry 5049 (class 2606 OID 24475)
-- Name: supervisores supervisores_institucion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supervisores
    ADD CONSTRAINT supervisores_institucion_id_fkey FOREIGN KEY (institucion_id) REFERENCES public.instituciones(institucion_id) ON DELETE CASCADE;


--
-- TOC entry 5039 (class 2606 OID 24336)
-- Name: usuarios usuarios_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(rol_id);


--
-- TOC entry 5052 (class 2606 OID 24532)
-- Name: vacantes vacantes_institucion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacantes
    ADD CONSTRAINT vacantes_institucion_id_fkey FOREIGN KEY (institucion_id) REFERENCES public.instituciones(institucion_id) ON DELETE CASCADE;


--
-- TOC entry 5053 (class 2606 OID 24537)
-- Name: vacantes vacantes_supervisor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacantes
    ADD CONSTRAINT vacantes_supervisor_id_fkey FOREIGN KEY (supervisor_id) REFERENCES public.supervisores(supervisor_id) ON DELETE SET NULL;


-- Completed on 2026-07-21 14:23:51

--
-- PostgreSQL database dump complete
--

-- \unrestrict NDHOKidFhWU1ImPCHkBnHmhfsM8jA8WdKLq6KwUsFM7dRRjYvDjvygbHSH9O4B0
