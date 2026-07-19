"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import { FeeCourseCompareMatrix } from "@/components/public/FeeCourseCompareMatrix";
import { getMockFeeDetail } from "@/lib/mock/fee-detail";

const COMPARE_COURSES = [
  {
    feeRecordId: "unilag-cs-100",
    label: "Computer Science",
    schoolCount: 4,
  },
] as const;

export function CompareWorkspace() {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const selectedCourse = COMPARE_COURSES.find(
    (course) => course.feeRecordId === selectedCourseId
  );
  const record = selectedCourse
    ? getMockFeeDetail(selectedCourse.feeRecordId)
    : null;

  return (
    <>
    <section className="px-4 py-16 sm:px-10 sm:py-20 lg:px-20">
      <div className="mx-auto max-w-[1280px]">
        {!record && (
          <div className="mx-auto max-w-2xl animate-compare-reveal text-center motion-reduce:animate-none">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-brand-ink/50">
              Start your comparison
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-brand-ink sm:text-3xl">
              Choose the course first
            </h2>
            <p className="mt-2 text-sm leading-5 text-brand-ink/65 sm:text-base">
              Pick a course, then compare up to three schools with reviewed fees
              for the same level and academic session.
            </p>

            <div className="mt-6 rounded-2xl border border-[#e5ebe5] bg-white p-4 text-left sm:p-5">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-brand-ink/55">
                Course
              </span>
              <span className="relative">
                <BookOpen
                  className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-brand-ink/55"
                  aria-hidden
                />
                <select
                  value={selectedCourseId}
                  onChange={(event) => setSelectedCourseId(event.target.value)}
                  className="h-14 w-full appearance-none rounded-xl border border-[#dce4dc] bg-white py-0 pl-12 pr-11 text-base font-medium tracking-[-0.02em] text-brand-ink outline-none transition-[border-color,box-shadow] focus:border-brand-ink/35 focus:shadow-[0_0_0_3px_rgba(3,48,42,0.08)]"
                >
                  <option value="">Select a course</option>
                  {COMPARE_COURSES.map((course) => (
                    <option key={course.feeRecordId} value={course.feeRecordId}>
                      {course.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-brand-ink/50"
                  aria-hidden
                />
              </span>
            </label>

            <div className="mt-4 flex items-center justify-center gap-2 overflow-x-auto pb-1">
              <span className="shrink-0 text-sm text-brand-ink/55">Try:</span>
              {COMPARE_COURSES.map((course) => (
                <button
                  key={course.feeRecordId}
                  type="button"
                  onClick={() => setSelectedCourseId(course.feeRecordId)}
                  className="shrink-0 rounded-full border border-[#edcfac] bg-[#fef8f0] px-3 py-1.5 text-sm font-medium text-brand-ink transition-colors hover:border-[#e7b77e] hover:bg-[#fcebd7]"
                >
                  {course.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm leading-5 text-brand-ink/60">
              Only courses with fees from at least two schools appear here.
            </p>
          </div>
          </div>
        )}

        {record ? (
          <div
            key={record.id}
            className="animate-compare-reveal motion-reduce:animate-none"
          >
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-brand-ink sm:text-3xl">
                Pick schools offering {record.course}
              </h2>
              <p className="mt-2 text-sm leading-5 text-brand-ink/65 sm:text-base">
                Add up to three schools to compare the costs that matter.
              </p>
            </div>
            <FeeCourseCompareMatrix
              record={record}
              level={record.defaultLevel}
              startEmpty
              onChangeCourse={() => setSelectedCourseId("")}
            />
          </div>
        ) : null}

      </div>
    </section>

    <section className="relative overflow-hidden bg-brand-lime px-4 sm:px-10 lg:px-20">
      {/* Amber-tint grid, matches SchoolSubmitCta */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(242,172,91,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(242,172,91,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "105px 105px",
          opacity: 0.55,
        }}
      />
      <div className="relative z-10 mx-auto flex max-w-[1280px] flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xl font-semibold tracking-[-0.03em] text-brand-ink">
            Can&apos;t find your course yet?
          </p>
          <p className="mt-1 text-base text-brand-ink/80">
            Browse the directory or submit fee evidence to help us add it.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/submit-fees"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-[14px] bg-[#166d3e] px-5 text-base font-medium text-white shadow-[0_5px_12px_rgba(22,109,62,0.32)] transition-colors hover:bg-[#145f36]"
          >
            Submit a fee update
          </Link>
          <Link
            href="/schools"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[14px] bg-white px-5 text-base font-medium text-primary transition-colors hover:bg-white/85"
          >
            Find a school
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
    </>
  );
}
