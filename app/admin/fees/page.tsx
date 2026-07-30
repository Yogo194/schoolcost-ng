import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AdminTable } from "@/components/admin/AdminTable";
import { VerificationBadge, SourceBadge } from "@/components/public/SourceBadge";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { listAdminFeeRecords } from "@/lib/admin/fee-records";

export const metadata: Metadata = { title: "Fee Records | Admin" };

export default async function AdminFeesPage() {
  const records = await listAdminFeeRecords();

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Fee Records</h1>
          <p className="text-sm text-gray-500 mt-0.5">{records.length} total</p>
        </div>
        <Link href="/admin/fees/new" className={cn(buttonVariants({ size: "sm" }), "inline-flex items-center")}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Fee Record
        </Link>
      </div>

      <AdminTable
        rows={records}
        emptyMessage="No fee records yet. Add one to get started."
        columns={[
          {
            key: "institution",
            label: "Institution",
            render: (row) => (
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {row.institution?.name ?? "-"}
                </p>
                <p className="text-xs text-gray-400">
                  {row.course?.name ?? "All courses"} · {row.student_type} · {row.level ?? "all levels"}
                </p>
              </div>
            ),
          },
          {
            key: "status",
            label: "Verification",
            render: (row) => <VerificationBadge status={row.verification_status} />,
          },
          {
            key: "source",
            label: "Source",
            render: (row) => <SourceBadge sourceType={row.source_type} />,
          },
          {
            key: "first_year",
            label: "First Year",
            render: (row) => (
              <span className="font-medium tabular-nums">
                {formatCurrency(row.first_year_total, row.currency)}
              </span>
            ),
          },
          {
            key: "published",
            label: "Published",
            render: (row) => (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded border ${
                  row.is_published
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-gray-100 text-gray-500 border-gray-200"
                }`}
              >
                {row.is_published ? "Published" : "Draft"}
              </span>
            ),
          },
          {
            key: "reviewed",
            label: "Last Reviewed",
            render: (row) => (
              <span className="text-xs text-gray-400">
                {row.last_reviewed_at ? formatDate(row.last_reviewed_at) : "-"}
              </span>
            ),
          },
          {
            key: "actions",
            label: "",
            render: (row) => (
              <Link
                href={`/admin/fees/${row.id}`}
                className="text-xs text-primary hover:underline"
              >
                Edit →
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}
