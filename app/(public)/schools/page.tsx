import type { Metadata } from "next";
import { Suspense } from "react";
import { SchoolsSearchHero } from "@/components/public/SchoolsSearchHero";
import { SchoolsDirectory } from "@/components/public/SchoolsDirectory";
import { SchoolSubmitCta } from "@/components/public/SchoolSubmitCta";
import { createServerClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/supabase/fetch-all-rows";
import { canUseForPriceComparison } from "@/lib/fees/trust";
import { resolveSchoolLogoUrl } from "@/lib/schools/logo";
import { publicPageMetadata } from "@/lib/seo";
import type { SchoolsDirectoryItem } from "@/lib/mock/schools-directory";
import type { Institution } from "@/types/institution";
import type { ConfidenceLevel, VerificationStatus } from "@/types/database";

export const metadata: Metadata = publicPageMetadata({
  path: "/schools",
  title: "Find school fees",
  description:
    "Search Nigerian tertiary institutions and explore verified school fees by course, state, and ownership.",
});

export default async function SchoolsPage() {
  const schools = await getDirectorySchools();

  return (
    <div>
      <SchoolsSearchHero />
      <Suspense fallback={<DirectorySkeleton />}>
        <SchoolsDirectory schools={schools} />
      </Suspense>
      <SchoolSubmitCta
        title="Missing a school or fee we should list?"
        description="Suggest a school we have not covered yet, or share fee evidence for one that is already here."
        href="/suggest-school"
        ctaLabel="Suggest a school"
      />
    </div>
  );
}

type DirectoryFeeRow = {
  institution_id: string;
  first_year_total: number;
  level: string | null;
  student_type: string;
  verification_status: VerificationStatus;
  confidence_level: ConfidenceLevel;
};

type DirectoryCourseRow = {
  name: string;
  institution_id: string;
};

async function getDirectorySchools(): Promise<SchoolsDirectoryItem[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("institutions")
      .select(
        "id, name, slug, abbreviation, city, state, institution_type, ownership_type, logo_url"
      )
      .eq("is_active", true)
      .order("name");

    if (error || !data?.length) return [];

    const institutions = data as Institution[];
    const ids = institutions.map((institution) => institution.id);

    const [fees, courseRows] = await Promise.all([
      fetchAllRows<DirectoryFeeRow>((from, to) =>
        supabase
          .from("fee_records")
          .select(
            "institution_id, first_year_total, level, student_type, verification_status, confidence_level"
          )
          .in("institution_id", ids)
          .eq("is_published", true)
          .order("id", { ascending: true })
          .range(from, to)
      ),
      fetchAllRows<DirectoryCourseRow>((from, to) =>
        supabase
          .from("courses")
          .select("name, institution_id")
          .eq("is_active", true)
          .in("institution_id", ids)
          .order("id", { ascending: true })
          .range(from, to)
      ),
    ]);

    const coursesByInstitution = new Map<string, string[]>();
    const publishedFeeInstitutions = new Set(
      fees.map((fee) => fee.institution_id)
    );
    for (const row of courseRows) {
      const list = coursesByInstitution.get(row.institution_id) ?? [];
      list.push(row.name);
      coursesByInstitution.set(row.institution_id, list);
    }

    const lowestFees = new Map<string, number>();
    for (const fee of fees) {
      if (!canUseForPriceComparison(fee.verification_status, fee.confidence_level)) {
        continue;
      }
      // Prefer fresher / 100L / Undergraduate package rows for "from" prices.
      const isFreshBand =
        fee.level === "100L" ||
        fee.level === "Undergraduate" ||
        fee.student_type === "fresh";
      if (!isFreshBand) continue;
      const amount = Number(fee.first_year_total);
      if (!Number.isFinite(amount) || amount <= 0) continue;
      const current = lowestFees.get(fee.institution_id);
      if (current == null || amount < current) {
        lowestFees.set(fee.institution_id, amount);
      }
    }

    return institutions.map((institution) => ({
      id: institution.id,
      name: institution.name,
      slug: institution.slug,
      abbreviation: institution.abbreviation,
      city: institution.city,
      state: institution.state,
      institution_type: institution.institution_type,
      ownership_type: institution.ownership_type,
      logo_url: resolveSchoolLogoUrl(institution.slug, institution.logo_url),
      courses: coursesByInstitution.get(institution.id) ?? [],
      first_year_from: lowestFees.get(institution.id) ?? null,
      has_published_fees: publishedFeeInstitutions.has(institution.id),
    }));
  } catch {
    return [];
  }
}

function DirectorySkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-10 w-full max-w-xl animate-pulse rounded-xl bg-muted" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-2xl bg-muted"
          />
        ))}
      </div>
    </div>
  );
}
