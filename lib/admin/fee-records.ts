import { revalidatePath } from "next/cache";
import {
  accommodationTotal,
  compulsoryTotal,
  estimatedDegreeTotal,
  firstYearTotal,
  optionalTotal,
  returningYearTotal,
} from "@/lib/calculations/fees";
import { requireAdminUser } from "@/lib/admin/require-admin";
import { createServiceClient } from "@/lib/supabase/service";
import { fetchAllRows } from "@/lib/supabase/fetch-all-rows";
import { resolveAcademicSessionId } from "@/lib/submissions/resolve";
import type { Database } from "@/types/database";
import type { FeeItem, FeeRecord } from "@/types/fee";
import type { Course, Institution } from "@/types/institution";

type AdminFeeItemInput = {
  id?: string;
  name: string;
  category: FeeItem["category"];
  amount: number;
  is_compulsory: boolean;
  frequency: FeeItem["frequency"];
  applies_to: FeeItem["applies_to"];
  description?: string | null;
};

export type AdminFeeRecordInput = {
  institution_id: string;
  course_id?: string | null;
  academic_session: string;
  level?: string | null;
  student_type: FeeRecord["student_type"];
  duration_years: number;
  verification_status: FeeRecord["verification_status"];
  confidence_level: FeeRecord["confidence_level"];
  source_type: FeeRecord["source_type"];
  admin_note?: string | null;
  is_published: boolean;
  fee_items: AdminFeeItemInput[];
};

export type AdminFeeRecordListRow = FeeRecord & {
  institution?: Pick<Institution, "name" | "slug"> | null;
  course?: Pick<Course, "name"> | null;
  academic_session?: { name: string } | null;
};

export type AdminFeeRecordDetail = FeeRecord & {
  fee_items: FeeItem[];
  institution?: Pick<Institution, "name" | "slug"> | null;
  course?: Pick<Course, "name"> | null;
  academic_session?: { name: string } | null;
};

export type AdminFeeFormOptions = {
  institutions: Pick<Institution, "id" | "name">[];
  courses: Pick<Course, "id" | "institution_id" | "name" | "duration_years">[];
};

function cleanOptional(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function toCalcItems(items: AdminFeeItemInput[]): FeeItem[] {
  return items.map((item, index) => ({
    id: item.id ?? `admin-${index}`,
    fee_record_id: "admin",
    name: item.name.trim(),
    original_label: item.name.trim(),
    category: item.category,
    amount: Number(item.amount),
    is_compulsory: item.is_compulsory,
    frequency: item.frequency,
    applies_to: item.applies_to,
    description: cleanOptional(item.description),
    created_at: "",
    updated_at: "",
  }));
}

function toFeeItemRow(
  feeRecordId: string,
  item: AdminFeeItemInput
): Database["public"]["Tables"]["fee_items"]["Insert"] {
  return {
    fee_record_id: feeRecordId,
    name: item.name.trim(),
    original_label: item.name.trim(),
    category: item.category,
    amount: Number(item.amount),
    is_compulsory: item.is_compulsory,
    frequency: item.frequency,
    applies_to: item.applies_to,
    description: cleanOptional(item.description),
  };
}

async function resolveCourseDurationYears(
  courseId: string | null,
  fallback: number
) {
  if (!courseId) return fallback;
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("courses")
    .select("duration_years")
    .eq("id", courseId)
    .maybeSingle();
  return data?.duration_years ?? fallback;
}

async function toFeeRecordRow(input: AdminFeeRecordInput) {
  const supabase = createServiceClient();
  const courseId = cleanOptional(input.course_id);
  const sessionId = await resolveAcademicSessionId(
    supabase,
    input.institution_id,
    input.academic_session
  );
  if (!sessionId) {
    throw new Error("Could not resolve academic session");
  }

  const calcItems = toCalcItems(input.fee_items);
  const firstYear = firstYearTotal(calcItems);
  const returningYear = returningYearTotal(calcItems);
  const durationYears = await resolveCourseDurationYears(
    courseId,
    input.duration_years
  );

  return {
    institution_id: input.institution_id,
    course_id: courseId,
    academic_session_id: sessionId,
    level: cleanOptional(input.level),
    student_type: input.student_type,
    currency: "NGN",
    compulsory_total: compulsoryTotal(calcItems),
    optional_total: optionalTotal(calcItems),
    accommodation_total: accommodationTotal(calcItems),
    first_year_total: firstYear,
    returning_year_total: returningYear,
    estimated_degree_total: estimatedDegreeTotal(firstYear, returningYear, durationYears),
    verification_status: input.verification_status,
    confidence_level: input.confidence_level,
    source_type: input.source_type,
    last_reviewed_at: new Date().toISOString(),
    review_due_at: null,
    is_published: input.is_published,
    admin_note: cleanOptional(input.admin_note),
  } satisfies Database["public"]["Tables"]["fee_records"]["Insert"];
}

export async function listAdminFeeRecords(): Promise<AdminFeeRecordListRow[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("fee_records")
    .select(
      "*, institution:institutions(name, slug), course:courses(name), academic_session:academic_sessions(name)"
    )
    .order("updated_at", { ascending: false })
    .limit(250);

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as AdminFeeRecordListRow[];
}

export async function getAdminFeeRecord(
  id: string
): Promise<AdminFeeRecordDetail | null> {
  const supabase = createServiceClient();
  const { data: record, error } = await supabase
    .from("fee_records")
    .select(
      "*, institution:institutions(name, slug), course:courses(name), academic_session:academic_sessions(name)"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!record) return null;

  const { data: items, error: itemsError } = await supabase
    .from("fee_items")
    .select("*")
    .eq("fee_record_id", id)
    .order("created_at", { ascending: true });

  if (itemsError) throw new Error(itemsError.message);

  return {
    ...(record as unknown as AdminFeeRecordListRow),
    fee_items: (items ?? []) as FeeItem[],
  };
}

export async function getAdminFeeFormOptions(): Promise<AdminFeeFormOptions> {
  const supabase = createServiceClient();
  const [institutions, courses] = await Promise.all([
    fetchAllRows<Pick<Institution, "id" | "name">>((from, to) =>
      supabase
        .from("institutions")
        .select("id, name")
        .eq("is_active", true)
        .order("name")
        .range(from, to)
    ),
    fetchAllRows<Pick<Course, "id" | "institution_id" | "name" | "duration_years">>((from, to) =>
      supabase
        .from("courses")
        .select("id, institution_id, name, duration_years")
        .eq("is_active", true)
        .order("name")
        .range(from, to)
    ),
  ]);

  return { institutions, courses };
}

export async function createAdminFeeRecord(
  input: AdminFeeRecordInput
): Promise<string> {
  await requireAdminUser();
  const supabase = createServiceClient();
  const row = await toFeeRecordRow(input);
  const { data: record, error } = await supabase
    .from("fee_records")
    .insert(row)
    .select("id")
    .single();

  if (error || !record) {
    throw new Error(error?.message ?? "Could not create fee record");
  }

  const { error: itemError } = await supabase
    .from("fee_items")
    .insert(input.fee_items.map((item) => toFeeItemRow(record.id, item)));

  if (itemError) {
    await supabase.from("fee_records").delete().eq("id", record.id);
    throw new Error(itemError.message);
  }

  revalidatePath("/admin/fees");
  revalidatePath("/schools");
  return record.id;
}

export async function updateAdminFeeRecord(
  id: string,
  input: AdminFeeRecordInput
): Promise<void> {
  await requireAdminUser();
  const supabase = createServiceClient();
  const row = await toFeeRecordRow(input);
  const { error } = await supabase.from("fee_records").update(row).eq("id", id);
  if (error) throw new Error(error.message);

  const { data: existingItems, error: existingError } = await supabase
    .from("fee_items")
    .select("id")
    .eq("fee_record_id", id);
  if (existingError) throw new Error(existingError.message);

  const submittedExistingIds = input.fee_items
    .map((item) => item.id)
    .filter((itemId): itemId is string => Boolean(itemId));
  const idsToDelete =
    existingItems
      ?.map((item) => item.id)
      .filter((itemId) => !submittedExistingIds.includes(itemId)) ?? [];

  for (const item of input.fee_items) {
    const itemRow = toFeeItemRow(id, item);
    if (item.id) {
      const { error: updateError } = await supabase
        .from("fee_items")
        .update(itemRow)
        .eq("id", item.id)
        .eq("fee_record_id", id);
      if (updateError) throw new Error(updateError.message);
    } else {
      const { error: insertError } = await supabase
        .from("fee_items")
        .insert(itemRow);
      if (insertError) throw new Error(insertError.message);
    }
  }

  if (idsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("fee_items")
      .delete()
      .eq("fee_record_id", id)
      .in("id", idsToDelete);
    if (deleteError) throw new Error(deleteError.message);
  }

  revalidatePath("/admin/fees");
  revalidatePath(`/admin/fees/${id}`);
  revalidatePath("/schools");
}
