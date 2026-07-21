import type { Metadata } from "next";
import { SubmitFeesClient } from "@/components/public/SubmitFeesClient";
import { SubmitFeeTestimonialPanel } from "@/components/public/SubmitFeeTestimonialPanel";
import { createServerClient } from "@/lib/supabase/server";
import type { SubmitCourseOption } from "@/lib/mock/courses";
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

/** Live institutions only. Never fall back to mock-* IDs (they fail submit FKs). */
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
    // Empty list below.
  }

  return [];
}

/** Live courses only, matched to live institutions. */
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
    // Empty list below.
  }

  return [];
}
