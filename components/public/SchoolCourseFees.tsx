"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, ExternalLink, Info } from "lucide-react";
import { SourceBadge } from "@/components/public/SourceBadge";
import { InfoPrompt } from "@/components/public/InfoPrompt";
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
  const [level, setLevel] = useState(coverage.defaultLevelFilter);
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
    coverage.kind === "bands" ? "Fee band" : "Course";

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
          <h2 className="text-2xl font-medium tracking-[-0.04em] text-brand-ink sm:text-[32px] lg:text-[38px]">
            {coverage.sectionTitle}
          </h2>
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
                  coverage.kind === "bands" ? "All fee bands" : "All courses",
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

        {coverage.notice ? (
          <InfoPrompt
            className="mt-8 w-full"
            title={
              <span className="inline-flex items-center gap-2">
                About these figures
                <FigureInfoTooltip />
              </span>
            }
            description={
              <>
                {coverage.notice}{" "}
                {coverage.sourceUrl ? (
                  <a
                    href={coverage.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-[#166d3e] underline-offset-2 hover:text-[#145f36] hover:underline"
                  >
                    {coverage.sourceLabel ?? "View official source"}
                    <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                ) : null}
              </>
            }
          />
        ) : null}

        <div className="mt-8 overflow-x-auto rounded-2xl border border-[#e5ebe5] bg-white">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {(
                  [
                    categoryHeading,
                    "Level",
                    "Compulsory total",
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

function FigureInfoTooltip() {
  return (
    <span className="group relative inline-flex align-middle">
      <button
        type="button"
        aria-label="About this fee note"
        className="inline-flex size-5 items-center justify-center rounded-full border border-brand-ink/15 bg-white/70 text-brand-ink/55 transition hover:border-brand-ink/25 hover:text-brand-ink focus:outline-none focus:ring-2 focus:ring-[#f2ac5b]/45"
      >
        <Info className="size-3.5" aria-hidden />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-7 z-20 w-[250px] -translate-x-1/2 rounded-lg bg-brand-ink px-3 py-2 text-xs font-normal leading-5 text-white opacity-0 shadow-[0_8px_20px_rgba(0,44,21,0.14)] transition group-hover:opacity-100 group-focus-within:opacity-100 sm:left-0 sm:translate-x-0"
      >
        This note explains what the table includes and what may still need
        checking before payment.
      </span>
    </span>
  );
}

function formatLevelLabel(name: string): string {
  if (name === "Undergraduate") return "Undergraduate (annual)";
  if (name.includes("+")) return name;
  if (name.includes("DE")) return name;
  return name.replace("L", " Level");
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
