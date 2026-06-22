-- ============================================
-- MIGRACIÓN CONSOLIDADA - Junio 2026
-- PIVIPP - Sistema de Recomendación PPP
-- Tesis: Anchundia - Galarza
-- ============================================
-- Este archivo contiene TODOS los cambios de base de datos
-- necesarios para sincronizar con la versión actual del sistema.
-- Es seguro ejecutarlo múltiples veces (usa IF NOT EXISTS / IF EXISTS).
-- ============================================

-- =====================
-- 1. TABLA CACHE NLP
-- =====================
-- Almacena los porcentajes de afinidad precalculados por el motor NLP
-- para evitar recalcular en cada petición del estudiante.
CREATE TABLE IF NOT EXISTS public.cache_afinidad (
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER NOT NULL REFERENCES public.perfiles_estudiante(perfil_id) ON DELETE CASCADE,
    vacante_id INTEGER NOT NULL REFERENCES public.vacantes(vacante_id) ON DELETE CASCADE,
    porcentaje_afinidad DECIMAL(5,2) NOT NULL,
    calculado_en TIMESTAMP DEFAULT NOW(),
    UNIQUE(estudiante_id, vacante_id)
);
CREATE INDEX IF NOT EXISTS idx_cache_afinidad_estudiante ON public.cache_afinidad(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_cache_afinidad_vacante ON public.cache_afinidad(vacante_id);

-- =====================
-- 2. SNAPSHOT DE HABILIDADES EN POSTULACIONES
-- =====================
-- Guarda una "foto" del perfil del estudiante al momento de postularse.
-- Así, si el estudiante cambia su perfil después, la empresa sigue viendo
-- las habilidades con las que postuló originalmente (auditoría).
ALTER TABLE public.postulaciones 
ADD COLUMN IF NOT EXISTS habilidades_snapshot JSONB DEFAULT '[]'::jsonb;

-- Permitir múltiples postulaciones al mismo puesto (historial)
ALTER TABLE public.postulaciones 
DROP CONSTRAINT IF EXISTS postulaciones_estudiante_id_vacante_id_key;

-- =====================
-- 3. CAMPOS DE ENTREVISTA EN POSTULACIONES
-- =====================
-- La empresa programa una entrevista antes de aceptar al candidato.
-- Estos campos almacenan la fecha, hora, modalidad y ubicación/link.
ALTER TABLE public.postulaciones 
ADD COLUMN IF NOT EXISTS fecha_entrevista DATE,
ADD COLUMN IF NOT EXISTS hora_entrevista TIME,
ADD COLUMN IF NOT EXISTS modalidad_entrevista VARCHAR(20),
ADD COLUMN IF NOT EXISTS direccion_entrevista VARCHAR(300),
ADD COLUMN IF NOT EXISTS link_reunion VARCHAR(500);

-- =====================
-- 4. FLAG DE CÁLCULO NLP EN PERFIL ESTUDIANTE
-- =====================
-- Indica al frontend que el motor NLP está calculando afinidades
-- en segundo plano para este estudiante (muestra toast de carga).
ALTER TABLE public.perfiles_estudiante
ADD COLUMN IF NOT EXISTS calculando_nlp BOOLEAN DEFAULT FALSE;

-- =====================
-- VERIFICACIÓN
-- =====================
SELECT 'Migración consolidada ejecutada exitosamente' AS resultado;
