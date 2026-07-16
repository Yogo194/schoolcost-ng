"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, AlertCircle } from "lucide-react";
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
import { submitFeeSchema, type SubmitFeeInput } from "@/lib/validations/submission";
import { FEE_CATEGORY_LABELS } from "@/types/fee";
import type { Institution, Course, AcademicSession } from "@/types/institution";

interface SubmitFeeFormProps {
  institutions: Institution[];
  onSubmit: (data: SubmitFeeInput) => Promise<void>;
}

export function SubmitFeeForm({ institutions, onSubmit }: SubmitFeeFormProps) {
  const [success, setSuccess] = useState(false);

  const form = useForm<SubmitFeeInput>({
    resolver: zodResolver(submitFeeSchema),
    defaultValues: {
      institution_id: "",
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

  async function handleSubmit(data: SubmitFeeInput) {
    await onSubmit(data);
    setSuccess(true);
    form.reset();
  }

  if (success) {
    return (
      <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          Fee update submitted for review
        </h3>
        <p className="text-sm text-gray-500">
          We will check the evidence before publishing it. Thank you for contributing.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setSuccess(false)}
        >
          Submit another update
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
      {/* School selection */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">School Details</h3>

        <div className="space-y-1.5">
          <Label>School</Label>
          <Select
            value={form.watch("institution_id")}
            onValueChange={(v) => { if (v) form.setValue("institution_id", v); }}
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
            <p className="text-xs text-destructive">{form.formState.errors.institution_id.message}</p>
          )}
          <p className="text-xs text-gray-400">
            School not listed?{" "}
            <a href="/suggest-school" className="text-primary underline underline-offset-2">
              Suggest it here.
            </a>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Academic Session</Label>
            <Input
              {...form.register("academic_session_id")}
              placeholder="e.g. 2024/2025"
            />
            {form.formState.errors.academic_session_id && (
              <p className="text-xs text-destructive">{form.formState.errors.academic_session_id.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Student Type</Label>
            <Select
              value={form.watch("student_type")}
              onValueChange={(v) => form.setValue("student_type", v as "fresh" | "returning")}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fresh">Fresh student</SelectItem>
                <SelectItem value="returning">Returning student</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Course (optional)</Label>
            <Input {...form.register("course_id")} placeholder="e.g. Computer Science" />
          </div>
          <div className="space-y-1.5">
            <Label>Level (optional)</Label>
            <Input {...form.register("level")} placeholder="e.g. 100 Level" />
          </div>
        </div>
      </section>

      <Separator />

      {/* Fee items */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
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
            Add Fee
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map((field, idx) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    {...form.register(`fees.${idx}.name`)}
                    placeholder="Fee name (e.g. Tuition Fee)"
                    className="text-sm"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(idx)}
                  disabled={fields.length === 1}
                  className="text-gray-400 hover:text-destructive shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Category</Label>
                  <Select
                    value={form.watch(`fees.${idx}.category`)}
                    onValueChange={(v) => { if (v) form.setValue(`fees.${idx}.category`, v as never); }}
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
                    {...form.register(`fees.${idx}.amount`)}
                    type="number"
                    className="h-8 text-xs"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Frequency</Label>
                  <Select
                    value={form.watch(`fees.${idx}.frequency`)}
                    onValueChange={(v) => form.setValue(`fees.${idx}.frequency`, v as "one_time" | "recurring")}
                  >
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recurring">Yearly</SelectItem>
                      <SelectItem value="one_time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Applies To</Label>
                  <Select
                    value={form.watch(`fees.${idx}.applies_to`)}
                    onValueChange={(v) => form.setValue(`fees.${idx}.applies_to`, v as "fresh_only" | "returning_only" | "all_students")}
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

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...form.register(`fees.${idx}.is_compulsory`)}
                  className="accent-primary"
                />
                <span className="text-xs text-gray-600">Compulsory fee</span>
              </label>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Evidence */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Evidence (optional but recommended)</h3>

        <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            Please remove your name, student ID, payment reference, phone number,
            email, and other personal information before uploading evidence.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label>Source URL (optional)</Label>
          <Input
            {...form.register("source_url")}
            placeholder="https://portal.school.edu.ng/fees"
            type="url"
          />
          <p className="text-xs text-gray-400">Link to the official school page or source.</p>
        </div>
      </section>

      <Separator />

      {/* Submitter */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Your Contact</h3>
        <p className="text-xs text-gray-500">
          We may contact you if we need to verify details. Your information will not be published.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Your Name</Label>
            <Input {...form.register("submitter_name")} placeholder="Full name" />
            {form.formState.errors.submitter_name && (
              <p className="text-xs text-destructive">{form.formState.errors.submitter_name.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Your Email</Label>
            <Input {...form.register("submitter_email")} type="email" placeholder="you@example.com" />
            {form.formState.errors.submitter_email && (
              <p className="text-xs text-destructive">{form.formState.errors.submitter_email.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Additional Notes (optional)</Label>
          <Textarea
            {...form.register("notes")}
            placeholder="Anything else that might help us verify this information…"
            rows={3}
          />
        </div>
      </section>

      <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
        {form.formState.isSubmitting ? "Submitting…" : "Submit Fee Update"}
      </Button>
    </form>
  );
}
