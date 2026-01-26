-- Migration: Alterar duration de INTEGER para REAL para precisão de segundos
-- Execute este script no Supabase SQL Editor

ALTER TABLE sessions 
ALTER COLUMN duration TYPE REAL;

-- Comentário explicativo
COMMENT ON COLUMN sessions.duration IS 'Duração em minutos com precisão de segundos (ex: 5.5 minutos = 5min 30s)';
