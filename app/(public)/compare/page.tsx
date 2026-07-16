import type { Metadata } from "next";
import Link from "next/link";
import { GitCompare, Plus } from "lucide-react";
import { ComparisonTable } from "@/components/public/ComparisonTable";
import { EmptyState } from "@/components/public/EmptyState";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Compare Schools",
  description: "Compare the cost of attending up to three Nigerian tertiary institutions side by side.",
};

interface PageProps {
  searchParams: Promise<{ schools?: string }>;
}

export default async function ComparePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const slugs = params.schools
    ? params.schools.split(",").filter(Boolean).slice(0, 3)
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Compare Schools</h1>
        <p className="text-sm text-gray-500">
          Compare the cost of attending up to three institutions side by side.
        </p>
      </div>

      {slugs.length === 0 ? (
        <EmptyState
          title="Add up to three schools to compare their costs."
          description="Browse schools and click 'Add to compare' on each school you want to compare."
          action={{ label: "Find schools", href: "/schools" }}
          icon={<GitCompare className="w-10 h-10" />}
        />
      ) : (
        <div className="space-y-6">
          {/* Slot indicators */}
          <div className="flex flex-wrap gap-3">
            {slugs.map((slug) => (
              <div
                key={slug}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-sm text-primary font-medium"
              >
                {slug}
              </div>
            ))}
            {slugs.length < 3 && (
              <Link
                href="/schools"
                className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-gray-300 rounded-full text-sm text-gray-400 hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add school
              </Link>
            )}
          </div>

          {/* Comparison table, populated when data is wired up */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-sm text-gray-500">
              Comparison data will appear here once the database is connected.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Selected slugs: {slugs.join(", ")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
