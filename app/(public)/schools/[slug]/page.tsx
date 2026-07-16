import type { Metadata } from "next";
import { EmptyState } from "@/components/public/EmptyState";
import { SchoolCourseFees } from "@/components/public/SchoolCourseFees";
import { SchoolProfileHero } from "@/components/public/SchoolProfileHero";
import { SchoolStatsBar } from "@/components/public/SchoolStatsBar";
import { SchoolSubmitCta } from "@/components/public/SchoolSubmitCta";
import { getMockSchoolProfile } from "@/lib/mock/school-profile";
import { createServerClient } from "@/lib/supabase/server";
import type { SchoolProfile } from "@/lib/mock/school-profile";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const school = await getSchoolProfile(slug);

  if (!school) {
    return {
      title: "School not found",
      description: "We do not have this school yet on SchoolCost NG.",
    };
  }

  return {
    title: `${school.name} fees`,
    description: `View verified course fees for ${school.name} (${school.abbreviation}), including first-year totals by level and session.`,
  };
}

async function getSchoolProfile(slug: string): Promise<SchoolProfile | null> {
  const mock = getMockSchoolProfile(slug);
  if (mock) return mock;

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("institutions")
      .select(
        "name, slug, abbreviation, city, state, institution_type, ownership_type, website_url, logo_url"
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) return null;

    const row = data as {
      name: string;
      slug: string;
      abbreviation: string | null;
      city: string | null;
      state: string;
      institution_type: SchoolProfile["institution_type"];
      ownership_type: SchoolProfile["ownership_type"];
      website_url: string | null;
      logo_url: string | null;
    };

    return {
      slug: row.slug,
      name: row.name,
      abbreviation: row.abbreviation ?? row.name.slice(0, 6).toUpperCase(),
      city: row.city ?? row.state,
      state: row.state,
      institution_type: row.institution_type,
      ownership_type: row.ownership_type,
      website_url: row.website_url ?? "#",
      website_label: row.website_url
        ? row.website_url.replace(/^https?:\/\//, "").replace(/\/$/, "")
        : "Website pending",
      logo_url: row.logo_url ?? "/figma/icon-logo.svg",
      source_badge: "official",
      courses_listed: 0,
      first_year_min: 0,
      first_year_max: 0,
      payment_options: [],
      sessions: ["2025/2026"],
      levels: ["100L"],
      courses: [],
      fees: [],
    };
  } catch {
    return null;
  }
}

export default async function SchoolProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const school = await getSchoolProfile(slug);

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

  return (
    <div>
      <SchoolProfileHero school={school} />
      <SchoolStatsBar
        coursesListed={school.courses_listed}
        firstYearMin={school.first_year_min}
        firstYearMax={school.first_year_max}
        paymentOptions={school.payment_options}
      />
      <SchoolCourseFees school={school} />
      <SchoolSubmitCta />
    </div>
  );
}
