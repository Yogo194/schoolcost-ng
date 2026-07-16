export function SchoolsSearchHero() {
  return (
    <section className="relative isolate flex h-[60vh] min-h-[420px] flex-col overflow-hidden bg-brand-lime">
      {/* Full-bleed hero background (grid wash) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/figma/schools-hero-bg.jpg"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden
      />

      {/* Center copy */}
      <div className="relative z-10 mx-auto flex w-full max-w-[920px] flex-1 flex-col items-center justify-center px-4 pb-8 pt-28 text-center sm:px-10 sm:pt-32 lg:pt-[120px]">
        <h1 className="text-[2.5rem] font-medium leading-none tracking-[-0.04em] text-brand-ink sm:text-5xl lg:text-[60px]">
          Find any school&apos;s fees.
        </h1>
        <p className="mt-4 max-w-[720px] text-base tracking-[-0.02em] text-brand-ink/75 sm:text-lg">
          Search by school, course, or state to see exactly what you&apos;ll
          pay.
        </p>
      </div>

      {/* Campus strip pinned to the bottom of the hero, same pattern as homepage */}
      <div className="relative z-0 w-full shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/schools-listing-skyline.avif"
          alt=""
          width={2880}
          height={528}
          className="h-auto w-full object-contain object-bottom"
          aria-hidden
        />
      </div>
    </section>
  );
}
