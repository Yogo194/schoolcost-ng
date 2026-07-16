import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { InstitutionEditor } from "@/components/admin/InstitutionEditor";

export const metadata: Metadata = { title: "Add Institution | Admin" };

export default function NewInstitutionPage() {
  async function handleCreate(values: unknown) {
    "use server";
    // TODO: insert into institutions table via Supabase service role
    console.log("Create institution:", values);
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/institutions"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to institutions
      </Link>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Add Institution</h1>
      <InstitutionEditor onSubmit={handleCreate as never} />
    </div>
  );
}
