-- Tighten public writes and public reads before go-live.
--
-- Public contribution forms should be able to create a pending submission, but
-- direct REST clients must not be able to set moderation fields. Published fee
-- records should also stay hidden if their parent school is inactive.

DROP POLICY IF EXISTS "Anyone can submit" ON submissions;
DROP POLICY IF EXISTS "Anyone can create pending submissions" ON submissions;

REVOKE INSERT ON submissions FROM anon, authenticated;

GRANT INSERT (
  submission_type,
  institution_id,
  course_id,
  academic_session_id,
  submitter_name,
  submitter_email,
  submitted_payload
) ON submissions TO anon, authenticated;

CREATE POLICY "Anyone can create pending submissions"
  ON submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND admin_feedback IS NULL
    AND reviewed_at IS NULL
  );

DROP POLICY IF EXISTS "Public can read published fee records" ON fee_records;
CREATE POLICY "Public can read published fee records"
  ON fee_records FOR SELECT
  USING (
    is_published = true
    AND EXISTS (
      SELECT 1 FROM institutions
      WHERE institutions.id = fee_records.institution_id
        AND institutions.is_active = true
    )
  );

DROP POLICY IF EXISTS "Public can read fee items of published records" ON fee_items;
CREATE POLICY "Public can read fee items of published records"
  ON fee_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM fee_records
      JOIN institutions ON institutions.id = fee_records.institution_id
      WHERE fee_records.id = fee_items.fee_record_id
        AND fee_records.is_published = true
        AND institutions.is_active = true
    )
  );

DROP POLICY IF EXISTS "Public can read approved evidence" ON evidence;
CREATE POLICY "Public can read approved evidence"
  ON evidence FOR SELECT
  USING (
    review_status = 'approved' AND
    fee_record_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM fee_records
      JOIN institutions ON institutions.id = fee_records.institution_id
      WHERE fee_records.id = evidence.fee_record_id
        AND fee_records.is_published = true
        AND institutions.is_active = true
    )
  );

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE SELECT ON TABLES FROM anon, authenticated;
