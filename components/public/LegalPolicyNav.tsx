"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);
  const activeSection =
    sections.find((section) => section.id === activeId) ?? sections[0];

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
    setIsOpen(false);
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
      <div className="lg:hidden">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="flex h-11 w-full items-center justify-between gap-3 rounded-[12px] border border-[#d9e0dc] bg-white px-4 text-left text-sm font-medium tracking-[-0.02em] text-brand-ink shadow-[0_1px_2px_rgba(3,48,42,0.04)]"
        >
          <span className="truncate">{activeSection?.label ?? "Sections"}</span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-brand-ink/50 transition-transform",
              isOpen && "rotate-180"
            )}
            aria-hidden
          />
        </button>

        {isOpen ? (
          <ul className="mt-2 max-h-[280px] overflow-y-auto rounded-[12px] border border-[#e5ebe5] bg-white p-1 text-sm shadow-[0_8px_24px_rgba(3,48,42,0.08)]">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={
                    activeId === section.id ? "location" : undefined
                  }
                  onClick={(event) => scrollToSection(event, section.id)}
                  className={cn(
                    "block rounded-[8px] px-3 py-2.5 transition-colors",
                    activeId === section.id
                      ? "bg-brand-lime-light font-medium text-brand-ink"
                      : "text-brand-ink/65 hover:bg-brand-lime-light/70 hover:text-brand-ink"
                  )}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <ul className="hidden text-sm lg:flex lg:flex-col lg:gap-2">
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
