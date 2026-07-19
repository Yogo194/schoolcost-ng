import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpg",
  "image/jpeg",
];

export const feeItemSchema = z.object({
  name: z.string().min(1, "Fee name is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  is_compulsory: z.boolean(),
  frequency: z.enum(["one_time", "recurring"]),
  applies_to: z.enum(["fresh_only", "returning_only", "all_students"]),
});

export const submitFeeSchema = z.object({
  institution_id: z.string().min(1, "Please select a school"),
  course_id: z.string().optional(),
  academic_session_id: z.string().min(1, "Which session is this fee for?"),
  level: z.string().optional(),
  student_type: z.enum(["fresh", "returning"]),
  fees: z.array(feeItemSchema).min(1, "Please add at least one fee item"),
  source_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  submitter_name: z.string().optional(),
  submitter_email: z.string().email("Please enter a valid email address"),
  notes: z.string().optional(),
});

export const submitCorrectionSchema = z.object({
  fee_record_id: z.string().min(1, "Fee record is required"),
  correction_type: z.enum([
    "wrong_amount",
    "wrong_session",
    "missing_item",
    "other",
  ]),
  description: z.string().min(10, "Please describe the correction in detail"),
  suggested_amount: z.coerce.number().positive().optional(),
  source_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  submitter_name: z.string().min(1, "Your name is required"),
  submitter_email: z.string().email("Please enter a valid email address"),
});

export const suggestSchoolSchema = z.object({
  school_name: z.string().min(2, "School name is required"),
  institution_type: z.enum([
    "university",
    "polytechnic",
    "college_of_education",
    "health_institution",
  ]),
  ownership_type: z.enum(["federal", "state", "private"]),
  state: z.string().min(1, "State is required"),
  website_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  notes: z.string().optional(),
  submitter_name: z.string().min(1, "Your name is required"),
  submitter_email: z.string().email("Please enter a valid email address"),
});

export type SubmitFeeInput = z.infer<typeof submitFeeSchema>;
export type SubmitCorrectionInput = z.infer<typeof submitCorrectionSchema>;
export type SuggestSchoolInput = z.infer<typeof suggestSchoolSchema>;
export type FeeItemInput = z.infer<typeof feeItemSchema>;

export { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES };
