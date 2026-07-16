-- Speeds up ilike '%query%' substring matching used by the search suggestions
-- endpoint as the institutions/courses catalog grows.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_institutions_name_trgm
  ON institutions USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_institutions_abbreviation_trgm
  ON institutions USING gin (abbreviation gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_institutions_city_trgm
  ON institutions USING gin (city gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_courses_name_trgm
  ON courses USING gin (name gin_trgm_ops);
