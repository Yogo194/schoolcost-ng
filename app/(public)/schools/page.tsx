import type { Metadata } from "next";
import { SearchBar } from "@/components/public/SearchBar";
import { SchoolResultRow } from "@/components/public/SchoolResultRow";
import { EmptyState } from "@/components/public/EmptyState";
import { SchoolsFilterDrawer } from "@/components/public/SchoolsFilterDrawer";
import { SchoolCardSkeleton } from "@/components/public/LoadingSkeleton";
import { Suspense } from "react";
import { Search } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";
import type { Institution } from "@/types/institution";

export const metadata: Metadata = {
  title: "Schools",
  description: "Browse and search Nigerian tertiary institutions and their verified school fees.",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    state?: string;
    institution_type?: string;
    ownership_type?: string;
  }>;
}

export default async function SchoolsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Find a School</h1>
        <div className="flex gap-3">
          <SearchBar
            defaultValue={params.q}
            className="flex-1"
          />
          <Suspense>
            <SchoolsFilterDrawer />
          </Suspense>
        </div>
      </div>

      {/* Active filters */}
      {(params.state || params.institution_type || params.ownership_type) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {params.state && <FilterChip label={`State: ${params.state}`} />}
          {params.institution_type && (
            <FilterChip
              label={`Type: ${params.institution_type.replace(/_/g, " ")}`}
            />
          )}
          {params.ownership_type && (
            <FilterChip label={`Ownership: ${params.ownership_type}`} />
          )}
        </div>
      )}

      {/* Results */}
      <Suspense fallback={<SchoolListSkeleton />}>
        <SchoolResults params={params} />
      </Suspense>
    </div>
  );
}

async function SchoolResults({
  params,
}: {
  params: { q?: string; state?: string; institution_type?: string; ownership_type?: string };
}) {
  const { institutions, lowestFees } = await getInstitutions(params);

  if (institutions.length === 0) {
    return (
      <EmptyState
        title={params.q ? `No results for "${params.q}"` : "No schools yet"}
        description={
          params.q
            ? "Try a different search term, or suggest this school if it is missing."
            : "We are building the database. Check back soon or suggest a school."
        }
        action={
          params.q
            ? { label: "Suggest this school", href: `/suggest-school?name=${encodeURIComponent(params.q)}` }
            : { label: "Suggest a school", href: "/suggest-school" }
        }
        secondaryAction={
          params.q ? { label: "Clear search", href: "/schools" } : undefined
        }
        icon={<Search className="w-10 h-10" />}
      />
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        {institutions.length} {institutions.length === 1 ? "school" : "schools"} found
        {params.q && <> matching <span className="font-medium text-gray-700">&ldquo;{params.q}&rdquo;</span></>}
      </p>
      <div className="border border-gray-200 rounded-lg">
        {institutions.map((institution) => {
          const fee = lowestFees.get(institution.id);

          return (
            <SchoolResultRow
              key={institution.id}
              institution={institution}
              lowestFee={fee?.amount}
              currency={fee?.currency}
            />
          );
        })}
      </div>
    </div>
  );
}

async function getInstitutions(params: {
  q?: string;
  state?: string;
  institution_type?: string;
  ownership_type?: string;
}): Promise<{
  institutions: Institution[];
  lowestFees: Map<string, { amount: number; currency: string }>;
}> {
  try {
    const supabase = await createServerClient();
    let query = supabase
      .from("institutions")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (params.q?.trim()) {
      const search = params.q.trim().replace(/[%,()]/g, " ");
      query = query.or(
        `name.ilike.%${search}%,abbreviation.ilike.%${search}%,city.ilike.%${search}%`
      );
    }
    if (params.state) query = query.eq("state", params.state);
    if (params.institution_type) {
      query = query.eq("institution_type", params.institution_type);
    }
    if (params.ownership_type) {
      query = query.eq("ownership_type", params.ownership_type);
    }

    const { data, error } = await query;
    if (error || !data) return { institutions: [], lowestFees: new Map() };

    const institutions = data as Institution[];
    const ids = institutions.map((institution) => institution.id);
    if (ids.length === 0) return { institutions, lowestFees: new Map() };

    const { data: fees } = await supabase
      .from("fee_records")
      .select("institution_id, first_year_total, currency")
      .in("institution_id", ids)
      .eq("is_published", true)
      .eq("verification_status", "verified");

    const lowestFees = new Map<string, { amount: number; currency: string }>();
    for (const fee of (fees ?? []) as Array<{
      institution_id: string;
      first_year_total: number;
      currency: string;
    }>) {
      const amount = Number(fee.first_year_total);
      if (!Number.isFinite(amount)) continue;

      const current = lowestFees.get(fee.institution_id);
      if (!current || amount < current.amount) {
        lowestFees.set(fee.institution_id, {
          amount,
          currency: fee.currency,
        });
      }
    }

    return { institutions, lowestFees };
  } catch {
    return { institutions: [], lowestFees: new Map() };
  }
}

function FilterChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
      {label}
    </span>
  );
}

function SchoolListSkeleton() {
  return (
    <div className="space-y-0 border border-gray-200 rounded-lg">
      {Array.from({ length: 6 }).map((_, i) => (
        <SchoolCardSkeleton key={i} />
      ))}
    </div>
  );
}
