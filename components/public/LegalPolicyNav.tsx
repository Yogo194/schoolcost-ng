"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LegalPolicyNavProps {
  sections: readonly { id: string; label: string }[];
  navLabel?: string;
}

export function LegalPolicyNav({
  sections,
  navLabel = "Page sections",
}: LegalPolicyNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const sectionElements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 }
    );

    sectionElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sections]);

  function scrollToSection(
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const target = document.getElementById(sectionId);
    if (!target) return;

    event.preventDefault();
    setActiveId(sectionId);
    window.history.replaceState(null, "", `#${sectionId}`);
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }

  return (
    <nav aria-label={navLabel} className="mt-5 min-w-0">
      <ul className="flex max-w-full gap-x-4 gap-y-2 overflow-x-auto pb-1 text-sm [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-col lg:gap-2 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => (
          <li key={section.id} className="shrink-0">
            <a
              href={`#${section.id}`}
              aria-current={activeId === section.id ? "location" : undefined}
              onClick={(event) => scrollToSection(event, section.id)}
              className={cn(
                "transition-[color,font-weight] duration-200 focus-visible:outline-none",
                activeId === section.id
                  ? "font-semibold text-brand-ink"
                  : "font-normal text-brand-ink/60 hover:text-brand-green focus-visible:text-brand-green"
              )}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
