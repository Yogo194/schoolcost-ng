"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
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
  const [course, setCourse] = useState("all");
  const [level, setLevel] = useState("100L");
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

  const displayRows = rows;

  return (
    <section className="bg-brand-lime-light px-4 pb-16 pt-10 sm:px-10 sm:pb-20 sm:pt-12 lg:px-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-medium tracking-[-0.04em] text-brand-ink sm:text-[32px] lg:text-[38px]">
            Course fees
          </h2>
          <p className="mt-2 text-base tracking-[-0.02em] text-brand-ink/80 sm:text-lg">
            Verified compulsory fees by course and level. Open any row for the
            full breakdown.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          <FilterSelect
            label="Course"
            value={course}
            onChange={setCourse}
            options={[
              { value: "all", label: "All courses" },
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
                label: name.replace("L", " Level"),
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

        <div className="mt-8 overflow-x-auto rounded-2xl border border-[#e5ebe5] bg-white">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {(
                  [
                    "Course",
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
              {displayRows.map((fee) => (
                <FeeRow key={fee.id} fee={fee} slug={school.slug} />
              ))}
              {displayRows.length === 0 && (
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
    <label className="flex flex-col gap-2 text-left">
      <span className="text-xs font-medium uppercase tracking-[0.08em] text-[#9db85a]">
        {label}
      </span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full appearance-none rounded-xl border border-[#e5ebe5] bg-white px-4 pr-10 text-base tracking-[-0.02em] text-brand-ink outline-none transition-[border-color,box-shadow] focus:border-brand-ink/30 focus:shadow-[0_0_0_3px_rgba(3,48,42,0.08)]"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-brand-ink/50"
          aria-hidden
        />
      </span>
    </label>
  );
}
