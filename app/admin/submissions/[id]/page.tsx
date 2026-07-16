import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ModerationActions } from "@/components/admin/ModerationActions";
import { EvidenceViewer } from "@/components/admin/EvidenceViewer";
import { SUBMISSION_TYPE_LABELS, SUBMISSION_STATUS_LABELS } from "@/types/submission";
import { formatDate } from "@/lib/utils/format";
import type { SubmissionStatus } from "@/types/database";

export const metadata: Metadata = { title: "Review Submission | Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReviewSubmissionPage({ params }: PageProps) {
  const { id } = await params;

  // TODO: fetch submission + evidence from Supabase (service role)
  const submission = null;
  const evidence: never[] = [];

  if (!submission) notFound();

  async function handleModeration(status: SubmissionStatus, feedback?: string) {
    "use server";
    // TODO: update submission status + admin_feedback in Supabase
    console.log("Moderate submission", id, { status, feedback });
  }

  const sub = submission as never as {
    id: string;
    submission_type: keyof typeof SUBMISSION_TYPE_LABELS;
    status: SubmissionStatus;
    submitter_name?: string;
    submitter_email?: string;
    submitted_payload: unknown;
    created_at: string;
    institution?: { name: string };
    course?: { name: string };
    academic_session?: { name: string };
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <Link
          href="/admin/submissions"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to submissions
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {SUBMISSION_TYPE_LABELS[sub.submission_type]}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Submitted {formatDate(sub.created_at)}
              {sub.submitter_name && ` by ${sub.submitter_name}`}
            </p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-200 capitalize">
            {SUBMISSION_STATUS_LABELS[sub.status]}
          </span>
        </div>
      </div>

      {/* School details */}
      <section className="border border-gray-200 rounded-lg p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Submission Details</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          {sub.institution && (
            <>
              <dt className="text-gray-500">School</dt>
              <dd className="font-medium text-gray-900">{sub.institution.name}</dd>
            </>
          )}
          {sub.course && (
            <>
              <dt className="text-gray-500">Course</dt>
              <dd className="text-gray-700">{sub.course.name}</dd>
            </>
          )}
          {sub.academic_session && (
            <>
              <dt className="text-gray-500">Session</dt>
              <dd className="text-gray-700">{sub.academic_session.name}</dd>
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

      {/* Payload */}
      <section className="border border-gray-200 rounded-lg p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Submitted Data</h2>
        <pre className="text-xs text-gray-600 bg-gray-50 rounded p-3 overflow-x-auto">
          {JSON.stringify(sub.submitted_payload, null, 2)}
        </pre>
      </section>

      {/* Evidence */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Evidence</h2>
        <EvidenceViewer evidence={evidence} />
      </section>

      {/* Moderation */}
      <section className="border border-gray-200 rounded-lg p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Moderation</h2>
        <ModerationActions
          submissionId={id}
          currentStatus={sub.status}
          onAction={handleModeration as never}
        />
      </section>
    </div>
  );
}
