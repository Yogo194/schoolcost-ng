import type { Metadata } from "next";
import { HomeHero } from "@/components/public/HomeHero";
import { HomeFeatures } from "@/components/public/HomeFeatures";
import { RecentlyVerifiedFees } from "@/components/public/RecentlyVerifiedFees";
import {
  MOCK_RECENT_FEES,
  type RecentFeeRow,
} from "@/lib/mock/recent-fees";
import { createServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "SchoolCost NG: Know the True Cost Before You Accept",
  description:
    "Compare verified school fees by course, level, and session, including the charges most people miss.",
};

/** Prefer live published rows; fall back to mock so homepage structure stays reviewable. */
async function getRecentlyVerifiedFees(): Promise<RecentFeeRow[]> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("fee_records")
      .select(
        `id, level, first_year_total, source_type,
         institutions ( name, abbreviation, city, state, ownership_type, slug ),
         courses ( name ),
         academic_sessions ( name )`
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(24);

    if (error) {
      console.error("Failed to load recently verified fees:", error.message);
      return MOCK_RECENT_FEES;
    }

    const rows = ((data ?? []) as unknown as RecentFeeRow[]).filter(
      (row) => row.institutions && row.courses && row.academic_sessions
    );

    return rows.length > 0 ? rows : MOCK_RECENT_FEES;
  } catch (err) {
    console.error("Failed to load recently verified fees:", err);
    return MOCK_RECENT_FEES;
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
