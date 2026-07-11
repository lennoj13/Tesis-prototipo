--
-- PostgreSQL database dump
--

\restrict LnqhbhBOHQkJFLtq0gf8Oez2boU8TO9DPyw9SVQaXOXL9AQDVngWuV2Ud6qazUV

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-07-10 22:52:04
-- Base de datos

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
-- TOC entry 246 (class 1259 OID 24847)
-- Name: cache_afinidad; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache_afinidad (
    id integer NOT NULL,
    estudiante_id integer NOT NULL,
    vacante_id integer NOT NULL,
    porcentaje_afinidad numeric(5,2) NOT NULL,
    calculado_en timestamp without time zone DEFAULT now()
);


--
-- TOC entry 245 (class 1259 OID 24846)
-- Name: cache_afinidad_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cache_afinidad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5241 (class 0 OID 0)
-- Dependencies: 245
-- Name: cache_afinidad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cache_afinidad_id_seq OWNED BY public.cache_afinidad.id;


--
-- TOC entry 226 (class 1259 OID 24354)
-- Name: carreras; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carreras (
    carrera_id integer NOT NULL,
    facultad_id integer NOT NULL,
    nombre character varying(200) NOT NULL,
    codigo character varying(20),
    activo boolean DEFAULT true
);


--
-- TOC entry 225 (class 1259 OID 24353)
-- Name: carreras_carrera_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.carreras_carrera_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5242 (class 0 OID 0)
-- Dependencies: 225
-- Name: carreras_carrera_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.carreras_carrera_id_seq OWNED BY public.carreras.carrera_id;


--
-- TOC entry 224 (class 1259 OID 24342)
-- Name: facultades; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.facultades (
    facultad_id integer NOT NULL,
    nombre character varying(200) NOT NULL,
    activo boolean DEFAULT true
);


--
-- TOC entry 223 (class 1259 OID 24341)
-- Name: facultades_facultad_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.facultades_facultad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5243 (class 0 OID 0)
-- Dependencies: 223
-- Name: facultades_facultad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.facultades_facultad_id_seq OWNED BY public.facultades.facultad_id;


--
-- TOC entry 236 (class 1259 OID 24481)
-- Name: habilidades; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.habilidades (
    habilidad_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    categoria character varying(50)
);


--
-- TOC entry 238 (class 1259 OID 24492)
-- Name: habilidades_estudiante; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.habilidades_estudiante (
    id integer NOT NULL,
    estudiante_id integer NOT NULL,
    habilidad_id integer NOT NULL,
    nivel integer DEFAULT 1,
    CONSTRAINT habilidades_estudiante_nivel_check CHECK (((nivel >= 1) AND (nivel <= 5)))
);


--
-- TOC entry 237 (class 1259 OID 24491)
-- Name: habilidades_estudiante_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.habilidades_estudiante_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5244 (class 0 OID 0)
-- Dependencies: 237
-- Name: habilidades_estudiante_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.habilidades_estudiante_id_seq OWNED BY public.habilidades_estudiante.id;


--
-- TOC entry 235 (class 1259 OID 24480)
-- Name: habilidades_habilidad_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.habilidades_habilidad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5245 (class 0 OID 0)
-- Dependencies: 235
-- Name: habilidades_habilidad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.habilidades_habilidad_id_seq OWNED BY public.habilidades.habilidad_id;


--
-- TOC entry 242 (class 1259 OID 24543)
-- Name: habilidades_vacante; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.habilidades_vacante (
    id integer NOT NULL,
    vacante_id integer NOT NULL,
    habilidad_id integer NOT NULL,
    nivel_requerido integer DEFAULT 1,
    es_opcional boolean DEFAULT false
);


--
-- TOC entry 241 (class 1259 OID 24542)
-- Name: habilidades_vacante_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.habilidades_vacante_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5246 (class 0 OID 0)
-- Dependencies: 241
-- Name: habilidades_vacante_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.habilidades_vacante_id_seq OWNED BY public.habilidades_vacante.id;


--
-- TOC entry 232 (class 1259 OID 24431)
-- Name: instituciones; Type: TABLE; Schema: public; Owner: -
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
-- TOC entry 231 (class 1259 OID 24430)
-- Name: instituciones_institucion_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.instituciones_institucion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5247 (class 0 OID 0)
-- Dependencies: 231
-- Name: instituciones_institucion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.instituciones_institucion_id_seq OWNED BY public.instituciones.institucion_id;


--
-- TOC entry 228 (class 1259 OID 24372)
-- Name: perfiles_estudiante; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 227 (class 1259 OID 24371)
-- Name: perfiles_estudiante_perfil_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.perfiles_estudiante_perfil_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5248 (class 0 OID 0)
-- Dependencies: 227
-- Name: perfiles_estudiante_perfil_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.perfiles_estudiante_perfil_id_seq OWNED BY public.perfiles_estudiante.perfil_id;


--
-- TOC entry 230 (class 1259 OID 24403)
-- Name: perfiles_gestor; Type: TABLE; Schema: public; Owner: -
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
-- TOC entry 229 (class 1259 OID 24402)
-- Name: perfiles_gestor_perfil_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.perfiles_gestor_perfil_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5249 (class 0 OID 0)
-- Dependencies: 229
-- Name: perfiles_gestor_perfil_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.perfiles_gestor_perfil_id_seq OWNED BY public.perfiles_gestor.perfil_id;


--
-- TOC entry 244 (class 1259 OID 24567)
-- Name: postulaciones; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 243 (class 1259 OID 24566)
-- Name: postulaciones_postulacion_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.postulaciones_postulacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5250 (class 0 OID 0)
-- Dependencies: 243
-- Name: postulaciones_postulacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.postulaciones_postulacion_id_seq OWNED BY public.postulaciones.postulacion_id;


--
-- TOC entry 220 (class 1259 OID 24304)
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    rol_id integer NOT NULL,
    nombre character varying(20) NOT NULL,
    descripcion character varying(200)
);


--
-- TOC entry 219 (class 1259 OID 24303)
-- Name: roles_rol_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_rol_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5251 (class 0 OID 0)
-- Dependencies: 219
-- Name: roles_rol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_rol_id_seq OWNED BY public.roles.rol_id;


--
-- TOC entry 234 (class 1259 OID 24459)
-- Name: supervisores; Type: TABLE; Schema: public; Owner: -
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
-- TOC entry 233 (class 1259 OID 24458)
-- Name: supervisores_supervisor_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.supervisores_supervisor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5252 (class 0 OID 0)
-- Dependencies: 233
-- Name: supervisores_supervisor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.supervisores_supervisor_id_seq OWNED BY public.supervisores.supervisor_id;


--
-- TOC entry 222 (class 1259 OID 24315)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
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
-- TOC entry 221 (class 1259 OID 24314)
-- Name: usuarios_usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuarios_usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5253 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuarios_usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuarios_usuario_id_seq OWNED BY public.usuarios.usuario_id;


--
-- TOC entry 240 (class 1259 OID 24516)
-- Name: vacantes; Type: TABLE; Schema: public; Owner: -
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
-- TOC entry 239 (class 1259 OID 24515)
-- Name: vacantes_vacante_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vacantes_vacante_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5254 (class 0 OID 0)
-- Dependencies: 239
-- Name: vacantes_vacante_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vacantes_vacante_id_seq OWNED BY public.vacantes.vacante_id;


--
-- TOC entry 4967 (class 2604 OID 24850)
-- Name: cache_afinidad id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache_afinidad ALTER COLUMN id SET DEFAULT nextval('public.cache_afinidad_id_seq'::regclass);


--
-- TOC entry 4928 (class 2604 OID 24357)
-- Name: carreras carrera_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carreras ALTER COLUMN carrera_id SET DEFAULT nextval('public.carreras_carrera_id_seq'::regclass);


--
-- TOC entry 4926 (class 2604 OID 24345)
-- Name: facultades facultad_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.facultades ALTER COLUMN facultad_id SET DEFAULT nextval('public.facultades_facultad_id_seq'::regclass);


--
-- TOC entry 4949 (class 2604 OID 24484)
-- Name: habilidades habilidad_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habilidades ALTER COLUMN habilidad_id SET DEFAULT nextval('public.habilidades_habilidad_id_seq'::regclass);


--
-- TOC entry 4950 (class 2604 OID 24495)
-- Name: habilidades_estudiante id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habilidades_estudiante ALTER COLUMN id SET DEFAULT nextval('public.habilidades_estudiante_id_seq'::regclass);


--
-- TOC entry 4958 (class 2604 OID 24546)
-- Name: habilidades_vacante id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habilidades_vacante ALTER COLUMN id SET DEFAULT nextval('public.habilidades_vacante_id_seq'::regclass);


--
-- TOC entry 4938 (class 2604 OID 24434)
-- Name: instituciones institucion_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instituciones ALTER COLUMN institucion_id SET DEFAULT nextval('public.instituciones_institucion_id_seq'::regclass);


--
-- TOC entry 4930 (class 2604 OID 24375)
-- Name: perfiles_estudiante perfil_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfiles_estudiante ALTER COLUMN perfil_id SET DEFAULT nextval('public.perfiles_estudiante_perfil_id_seq'::regclass);


--
-- TOC entry 4935 (class 2604 OID 24406)
-- Name: perfiles_gestor perfil_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfiles_gestor ALTER COLUMN perfil_id SET DEFAULT nextval('public.perfiles_gestor_perfil_id_seq'::regclass);


--
-- TOC entry 4961 (class 2604 OID 24570)
-- Name: postulaciones postulacion_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.postulaciones ALTER COLUMN postulacion_id SET DEFAULT nextval('public.postulaciones_postulacion_id_seq'::regclass);


--
-- TOC entry 4921 (class 2604 OID 24307)
-- Name: roles rol_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN rol_id SET DEFAULT nextval('public.roles_rol_id_seq'::regclass);


--
-- TOC entry 4944 (class 2604 OID 24462)
-- Name: supervisores supervisor_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supervisores ALTER COLUMN supervisor_id SET DEFAULT nextval('public.supervisores_supervisor_id_seq'::regclass);


--
-- TOC entry 4922 (class 2604 OID 24318)
-- Name: usuarios usuario_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN usuario_id SET DEFAULT nextval('public.usuarios_usuario_id_seq'::regclass);


--
-- TOC entry 4952 (class 2604 OID 24519)
-- Name: vacantes vacante_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vacantes ALTER COLUMN vacante_id SET DEFAULT nextval('public.vacantes_vacante_id_seq'::regclass);


--
-- TOC entry 5235 (class 0 OID 24847)
-- Dependencies: 246
-- Data for Name: cache_afinidad; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.cache_afinidad VALUES (436, 1, 23, 79.11, '2026-06-18 12:26:21.280156');
INSERT INTO public.cache_afinidad VALUES (898, 3, 18, 7.07, '2026-07-09 00:16:24.476249');
INSERT INTO public.cache_afinidad VALUES (899, 4, 18, 7.07, '2026-07-09 00:16:25.058257');
INSERT INTO public.cache_afinidad VALUES (900, 5, 18, 7.07, '2026-07-09 00:16:25.545155');
INSERT INTO public.cache_afinidad VALUES (448, 1, 14, 7.38, '2026-06-18 12:26:22.046415');
INSERT INTO public.cache_afinidad VALUES (449, 1, 15, 7.38, '2026-06-18 12:26:22.096703');
INSERT INTO public.cache_afinidad VALUES (901, 6, 18, 69.68, '2026-07-09 00:16:26.105384');
INSERT INTO public.cache_afinidad VALUES (438, 1, 18, 59.61, '2026-07-09 00:16:26.978507');
INSERT INTO public.cache_afinidad VALUES (803, 7, 18, 69.68, '2026-07-09 00:16:27.33798');
INSERT INTO public.cache_afinidad VALUES (641, 2, 26, 50.21, '2026-06-24 00:03:58.278996');
INSERT INTO public.cache_afinidad VALUES (657, 3, 26, 33.18, '2026-06-22 00:04:04.705216');
INSERT INTO public.cache_afinidad VALUES (658, 4, 26, 33.18, '2026-06-22 00:04:05.074604');
INSERT INTO public.cache_afinidad VALUES (659, 5, 26, 33.18, '2026-06-22 00:04:05.636859');
INSERT INTO public.cache_afinidad VALUES (660, 6, 26, 8.71, '2026-06-22 00:04:06.001721');
INSERT INTO public.cache_afinidad VALUES (662, 7, 26, 18.31, '2026-06-20 11:01:28.76314');
INSERT INTO public.cache_afinidad VALUES (488, 2, 25, 53.47, '2026-07-10 22:30:29.876247');
INSERT INTO public.cache_afinidad VALUES (489, 2, 18, 72.98, '2026-07-10 22:30:29.952049');
INSERT INTO public.cache_afinidad VALUES (491, 2, 4, 30.02, '2026-07-10 22:30:30.020909');
INSERT INTO public.cache_afinidad VALUES (492, 2, 6, 30.02, '2026-07-10 22:30:30.081222');
INSERT INTO public.cache_afinidad VALUES (493, 2, 7, 30.02, '2026-07-10 22:30:30.147228');
INSERT INTO public.cache_afinidad VALUES (503, 2, 2, 30.02, '2026-07-10 22:30:30.216606');
INSERT INTO public.cache_afinidad VALUES (661, 1, 26, 63.51, '2026-06-24 00:13:11.883683');
INSERT INTO public.cache_afinidad VALUES (437, 1, 25, 47.15, '2026-06-24 00:13:11.924728');
INSERT INTO public.cache_afinidad VALUES (502, 2, 10, 30.02, '2026-07-10 22:30:30.283347');
INSERT INTO public.cache_afinidad VALUES (440, 1, 6, 40.79, '2026-06-24 00:13:12.261169');
INSERT INTO public.cache_afinidad VALUES (441, 1, 7, 40.79, '2026-06-24 00:13:12.412517');
INSERT INTO public.cache_afinidad VALUES (442, 1, 8, 40.79, '2026-06-24 00:13:12.449313');
INSERT INTO public.cache_afinidad VALUES (500, 2, 14, 5.21, '2026-06-20 11:08:35.465548');
INSERT INTO public.cache_afinidad VALUES (501, 2, 15, 5.21, '2026-06-20 11:08:35.500192');
INSERT INTO public.cache_afinidad VALUES (498, 2, 12, 42.40, '2026-07-10 22:30:30.3464');
INSERT INTO public.cache_afinidad VALUES (499, 2, 13, 42.40, '2026-07-10 22:30:30.410318');
INSERT INTO public.cache_afinidad VALUES (494, 2, 8, 30.02, '2026-07-10 22:30:30.468309');
INSERT INTO public.cache_afinidad VALUES (446, 1, 12, 32.32, '2026-06-24 00:13:12.823448');
INSERT INTO public.cache_afinidad VALUES (447, 1, 13, 32.32, '2026-06-24 00:13:12.86235');
INSERT INTO public.cache_afinidad VALUES (444, 1, 10, 40.79, '2026-06-24 00:13:12.901677');
INSERT INTO public.cache_afinidad VALUES (451, 1, 2, 40.79, '2026-06-24 00:13:12.937423');
INSERT INTO public.cache_afinidad VALUES (452, 1, 3, 40.79, '2026-06-24 00:13:13.08134');
INSERT INTO public.cache_afinidad VALUES (453, 1, 4, 40.79, '2026-06-24 00:13:13.118265');
INSERT INTO public.cache_afinidad VALUES (802, 7, 25, 32.21, '2026-06-25 23:15:18.515344');
INSERT INTO public.cache_afinidad VALUES (504, 2, 3, 30.02, '2026-07-10 22:30:30.625963');
INSERT INTO public.cache_afinidad VALUES (805, 7, 4, 8.88, '2026-06-25 23:15:18.910994');
INSERT INTO public.cache_afinidad VALUES (806, 7, 6, 8.88, '2026-06-25 23:15:18.952495');
INSERT INTO public.cache_afinidad VALUES (807, 7, 7, 8.88, '2026-06-25 23:15:18.996095');
INSERT INTO public.cache_afinidad VALUES (808, 7, 8, 8.88, '2026-06-25 23:15:19.038489');
INSERT INTO public.cache_afinidad VALUES (810, 7, 10, 8.88, '2026-06-25 23:15:19.117474');
INSERT INTO public.cache_afinidad VALUES (812, 7, 12, 57.99, '2026-06-25 23:15:19.417167');
INSERT INTO public.cache_afinidad VALUES (813, 7, 13, 57.99, '2026-06-25 23:15:19.459407');
INSERT INTO public.cache_afinidad VALUES (815, 7, 2, 8.88, '2026-06-25 23:15:19.537806');
INSERT INTO public.cache_afinidad VALUES (816, 7, 3, 8.88, '2026-06-25 23:15:19.580011');


--
-- TOC entry 5215 (class 0 OID 24354)
-- Dependencies: 226
-- Data for Name: carreras; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.carreras VALUES (1, 1, 'SOFTWARE', 'SOF', true);
INSERT INTO public.carreras VALUES (2, 1, 'Ciencias de Datos e Inteligencia Artificial', 'CDIA', true);
INSERT INTO public.carreras VALUES (3, 2, 'Ingeniería de la Producción', 'INP', true);


--
-- TOC entry 5213 (class 0 OID 24342)
-- Dependencies: 224
-- Data for Name: facultades; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.facultades VALUES (1, 'Ciencias Matemáticas y Físicas', true);
INSERT INTO public.facultades VALUES (2, 'Ingeniería Química', true);


--
-- TOC entry 5225 (class 0 OID 24481)
-- Dependencies: 236
-- Data for Name: habilidades; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.habilidades VALUES (1, 'JavaScript', 'Programacion');
INSERT INTO public.habilidades VALUES (2, 'Python', 'Programacion');
INSERT INTO public.habilidades VALUES (3, 'React', 'Frontend');
INSERT INTO public.habilidades VALUES (4, 'Node.js', 'Backend');
INSERT INTO public.habilidades VALUES (5, 'SQL', 'Base de Datos');
INSERT INTO public.habilidades VALUES (6, 'Java', 'Programacion');
INSERT INTO public.habilidades VALUES (7, 'TypeScript', 'Programacion');
INSERT INTO public.habilidades VALUES (8, 'Git', 'Herramientas');
INSERT INTO public.habilidades VALUES (9, 'Excel', 'Herramientas');
INSERT INTO public.habilidades VALUES (10, 'Power BI', 'Analisis');
INSERT INTO public.habilidades VALUES (11, 'Figma', 'Diseno');
INSERT INTO public.habilidades VALUES (12, 'Adobe XD', 'Diseno');
INSERT INTO public.habilidades VALUES (13, 'Machine Learning', 'IA');
INSERT INTO public.habilidades VALUES (14, 'Data Analysis', 'Analisis');
INSERT INTO public.habilidades VALUES (15, 'AWS', 'Cloud');
INSERT INTO public.habilidades VALUES (16, 'Docker', 'DevOps');
INSERT INTO public.habilidades VALUES (17, 'Ingles', 'Idiomas');
INSERT INTO public.habilidades VALUES (18, 'Liderazgo', 'Soft Skills');
INSERT INTO public.habilidades VALUES (19, 'Trabajo en equipo', 'Soft Skills');
INSERT INTO public.habilidades VALUES (20, 'Comunicacion', 'Soft Skills');
INSERT INTO public.habilidades VALUES (21, 'Flask', 'Backend');
INSERT INTO public.habilidades VALUES (22, 'Django', 'Backend');
INSERT INTO public.habilidades VALUES (23, 'C#', 'Programacion');
INSERT INTO public.habilidades VALUES (24, '.NET', 'Backend');
INSERT INTO public.habilidades VALUES (25, 'PHP', 'Programacion');
INSERT INTO public.habilidades VALUES (26, 'Laravel', 'Backend');
INSERT INTO public.habilidades VALUES (27, 'Angular', 'Frontend');
INSERT INTO public.habilidades VALUES (28, 'Vue.js', 'Frontend');
INSERT INTO public.habilidades VALUES (29, 'PostgreSQL', 'Base de Datos');
INSERT INTO public.habilidades VALUES (30, 'MongoDB', 'Base de Datos');
INSERT INTO public.habilidades VALUES (31, 'TensorFlow', 'IA');
INSERT INTO public.habilidades VALUES (32, 'PyTorch', 'IA');
INSERT INTO public.habilidades VALUES (33, 'Lean Manufacturing', 'Ingenieria');
INSERT INTO public.habilidades VALUES (34, 'Six Sigma', 'Ingenieria');
INSERT INTO public.habilidades VALUES (35, 'Logistica', 'Ingenieria');
INSERT INTO public.habilidades VALUES (36, 'pyhton', 'Manual');
INSERT INTO public.habilidades VALUES (37, 'Data Science', NULL);
INSERT INTO public.habilidades VALUES (38, 'Flutter', NULL);
INSERT INTO public.habilidades VALUES (39, 'CSS', NULL);
INSERT INTO public.habilidades VALUES (40, 'depp learning', 'Manual');


--
-- TOC entry 5227 (class 0 OID 24492)
-- Dependencies: 238
-- Data for Name: habilidades_estudiante; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.habilidades_estudiante VALUES (426, 2, 5, 3);
INSERT INTO public.habilidades_estudiante VALUES (7, 3, 1, 4);
INSERT INTO public.habilidades_estudiante VALUES (8, 3, 3, 4);
INSERT INTO public.habilidades_estudiante VALUES (9, 3, 4, 3);
INSERT INTO public.habilidades_estudiante VALUES (10, 4, 1, 4);
INSERT INTO public.habilidades_estudiante VALUES (11, 4, 3, 4);
INSERT INTO public.habilidades_estudiante VALUES (12, 4, 4, 3);
INSERT INTO public.habilidades_estudiante VALUES (13, 5, 1, 4);
INSERT INTO public.habilidades_estudiante VALUES (14, 5, 3, 4);
INSERT INTO public.habilidades_estudiante VALUES (15, 5, 4, 3);
INSERT INTO public.habilidades_estudiante VALUES (16, 6, 2, 5);
INSERT INTO public.habilidades_estudiante VALUES (17, 6, 13, 4);
INSERT INTO public.habilidades_estudiante VALUES (18, 6, 14, 4);
INSERT INTO public.habilidades_estudiante VALUES (19, 7, 2, 5);
INSERT INTO public.habilidades_estudiante VALUES (20, 7, 13, 4);
INSERT INTO public.habilidades_estudiante VALUES (21, 7, 14, 4);
INSERT INTO public.habilidades_estudiante VALUES (22, 8, 33, 4);
INSERT INTO public.habilidades_estudiante VALUES (23, 8, 34, 3);
INSERT INTO public.habilidades_estudiante VALUES (24, 8, 35, 4);
INSERT INTO public.habilidades_estudiante VALUES (25, 9, 33, 4);
INSERT INTO public.habilidades_estudiante VALUES (26, 9, 34, 3);
INSERT INTO public.habilidades_estudiante VALUES (27, 9, 35, 4);
INSERT INTO public.habilidades_estudiante VALUES (28, 10, 33, 4);
INSERT INTO public.habilidades_estudiante VALUES (29, 10, 34, 3);
INSERT INTO public.habilidades_estudiante VALUES (30, 10, 35, 4);
INSERT INTO public.habilidades_estudiante VALUES (427, 2, 13, 3);
INSERT INTO public.habilidades_estudiante VALUES (428, 2, 36, 3);
INSERT INTO public.habilidades_estudiante VALUES (429, 2, 37, 3);
INSERT INTO public.habilidades_estudiante VALUES (430, 2, 14, 3);
INSERT INTO public.habilidades_estudiante VALUES (431, 2, 40, 3);
INSERT INTO public.habilidades_estudiante VALUES (432, 2, 16, 3);
INSERT INTO public.habilidades_estudiante VALUES (376, 1, 5, 3);
INSERT INTO public.habilidades_estudiante VALUES (377, 1, 12, 3);
INSERT INTO public.habilidades_estudiante VALUES (378, 1, 13, 1);
INSERT INTO public.habilidades_estudiante VALUES (379, 1, 14, 3);
INSERT INTO public.habilidades_estudiante VALUES (380, 1, 20, 3);
INSERT INTO public.habilidades_estudiante VALUES (381, 1, 36, 3);
INSERT INTO public.habilidades_estudiante VALUES (382, 1, 37, 1);
INSERT INTO public.habilidades_estudiante VALUES (383, 1, 40, 3);
INSERT INTO public.habilidades_estudiante VALUES (384, 1, 22, 3);
INSERT INTO public.habilidades_estudiante VALUES (385, 1, 16, 3);
INSERT INTO public.habilidades_estudiante VALUES (386, 1, 9, 3);


--
-- TOC entry 5231 (class 0 OID 24543)
-- Dependencies: 242
-- Data for Name: habilidades_vacante; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.habilidades_vacante VALUES (1, 1, 4, 1, false);
INSERT INTO public.habilidades_vacante VALUES (2, 1, 5, 1, false);
INSERT INTO public.habilidades_vacante VALUES (3, 1, 8, 1, false);
INSERT INTO public.habilidades_vacante VALUES (4, 2, 4, 1, false);
INSERT INTO public.habilidades_vacante VALUES (5, 2, 5, 1, false);
INSERT INTO public.habilidades_vacante VALUES (6, 2, 8, 1, false);
INSERT INTO public.habilidades_vacante VALUES (7, 3, 4, 1, false);
INSERT INTO public.habilidades_vacante VALUES (8, 3, 5, 1, false);
INSERT INTO public.habilidades_vacante VALUES (9, 3, 8, 1, false);
INSERT INTO public.habilidades_vacante VALUES (10, 4, 4, 1, false);
INSERT INTO public.habilidades_vacante VALUES (11, 4, 5, 1, false);
INSERT INTO public.habilidades_vacante VALUES (12, 4, 8, 1, false);
INSERT INTO public.habilidades_vacante VALUES (13, 5, 4, 1, false);
INSERT INTO public.habilidades_vacante VALUES (14, 5, 5, 1, false);
INSERT INTO public.habilidades_vacante VALUES (15, 5, 8, 1, false);
INSERT INTO public.habilidades_vacante VALUES (16, 6, 4, 1, false);
INSERT INTO public.habilidades_vacante VALUES (17, 6, 5, 1, false);
INSERT INTO public.habilidades_vacante VALUES (18, 6, 8, 1, false);
INSERT INTO public.habilidades_vacante VALUES (19, 7, 4, 1, false);
INSERT INTO public.habilidades_vacante VALUES (20, 7, 5, 1, false);
INSERT INTO public.habilidades_vacante VALUES (21, 7, 8, 1, false);
INSERT INTO public.habilidades_vacante VALUES (22, 8, 4, 1, false);
INSERT INTO public.habilidades_vacante VALUES (23, 8, 5, 1, false);
INSERT INTO public.habilidades_vacante VALUES (24, 8, 8, 1, false);
INSERT INTO public.habilidades_vacante VALUES (25, 9, 4, 1, false);
INSERT INTO public.habilidades_vacante VALUES (26, 9, 5, 1, false);
INSERT INTO public.habilidades_vacante VALUES (27, 9, 8, 1, false);
INSERT INTO public.habilidades_vacante VALUES (28, 10, 4, 1, false);
INSERT INTO public.habilidades_vacante VALUES (29, 10, 5, 1, false);
INSERT INTO public.habilidades_vacante VALUES (30, 10, 8, 1, false);
INSERT INTO public.habilidades_vacante VALUES (31, 11, 2, 1, false);
INSERT INTO public.habilidades_vacante VALUES (32, 11, 14, 1, false);
INSERT INTO public.habilidades_vacante VALUES (33, 11, 10, 1, false);
INSERT INTO public.habilidades_vacante VALUES (34, 12, 2, 1, false);
INSERT INTO public.habilidades_vacante VALUES (35, 12, 14, 1, false);
INSERT INTO public.habilidades_vacante VALUES (36, 12, 10, 1, false);
INSERT INTO public.habilidades_vacante VALUES (37, 13, 2, 1, false);
INSERT INTO public.habilidades_vacante VALUES (38, 13, 14, 1, false);
INSERT INTO public.habilidades_vacante VALUES (39, 13, 10, 1, false);
INSERT INTO public.habilidades_vacante VALUES (40, 14, 9, 1, false);
INSERT INTO public.habilidades_vacante VALUES (41, 14, 33, 1, false);
INSERT INTO public.habilidades_vacante VALUES (42, 14, 19, 1, false);
INSERT INTO public.habilidades_vacante VALUES (43, 15, 9, 1, false);
INSERT INTO public.habilidades_vacante VALUES (44, 15, 33, 1, false);
INSERT INTO public.habilidades_vacante VALUES (45, 15, 19, 1, false);
INSERT INTO public.habilidades_vacante VALUES (56, 16, 6, 5, false);
INSERT INTO public.habilidades_vacante VALUES (57, 17, 36, 3, false);
INSERT INTO public.habilidades_vacante VALUES (58, 17, 14, 3, false);
INSERT INTO public.habilidades_vacante VALUES (59, 17, 1, 3, false);
INSERT INTO public.habilidades_vacante VALUES (73, 23, 13, 2, false);
INSERT INTO public.habilidades_vacante VALUES (74, 23, 37, 2, false);
INSERT INTO public.habilidades_vacante VALUES (75, 23, 36, 2, false);
INSERT INTO public.habilidades_vacante VALUES (76, 23, 5, 2, false);
INSERT INTO public.habilidades_vacante VALUES (77, 23, 14, 2, false);
INSERT INTO public.habilidades_vacante VALUES (78, 24, 12, 2, false);
INSERT INTO public.habilidades_vacante VALUES (79, 24, 36, 2, false);
INSERT INTO public.habilidades_vacante VALUES (80, 24, 5, 2, false);
INSERT INTO public.habilidades_vacante VALUES (81, 24, 14, 2, false);
INSERT INTO public.habilidades_vacante VALUES (82, 25, 24, 2, false);
INSERT INTO public.habilidades_vacante VALUES (83, 25, 5, 2, false);
INSERT INTO public.habilidades_vacante VALUES (84, 25, 23, 2, false);
INSERT INTO public.habilidades_vacante VALUES (85, 25, 14, 2, false);
INSERT INTO public.habilidades_vacante VALUES (128, 26, 38, 3, false);
INSERT INTO public.habilidades_vacante VALUES (129, 26, 22, 3, false);
INSERT INTO public.habilidades_vacante VALUES (130, 26, 16, 3, false);
INSERT INTO public.habilidades_vacante VALUES (131, 26, 9, 3, false);
INSERT INTO public.habilidades_vacante VALUES (132, 26, 23, 3, false);
INSERT INTO public.habilidades_vacante VALUES (133, 26, 15, 3, false);
INSERT INTO public.habilidades_vacante VALUES (134, 26, 40, 3, false);
INSERT INTO public.habilidades_vacante VALUES (135, 18, 2, 1, false);
INSERT INTO public.habilidades_vacante VALUES (136, 18, 13, 1, false);
INSERT INTO public.habilidades_vacante VALUES (137, 18, 37, 1, false);
INSERT INTO public.habilidades_vacante VALUES (138, 18, 5, 1, false);


--
-- TOC entry 5221 (class 0 OID 24431)
-- Dependencies: 232
-- Data for Name: instituciones; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.instituciones VALUES (2, 16, 1, 'InnovaSoft Ecuador', 'Empresa de Software Factory', '1234567890002', 'Software Factory', 'Desarrollamos soluciones integrales para el sector tecnológico.', NULL, NULL, 'Guayaquil', 'contacto@innovasoftecuador.com', '0990000002', 'aprobado', 'UG-DFAP-0002-PPP', 'PRACTICAS PREPROFESIONALES', '2023-01-01', '2028-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones VALUES (4, 18, 1, 'Cloud Devs', 'Empresa de Cloud Computing', '1234567890004', 'Cloud Computing', 'Desarrollamos soluciones integrales para el sector tecnológico.', NULL, NULL, 'Guayaquil', 'contacto@clouddevs.com', '0990000004', 'aprobado', 'UG-DFAP-0004-PPP', 'PRACTICAS PREPROFESIONALES', '2023-01-01', '2028-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones VALUES (5, 19, 1, 'App Works', 'Empresa de Desarrollo Móvil', '1234567890005', 'Desarrollo Móvil', 'Desarrollamos soluciones integrales para el sector tecnológico.', NULL, NULL, 'Guayaquil', 'contacto@appworks.com', '0990000005', 'aprobado', 'UG-DFAP-0005-PPP', 'PRACTICAS PREPROFESIONALES', '2023-01-01', '2028-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones VALUES (6, 20, 1, 'Fintech Solutions', 'Empresa de Fintech', '1234567890006', 'Fintech', 'Desarrollamos soluciones integrales para el sector tecnológico.', NULL, NULL, 'Guayaquil', 'contacto@fintechsolutions.com', '0990000006', 'aprobado', 'UG-DFAP-0006-PPP', 'PRACTICAS PREPROFESIONALES', '2023-01-01', '2028-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones VALUES (7, 21, 1, 'CyberSec EC', 'Empresa de Ciberseguridad', '1234567890007', 'Ciberseguridad', 'Desarrollamos soluciones integrales para el sector tecnológico.', NULL, NULL, 'Guayaquil', 'contacto@cybersecec.com', '0990000007', 'aprobado', 'UG-DFAP-0007-PPP', 'PRACTICAS PREPROFESIONALES', '2023-01-01', '2028-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones VALUES (8, 22, 1, 'Smart Code', 'Empresa de Desarrollo Web', '1234567890008', 'Desarrollo Web', 'Desarrollamos soluciones integrales para el sector tecnológico.', NULL, NULL, 'Guayaquil', 'contacto@smartcode.com', '0990000008', 'aprobado', 'UG-DFAP-0008-PPP', 'PRACTICAS PREPROFESIONALES', '2023-01-01', '2028-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones VALUES (9, 23, 1, 'Nexus Tech', 'Empresa de Sistemas Empresariales', '1234567890009', 'Sistemas Empresariales', 'Desarrollamos soluciones integrales para el sector tecnológico.', NULL, NULL, 'Guayaquil', 'contacto@nexustech.com', '0990000009', 'aprobado', 'UG-DFAP-0009-PPP', 'PRACTICAS PREPROFESIONALES', '2023-01-01', '2028-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones VALUES (10, 24, 1, 'Dev Masters', 'Empresa de Desarrollo Backend', '12345678900010', 'Desarrollo Backend', 'Desarrollamos soluciones integrales para el sector tecnológico.', NULL, NULL, 'Guayaquil', 'contacto@devmasters.com', '0990000010', 'aprobado', 'UG-DFAP-0010-PPP', 'PRACTICAS PREPROFESIONALES', '2023-01-01', '2028-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones VALUES (11, 25, 1, 'DataMind GYE', 'Empresa de Data Science', '12345678900011', 'Data Science', 'Especialistas en análisis de grandes volúmenes de datos.', NULL, NULL, 'Guayaquil', 'contacto@datamindgye.com', '0990000011', 'aprobado', 'UG-DFAP-0011-PPP', 'PRACTICAS PREPROFESIONALES', '2023-05-15', '2028-05-15', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones VALUES (12, 26, 1, 'AI Vision', 'Empresa de Inteligencia Artificial', '12345678900012', 'Inteligencia Artificial', 'Especialistas en análisis de grandes volúmenes de datos.', NULL, NULL, 'Guayaquil', 'contacto@aivision.com', '0990000012', 'aprobado', 'UG-DFAP-0012-PPP', 'PRACTICAS PREPROFESIONALES', '2023-05-15', '2028-05-15', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones VALUES (13, 27, 1, 'Metricas EC', 'Empresa de Big Data', '12345678900013', 'Big Data', 'Especialistas en análisis de grandes volúmenes de datos.', NULL, NULL, 'Guayaquil', 'contacto@metricasec.com', '0990000013', 'aprobado', 'UG-DFAP-0013-PPP', 'PRACTICAS PREPROFESIONALES', '2023-05-15', '2028-05-15', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones VALUES (14, 28, 2, 'InduProducción S.A.', 'Empresa de Manufactura', '12345678900014', 'Manufactura', 'Líderes en procesos industriales y logística a nivel nacional.', NULL, NULL, 'Guayaquil', 'contacto@induproduccións.a..com', '0990000014', 'aprobado', 'UG-DFAP-0014-PPP', 'PRACTICAS PREPROFESIONALES', '2024-02-10', '2029-02-10', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones VALUES (15, 29, 2, 'Logística Avanzada', 'Empresa de Logística Industrial', '12345678900015', 'Logística Industrial', 'Líderes en procesos industriales y logística a nivel nacional.', NULL, NULL, 'Guayaquil', 'contacto@logísticaavanzada.com', '0990000015', 'aprobado', 'UG-DFAP-0015-PPP', 'PRACTICAS PREPROFESIONALES', '2024-02-10', '2029-02-10', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.instituciones VALUES (3, 17, 1, 'Global Systems', 'Empresa de Consultoría IT', '1234567890003', 'Consultoría IT', 'Desarrollamos soluciones integrales para el sector tecnológico.', NULL, NULL, 'Guayaquil', 'contacto@globalsystems.com', '0990000003', 'aprobado', 'UG-DFAP-0003-PPP', 'PRACTICAS PREPROFESIONALES', '2023-01-01', '2028-12-29', '2026-06-03 23:07:05.812737', '2026-06-10 15:05:02.728542');
INSERT INTO public.instituciones VALUES (1, 15, 1, 'Tech Solutions GYE', 'Empresa de Desarrollo Web', '1234567890001', 'Desarrollo Web', 'Desarrollamos soluciones integrales para el sector tecnológico.', 'www.ts.com', 'calle 10 de agosto', 'Guayaquil', 'contacto@techsolutionsgye.com', '0990000001', 'aprobado', 'UG-DFAP-0001-PPP', 'PRACTICAS PREPROFESIONALES', '2023-01-01', '2028-12-31', '2026-06-03 23:07:05.812737', '2026-06-10 15:38:34.276007');


--
-- TOC entry 5217 (class 0 OID 24372)
-- Dependencies: 228
-- Data for Name: perfiles_estudiante; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.perfiles_estudiante VALUES (2, 6, 1, 1, '9', 'Universidad de Guayaquil', 'Estudiante de la carrera de Software con conocimientos en Data Science, Machine Learning e Inteligencia Artificial. Ha desarrollado proyectos académicos utilizando Python para el análisis de grandes volúmenes de datos y la construcción de modelos predictivos. Posee experiencia en el uso de Pandas y Scikit-Learn para el procesamiento de datos, entrenamiento y evaluación de modelos de machine learning. Se caracteriza por su capacidad analítica para optimizar procesos mediante soluciones basadas en ciencia de datos e inteligencia artificial.', 'Desarrollo Web, Ciencia de Datos, backend, IA', NULL, '2026-06-03 23:07:05.812737', '2026-07-10 22:30:17.563014', false);
INSERT INTO public.perfiles_estudiante VALUES (3, 7, 1, 1, '8', 'Universidad de Guayaquil', 'Desarrollador web con experiencia en proyectos académicos usando MERN stack. Creador de sistema de inventario para pyme local.', 'Me interesa el desarrollo Backend y la arquitectura de software.', NULL, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737', false);
INSERT INTO public.perfiles_estudiante VALUES (4, 8, 1, 1, '8', 'Universidad de Guayaquil', 'Desarrollador web con experiencia en proyectos académicos usando MERN stack. Creador de sistema de inventario para pyme local.', 'Me interesa el desarrollo Backend y la arquitectura de software.', NULL, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737', false);
INSERT INTO public.perfiles_estudiante VALUES (5, 9, 1, 1, '8', 'Universidad de Guayaquil', 'Desarrollador web con experiencia en proyectos académicos usando MERN stack. Creador de sistema de inventario para pyme local.', 'Me interesa el desarrollo Backend y la arquitectura de software.', NULL, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737', false);
INSERT INTO public.perfiles_estudiante VALUES (6, 10, 2, 1, '7', 'Universidad de Guayaquil', 'Entusiasta de los datos. He participado en hackathons de análisis predictivo. Manejo de Python, Pandas y Scikit-Learn.', 'Inteligencia Artificial, Machine Learning, Análisis predictivo.', NULL, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737', false);
INSERT INTO public.perfiles_estudiante VALUES (8, 12, 3, 2, '8', 'Universidad de Guayaquil', 'Experiencia teórica y práctica en optimización de procesos mediante simuladores. Conocimiento en Lean Manufacturing.', 'Gestión de calidad, Mejora continua, Logística.', NULL, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737', false);
INSERT INTO public.perfiles_estudiante VALUES (9, 13, 3, 2, '8', 'Universidad de Guayaquil', 'Experiencia teórica y práctica en optimización de procesos mediante simuladores. Conocimiento en Lean Manufacturing.', 'Gestión de calidad, Mejora continua, Logística.', NULL, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737', false);
INSERT INTO public.perfiles_estudiante VALUES (10, 14, 3, 2, '8', 'Universidad de Guayaquil', 'Experiencia teórica y práctica en optimización de procesos mediante simuladores. Conocimiento en Lean Manufacturing.', 'Gestión de calidad, Mejora continua, Logística.', NULL, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737', false);
INSERT INTO public.perfiles_estudiante VALUES (1, 5, 1, 1, '9', 'Universidad de Guayaquil', 'Me especializo en el análisis profundo de información y la creación de sistemas inteligentes. Además de mi enfoque en algoritmos de aprendizaje automático, cuento con vasta experiencia en desarrollo de aplicaciones móviles multiplataforma usando Flutter, así como diseño de interfaces frontend con React y Tailwind CSS. ademas manejo agnetes de IA en diferentes modelos, con portocolos MCP y python ', 'Redes neuronales, Análisis estadístico, Desarrollo Frontend', NULL, '2026-06-03 23:07:05.812737', '2026-06-24 00:13:06.308624', false);
INSERT INTO public.perfiles_estudiante VALUES (7, 11, 2, 1, '9', 'Universidad de Guayaquil', 'Entusiasta de los datos. He participado en hackathons de análisis predictivo. Manejo de Python, Pandas y Scikit-Learn.', 'Inteligencia Artificial, Machine Learning, Análisis predictivo.', NULL, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737', false);


--
-- TOC entry 5219 (class 0 OID 24403)
-- Dependencies: 230
-- Data for Name: perfiles_gestor; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.perfiles_gestor VALUES (3, 4, 2, 3, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.perfiles_gestor VALUES (1, 2, 1, 1, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.perfiles_gestor VALUES (2, 3, 1, 2, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');


--
-- TOC entry 5233 (class 0 OID 24567)
-- Dependencies: 244
-- Data for Name: postulaciones; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.postulaciones VALUES (1, 8, 15, NULL, NULL, 'cancelada', 95.00, NULL, NULL, NULL, NULL, '2026-06-03 23:34:26.068696', '2026-06-03 23:34:32.19434', '[]', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (2, 8, 14, 14, '000002', 'aprobada', 71.00, '2026-06-03 23:41:32.923277', '2026-06-03 23:49:43.395523', NULL, 'Aprobado por el gestor de PPP', '2026-06-03 23:34:42.50472', '2026-06-03 23:49:43.395523', '[]', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (3, 1, 5, NULL, NULL, 'rechazada', 95.00, NULL, NULL, NULL, NULL, '2026-06-05 01:14:13.746907', '2026-06-10 14:09:55.777126', '[]', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (4, 1, 9, NULL, NULL, 'cancelada', 74.00, NULL, NULL, NULL, NULL, '2026-06-10 15:26:50.741945', '2026-06-10 15:27:02.888355', '[]', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (5, 1, 16, 1, '000005', 'aprobada', 67.00, '2026-06-10 15:27:36.96058', '2026-06-10 15:49:29.719912', NULL, 'Aprobado por el gestor de PPP', '2026-06-10 15:27:15.072374', '2026-06-10 15:49:29.719912', '[]', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (8, 1, 4, 4, '000008', 'reprobada', 71.00, '2026-06-10 16:03:43.940834', '2026-06-10 16:05:33.058211', NULL, 'Práctica reprobada', '2026-06-10 16:03:14.023028', '2026-06-10 16:05:33.058211', '[]', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (9, 1, 6, 6, '000009', 'aprobada', 67.00, '2026-06-10 16:07:01.573195', '2026-06-13 10:19:25.755152', NULL, 'Práctica aprobada exitosamente', '2026-06-10 16:06:28.727634', '2026-06-13 10:19:25.755152', '[]', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (10, 1, 18, 2, '000010', 'cancelada', 53.00, '2026-06-13 10:26:55.118971', '2026-06-13 10:31:14.132917', NULL, 'Práctica reprobada', '2026-06-13 10:23:09.147976', '2026-06-13 10:37:33.667932', '[{"nivel": 1, "habilidad_id": 13, "habilidad_nombre": "Machine Learning", "habilidad_categoria": "IA"}, {"nivel": 1, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}]', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (12, 1, 18, NULL, NULL, 'cancelada', 57.00, NULL, NULL, NULL, NULL, '2026-06-13 11:08:49.684096', '2026-06-13 11:09:00.256597', '[{"nivel": 1, "habilidad_id": 13, "habilidad_nombre": "Machine Learning", "habilidad_categoria": "IA"}, {"nivel": 1, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 24, "habilidad_nombre": ".NET", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 12, "habilidad_nombre": "Adobe XD", "habilidad_categoria": "Diseno"}, {"nivel": 3, "habilidad_id": 5, "habilidad_nombre": "SQL", "habilidad_categoria": "Base de Datos"}, {"nivel": 3, "habilidad_id": 36, "habilidad_nombre": "pyhton", "habilidad_categoria": "Manual"}]', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (31, 7, 17, NULL, NULL, 'rechazada_gestor', 44.00, '2026-06-25 23:16:55.221915', NULL, NULL, 'Rechazado por el gestor de PPP', '2026-06-25 23:15:47.317642', '2026-06-25 23:26:52.840375', '{"intereses": "Inteligencia Artificial, Machine Learning, Análisis predictivo.", "habilidades": [{"nivel": 5, "habilidad_id": 2, "habilidad_nombre": "Python", "habilidad_categoria": "Programacion"}, {"nivel": 4, "habilidad_id": 13, "habilidad_nombre": "Machine Learning", "habilidad_categoria": "IA"}, {"nivel": 4, "habilidad_id": 14, "habilidad_nombre": "Data Analysis", "habilidad_categoria": "Analisis"}], "resumen_experiencia": "Entusiasta de los datos. He participado en hackathons de análisis predictivo. Manejo de Python, Pandas y Scikit-Learn."}', '2026-06-28', '02:20:00', 'Presencial', 'avenida 10 de agosto', NULL);
INSERT INTO public.postulaciones VALUES (13, 1, 18, NULL, NULL, 'cancelada', 57.00, NULL, NULL, NULL, NULL, '2026-06-15 22:09:58.932823', '2026-06-15 22:10:12.217212', '[{"nivel": 1, "habilidad_id": 13, "habilidad_nombre": "Machine Learning", "habilidad_categoria": "IA"}, {"nivel": 1, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 24, "habilidad_nombre": ".NET", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 12, "habilidad_nombre": "Adobe XD", "habilidad_categoria": "Diseno"}, {"nivel": 3, "habilidad_id": 5, "habilidad_nombre": "SQL", "habilidad_categoria": "Base de Datos"}, {"nivel": 3, "habilidad_id": 36, "habilidad_nombre": "pyhton", "habilidad_categoria": "Manual"}, {"nivel": 3, "habilidad_id": 14, "habilidad_nombre": "Data Analysis", "habilidad_categoria": "Analisis"}]', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (14, 1, 18, NULL, NULL, 'rechazada', 57.00, NULL, NULL, NULL, NULL, '2026-06-15 22:11:19.368566', '2026-06-15 22:12:31.510664', '[{"nivel": 1, "habilidad_id": 13, "habilidad_nombre": "Machine Learning", "habilidad_categoria": "IA"}, {"nivel": 1, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 24, "habilidad_nombre": ".NET", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 12, "habilidad_nombre": "Adobe XD", "habilidad_categoria": "Diseno"}, {"nivel": 3, "habilidad_id": 5, "habilidad_nombre": "SQL", "habilidad_categoria": "Base de Datos"}, {"nivel": 3, "habilidad_id": 36, "habilidad_nombre": "pyhton", "habilidad_categoria": "Manual"}, {"nivel": 3, "habilidad_id": 14, "habilidad_nombre": "Data Analysis", "habilidad_categoria": "Analisis"}]', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (15, 1, 17, 1, '000015', 'aprobada', 52.00, '2026-06-15 22:14:00.132786', '2026-06-15 22:16:51.028958', NULL, 'Práctica aprobada exitosamente', '2026-06-15 22:13:15.941761', '2026-06-15 22:16:51.028958', '[{"nivel": 1, "habilidad_id": 13, "habilidad_nombre": "Machine Learning", "habilidad_categoria": "IA"}, {"nivel": 1, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 24, "habilidad_nombre": ".NET", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 12, "habilidad_nombre": "Adobe XD", "habilidad_categoria": "Diseno"}, {"nivel": 3, "habilidad_id": 5, "habilidad_nombre": "SQL", "habilidad_categoria": "Base de Datos"}, {"nivel": 3, "habilidad_id": 36, "habilidad_nombre": "pyhton", "habilidad_categoria": "Manual"}, {"nivel": 3, "habilidad_id": 14, "habilidad_nombre": "Data Analysis", "habilidad_categoria": "Analisis"}]', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (16, 1, 24, NULL, NULL, 'cancelada', 0.00, NULL, NULL, NULL, NULL, '2026-06-17 11:50:43.888565', '2026-06-17 11:57:31.245178', '[{"nivel": 3, "habilidad_id": 5, "habilidad_nombre": "SQL", "habilidad_categoria": "Base de Datos"}, {"nivel": 3, "habilidad_id": 12, "habilidad_nombre": "Adobe XD", "habilidad_categoria": "Diseno"}, {"nivel": 1, "habilidad_id": 13, "habilidad_nombre": "Machine Learning", "habilidad_categoria": "IA"}, {"nivel": 3, "habilidad_id": 14, "habilidad_nombre": "Data Analysis", "habilidad_categoria": "Analisis"}, {"nivel": 3, "habilidad_id": 16, "habilidad_nombre": "Docker", "habilidad_categoria": "DevOps"}, {"nivel": 3, "habilidad_id": 20, "habilidad_nombre": "Comunicacion", "habilidad_categoria": "Soft Skills"}, {"nivel": 3, "habilidad_id": 24, "habilidad_nombre": ".NET", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 36, "habilidad_nombre": "pyhton", "habilidad_categoria": "Manual"}, {"nivel": 1, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}]', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (18, 1, 24, 2, '000018', 'aprobada', 78.00, '2026-06-17 12:00:04.890012', '2026-06-18 07:15:11.338307', NULL, 'Práctica aprobada exitosamente', '2026-06-17 11:58:55.966084', '2026-06-18 07:15:11.338307', '[{"nivel": 3, "habilidad_id": 5, "habilidad_nombre": "SQL", "habilidad_categoria": "Base de Datos"}, {"nivel": 3, "habilidad_id": 12, "habilidad_nombre": "Adobe XD", "habilidad_categoria": "Diseno"}, {"nivel": 1, "habilidad_id": 13, "habilidad_nombre": "Machine Learning", "habilidad_categoria": "IA"}, {"nivel": 3, "habilidad_id": 14, "habilidad_nombre": "Data Analysis", "habilidad_categoria": "Analisis"}, {"nivel": 3, "habilidad_id": 16, "habilidad_nombre": "Docker", "habilidad_categoria": "DevOps"}, {"nivel": 3, "habilidad_id": 20, "habilidad_nombre": "Comunicacion", "habilidad_categoria": "Soft Skills"}, {"nivel": 3, "habilidad_id": 24, "habilidad_nombre": ".NET", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 36, "habilidad_nombre": "pyhton", "habilidad_categoria": "Manual"}, {"nivel": 1, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}]', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (19, 1, 23, 2, '000019', 'aprobada', 79.00, '2026-06-18 12:27:39.738783', '2026-06-19 21:50:11.289517', NULL, 'Práctica aprobada exitosamente', '2026-06-18 12:26:32.063383', '2026-06-19 21:50:11.289517', '[{"nivel": 3, "habilidad_id": 5, "habilidad_nombre": "SQL", "habilidad_categoria": "Base de Datos"}, {"nivel": 3, "habilidad_id": 12, "habilidad_nombre": "Adobe XD", "habilidad_categoria": "Diseno"}, {"nivel": 1, "habilidad_id": 13, "habilidad_nombre": "Machine Learning", "habilidad_categoria": "IA"}, {"nivel": 3, "habilidad_id": 14, "habilidad_nombre": "Data Analysis", "habilidad_categoria": "Analisis"}, {"nivel": 3, "habilidad_id": 20, "habilidad_nombre": "Comunicacion", "habilidad_categoria": "Soft Skills"}, {"nivel": 3, "habilidad_id": 36, "habilidad_nombre": "pyhton", "habilidad_categoria": "Manual"}, {"nivel": 1, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}]', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (17, 2, 23, 2, '000017', 'aprobada', 0.00, '2026-06-17 11:54:45.750792', '2026-06-19 21:50:14.746388', NULL, 'Práctica aprobada exitosamente', '2026-06-17 11:53:04.95756', '2026-06-19 21:50:14.746388', '[{"nivel": 5, "habilidad_id": 1, "habilidad_nombre": "JavaScript", "habilidad_categoria": "Programacion"}]', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (20, 2, 18, NULL, NULL, 'rechazada_gestor', 37.00, '2026-06-19 21:59:05.874125', NULL, NULL, 'Rechazado por el gestor de PPP', '2026-06-19 21:52:39.456038', '2026-06-19 22:34:18.196791', '[{"nivel": 5, "habilidad_id": 1, "habilidad_nombre": "JavaScript", "habilidad_categoria": "Programacion"}, {"nivel": 3, "habilidad_id": 20, "habilidad_nombre": "Comunicacion", "habilidad_categoria": "Soft Skills"}, {"nivel": 3, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 22, "habilidad_nombre": "Django", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 11, "habilidad_nombre": "Figma", "habilidad_categoria": "Diseno"}]', '2026-07-04', '06:55:00', 'Virtual', NULL, 'https://zoom.com');
INSERT INTO public.postulaciones VALUES (21, 2, 18, NULL, NULL, 'rechazada', 37.00, NULL, NULL, NULL, NULL, '2026-06-19 22:36:38.091756', '2026-06-19 22:41:22.280398', '[{"nivel": 5, "habilidad_id": 1, "habilidad_nombre": "JavaScript", "habilidad_categoria": "Programacion"}, {"nivel": 3, "habilidad_id": 20, "habilidad_nombre": "Comunicacion", "habilidad_categoria": "Soft Skills"}, {"nivel": 3, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 22, "habilidad_nombre": "Django", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 11, "habilidad_nombre": "Figma", "habilidad_categoria": "Diseno"}]', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (22, 2, 18, NULL, NULL, 'rechazada', 38.00, NULL, NULL, NULL, NULL, '2026-06-19 22:42:22.00711', '2026-06-19 22:50:35.371544', '[{"nivel": 5, "habilidad_id": 1, "habilidad_nombre": "JavaScript", "habilidad_categoria": "Programacion"}, {"nivel": 3, "habilidad_id": 20, "habilidad_nombre": "Comunicacion", "habilidad_categoria": "Soft Skills"}, {"nivel": 3, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 22, "habilidad_nombre": "Django", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 11, "habilidad_nombre": "Figma", "habilidad_categoria": "Diseno"}]', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (23, 2, 18, NULL, NULL, 'rechazada', 38.00, NULL, NULL, NULL, NULL, '2026-06-19 22:50:48.881402', '2026-06-19 23:00:13.991081', '{"intereses": "Desarrollo Web, Ciencia de Datos", "habilidades": [{"nivel": 5, "habilidad_id": 1, "habilidad_nombre": "JavaScript", "habilidad_categoria": "Programacion"}, {"nivel": 3, "habilidad_id": 20, "habilidad_nombre": "Comunicacion", "habilidad_categoria": "Soft Skills"}, {"nivel": 3, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 22, "habilidad_nombre": "Django", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 11, "habilidad_nombre": "Figma", "habilidad_categoria": "Diseno"}], "resumen_experiencia": "pasantias en Aneupi, trabajo con react y postgre, y muchas cosas mas"}', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (24, 2, 25, NULL, NULL, 'rechazada', 50.00, NULL, NULL, NULL, NULL, '2026-06-19 23:02:00.274571', '2026-06-19 23:48:55.938439', '{"intereses": "Desarrollo Web, Ciencia de Datos", "habilidades": [{"nivel": 5, "habilidad_id": 1, "habilidad_nombre": "JavaScript", "habilidad_categoria": "Programacion"}, {"nivel": 3, "habilidad_id": 20, "habilidad_nombre": "Comunicacion", "habilidad_categoria": "Soft Skills"}, {"nivel": 3, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 22, "habilidad_nombre": "Django", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 11, "habilidad_nombre": "Figma", "habilidad_categoria": "Diseno"}, {"nivel": 3, "habilidad_id": 16, "habilidad_nombre": "Docker", "habilidad_categoria": "DevOps"}, {"nivel": 3, "habilidad_id": 9, "habilidad_nombre": "Excel", "habilidad_categoria": "Herramientas"}], "resumen_experiencia": "pasantias en Aneupi, trabajo con react y postgre, y muchas cosas mas en el ambito de el analisis de datos"}', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (32, 7, 17, NULL, NULL, 'aceptada_empresa', 44.00, '2026-06-25 23:28:48.341251', NULL, NULL, NULL, '2026-06-25 23:27:43.866153', '2026-06-25 23:28:48.341251', '{"intereses": "Inteligencia Artificial, Machine Learning, Análisis predictivo.", "habilidades": [{"nivel": 5, "habilidad_id": 2, "habilidad_nombre": "Python", "habilidad_categoria": "Programacion"}, {"nivel": 4, "habilidad_id": 13, "habilidad_nombre": "Machine Learning", "habilidad_categoria": "IA"}, {"nivel": 4, "habilidad_id": 14, "habilidad_nombre": "Data Analysis", "habilidad_categoria": "Analisis"}], "resumen_experiencia": "Entusiasta de los datos. He participado en hackathons de análisis predictivo. Manejo de Python, Pandas y Scikit-Learn."}', '2026-06-28', '23:30:00', 'Presencial', '10 de agosto', NULL);
INSERT INTO public.postulaciones VALUES (26, 2, 17, 1, '000026', 'reprobada', 56.00, '2026-06-20 01:00:12.632679', '2026-06-21 23:36:33.617821', NULL, 'Práctica reprobada', '2026-06-20 00:59:13.633179', '2026-06-21 23:36:33.617821', '{"intereses": "Desarrollo Web, Ciencia de Datos, backend, IA", "habilidades": [{"nivel": 5, "habilidad_id": 1, "habilidad_nombre": "JavaScript", "habilidad_categoria": "Programacion"}, {"nivel": 3, "habilidad_id": 14, "habilidad_nombre": "Data Analysis", "habilidad_categoria": "Analisis"}, {"nivel": 3, "habilidad_id": 21, "habilidad_nombre": "Flask", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 22, "habilidad_nombre": "Django", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 23, "habilidad_nombre": "C#", "habilidad_categoria": "Programacion"}, {"nivel": 3, "habilidad_id": 27, "habilidad_nombre": "Angular", "habilidad_categoria": "Frontend"}, {"nivel": 3, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 38, "habilidad_nombre": "Flutter", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 39, "habilidad_nombre": "CSS", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 40, "habilidad_nombre": "depp learning", "habilidad_categoria": "Manual"}], "resumen_experiencia": " analisis de datos, en modelos NLP y similutud semantica orientado al depp learning y al machine learning"}', '2026-06-25', '03:02:00', 'Presencial', 'avenida 23', NULL);
INSERT INTO public.postulaciones VALUES (30, 2, 17, 1, '000030', 'reprobada', 42.00, '2026-06-24 11:35:43.93151', '2026-06-26 22:12:23.981026', NULL, 'Práctica reprobada', '2026-06-24 11:33:12.490241', '2026-06-26 22:12:23.981026', '{"intereses": "Desarrollo Web, Ciencia de Datos, backend, IA", "habilidades": [{"nivel": 3, "habilidad_id": 11, "habilidad_nombre": "Figma", "habilidad_categoria": "Diseno"}, {"nivel": 3, "habilidad_id": 14, "habilidad_nombre": "Data Analysis", "habilidad_categoria": "Analisis"}, {"nivel": 3, "habilidad_id": 15, "habilidad_nombre": "AWS", "habilidad_categoria": "Cloud"}, {"nivel": 3, "habilidad_id": 16, "habilidad_nombre": "Docker", "habilidad_categoria": "DevOps"}, {"nivel": 3, "habilidad_id": 21, "habilidad_nombre": "Flask", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 23, "habilidad_nombre": "C#", "habilidad_categoria": "Programacion"}, {"nivel": 3, "habilidad_id": 24, "habilidad_nombre": ".NET", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 40, "habilidad_nombre": "depp learning", "habilidad_categoria": "Manual"}], "resumen_experiencia": " analisis de datos, en modelos NLP y similutud semantica orientado al depp learning y al machine learning en la big data, para porcesos especializados en backen y menjo de informacion "}', '2026-06-27', '15:36:00', 'Presencial', '10 de agosto', NULL);
INSERT INTO public.postulaciones VALUES (25, 2, 17, 1, '000025', 'aprobada', 62.00, '2026-06-20 00:46:49.417589', '2026-06-20 00:56:49.987174', NULL, 'Práctica aprobada exitosamente', '2026-06-19 23:49:04.529945', '2026-06-20 00:56:49.987174', '{"intereses": "Desarrollo Web, Ciencia de Datos", "habilidades": [{"nivel": 5, "habilidad_id": 1, "habilidad_nombre": "JavaScript", "habilidad_categoria": "Programacion"}, {"nivel": 3, "habilidad_id": 11, "habilidad_nombre": "Figma", "habilidad_categoria": "Diseno"}, {"nivel": 3, "habilidad_id": 14, "habilidad_nombre": "Data Analysis", "habilidad_categoria": "Analisis"}, {"nivel": 3, "habilidad_id": 15, "habilidad_nombre": "AWS", "habilidad_categoria": "Cloud"}, {"nivel": 3, "habilidad_id": 16, "habilidad_nombre": "Docker", "habilidad_categoria": "DevOps"}, {"nivel": 3, "habilidad_id": 20, "habilidad_nombre": "Comunicacion", "habilidad_categoria": "Soft Skills"}, {"nivel": 3, "habilidad_id": 21, "habilidad_nombre": "Flask", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 22, "habilidad_nombre": "Django", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 23, "habilidad_nombre": "C#", "habilidad_categoria": "Programacion"}, {"nivel": 3, "habilidad_id": 27, "habilidad_nombre": "Angular", "habilidad_categoria": "Frontend"}, {"nivel": 3, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 38, "habilidad_nombre": "Flutter", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 39, "habilidad_nombre": "CSS", "habilidad_categoria": null}], "resumen_experiencia": "pasantias en Aneupi, trabajo con react y postgre, y muchas cosas mas en el ambito de el analisis de datos, en modelos NLP y similutud semantica"}', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (27, 2, 26, NULL, NULL, 'cancelada', 55.00, NULL, NULL, NULL, NULL, '2026-06-21 23:36:49.033007', '2026-06-22 00:31:16.594874', '{"intereses": "Desarrollo Web, Ciencia de Datos, backend, IA", "habilidades": [{"nivel": 3, "habilidad_id": 15, "habilidad_nombre": "AWS", "habilidad_categoria": "Cloud"}, {"nivel": 3, "habilidad_id": 16, "habilidad_nombre": "Docker", "habilidad_categoria": "DevOps"}, {"nivel": 3, "habilidad_id": 21, "habilidad_nombre": "Flask", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 23, "habilidad_nombre": "C#", "habilidad_categoria": "Programacion"}, {"nivel": 3, "habilidad_id": 24, "habilidad_nombre": ".NET", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 27, "habilidad_nombre": "Angular", "habilidad_categoria": "Frontend"}, {"nivel": 3, "habilidad_id": 38, "habilidad_nombre": "Flutter", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 39, "habilidad_nombre": "CSS", "habilidad_categoria": null}], "resumen_experiencia": " analisis de datos, en modelos NLP y similutud semantica orientado al depp learning y al machine learning"}', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (28, 2, 26, NULL, NULL, 'cancelada', 53.00, NULL, NULL, NULL, NULL, '2026-06-23 22:44:10.855257', '2026-06-24 11:31:26.6491', '{"intereses": "Desarrollo Web, Ciencia de Datos, backend, IA", "habilidades": [{"nivel": 3, "habilidad_id": 11, "habilidad_nombre": "Figma", "habilidad_categoria": "Diseno"}, {"nivel": 3, "habilidad_id": 14, "habilidad_nombre": "Data Analysis", "habilidad_categoria": "Analisis"}, {"nivel": 3, "habilidad_id": 15, "habilidad_nombre": "AWS", "habilidad_categoria": "Cloud"}, {"nivel": 3, "habilidad_id": 16, "habilidad_nombre": "Docker", "habilidad_categoria": "DevOps"}, {"nivel": 3, "habilidad_id": 21, "habilidad_nombre": "Flask", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 23, "habilidad_nombre": "C#", "habilidad_categoria": "Programacion"}, {"nivel": 3, "habilidad_id": 24, "habilidad_nombre": ".NET", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 27, "habilidad_nombre": "Angular", "habilidad_categoria": "Frontend"}, {"nivel": 3, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 38, "habilidad_nombre": "Flutter", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 39, "habilidad_nombre": "CSS", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 40, "habilidad_nombre": "depp learning", "habilidad_categoria": "Manual"}], "resumen_experiencia": " analisis de datos, en modelos NLP y similutud semantica orientado al depp learning y al machine learning"}', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (29, 1, 26, 1, '000029', 'aprobada', 64.00, '2026-06-24 00:15:00.101735', '2026-06-24 00:15:27.57776', NULL, 'Práctica aprobada exitosamente', '2026-06-24 00:13:19.105619', '2026-06-24 00:15:27.57776', '{"intereses": "Redes neuronales, Análisis estadístico, Desarrollo Frontend", "habilidades": [{"nivel": 3, "habilidad_id": 5, "habilidad_nombre": "SQL", "habilidad_categoria": "Base de Datos"}, {"nivel": 3, "habilidad_id": 12, "habilidad_nombre": "Adobe XD", "habilidad_categoria": "Diseno"}, {"nivel": 1, "habilidad_id": 13, "habilidad_nombre": "Machine Learning", "habilidad_categoria": "IA"}, {"nivel": 3, "habilidad_id": 14, "habilidad_nombre": "Data Analysis", "habilidad_categoria": "Analisis"}, {"nivel": 3, "habilidad_id": 20, "habilidad_nombre": "Comunicacion", "habilidad_categoria": "Soft Skills"}, {"nivel": 3, "habilidad_id": 36, "habilidad_nombre": "pyhton", "habilidad_categoria": "Manual"}, {"nivel": 1, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 40, "habilidad_nombre": "depp learning", "habilidad_categoria": "Manual"}, {"nivel": 3, "habilidad_id": 22, "habilidad_nombre": "Django", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 16, "habilidad_nombre": "Docker", "habilidad_categoria": "DevOps"}, {"nivel": 3, "habilidad_id": 9, "habilidad_nombre": "Excel", "habilidad_categoria": "Herramientas"}], "resumen_experiencia": "Me especializo en el análisis profundo de información y la creación de sistemas inteligentes. Además de mi enfoque en algoritmos de aprendizaje automático, cuento con vasta experiencia en desarrollo de aplicaciones móviles multiplataforma usando Flutter, así como diseño de interfaces frontend con React y Tailwind CSS. ademas manejo agnetes de IA en diferentes modelos, con portocolos MCP y python "}', '2026-06-26', '01:17:00', 'Presencial', 'dasdsad', NULL);
INSERT INTO public.postulaciones VALUES (34, 1, 1, NULL, NULL, 'cancelada', 41.00, NULL, NULL, NULL, NULL, '2026-06-28 14:18:52.164917', '2026-06-28 14:18:52.164917', '{"intereses": "Redes neuronales, Análisis estadístico, Desarrollo Frontend", "habilidades": [{"nivel": 3, "habilidad_id": 5, "habilidad_nombre": "SQL", "habilidad_categoria": "Base de Datos"}, {"nivel": 3, "habilidad_id": 12, "habilidad_nombre": "Adobe XD", "habilidad_categoria": "Diseno"}, {"nivel": 1, "habilidad_id": 13, "habilidad_nombre": "Machine Learning", "habilidad_categoria": "IA"}, {"nivel": 3, "habilidad_id": 14, "habilidad_nombre": "Data Analysis", "habilidad_categoria": "Analisis"}, {"nivel": 3, "habilidad_id": 20, "habilidad_nombre": "Comunicacion", "habilidad_categoria": "Soft Skills"}, {"nivel": 3, "habilidad_id": 36, "habilidad_nombre": "pyhton", "habilidad_categoria": "Manual"}, {"nivel": 1, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 40, "habilidad_nombre": "depp learning", "habilidad_categoria": "Manual"}, {"nivel": 3, "habilidad_id": 22, "habilidad_nombre": "Django", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 16, "habilidad_nombre": "Docker", "habilidad_categoria": "DevOps"}, {"nivel": 3, "habilidad_id": 9, "habilidad_nombre": "Excel", "habilidad_categoria": "Herramientas"}], "resumen_experiencia": "Me especializo en el análisis profundo de información y la creación de sistemas inteligentes. Además de mi enfoque en algoritmos de aprendizaje automático, cuento con vasta experiencia en desarrollo de aplicaciones móviles multiplataforma usando Flutter, así como diseño de interfaces frontend con React y Tailwind CSS. ademas manejo agnetes de IA en diferentes modelos, con portocolos MCP y python "}', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.postulaciones VALUES (33, 2, 17, 1, '000033', 'aprobada', 54.00, '2026-06-26 22:29:15.979199', '2026-07-09 00:06:26.615506', NULL, 'Práctica aprobada exitosamente', '2026-06-26 22:15:13.040584', '2026-07-09 00:06:26.615506', '{"intereses": "Desarrollo Web, Ciencia de Datos, backend, IA", "habilidades": [{"nivel": 3, "habilidad_id": 14, "habilidad_nombre": "Data Analysis", "habilidad_categoria": "Analisis"}, {"nivel": 3, "habilidad_id": 16, "habilidad_nombre": "Docker", "habilidad_categoria": "DevOps"}, {"nivel": 3, "habilidad_id": 21, "habilidad_nombre": "Flask", "habilidad_categoria": "Backend"}, {"nivel": 3, "habilidad_id": 36, "habilidad_nombre": "pyhton", "habilidad_categoria": "Manual"}, {"nivel": 3, "habilidad_id": 37, "habilidad_nombre": "Data Science", "habilidad_categoria": null}, {"nivel": 3, "habilidad_id": 40, "habilidad_nombre": "depp learning", "habilidad_categoria": "Manual"}], "resumen_experiencia": " analisis de datos, en modelos NLP y similutud semantica orientado al depp learning y al machine learning en la big data, para porcesos especializados en backen y menjo de informacion "}', '2026-06-28', '12:45:00', 'Presencial', 'Via Daule calle 10 de agosto', NULL);


--
-- TOC entry 5209 (class 0 OID 24304)
-- Dependencies: 220
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.roles VALUES (1, 'estudiante', 'Estudiante de la Carrera');
INSERT INTO public.roles VALUES (2, 'empresa', 'Empresa o Institución con convenio');
INSERT INTO public.roles VALUES (3, 'gestor', 'Gestor de practicas preprofesionales');
INSERT INTO public.roles VALUES (4, 'admin', 'Administrador tecnico del sistema');


--
-- TOC entry 5223 (class 0 OID 24459)
-- Dependencies: 234
-- Data for Name: supervisores; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.supervisores VALUES (1, 1, 'Cedula', '0999999901', 'Supervisor 1', 'Apellido 1', 'sup1@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001101', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores VALUES (2, 2, 'Cedula', '0999999902', 'Supervisor 2', 'Apellido 2', 'sup2@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001102', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores VALUES (3, 3, 'Cedula', '0999999903', 'Supervisor 3', 'Apellido 3', 'sup3@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001103', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores VALUES (4, 4, 'Cedula', '0999999904', 'Supervisor 4', 'Apellido 4', 'sup4@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001104', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores VALUES (5, 5, 'Cedula', '0999999905', 'Supervisor 5', 'Apellido 5', 'sup5@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001105', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores VALUES (6, 6, 'Cedula', '0999999906', 'Supervisor 6', 'Apellido 6', 'sup6@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001106', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores VALUES (7, 7, 'Cedula', '0999999907', 'Supervisor 7', 'Apellido 7', 'sup7@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001107', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores VALUES (8, 8, 'Cedula', '0999999908', 'Supervisor 8', 'Apellido 8', 'sup8@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001108', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores VALUES (9, 9, 'Cedula', '0999999909', 'Supervisor 9', 'Apellido 9', 'sup9@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001109', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores VALUES (10, 10, 'Cedula', '0999999910', 'Supervisor 10', 'Apellido 10', 'sup10@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001110', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores VALUES (11, 11, 'Cedula', '0999999911', 'Supervisor 11', 'Apellido 11', 'sup11@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001111', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores VALUES (12, 12, 'Cedula', '0999999912', 'Supervisor 12', 'Apellido 12', 'sup12@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001112', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores VALUES (13, 13, 'Cedula', '0999999913', 'Supervisor 13', 'Apellido 13', 'sup13@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001113', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores VALUES (14, 14, 'Cedula', '0999999914', 'Supervisor 14', 'Apellido 14', 'sup14@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001114', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores VALUES (15, 15, 'Cedula', '0999999915', 'Supervisor 15', 'Apellido 15', 'sup15@empresa.com', 'Recursos Humanos', 'Gerente de RRHH', '0990001115', NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.supervisores VALUES (16, 1, 'Cedula', '33123123', 'juan', 'acasyt', 'dasdasdasd', 'asdasdasd', 'asdasa', '34535345', NULL, false, '2026-06-10 14:58:25.562893', '2026-06-10 14:58:25.562893');


--
-- TOC entry 5211 (class 0 OID 24315)
-- Dependencies: 222
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.usuarios VALUES (1, '0900000001', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Admin', 'Sistema', 'admin@ug.edu.ec', '0999000000', 4, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (4, '0900000004', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Luisa', 'Méndez', 'luisa.mendez@ug.edu.ec', '0997777773', 3, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (7, '1312657255', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Jorge David', 'Intriago Loor', 'jorge.intriagoloo@ug.edu.ec', '09900007', 1, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (8, '0911223344', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Maria Fernanda', 'Gómez Silva', 'maria.gomez@ug.edu.ec', '09900008', 1, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (9, '0922334455', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Luis Antonio', 'Pérez Castro', 'luis.perez@ug.edu.ec', '09900009', 1, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (10, '0933445566', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Ana Sofía', 'Martínez Vera', 'ana.martinez@ug.edu.ec', '099000010', 1, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (12, '0955667788', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Gabriela Elena', 'Vera Loor', 'gabriela.vera@ug.edu.ec', '099000012', 1, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (13, '0966778899', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Carlos Alberto', 'Mora Sánchez', 'carlos.mora@ug.edu.ec', '099000013', 1, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (14, '0977889900', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Diana Carolina', 'Silva Torres', 'diana.silva@ug.edu.ec', '099000014', 1, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (16, '0990161100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Pedro', 'Sanchez', 'contacto@innovasoft.com', '099000016', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (18, '0990181100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Carla', 'Ruiz', 'rrhh@clouddevs.com', '099000018', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (19, '0990191100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Jorge', 'Moreno', 'rrhh@appworks.com', '099000019', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (20, '0990201100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Elena', 'Vargas', 'rrhh@fintechsolutions.com', '099000020', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (21, '0990211100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Andres', 'Rojas', 'rrhh@cybersecurityec.com', '099000021', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (22, '0990221100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Sofia', 'Mendoza', 'rrhh@smartcode.com', '099000022', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (23, '0990231100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Mario', 'Castro', 'rrhh@nexustech.com', '099000023', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (24, '0990241100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Laura', 'Guzman', 'rrhh@devmasters.com', '099000024', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (25, '0990251100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Roberto', 'Luna', 'rrhh@datamindgye.com', '099000025', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (26, '0990261100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Valeria', 'Pinto', 'contacto@aivision.com', '099000026', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (27, '0990271100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Jose', 'Mieles', 'rrhh@metricasec.com', '099000027', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (28, '0990281100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Carmen', 'Salas', 'rrhh@induproduccion.com', '099000028', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (6, '0942646266', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Naldo Jonnel', 'Anchundia Caicedo', 'naldoanchundiac@ug.edu.ec', '0990020956', 1, NULL, true, '2026-06-03 23:07:05.812737', '2026-07-10 22:30:17.504249');
INSERT INTO public.usuarios VALUES (5, '0955236773', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Bryan Guillermo', 'Galarza Indacochea', 'bryan.galarzaind@ug.edu.ec', '09900005', 1, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-24 00:13:06.270765');
INSERT INTO public.usuarios VALUES (3, '0900000003', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Carlos Eduardo', 'Ruiz', 'naldo.anchundiac@ug.edu.ec', '0997777772', 3, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (11, '0944556677', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Pedro José', 'Castro Mendoza', 'pedro.castro@ug.edu.ec', '099000011', 1, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (2, '0900000002', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Juan', 'Perez', 'juan@ug.edu.ec', '099000012', 3, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-05 14:14:45.722394');
INSERT INTO public.usuarios VALUES (17, '0990171100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Luis', 'Fernandez', 'rrhh@globalsystems.com', '099000017', 2, NULL, false, '2026-06-03 23:07:05.812737', '2026-06-10 15:05:03.263801');
INSERT INTO public.usuarios VALUES (15, '0990151100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Ana', 'Garcia', 'rrhh@techsolutionsgye.com', '099000015', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (29, '0990291100', '$2b$12$N1z3kpDufIcmwp7xTnt.u.ufRsPGZ7cJDBU1VXpZR/N1nsTpSIK.e', 'Victor', 'Lino', 'contacto@logisticaavanzada.com', '099000029', 2, NULL, true, '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.usuarios VALUES (30, '0987654321', '$2b$12$6Q6bNdqTZKKXjxPXVgX6z.pUShdd/pHnaRyr.RcInMZJaNbgHVWta', 'Jonnel', 'Anchundia', 'jonnel@ug.edu.ec', '0990020956', 4, NULL, true, '2026-06-10 14:55:59.779641', '2026-06-10 14:55:59.779641');


--
-- TOC entry 5229 (class 0 OID 24516)
-- Dependencies: 240
-- Data for Name: vacantes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.vacantes VALUES (2, 2, 2, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes VALUES (3, 3, 3, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes VALUES (4, 4, 4, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes VALUES (6, 6, 6, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes VALUES (7, 7, 7, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes VALUES (8, 8, 8, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes VALUES (10, 10, 10, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes VALUES (12, 12, 12, 'Analista de Datos Junior', 'Data', 'Únete a nuestro equipo de análisis. Participarás en la limpieza, transformación y visualización de datos para la toma de decisiones estratégicas.', '- Conocimientos en Python (Pandas, Numpy).
- Entendimiento de estadística descriptiva.
- Manejo básico de herramientas de BI.', 'Remoto', 'Guayaquil', 240, 6, '09:00 a 15:00', 1, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes VALUES (13, 13, 13, 'Analista de Datos Junior', 'Data', 'Únete a nuestro equipo de análisis. Participarás en la limpieza, transformación y visualización de datos para la toma de decisiones estratégicas.', '- Conocimientos en Python (Pandas, Numpy).
- Entendimiento de estadística descriptiva.
- Manejo básico de herramientas de BI.', 'Remoto', 'Guayaquil', 240, 6, '09:00 a 15:00', 1, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes VALUES (14, 14, 14, 'Pasante de Optimización de Procesos', 'Producción', 'Buscamos talento para nuestra área de mejora continua. Colaborarás en la identificación de cuellos de botella y aplicación de metodologías Lean.', '- Estudiante de últimos semestres de Ing. en Producción.
- Conocimientos teóricos de Lean Manufacturing.
- Manejo de Excel avanzado.
- Proactividad.', 'Presencial', 'Durán', 240, 6, '07:00 a 13:00', 2, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes VALUES (15, 15, 15, 'Pasante de Optimización de Procesos', 'Producción', 'Buscamos talento para nuestra área de mejora continua. Colaborarás en la identificación de cuellos de botella y aplicación de metodologías Lean.', '- Estudiante de últimos semestres de Ing. en Producción.
- Conocimientos teóricos de Lean Manufacturing.
- Manejo de Excel avanzado.
- Proactividad.', 'Presencial', 'Durán', 240, 6, '07:00 a 13:00', 2, true, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes VALUES (5, 5, 5, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, false, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes VALUES (16, 1, 1, 'ffsdddddddddd', 'Redes y Telecomunicaciones', 'sfddddddddddddddddfsssssssssssssssssssssssssssssss', 'fdssssssssssssssssssssssss', 'Presencial', 'Guayaquil', 144, 6, 'Lunes a Viernes', 4, false, '2026-07-03', '2026-06-04 18:36:44.039418', '2026-06-12 00:11:28.869286');
INSERT INTO public.vacantes VALUES (1, 1, 1, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, false, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes VALUES (11, 11, 11, 'Analista de Datos Junior', 'Data', 'Únete a nuestro equipo de análisis. Participarás en la limpieza, transformación y visualización de datos para la toma de decisiones estratégicas.', '- Conocimientos en Python (Pandas, Numpy).
- Entendimiento de estadística descriptiva.
- Manejo básico de herramientas de BI.', 'Remoto', 'Guayaquil', 240, 6, '09:00 a 15:00', 1, false, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes VALUES (25, 2, NULL, 'Practicas en Ingenieria de Datos y Backend', 'Backend', 'Desarrollo de pipelines de datos y microservicios orientados al analisis de informacion en el ecosistema Microsoft. Apoyo en la arquitectura de software.', 'Conocimientos en .NET y bases de datos relacionales como SQL. Interes en la implementacion de algoritmos.', 'Hibrido', 'Cuenca', 160, 6, '09:00 - 15:00', 3, true, NULL, '2026-06-16 22:47:55.982702', '2026-06-16 22:47:55.982702');
INSERT INTO public.vacantes VALUES (24, 2, NULL, 'Practicas en Desarrollo de Software Multiplataforma', 'Desarrollo', 'Apoyo en el desarrollo de aplicaciones. Tareas orientadas a la integracion de interfaces frontend y manipulacion de bases de datos con SQL y pyhton para el backend.', 'Manejo de pyhton, SQL y Data Analysis. Uso de Adobe XD para diseno de interfaces.', 'Presencial', 'Quito', 160, 6, '08:00 - 14:00', 1, false, NULL, '2026-06-16 22:47:55.982702', '2026-06-16 22:47:55.982702');
INSERT INTO public.vacantes VALUES (23, 2, NULL, 'Practicas en Data Science e IA', 'Tecnologia', 'Participacion en el analisis profundo de informacion y creacion de sistemas inteligentes. Apoyo en el entrenamiento de redes neuronales y algoritmos de aprendizaje automatico para extraer valor de los datos.', 'Conocimiento en Data Science y Machine Learning. Manejo de pyhton y SQL. Interes en analisis estadistico y modelos de IA avanzados.', 'Remoto', 'Guayaquil', 160, 6, '09:00 - 15:00', 2, false, NULL, '2026-06-16 22:47:55.982702', '2026-06-16 22:47:55.982702');
INSERT INTO public.vacantes VALUES (26, 1, 1, 'Desarrollo de Software Móvil y Servicios Web', 'Desarrollo mobil', 'Participación en la construcción de soluciones para dispositivos celulares y tablets. Las actividades principales involucran el consumo de APIs, la estructuración de interfaces de usuario ágiles y la persistencia de información en sistemas relacionales del lado del servidor.', 'Se requiere destreza armando pantallas interactivas multiplataforma. Nociones sólidas en la creación de endpoints y administración de tablas de datos. Interés por la experiencia de usuario (UX) y el rendimiento en la nube.', 'Híbrido', 'Guayaquil', 144, 6, 'Lunes a Viernes', 1, false, '2026-07-11', '2026-06-20 10:45:04.778491', '2026-06-22 00:04:03.535112');
INSERT INTO public.vacantes VALUES (9, 9, 9, 'Desarrollador Backend Junior', 'Tecnología', 'Buscamos un estudiante apasionado por el desarrollo backend para unirse a nuestro equipo. Trabajarás en proyectos reales aplicando metodologías ágiles.', '- Estudiante de 7mo semestre en adelante.
- Sólidos conocimientos en algoritmos y POO.
- Experiencia básica con bases de datos relacionales.
- Capacidad analítica y resolución de problemas.', 'Híbrido', 'Guayaquil', 240, 6, '08:00 a 14:00', 2, false, '2027-12-31', '2026-06-03 23:07:05.812737', '2026-06-03 23:07:05.812737');
INSERT INTO public.vacantes VALUES (17, 1, 1, 'Análisis de Datos y Desarrollo Web', 'sistemas', 'Buscamos un estudiante de Ingeniería en Software o carreras afines para apoyar en el análisis de datos y el desarrollo de soluciones web internas. El practicante participará en la limpieza y procesamiento de datos, generación de reportes, automatización de tareas mediante scripts y apoyo en el desarrollo de módulos web utilizando tecnologías frontend y backend. Tendrá la oportunidad de trabajar con datos reales y colaborar con equipos multidisciplinarios en proyectos tecnológicos.', 'Requisitos en texto
Estudiante de Ingeniería en Software, Sistemas o carreras afines (5to semestre en adelante).
Conocimientos de Python para análisis y procesamiento de datos.
Manejo básico de Pandas y NumPy.
Conocimientos de estadística descriptiva.
Conocimientos de JavaScript para desarrollo web.
Capacidad para interpretar y visualizar información.
Conocimientos básicos de bases de datos relacionales.
Habilidades de comunicación y trabajo en equipo.
Deseable experiencia académica en proyectos de análisis de datos o desarrollo web.', 'Remoto', 'Guayaquil', 144, 6, 'Lunes a Viernes', 4, false, '2026-06-28', '2026-06-11 23:02:24.150012', '2026-06-15 21:51:20.663159');
INSERT INTO public.vacantes VALUES (18, 2, 2, 'Data Scientist / Ingeniero Machine Learning', 'Tecnología', 'Buscamos un estudiante de la carrera de Software con interés en Ciencia de Datos, Machine Learning e Inteligencia Artificial para apoyar en el desarrollo de proyectos de análisis de datos y modelos predictivos. El candidato participará en el procesamiento, limpieza y análisis de grandes volúmenes de información utilizando Python, Pandas y Scikit-Learn, contribuyendo a la optimización de procesos mediante soluciones basadas en datos. Se valorará la capacidad analítica, el aprendizaje continuo y el interés por desarrollar modelos de machine learning aplicados a problemas reales.', 'Estudiante de la carrera de Software.
Conocimientos en Inteligencia Artificial.
Conocimientos en Machine Learning.
Conocimientos en Ciencia de Datos (Data Science).
Manejo de Python.
Experiencia académica utilizando Pandas.
Conocimientos en Scikit-Learn.
Conocimientos en análisis y procesamiento de datos.
Interés en el desarrollo de modelos predictivos.
Capacidad analítica para la optimización de procesos.', 'Remoto', 'Guayaquil', 240, 6, 'Matutino', 2, true, '2026-07-17', '2026-06-11 23:51:57.854018', '2026-07-09 00:16:23.199667');


--
-- TOC entry 5255 (class 0 OID 0)
-- Dependencies: 245
-- Name: cache_afinidad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cache_afinidad_id_seq', 926, true);


--
-- TOC entry 5256 (class 0 OID 0)
-- Dependencies: 225
-- Name: carreras_carrera_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.carreras_carrera_id_seq', 3, true);


--
-- TOC entry 5257 (class 0 OID 0)
-- Dependencies: 223
-- Name: facultades_facultad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.facultades_facultad_id_seq', 2, true);


--
-- TOC entry 5258 (class 0 OID 0)
-- Dependencies: 237
-- Name: habilidades_estudiante_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.habilidades_estudiante_id_seq', 432, true);


--
-- TOC entry 5259 (class 0 OID 0)
-- Dependencies: 235
-- Name: habilidades_habilidad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.habilidades_habilidad_id_seq', 40, true);


--
-- TOC entry 5260 (class 0 OID 0)
-- Dependencies: 241
-- Name: habilidades_vacante_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.habilidades_vacante_id_seq', 138, true);


--
-- TOC entry 5261 (class 0 OID 0)
-- Dependencies: 231
-- Name: instituciones_institucion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.instituciones_institucion_id_seq', 15, true);


--
-- TOC entry 5262 (class 0 OID 0)
-- Dependencies: 227
-- Name: perfiles_estudiante_perfil_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.perfiles_estudiante_perfil_id_seq', 10, true);


--
-- TOC entry 5263 (class 0 OID 0)
-- Dependencies: 229
-- Name: perfiles_gestor_perfil_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.perfiles_gestor_perfil_id_seq', 3, true);


--
-- TOC entry 5264 (class 0 OID 0)
-- Dependencies: 243
-- Name: postulaciones_postulacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.postulaciones_postulacion_id_seq', 34, true);


--
-- TOC entry 5265 (class 0 OID 0)
-- Dependencies: 219
-- Name: roles_rol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_rol_id_seq', 4, true);


--
-- TOC entry 5266 (class 0 OID 0)
-- Dependencies: 233
-- Name: supervisores_supervisor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.supervisores_supervisor_id_seq', 16, true);


--
-- TOC entry 5267 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuarios_usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuarios_usuario_id_seq', 30, true);


--
-- TOC entry 5268 (class 0 OID 0)
-- Dependencies: 239
-- Name: vacantes_vacante_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.vacantes_vacante_id_seq', 26, true);


--
-- TOC entry 5034 (class 2606 OID 24859)
-- Name: cache_afinidad cache_afinidad_estudiante_id_vacante_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache_afinidad
    ADD CONSTRAINT cache_afinidad_estudiante_id_vacante_id_key UNIQUE (estudiante_id, vacante_id);


--
-- TOC entry 5036 (class 2606 OID 24857)
-- Name: cache_afinidad cache_afinidad_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache_afinidad
    ADD CONSTRAINT cache_afinidad_pkey PRIMARY KEY (id);


--
-- TOC entry 4988 (class 2606 OID 24365)
-- Name: carreras carreras_facultad_id_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_facultad_id_nombre_key UNIQUE (facultad_id, nombre);


--
-- TOC entry 4990 (class 2606 OID 24363)
-- Name: carreras carreras_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_pkey PRIMARY KEY (carrera_id);


--
-- TOC entry 4984 (class 2606 OID 24352)
-- Name: facultades facultades_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.facultades
    ADD CONSTRAINT facultades_nombre_key UNIQUE (nombre);


--
-- TOC entry 4986 (class 2606 OID 24350)
-- Name: facultades facultades_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.facultades
    ADD CONSTRAINT facultades_pkey PRIMARY KEY (facultad_id);


--
-- TOC entry 5015 (class 2606 OID 24504)
-- Name: habilidades_estudiante habilidades_estudiante_estudiante_id_habilidad_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habilidades_estudiante
    ADD CONSTRAINT habilidades_estudiante_estudiante_id_habilidad_id_key UNIQUE (estudiante_id, habilidad_id);


--
-- TOC entry 5017 (class 2606 OID 24502)
-- Name: habilidades_estudiante habilidades_estudiante_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habilidades_estudiante
    ADD CONSTRAINT habilidades_estudiante_pkey PRIMARY KEY (id);


--
-- TOC entry 5011 (class 2606 OID 24490)
-- Name: habilidades habilidades_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habilidades
    ADD CONSTRAINT habilidades_nombre_key UNIQUE (nombre);


--
-- TOC entry 5013 (class 2606 OID 24488)
-- Name: habilidades habilidades_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habilidades
    ADD CONSTRAINT habilidades_pkey PRIMARY KEY (habilidad_id);


--
-- TOC entry 5023 (class 2606 OID 24553)
-- Name: habilidades_vacante habilidades_vacante_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habilidades_vacante
    ADD CONSTRAINT habilidades_vacante_pkey PRIMARY KEY (id);


--
-- TOC entry 5025 (class 2606 OID 24555)
-- Name: habilidades_vacante habilidades_vacante_vacante_id_habilidad_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habilidades_vacante
    ADD CONSTRAINT habilidades_vacante_vacante_id_habilidad_id_key UNIQUE (vacante_id, habilidad_id);


--
-- TOC entry 5004 (class 2606 OID 24445)
-- Name: instituciones instituciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instituciones
    ADD CONSTRAINT instituciones_pkey PRIMARY KEY (institucion_id);


--
-- TOC entry 5006 (class 2606 OID 24447)
-- Name: instituciones instituciones_ruc_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instituciones
    ADD CONSTRAINT instituciones_ruc_key UNIQUE (ruc);


--
-- TOC entry 4994 (class 2606 OID 24384)
-- Name: perfiles_estudiante perfiles_estudiante_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfiles_estudiante
    ADD CONSTRAINT perfiles_estudiante_pkey PRIMARY KEY (perfil_id);


--
-- TOC entry 4996 (class 2606 OID 24386)
-- Name: perfiles_estudiante perfiles_estudiante_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfiles_estudiante
    ADD CONSTRAINT perfiles_estudiante_usuario_id_key UNIQUE (usuario_id);


--
-- TOC entry 4998 (class 2606 OID 24412)
-- Name: perfiles_gestor perfiles_gestor_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfiles_gestor
    ADD CONSTRAINT perfiles_gestor_pkey PRIMARY KEY (perfil_id);


--
-- TOC entry 5000 (class 2606 OID 24414)
-- Name: perfiles_gestor perfiles_gestor_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfiles_gestor
    ADD CONSTRAINT perfiles_gestor_usuario_id_key UNIQUE (usuario_id);


--
-- TOC entry 5030 (class 2606 OID 24583)
-- Name: postulaciones postulaciones_nro_solicitud_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_nro_solicitud_key UNIQUE (nro_solicitud);


--
-- TOC entry 5032 (class 2606 OID 24581)
-- Name: postulaciones postulaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_pkey PRIMARY KEY (postulacion_id);


--
-- TOC entry 4971 (class 2606 OID 24313)
-- Name: roles roles_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key UNIQUE (nombre);


--
-- TOC entry 4973 (class 2606 OID 24311)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (rol_id);


--
-- TOC entry 5009 (class 2606 OID 24474)
-- Name: supervisores supervisores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supervisores
    ADD CONSTRAINT supervisores_pkey PRIMARY KEY (supervisor_id);


--
-- TOC entry 4978 (class 2606 OID 24333)
-- Name: usuarios usuarios_cedula_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_cedula_key UNIQUE (cedula);


--
-- TOC entry 4980 (class 2606 OID 24335)
-- Name: usuarios usuarios_correo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_key UNIQUE (correo);


--
-- TOC entry 4982 (class 2606 OID 24331)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (usuario_id);


--
-- TOC entry 5021 (class 2606 OID 24531)
-- Name: vacantes vacantes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vacantes
    ADD CONSTRAINT vacantes_pkey PRIMARY KEY (vacante_id);


--
-- TOC entry 5037 (class 1259 OID 24870)
-- Name: idx_cache_afinidad_estudiante; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cache_afinidad_estudiante ON public.cache_afinidad USING btree (estudiante_id);


--
-- TOC entry 5038 (class 1259 OID 24871)
-- Name: idx_cache_afinidad_vacante; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cache_afinidad_vacante ON public.cache_afinidad USING btree (vacante_id);


--
-- TOC entry 5001 (class 1259 OID 24607)
-- Name: idx_instituciones_estado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_instituciones_estado ON public.instituciones USING btree (estado);


--
-- TOC entry 5002 (class 1259 OID 24606)
-- Name: idx_instituciones_usuario; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_instituciones_usuario ON public.instituciones USING btree (usuario_id);


--
-- TOC entry 4991 (class 1259 OID 24605)
-- Name: idx_perfiles_carrera; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_perfiles_carrera ON public.perfiles_estudiante USING btree (carrera_id);


--
-- TOC entry 4992 (class 1259 OID 24604)
-- Name: idx_perfiles_usuario; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_perfiles_usuario ON public.perfiles_estudiante USING btree (usuario_id);


--
-- TOC entry 5026 (class 1259 OID 24613)
-- Name: idx_postulaciones_estado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_postulaciones_estado ON public.postulaciones USING btree (estado);


--
-- TOC entry 5027 (class 1259 OID 24611)
-- Name: idx_postulaciones_estudiante; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_postulaciones_estudiante ON public.postulaciones USING btree (estudiante_id);


--
-- TOC entry 5028 (class 1259 OID 24612)
-- Name: idx_postulaciones_vacante; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_postulaciones_vacante ON public.postulaciones USING btree (vacante_id);


--
-- TOC entry 5007 (class 1259 OID 24608)
-- Name: idx_supervisores_institucion; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_supervisores_institucion ON public.supervisores USING btree (institucion_id);


--
-- TOC entry 4974 (class 1259 OID 24603)
-- Name: idx_usuarios_cedula; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usuarios_cedula ON public.usuarios USING btree (cedula);


--
-- TOC entry 4975 (class 1259 OID 24602)
-- Name: idx_usuarios_correo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usuarios_correo ON public.usuarios USING btree (correo);


--
-- TOC entry 4976 (class 1259 OID 24601)
-- Name: idx_usuarios_rol; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usuarios_rol ON public.usuarios USING btree (rol_id);


--
-- TOC entry 5018 (class 1259 OID 24610)
-- Name: idx_vacantes_activo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_vacantes_activo ON public.vacantes USING btree (activo);


--
-- TOC entry 5019 (class 1259 OID 24609)
-- Name: idx_vacantes_institucion; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_vacantes_institucion ON public.vacantes USING btree (institucion_id);


--
-- TOC entry 5059 (class 2606 OID 24860)
-- Name: cache_afinidad cache_afinidad_estudiante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache_afinidad
    ADD CONSTRAINT cache_afinidad_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.perfiles_estudiante(perfil_id) ON DELETE CASCADE;


--
-- TOC entry 5060 (class 2606 OID 24865)
-- Name: cache_afinidad cache_afinidad_vacante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache_afinidad
    ADD CONSTRAINT cache_afinidad_vacante_id_fkey FOREIGN KEY (vacante_id) REFERENCES public.vacantes(vacante_id) ON DELETE CASCADE;


--
-- TOC entry 5040 (class 2606 OID 24366)
-- Name: carreras carreras_facultad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_facultad_id_fkey FOREIGN KEY (facultad_id) REFERENCES public.facultades(facultad_id);


--
-- TOC entry 5050 (class 2606 OID 24505)
-- Name: habilidades_estudiante habilidades_estudiante_estudiante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habilidades_estudiante
    ADD CONSTRAINT habilidades_estudiante_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.perfiles_estudiante(perfil_id) ON DELETE CASCADE;


--
-- TOC entry 5051 (class 2606 OID 24510)
-- Name: habilidades_estudiante habilidades_estudiante_habilidad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habilidades_estudiante
    ADD CONSTRAINT habilidades_estudiante_habilidad_id_fkey FOREIGN KEY (habilidad_id) REFERENCES public.habilidades(habilidad_id) ON DELETE CASCADE;


--
-- TOC entry 5054 (class 2606 OID 24561)
-- Name: habilidades_vacante habilidades_vacante_habilidad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habilidades_vacante
    ADD CONSTRAINT habilidades_vacante_habilidad_id_fkey FOREIGN KEY (habilidad_id) REFERENCES public.habilidades(habilidad_id) ON DELETE CASCADE;


--
-- TOC entry 5055 (class 2606 OID 24556)
-- Name: habilidades_vacante habilidades_vacante_vacante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habilidades_vacante
    ADD CONSTRAINT habilidades_vacante_vacante_id_fkey FOREIGN KEY (vacante_id) REFERENCES public.vacantes(vacante_id) ON DELETE CASCADE;


--
-- TOC entry 5047 (class 2606 OID 24453)
-- Name: instituciones instituciones_facultad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instituciones
    ADD CONSTRAINT instituciones_facultad_id_fkey FOREIGN KEY (facultad_id) REFERENCES public.facultades(facultad_id);


--
-- TOC entry 5048 (class 2606 OID 24448)
-- Name: instituciones instituciones_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instituciones
    ADD CONSTRAINT instituciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 5041 (class 2606 OID 24392)
-- Name: perfiles_estudiante perfiles_estudiante_carrera_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfiles_estudiante
    ADD CONSTRAINT perfiles_estudiante_carrera_id_fkey FOREIGN KEY (carrera_id) REFERENCES public.carreras(carrera_id);


--
-- TOC entry 5042 (class 2606 OID 24397)
-- Name: perfiles_estudiante perfiles_estudiante_facultad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfiles_estudiante
    ADD CONSTRAINT perfiles_estudiante_facultad_id_fkey FOREIGN KEY (facultad_id) REFERENCES public.facultades(facultad_id);


--
-- TOC entry 5043 (class 2606 OID 24387)
-- Name: perfiles_estudiante perfiles_estudiante_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfiles_estudiante
    ADD CONSTRAINT perfiles_estudiante_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


--
-- TOC entry 5044 (class 2606 OID 24425)
-- Name: perfiles_gestor perfiles_gestor_carrera_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfiles_gestor
    ADD CONSTRAINT perfiles_gestor_carrera_id_fkey FOREIGN KEY (carrera_id) REFERENCES public.carreras(carrera_id);


--
-- TOC entry 5045 (class 2606 OID 24420)
-- Name: perfiles_gestor perfiles_gestor_facultad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfiles_gestor
    ADD CONSTRAINT perfiles_gestor_facultad_id_fkey FOREIGN KEY (facultad_id) REFERENCES public.facultades(facultad_id);


--
-- TOC entry 5046 (class 2606 OID 24415)
-- Name: perfiles_gestor perfiles_gestor_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfiles_gestor
    ADD CONSTRAINT perfiles_gestor_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


--
-- TOC entry 5056 (class 2606 OID 24586)
-- Name: postulaciones postulaciones_estudiante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.perfiles_estudiante(perfil_id) ON DELETE CASCADE;


--
-- TOC entry 5057 (class 2606 OID 24596)
-- Name: postulaciones postulaciones_supervisor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_supervisor_id_fkey FOREIGN KEY (supervisor_id) REFERENCES public.supervisores(supervisor_id);


--
-- TOC entry 5058 (class 2606 OID 24591)
-- Name: postulaciones postulaciones_vacante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.postulaciones
    ADD CONSTRAINT postulaciones_vacante_id_fkey FOREIGN KEY (vacante_id) REFERENCES public.vacantes(vacante_id) ON DELETE CASCADE;


--
-- TOC entry 5049 (class 2606 OID 24475)
-- Name: supervisores supervisores_institucion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supervisores
    ADD CONSTRAINT supervisores_institucion_id_fkey FOREIGN KEY (institucion_id) REFERENCES public.instituciones(institucion_id) ON DELETE CASCADE;


--
-- TOC entry 5039 (class 2606 OID 24336)
-- Name: usuarios usuarios_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(rol_id);


--
-- TOC entry 5052 (class 2606 OID 24532)
-- Name: vacantes vacantes_institucion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vacantes
    ADD CONSTRAINT vacantes_institucion_id_fkey FOREIGN KEY (institucion_id) REFERENCES public.instituciones(institucion_id) ON DELETE CASCADE;


--
-- TOC entry 5053 (class 2606 OID 24537)
-- Name: vacantes vacantes_supervisor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vacantes
    ADD CONSTRAINT vacantes_supervisor_id_fkey FOREIGN KEY (supervisor_id) REFERENCES public.supervisores(supervisor_id) ON DELETE SET NULL;


-- Completed on 2026-07-10 22:52:04

--
-- PostgreSQL database dump complete
--

\unrestrict LnqhbhBOHQkJFLtq0gf8Oez2boU8TO9DPyw9SVQaXOXL9AQDVngWuV2Ud6qazUV

