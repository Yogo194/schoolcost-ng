import Link from "next/link";

const FOOTER_SECTIONS = [
  {
    title: "Product",
    links: [
      { href: "/schools", label: "Schools" },
      { href: "/compare", label: "Compare" },
      { href: "/how-it-works", label: "How It Works" },
    ],
  },
  {
    title: "Contribute",
    links: [
      { href: "/submit-fees", label: "Submit Fees" },
      { href: "/suggest-school", label: "Suggest a School" },
      { href: "/submit-correction", label: "Report an Error" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-brand-footer text-white">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-10 sm:py-20 lg:px-20 lg:pt-[100px] lg:pb-12">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="flex max-w-[318px] flex-col gap-6">
            <Link
              href="/"
              className="group flex w-fit items-center gap-2 transition-opacity hover:opacity-80"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/icon-logo.svg"
                alt=""
                width={18}
                height={24}
                className="h-6 w-[18px] shrink-0"
              />
              <span className="text-base font-medium leading-[1.2] tracking-[-0.02em]">
                SchoolCost
              </span>
            </Link>
            <p className="text-base leading-[1.4] tracking-[-0.02em] text-white/80">
              Verified, course-specific tertiary school fees in Nigeria, with
              the source and review date shown on every record.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:w-[692px] lg:shrink-0">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title} className="flex flex-col gap-3">
                <p className="text-base font-medium leading-[1.4] tracking-[-0.02em]">
                  {section.title}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-base leading-[1.4] tracking-[-0.02em] text-white/75 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8 lg:mt-[86px]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <p className="shrink-0 text-sm leading-[1.4] tracking-[-0.02em] text-white/90">
              © {year} SchoolCost NG. All rights reserved.
            </p>
            <p className="max-w-2xl text-sm leading-[1.5] tracking-[-0.02em] text-white/50 sm:text-right">
              SchoolCost NG provides education-cost information for comparison
              and planning. Fees may change without notice. Confirm final
              amounts directly with the institution before making any payment.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
