-- =============================================================
-- SchoolCost NG  -  Initial Database Schema
-- =============================================================

-- ENUMS
-- =============================================================

CREATE TYPE institution_type AS ENUM (
  'university',
  'polytechnic',
  'college_of_education',
  'health_institution'
);

CREATE TYPE ownership_type AS ENUM (
  'federal',
  'state',
  'private'
);

CREATE TYPE student_type AS ENUM (
  'fresh',
  'returning'
);

CREATE TYPE verification_status AS ENUM (
  'officially_verified',
  'community_verified',
  'reported',
  'outdated',
  'disputed'
);

CREATE TYPE confidence_level AS ENUM (
  'high',
  'medium',
  'low'
);

CREATE TYPE source_type AS ENUM (
  'official_school_source',
  'official_fee_circular',
  'school_representative',
  'student_portal_evidence',
  'payment_invoice',
  'community_reported'
);

CREATE TYPE fee_category AS ENUM (
  'tuition',
  'acceptance_fee',
  'departmental_fee',
  'faculty_fee',
  'ict_fee',
  'medical_fee',
  'exam_fee',
  'development_levy',
  'student_union_fee',
  'accommodation',
  'other'
);

CREATE TYPE fee_frequency AS ENUM (
  'one_time',
  'recurring'
);

CREATE TYPE fee_applies_to AS ENUM (
  'fresh_only',
  'returning_only',
  'all_students'
);

CREATE TYPE submission_type AS ENUM (
  'new_fee',
  'correction',
  'missing_charge',
  'suggest_school'
);

CREATE TYPE submission_status AS ENUM (
  'pending',
  'approved',
  'approved_with_edits',
  'rejected',
  'needs_more_evidence',
  'duplicate',
  'disputed'
);

CREATE TYPE evidence_source_type AS ENUM (
  'official_school_webpage',
  'official_fee_circular',
  'student_portal_screenshot',
  'payment_invoice',
  'school_representative_submission',
  'receipt',
  'official_email',
  'public_school_notice'
);

CREATE TYPE evidence_review_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);


-- TABLES
-- =============================================================

-- institutions
CREATE TABLE institutions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  abbreviation  TEXT,
  logo_url      TEXT,
  institution_type  institution_type NOT NULL,
  ownership_type    ownership_type NOT NULL,
  state         TEXT NOT NULL,
  city          TEXT,
  website_url   TEXT,
  description   TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- faculties
CREATE TABLE faculties (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id  UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- courses
CREATE TABLE courses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id  UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  faculty_id      UUID REFERENCES faculties(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL,
  duration_years  INTEGER NOT NULL DEFAULT 4,
  qualification   TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(institution_id, slug)
);

-- academic_sessions
CREATE TABLE academic_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id  UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  start_year      INTEGER NOT NULL,
  end_year        INTEGER NOT NULL,
  is_current      BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(institution_id, name)
);

-- fee_records
CREATE TABLE fee_records (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id          UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  course_id               UUID REFERENCES courses(id) ON DELETE SET NULL,
  academic_session_id     UUID NOT NULL REFERENCES academic_sessions(id) ON DELETE RESTRICT,
  level                   TEXT,
  student_type            student_type NOT NULL,
  currency                TEXT NOT NULL DEFAULT 'NGN',
  compulsory_total        NUMERIC(12, 2) NOT NULL DEFAULT 0,
  optional_total          NUMERIC(12, 2) NOT NULL DEFAULT 0,
  accommodation_total     NUMERIC(12, 2) NOT NULL DEFAULT 0,
  first_year_total        NUMERIC(12, 2) NOT NULL DEFAULT 0,
  returning_year_total    NUMERIC(12, 2) NOT NULL DEFAULT 0,
  estimated_degree_total  NUMERIC(12, 2) NOT NULL DEFAULT 0,
  verification_status     verification_status NOT NULL DEFAULT 'reported',
  confidence_level        confidence_level NOT NULL DEFAULT 'low',
  source_type             source_type NOT NULL DEFAULT 'community_reported',
  last_reviewed_at        TIMESTAMPTZ,
  review_due_at           TIMESTAMPTZ,
  is_published            BOOLEAN NOT NULL DEFAULT false,
  admin_note              TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- fee_items
CREATE TABLE fee_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_record_id   UUID NOT NULL REFERENCES fee_records(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  original_label  TEXT,
  category        fee_category NOT NULL,
  amount          NUMERIC(12, 2) NOT NULL,
  is_compulsory   BOOLEAN NOT NULL DEFAULT true,
  frequency       fee_frequency NOT NULL DEFAULT 'recurring',
  applies_to      fee_applies_to NOT NULL DEFAULT 'all_students',
  description     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- submissions
CREATE TABLE submissions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_type       submission_type NOT NULL,
  institution_id        UUID REFERENCES institutions(id) ON DELETE SET NULL,
  course_id             UUID REFERENCES courses(id) ON DELETE SET NULL,
  academic_session_id   UUID REFERENCES academic_sessions(id) ON DELETE SET NULL,
  submitter_name        TEXT,
  submitter_email       TEXT,
  submitted_payload     JSONB NOT NULL DEFAULT '{}',
  status                submission_status NOT NULL DEFAULT 'pending',
  admin_feedback        TEXT,
  reviewed_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- evidence
CREATE TABLE evidence (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_record_id       UUID REFERENCES fee_records(id) ON DELETE CASCADE,
  submission_id       UUID REFERENCES submissions(id) ON DELETE CASCADE,
  source_type         evidence_source_type NOT NULL,
  source_url          TEXT,
  file_url            TEXT,
  evidence_date       DATE,
  review_status       evidence_review_status NOT NULL DEFAULT 'pending',
  submitted_by_email  TEXT,
  admin_note          TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT evidence_has_parent CHECK (
    fee_record_id IS NOT NULL OR submission_id IS NOT NULL
  )
);


-- INDEXES
-- =============================================================

CREATE INDEX idx_institutions_slug ON institutions(slug);
CREATE INDEX idx_institutions_state ON institutions(state);
CREATE INDEX idx_institutions_type ON institutions(institution_type);
CREATE INDEX idx_institutions_ownership ON institutions(ownership_type);
CREATE INDEX idx_institutions_active ON institutions(is_active);

-- Full-text search on institutions
CREATE INDEX idx_institutions_fts ON institutions
  USING gin(to_tsvector('english', name || ' ' || COALESCE(abbreviation, '') || ' ' || COALESCE(city, '') || ' ' || state));

CREATE INDEX idx_courses_institution ON courses(institution_id);
CREATE INDEX idx_courses_faculty ON courses(faculty_id);
CREATE INDEX idx_courses_slug ON courses(institution_id, slug);

CREATE INDEX idx_sessions_institution ON academic_sessions(institution_id);
CREATE INDEX idx_sessions_current ON academic_sessions(institution_id, is_current);

CREATE INDEX idx_fee_records_institution ON fee_records(institution_id);
CREATE INDEX idx_fee_records_course ON fee_records(course_id);
CREATE INDEX idx_fee_records_session ON fee_records(academic_session_id);
CREATE INDEX idx_fee_records_published ON fee_records(is_published);
CREATE INDEX idx_fee_records_student_type ON fee_records(student_type);

CREATE INDEX idx_fee_items_record ON fee_items(fee_record_id);
CREATE INDEX idx_fee_items_category ON fee_items(category);

CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_type ON submissions(submission_type);
CREATE INDEX idx_submissions_institution ON submissions(institution_id);

CREATE INDEX idx_evidence_record ON evidence(fee_record_id);
CREATE INDEX idx_evidence_submission ON evidence(submission_id);
CREATE INDEX idx_evidence_status ON evidence(review_status);


-- UPDATED_AT TRIGGER
-- =============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_institutions_updated_at
  BEFORE UPDATE ON institutions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_fee_records_updated_at
  BEFORE UPDATE ON fee_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_fee_items_updated_at
  BEFORE UPDATE ON fee_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ROW LEVEL SECURITY
-- =============================================================

ALTER TABLE institutions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculties          ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses            ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_records        ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence           ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions        ENABLE ROW LEVEL SECURITY;

-- Public read access  -  published and active records only
CREATE POLICY "Public can read active institutions"
  ON institutions FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can read faculties of active institutions"
  ON faculties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM institutions
      WHERE institutions.id = faculties.institution_id
        AND institutions.is_active = true
    )
  );

CREATE POLICY "Public can read active courses"
  ON courses FOR SELECT
  USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM institutions
      WHERE institutions.id = courses.institution_id
        AND institutions.is_active = true
    )
  );

CREATE POLICY "Public can read academic sessions"
  ON academic_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM institutions
      WHERE institutions.id = academic_sessions.institution_id
        AND institutions.is_active = true
    )
  );

CREATE POLICY "Public can read published fee records"
  ON fee_records FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can read fee items of published records"
  ON fee_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM fee_records
      WHERE fee_records.id = fee_items.fee_record_id
        AND fee_records.is_published = true
    )
  );

-- Evidence: public can only see approved evidence linked to published records
CREATE POLICY "Public can read approved evidence"
  ON evidence FOR SELECT
  USING (
    review_status = 'approved' AND
    fee_record_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM fee_records
      WHERE fee_records.id = evidence.fee_record_id
        AND fee_records.is_published = true
    )
  );

-- Submissions: anyone can insert, nobody can read (admin only via service role)
CREATE POLICY "Anyone can submit"
  ON submissions FOR INSERT
  WITH CHECK (true);
