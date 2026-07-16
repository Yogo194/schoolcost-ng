"use client";

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
        // TODO: upload evidence to storage + insert correction into submissions
        console.log("Correction submission:", {
          ...data,
          evidenceFiles: data.evidenceFiles.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
          })),
        });
      }}
    />
  );
}
