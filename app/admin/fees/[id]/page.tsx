import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import {
  FeeRecordEditor,
  type FeeRecordEditorValues,
} from "@/components/admin/FeeRecordEditor";
import {
  getAdminFeeFormOptions,
  getAdminFeeRecord,
  updateAdminFeeRecord,
} from "@/lib/admin/fee-records";

export const metadata: Metadata = { title: "Edit Fee Record | Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFeeRecordPage({ params }: PageProps) {
  const { id } = await params;

  const [record, options] = await Promise.all([
    getAdminFeeRecord(id),
    getAdminFeeFormOptions(),
  ]);

  if (!record) notFound();

  async function handleUpdate(values: FeeRecordEditorValues) {
    "use server";
    await updateAdminFeeRecord(id, values);
    redirect("/admin/fees");
  }

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/fees"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to fee records
      </Link>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Edit Fee Record</h1>
      <FeeRecordEditor
        record={record}
        items={record.fee_items}
        sessionName={record.academic_session?.name ?? ""}
        institutionOptions={options.institutions}
        courseOptions={options.courses}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
