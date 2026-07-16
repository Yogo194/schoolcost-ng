export function SchoolsSearchHero() {
  return (
    <section className="relative isolate flex h-[48vh] min-h-[360px] flex-col overflow-hidden bg-brand-lime">
      {/* Full-bleed hero background (grid wash) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/figma/schools-hero-bg.jpg"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden
      />

      {/* Center copy */}
      <div className="relative z-10 mx-auto flex w-full max-w-[920px] flex-1 flex-col items-center justify-center px-4 pb-8 pt-24 text-center sm:px-10 sm:pt-28 lg:pt-24">
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
        {/* Mobile: taller, slow auto-scrolling strip so buildings stay legible on narrow screens */}
        <div className="overflow-hidden sm:hidden">
          <div className="flex w-max animate-skyline-marquee items-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/schools-listing-skyline.avif"
              alt=""
              className="h-40 w-auto shrink-0 object-cover object-bottom"
              aria-hidden
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/schools-listing-skyline.avif"
              alt=""
              className="h-40 w-auto shrink-0 object-cover object-bottom"
              aria-hidden
            />
          </div>
        </div>

        {/* Tablet/desktop: static full width, matches the design as approved */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/schools-listing-skyline.avif"
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
