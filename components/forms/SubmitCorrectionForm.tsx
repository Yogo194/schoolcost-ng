"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
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
import { EvidenceUploadField } from "@/components/forms/EvidenceUploadField";
import {
  submitCorrectionSchema,
  type SubmitCorrectionInput,
} from "@/lib/validations/submission";

export type SubmitCorrectionPayload = SubmitCorrectionInput & {
  evidenceFiles: File[];
};

interface SubmitCorrectionFormProps {
  feeRecordId: string;
  onSubmit: (data: SubmitCorrectionPayload) => Promise<void>;
}

export function SubmitCorrectionForm({
  feeRecordId,
  onSubmit,
}: SubmitCorrectionFormProps) {
  const [success, setSuccess] = useState(false);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [evidenceError, setEvidenceError] = useState<string | undefined>();

  const form = useForm<SubmitCorrectionInput>({
    resolver: zodResolver(submitCorrectionSchema),
    defaultValues: {
      fee_record_id: feeRecordId,
      correction_type: "wrong_amount",
      description: "",
      submitter_name: "",
      submitter_email: "",
    },
  });

  async function handleSubmit(data: SubmitCorrectionInput) {
    if (evidenceFiles.length === 0) {
      setEvidenceError("Please upload at least one supporting file.");
      return;
    }
    setEvidenceError(undefined);
    await onSubmit({ ...data, evidenceFiles });
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <h3 className="mb-1 text-base font-semibold text-gray-900">
          Correction submitted
        </h3>
        <p className="text-sm text-gray-500">
          We will review your correction and update the record if it checks out.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label>Correction Type</Label>
        <Select
          value={form.watch("correction_type")}
          onValueChange={(v) =>
            form.setValue(
              "correction_type",
              v as SubmitCorrectionInput["correction_type"]
            )
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="wrong_amount">Wrong amount</SelectItem>
            <SelectItem value="wrong_session">Wrong academic session</SelectItem>
            <SelectItem value="missing_item">Missing fee item</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Describe the correction</Label>
        <Textarea
          {...form.register("description")}
          placeholder="What is wrong and what the correct information should be…"
          rows={4}
        />
        {form.formState.errors.description && (
          <p className="text-xs text-destructive">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      {form.watch("correction_type") === "wrong_amount" && (
        <div className="space-y-1.5">
          <Label>Suggested Correct Amount (₦, optional)</Label>
          <Input
            {...form.register("suggested_amount")}
            type="number"
            placeholder="0"
          />
        </div>
      )}

      <div className="space-y-1.5">
        <Label>Source URL (optional)</Label>
        <Input
          {...form.register("source_url")}
          placeholder="https://portal.school.edu.ng/fees"
          type="url"
        />
      </div>

      <EvidenceUploadField
        files={evidenceFiles}
        onChange={(files) => {
          setEvidenceFiles(files);
          if (files.length > 0) setEvidenceError(undefined);
        }}
        required
        error={evidenceError}
      />

      <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <p className="text-xs text-amber-800">
          Remove personal information (student ID, payment reference, etc.) from
          any evidence you share.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Your Name</Label>
          <Input {...form.register("submitter_name")} placeholder="Full name" />
          {form.formState.errors.submitter_name && (
            <p className="text-xs text-destructive">
              {form.formState.errors.submitter_name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Your Email</Label>
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
        </div>
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Submitting…" : "Submit Correction"}
      </Button>
    </form>
  );
}
