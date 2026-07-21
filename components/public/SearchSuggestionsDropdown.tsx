"use client";

import type { ComponentType, CSSProperties, RefObject } from "react";
import { createPortal } from "react-dom";
import {
  BookOpen,
  GraduationCap,
  Loader2,
  MapPin,
  Search,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SearchSuggestion, SearchSuggestionKind } from "@/lib/search/types";

const KIND_LABELS: Record<SearchSuggestionKind, string> = {
  school: "School",
  course: "Course",
  state: "State",
};

const KIND_ICONS: Record<
  SearchSuggestionKind,
  ComponentType<{ className?: string }>
> = {
  school: GraduationCap,
  course: BookOpen,
  state: MapPin,
};

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const needle = query.trim();
  if (!needle) return <>{text}</>;

  const lowerText = text.toLowerCase();
  const lowerNeedle = needle.toLowerCase();
  const index = lowerText.indexOf(lowerNeedle);

  if (index === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded-sm bg-brand-lime/70 px-0.5 text-brand-ink">
        {text.slice(index, index + needle.length)}
      </mark>
      {text.slice(index + needle.length)}
    </>
  );
}

interface SearchSuggestionsDropdownProps {
  query: string;
  suggestions: SearchSuggestion[];
  activeIndex: number;
  isLoading: boolean;
  isOpen: boolean;
  listboxId: string;
  variant?: "hero" | "default";
  anchorRect?: DOMRect | null;
  usePortal?: boolean;
  panelRef?: RefObject<HTMLDivElement | null>;
  onSelect: (index: number) => void;
  onHover: (index: number) => void;
}

export function SearchSuggestionsDropdown({
  query,
  suggestions,
  activeIndex,
  isLoading,
  isOpen,
  listboxId,
  variant = "default",
  anchorRect,
  usePortal = false,
  panelRef,
  onSelect,
  onHover,
}: SearchSuggestionsDropdownProps) {
  if (!isOpen) return null;

  const showEmpty =
    !isLoading && suggestions.length === 0 && query.trim().length >= 2;
  const showPanel = isLoading || suggestions.length > 0 || showEmpty;

  if (!showPanel) return null;

  const portalStyle: CSSProperties | undefined =
    usePortal && anchorRect
      ? {
          top: anchorRect.bottom + 8,
          left: anchorRect.left,
          width: anchorRect.width,
        }
      : undefined;

  const panel = (
    <div
      ref={panelRef}
      className={cn(
        "overflow-hidden rounded-2xl border border-[#e5ebe5] bg-white shadow-[0_20px_50px_rgba(3,48,42,0.16)]",
        usePortal
          ? "fixed z-[200]"
          : cn(
              "absolute left-0 right-0 z-50",
              variant === "hero" ? "top-[calc(100%+8px)]" : "top-[calc(100%+6px)]"
            )
      )}
      style={portalStyle}
    >
      {isLoading && suggestions.length === 0 ? (
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-brand-ink/60">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Searching...
        </div>
      ) : showEmpty ? (
        <div className="px-4 py-4">
          <p className="text-sm font-medium text-brand-ink">No matches yet</p>
          <p className="mt-1 text-sm text-brand-ink/60">
            Press Enter to search for &ldquo;{query.trim()}&rdquo;, or suggest a
            school if it is missing.
          </p>
        </div>
      ) : (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Search suggestions"
          className="max-h-[min(320px,42vh)] overflow-y-auto py-1.5"
        >
          {suggestions.map((item, index) => {
            const Icon = KIND_ICONS[item.kind];
            const isActive = index === activeIndex;

            return (
              <li key={item.id} role="presentation">
                <Link
                  id={`${listboxId}-option-${index}`}
                  href={item.href}
                  role="option"
                  aria-selected={isActive}
                  onMouseEnter={() => onHover(index)}
                  onClick={() => onSelect(index)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 transition-colors",
                    isActive ? "bg-brand-lime-light" : "hover:bg-brand-lime-light/70"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-xl",
                      item.kind === "school" && "bg-emerald-50 text-emerald-700",
                      item.kind === "course" && "bg-blue-50 text-blue-700",
                      item.kind === "state" && "bg-amber-50 text-amber-700"
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block truncate text-sm font-medium text-brand-ink">
                      <HighlightMatch text={item.label} query={query} />
                    </span>
                    {item.meta && (
                      <span className="mt-0.5 block truncate text-xs text-brand-ink/60">
                        {item.meta}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 rounded-full bg-brand-ink/[0.06] px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.04em] text-brand-ink/55">
                    {KIND_LABELS[item.kind]}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {!isLoading && suggestions.length > 0 && (
        <div className="flex items-center justify-between border-t border-[#e5ebe5] bg-[#fcffe7]/80 px-3 py-2 text-[11px] text-brand-ink/55">
          <span className="inline-flex items-center gap-1">
            <Search className="size-3" aria-hidden />
            {suggestions.length} suggestion{suggestions.length === 1 ? "" : "s"}
          </span>
          <span>Use ↑ ↓ and Enter</span>
        </div>
      )}
    </div>
  );

  if (usePortal && typeof document !== "undefined") {
    return createPortal(panel, document.body);
  }

  return panel;
}
