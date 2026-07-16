import Link from "next/link";

export function SchoolSubmitCta() {
  return (
    <section className="relative overflow-hidden bg-brand-lime">
      {/* Amber-tint grid, Figma CTA 15:3220 */}
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

      <div className="relative z-10 mx-auto flex max-w-[640px] flex-col items-center gap-3.5 px-4 py-16 text-center sm:px-10 sm:py-[100px]">
        <h2 className="relative max-w-[635px] text-[2rem] font-medium leading-[1.2] tracking-[-0.04em] text-brand-ink sm:text-[44px]">
          Know a{" "}
          <span className="relative inline-block">
            fee we&apos;re
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/school-cta-underline.svg"
              alt=""
              width={143}
              height={7}
              className="pointer-events-none absolute left-1/2 top-[92%] w-[110%] max-w-none -translate-x-1/2 -rotate-[2deg]"
              aria-hidden
            />
          </span>{" "}
          missing?
        </h2>

        <p className="max-w-[542px] text-base leading-[1.4] tracking-[-0.02em] text-brand-ink/80 sm:text-lg">
          Share updated or missing charges with evidence.
        </p>

        <div className="mt-2">
          <Link
            href="/submit-fees"
            className="inline-flex h-12 items-center justify-center gap-2.5 rounded-[14px] bg-white pl-6 pr-7 text-lg font-medium leading-[1.2] tracking-[-0.02em] text-brand-ink shadow-[0_4px_6px_rgba(0,0,0,0.12)] transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] active:translate-y-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/school-cta-play.svg"
              alt=""
              width={16}
              height={16}
              className="size-4 shrink-0"
              aria-hidden
            />
            Submit a fee update
          </Link>
        </div>
      </div>
    </section>
  );
}
