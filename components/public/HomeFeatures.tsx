import Link from "next/link";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    image: "/figma/feature-compare.png",
    title: "Compare schools",
    description:
      "Compare compulsory fees, accommodation and estimated degree costs side by side.",
    href: "/compare",
  },
  {
    image: "/figma/feature-budget.png",
    title: "Find schools within your budget",
    description:
      "Use the affordability calculator to discover suitable schools.",
    href: "/schools",
  },
  {
    image: "/figma/feature-submit.png",
    title: "Know a fee we are missing?",
    description:
      "Share updated fees or missing charges with supporting evidence.",
    href: "/submit-fees",
  },
] as const;

export function HomeFeatures() {
  return (
    <section className="bg-white px-4 py-16 sm:px-10 sm:py-[100px] lg:px-20">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-2.5">
        {FEATURES.map((feature) => (
          <Link
            key={feature.title}
            href={feature.href}
            className="group flex flex-col items-center gap-8 px-6 text-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={feature.image}
              alt=""
              width={62}
              height={62}
              className="size-[62px] shrink-0"
              aria-hidden
            />

            <div className="flex flex-col gap-4">
              <h3
                className={cn(
                  "text-[28px] font-medium leading-none tracking-[-0.04em] text-brand-ink/80",
                  "transition-colors group-hover:text-brand-ink"
                )}
              >
                {feature.title}
              </h3>
              <p className="text-lg leading-[1.5] tracking-[-0.02em] text-brand-ink/80">
                {feature.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
