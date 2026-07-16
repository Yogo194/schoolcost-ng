import type { Metadata } from "next";
import { SubmitCorrectionPageClient } from "@/components/forms/SubmitCorrectionPageClient";

export const metadata: Metadata = {
  title: "Report an Error",
  description: "Report incorrect fee information on SchoolCost NG.",
};

interface PageProps {
  searchParams: Promise<{ record?: string }>;
}

export default async function SubmitCorrectionPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const feeRecordId = params.record ?? "";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Report an Error</h1>
        <p className="text-sm leading-relaxed text-gray-500">
          Found incorrect fee information? Let us know and we will review it.
          Corrections are reviewed before being applied.
        </p>
      </div>
      <SubmitCorrectionPageClient feeRecordId={feeRecordId} />
    </div>
  );
}
