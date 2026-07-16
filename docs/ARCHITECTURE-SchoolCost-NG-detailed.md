# SchoolCost NG  -  App Architecture & System Design

## 1. Purpose of This Document

This document defines the architecture, systems, modules, data model, user flows, and implementation blueprint for **SchoolCost NG**.

It should be used as the build blueprint before scaffolding the project in Claude Code or any AI coding tool.

---

# 2. Product Summary

**SchoolCost NG** is a Nigerian tertiary education cost transparency platform.

It helps students and parents search, understand, and compare the real cost of attending Nigerian tertiary institutions.

The product focuses on:

- Verified school fees
- Course-specific fee breakdowns
- Fresh-student and returning-student cost differences
- Source transparency
- School comparison
- Community-submitted fee updates
- Admin moderation before publication

The product should feel minimal, trustworthy, and data-led.

---

# 3. Core Product Promise

> Know what your degree will really cost.

SchoolCost NG should help users understand the true cost of a school before they accept admission or make payment plans.

---

# 4. Primary Users

## 4.1 Prospective Students

Students comparing schools before applying or accepting admission.

They need to know:

- What a school costs
- What is compulsory
- What is optional
- What applies to their course
- What applies to their level
- Whether the information is current

## 4.2 Parents and Guardians

People paying or planning for a student’s education.

They need to:

- Compare schools
- Estimate first-year cost
- Understand recurring yearly cost
- Avoid hidden fees
- See trustworthy sources

## 4.3 Current Students

Students who already have access to updated fee information.

They can:

- Submit new fee updates
- Report incorrect amounts
- Upload supporting evidence
- Suggest missing charges

## 4.4 Admin

The platform owner or internal reviewer.

The admin can:

- Add and edit institutions
- Add and edit courses
- Add and edit fee records
- Review user submissions
- Approve, reject, or request more evidence
- Manage verification labels
- Publish trusted data

---

# 5. System Overview

The system has five major layers:

1. **Public Website**
2. **Search and Discovery System**
3. **Fee Data and Comparison System**
4. **Community Submission System**
5. **Admin Moderation System**

---

# 6. High-Level Architecture

```text
User
 |
 | interacts with
 v
Next.js Frontend
 |
 | reads/writes through
 v
Application Logic / Server Actions
 |
 | queries and mutates
 v
Supabase PostgreSQL Database
 |
 | stores uploads in
 v
Supabase Storage
 |
 | protected by
 v
Supabase Auth + Row Level Security
```

---

# 7. Recommended Tech Stack

## Frontend

- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Lucide Icons**

## Backend

- **Supabase**
- **PostgreSQL**
- **Supabase Auth**
- **Supabase Storage**
- **Supabase Row Level Security**

## Hosting

- **Vercel**

## Forms and Validation

- **React Hook Form**
- **Zod**

## Charts and Data Display

- **Recharts**
- Native HTML tables for fee and comparison data

## Analytics

- **PostHog**

## Email

- **Resend**

---

# 8. Core Systems

## 8.1 Public Website System

Responsible for all public-facing pages.

Includes:

- Homepage
- School directory
- School profile
- Fee breakdown page
- Compare page
- How verification works page
- Submit fee update page
- Submit correction page
- Suggest school page

The public site should only show published and approved records.

---

## 8.2 Search and Discovery System

Allows users to find schools and fee records.

Searchable fields:

- Institution name
- Institution abbreviation
- Course name
- State
- City
- Institution type
- Ownership type

Filters:

- Institution type
- Ownership type
- State
- Course
- Fee range
- Verification status
- Academic session

Ranking priority:

1. Exact institution name match
2. Exact abbreviation match
3. Exact course match
4. Partial school name match
5. State or city match

V1 search can use PostgreSQL full-text search.

---

## 8.3 School Profile System

Each school has a public profile containing:

- School name
- Abbreviation
- Logo
- Location
- Institution type
- Ownership type
- Official website
- Short description
- Available courses
- Available fee records
- Last reviewed date
- Source status summary

The school profile should include a fee finder that allows users to select:

- Course
- Level
- Student type
- Academic session

After selection, the user sees the relevant fee record.

---

## 8.4 Fee Breakdown System

The fee breakdown system displays structured fee data.

Each fee record must include:

- Institution
- Course
- Academic session
- Level
- Student type
- Currency
- Fee items
- Compulsory total
- Optional total
- Accommodation total
- Estimated first-year total
- Estimated returning-year total
- Estimated degree total
- Source type
- Verification status
- Confidence level
- Last-reviewed date

Fee item categories:

- Tuition
- Acceptance fee
- Departmental fee
- Faculty fee
- ICT fee
- Medical fee
- Exam fee
- Development levy
- Student union fee
- Accommodation
- Other charges

Fee item labels:

- Compulsory
- Optional
- One-time
- Recurring
- Fresh-student only
- Returning-student only

---

## 8.5 Comparison System

Users can compare up to three schools.

Comparison inputs:

- School
- Course
- Level
- Student type
- Academic session

Comparison output:

- First-year compulsory cost
- Optional cost
- Accommodation cost
- Returning-year cost
- Estimated degree cost
- Source type
- Verification status
- Last-reviewed date

Rules:

- Maximum of three schools
- Comparison should not rank academic quality
- Lowest cost may be visually highlighted
- Missing data should be clearly marked as unavailable
- Session mismatch should be clearly shown

For V1, comparison state can be stored in the browser using local storage or URL parameters.

---

## 8.6 Community Submission System

Users can submit:

- New fee information
- Corrections
- Missing charges
- School suggestions

Submission fields:

- School
- Course
- Faculty
- Level
- Student type
- Academic session
- Fee items
- Amounts
- Source URL
- Uploaded evidence
- Submitter name
- Submitter email
- Notes

All submissions are saved as pending and require admin review.

Users should see a privacy warning before uploading evidence.

Privacy warning:

> Please remove your name, student ID, payment reference, phone number, email, and other personal information before uploading evidence.

---

## 8.7 Evidence System

Evidence can include:

- Official school webpage
- Official fee circular
- Student portal screenshot
- Payment invoice
- School representative submission
- Receipt
- Official email
- Public school notice

Accepted upload formats:

- PDF
- PNG
- JPG
- JPEG

Recommended file size limit:

- 10 MB per file

Evidence should never expose private student details publicly.

---

## 8.8 Verification System

Every fee record should have a verification label.

Verification statuses:

- `officially_verified`
- `community_verified`
- `reported`
- `outdated`
- `disputed`

Confidence levels:

- `high`
- `medium`
- `low`

Source types:

- `official_school_source`
- `official_fee_circular`
- `school_representative`
- `student_portal_evidence`
- `payment_invoice`
- `community_reported`

High confidence means:

- Clear academic session
- Clear institution
- Clear course or faculty
- Strong source evidence
- Recently reviewed
- Complete or near-complete breakdown

Medium confidence means:

- Reasonable evidence exists
- Some fields may be incomplete
- Source may be student-submitted but credible

Low confidence means:

- Source is unclear
- Evidence is weak
- Session may be unclear
- Only one unsupported submission exists

---

## 8.9 Admin Moderation System

The admin dashboard is used to manage data quality.

Admin modules:

- Dashboard overview
- Institution management
- Course management
- Fee record management
- Submission queue
- Evidence review
- Correction review

Admin actions:

- Approve submission
- Approve with edits
- Reject submission
- Request more evidence
- Mark as duplicate
- Mark as disputed
- Publish fee record
- Unpublish fee record
- Archive outdated records

---

# 9. Information Architecture

## Public Navigation

- Schools
- Compare
- How It Works
- Submit Fees
- Find a School

## Footer Navigation

Product:

- Schools
- Compare
- How It Works

Contribute:

- Submit Fees
- Suggest a School
- Report an Error

Legal:

- Privacy Policy
- Terms
- Disclaimer

## Admin Navigation

- Overview
- Institutions
- Courses
- Fee Records
- Submissions
- Evidence
- Settings

---

# 10. Main Routes

## Public Routes

```text
/
```

Homepage.

```text
/schools
```

School directory and search results.

```text
/schools/[slug]
```

School profile.

```text
/schools/[slug]/fees/[feeRecordId]
```

Detailed fee breakdown.

```text
/compare
```

School comparison.

```text
/how-it-works
```

Verification explanation.

```text
/submit-fees
```

Submit a new fee update.

```text
/submit-correction
```

Submit a correction to an existing fee record.

```text
/suggest-school
```

Suggest a missing school.

## Admin Routes

```text
/admin/login
```

Admin login.

```text
/admin
```

Admin dashboard.

```text
/admin/institutions
```

Manage institutions.

```text
/admin/institutions/new
```

Add institution.

```text
/admin/institutions/[id]
```

Edit institution.

```text
/admin/fees
```

Manage fee records.

```text
/admin/fees/new
```

Add fee record.

```text
/admin/fees/[id]
```

Edit fee record.

```text
/admin/submissions
```

Submission queue.

```text
/admin/submissions/[id]
```

Review one submission.

---

# 11. Database Design

## 11.1 institutions

Stores school-level information.

Fields:

- `id`
- `name`
- `slug`
- `abbreviation`
- `logo_url`
- `institution_type`
- `ownership_type`
- `state`
- `city`
- `website_url`
- `description`
- `is_active`
- `created_at`
- `updated_at`

Example values:

- institution_type: `university`, `polytechnic`, `college_of_education`, `health_institution`
- ownership_type: `federal`, `state`, `private`

---

## 11.2 faculties

Stores faculties or colleges inside institutions.

Fields:

- `id`
- `institution_id`
- `name`
- `created_at`

---

## 11.3 courses

Stores available courses per institution.

Fields:

- `id`
- `institution_id`
- `faculty_id`
- `name`
- `slug`
- `duration_years`
- `qualification`
- `is_active`
- `created_at`
- `updated_at`

---

## 11.4 academic_sessions

Stores academic sessions per institution.

Fields:

- `id`
- `institution_id`
- `name`
- `start_year`
- `end_year`
- `is_current`
- `created_at`

Example:

- name: `2026/2027`
- start_year: `2026`
- end_year: `2027`

---

## 11.5 fee_records

Stores the main fee record for a course, level, student type, and academic session.

Fields:

- `id`
- `institution_id`
- `course_id`
- `academic_session_id`
- `level`
- `student_type`
- `currency`
- `compulsory_total`
- `optional_total`
- `accommodation_total`
- `first_year_total`
- `returning_year_total`
- `estimated_degree_total`
- `verification_status`
- `confidence_level`
- `source_type`
- `last_reviewed_at`
- `review_due_at`
- `is_published`
- `admin_note`
- `created_at`
- `updated_at`

Example student_type values:

- `fresh`
- `returning`

---

## 11.6 fee_items

Stores individual charges inside a fee record.

Fields:

- `id`
- `fee_record_id`
- `name`
- `original_label`
- `category`
- `amount`
- `is_compulsory`
- `frequency`
- `applies_to`
- `description`
- `created_at`
- `updated_at`

Example frequency values:

- `one_time`
- `recurring`

Example applies_to values:

- `fresh_only`
- `returning_only`
- `all_students`

---

## 11.7 evidence

Stores evidence linked to fee records or submissions.

Fields:

- `id`
- `fee_record_id`
- `submission_id`
- `source_type`
- `source_url`
- `file_url`
- `evidence_date`
- `review_status`
- `submitted_by_email`
- `admin_note`
- `created_at`

---

## 11.8 submissions

Stores community-submitted data.

Fields:

- `id`
- `submission_type`
- `institution_id`
- `course_id`
- `academic_session_id`
- `submitter_name`
- `submitter_email`
- `submitted_payload`
- `status`
- `admin_feedback`
- `reviewed_at`
- `created_at`
- `updated_at`

Submission types:

- `new_fee`
- `correction`
- `missing_charge`
- `suggest_school`

Submission statuses:

- `pending`
- `approved`
- `approved_with_edits`
- `rejected`
- `needs_more_evidence`
- `duplicate`
- `disputed`

---

# 12. Data Relationships

- One institution has many faculties.
- One institution has many courses.
- One institution has many academic sessions.
- One institution has many fee records.
- One faculty has many courses.
- One course has many fee records.
- One academic session has many fee records.
- One fee record has many fee items.
- One fee record may have many evidence records.
- One submission may have evidence.
- One approved submission may create or update one fee record.

---

# 13. Fee Calculation Logic

## 13.1 Compulsory Total

Sum all fee items where:

- `is_compulsory = true`

## 13.2 Optional Total

Sum all fee items where:

- `is_compulsory = false`

## 13.3 Accommodation Total

Sum all fee items where:

- `category = accommodation`

Accommodation should remain separate unless the evidence clearly states it is compulsory.

## 13.4 First-Year Total

For fresh students:

```text
compulsory recurring charges + compulsory one-time charges
```

Optional fees are shown separately.

## 13.5 Returning-Year Total

For returning students:

```text
recurring compulsory charges
```

## 13.6 Estimated Degree Total

For a course with four-year duration:

```text
first_year_total + (returning_year_total × 3)
```

For a five-year course:

```text
first_year_total + (returning_year_total × 4)
```

This must always be labelled as an estimate.

---

# 14. User Flows

## 14.1 Search and View Fee

1. User lands on homepage.
2. User searches by school, course, or state.
3. User opens school result.
4. User selects course.
5. User selects level.
6. User selects fresh or returning.
7. User selects academic session.
8. User views fee breakdown.
9. User checks source and verification status.

---

## 14.2 Compare Schools

1. User opens a school profile.
2. User clicks Add to Compare.
3. User repeats for up to two more schools.
4. User opens comparison page.
5. User compares costs side by side.
6. User sees missing data clearly marked.

---

## 14.3 Submit Fee Update

1. User clicks Submit Fees.
2. User selects or enters school.
3. User enters course, level, student type, and session.
4. User adds fee items.
5. User uploads evidence.
6. User submits.
7. System creates pending submission.
8. Admin reviews later.

---

## 14.4 Submit Correction

1. User opens a fee record.
2. User clicks Report an Error.
3. User selects correction type.
4. User enters suggested correction.
5. User uploads evidence.
6. System creates pending correction.
7. Admin reviews later.

---

## 14.5 Admin Review

1. Admin logs in.
2. Admin opens submission queue.
3. Admin reviews submitted data.
4. Admin opens evidence.
5. Admin compares with existing record.
6. Admin approves, edits, rejects, or requests more evidence.
7. Approved data becomes published or updates an existing record.

---

# 15. Component Architecture

## 15.1 Public Components

- `Header`
- `Footer`
- `SearchBar`
- `SchoolCard`
- `SchoolResultRow`
- `FeeSummaryCard`
- `FeeBreakdownTable`
- `SourceBadge`
- `VerificationPanel`
- `CompareButton`
- `ComparisonTable`
- `FilterDrawer`
- `EmptyState`
- `LoadingSkeleton`
- `SubmitFeeForm`
- `SubmitCorrectionForm`
- `SuggestSchoolForm`

## 15.2 Admin Components

- `AdminSidebar`
- `AdminHeader`
- `AdminStatCard`
- `AdminTable`
- `SubmissionQueue`
- `EvidenceViewer`
- `FeeRecordEditor`
- `InstitutionEditor`
- `CourseEditor`
- `ModerationActions`

## 15.3 Shared Components

- `Button`
- `Input`
- `Select`
- `Textarea`
- `FileUpload`
- `Badge`
- `Card`
- `Table`
- `Modal`
- `Toast`
- `Tabs`
- `Pagination`

---

# 16. Design System Direction

## 16.1 Visual Style

The product should feel:

- Minimal
- Calm
- Trustworthy
- Data-led
- Professional
- Easy to scan

Avoid:

- Heavy illustrations
- Fake statistics
- Too many colours
- Complex cards
- Overly decorative UI
- School portal styling

## 16.2 Colours

Primary accent:

- Deep emerald green

Text:

- Dark navy or charcoal

Background:

- White
- Off-white
- Very light grey

Status colours:

- Green: official or verified
- Blue: student portal evidence
- Amber: community reported
- Grey: outdated
- Red: disputed

## 16.3 UI Rules

- Use thin borders over heavy shadows.
- Use large clear cost figures.
- Use source badges everywhere fee data appears.
- Always show academic session near fee amount.
- Avoid hiding verification details.
- Mobile fee tables should become cards.

---

# 17. Permissions

## 17.1 Public User

Can:

- Browse published schools
- Search fees
- Compare schools
- Submit updates
- Submit corrections
- Suggest schools

Cannot:

- Publish data
- Edit verified records
- Access admin dashboard

## 17.2 Admin

Can:

- Create, edit, archive institutions
- Create, edit, publish fee records
- Review submissions
- Manage evidence
- Set verification status
- Set confidence level

---

# 18. Security Requirements

- Admin routes must require authentication.
- Supabase Row Level Security must be enabled.
- Public users can only read published records.
- Public users cannot update fee records directly.
- File uploads must be restricted by type and size.
- User-submitted evidence should not be publicly exposed without admin approval.
- Personal information should not be displayed publicly.
- Submission endpoints should include spam protection.
- Admin actions should be logged later if the product grows.

---

# 19. SEO Requirements

School pages should be indexable.

Each school fee page should have:

- Descriptive title
- Meta description
- Institution name
- Course name
- Academic session
- Fee keywords

Example title:

```text
University of Lagos School Fees for Computer Science  -  2026/2027
```

Example description:

```text
View University of Lagos Computer Science school fees for the 2026/2027 academic session, including compulsory charges, accommodation, source, and verification status.
```

---

# 20. Analytics Events

Track these product events:

- `search_performed`
- `school_result_clicked`
- `school_profile_viewed`
- `fee_record_viewed`
- `source_badge_clicked`
- `compare_item_added`
- `compare_item_removed`
- `comparison_viewed`
- `submission_started`
- `submission_completed`
- `correction_started`
- `correction_completed`
- `suggest_school_completed`
- `admin_submission_reviewed`
- `admin_submission_approved`
- `admin_submission_rejected`

---

# 21. Performance Requirements

- Homepage should load quickly on mobile.
- Search results should appear in under two seconds.
- Images should be optimised.
- School pages should use server rendering where useful.
- Large tables should use pagination.
- Client-side JavaScript should be kept reasonable.
- Public data should be cached where appropriate.

---

# 22. Error and Empty States

## 22.1 School Not Found

Message:

> We do not have this school yet.

Action:

- Suggest a school

## 22.2 Fee Not Available

Message:

> We have not verified fees for this course and session yet.

Actions:

- Submit an update
- Try another course or session

## 22.3 No Comparison Items

Message:

> Add up to three schools to compare their costs.

Action:

- Find schools

## 22.4 Submission Success

Message:

> Your fee update has been submitted for review.

Supporting text:

> We will check the evidence before publishing it.

---

# 23. MVP Seed Data

Launch with:

- 15 to 20 institutions
- 3 to 5 courses per institution
- Latest available academic session
- Fresh-student records
- Returning-student records where available
- At least one source per published fee record

Suggested courses:

- Computer Science
- Nursing
- Law
- Medicine
- Engineering
- Accounting
- Business Administration
- Mass Communication

---

# 24. Suggested Build Phases

## Phase 1  -  Project Foundation

Build:

- Next.js project
- Tailwind setup
- shadcn/ui setup
- Supabase setup
- Auth setup
- Base layout
- Design tokens
- Shared components

## Phase 2  -  Data Foundation

Build:

- Database schema
- Seed institutions
- Seed courses
- Seed sessions
- Seed fee records
- Seed fee items
- Seed evidence

## Phase 3  -  Public Search and School Pages

Build:

- Homepage
- Search
- School directory
- School profile
- Fee finder
- Fee breakdown page

## Phase 4  -  Comparison

Build:

- Add to compare
- Comparison state
- Comparison page
- Mobile comparison layout

## Phase 5  -  Submission Forms

Build:

- Submit fee form
- Submit correction form
- Suggest school form
- File upload
- Success states

## Phase 6  -  Admin

Build:

- Admin login
- Dashboard
- Institution manager
- Fee manager
- Submission queue
- Evidence viewer
- Moderation actions

## Phase 7  -  QA and Launch

Complete:

- Responsive testing
- Accessibility checks
- SEO metadata
- Analytics
- Real seed data
- Vercel deployment

---

# 25. Folder Structure Recommendation

```text
schoolcost-ng/
  app/
    page.tsx
    schools/
      page.tsx
      [slug]/
        page.tsx
        fees/
          [feeRecordId]/
            page.tsx
    compare/
      page.tsx
    how-it-works/
      page.tsx
    submit-fees/
      page.tsx
    submit-correction/
      page.tsx
    suggest-school/
      page.tsx
    admin/
      page.tsx
      login/
        page.tsx
      institutions/
        page.tsx
        new/
          page.tsx
        [id]/
          page.tsx
      fees/
        page.tsx
        new/
          page.tsx
        [id]/
          page.tsx
      submissions/
        page.tsx
        [id]/
          page.tsx

  components/
    public/
    admin/
    shared/
    forms/
    tables/

  lib/
    supabase/
    calculations/
    validations/
    utils/
    constants/

  types/
    database.ts
    fee.ts
    institution.ts
    submission.ts

  docs/
    PRD-SchoolCost-NG.md
    ARCHITECTURE-SchoolCost-NG.md
```

---

# 26. Environment Variables

Expected variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

The service role key must never be exposed to the browser.

---

# 27. Acceptance Criteria

The architecture is ready for scaffolding when:

- The PRD is complete.
- The tech stack is selected.
- Main systems are defined.
- Routes are defined.
- Data models are defined.
- User flows are defined.
- Admin flows are defined.
- Verification rules are defined.
- Fee calculation rules are defined.
- Folder structure is defined.
- MVP build phases are clear.

---

# 28. Definition of Done

The MVP is complete when:

- Users can search for Nigerian tertiary institutions or courses.
- Users can open a school profile.
- Users can select course, level, student type, and academic session.
- Users can view a structured fee breakdown.
- Users can see compulsory, optional, one-time, recurring, and accommodation charges.
- Users can see estimated first-year and degree costs.
- Users can compare up to three schools.
- Every fee record shows source, session, verification status, confidence level, and last-reviewed date.
- Users can submit updates and corrections with evidence.
- Admins can review and moderate submissions.
- Public and admin screens work on desktop and mobile.
- Product is deployed with real seed data for at least 15 institutions.
