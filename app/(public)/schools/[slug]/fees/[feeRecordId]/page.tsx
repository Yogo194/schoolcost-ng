import type { Metadata } from "next";
import Link from "next/link";
import { FeeDetailBreakdown } from "@/components/public/FeeDetailBreakdown";
import { FeeDetailHero } from "@/components/public/FeeDetailHero";
import { SchoolSubmitCta } from "@/components/public/SchoolSubmitCta";
import { getMockFeeDetail } from "@/lib/mock/fee-detail";

interface PageProps {
  params: Promise<{ slug: string; feeRecordId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { feeRecordId } = await params;
  const record = getMockFeeDetail(feeRecordId);

  if (!record) {
    return {
      title: "Fee breakdown",
      description: "View detailed school fee breakdown on SchoolCost NG.",
    };
  }

  return {
    title: `${record.schoolName} school fees for ${record.course} - ${record.session}`,
    description: `Compulsory fee breakdown for ${record.course} at ${record.schoolName}, ${record.session}. Includes first-year and returning-year estimates, source, and verification status.`,
  };
}

export default async function FeeBreakdownPage({ params }: PageProps) {
  const { slug, feeRecordId } = await params;
  const record = getMockFeeDetail(feeRecordId);

  if (!record || record.schoolSlug !== slug) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm text-brand-ink/70">Fee record not found.</p>
        <Link
          href={`/schools/${slug}`}
          className="mt-2 inline-block text-sm text-primary hover:underline"
        >
          Back to school
        </Link>
      </div>
    );
  }

  return (
    <div>
      <FeeDetailHero record={record} />
      <FeeDetailBreakdown record={record} />
      <SchoolSubmitCta />
    </div>
  );
}
