"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { suggestSchoolSchema, type SuggestSchoolInput } from "@/lib/validations/submission";
import { NIGERIA_STATES } from "@/types/institution";

interface SuggestSchoolFormProps {
  onSubmit: (data: SuggestSchoolInput) => Promise<void>;
}

export function SuggestSchoolForm({ onSubmit }: SuggestSchoolFormProps) {
  const [success, setSuccess] = useState(false);

  const form = useForm<SuggestSchoolInput>({
    resolver: zodResolver(suggestSchoolSchema),
    defaultValues: {
      school_name: "",
      institution_type: "university",
      ownership_type: "federal",
      state: "",
      website_url: "",
      notes: "",
      submitter_name: "",
      submitter_email: "",
    },
  });

  async function handleSubmit(data: SuggestSchoolInput) {
    await onSubmit(data);
    setSuccess(true);
    form.reset();
  }

  if (success) {
    return (
      <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-8 text-center">
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          School suggestion submitted
        </h3>
        <p className="text-sm text-gray-500">
          We will add this school if we can verify enough fee data for it.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setSuccess(false)}
        >
          Suggest another school
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label>School Name</Label>
        <Input
          {...form.register("school_name")}
          placeholder="e.g. Covenant University"
        />
        {form.formState.errors.school_name && (
          <p className="text-xs text-destructive">{form.formState.errors.school_name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Institution Type</Label>
          <Select
            value={form.watch("institution_type")}
            onValueChange={(v) => form.setValue("institution_type", v as SuggestSchoolInput["institution_type"])}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="university">University</SelectItem>
              <SelectItem value="polytechnic">Polytechnic</SelectItem>
              <SelectItem value="college_of_education">College of Education</SelectItem>
              <SelectItem value="health_institution">Health Institution</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Ownership</Label>
          <Select
            value={form.watch("ownership_type")}
            onValueChange={(v) => form.setValue("ownership_type", v as SuggestSchoolInput["ownership_type"])}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="federal">Federal</SelectItem>
              <SelectItem value="state">State</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>State</Label>
        <Select
          value={form.watch("state")}
          onValueChange={(v) => { if (v) form.setValue("state", v); }}
        >
          <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
          <SelectContent>
            {NIGERIA_STATES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.state && (
          <p className="text-xs text-destructive">{form.formState.errors.state.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Official Website (optional)</Label>
        <Input
          {...form.register("website_url")}
          placeholder="https://www.school.edu.ng"
          type="url"
        />
        {form.formState.errors.website_url && (
          <p className="text-xs text-destructive">{form.formState.errors.website_url.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Additional Notes (optional)</Label>
        <Textarea
          {...form.register("notes")}
          placeholder="Any additional information that might help us find and verify this school…"
          rows={3}
        />
      </div>

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

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Submitting…" : "Suggest School"}
      </Button>
    </form>
  );
}
