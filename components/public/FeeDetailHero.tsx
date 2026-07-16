import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { FeeDetailRecord } from "@/lib/mock/fee-detail";

interface FeeDetailHeroProps {
  record: FeeDetailRecord;
}

export function FeeDetailHero({ record }: FeeDetailHeroProps) {
  return (
    <section className="relative overflow-hidden bg-brand-lime">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(3,48,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(3,48,42,0.04) 1px, transparent 1px)",
          backgroundSize: "105px 105px",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-[900px] flex-col items-center px-4 pb-16 pt-28 text-center sm:px-10 sm:pb-20 sm:pt-32 lg:px-20 lg:pb-[70px] lg:pt-[130px]">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-[0.08em] text-brand-ink/55"
        >
          <Link href="/schools" className="transition-colors hover:text-brand-ink">
            Schools
          </Link>
          <ChevronRight className="size-3.5 opacity-50" aria-hidden />
          <Link
            href={`/schools/${record.schoolSlug}`}
            className="transition-colors hover:text-brand-ink"
          >
            {record.schoolName}
          </Link>
          <ChevronRight className="size-3.5 opacity-50" aria-hidden />
          <span className="rounded-full bg-white px-2.5 py-1 text-brand-ink">
            {record.course}
          </span>
        </nav>

        <h1 className="mt-5 text-[2.5rem] font-medium leading-none tracking-[-0.04em] text-brand-ink sm:text-5xl lg:text-[60px]">
          {record.course}
        </h1>
      </div>
    </section>
  );
}
