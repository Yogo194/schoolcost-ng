import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import {
  InstitutionEditor,
  type InstitutionEditorValues,
} from "@/components/admin/InstitutionEditor";
import { createAdminInstitution } from "@/lib/admin/institutions";

export const metadata: Metadata = { title: "Add Institution | Admin" };

export default function NewInstitutionPage() {
  async function handleCreate(values: InstitutionEditorValues) {
    "use server";
    await createAdminInstitution(values);
    redirect("/admin/institutions");
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
      <InstitutionEditor onSubmit={handleCreate} />
    </div>
  );
}
