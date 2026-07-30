import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  ExternalLink,
  Globe,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { Check } from "lucide-react";
import type { SchoolProfile } from "@/lib/mock/school-profile";
import { INSTITUTION_TYPE_LABELS, OWNERSHIP_TYPE_LABELS } from "@/types/institution";
import { cn } from "@/lib/utils";

const SOURCE_BADGE = {
  official: {
    label: "Official source",
    className: "border border-[#166d3e]/18 bg-white/82 text-[#166d3e] shadow-[0_1px_0_rgba(3,48,42,0.08)]",
  },
  community: {
    label: "Community reported",
    className: "bg-[#fbf2cb] text-[#c8811a]",
  },
  student: {
    label: "Student evidence",
    className: "bg-[#f6f7f9] text-[#24292e]",
  },
} as const;

interface SchoolProfileHeroProps {
  school: SchoolProfile;
}

export function SchoolProfileHero({ school }: SchoolProfileHeroProps) {
  const badge = SOURCE_BADGE[school.source_badge];
  const isLongName = school.name.length > 42;
  const typeLine = [
    `${OWNERSHIP_TYPE_LABELS[school.ownership_type]} ${INSTITUTION_TYPE_LABELS[
      school.institution_type
    ].toLowerCase()}`,
    school.ownership_type === "private" ? "Private" : "Public",
  ].join(" · ");

  return (
    <section className="relative overflow-hidden bg-brand-lime">
      {/* Soft grid wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(3,48,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(3,48,42,0.04) 1px, transparent 1px)",
          backgroundSize: "105px 105px",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-[1280px] flex-col items-center px-4 pb-24 pt-28 text-center sm:px-10 sm:pb-28 sm:pt-32 lg:px-20 lg:pb-28 lg:pt-[140px]">
        {/* next/image, not a raw img: the source crests are up to 1.4MB each
            and were being served in full for a 120px render. */}
        <Image
          src={school.logo_url}
          alt={`${school.name} crest`}
          width={120}
          height={120}
          priority
          className="size-[100px] rounded-full object-contain sm:size-[120px]"
        />

        <span
          className={cn(
            "mt-5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium",
            badge.className
          )}
        >
          <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
          {badge.label}
        </span>

        <h1
          className={cn(
            "mt-4 mx-auto max-w-[1120px] text-balance font-medium leading-[0.98] tracking-[-0.04em] text-brand-ink",
            isLongName
              ? "text-[2.15rem] sm:text-[44px] lg:text-[52px]"
              : "text-[2.5rem] sm:text-5xl lg:text-[56px]"
          )}
        >
          {school.name}
        </h1>

        <div className="mt-5 flex max-w-4xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-base tracking-[-0.02em] text-brand-ink/80 sm:text-lg">
          <span className="inline-flex items-center gap-1.5">
            <Building2 className="size-4 shrink-0 opacity-70" aria-hidden />
            {school.abbreviation}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4 shrink-0 opacity-70" aria-hidden />
            {school.city}, {school.state} State
          </span>
          <span className="inline-flex items-center gap-1.5">
            <GraduationCap className="size-4 shrink-0 opacity-70" aria-hidden />
            {typeLine}
          </span>
          <Link
            href={school.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 underline decoration-brand-ink/30 underline-offset-4 transition-colors hover:text-brand-ink hover:decoration-brand-ink"
          >
            <Globe className="size-4 shrink-0 opacity-70" aria-hidden />
            {school.website_label}
            <ExternalLink className="size-3.5 shrink-0 opacity-60" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
