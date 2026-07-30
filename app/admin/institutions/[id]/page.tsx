import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import {
  InstitutionEditor,
  type InstitutionEditorValues,
} from "@/components/admin/InstitutionEditor";
import {
  getAdminInstitution,
  updateAdminInstitution,
} from "@/lib/admin/institutions";

export const metadata: Metadata = { title: "Edit Institution | Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInstitutionPage({ params }: PageProps) {
  const { id } = await params;

  const institution = await getAdminInstitution(id);

  if (!institution) notFound();

  async function handleUpdate(values: InstitutionEditorValues) {
    "use server";
    await updateAdminInstitution(id, values);
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
      <h1 className="text-xl font-bold text-gray-900 mb-6">Edit Institution</h1>
      <InstitutionEditor institution={institution} onSubmit={handleUpdate} />
    </div>
  );
}
