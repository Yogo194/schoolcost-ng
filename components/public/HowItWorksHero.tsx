import { LogoMarquee } from "@/components/public/LogoMarquee";
import { UNIVERSITY_LOGOS } from "@/components/public/university-logos";

export function HowItWorksHero() {
  return (
    <section className="relative isolate flex min-h-[90svh] flex-col overflow-hidden bg-white sm:h-[90vh] sm:min-h-[560px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/figma/how-it-works/hero-bg.jpg"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[729px] flex-1 flex-col items-center justify-center px-4 pb-4 pt-28 text-center sm:px-10 sm:pt-32">
        <div className="relative flex w-full flex-col items-center gap-[18px]">
          <span className="inline-flex h-8 items-center justify-center rounded-lg border border-brand-amber bg-white px-3 text-base font-medium tracking-[-0.02em] text-brand-ink">
            Trust &amp; verification
          </span>
          <h1 className="relative text-[2.5rem] font-medium leading-[1.1] tracking-[-0.04em] text-brand-ink sm:whitespace-nowrap sm:text-[clamp(1.75rem,6.8vw,3.75rem)] sm:leading-none">
            How we verify school fees
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/how-it-works/deco-sparkle.svg"
              alt=""
              width={40}
              height={40}
              className="pointer-events-none absolute -right-8 top-1 hidden size-8 sm:-right-10 sm:block sm:size-10 lg:-right-14 lg:top-2"
              aria-hidden
            />
          </h1>
        </div>

        <p className="mt-3.5 max-w-[729px] text-base leading-[1.4] tracking-[-0.02em] text-brand-ink/80 sm:text-lg">
          Every fee on SchoolCost NG is collected from an official or community
          source, checked, and clearly labelled before it&apos;s published so
          you see not just the amount, but where it came from and how far to
          trust it.
        </p>

        <div className="mt-8 w-full max-w-[720px] sm:mt-10">
          <p className="mb-5 text-center text-sm uppercase tracking-[0.5px] text-brand-ink sm:text-base">
            Verified fee data from schools across Nigeria
          </p>
          <LogoMarquee logos={UNIVERSITY_LOGOS} fadeFrom="#ffffff" />
        </div>
      </div>

      {/* Verification illustration pinned to the bottom, same pattern as homepage/schools skyline */}
      <div className="relative z-0 -mb-px w-full shrink-0 leading-none">
        {/* Mobile: static but zoomed in, showing a center crop of the illustration */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/how-it-works/hero-illustration-v2.webp"
          alt=""
          width={2400}
          height={497}
          className="block h-44 w-full object-cover object-[center_bottom] sm:hidden"
          aria-hidden
        />

        {/* Tablet/desktop: static full width */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/how-it-works/hero-illustration-v2.webp"
          alt=""
          width={2400}
          height={497}
          className="hidden h-auto w-full object-contain object-bottom sm:block"
          aria-hidden
        />
      </div>
    </section>
  );
}
