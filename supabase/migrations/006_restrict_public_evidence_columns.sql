-- Keep approved evidence rows readable for public fee pages, but do not expose
-- private upload paths, contributor emails, or internal reviewer notes through
-- the Supabase Data API.

REVOKE SELECT ON evidence FROM anon, authenticated;

GRANT SELECT (
  id,
  fee_record_id,
  source_type,
  source_url,
  evidence_date,
  review_status,
  created_at
) ON evidence TO anon, authenticated;

GRANT ALL ON evidence TO service_role;
