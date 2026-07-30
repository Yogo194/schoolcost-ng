"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Building2, Check, Search } from "lucide-react";
import type { SchoolsDirectoryItem } from "@/lib/mock/schools-directory";
import { POPULAR_STATES } from "@/lib/mock/schools-directory";
import {
  INSTITUTION_TYPE_LABELS,
  OWNERSHIP_TYPE_LABELS,
} from "@/types/institution";
import type { InstitutionType, OwnershipType } from "@/types/database";
import { createSchoolSearchIndex } from "@/lib/search/school-search";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

const INSTITUTION_TYPES = Object.keys(
  INSTITUTION_TYPE_LABELS
) as InstitutionType[];

const OWNERSHIP_TYPES = Object.keys(OWNERSHIP_TYPE_LABELS) as OwnershipType[];

interface SchoolsDirectoryProps {
  schools: SchoolsDirectoryItem[];
}

export function SchoolsDirectory({ schools }: SchoolsDirectoryProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const q = searchParams.get("q") ?? "";
  const state = searchParams.get("state") ?? "";
  const institutionType = searchParams.get("institution_type") ?? "";
  const ownershipType = searchParams.get("ownership_type") ?? "";

  const [filters, setFilters] = useState({
    state,
    institutionType,
    ownershipType,
  });

  // Keep local filters aligned with shared links and browser navigation. A
  // click updates local state first, so the visible list never waits for URL
  // navigation to finish.
  useEffect(() => {
    // URL changes are external state (shared links and browser navigation).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilters({ state, institutionType, ownershipType });
  }, [state, institutionType, ownershipType]);

  const activeState = filters.state;
  const activeInstitutionType = filters.institutionType;
  const activeOwnershipType = filters.ownershipType;

  /* The list filters from local state on every keystroke; the URL is synced
     a moment later so results stay instant but links remain shareable. */
  const [query, setQuery] = useState(q);
  const lastSyncedQ = useRef(q);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed === q.trim()) return;
    const timer = window.setTimeout(() => {
      lastSyncedQ.current = trimmed;
      const next = new URLSearchParams(searchParams.toString());
      if (trimmed) next.set("q", trimmed);
      else next.delete("q");
      /* No transition here: results already updated locally, so there is
         nothing to visually "pend" while the URL catches up. */
      const search = next.toString();
      router.replace(search ? `/schools?${search}` : "/schools", {
        scroll: false,
      });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query, q, searchParams, router]);

  // Follow external URL changes (back button, links) without clobbering typing.
  useEffect(() => {
    if (q !== lastSyncedQ.current) {
      lastSyncedQ.current = q;
      setQuery(q);
    }
  }, [q]);

  // Built once per dataset; each keystroke is a synchronous ranked lookup.
  const searchIndex = useMemo(() => createSchoolSearchIndex(schools), [schools]);

  const filtered = useMemo(() => {
    return searchIndex
      .search(query)
      .filter((school) => {
        if (activeState && school.state !== activeState) return false;
        if (
          activeInstitutionType &&
          school.institution_type !== activeInstitutionType
        ) {
          return false;
        }
        if (
          activeOwnershipType &&
          school.ownership_type !== activeOwnershipType
        ) {
          return false;
        }
        return true;
      })
      .sort(
        (a, b) =>
          Number(Boolean(b.has_published_fees)) -
          Number(Boolean(a.has_published_fees))
      );
  }, [
    searchIndex,
    query,
    activeState,
    activeInstitutionType,
    activeOwnershipType,
  ]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query]);

  const visible = filtered.slice(0, visibleCount);
  const canShowMore = visibleCount < filtered.length;

  function updateParams(patch: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (!value) next.delete(key);
      else next.set(key, value);
    });
    setFilters({
      state: next.get("state") ?? "",
      institutionType: next.get("institution_type") ?? "",
      ownershipType: next.get("ownership_type") ?? "",
    });
    setVisibleCount(PAGE_SIZE);
    startTransition(() => {
      const query = next.toString();
      router.replace(query ? `/schools?${query}` : "/schools", {
        scroll: false,
      });
    });
  }

  function clearTypesAndOwnership() {
    updateParams({
      institution_type: null,
      ownership_type: null,
    });
  }

  const hasSidebarFilters = Boolean(activeInstitutionType || activeOwnershipType);

  return (
    <section className="bg-white px-4 py-12 sm:px-10 sm:py-16 lg:px-20">
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
        <aside className="space-y-8">
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold tracking-[-0.02em] text-brand-ink">
                Institution type
              </h2>
              {hasSidebarFilters && (
                <button
                  type="button"
                  onClick={clearTypesAndOwnership}
                  className="text-sm font-medium text-brand-ink/50 transition-colors hover:text-brand-ink"
                >
                  Clear
                </button>
              )}
            </div>
            <ul className="space-y-1">
              {INSTITUTION_TYPES.map((type) => {
                const selected = activeInstitutionType === type;
                return (
                  <li key={type}>
                    <button
                      type="button"
                      onClick={() =>
                        updateParams({
                          institution_type: selected ? null : type,
                        })
                      }
                      className={cn(
                        "flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-sm tracking-[-0.02em] transition-colors",
                        selected
                          ? "bg-brand-lime font-medium text-brand-ink"
                          : "text-brand-ink/75 hover:bg-brand-lime-light"
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-[5px] border",
                          selected
                            ? "border-brand-ink bg-brand-ink text-white"
                            : "border-[#c9d4cf] bg-white"
                        )}
                        aria-hidden
                      >
                        {selected && <Check className="size-3" />}
                      </span>
                      {INSTITUTION_TYPE_LABELS[type]}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-base font-semibold tracking-[-0.02em] text-brand-ink">
              Ownership
            </h2>
            <ul className="space-y-1">
              {OWNERSHIP_TYPES.map((type) => {
                const selected = activeOwnershipType === type;
                return (
                  <li key={type}>
                    <button
                      type="button"
                      onClick={() =>
                        updateParams({
                          ownership_type: selected ? null : type,
                        })
                      }
                      className={cn(
                        "flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-sm tracking-[-0.02em] transition-colors",
                        selected
                          ? "bg-brand-lime font-medium text-brand-ink"
                          : "text-brand-ink/75 hover:bg-brand-lime-light"
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-[5px] border",
                          selected
                            ? "border-brand-ink bg-brand-ink text-white"
                            : "border-[#c9d4cf] bg-white"
                        )}
                        aria-hidden
                      >
                        {selected && <Check className="size-3" />}
                      </span>
                      {OWNERSHIP_TYPE_LABELS[type]}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-base font-semibold tracking-[-0.02em] text-brand-ink">
              State
            </h2>
            <div className="flex flex-wrap gap-2">
              <StatePill
                label="All"
                selected={!activeState}
                onClick={() => updateParams({ state: null })}
              />
              {POPULAR_STATES.map((item) => (
                <StatePill
                  key={item}
                  label={item}
                  selected={activeState === item}
                  onClick={() =>
                    updateParams({
                      state: activeState === item ? null : item,
                    })
                  }
                />
              ))}
            </div>
          </div>
        </aside>

        <div className={cn(isPending && "opacity-70 transition-opacity")}>
          <label className="relative block">
            <span className="sr-only">Search schools</span>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-brand-ink/40"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              placeholder="Search schools, courses, or states"
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.preventDefault();
              }}
              className="h-[52px] w-full rounded-[14px] border border-[#d9e0dc] bg-white py-3 pl-12 pr-4 text-base tracking-[-0.02em] text-brand-ink outline-none transition-[box-shadow,border-color] placeholder:text-brand-ink/40 focus:border-brand-ink/30 focus:shadow-[0_0_0_3px_rgba(3,48,42,0.08)]"
            />
          </label>

          <p className="mt-4 text-sm tracking-[-0.02em] text-brand-ink/55">
            {filtered.length}{" "}
            {filtered.length === 1 ? "school" : "schools"}
            {query.trim() ? (
              <>
                {" "}
                matching{" "}
                <span className="font-medium text-brand-ink">
                  &ldquo;{query.trim()}&rdquo;
                </span>
              </>
            ) : null}
          </p>

          {filtered.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-[#e5ebe5] bg-[#fafafa] px-6 py-12 text-center">
              <p className="text-base font-medium text-brand-ink">
                No schools match these filters
              </p>
              <p className="mt-1 text-sm text-brand-ink/60">
                Try another search, or suggest a school we are missing.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/suggest-school"
                  className="inline-flex h-11 items-center rounded-[12px] bg-brand-ink px-4 text-sm font-medium text-white"
                >
                  Suggest a school
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    updateParams({
                      q: null,
                      state: null,
                      institution_type: null,
                      ownership_type: null,
                    });
                  }}
                  className="inline-flex h-11 items-center rounded-[12px] border border-[#e5ebe5] bg-white px-4 text-sm font-medium text-brand-ink"
                >
                  Clear filters
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((school) => (
                  <SchoolDirectoryCard key={school.id} school={school} />
                ))}
              </div>

              {canShowMore && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[#355955] bg-white px-6 text-sm font-medium tracking-[-0.02em] text-brand-ink transition-colors hover:bg-brand-lime-light"
                  >
                    Show more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function StatePill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-2 text-sm font-medium tracking-[-0.02em] transition-colors",
        selected
          ? "border-transparent bg-brand-lime text-brand-ink"
          : "border-[#355955]/40 bg-white text-brand-ink/75 hover:border-brand-ink/40"
      )}
    >
      {label}
    </button>
  );
}

function SchoolDirectoryCard({ school }: { school: SchoolsDirectoryItem }) {
  const meta = [
    school.abbreviation,
    OWNERSHIP_TYPE_LABELS[school.ownership_type],
    school.state,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/schools/${school.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-transparent bg-[#f4f6f5] p-4 transition-colors hover:border-[#d9e0dc] hover:bg-white"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#e5ebe5] bg-white">
          {school.logo_url ? (
            <Image
              src={school.logo_url}
              alt=""
              width={40}
              height={40}
              className="size-full object-contain p-1"
              loading="lazy"
            />
          ) : (
            <Building2 className="size-4 text-brand-ink/35" aria-hidden />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold tracking-[-0.02em] text-brand-ink group-hover:text-primary">
            {school.name}
          </p>
          <p className="mt-0.5 truncate text-sm tracking-[-0.02em] text-brand-ink/55">
            {meta}
          </p>
        </div>
      </div>
      {school.first_year_from != null ? (
        <p className="text-sm tracking-[-0.02em] text-brand-ink/65">
          From{" "}
          <span className="font-semibold text-brand-ink">
            {formatCurrency(school.first_year_from)}
          </span>{" "}
          first year
        </p>
      ) : (
        <p className="text-sm tracking-[-0.02em] text-brand-ink/45">
          No fee record yet · contribute one
        </p>
      )}
    </Link>
  );
}
