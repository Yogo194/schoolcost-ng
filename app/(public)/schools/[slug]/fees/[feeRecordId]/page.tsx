import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrackEvent } from "@/components/analytics/TrackEvent";
import { FeeDetailBreakdown } from "@/components/public/FeeDetailBreakdown";
import { FeeDetailHero } from "@/components/public/FeeDetailHero";
import { SchoolSubmitCta } from "@/components/public/SchoolSubmitCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { AnalyticsEvents } from "@/lib/analytics";
import { getCoursePeers } from "@/lib/fees/get-course-peers";
import { getLiveFeeDetail } from "@/lib/fees/get-fee-detail";
import { feeJsonLd, publicPageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string; feeRecordId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, feeRecordId } = await params;
  const record = await getLiveFeeDetail(feeRecordId);

  if (!record) {
    return publicPageMetadata({
      path: `/schools/${slug}/fees/${feeRecordId}`,
      title: "Fee breakdown",
      description: "View detailed school fee breakdown on SchoolCost NG.",
    });
  }

  return publicPageMetadata({
    path: `/schools/${record.schoolSlug}/fees/${record.id}`,
    title: `${record.schoolName} school fees for ${record.course} - ${record.session}`,
    description: `Compulsory fee breakdown for ${record.course} at ${record.schoolName}, ${record.session}. Includes first-year and returning-year estimates, source, and verification status.`,
  });
}

export default async function FeeBreakdownPage({ params }: PageProps) {
  const { slug, feeRecordId } = await params;
  const record = await getLiveFeeDetail(feeRecordId);

  if (!record || record.schoolSlug !== slug) {
    notFound();
  }

  const peerColumns = await getCoursePeers(record.course, record.schoolSlug);

  return (
    <div>
      <TrackEvent
        event={AnalyticsEvents.feeDetailViewed}
        properties={{
          fee_record_id: record.id,
          school_slug: record.schoolSlug,
          school_name: record.schoolName,
          course: record.course,
          session: record.session,
          verification_status: record.verification_status,
          confidence_level: record.confidence_level,
        }}
      />
      <JsonLd
        data={feeJsonLd({
          id: record.id,
          schoolSlug: record.schoolSlug,
          schoolName: record.schoolName,
          course: record.course,
          session: record.session,
          firstYearTotal: record.firstYearTotal,
          level: record.defaultLevel,
        })}
      />
      <FeeDetailHero record={record} />
      <FeeDetailBreakdown record={record} peerColumns={peerColumns} />
      <SchoolSubmitCta />
    </div>
  );
}
