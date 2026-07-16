import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { InstitutionEditor } from "@/components/admin/InstitutionEditor";

export const metadata: Metadata = { title: "Edit Institution | Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInstitutionPage({ params }: PageProps) {
  const { id } = await params;

  // TODO: fetch institution from Supabase by id
  const institution = null;

  if (!institution) notFound();

  async function handleUpdate(values: unknown) {
    "use server";
    // TODO: update institution in Supabase
    console.log("Update institution", id, values);
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
      <InstitutionEditor institution={institution ?? undefined} onSubmit={handleUpdate as never} />
    </div>
  );
}
