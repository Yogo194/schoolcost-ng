"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { NIGERIA_STATES } from "@/types/institution";
import type { Institution } from "@/types/institution";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  abbreviation: z.string().optional(),
  institution_type: z.enum(["university", "polytechnic", "college_of_education", "health_institution"]),
  ownership_type: z.enum(["federal", "state", "private"]),
  state: z.string().min(1, "State is required"),
  city: z.string().optional(),
  website_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface InstitutionEditorProps {
  institution?: Partial<Institution>;
  onSubmit: (values: FormValues) => Promise<void>;
  isLoading?: boolean;
}

export function InstitutionEditor({
  institution,
  onSubmit,
  isLoading,
}: InstitutionEditorProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: institution?.name ?? "",
      slug: institution?.slug ?? "",
      abbreviation: institution?.abbreviation ?? "",
      institution_type: institution?.institution_type ?? "university",
      ownership_type: institution?.ownership_type ?? "federal",
      state: institution?.state ?? "",
      city: institution?.city ?? "",
      website_url: institution?.website_url ?? "",
      description: institution?.description ?? "",
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5 max-w-xl"
    >
      <Field label="Institution Name" error={form.formState.errors.name?.message}>
        <Input {...form.register("name")} placeholder="University of Lagos" />
      </Field>

      <Field label="Slug" error={form.formState.errors.slug?.message} hint="Used in URLs. Lowercase, hyphens only.">
        <Input {...form.register("slug")} placeholder="university-of-lagos" />
      </Field>

      <Field label="Abbreviation" error={form.formState.errors.abbreviation?.message}>
        <Input {...form.register("abbreviation")} placeholder="UNILAG" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Institution Type" error={form.formState.errors.institution_type?.message}>
          <Select
            value={form.watch("institution_type")}
            onValueChange={(v) => form.setValue("institution_type", v as FormValues["institution_type"])}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="university">University</SelectItem>
              <SelectItem value="polytechnic">Polytechnic</SelectItem>
              <SelectItem value="college_of_education">College of Education</SelectItem>
              <SelectItem value="health_institution">Health Institution</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="Ownership" error={form.formState.errors.ownership_type?.message}>
          <Select
            value={form.watch("ownership_type")}
            onValueChange={(v) => form.setValue("ownership_type", v as FormValues["ownership_type"])}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="federal">Federal</SelectItem>
              <SelectItem value="state">State</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="State" error={form.formState.errors.state?.message}>
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
        </Field>

        <Field label="City" error={form.formState.errors.city?.message}>
          <Input {...form.register("city")} placeholder="Lagos" />
        </Field>
      </div>

      <Field label="Official Website" error={form.formState.errors.website_url?.message}>
        <Input {...form.register("website_url")} placeholder="https://www.unilag.edu.ng" type="url" />
      </Field>

      <Field label="Description" error={form.formState.errors.description?.message}>
        <Textarea
          {...form.register("description")}
          placeholder="Brief description of the institution"
          rows={3}
        />
      </Field>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving…" : institution?.id ? "Save Changes" : "Create Institution"}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
