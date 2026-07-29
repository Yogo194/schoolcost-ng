"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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
  formId?: string;
  hideSubmitButton?: boolean;
  onSubmittingChange?: (submitting: boolean) => void;
  onSubmitted?: () => void;
}

export function SubmitCorrectionForm({
  feeRecordId,
  onSubmit,
  formId,
  hideSubmitButton = false,
  onSubmittingChange,
  onSubmitted,
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
  const correctionType = useWatch({
    control: form.control,
    name: "correction_type",
  });

  async function handleSubmit(data: SubmitCorrectionInput) {
    setEvidenceError(undefined);
    onSubmittingChange?.(true);
    try {
      await onSubmit({ ...data, evidenceFiles });
      setSuccess(true);
      onSubmitted?.();
    } finally {
      onSubmittingChange?.(false);
    }
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
    <form id={formId} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label>What looks wrong?</Label>
        <Select
          value={correctionType}
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
        <Label>Tell us what should change</Label>
        <Textarea
          {...form.register("description")}
          placeholder="For example: the amount is for 2025/2026, not 2026/2027."
          rows={3}
        />
        {form.formState.errors.description && (
          <p className="text-xs text-destructive">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      {correctionType === "wrong_amount" && (
        <div className="space-y-1.5">
          <Label>Correct total, if you know it (₦, optional)</Label>
          <Input
            {...form.register("suggested_amount")}
            type="number"
            placeholder="0"
          />
        </div>
      )}

      <div className="space-y-1.5">
        <Label>Link to a circular or portal page (optional)</Label>
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
        error={evidenceError}
        label="Proof, if you have it"
      />
      <p className="text-xs leading-4 text-brand-ink/55">
        Please remove student IDs and payment references from anything you share.
      </p>

      <div className="border-t border-[#edf0ed] pt-5">
        <Label>Your email (optional)</Label>
        <Input
          className="mt-1.5"
          {...form.register("submitter_email")}
          type="email"
          placeholder="Only if you are happy for us to ask a follow-up question"
        />
        {form.formState.errors.submitter_email && (
          <p className="mt-1 text-xs text-destructive">
            {form.formState.errors.submitter_email.message}
          </p>
        )}
      </div>

      {!hideSubmitButton && (
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting…" : "Submit correction"}
        </Button>
      )}
    </form>
  );
}
