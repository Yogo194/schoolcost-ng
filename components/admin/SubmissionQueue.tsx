import Link from "next/link";
import { formatRelativeDate } from "@/lib/utils/format";
import type { SubmissionWithDetails } from "@/types/submission";
import { SUBMISSION_TYPE_LABELS, SUBMISSION_STATUS_LABELS } from "@/types/submission";
import { cn } from "@/lib/utils";

const STATUS_CLASS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  approved_with_edits: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  needs_more_evidence: "bg-blue-50 text-blue-700 border-blue-200",
  duplicate: "bg-gray-100 text-gray-500 border-gray-200",
  disputed: "bg-red-50 text-red-700 border-red-200",
};

interface SubmissionQueueProps {
  submissions: SubmissionWithDetails[];
}

function schoolLabel(sub: SubmissionWithDetails): string {
  if (sub.institution?.name) return sub.institution.name;
  const payload = sub.submitted_payload as { school_name?: unknown } | null;
  if (typeof payload?.school_name === "string" && payload.school_name.trim()) {
    return payload.school_name;
  }
  return "-";
}

export function SubmissionQueue({ submissions }: SubmissionQueueProps) {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-gray-500">
        No submissions found.
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
              School
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
              Type
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
              Status
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
              Submitted
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => (
            <tr
              key={sub.id}
              className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-gray-900">
                {schoolLabel(sub)}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {SUBMISSION_TYPE_LABELS[sub.submission_type]}
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
                    STATUS_CLASS[sub.status]
                  )}
                >
                  {SUBMISSION_STATUS_LABELS[sub.status]}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs">
                {formatRelativeDate(sub.created_at)}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/submissions/${sub.id}`}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Review →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
