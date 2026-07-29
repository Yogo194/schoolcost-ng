import type { Metadata } from "next";
import { EmptyState } from "@/components/public/EmptyState";
import { SchoolCourseFees } from "@/components/public/SchoolCourseFees";
import { SchoolProfileHero } from "@/components/public/SchoolProfileHero";
import { SchoolStatsBar } from "@/components/public/SchoolStatsBar";
import { SchoolSubmitCta } from "@/components/public/SchoolSubmitCta";
import { getLiveSchoolProfile } from "@/lib/fees/get-school-profile";
import type { SchoolProfile } from "@/lib/mock/school-profile";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function isFresherLevel(level: string): boolean {
  return (
    level === "100L" ||
    level === "Undergraduate" ||
    level.startsWith("100")
  );
}

/** Prefer the session behind the fee-range rows; else the latest listed session. */
function pickPrimarySession(school: SchoolProfile): string | undefined {
  if (school.fees.length === 0) return undefined;

  const fresherSessions = school.fees
    .filter((fee) => isFresherLevel(fee.level))
    .map((fee) => fee.session);
  const pool =
    fresherSessions.length > 0
      ? fresherSessions
      : school.sessions.length > 0
        ? school.sessions
        : school.fees.map((fee) => fee.session);

  return [...new Set(pool)].sort().at(-1);
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const school = await getLiveSchoolProfile(slug);

  if (!school) {
    return {
      title: "School not found",
      description: "We do not have this school yet on SchoolCost NG.",
    };
  }

  const isBands = school.fee_coverage.kind === "bands";

  return {
    title: `${school.name} fees`,
    description: isBands
      ? `Official fee bands for ${school.name} (${school.abbreviation}), with session year and source notes. Course-level totals welcome via contribute.`
      : `View verified course fees for ${school.name} (${school.abbreviation}), including first-year totals by level and session.`,
  };
}

export default async function SchoolProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const school = await getLiveSchoolProfile(slug);

  if (!school) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <EmptyState
          title="We do not have this school yet."
          description="You can suggest it and we will add it when we have enough verified fee data."
          action={{
            label: "Suggest this school",
            href: `/suggest-school?name=${encodeURIComponent(slug.replace(/-/g, " "))}`,
          }}
          secondaryAction={{ label: "Browse all schools", href: "/schools" }}
        />
      </div>
    );
  }

  const hasFees = school.fees.length > 0;
  const isBands = school.fee_coverage.kind === "bands";
  const hasOnlyCommunityReports =
    hasFees && school.fees.every((fee) => fee.source_type === "community_reported");
  const sessionLabel = pickPrimarySession(school);

  return (
    <div>
      <SchoolProfileHero school={school} />
      <SchoolStatsBar
        coursesListed={school.courses_listed}
        firstYearMin={school.first_year_min}
        firstYearMax={school.first_year_max}
        coverageLabel={
          hasFees
            ? school.fee_coverage.coverageLabel
            : "Verified fee schedules"
        }
        rangeEyebrow={
          hasFees ? school.fee_coverage.rangeEyebrow : "Fee range"
        }
        rangeDescription={
          hasFees
            ? school.fee_coverage.rangeDescription
            : "Compulsory fee range across courses"
        }
        showRangeExtremes={!hasOnlyCommunityReports}
        sessionLabel={sessionLabel}
        sessionDescription={
          hasOnlyCommunityReports
            ? "Latest reported session"
            : "Latest verified session"
        }
      />
      <SchoolCourseFees school={school} />
      <SchoolSubmitCta
        title={
          !hasFees
            ? `Help us list ${school.abbreviation} fees`
            : isBands
              ? `Have a ${school.abbreviation} course pay advice?`
              : undefined
        }
        description={
          !hasFees
            ? "Share an official circular, bursary PDF, or portal pay advice and we will verify before publishing."
            : isBands
              ? "Share a portal payment advice or Remita receipt and we can add course-level fees with evidence."
              : undefined
        }
        ctaLabel={!hasFees ? "Contribute a fee schedule" : undefined}
      />
    </div>
  );
}
