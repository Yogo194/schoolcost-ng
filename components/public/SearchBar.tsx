"use client";

import { ArrowUp, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { SearchSuggestionsDropdown } from "@/components/public/SearchSuggestionsDropdown";
import {
  SEARCH_DEBOUNCE_MS,
  SEARCH_MIN_CHARS,
  type SearchSuggestion,
  type SearchSuggestionsResponse,
} from "@/lib/search/types";
import { cn } from "@/lib/utils";

const suggestionCache = new Map<string, SearchSuggestion[]>();

const TYPING_PHRASES = [
  "Search for a school, course or state",
  "Babcock University tuition fees",
  "Computer Science in Lagos",
  "Nursing first-year cost",
  "Compare Covenant and UNILAG",
] as const;

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  size?: "default" | "lg";
  /** Example search terms shown as clickable chips below the input (size="lg" only). */
  suggestions?: string[];
  /** Phrases to cycle with a typing animation when the input is empty (size="lg" only). */
  typingPhrases?: readonly string[];
  /** Fires when the suggestions panel opens or closes. */
  onSuggestionsOpenChange?: (open: boolean) => void;
}

export function SearchBar({
  placeholder = "Search for a school, course or state",
  defaultValue = "",
  className,
  size = "default",
  suggestions,
  typingPhrases = TYPING_PHRASES,
  onSuggestionsOpenChange,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(
    defaultValue || searchParams.get("q") || ""
  );
  const [typed, setTyped] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [results, setResults] = useState<SearchSuggestion[]>([]);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  const isEmpty = value.length === 0;
  const activePhrase =
    typingPhrases[phraseIndex % typingPhrases.length] ?? placeholder;
  const trimmed = value.trim();
  const canSuggest = trimmed.length >= SEARCH_MIN_CHARS;
  const suggestionsOpen = isOpen && canSuggest;

  const updateAnchor = useCallback(() => {
    if (!rootRef.current) return;
    setAnchorRect(rootRef.current.getBoundingClientRect());
  }, []);

  useLayoutEffect(() => {
    if (!suggestionsOpen) {
      setAnchorRect(null);
      return;
    }

    updateAnchor();

    window.addEventListener("resize", updateAnchor);
    window.addEventListener("scroll", updateAnchor, true);

    return () => {
      window.removeEventListener("resize", updateAnchor);
      window.removeEventListener("scroll", updateAnchor, true);
    };
  }, [suggestionsOpen, updateAnchor, results.length, isLoading]);

  useEffect(() => {
    onSuggestionsOpenChange?.(suggestionsOpen);
  }, [onSuggestionsOpenChange, suggestionsOpen]);

  useEffect(() => {
    return () => onSuggestionsOpenChange?.(false);
  }, [onSuggestionsOpenChange]);

  useEffect(() => {
    if (size !== "lg" || !isEmpty) return;

    const atFull = typed === activePhrase;
    const atEmpty = typed.length === 0;

    let delay = isDeleting ? 32 : 55;
    if (atFull && !isDeleting) delay = 1600;
    if (atEmpty && isDeleting) delay = 400;

    const timer = window.setTimeout(() => {
      if (!isDeleting && atFull) {
        setIsDeleting(true);
        return;
      }
      if (isDeleting && atEmpty) {
        setIsDeleting(false);
        setPhraseIndex((i) => (i + 1) % typingPhrases.length);
        return;
      }
      const nextLen = typed.length + (isDeleting ? -1 : 1);
      setTyped(activePhrase.slice(0, nextLen));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [activePhrase, isDeleting, isEmpty, size, typed, typingPhrases.length]);

  useEffect(() => {
    if (!isEmpty) {
      setTyped("");
      setIsDeleting(false);
    }
  }, [isEmpty]);

  useEffect(() => {
    if (!canSuggest) {
      setResults([]);
      setIsLoading(false);
      setActiveIndex(-1);
      return;
    }

    const controller = new AbortController();
    const cached = suggestionCache.get(trimmed.toLowerCase());
    if (cached) {
      setResults(cached);
      setActiveIndex(cached.length > 0 ? 0 : -1);
      setIsLoading(false);
      return () => controller.abort();
    }

    setIsLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Suggestions failed");
        const data = (await res.json()) as SearchSuggestionsResponse;
        suggestionCache.set(trimmed.toLowerCase(), data.suggestions);
        setResults(data.suggestions);
        setActiveIndex(data.suggestions.length > 0 ? 0 : -1);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setResults([]);
          setActiveIndex(-1);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [canSuggest, trimmed]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        !rootRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const submitQuery = useCallback(
    (q: string) => {
      const next = q.trim();
      if (!next) return;
      setIsOpen(false);
      router.push(`/schools?q=${encodeURIComponent(next)}`);
    },
    [router]
  );

  const selectSuggestion = useCallback(
    (index: number) => {
      const item = results[index];
      if (!item) {
        submitQuery(value);
        return;
      }
      setIsOpen(false);
      router.push(item.href);
    },
    [results, router, submitQuery, value]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (activeIndex >= 0 && results[activeIndex]) {
      selectSuggestion(activeIndex);
      return;
    }
    submitQuery(value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      if (canSuggest) setIsOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (results.length === 0) return;
      setActiveIndex((i) => (i + 1) % results.length);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length === 0) return;
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      e.preventDefault();
      selectSuggestion(activeIndex);
    }
  }

  const dropdown = (
    <SearchSuggestionsDropdown
      query={value}
      suggestions={results}
      activeIndex={activeIndex}
      isLoading={isLoading}
      isOpen={suggestionsOpen}
      listboxId={listboxId}
      variant={size === "lg" ? "hero" : "default"}
      anchorRect={anchorRect}
      usePortal={size === "lg"}
      panelRef={dropdownRef}
      onSelect={selectSuggestion}
      onHover={setActiveIndex}
    />
  );

  if (size === "lg") {
    return (
      <div ref={rootRef} className={cn("relative w-full max-w-[624px]", className)}>
        <form onSubmit={handleSubmit} role="search">
          <div className="flex flex-col gap-2.5 rounded-[18px] bg-black/24 px-1.5 pb-2.5 pt-1.5 backdrop-blur-[30px] transition-[box-shadow,transform] duration-300 ease-out focus-within:shadow-[0_12px_40px_rgba(3,48,42,0.14)]">
            <div className="flex w-full flex-col gap-0.5 rounded-xl bg-white p-3 shadow-[0_16px_12px_rgba(0,0,0,0.04)] transition-shadow duration-300 focus-within:shadow-[0_18px_28px_rgba(0,0,0,0.08)]">
              <div className="flex w-full items-center gap-2.5 pl-1">
                <Search className="size-4 shrink-0 text-brand-ink/70" aria-hidden />
                <div className="relative min-h-6 flex-1">
                  {isEmpty && !isOpen && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 flex items-center text-base leading-[1.4] tracking-[-0.02em] text-brand-ink/80"
                    >
                      {typed}
                      <span className="ml-0.5 inline-block h-4 w-[1.5px] animate-pulse bg-brand-ink/70" />
                    </span>
                  )}
                  <input
                    ref={inputRef}
                    type="search"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      setIsOpen(true);
                    }}
                    onFocus={() => {
                      if (canSuggest) setIsOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder=""
                    role="combobox"
                    aria-expanded={suggestionsOpen}
                    aria-controls={listboxId}
                    aria-autocomplete="list"
                    aria-activedescendant={
                      activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
                    }
                    className="w-full bg-transparent py-0 text-base leading-[1.4] tracking-[-0.02em] text-brand-ink outline-none"
                    aria-label="Search for a school, course or state"
                  />
                </div>
              </div>

              <div className="flex w-full items-center justify-end pl-1">
                <button
                  type="submit"
                  className="flex size-8 shrink-0 items-center justify-center rounded-[7px] bg-black text-white transition-[transform,background-color] duration-200 hover:scale-105 hover:bg-black/80 active:scale-95"
                  aria-label="Search"
                >
                  <ArrowUp className="size-5" strokeWidth={2.25} />
                </button>
              </div>
            </div>

            {suggestions && suggestions.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <span className="shrink-0 text-xs font-medium tracking-[-0.2px] text-white">
                  Try:
                </span>
                {suggestions.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => submitQuery(term)}
                    className="inline-flex h-5 shrink-0 items-center justify-center rounded bg-white/[0.89] px-1.5 text-[13px] tracking-[-0.02em] text-brand-ink/80 transition-[transform,background-color,color] duration-200 hover:-translate-y-px hover:bg-white hover:text-brand-ink active:translate-y-0"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
          </div>
        </form>
        {dropdown}
      </div>
    );
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} role="search">
        <div className="flex items-center rounded-lg border border-gray-300 bg-white transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <Search className="ml-3 size-4 shrink-0 text-gray-400" />
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (canSuggest) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            role="combobox"
            aria-expanded={suggestionsOpen}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
            }
            className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400"
            aria-label="Search"
          />
          <button
            type="submit"
            className="mr-1.5 shrink-0 rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            Search
          </button>
        </div>
      </form>
      {dropdown}
    </div>
  );
}
