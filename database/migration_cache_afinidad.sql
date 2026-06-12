-- ============================================
-- MIGRACIÓN: Tabla de caché para Motor NLP
-- PIVIPP - Sistema de Recomendación
-- Ejecutar en PostgreSQL después del schema.sql
-- ============================================

-- Crear la tabla solo si no existe
CREATE TABLE IF NOT EXISTS public.cache_afinidad (
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER NOT NULL REFERENCES public.perfiles_estudiante(perfil_id) ON DELETE CASCADE,
    vacante_id INTEGER NOT NULL REFERENCES public.vacantes(vacante_id) ON DELETE CASCADE,
    porcentaje_afinidad DECIMAL(5,2) NOT NULL,
    calculado_en TIMESTAMP DEFAULT NOW(),
    UNIQUE(estudiante_id, vacante_id)
);

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_cache_afinidad_estudiante ON public.cache_afinidad(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_cache_afinidad_vacante ON public.cache_afinidad(vacante_id);

-- Verificar creación
SELECT 'Tabla cache_afinidad creada exitosamente' as resultado;
