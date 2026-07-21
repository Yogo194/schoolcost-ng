"use client";

import { useState } from "react";
import { useForm, useFieldArray, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CoursePicker } from "@/components/forms/CoursePicker";
import { EvidenceUploadField } from "@/components/forms/EvidenceUploadField";
import {
  submitFeeSchema,
  type SubmitFeeInput,
} from "@/lib/validations/submission";
import type { SubmitCourseOption } from "@/lib/mock/courses";
import { FEE_CATEGORY_LABELS } from "@/types/fee";
import { formatCurrency } from "@/lib/utils/format";
import type { Institution } from "@/types/institution";

export type SubmitFeePayload = SubmitFeeInput & {
  evidenceFiles: File[];
};

interface SubmitFeeFormProps {
  institutions: Institution[];
  courses: SubmitCourseOption[];
  onSubmit: (data: SubmitFeePayload) => Promise<void>;
}

const STEPS = [
  {
    id: "school",
    label: "The school",
    heading: "Which school is this about?",
    blurb: "School, session, and course. Level helps, but can wait.",
  },
  {
    id: "fees",
    label: "The fees",
    heading: "What are the charges?",
    blurb: "One fee is enough to help. Add more if you have them.",
  },
  {
    id: "send",
    label: "Send it in",
    heading: "Almost done",
    blurb: "An email so we can confirm details. Everything else is optional.",
  },
] as const;

/** Fields checked before each step advances. */
const STEP_SCHEMAS = [
  submitFeeSchema.pick({
    institution_id: true,
    academic_session_id: true,
    student_type: true,
    course_id: true,
    course_name: true,
  }),
  submitFeeSchema.pick({
    fees: true,
  }),
  submitFeeSchema.pick({
    submitter_email: true,
    source_url: true,
    submitter_name: true,
    notes: true,
  }),
] as const;

export function SubmitFeeForm({
  institutions,
  courses,
  onSubmit,
}: SubmitFeeFormProps) {
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  /** Which fee card is expanded. Older cards collapse when a new one is added. */
  const [expandedFeeIndex, setExpandedFeeIndex] = useState(0);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);

  const form = useForm<SubmitFeeInput>({
    resolver: zodResolver(submitFeeSchema),
    mode: "onTouched",
    defaultValues: {
      institution_id: "",
      course_id: "",
      course_name: "",
      academic_session_id: "",
      student_type: "fresh",
      fees: [
        {
          name: "Tuition",
          category: "tuition",
          amount: undefined as unknown as number,
          is_compulsory: true,
          frequency: "recurring",
          applies_to: "all_students",
        },
      ],
      submitter_name: "",
      submitter_email: "",
      source_url: "",
      notes: "",
      level: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fees",
  });

  async function goNext() {
    // Keep displayed fee type and stored name in sync for listed categories.
    const fees = form.getValues("fees");
    fees.forEach((fee, index) => {
      if (fee.category && fee.category !== "other") {
        form.setValue(
          `fees.${index}.name`,
          FEE_CATEGORY_LABELS[
            fee.category as keyof typeof FEE_CATEGORY_LABELS
          ] ?? fee.name
        );
      }
    });

    const parsed = STEP_SCHEMAS[step].safeParse(form.getValues());
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".") as FieldPath<SubmitFeeInput>;
        form.setError(path, { type: "manual", message: issue.message });
      }
      const feeIssue = parsed.error.issues.find(
        (issue) => issue.path[0] === "fees" && typeof issue.path[1] === "number"
      );
      if (feeIssue) setExpandedFeeIndex(feeIssue.path[1] as number);
      const first = parsed.error.issues[0]?.path.join(".");
      if (first) form.setFocus(first as FieldPath<SubmitFeeInput>);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit(data: SubmitFeeInput) {
    setSending(true);
    try {
      await onSubmit({
        ...data,
        evidenceFiles,
      });
      form.reset();
      setStep(0);
      setExpandedFeeIndex(0);
      setEvidenceFiles([]);
    } catch (error) {
      form.setError("root", {
        type: "manual",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong sending this. Please try again.",
      });
    } finally {
      setSending(false);
    }
  }

  const selectedInstitution = institutions.find(
    (inst) => inst.id === form.watch("institution_id")
  );
  const watchedFees = form.watch("fees");
  const feeTotal = watchedFees.reduce(
    (sum, fee) => sum + (Number(fee.amount) || 0),
    0
  );
  const usedCategories = new Set(
    watchedFees.map((fee) => fee.category).filter(Boolean)
  );
  const nextAvailableCategory = (
    Object.keys(FEE_CATEGORY_LABELS) as (keyof typeof FEE_CATEGORY_LABELS)[]
  ).find((key) => !usedCategories.has(key));
  const canAddAnotherFee = Boolean(nextAvailableCategory);

  return (
    <div>
      {/* Quiet progress: fraction + bar. Step title below does the talking. */}
      <div className="mb-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-medium tabular-nums tracking-[-0.02em] text-brand-ink/50">
            <span className="text-brand-ink">{step + 1}</span>
            <span className="mx-0.5 text-brand-ink/30">/</span>
            <span>{STEPS.length}</span>
          </p>
          <p className="text-sm tracking-[-0.01em] text-brand-ink/40">
            {STEPS[step].label}
          </p>
        </div>
        <div
          className="mt-2.5 h-1 overflow-hidden rounded-full bg-[#eef1ee]"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={step + 1}
          aria-label={`Step ${step + 1} of ${STEPS.length}`}
        >
          <div
            className="h-full rounded-full bg-brand-ink transition-[width] duration-300 ease-out motion-reduce:transition-none"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold tracking-[-0.03em] text-brand-ink sm:text-2xl">
          {STEPS[step].heading}
        </h2>
        <p className="mt-1 text-sm leading-[1.5] text-brand-ink/65 sm:text-[15px]">
          {STEPS[step].blurb}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-6">
        {/* Step 1: the school */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label>School</Label>
              <Select
                value={form.watch("institution_id")}
                onValueChange={(v) => {
                  if (v) {
                    form.setValue("institution_id", v, {
                      shouldValidate: true,
                    });
                    form.setValue("course_id", "");
                    form.setValue("course_name", "");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a school">
                    {(value) =>
                      institutions.find((inst) => inst.id === value)?.name ??
                      "Select a school"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {institutions.map((inst) => (
                    <SelectItem key={inst.id} value={inst.id}>
                      {inst.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.institution_id && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.institution_id.message}
                </p>
              )}
              <p className="text-xs text-brand-ink/50">
                School not listed?{" "}
                <a
                  href="/suggest-school"
                  className="font-medium text-[#c8792a] underline underline-offset-2 hover:text-[#a86520]"
                >
                  Suggest it here.
                </a>
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Academic session</Label>
                <Input
                  {...form.register("academic_session_id")}
                  placeholder="e.g. 2025/2026"
                />
                {form.formState.errors.academic_session_id && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.academic_session_id.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Who pays this?</Label>
                <Select
                  value={form.watch("student_type")}
                  onValueChange={(v) =>
                    form.setValue(
                      "student_type",
                      v as SubmitFeeInput["student_type"]
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select student type">
                      {(value) =>
                        value === "returning"
                          ? "Returning students"
                          : value === "fresh"
                            ? "Fresh students"
                            : "Select student type"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fresh">Fresh students</SelectItem>
                    <SelectItem value="returning">
                      Returning students
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <CoursePicker
                institutionId={form.watch("institution_id")}
                courses={courses}
                courseId={form.watch("course_id") ?? ""}
                courseName={form.watch("course_name")}
                error={form.formState.errors.course_name?.message}
                onChange={({ courseId, courseName }) => {
                  form.setValue("course_id", courseId, { shouldValidate: true });
                  form.setValue("course_name", courseName, {
                    shouldValidate: true,
                  });
                }}
              />
              <div className="space-y-1.5">
                <Label>
                  Level{" "}
                  <span className="font-normal text-brand-ink/45">(optional)</span>
                </Label>
                <Input
                  {...form.register("level")}
                  placeholder="e.g. 100 Level"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: the fees */}
        {step === 1 && (
          <div className="space-y-3">
            {fields.map((field, idx) => {
              const fee = watchedFees[idx];
              const expanded = expandedFeeIndex === idx;
              const categoryLabel =
                FEE_CATEGORY_LABELS[
                  fee?.category as keyof typeof FEE_CATEGORY_LABELS
                ] ?? fee?.category;
              const amountLabel =
                fee?.amount && Number(fee.amount) > 0
                  ? formatCurrency(Number(fee.amount))
                  : null;
              const takenCategories = new Set(
                watchedFees
                  .map((item, itemIndex) =>
                    itemIndex === idx ? null : item.category
                  )
                  .filter(Boolean)
              );

              return (
                <div
                  key={field.id}
                  className="overflow-hidden rounded-[14px] border border-[#e2b57a] bg-[#fff1de]"
                >
                  {!expanded ? (
                    <div className="flex items-center gap-2 px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => setExpandedFeeIndex(idx)}
                        className="flex min-w-0 flex-1 items-center gap-3 rounded-[10px] px-1 py-1 text-left transition-colors hover:bg-[#ffe6c2]"
                      >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f2ac5b]/45 text-xs font-semibold text-brand-ink">
                          {idx + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold tracking-[-0.02em] text-brand-ink">
                            {fee?.name?.trim() ||
                              categoryLabel ||
                              `Fee ${idx + 1}`}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-brand-ink/65">
                            {amountLabel || "Tap to edit"}
                          </span>
                        </span>
                        <ChevronDown
                          className="size-4 shrink-0 text-brand-ink/60"
                          aria-hidden
                        />
                      </button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (fields.length === 1) return;
                          remove(idx);
                          setExpandedFeeIndex((current) => {
                            if (idx < current) return current - 1;
                            if (idx === current) {
                              return Math.max(0, current - 1);
                            }
                            return current;
                          });
                        }}
                        disabled={fields.length === 1}
                        className="shrink-0 text-brand-ink/60 hover:text-destructive"
                        aria-label="Remove this fee"
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 p-4">
                      <div className="flex items-start gap-3">
                        <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label className="text-brand-ink">
                              What kind of fee?
                            </Label>
                            <Select
                              value={form.watch(`fees.${idx}.category`)}
                              onValueChange={(v) => {
                                if (!v) return;
                                form.setValue(
                                  `fees.${idx}.category`,
                                  v as never,
                                  { shouldValidate: true }
                                );
                                if (v === "other") {
                                  const current = form.getValues(
                                    `fees.${idx}.name`
                                  );
                                  const isPreset = Object.values(
                                    FEE_CATEGORY_LABELS
                                  ).includes(current as never);
                                  if (!current || isPreset) {
                                    form.setValue(`fees.${idx}.name`, "", {
                                      shouldValidate: true,
                                    });
                                  }
                                } else {
                                  form.setValue(
                                    `fees.${idx}.name`,
                                    FEE_CATEGORY_LABELS[
                                      v as keyof typeof FEE_CATEGORY_LABELS
                                    ],
                                    { shouldValidate: true }
                                  );
                                }
                              }}
                            >
                              <SelectTrigger className="border-[#d4b48a]/70 bg-white">
                                <SelectValue>
                                  {(value) =>
                                    FEE_CATEGORY_LABELS[
                                      value as keyof typeof FEE_CATEGORY_LABELS
                                    ] ?? "Select a fee type"
                                  }
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(FEE_CATEGORY_LABELS).map(
                                  ([k, v]) => {
                                    const taken = takenCategories.has(k);
                                    return (
                                      <SelectItem
                                        key={k}
                                        value={k}
                                        disabled={taken}
                                      >
                                        {taken ? `${v} (already added)` : v}
                                      </SelectItem>
                                    );
                                  }
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-brand-ink">Amount (₦)</Label>
                            <Input
                              {...form.register(`fees.${idx}.amount`)}
                              type="number"
                              inputMode="numeric"
                              placeholder="0"
                              className="border-[#d4b48a]/70 bg-white placeholder:text-brand-ink/55"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (fields.length === 1) return;
                            remove(idx);
                            setExpandedFeeIndex((current) => {
                              if (idx < current) return current - 1;
                              if (idx === current) {
                                return Math.max(0, current - 1);
                              }
                              return current;
                            });
                          }}
                          disabled={fields.length === 1}
                          className="mt-7 shrink-0 text-brand-ink/60 hover:text-destructive"
                          aria-label="Remove this fee"
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </Button>
                      </div>

                      {form.watch(`fees.${idx}.category`) === "other" && (
                        <div className="space-y-1.5">
                          <Label className="text-brand-ink">
                            What should we call it?
                          </Label>
                          <Input
                            {...form.register(`fees.${idx}.name`)}
                            placeholder="e.g. Matriculation fee"
                            className="border-[#d4b48a]/70 bg-white placeholder:text-brand-ink/55"
                          />
                        </div>
                      )}

                      {(form.formState.errors.fees?.[idx]?.amount ||
                        form.formState.errors.fees?.[idx]?.category ||
                        (form.watch(`fees.${idx}.category`) === "other" &&
                          form.formState.errors.fees?.[idx]?.name)) && (
                        <p className="text-xs text-destructive">
                          {form.formState.errors.fees[idx]?.category?.message ??
                            form.formState.errors.fees[idx]?.amount?.message ??
                            form.formState.errors.fees[idx]?.name?.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            <Button
              type="button"
              variant="outline"
              disabled={!canAddAnotherFee}
              onClick={() => {
                if (!nextAvailableCategory) return;
                append({
                  name:
                    nextAvailableCategory === "other"
                      ? ""
                      : FEE_CATEGORY_LABELS[nextAvailableCategory],
                  category: nextAvailableCategory,
                  amount: undefined as unknown as number,
                  is_compulsory: true,
                  frequency: "recurring",
                  applies_to: "all_students",
                });
                setExpandedFeeIndex(fields.length);
              }}
            >
              <Plus className="mr-1.5 size-4" aria-hidden />
              Add another fee
            </Button>
            {!canAddAnotherFee && (
              <p className="text-xs text-brand-ink/50">
                You have added every fee type we track.
              </p>
            )}

            {form.formState.errors.fees?.root && (
              <p className="text-xs text-destructive">
                {form.formState.errors.fees.root.message}
              </p>
            )}
          </div>
        )}

        {/* Step 3: contact + optional proof */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Quick recap so people trust the send button */}
            <div className="rounded-xl bg-brand-lime-light/70 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-brand-ink/45">
                You are sending
              </p>
              <p className="mt-1.5 text-sm leading-[1.5] text-brand-ink">
                {watchedFees.length}{" "}
                {watchedFees.length === 1 ? "fee" : "fees"} totalling{" "}
                <strong className="font-semibold">
                  {formatCurrency(feeTotal)}
                </strong>{" "}
                for{" "}
                <strong className="font-semibold">
                  {selectedInstitution?.name ?? "the selected school"}
                </strong>
                , {form.watch("academic_session_id") || "session not set"}.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label>Your email</Label>
              <Input
                {...form.register("submitter_email")}
                type="email"
                placeholder="you@example.com"
              />
              {form.formState.errors.submitter_email && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.submitter_email.message}
                </p>
              )}
              <p className="flex items-center gap-1.5 text-xs text-brand-ink/50">
                <ShieldCheck className="size-3.5 shrink-0" aria-hidden />
                Only used if we need to confirm a detail. Never published.
              </p>
            </div>

            <OptionalDisclosure summary="Add proof (optional, speeds up review)">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-brand-ink">Link to the source</Label>
                  <Input
                    {...form.register("source_url")}
                    type="url"
                    placeholder="https://portal.school.edu.ng/fees"
                    className="border-[#d4b48a]/70 bg-white placeholder:text-brand-ink/55"
                  />
                  {form.formState.errors.source_url && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.source_url.message}
                    </p>
                  )}
                  <p className="text-xs leading-[1.45] text-brand-ink/65">
                    A school portal page, fee circular, or official notice.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-brand-ink">Attach a document</Label>
                  <EvidenceUploadField
                    files={evidenceFiles}
                    onChange={setEvidenceFiles}
                    label={null}
                  />
                </div>
              </div>
            </OptionalDisclosure>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#edf0ed] pt-5">
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={goBack}>
              <ArrowLeft className="mr-1.5 size-4" aria-hidden />
              Back
            </Button>
          ) : (
            <span />
          )}

          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={goNext}>
              Continue
              <ArrowRight className="ml-1.5 size-4" aria-hidden />
            </Button>
          ) : (
            <div className="flex flex-col items-end gap-2">
              {form.formState.errors.root && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.root.message}
                </p>
              )}
              <Button type="submit" disabled={sending}>
                {sending ? "Sending…" : "Send for review"}
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

/** Collapsed-by-default wrapper that keeps optional fields out of the way. */
function OptionalDisclosure({
  summary,
  children,
}: {
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group rounded-[14px] border border-[#e2b57a] bg-[#fff1de] px-4 py-3.5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold tracking-[-0.02em] text-brand-ink transition-colors hover:text-brand-ink/85 [&::-webkit-details-marker]:hidden">
        {summary}
        <ChevronDown
          className="size-4 shrink-0 text-brand-ink/60 transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="pb-1 pt-4">{children}</div>
    </details>
  );
}
