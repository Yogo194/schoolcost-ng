import type { Metadata } from "next";
import { SubmitFeesClient } from "@/components/public/SubmitFeesClient";
import { SubmitFeeTestimonialPanel } from "@/components/public/SubmitFeeTestimonialPanel";
import { createServerClient } from "@/lib/supabase/server";
import {
  getMockCoursesForSubmit,
  type SubmitCourseOption,
} from "@/lib/mock/courses";
import { MOCK_SCHOOLS_DIRECTORY } from "@/lib/mock/schools-directory";
import type { Institution } from "@/types/institution";

export const metadata: Metadata = {
  title: "Contribute Information",
  description:
    "Share school fees or suggest a Nigerian tertiary institution. Every submission is reviewed by a person before it is published.",
};

export default async function SubmitFeesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const initialTab = tab === "school" ? "school" : "fee";
  const [institutions, courses] = await Promise.all([
    getInstitutionsForSubmit(),
    getCoursesForSubmit(),
  ]);

  return (
    <div className="grid min-h-[calc(100svh-4rem)] lg:grid-cols-2">
      <div className="flex justify-center bg-white px-4 sm:px-8">
        <div className="flex h-full min-h-[calc(100svh-4rem)] w-full max-w-[520px] flex-col py-10 sm:py-14">
          <SubmitFeesClient
            institutions={institutions}
            courses={courses}
            initialTab={initialTab}
          />
        </div>
      </div>

      <SubmitFeeTestimonialPanel />
    </div>
  );
}

async function getInstitutionsForSubmit(): Promise<Institution[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("institutions")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (!error && data?.length) return data as Institution[];
  } catch {
    // Fall through to mock data when Supabase is unavailable or empty.
  }

  return MOCK_SCHOOLS_DIRECTORY.map((school) => ({
    id: school.id,
    name: school.name,
    slug: school.slug,
    abbreviation: school.abbreviation,
    logo_url: school.logo_url,
    institution_type: school.institution_type,
    ownership_type: school.ownership_type,
    state: school.state,
    city: school.city,
    website_url: null,
    description: null,
    is_active: true,
    created_at: "",
    updated_at: "",
  }));
}

async function getCoursesForSubmit(): Promise<SubmitCourseOption[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("courses")
      .select("id, institution_id, name")
      .eq("is_active", true)
      .order("name");

    if (!error && data?.length) return data as SubmitCourseOption[];
  } catch {
    // Fall through to mock data when Supabase is unavailable or empty.
  }

  return getMockCoursesForSubmit();
}
