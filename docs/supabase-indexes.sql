-- Índices recomendados para escalar a 200 founders + 30 universidades
-- Ejecutar en Supabase → SQL Editor (no afecta datos, solo performance)
-- Creado por auditoría de escalamiento — Abril 2026

-- tool_data: clave para getProgressAsync, hydrateProgressFromSupabase, rate limit AI
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tool_data_user_id
  ON tool_data (user_id);

-- tool_data: lookup rápido por user+tool (upsert en saveToolData)
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_tool_data_user_tool
  ON tool_data (user_id, tool_id);

-- cohort_startups: listado de startups por cohorte (admin cohortes [id] page)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cohort_startups_cohort_id
  ON cohort_startups (cohort_id);

-- cohort_startups: lookup por startup (relación inversa)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cohort_startups_startup_id
  ON cohort_startups (startup_id);

-- ai_conversations: rate limit check y carga de historial por user
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_conversations_user_created
  ON ai_conversations (user_id, created_at DESC);

-- startups: lookup por founder (usado en chat, feedback, passport)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_startups_founder_id
  ON startups (founder_id);

-- diagnostics: listado por usuario
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_diagnostics_user_id
  ON diagnostics (user_id);

-- invitations: lookup por org + estado (admin invitaciones)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_invitations_org_status
  ON invitations (org_id, status);

-- Verificar índices creados:
-- SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename;
