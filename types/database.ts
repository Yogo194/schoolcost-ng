export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type InstitutionType =
  | "university"
  | "polytechnic"
  | "college_of_education"
  | "health_institution";

export type OwnershipType = "federal" | "state" | "private";

export type StudentType = "fresh" | "returning";

export type VerificationStatus =
  | "officially_verified"
  | "community_verified"
  | "reported"
  | "outdated"
  | "disputed";

export type ConfidenceLevel = "high" | "medium" | "low";

export type SourceType =
  | "official_school_source"
  | "official_fee_circular"
  | "school_representative"
  | "student_portal_evidence"
  | "payment_invoice"
  | "community_reported";

export type FeeCategory =
  | "tuition"
  | "acceptance_fee"
  | "departmental_fee"
  | "faculty_fee"
  | "ict_fee"
  | "medical_fee"
  | "exam_fee"
  | "development_levy"
  | "student_union_fee"
  | "accommodation"
  | "other";

export type FeeFrequency = "one_time" | "recurring";

export type FeeAppliesTo = "fresh_only" | "returning_only" | "all_students";

export type SubmissionType =
  | "new_fee"
  | "correction"
  | "missing_charge"
  | "suggest_school";

export type SubmissionStatus =
  | "pending"
  | "approved"
  | "approved_with_edits"
  | "rejected"
  | "needs_more_evidence"
  | "duplicate"
  | "disputed";

export type EvidenceSourceType =
  | "official_school_webpage"
  | "official_fee_circular"
  | "student_portal_screenshot"
  | "payment_invoice"
  | "school_representative_submission"
  | "receipt"
  | "official_email"
  | "public_school_notice";

export type EvidenceReviewStatus = "pending" | "approved" | "rejected";

export interface Database {
  public: {
    Tables: {
      institutions: {
        Row: {
          id: string;
          name: string;
          slug: string;
          abbreviation: string | null;
          logo_url: string | null;
          institution_type: InstitutionType;
          ownership_type: OwnershipType;
          state: string;
          city: string | null;
          website_url: string | null;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["institutions"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["institutions"]["Insert"]>;
      };
      faculties: {
        Row: {
          id: string;
          institution_id: string;
          name: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["faculties"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["faculties"]["Insert"]>;
      };
      courses: {
        Row: {
          id: string;
          institution_id: string;
          faculty_id: string | null;
          name: string;
          slug: string;
          duration_years: number;
          qualification: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["courses"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
      };
      academic_sessions: {
        Row: {
          id: string;
          institution_id: string;
          name: string;
          start_year: number;
          end_year: number;
          is_current: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["academic_sessions"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["academic_sessions"]["Insert"]>;
      };
      fee_records: {
        Row: {
          id: string;
          institution_id: string;
          course_id: string | null;
          academic_session_id: string;
          level: string | null;
          student_type: StudentType;
          currency: string;
          compulsory_total: number;
          optional_total: number;
          accommodation_total: number;
          first_year_total: number;
          returning_year_total: number;
          estimated_degree_total: number;
          verification_status: VerificationStatus;
          confidence_level: ConfidenceLevel;
          source_type: SourceType;
          last_reviewed_at: string | null;
          review_due_at: string | null;
          is_published: boolean;
          admin_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["fee_records"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["fee_records"]["Insert"]>;
      };
      fee_items: {
        Row: {
          id: string;
          fee_record_id: string;
          name: string;
          original_label: string | null;
          category: FeeCategory;
          amount: number;
          is_compulsory: boolean;
          frequency: FeeFrequency;
          applies_to: FeeAppliesTo;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["fee_items"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["fee_items"]["Insert"]>;
      };
      evidence: {
        Row: {
          id: string;
          fee_record_id: string | null;
          submission_id: string | null;
          source_type: EvidenceSourceType;
          source_url: string | null;
          file_url: string | null;
          evidence_date: string | null;
          review_status: EvidenceReviewStatus;
          submitted_by_email: string | null;
          admin_note: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["evidence"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["evidence"]["Insert"]>;
      };
      submissions: {
        Row: {
          id: string;
          submission_type: SubmissionType;
          institution_id: string | null;
          course_id: string | null;
          academic_session_id: string | null;
          submitter_name: string | null;
          submitter_email: string | null;
          submitted_payload: Json;
          status: SubmissionStatus;
          admin_feedback: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["submissions"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["submissions"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
