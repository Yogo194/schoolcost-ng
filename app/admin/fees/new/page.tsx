import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import {
  FeeRecordEditor,
  type FeeRecordEditorValues,
} from "@/components/admin/FeeRecordEditor";
import {
  createAdminFeeRecord,
  getAdminFeeFormOptions,
} from "@/lib/admin/fee-records";

export const metadata: Metadata = { title: "Add Fee Record | Admin" };

export default async function NewFeeRecordPage() {
  const options = await getAdminFeeFormOptions();

  async function handleCreate(values: FeeRecordEditorValues) {
    "use server";
    const id = await createAdminFeeRecord(values);
    redirect(`/admin/fees/${id}`);
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
      <h1 className="text-xl font-bold text-gray-900 mb-6">Add Fee Record</h1>
      <FeeRecordEditor
        institutionOptions={options.institutions}
        courseOptions={options.courses}
        onSubmit={handleCreate}
      />
    </div>
  );
}
