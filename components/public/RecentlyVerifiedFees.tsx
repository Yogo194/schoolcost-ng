"use client";

import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { EmptyState } from "@/components/public/EmptyState";
import { SourceBadge } from "@/components/public/SourceBadge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  filterRecentFees,
  RECENT_FEES_LIMIT,
  type RecentFeeRow,
  type RecentFeeTab,
} from "@/lib/mock/recent-fees";
import { formatCurrency } from "@/lib/utils/format";
import { OWNERSHIP_TYPE_LABELS } from "@/types/institution";
import { cn } from "@/lib/utils";

const TABS: { value: RecentFeeTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "federal", label: "Federal" },
  { value: "state", label: "State" },
  { value: "private", label: "Private" },
];

interface RecentlyVerifiedFeesProps {
  fees: RecentFeeRow[];
}

function institutionMeta(fee: RecentFeeRow): string {
  const bits = [
    fee.institutions.abbreviation,
    fee.institutions.city
      ? fee.institutions.city === fee.institutions.state
        ? fee.institutions.city
        : `${fee.institutions.city}, ${fee.institutions.state}`
      : fee.institutions.state,
    OWNERSHIP_TYPE_LABELS[fee.institutions.ownership_type],
  ].filter(Boolean);
  return bits.join(" · ");
}

function FeesTable({ rows }: { rows: RecentFeeRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#e5ebe5] bg-white">
        <EmptyState
          title="No verified fees in this category yet"
          description="Try another tab, or help us grow the database with a submission."
          action={{ label: "Submit fee information", href: "/submit-fees" }}
          icon={<Search className="size-10" />}
        />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {rows.map((fee) => (
          <MobileFeeCard key={fee.id} fee={fee} />
        ))}
      </div>

      <div className="hidden overflow-x-auto overflow-y-hidden rounded-2xl border border-[#e5ebe5] bg-white md:block">
        <Table className="min-w-[960px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {(
                [
                  "Institution",
                  "Course",
                  "Level",
                  "First-year total",
                  "Academic session",
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
            {rows.map((fee) => {
              const href = `/schools/${fee.institutions.slug}/fees/${fee.id}`;

              return (
                <TableRow key={fee.id} className="group h-[72px]">
                  <TableCell className="whitespace-normal px-4 py-4 align-middle">
                    <Link href={href} className="block">
                      <p className="text-lg font-medium leading-[1.2] tracking-[-0.04em] text-[#355955] group-hover:underline">
                        {fee.institutions.name}
                      </p>
                      <p className="mt-0.5 text-base leading-[1.4] tracking-[-0.02em] text-brand-ink/80">
                        {institutionMeta(fee)}
                      </p>
                    </Link>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center text-base tracking-[-0.02em] text-brand-ink/80">
                    <Link href={href}>{fee.courses.name}</Link>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center text-base tracking-[-0.02em] text-brand-ink/80">
                    <Link href={href}>{fee.level ?? "-"}</Link>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center text-base font-semibold tracking-[-0.25px] text-[#355955]">
                    <Link href={href}>{formatCurrency(fee.first_year_total)}</Link>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center text-base tracking-[-0.02em] text-brand-ink/80">
                    <Link href={href}>{fee.academic_sessions.name}</Link>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <Link href={href} className="inline-flex justify-center">
                      <SourceBadge sourceType={fee.source_type} compact />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function MobileFeeCard({ fee }: { fee: RecentFeeRow }) {
  const href = `/schools/${fee.institutions.slug}/fees/${fee.id}`;

  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-[#e5ebe5] bg-white p-5 shadow-[0_1px_2px_rgba(3,48,42,0.04)] transition-[transform,box-shadow] active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-lg font-semibold leading-tight tracking-[-0.03em] text-[#355955]">
            {fee.institutions.name}
          </p>
          <p className="mt-1 text-sm leading-5 text-brand-ink/65">
            {institutionMeta(fee)}
          </p>
        </div>
        <ChevronRight
          className="mt-1 size-5 shrink-0 text-brand-ink/35 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </div>

      <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#edf0ed] pt-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-brand-ink/45">
            {fee.courses.name}
          </p>
          <p className="mt-1 text-sm text-brand-ink/65">
            {fee.level ?? "Level pending"} <span aria-hidden>·</span>{" "}
            {fee.academic_sessions.name}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-brand-ink/45">
            First year
          </p>
          <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-[#355955]">
            {formatCurrency(fee.first_year_total)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <SourceBadge sourceType={fee.source_type} compact />
        <span className="text-sm font-medium text-brand-ink/65">View breakdown</span>
      </div>
    </Link>
  );
}

function OwnershipTabs({
  activeTab,
  onChange,
}: {
  activeTab: RecentFeeTab;
  onChange: (tab: RecentFeeTab) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef(new Map<RecentFeeTab, HTMLButtonElement>());
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  const measure = useCallback(() => {
    const btn = btnRefs.current.get(activeTab);
    if (!btn) return;

    setPill({
      left: btn.offsetLeft,
      width: btn.offsetWidth,
      ready: true,
    });
  }, [activeTab]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(onResize);
    ro.observe(list);

    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [measure]);

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Filter by ownership"
      className="relative inline-flex items-center gap-2 rounded-[54px] border border-solid border-[#e5ebe5] bg-brand-ink/[0.06] p-1"
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1 bottom-1 left-0 rounded-[42px] bg-white shadow-[0_1px_3px_0_rgba(16,24,40,0.10),0_1px_2px_0_rgba(16,24,40,0.06)] will-change-transform",
          pill.ready
            ? "transition-[transform,width] duration-[420ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
            : "opacity-0"
        )}
        style={{
          width: pill.width,
          transform: `translateX(${pill.left}px)`,
        }}
      />

      {TABS.map((tab) => {
        const selected = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            ref={(el) => {
              if (el) btnRefs.current.set(tab.value, el);
              else btnRefs.current.delete(tab.value);
            }}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative z-10 inline-flex items-center justify-center gap-2 rounded-[42px] bg-transparent px-4 py-2.5 text-base font-semibold leading-6 tracking-[-0.25px] transition-colors duration-300 ease-out motion-reduce:transition-none",
              selected
                ? "text-brand-ink"
                : "text-brand-ink/45 hover:text-brand-ink/70"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function RecentlyVerifiedFees({ fees }: RecentlyVerifiedFeesProps) {
  const [activeTab, setActiveTab] = useState<RecentFeeTab>("all");
  const rows = filterRecentFees(fees, activeTab, RECENT_FEES_LIMIT);

  return (
    <section className="bg-brand-lime-light px-4 py-16 sm:px-10 sm:py-[62px] lg:px-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-medium tracking-[-0.04em] text-brand-ink sm:text-[32px] lg:text-[38px]">
            Recently verified fees
          </h2>
          <p className="mt-2 text-base tracking-[-0.02em] text-brand-ink/80 sm:text-lg">
            First-year totals reviewed and dated. Click any record for the full
            breakdown.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-6">
          <OwnershipTabs activeTab={activeTab} onChange={setActiveTab} />

          <div
            key={activeTab}
            role="tabpanel"
            className="w-full animate-hero-rise motion-reduce:animate-none"
          >
            <FeesTable rows={rows} />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/schools"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 rounded-[14px] bg-white px-7 text-lg tracking-[-0.02em] text-brand-ink shadow-[0_4px_6px_rgba(0,0,0,0.12)]"
            )}
          >
            View all school fees
          </Link>
        </div>
      </div>
    </section>
  );
}
