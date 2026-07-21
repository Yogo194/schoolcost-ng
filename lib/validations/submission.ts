import { z } from "zod";
import type { FeeCategory } from "@/types/database";
import { STUDENT_LEVEL_VALUES } from "@/types/fee";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpg",
  "image/jpeg",
];

const FEE_CATEGORIES = [
  "tuition",
  "acceptance_fee",
  "departmental_fee",
  "faculty_fee",
  "ict_fee",
  "medical_fee",
  "exam_fee",
  "development_levy",
  "student_union_fee",
  "accommodation",
  "other",
] as const satisfies readonly FeeCategory[];

export const feeItemSchema = z.object({
  name: z.string().min(1, "Please name this fee"),
  category: z.enum(FEE_CATEGORIES, { error: "Pick a fee type" }),
  amount: z.coerce
    .number({ error: "Enter an amount" })
    .positive("Amount must be greater than 0"),
  is_compulsory: z.boolean(),
  frequency: z.enum(["one_time", "recurring"]),
  applies_to: z.enum(["fresh_only", "returning_only", "all_students"]),
});

export const submitFeeSchema = z.object({
  institution_id: z.string().uuid("Please select a school from the list"),
  /** Known course id when the user picked from the school list. */
  course_id: z.string().optional().or(z.literal("")),
  /** Always the course name shown to reviewers, listed or typed. */
  course_name: z.string().min(1, "Which course is this fee for?"),
  /** Free-text session label, e.g. 2025/2026. Resolved to a row on approve. */
  academic_session: z
    .string()
    .min(1, "Which session is this fee for?")
    .transform((value) => value.trim().replace(/\s*[-–—]\s*/g, "/")),
  level: z.union([z.enum(STUDENT_LEVEL_VALUES), z.literal("")]).optional(),
  student_type: z.enum(["fresh", "returning"]),
  fees: z
    .array(feeItemSchema)
    .min(1, "Please add at least one fee item")
    .superRefine((fees, ctx) => {
      const seen = new Set<string>();
      fees.forEach((fee, index) => {
        if (seen.has(fee.category)) {
          ctx.addIssue({
            code: "custom",
            message: "You already added this fee type",
            path: [index, "category"],
          });
        }
        seen.add(fee.category);
      });
    }),
  source_url: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || z.string().url().safeParse(value).success,
      "Please enter a valid URL"
    ),
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

export { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES, FEE_CATEGORIES };
