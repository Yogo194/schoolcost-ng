import { SkylineMarquee } from "@/components/public/SkylineMarquee";

export function SchoolsSearchHero() {
  return (
    <section className="relative isolate flex h-[48vh] min-h-[360px] flex-col overflow-hidden bg-brand-lime sm:h-[60vh] sm:min-h-[420px]">
      {/* Full-bleed hero background (grid wash) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/figma/schools-hero-bg.jpg"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden
      />

      {/* Copy sits just above the skyline on mobile; centered on larger screens */}
      <div className="relative z-10 mx-auto flex w-full max-w-[920px] flex-1 flex-col items-center justify-end px-4 pb-3 pt-28 text-center sm:justify-center sm:px-10 sm:pb-8 sm:pt-32 lg:pt-[120px]">
        <h1 className="text-[2.5rem] font-medium leading-none tracking-[-0.04em] text-brand-ink sm:text-5xl lg:text-[60px]">
          Find any school&apos;s fees.
        </h1>
        <p className="mt-4 max-w-[720px] text-base tracking-[-0.02em] text-brand-ink/75 sm:text-lg">
          Search by school, course, or state to see exactly what you&apos;ll
          pay.
        </p>
      </div>

      {/* Campus strip pinned to the bottom of the hero, same pattern as homepage */}
      <div className="relative z-0 -mb-px w-full shrink-0 leading-none">
        <SkylineMarquee
          src="/figma/schools-listing-skyline.webp"
          frameHeightClass="h-40"
          className="sm:hidden"
        />

        {/* Tablet/desktop: static full width (WebP: reliable in Firefox + Chrome) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/schools-listing-skyline.webp"
          alt=""
          width={2880}
          height={528}
          className="hidden h-auto w-full object-contain object-bottom sm:block"
          aria-hidden
        />
      </div>
    </section>
  );
}
