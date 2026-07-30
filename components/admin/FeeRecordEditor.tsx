"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { FeeRecord, FeeItem } from "@/types/fee";
import {
  FEE_CATEGORY_LABELS,
  FEE_FREQUENCY_LABELS,
  STUDENT_LEVEL_LABELS,
  STUDENT_LEVEL_VALUES,
  STUDENT_TYPE_LABELS,
} from "@/types/fee";
import { FEE_CATEGORIES } from "@/lib/validations/submission";
import type { Course, Institution } from "@/types/institution";

const feeItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Required"),
  category: z.enum(FEE_CATEGORIES),
  amount: z.coerce.number().positive("Must be > 0"),
  is_compulsory: z.boolean(),
  frequency: z.enum(["one_time", "recurring"]),
  applies_to: z.enum(["fresh_only", "returning_only", "all_students"]),
  description: z.string().optional(),
});

const schema = z.object({
  institution_id: z.string().uuid("Select a school"),
  course_id: z.string().optional().or(z.literal("")),
  academic_session: z.string().min(1, "Academic session is required"),
  level: z.string().optional(),
  student_type: z.enum(["fresh", "returning"]),
  duration_years: z.coerce.number().int().min(1, "Duration is required"),
  verification_status: z.enum([
    "officially_verified",
    "community_verified",
    "reported",
    "outdated",
    "disputed",
  ]),
  confidence_level: z.enum(["high", "medium", "low"]),
  source_type: z.enum([
    "official_school_source",
    "official_fee_circular",
    "school_representative",
    "student_portal_evidence",
    "payment_invoice",
    "community_reported",
  ]),
  admin_note: z.string().optional(),
  is_published: z.boolean(),
  fee_items: z.array(feeItemSchema).min(1, "Add at least one fee item"),
});

export type FeeRecordEditorValues = z.infer<typeof schema>;

interface FeeRecordEditorProps {
  record?: Partial<FeeRecord>;
  items?: FeeItem[];
  sessionName?: string;
  institutionOptions: Pick<Institution, "id" | "name">[];
  courseOptions: Pick<Course, "id" | "institution_id" | "name" | "duration_years">[];
  onSubmit: (values: FeeRecordEditorValues) => Promise<void>;
  isLoading?: boolean;
}

export function FeeRecordEditor({
  record,
  items = [],
  sessionName,
  institutionOptions,
  courseOptions,
  onSubmit,
  isLoading,
}: FeeRecordEditorProps) {
  const initialDurationYears =
    courseOptions.find((course) => course.id === record?.course_id)
      ?.duration_years ?? 4;
  const form = useForm<FeeRecordEditorValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      institution_id: record?.institution_id ?? "",
      course_id: record?.course_id ?? "",
      academic_session: sessionName ?? "",
      level: record?.level ?? "",
      student_type: record?.student_type ?? "fresh",
      duration_years: initialDurationYears,
      verification_status: record?.verification_status ?? "reported",
      confidence_level: record?.confidence_level ?? "low",
      source_type: record?.source_type ?? "community_reported",
      admin_note: record?.admin_note ?? "",
      is_published: record?.is_published ?? false,
      fee_items: items.length > 0
        ? items.map((i) => ({
            id: i.id,
            name: i.name,
            category: i.category,
            amount: i.amount,
            is_compulsory: i.is_compulsory,
            frequency: i.frequency,
            applies_to: i.applies_to,
            description: i.description ?? "",
          }))
        : [{ name: "", category: "tuition", amount: 0, is_compulsory: true, frequency: "recurring", applies_to: "all_students" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fee_items",
  });
  const selectedInstitutionId = form.watch("institution_id");
  const selectedCourseId = form.watch("course_id");
  const availableCourses = courseOptions.filter(
    (course) => course.institution_id === selectedInstitutionId
  );

  async function handleSubmit(values: FeeRecordEditorValues) {
    try {
      await onSubmit(values);
    } catch (error) {
      form.setError("root", {
        type: "manual",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong saving this fee record.",
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
      <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Record</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">School</Label>
            <Select
              value={selectedInstitutionId || undefined}
              onValueChange={(value) => {
                if (!value) return;
                form.setValue("institution_id", value, { shouldValidate: true });
                form.setValue("course_id", "");
              }}
            >
              <SelectTrigger><SelectValue placeholder="Select school" /></SelectTrigger>
              <SelectContent>
                {institutionOptions.map((institution) => (
                  <SelectItem key={institution.id} value={institution.id}>
                    {institution.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.institution_id && (
              <p className="text-xs text-destructive">
                {form.formState.errors.institution_id.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Course</Label>
            <Select
              value={selectedCourseId || "__all_courses"}
              onValueChange={(value) => {
                if (!value) return;
                const courseId = value === "__all_courses" ? "" : value;
                form.setValue("course_id", courseId, { shouldValidate: true });
                const course = courseOptions.find((item) => item.id === courseId);
                if (course) {
                  form.setValue("duration_years", course.duration_years);
                }
              }}
              disabled={!selectedInstitutionId}
            >
              <SelectTrigger><SelectValue placeholder="All courses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__all_courses">All courses</SelectItem>
                {availableCourses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Academic Session</Label>
            <Input {...form.register("academic_session")} placeholder="2025/2026" />
            {form.formState.errors.academic_session && (
              <p className="text-xs text-destructive">
                {form.formState.errors.academic_session.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Level</Label>
            <Select
              value={form.watch("level") || "__all_levels"}
              onValueChange={(value) => {
                if (!value) return;
                form.setValue("level", value === "__all_levels" ? "" : value);
              }}
            >
              <SelectTrigger><SelectValue placeholder="All levels" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__all_levels">All levels</SelectItem>
                {STUDENT_LEVEL_VALUES.map((level) => (
                  <SelectItem key={level} value={level}>
                    {STUDENT_LEVEL_LABELS[level]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Student Type</Label>
            <Select
              value={form.watch("student_type")}
              onValueChange={(value) =>
                form.setValue(
                  "student_type",
                  value as FeeRecordEditorValues["student_type"]
                )
              }
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fresh">{STUDENT_TYPE_LABELS.fresh}</SelectItem>
                <SelectItem value="returning">
                  {STUDENT_TYPE_LABELS.returning}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Programme Duration</Label>
            <Input
              {...form.register("duration_years")}
              type="number"
              min={1}
              className="text-sm"
            />
            {form.formState.errors.duration_years && (
              <p className="text-xs text-destructive">
                {form.formState.errors.duration_years.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* Verification */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Verification</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <Select
              value={form.watch("verification_status")}
              onValueChange={(v) => form.setValue("verification_status", v as FeeRecordEditorValues["verification_status"])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="officially_verified">Officially Verified</SelectItem>
                <SelectItem value="community_verified">Community Verified</SelectItem>
                <SelectItem value="reported">Reported</SelectItem>
                <SelectItem value="outdated">Outdated</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Confidence</Label>
            <Select
              value={form.watch("confidence_level")}
              onValueChange={(v) => form.setValue("confidence_level", v as FeeRecordEditorValues["confidence_level"])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Source Type</Label>
            <Select
              value={form.watch("source_type")}
              onValueChange={(v) => form.setValue("source_type", v as FeeRecordEditorValues["source_type"])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="official_school_source">Official School Source</SelectItem>
                <SelectItem value="official_fee_circular">Official Fee Circular</SelectItem>
                <SelectItem value="school_representative">School Representative</SelectItem>
                <SelectItem value="student_portal_evidence">Student Portal Evidence</SelectItem>
                <SelectItem value="payment_invoice">Payment Invoice</SelectItem>
                <SelectItem value="community_reported">Community Reported</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <Separator />

      {/* Fee Items */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Fee Items</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                name: "",
                category: "other",
                amount: 0,
                is_compulsory: true,
                frequency: "recurring",
                applies_to: "all_students",
              })
            }
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map((field, idx) => (
            <div
              key={field.id}
              className="border border-gray-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    {...form.register(`fee_items.${idx}.name`)}
                    placeholder="Fee name (e.g. Tuition Fee)"
                    className="text-sm"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(idx)}
                  className="text-gray-400 hover:text-destructive shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Category</Label>
                  <Select
                    value={form.watch(`fee_items.${idx}.category`)}
                    onValueChange={(v) => { if (v) form.setValue(`fee_items.${idx}.category`, v as never); }}
                  >
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(FEE_CATEGORY_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Amount (₦)</Label>
                  <Input
                    {...form.register(`fee_items.${idx}.amount`)}
                    type="number"
                    className="h-8 text-xs"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Frequency</Label>
                  <Select
                    value={form.watch(`fee_items.${idx}.frequency`)}
                    onValueChange={(v) => form.setValue(`fee_items.${idx}.frequency`, v as "one_time" | "recurring")}
                  >
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recurring">
                        {FEE_FREQUENCY_LABELS.recurring}
                      </SelectItem>
                      <SelectItem value="one_time">
                        {FEE_FREQUENCY_LABELS.one_time}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Applies To</Label>
                  <Select
                    value={form.watch(`fee_items.${idx}.applies_to`)}
                    onValueChange={(v) => form.setValue(`fee_items.${idx}.applies_to`, v as "fresh_only" | "returning_only" | "all_students")}
                  >
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_students">All students</SelectItem>
                      <SelectItem value="fresh_only">Fresh only</SelectItem>
                      <SelectItem value="returning_only">Returning only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Compulsory toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...form.register(`fee_items.${idx}.is_compulsory`)}
                  className="accent-primary"
                />
                <span className="text-xs text-gray-600">Compulsory fee</span>
              </label>
            </div>
          ))}
        </div>
        {form.formState.errors.fee_items && (
          <p className="text-xs text-destructive mt-2">
            {form.formState.errors.fee_items.message ?? "Please check fee items"}
          </p>
        )}
      </section>

      <Separator />

      {/* Publish */}
      <section>
        <div className="mb-5 space-y-1.5">
          <Label className="text-xs">Reviewer note</Label>
          <Textarea
            {...form.register("admin_note")}
            placeholder="Internal source notes, assumptions, or review context"
            rows={3}
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...form.register("is_published")}
            className="accent-primary"
          />
          <span className="text-sm font-medium text-gray-900">
            Publish this fee record
          </span>
        </label>
        <p className="text-xs text-gray-400 mt-1 ml-6">
          Published records are visible to the public.
        </p>
      </section>

      {form.formState.errors.root && (
        <p className="text-sm text-destructive">
          {form.formState.errors.root.message}
        </p>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving…" : record?.id ? "Save Changes" : "Create Fee Record"}
      </Button>
    </form>
  );
}
