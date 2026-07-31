"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink, Info, X } from "lucide-react";
import { SourceBadge } from "@/components/public/SourceBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  filterSchoolFees,
  type SchoolFeeRow,
  type SchoolProfile,
} from "@/lib/mock/school-profile";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

interface SchoolCourseFeesProps {
  school: SchoolProfile;
}

export function SchoolCourseFees({ school }: SchoolCourseFeesProps) {
  const coverage = school.fee_coverage;
  const [course, setCourse] = useState("all");
  const [level, setLevel] = useState(() =>
    resolveDefaultLevel(coverage.defaultLevelFilter, school.levels)
  );
  const [session, setSession] = useState(
    school.fees[0]?.session ?? school.sessions[0] ?? "all"
  );

  const rows = useMemo(
    () =>
      filterSchoolFees(school.fees, {
        course,
        level,
        session,
      }),
    [school.fees, course, level, session]
  );

  const categoryHeading =
    coverage.kind === "bands" ? "Fee group" : "Course";

  if (school.fees.length === 0) {
    return (
      <section className="bg-brand-lime-light px-4 pb-16 pt-6 sm:px-10 sm:pb-20 sm:pt-8 lg:px-20">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="text-2xl font-medium tracking-[-0.04em] text-brand-ink sm:text-[32px] lg:text-[38px]">
            No verified fees yet
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-6 tracking-[-0.02em] text-brand-ink/75 sm:text-lg sm:leading-7">
            We do not have verified fees for {school.abbreviation} yet. Share an
            official schedule or portal receipt and we will verify it.
          </p>
          <Link
            href="/submit-fees"
            className="mt-7 inline-flex h-11 items-center justify-center rounded-[12px] bg-[#166d3e] px-5 text-sm font-medium text-white shadow-[0_5px_12px_rgba(22,109,62,0.24)] transition-colors hover:bg-[#145f36]"
          >
            Contribute fee evidence
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-brand-lime-light px-4 pb-16 pt-6 sm:px-10 sm:pb-20 sm:pt-8 lg:px-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center justify-center gap-3">
            <h2 className="text-2xl font-medium tracking-[-0.04em] text-brand-ink sm:text-[32px] lg:text-[38px]">
              {coverage.sectionTitle}
            </h2>
            {coverage.notice ? (
              <FigureInfoTooltip
                notice={coverage.notice}
                sourceLabel={coverage.sourceLabel}
                sourceUrl={coverage.sourceUrl}
              />
            ) : null}
          </div>
          <p className="mt-2 text-base tracking-[-0.02em] text-brand-ink/80 sm:text-lg">
            {coverage.sectionDescription}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          <FilterSelect
            label={coverage.categoryFilterLabel}
            value={course}
            onChange={setCourse}
            options={[
              {
                value: "all",
                label:
                  coverage.kind === "bands" ? "All fee groups" : "All courses",
              },
              ...school.courses.map((name) => ({ value: name, label: name })),
            ]}
          />
          <FilterSelect
            label="Academic level"
            value={level}
            onChange={setLevel}
            options={[
              { value: "all", label: "All levels" },
              ...school.levels.map((name) => ({
                value: name,
                label: formatLevelLabel(name),
              })),
            ]}
          />
          <FilterSelect
            label="Academic session"
            value={session}
            onChange={setSession}
            options={[
              { value: "all", label: "All sessions" },
              ...school.sessions.map((name) => ({
                value: name,
                label: name.replace("/", " / "),
              })),
            ]}
          />
        </div>

        <div className="mt-8 space-y-3 md:hidden">
          {rows.map((fee) => (
            <MobileSchoolFeeCard key={fee.id} fee={fee} slug={school.slug} />
          ))}
          {rows.length === 0 && (
            <div className="rounded-2xl border border-[#e5ebe5] bg-white px-4 py-8 text-center text-sm text-brand-ink/60">
              No fees match these filters yet.
            </div>
          )}
        </div>

        <div className="mt-8 hidden overflow-x-auto rounded-2xl border border-[#e5ebe5] bg-white md:block">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {(
                  [
                    categoryHeading,
                    "Level",
                    "Estimated fees",
                    "Session",
                    "Source",
                  ] as const
                ).map((heading, i) => (
                  <TableHead
                    key={heading}
                    className={cn(
                      "h-14 bg-[#f2ac5b] px-4 text-[18px] font-medium tracking-[-0.25px] text-[#002c15]",
                      i === 0 ? "text-left" : "text-center"
                    )}
                  >
                    {heading}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((fee) => (
                <FeeRow key={fee.id} fee={fee} slug={school.slug} />
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="px-4 py-10 text-center text-brand-ink/60"
                  >
                    No fees match these filters yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}

function FigureInfoTooltip({
  notice,
  sourceLabel,
  sourceUrl,
}: {
  notice: string;
  sourceLabel?: string;
  sourceUrl?: string;
}) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-label="About these figures"
        onClick={() => setIsSheetOpen(true)}
        className="inline-flex size-7 items-center justify-center rounded-full border border-brand-ink/15 bg-white text-brand-ink/60 shadow-[0_1px_3px_rgba(0,44,21,0.06)] transition hover:border-brand-ink/25 hover:text-brand-ink focus:outline-none focus:ring-2 focus:ring-[#f2ac5b]/45 sm:size-8"
      >
        <Info className="size-4" aria-hidden />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute right-0 top-11 z-20 hidden w-[320px] rounded-xl bg-brand-ink px-4 py-3 text-left text-sm font-normal leading-6 text-white opacity-0 shadow-[0_8px_20px_rgba(0,44,21,0.14)] transition group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 sm:block"
      >
        <FigureInfoContent
          notice={notice}
          sourceLabel={sourceLabel}
          sourceUrl={sourceUrl}
        />
      </span>
      {isSheetOpen ? (
        <div className="fixed inset-0 z-50 sm:hidden">
          <button
            type="button"
            aria-label="Close about these figures"
            className="absolute inset-0 bg-brand-ink/30"
            onClick={() => setIsSheetOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-[20px] bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-4 text-left shadow-[0_-12px_30px_rgba(0,44,21,0.16)]">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="text-base font-medium tracking-[-0.02em] text-brand-ink">
                About these figures
              </p>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setIsSheetOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-full border border-brand-ink/10 text-brand-ink/65"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <div className="text-sm leading-6 text-brand-ink/70">
              <FigureInfoContent
                notice={notice}
                sourceLabel={sourceLabel}
                sourceUrl={sourceUrl}
                mobile
              />
            </div>
          </div>
        </div>
      ) : null}
    </span>
  );
}

function FigureInfoContent({
  notice,
  sourceLabel,
  sourceUrl,
  mobile = false,
}: {
  notice: string;
  sourceLabel?: string;
  sourceUrl?: string;
  mobile?: boolean;
}) {
  return (
    <>
      {!mobile ? <span className="block font-medium">About these figures</span> : null}
      <span className={cn("block", mobile ? "text-brand-ink/70" : "mt-1 text-white/78")}>
        {notice}
      </span>
      {sourceUrl ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            void import("@/lib/analytics").then(({ track, AnalyticsEvents }) => {
              track(AnalyticsEvents.sourceLinkClicked, {
                source_url: sourceUrl,
                source_label: sourceLabel ?? "View official source",
                surface: "school_fee_coverage",
              });
            });
          }}
          className={cn(
            "mt-3 inline-flex items-center gap-1 font-medium hover:underline",
            mobile ? "text-[#166d3e]" : "text-[#f2ac5b]"
          )}
        >
          {sourceLabel ?? "View official source"}
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
      ) : null}
    </>
  );
}

/**
 * Level names are authored per school, so they range from a bare code ("100L")
 * to a descriptive band ("Faculty band: Law"). A hardcoded default can therefore
 * name a level a school does not have, which leaves the select with no matching
 * option: it reads as "All levels" while the table filters every row out.
 */
function resolveDefaultLevel(preferred: string, levels: string[]): string {
  if (preferred === "all" || levels.includes(preferred)) return preferred;
  // Keep the first-year default where the school expresses it differently,
  // so the table still agrees with the "First-year" range card.
  return levels.find((level) => level.startsWith("100")) ?? "all";
}

function formatLevelLabel(name: string): string {
  if (name === "Undergraduate") return "Undergraduate (annual)";
  if (name.includes("+")) return name;
  if (name.includes("DE")) return name;
  // Anchor on the level code so band names keep their own wording. A bare
  // replace turned "Faculty band: Law" into "Faculty band:  Levelaw".
  return name.replace(/(\d{3})L\b/g, "$1 Level");
}

function FeeRow({ fee, slug }: { fee: SchoolFeeRow; slug: string }) {
  const href = `/schools/${slug}/fees/${fee.id}`;

  return (
    <TableRow className="group h-[72px]">
      <TableCell className="px-4 py-4 text-base font-medium tracking-[-0.02em] text-[#355955]">
        <Link href={href} className="group-hover:underline">
          {fee.course}
        </Link>
      </TableCell>
      <TableCell className="px-4 py-4 text-center text-base tracking-[-0.02em] text-brand-ink/80">
        <Link href={href}>{fee.level}</Link>
      </TableCell>
      <TableCell className="px-4 py-4 text-center text-base font-semibold tracking-[-0.25px] text-[#355955]">
        <Link href={href}>{formatCurrency(fee.compulsory_total)}</Link>
      </TableCell>
      <TableCell className="px-4 py-4 text-center text-base tracking-[-0.02em] text-brand-ink/80">
        <Link href={href}>{fee.session}</Link>
      </TableCell>
      <TableCell className="px-4 py-4 text-center">
        <Link href={href} className="inline-flex justify-center">
          <SourceBadge sourceType={fee.source_type} compact />
        </Link>
      </TableCell>
    </TableRow>
  );
}

function MobileSchoolFeeCard({
  fee,
  slug,
}: {
  fee: SchoolFeeRow;
  slug: string;
}) {
  const href = `/schools/${slug}/fees/${fee.id}`;

  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-[#e5ebe5] bg-white p-4 shadow-[0_1px_2px_rgba(3,48,42,0.04)] transition-[transform,box-shadow] active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-semibold leading-tight tracking-[-0.03em] text-[#355955]">
            {fee.course}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <p className="text-sm text-brand-ink/62">
              {fee.level} <span aria-hidden>·</span> {fee.session}
            </p>
            <SourceBadge sourceType={fee.source_type} compact />
          </div>
        </div>
        <ChevronRight
          className="mt-0.5 size-5 shrink-0 text-brand-ink/35 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </div>

      <div className="mt-4 border-t border-[#edf0ed] pt-4">
        <div className="flex items-baseline justify-between gap-4 rounded-lg border border-[#f2ac5b]/18 bg-[#fff7ed] px-3 py-3">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-brand-ink/45">
            Estimated fees
          </p>
          <p className="text-xl font-semibold leading-none tracking-[-0.04em] text-brand-ink">
            {formatCurrency(fee.compulsory_total)}
          </p>
        </div>
      </div>
    </Link>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium tracking-[-0.02em] text-brand-ink/70">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full appearance-none rounded-[14px] border border-[#d9e0dc] bg-white px-4 pr-10 text-base tracking-[-0.02em] text-brand-ink outline-none transition-[box-shadow,border-color] focus:border-brand-ink/30 focus:shadow-[0_0_0_3px_rgba(3,48,42,0.08)]"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-ink/45"
          aria-hidden
        />
      </div>
    </label>
  );
}
