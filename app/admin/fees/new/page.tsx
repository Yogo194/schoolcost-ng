import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { FeeRecordEditor } from "@/components/admin/FeeRecordEditor";

export const metadata: Metadata = { title: "Add Fee Record | Admin" };

export default function NewFeeRecordPage() {
  async function handleCreate(values: unknown) {
    "use server";
    // TODO: insert fee_record + fee_items in Supabase
    console.log("Create fee record:", values);
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
      <FeeRecordEditor onSubmit={handleCreate as never} />
    </div>
  );
}
