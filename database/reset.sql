-- ============================================
-- LIMPIAR TODA LA BASE DE DATOS
-- Ejecutar ANTES de seed.sql
-- ============================================

-- Borrar datos en orden (respetando foreign keys)
TRUNCATE public.notifications RESTART IDENTITY CASCADE;
TRUNCATE public.applications RESTART IDENTITY CASCADE;
TRUNCATE public.vacancy_skills RESTART IDENTITY CASCADE;
TRUNCATE public.vacancies RESTART IDENTITY CASCADE;
TRUNCATE public.student_skills RESTART IDENTITY CASCADE;
TRUNCATE public.company_profiles RESTART IDENTITY CASCADE;
TRUNCATE public.student_profiles RESTART IDENTITY CASCADE;
TRUNCATE public.users RESTART IDENTITY CASCADE;
TRUNCATE public.skills RESTART IDENTITY CASCADE;
TRUNCATE public.roles RESTART IDENTITY CASCADE;
