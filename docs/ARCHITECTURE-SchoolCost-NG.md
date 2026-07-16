# SchoolCost NG  -  Detailed Product & Technical Specification

## 1. Product Overview
SchoolCost NG is a Nigerian tertiary education cost transparency platform that helps students and parents search, understand, and compare the complete cost of attending universities, polytechnics, colleges of education, and health institutions.

The platform goes beyond headline tuition by showing course-specific and session-specific fee breakdowns, including compulsory, optional, one-time, recurring, and accommodation charges. Every fee record includes its source, academic session, verification status, confidence level, and last-reviewed date.

## 2. Product Goals

### Primary Goals
- Help users find reliable school-fee information quickly.
- Show the true first-year cost, not tuition alone.
- Make school costs easy to compare.
- Build trust through visible sources and verification.
- Allow users to submit updates and corrections with evidence.

### Non-Goals for V1
- Admission applications
- Scholarships and loans
- Hostel booking
- School rankings and reviews
- Primary and secondary school coverage
- AI chatbot
- Automatic fee extraction
- Mobile app
- Monetisation

## 3. Target Users
- Prospective students comparing institutions before applying or accepting admission
- Parents and guardians planning education costs
- Current students contributing updated fee information
- Administrator managing institutions, fees, evidence, and moderation

## 4. Core V1 Features

### 4.1 Search and Discovery
Users can search by school name, course, state, institution type, and ownership type.

### 4.2 School Profiles and Fee Breakdowns
Users select course, academic level, fresh or returning student, and academic session. The platform displays compulsory, optional, one-time, recurring, and accommodation charges, plus first-year and returning-year estimates.

### 4.3 School Comparison
Users can compare up to three schools using first-year cost, returning-year cost, accommodation, estimated degree cost, academic session, source type, and review date.

### 4.4 Verification and Evidence
Each fee record displays source type, verification status, confidence level, academic session, last-reviewed date, and supporting evidence.

### 4.5 Community Updates and Corrections
Users can submit new fees, corrections, missing charges, school suggestions, and evidence. All submissions enter an admin moderation queue.

## 5. Recommended Technology Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Supabase
- PostgreSQL
- Supabase Authentication
- Supabase Storage
- Supabase Row Level Security

### Supporting Tools
- React Hook Form
- Zod
- PostHog
- Recharts
- Resend
- Lucide
- Vercel

## 6. System Architecture

### Client Layer
The Next.js frontend handles public pages, search, school profiles, fee breakdowns, comparison, submission forms, and the admin interface.

### Application Layer
Next.js server actions or API routes handle search, fee calculations, submissions, moderation, and evidence upload coordination.

### Data Layer
Supabase PostgreSQL stores institutions, courses, sessions, fee records, fee items, evidence, submissions, and admin decisions.

### File Layer
Supabase Storage stores school logos, circulars, screenshots, receipts, invoices, and supporting documents.

### Authentication Layer
Supabase Authentication protects admin routes. V1 may allow public submissions without accounts, provided users enter a valid email.

## 7. Data Model

### institutions
- id
- name
- slug
- abbreviation
- logo_url
- institution_type
- ownership_type
- state
- city
- website_url
- description
- is_active
- created_at
- updated_at

### faculties
- id
- institution_id
- name
- created_at

### courses
- id
- institution_id
- faculty_id
- name
- slug
- duration_years
- qualification
- is_active
- created_at
- updated_at

### academic_sessions
- id
- institution_id
- name
- start_year
- end_year
- is_current
- created_at

### fee_records
- id
- institution_id
- course_id
- academic_session_id
- level
- student_type
- currency
- compulsory_total
- optional_total
- accommodation_total
- first_year_total
- returning_year_total
- estimated_degree_total
- verification_status
- confidence_level
- source_type
- last_reviewed_at
- review_due_at
- is_published
- admin_note
- created_at
- updated_at

### fee_items
- id
- fee_record_id
- name
- original_label
- category
- amount
- is_compulsory
- frequency
- applies_to
- description
- created_at
- updated_at

### evidence
- id
- fee_record_id
- submission_id
- source_type
- source_url
- file_url
- evidence_date
- review_status
- submitted_by_email
- admin_note
- created_at

### submissions
- id
- submission_type
- institution_id
- course_id
- academic_session_id
- submitter_name
- submitter_email
- submitted_payload
- status
- admin_feedback
- reviewed_at
- created_at
- updated_at

## 8. Key Relationships
- One institution has many faculties, courses, sessions, and fee records.
- One course belongs to one institution.
- One fee record belongs to one institution, course, and academic session.
- One fee record has many fee items and may have many evidence records.
- One approved submission may create or update one fee record.

## 9. Verification Model

### Verification Status
- officially_verified
- community_verified
- reported
- outdated
- disputed

### Confidence Level
- high
- medium
- low

### Source Type
- official_school_source
- official_fee_circular
- school_representative
- student_portal_evidence
- payment_invoice
- community_reported

## 10. Fee Calculation Rules

### Compulsory Total
Sum of all compulsory fee items.

### Optional Total
Sum of all optional fee items.

### First-Year Total
Compulsory total plus one-time fresh-student charges.

### Returning-Year Total
Recurring compulsory charges that apply to returning students.

### Estimated Degree Total
First-year total plus returning-year total multiplied by the remaining programme years. This must always be labelled as an estimate.

### Accommodation
Accommodation remains separate unless evidence confirms it is compulsory.

## 11. Main Routes

### Public
- /
- /schools
- /schools/[slug]
- /schools/[slug]/fees/[feeRecordId]
- /compare
- /how-it-works
- /submit-fees
- /submit-correction
- /suggest-school

### Admin
- /admin/login
- /admin
- /admin/institutions
- /admin/institutions/new
- /admin/institutions/[id]
- /admin/fees
- /admin/fees/new
- /admin/fees/[id]
- /admin/submissions
- /admin/submissions/[id]

## 12. Main User Flows

### Search and View Fees
1. Search for a school or course.
2. Open a school profile.
3. Select course, level, student type, and session.
4. View summary, breakdown, source, and verification details.

### Compare Schools
1. Add a school to comparison.
2. Add up to two more.
3. Open comparison.
4. Compare equivalent fee records.

### Submit an Update
1. Open a school or fee page.
2. Select Submit Update.
3. Enter fee details.
4. Upload evidence.
5. Submit for moderation.

### Admin Moderation
1. Open submission queue.
2. Review data and evidence.
3. Compare against existing records.
4. Approve, edit, reject, or request more evidence.
5. Publish approved data.

## 13. Search Behaviour

### Searchable Fields
- Institution name
- Abbreviation
- Course name
- State
- City

### Ranking
1. Exact institution name
2. Exact abbreviation
3. Exact course
4. Partial institution match
5. State or city match

Use PostgreSQL full-text search for V1.

## 14. Admin Capabilities

### Institution Management
- Add and edit institutions
- Upload logos
- Add faculties and courses
- Archive institutions

### Fee Management
- Create and edit fee records
- Add fee items
- Duplicate a previous session
- Set source and verification status
- Publish or unpublish records

### Submission Management
- Review evidence
- Approve
- Approve with edits
- Reject
- Request more evidence
- Mark duplicate
- Mark disputed

## 15. Permissions and Security

### Public Users
Can browse, search, compare, and submit updates.

### Admin
Can manage institutions, fees, evidence, and submissions.

### Security Requirements
- Protect admin routes.
- Enable Supabase Row Level Security.
- Public users can only read published records.
- Restrict upload file types and sizes.
- Add spam protection and rate limiting.
- Never publicly expose personal information from evidence.

## 16. File Upload Rules
Accepted formats:
- PDF
- PNG
- JPG
- JPEG

Maximum recommended size:
- 10 MB per file

Users must remove student names, IDs, payment references, phone numbers, email addresses, and private financial details.

## 17. Design System Requirements

### Visual Style
- Minimal
- Data-led
- Trustworthy
- Mostly neutral
- Deep green accent
- Dark navy or charcoal text
- Thin borders
- Minimal shadows
- Generous spacing

### Core Components
- Header
- Search field
- School cards
- Fee tables
- Source badges
- Verification panel
- Comparison table
- Filter drawer
- File uploader
- Admin tables
- Empty states
- Loading skeletons
- Toast messages

### Responsive Targets
- Desktop: 1440 px
- Tablet: 768 px
- Mobile: 390 px

## 18. Analytics Events
- search_performed
- school_opened
- fee_record_viewed
- compare_item_added
- comparison_viewed
- submission_started
- submission_completed
- correction_submitted
- source_viewed

## 19. Performance Requirements
- Fast loading on mobile networks
- Optimised images
- Search results under two seconds
- Pagination for large tables
- Server-render public school pages where practical
- Only published records indexed publicly

## 20. SEO Requirements
Each school page should include the institution name, course, session, and fee-related metadata.

Example title:
University of Lagos School Fees for Computer Science  -  2026/2027

## 21. MVP Seed Data
- 15 to 20 institutions
- 3 to 5 popular courses per institution
- Latest available academic session
- Fresh-student records
- Returning-student records where available
- At least one source item per published record

## 22. Build Phases

### Phase 1  -  Foundation
- Create project
- Configure Supabase
- Create schema
- Set up admin authentication
- Build design system

### Phase 2  -  Public Experience
- Homepage
- School directory
- School profile
- Fee breakdown
- Search and filters

### Phase 3  -  Comparison
- Add to compare
- Comparison page
- Degree-cost estimate

### Phase 4  -  Contributions
- Submit update
- Submit correction
- Suggest school
- Evidence upload

### Phase 5  -  Admin
- Dashboard
- Submission queue
- Review flow
- Institution and fee management

### Phase 6  -  QA and Launch
- Responsive testing
- Accessibility checks
- Seed real data
- Deploy
- Connect analytics

## 23. Definition of Done
The MVP is complete when:
- Users can search for a Nigerian tertiary institution or course.
- Users can filter and open a school profile.
- Users can select course, level, student type, and academic session.
- Users can view a complete fee breakdown.
- Users can see estimated first-year and degree costs.
- Users can compare up to three schools.
- Every fee record shows source, session, status, and review date.
- Users can submit updates and corrections with evidence.
- Admins can review and moderate submissions.
- Public and admin experiences work on desktop and mobile.
- The platform is deployed with real data for at least 15 institutions.
