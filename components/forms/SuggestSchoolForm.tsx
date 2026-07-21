"use client";

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
import {
  INSTITUTION_TYPE_LABELS,
  NIGERIA_STATES,
  OWNERSHIP_TYPE_LABELS,
} from "@/types/institution";

interface SuggestSchoolFormProps {
  onSubmit: (data: SuggestSchoolInput) => Promise<void>;
}

export function SuggestSchoolForm({ onSubmit }: SuggestSchoolFormProps) {
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
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      form.setError("root", {
        type: "manual",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    }
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Institution Type</Label>
          <Select
            value={form.watch("institution_type")}
            onValueChange={(v) => form.setValue("institution_type", v as SuggestSchoolInput["institution_type"])}
          >
            <SelectTrigger>
              <SelectValue>
                {(value) =>
                  value
                    ? INSTITUTION_TYPE_LABELS[
                        value as SuggestSchoolInput["institution_type"]
                      ]
                    : null
                }
              </SelectValue>
            </SelectTrigger>
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
            <SelectTrigger>
              <SelectValue>
                {(value) =>
                  value
                    ? OWNERSHIP_TYPE_LABELS[
                        value as SuggestSchoolInput["ownership_type"]
                      ]
                    : null
                }
              </SelectValue>
            </SelectTrigger>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      {form.formState.errors.root && (
        <p className="text-sm text-destructive">
          {form.formState.errors.root.message}
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Submitting…" : "Suggest School"}
      </Button>
    </form>
  );
}
