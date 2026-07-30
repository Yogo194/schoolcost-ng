import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/admin/require-admin";
import { createServiceClient } from "@/lib/supabase/service";
import type { Database } from "@/types/database";
import type { Institution } from "@/types/institution";

export type AdminInstitutionInput = {
  name: string;
  slug: string;
  abbreviation?: string | null;
  logo_url?: string | null;
  institution_type: Institution["institution_type"];
  ownership_type: Institution["ownership_type"];
  state: string;
  city?: string | null;
  website_url?: string | null;
  description?: string | null;
  is_active: boolean;
};

function cleanOptional(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function toInstitutionRow(
  input: AdminInstitutionInput
): Database["public"]["Tables"]["institutions"]["Insert"] {
  return {
    name: input.name.trim(),
    slug: input.slug.trim(),
    abbreviation: cleanOptional(input.abbreviation),
    logo_url: cleanOptional(input.logo_url),
    institution_type: input.institution_type,
    ownership_type: input.ownership_type,
    state: input.state,
    city: cleanOptional(input.city),
    website_url: cleanOptional(input.website_url),
    description: cleanOptional(input.description),
    is_active: input.is_active,
  };
}

export async function listAdminInstitutions(): Promise<Institution[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("institutions")
    .select("*")
    .order("name");

  if (error) throw new Error(error.message);
  return (data ?? []) as Institution[];
}

export async function getAdminInstitution(
  id: string
): Promise<Institution | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("institutions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Institution | null;
}

export async function createAdminInstitution(
  input: AdminInstitutionInput
): Promise<string> {
  await requireAdminUser();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("institutions")
    .insert(toInstitutionRow(input))
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not create institution");
  }

  revalidatePath("/admin/institutions");
  revalidatePath("/schools");
  return data.id;
}

export async function updateAdminInstitution(
  id: string,
  input: AdminInstitutionInput
): Promise<void> {
  await requireAdminUser();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("institutions")
    .update(toInstitutionRow(input))
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/institutions");
  revalidatePath(`/admin/institutions/${id}`);
  revalidatePath("/schools");
}
