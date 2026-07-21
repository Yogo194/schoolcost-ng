-- The service-role client (public submission server actions + admin reads)
-- connects to PostgREST as the `service_role` Postgres role. That role bypasses
-- RLS, but still needs table-level privileges. The initial schema and migration
-- 002 granted only `anon`/`authenticated`, so service_role could not read
-- institutions / courses / academic_sessions or write submissions — the fee
-- submission action failed at assertActiveInstitution with "permission denied".
--
-- Restore the standard Supabase service_role access across the public schema.

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON FUNCTIONS TO service_role;
