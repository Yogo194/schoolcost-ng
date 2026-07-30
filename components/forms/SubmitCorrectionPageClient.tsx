"use client";

import { submitCorrectionAction } from "@/app/actions/submissions";
import { SubmitCorrectionForm } from "@/components/forms/SubmitCorrectionForm";

export function SubmitCorrectionPageClient({
  feeRecordId,
}: {
  feeRecordId: string;
}) {
  return (
    <SubmitCorrectionForm
      feeRecordId={feeRecordId}
      onSubmit={async (data) => {
        const formData = new FormData();
        const { evidenceFiles, ...payload } = data;
        formData.set("payload", JSON.stringify(payload));
        for (const file of evidenceFiles) {
          formData.append("evidence", file);
        }

        const result = await submitCorrectionAction(formData);
        if (!result.ok) {
          throw new Error(result.error);
        }
      }}
    />
  );
}
