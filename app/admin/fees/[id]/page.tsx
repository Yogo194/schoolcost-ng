import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { FeeRecordEditor } from "@/components/admin/FeeRecordEditor";

export const metadata: Metadata = { title: "Edit Fee Record | Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFeeRecordPage({ params }: PageProps) {
  const { id } = await params;

  // TODO: fetch fee record + items from Supabase
  const record = null;
  const items = null;

  if (!record) notFound();

  async function handleUpdate(values: unknown) {
    "use server";
    console.log("Update fee record", id, values);
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
        record={record ?? undefined}
        items={items ?? []}
        onSubmit={handleUpdate as never}
      />
    </div>
  );
}
