import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { ModerationActions } from "@/components/admin/ModerationActions";
import { EvidenceViewer } from "@/components/admin/EvidenceViewer";
import {
  getSubmissionById,
  moderateSubmission,
} from "@/lib/submissions/admin";
import {
  SUBMISSION_TYPE_LABELS,
  SUBMISSION_STATUS_LABELS,
} from "@/types/submission";
import { formatDate } from "@/lib/utils/format";
import type { SubmissionStatus } from "@/types/database";

export const metadata: Metadata = { title: "Review Submission | Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReviewSubmissionPage({ params }: PageProps) {
  const { id } = await params;

  let loaded: Awaited<ReturnType<typeof getSubmissionById>> = null;
  try {
    loaded = await getSubmissionById(id);
  } catch {
    loaded = null;
  }

  if (!loaded) notFound();

  const { submission: sub, evidence } = loaded;
  const payload = sub.submitted_payload as Record<string, unknown> | null;

  async function handleModeration(status: SubmissionStatus, feedback?: string) {
    "use server";
    await moderateSubmission(id, status, feedback);
    redirect("/admin/submissions");
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <Link
          href="/admin/submissions"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to submissions
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {SUBMISSION_TYPE_LABELS[sub.submission_type]}
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Submitted {formatDate(sub.created_at)}
              {sub.submitter_name && ` by ${sub.submitter_name}`}
            </p>
          </div>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium capitalize text-amber-700">
            {SUBMISSION_STATUS_LABELS[sub.status]}
          </span>
        </div>
      </div>

      <section className="space-y-3 rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900">
          Submission Details
        </h2>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          {sub.institution && (
            <>
              <dt className="text-gray-500">School</dt>
              <dd className="font-medium text-gray-900">
                {sub.institution.name}
              </dd>
            </>
          )}
          {!sub.institution &&
            typeof payload?.school_name === "string" && (
              <>
                <dt className="text-gray-500">Suggested school</dt>
                <dd className="font-medium text-gray-900">
                  {payload.school_name}
                </dd>
              </>
            )}
          {(sub.course || typeof payload?.course_name === "string") && (
            <>
              <dt className="text-gray-500">Course</dt>
              <dd className="text-gray-700">
                {sub.course?.name ?? String(payload?.course_name)}
              </dd>
            </>
          )}
          {(sub.academic_session ||
            typeof payload?.academic_session === "string") && (
            <>
              <dt className="text-gray-500">Session</dt>
              <dd className="text-gray-700">
                {sub.academic_session?.name ??
                  String(payload?.academic_session)}
              </dd>
            </>
          )}
          {sub.submitter_email && (
            <>
              <dt className="text-gray-500">Submitted by</dt>
              <dd className="text-gray-700">{sub.submitter_email}</dd>
            </>
          )}
        </dl>
      </section>

      <section className="space-y-3 rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900">Submitted Data</h2>
        <pre className="overflow-x-auto rounded bg-gray-50 p-3 text-xs text-gray-600">
          {JSON.stringify(sub.submitted_payload, null, 2)}
        </pre>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Evidence</h2>
        <EvidenceViewer evidence={evidence} />
      </section>

      <section className="space-y-4 rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900">Moderation</h2>
        <ModerationActions
          submissionId={id}
          currentStatus={sub.status}
          onAction={handleModeration}
        />
      </section>
    </div>
  );
}
