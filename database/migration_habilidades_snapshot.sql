-- Migración para añadir la columna de "foto" (snapshot) de habilidades al momento de la postulación
-- Esto garantiza que si el estudiante cambia sus habilidades en el futuro, las empresas y gestores
-- sigan viendo exactamente con qué habilidades postuló originalmente.

ALTER TABLE public.postulaciones 
ADD COLUMN IF NOT EXISTS habilidades_snapshot JSONB DEFAULT '[]'::jsonb;

-- Eliminamos la restricción única para permitir múltiples postulaciones 
-- al mismo puesto (por ejemplo, si fue rechazada y vuelve a aplicar en el futuro)
-- Esto preserva el historial de auditoría
ALTER TABLE public.postulaciones 
DROP CONSTRAINT IF EXISTS postulaciones_estudiante_id_vacante_id_key;
