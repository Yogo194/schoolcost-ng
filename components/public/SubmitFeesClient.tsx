"use client";

import { ContributionWorkspace } from "@/components/public/ContributionWorkspace";
import {
  submitFeeAction,
  suggestSchoolAction,
} from "@/app/actions/submissions";
import type { SubmitFeePayload } from "@/components/forms/SubmitFeeForm";
import { AnalyticsEvents, track } from "@/lib/analytics";
import type { SuggestSchoolInput } from "@/lib/validations/submission";
import type { SubmitCourseOption } from "@/lib/mock/courses";
import type { Institution } from "@/types/institution";

interface SubmitFeesClientProps {
  institutions: Institution[];
  courses: SubmitCourseOption[];
  initialTab?: "fee" | "school";
}

export function SubmitFeesClient({
  institutions,
  courses,
  initialTab = "fee",
}: SubmitFeesClientProps) {
  async function handleSubmitFee(data: SubmitFeePayload) {
    const formData = new FormData();
    const { evidenceFiles, ...payload } = data;
    formData.set("payload", JSON.stringify(payload));
    for (const file of evidenceFiles) {
      formData.append("evidence", file);
    }

    const result = await submitFeeAction(formData);
    if (!result.ok) {
      throw new Error(result.error);
    }
    track(AnalyticsEvents.submitFeesSucceeded, {
      institution_id: payload.institution_id,
      course_id: payload.course_id,
      has_evidence_files: evidenceFiles.length > 0,
      evidence_file_count: evidenceFiles.length,
    });
  }

  async function handleSuggestSchool(data: SuggestSchoolInput) {
    const result = await suggestSchoolAction(data);
    if (!result.ok) {
      throw new Error(result.error);
    }
    track(AnalyticsEvents.submitSchoolSucceeded, {
      school_name: data.school_name,
      state: data.state,
      ownership_type: data.ownership_type,
    });
  }

  return (
    <ContributionWorkspace
      institutions={institutions}
      courses={courses}
      onSubmitFee={handleSubmitFee}
      onSuggestSchool={handleSuggestSchool}
      initialTab={initialTab}
    />
  );
}
