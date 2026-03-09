-- ============================================
-- ESQUEMA: Plataforma Matching Bidireccional
-- Universidad de Guayaquil - Tesis
-- ============================================
-- Este script sirve para PostgreSQL local Y para Supabase.
-- Para PostgreSQL local: ejecutar en pgAdmin o psql.
-- Para Supabase: ya fue aplicado como migración.
-- ============================================

-- 1. ROLES
CREATE TABLE IF NOT EXISTS public.roles (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
);

-- 2. USUARIOS
CREATE TABLE IF NOT EXISTS public.users (
    user_id SERIAL PRIMARY KEY,
    login VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    role_id INTEGER NOT NULL REFERENCES public.roles(role_id),
    profile_picture TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. PERFILES DE ESTUDIANTE
CREATE TABLE IF NOT EXISTS public.student_profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES public.users(user_id) ON DELETE CASCADE,
    career VARCHAR(150),
    semester VARCHAR(30),
    university VARCHAR(200) DEFAULT 'Universidad de Guayaquil',
    experience_summary TEXT,
    interests TEXT,
    curriculum_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. PERFILES DE EMPRESA
CREATE TABLE IF NOT EXISTS public.company_profiles (
    company_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES public.users(user_id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    ruc VARCHAR(20),
    industry VARCHAR(100),
    description TEXT,
    website VARCHAR(255),
    location VARCHAR(200),
    contact_email VARCHAR(150),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. CATÁLOGO DE HABILIDADES
CREATE TABLE IF NOT EXISTS public.skills (
    skill_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50)
);

-- 6. HABILIDADES DEL ESTUDIANTE
CREATE TABLE IF NOT EXISTS public.student_skills (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES public.student_profiles(profile_id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES public.skills(skill_id) ON DELETE CASCADE,
    level INTEGER DEFAULT 1 CHECK (level BETWEEN 1 AND 5),
    UNIQUE(student_id, skill_id)
);

-- 7. VACANTES DE PRÁCTICAS
CREATE TABLE IF NOT EXISTS public.vacancies (
    vacancy_id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES public.company_profiles(company_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    area VARCHAR(100),
    description TEXT,
    requirements TEXT,
    modality VARCHAR(30) DEFAULT 'Presencial',
    location VARCHAR(200),
    slots INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    expires_at DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 8. HABILIDADES REQUERIDAS POR VACANTE
CREATE TABLE IF NOT EXISTS public.vacancy_skills (
    id SERIAL PRIMARY KEY,
    vacancy_id INTEGER NOT NULL REFERENCES public.vacancies(vacancy_id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES public.skills(skill_id) ON DELETE CASCADE,
    required_level INTEGER DEFAULT 1,
    is_optional BOOLEAN DEFAULT false,
    UNIQUE(vacancy_id, skill_id)
);

-- 9. POSTULACIONES
CREATE TABLE IF NOT EXISTS public.applications (
    application_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES public.student_profiles(profile_id) ON DELETE CASCADE,
    vacancy_id INTEGER NOT NULL REFERENCES public.vacancies(vacancy_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    match_percentage DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(student_id, vacancy_id)
);

-- 10. NOTIFICACIONES
CREATE TABLE IF NOT EXISTS public.notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    related_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ÍNDICES
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_student_profiles_user ON public.student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_company_profiles_user ON public.company_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_vacancies_company ON public.vacancies(company_id);
CREATE INDEX IF NOT EXISTS idx_vacancies_active ON public.vacancies(is_active);
CREATE INDEX IF NOT EXISTS idx_applications_student ON public.applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_vacancy ON public.applications(vacancy_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(is_read);
