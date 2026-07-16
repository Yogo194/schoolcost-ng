-- RLS policies only take effect once the base table-level GRANT exists.
-- Grant the privileges needed for the RLS policies defined in 001_initial_schema.sql to work.

GRANT SELECT ON institutions, faculties, courses, academic_sessions, fee_records, fee_items, evidence
  TO anon, authenticated;

GRANT INSERT ON submissions TO anon, authenticated;

-- Ensure future tables created by postgres/service_role automatically get the same read access.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT SELECT ON TABLES TO anon, authenticated;
