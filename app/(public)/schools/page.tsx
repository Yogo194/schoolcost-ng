import type { Metadata } from "next";
import { Suspense } from "react";
import { SchoolsSearchHero } from "@/components/public/SchoolsSearchHero";
import { SchoolsDirectory } from "@/components/public/SchoolsDirectory";
import { SchoolSubmitCta } from "@/components/public/SchoolSubmitCta";
import { createServerClient } from "@/lib/supabase/server";
import {
  MOCK_SCHOOLS_DIRECTORY,
  type SchoolsDirectoryItem,
} from "@/lib/mock/schools-directory";
import type { Institution } from "@/types/institution";

export const metadata: Metadata = {
  title: "Find school fees",
  description:
    "Search Nigerian tertiary institutions and explore verified school fees by course, state, and ownership.",
};

export default async function SchoolsPage() {
  const schools = await getDirectorySchools();

  return (
    <div>
      <SchoolsSearchHero />
      <Suspense fallback={<DirectorySkeleton />}>
        <SchoolsDirectory schools={schools} />
      </Suspense>
      <SchoolSubmitCta />
    </div>
  );
}

async function getDirectorySchools(): Promise<SchoolsDirectoryItem[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("institutions")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error || !data?.length) return MOCK_SCHOOLS_DIRECTORY;

    const institutions = data as Institution[];
    const ids = institutions.map((institution) => institution.id);

    const { data: fees } = await supabase
      .from("fee_records")
      .select("institution_id, first_year_total")
      .in("institution_id", ids)
      .eq("is_published", true);

    const lowestFees = new Map<string, number>();
    for (const fee of (fees ?? []) as Array<{
      institution_id: string;
      first_year_total: number;
    }>) {
      const amount = Number(fee.first_year_total);
      if (!Number.isFinite(amount)) continue;
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
      logo_url: institution.logo_url,
      first_year_from: lowestFees.get(institution.id) ?? null,
    }));
  } catch {
    return MOCK_SCHOOLS_DIRECTORY;
  }
}

function DirectorySkeleton() {
  return (
    <section className="bg-white px-4 py-12 sm:px-10 sm:py-16 lg:px-20">
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="h-80 animate-pulse rounded-2xl bg-[#f4f6f5]" />
        <div className="space-y-4">
          <div className="h-[52px] animate-pulse rounded-[14px] bg-[#f4f6f5]" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl bg-[#f4f6f5]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
