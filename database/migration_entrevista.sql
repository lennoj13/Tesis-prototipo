-- ============================================
-- MIGRACION: Agregar campos de entrevista a postulaciones
-- Tesis: Anchundia - Galarza (2026)
-- ============================================

-- Campos para gestionar la entrevista previa a la aceptacion
ALTER TABLE public.postulaciones 
ADD COLUMN IF NOT EXISTS fecha_entrevista DATE,
ADD COLUMN IF NOT EXISTS hora_entrevista TIME,
ADD COLUMN IF NOT EXISTS modalidad_entrevista VARCHAR(20),
ADD COLUMN IF NOT EXISTS direccion_entrevista VARCHAR(300),
ADD COLUMN IF NOT EXISTS link_reunion VARCHAR(500);
