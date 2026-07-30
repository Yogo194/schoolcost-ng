import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AdminTable } from "@/components/admin/AdminTable";
import { INSTITUTION_TYPE_LABELS, OWNERSHIP_TYPE_LABELS } from "@/types/institution";
import { listAdminInstitutions } from "@/lib/admin/institutions";

export const metadata: Metadata = { title: "Institutions | Admin" };

export default async function AdminInstitutionsPage() {
  const institutions = await listAdminInstitutions();

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Institutions</h1>
          <p className="text-sm text-gray-500 mt-0.5">{institutions.length} total</p>
        </div>
        <Link href="/admin/institutions/new" className={cn(buttonVariants({ size: "sm" }), "inline-flex items-center")}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Institution
        </Link>
      </div>

      <AdminTable
        rows={institutions}
        emptyMessage="No institutions yet. Add one to get started."
        columns={[
          {
            key: "name",
            label: "Name",
            render: (row) => (
              <Link
                href={`/admin/institutions/${row.id}`}
                className="font-medium text-gray-900 hover:text-primary transition-colors"
              >
                {row.name}
              </Link>
            ),
          },
          {
            key: "type",
            label: "Type",
            render: (row) => (
              <span className="text-gray-600">
                {INSTITUTION_TYPE_LABELS[row.institution_type]}
              </span>
            ),
          },
          {
            key: "ownership",
            label: "Ownership",
            render: (row) => (
              <span className="text-gray-600">
                {OWNERSHIP_TYPE_LABELS[row.ownership_type]}
              </span>
            ),
          },
          {
            key: "state",
            label: "State",
            render: (row) => <span className="text-gray-600">{row.state}</span>,
          },
          {
            key: "status",
            label: "Status",
            render: (row) => (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded border ${
                  row.is_active
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-gray-100 text-gray-500 border-gray-200"
                }`}
              >
                {row.is_active ? "Active" : "Inactive"}
              </span>
            ),
          },
          {
            key: "actions",
            label: "",
            render: (row) => (
              <Link
                href={`/admin/institutions/${row.id}`}
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
