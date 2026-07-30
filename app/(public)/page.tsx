import type { Metadata } from "next";
import { HomeHero } from "@/components/public/HomeHero";
import { HomeFeatures } from "@/components/public/HomeFeatures";
import { RecentlyVerifiedFees } from "@/components/public/RecentlyVerifiedFees";
import {
  RECENT_FEES_MAX_PER_SCHOOL,
  type RecentFeeRow,
} from "@/lib/mock/recent-fees";
import {
  PRICE_COMPARABLE_STATUSES,
  PRICE_EXCLUDED_CONFIDENCE,
  canUseForPriceComparison,
} from "@/lib/fees/trust";
import { publicPageMetadata } from "@/lib/seo";
import { createServerClient } from "@/lib/supabase/server";
import type {
  ConfidenceLevel,
  OwnershipType,
  VerificationStatus,
} from "@/types/database";

export const metadata: Metadata = publicPageMetadata({
  path: "/",
  absoluteTitle: true,
  title: "SchoolCost NG: Know the True Cost Before You Accept",
  description:
    "Compare verified school fees by course, level, and session, including the charges most people miss.",
});

type RecentFeeQueryRow = RecentFeeRow & {
  verification_status: VerificationStatus;
  confidence_level: ConfidenceLevel;
  created_at?: string;
  institution_id?: string;
};

/** Max schools considered per ownership on the homepage teaser. */
const SCHOOLS_PER_OWNERSHIP = 12;
/** Candidate rows pulled per school before choosing one representative course. */
const ROWS_PER_SCHOOL_SCAN = 40;

const COURSE_INTEREST_TERMS = [
  "medicine",
  "medical",
  "nursing",
  "pharmacy",
  "law",
  "cyber",
  "software",
  "computer",
  "engineering",
  "architecture",
  "accounting",
  "mass communication",
] as const;

function mapVerifiedRows(rows: RecentFeeQueryRow[]): RecentFeeRow[] {
  return rows.map((row) => {
    const {
      verification_status: _verificationStatus,
      confidence_level: _confidenceLevel,
      created_at: _createdAt,
      institution_id: _institutionId,
      ...rest
    } = row;
    void _verificationStatus;
    void _confidenceLevel;
    void _createdAt;
    void _institutionId;
    return rest;
  });
}

function courseInterestScore(name: string): number {
  const normalized = name.toLowerCase();
  const index = COURSE_INTEREST_TERMS.findIndex((term) =>
    normalized.includes(term)
  );
  return index === -1 ? 0 : COURSE_INTEREST_TERMS.length - index;
}

function pickRowsForSchool(rows: RecentFeeQueryRow[]): RecentFeeQueryRow[] {
  const verified = rows.filter((row) =>
    canUseForPriceComparison(row.verification_status, row.confidence_level)
  );
  if (verified.length === 0) return [];

  const ranked = [...verified].sort((a, b) => {
    const interest =
      courseInterestScore(b.courses.name) -
      courseInterestScore(a.courses.name);
    if (interest !== 0) return interest;

    // For the same course, prefer the entry-level/fresher row.
    const aFresh = a.level === "100L" || a.level === "Undergraduate" ? 1 : 0;
    const bFresh = b.level === "100L" || b.level === "Undergraduate" ? 1 : 0;
    if (aFresh !== bFresh) return bFresh - aFresh;

    const aTime = a.created_at ? Date.parse(a.created_at) : 0;
    const bTime = b.created_at ? Date.parse(b.created_at) : 0;
    return bTime - aTime;
  });

  return ranked.slice(0, RECENT_FEES_MAX_PER_SCHOOL);
}

/**
 * Build the homepage candidate pool by school, not by raw newest fees.
 * That way a bulk seed (Redeemer's / UI) cannot empty Federal or State.
 *
 * The trust rule is applied in the queries as well as in memory. Ranking by
 * recency alone would let a large seed of reported rows claim every school slot
 * and then lose them all to the in-memory filter, emptying a whole tab.
 */
async function getRecentlyVerifiedFees(): Promise<RecentFeeRow[]> {
  try {
    const supabase = await createServerClient();
    const ownerships: OwnershipType[] = ["federal", "state", "private"];

    const ownershipPools = await Promise.all(
      ownerships.map(async (ownership) => {
        const { data: schoolRows, error: schoolError } = await supabase
          .from("fee_records")
          .select(
            `institution_id, created_at,
             institutions!inner ( id, slug, ownership_type )`
          )
          .eq("is_published", true)
          .eq("institutions.ownership_type", ownership)
          .in("verification_status", PRICE_COMPARABLE_STATUSES)
          .neq("confidence_level", PRICE_EXCLUDED_CONFIDENCE)
          .order("created_at", { ascending: false })
          .limit(800);

        if (schoolError) {
          console.error(
            `Failed to list ${ownership} schools for recent fees:`,
            schoolError.message
          );
          return [] as RecentFeeQueryRow[];
        }

        const schoolIds: string[] = [];
        const seen = new Set<string>();
        for (const row of (schoolRows ?? []) as Array<{
          institution_id: string;
        }>) {
          if (seen.has(row.institution_id)) continue;
          seen.add(row.institution_id);
          schoolIds.push(row.institution_id);
          if (schoolIds.length >= SCHOOLS_PER_OWNERSHIP) break;
        }

        if (schoolIds.length === 0) return [] as RecentFeeQueryRow[];

        const perSchool = await Promise.all(
          schoolIds.map(async (institutionId) => {
            const { data, error } = await supabase
              .from("fee_records")
              .select(
                `id, institution_id, level, first_year_total, source_type,
                 verification_status, confidence_level, created_at,
                 institutions ( name, abbreviation, city, state, ownership_type, slug ),
                 courses ( name ),
                 academic_sessions ( name )`
              )
              .eq("institution_id", institutionId)
              .eq("is_published", true)
              .in("verification_status", PRICE_COMPARABLE_STATUSES)
              .neq("confidence_level", PRICE_EXCLUDED_CONFIDENCE)
              .order("created_at", { ascending: false })
              .limit(ROWS_PER_SCHOOL_SCAN);

            if (error) {
              console.error(
                `Failed to load fees for institution ${institutionId}:`,
                error.message
              );
              return [] as RecentFeeQueryRow[];
            }

            return pickRowsForSchool(
              ((data ?? []) as unknown as RecentFeeQueryRow[]).filter(
                (row) => row.institutions && row.courses && row.academic_sessions
              )
            );
          })
        );

        return perSchool.flat();
      })
    );

    const merged = ownershipPools.flat().sort((a, b) => {
      const aTime = a.created_at ? Date.parse(a.created_at) : 0;
      const bTime = b.created_at ? Date.parse(b.created_at) : 0;
      return bTime - aTime;
    });

    return mapVerifiedRows(merged);
  } catch (err) {
    console.error("Failed to load recently verified fees:", err);
    return [];
  }
}

export default async function HomePage() {
  const recentFees = await getRecentlyVerifiedFees();

  return (
    <div>
      <HomeHero />

      <RecentlyVerifiedFees fees={recentFees} />

      <HomeFeatures />
    </div>
  );
}
