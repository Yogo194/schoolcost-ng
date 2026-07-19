"use client";

import { useState } from "react";
import { useForm, useFieldArray, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
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
import {
  submitFeeSchema,
  type SubmitFeeInput,
} from "@/lib/validations/submission";
import { FEE_CATEGORY_LABELS } from "@/types/fee";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { Institution } from "@/types/institution";

interface SubmitFeeFormProps {
  institutions: Institution[];
  onSubmit: (data: SubmitFeeInput) => Promise<void>;
}

const STEPS = [
  {
    id: "school",
    label: "The school",
    heading: "Which school is this about?",
    blurb: "Just the school and session. Course and level help, but can wait.",
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
const STEP_FIELDS: FieldPath<SubmitFeeInput>[][] = [
  ["institution_id", "academic_session_id", "student_type"],
  ["fees"],
  ["submitter_email", "source_url"],
];

export function SubmitFeeForm({ institutions, onSubmit }: SubmitFeeFormProps) {
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);

  const form = useForm<SubmitFeeInput>({
    resolver: zodResolver(submitFeeSchema),
    mode: "onTouched",
    defaultValues: {
      institution_id: "",
      academic_session_id: "",
      student_type: "fresh",
      fees: [
        {
          name: "",
          category: "tuition",
          amount: 0,
          is_compulsory: true,
          frequency: "recurring",
          applies_to: "all_students",
        },
      ],
      submitter_name: "",
      submitter_email: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fees",
  });

  async function goNext() {
    const valid = await form.trigger(STEP_FIELDS[step], { shouldFocus: true });
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit(data: SubmitFeeInput) {
    await onSubmit(data);
    setSuccess(true);
    form.reset();
    setStep(0);
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-[#dfe7c2] bg-brand-lime-light/40 p-8 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-brand-lime">
          <Check className="size-6 text-brand-ink" aria-hidden />
        </div>
        <h3 className="text-lg font-semibold tracking-[-0.02em] text-brand-ink">
          Thank you. It is in the review queue.
        </h3>
        <p className="mx-auto mt-1.5 max-w-[400px] text-sm leading-[1.5] text-brand-ink/65">
          A person will check it before anything is published. If we need to
          confirm something, we will email you.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-5"
          onClick={() => setSuccess(false)}
        >
          Submit another fee
        </Button>
      </div>
    );
  }

  const selectedInstitution = institutions.find(
    (inst) => inst.id === form.watch("institution_id")
  );
  const watchedFees = form.watch("fees");
  const feeTotal = watchedFees.reduce(
    (sum, fee) => sum + (Number(fee.amount) || 0),
    0
  );

  return (
    <div>
      {/* Step indicator */}
      <ol className="flex items-center gap-2 sm:gap-3" aria-label="Steps">
        {STEPS.map((s, index) => {
          const isDone = index < step;
          const isActive = index === step;
          return (
            <li key={s.id} className="flex flex-1 items-center gap-2 sm:gap-3">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  isDone && "bg-brand-lime text-brand-ink",
                  isActive && "bg-brand-ink text-white",
                  !isDone && !isActive && "bg-[#eef1ee] text-brand-ink/45"
                )}
              >
                {isDone ? <Check className="size-3.5" aria-hidden /> : index + 1}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-medium tracking-[-0.02em] sm:block",
                  isActive ? "text-brand-ink" : "text-brand-ink/45"
                )}
              >
                {s.label}
              </span>
              {index < STEPS.length - 1 && (
                <span
                  className={cn(
                    "h-px flex-1 rounded-full",
                    isDone ? "bg-brand-lime" : "bg-[#eef1ee]"
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-7">
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
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a school" />
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
                  className="font-medium text-primary underline underline-offset-2"
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
                    <SelectValue />
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

            <OptionalDisclosure summary="Add course and level (optional)">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Course</Label>
                  <Input
                    {...form.register("course_id")}
                    placeholder="e.g. Computer Science"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Level</Label>
                  <Input
                    {...form.register("level")}
                    placeholder="e.g. 100 Level"
                  />
                </div>
              </div>
            </OptionalDisclosure>
          </div>
        )}

        {/* Step 2: the fees */}
        {step === 1 && (
          <div className="space-y-4">
            {fields.map((field, idx) => (
              <div
                key={field.id}
                className="space-y-3 rounded-xl border border-[#e5ebe5] bg-[#fafcfa] p-4"
              >
                <div className="flex items-center gap-3">
                  <Input
                    {...form.register(`fees.${idx}.name`)}
                    placeholder="Fee name, e.g. Tuition"
                    className="flex-1 bg-white"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(idx)}
                    disabled={fields.length === 1}
                    className="shrink-0 text-brand-ink/40 hover:text-destructive"
                    aria-label="Remove this fee"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-brand-ink/55">
                      Amount (₦)
                    </Label>
                    <Input
                      {...form.register(`fees.${idx}.amount`)}
                      type="number"
                      inputMode="numeric"
                      placeholder="0"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-brand-ink/55">
                      Category
                    </Label>
                    <Select
                      value={form.watch(`fees.${idx}.category`)}
                      onValueChange={(v) => {
                        if (v) {
                          form.setValue(`fees.${idx}.category`, v as never);
                        }
                      }}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(FEE_CATEGORY_LABELS).map(([k, v]) => (
                          <SelectItem key={k} value={k}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(form.formState.errors.fees?.[idx]?.name ||
                  form.formState.errors.fees?.[idx]?.amount) && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.fees[idx]?.name?.message ??
                      form.formState.errors.fees[idx]?.amount?.message}
                  </p>
                )}

                <OptionalDisclosure summary="More details (optional)">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-brand-ink/55">
                        How often
                      </Label>
                      <Select
                        value={form.watch(`fees.${idx}.frequency`)}
                        onValueChange={(v) =>
                          form.setValue(
                            `fees.${idx}.frequency`,
                            v as "one_time" | "recurring"
                          )
                        }
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recurring">Every year</SelectItem>
                          <SelectItem value="one_time">One-time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-brand-ink/55">
                        Who pays it
                      </Label>
                      <Select
                        value={form.watch(`fees.${idx}.applies_to`)}
                        onValueChange={(v) =>
                          form.setValue(
                            `fees.${idx}.applies_to`,
                            v as
                              | "fresh_only"
                              | "returning_only"
                              | "all_students"
                          )
                        }
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all_students">
                            All students
                          </SelectItem>
                          <SelectItem value="fresh_only">Fresh only</SelectItem>
                          <SelectItem value="returning_only">
                            Returning only
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <label className="mt-3 flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      {...form.register(`fees.${idx}.is_compulsory`)}
                      className="accent-primary"
                    />
                    <span className="text-xs text-brand-ink/70">
                      This fee is compulsory
                    </span>
                  </label>
                </OptionalDisclosure>
              </div>
            ))}

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
              <Plus className="mr-1.5 size-4" aria-hidden />
              Add another fee
            </Button>

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

            <OptionalDisclosure summary="Add proof or notes (optional, speeds up review)">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Link to the source</Label>
                  <Input
                    {...form.register("source_url")}
                    type="url"
                    placeholder="https://portal.school.edu.ng/fees"
                  />
                  {form.formState.errors.source_url && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.source_url.message}
                    </p>
                  )}
                  <p className="text-xs text-brand-ink/50">
                    A school portal page, fee circular, or official notice.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label>Notes</Label>
                  <Textarea
                    {...form.register("notes")}
                    placeholder="Anything that helps us verify this faster"
                    rows={3}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Your name</Label>
                  <Input
                    {...form.register("submitter_name")}
                    placeholder="So we know who to thank"
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
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? "Sending…"
                : "Send for review"}
            </Button>
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
    <details className="group rounded-xl border border-dashed border-[#d7ded7] px-4 py-3">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium tracking-[-0.02em] text-brand-ink/70 transition-colors hover:text-brand-ink [&::-webkit-details-marker]:hidden">
        {summary}
        <ChevronDown
          className="size-4 shrink-0 text-brand-ink/40 transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="pb-1 pt-4">{children}</div>
    </details>
  );
}
