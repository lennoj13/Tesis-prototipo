-- LIMPIAR TODA LA BASE DE DATOS
-- Ejecutar ANTES de schema.sql

DROP TABLE IF EXISTS public.notificaciones CASCADE;
DROP TABLE IF EXISTS public.postulaciones CASCADE;
DROP TABLE IF EXISTS public.habilidades_vacante CASCADE;
DROP TABLE IF EXISTS public.vacantes CASCADE;
DROP TABLE IF EXISTS public.habilidades_estudiante CASCADE;
DROP TABLE IF EXISTS public.habilidades CASCADE;
DROP TABLE IF EXISTS public.supervisores CASCADE;
DROP TABLE IF EXISTS public.instituciones CASCADE;
DROP TABLE IF EXISTS public.perfiles_estudiante CASCADE;
DROP TABLE IF EXISTS public.carreras CASCADE;
DROP TABLE IF EXISTS public.facultades CASCADE;
DROP TABLE IF EXISTS public.usuarios CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;

-- Tablas antiguas
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.vacancy_skills CASCADE;
DROP TABLE IF EXISTS public.vacancies CASCADE;
DROP TABLE IF EXISTS public.student_skills CASCADE;
DROP TABLE IF EXISTS public.skills CASCADE;
DROP TABLE IF EXISTS public.supervisors CASCADE;
DROP TABLE IF EXISTS public.institutions CASCADE;
DROP TABLE IF EXISTS public.student_profiles CASCADE;
DROP TABLE IF EXISTS public.company_profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
