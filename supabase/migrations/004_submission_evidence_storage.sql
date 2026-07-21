-- Evidence inserts for public contributions (via service role) + private
-- storage bucket for uploaded proof files.

GRANT INSERT ON evidence TO service_role;
GRANT ALL ON evidence TO service_role;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'submission-evidence',
  'submission-evidence',
  false,
  10485760,
  ARRAY[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg'
  ]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Service role bypasses RLS; keep policies tight for other roles.
DROP POLICY IF EXISTS "Service role manages submission evidence" ON storage.objects;
CREATE POLICY "Service role manages submission evidence"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'submission-evidence')
  WITH CHECK (bucket_id = 'submission-evidence');
