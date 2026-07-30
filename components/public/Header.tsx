"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AnnouncementBar } from "@/components/public/AnnouncementBar";

const NAV_LINKS = [
  { href: "/schools", label: "Schools" },
  { href: "/compare", label: "Compare" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/submit-fees", label: "Contribute" },
];

export function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const isHome = pathname === "/";
  const isSchoolsIndex = pathname === "/schools";
  const isCompare = pathname === "/compare";
  const isHowItWorks = pathname === "/how-it-works";
  const isSchoolProfile = /^\/schools\/[^/]+$/.test(pathname);
  const isFeeDetail = /^\/schools\/[^/]+\/fees\//.test(pathname);
  const overlayNav =
    isHome ||
    isSchoolsIndex ||
    isCompare ||
    isSchoolProfile ||
    isFeeDetail ||
    isHowItWorks;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMenuMounted, setMobileMenuMounted] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setHasScrolled(window.scrollY > 12);

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const setHeaderHeight = () => {
      document.documentElement.style.setProperty(
        "--public-header-height",
        `${header.getBoundingClientRect().height}px`
      );
    };

    setHeaderHeight();
    const observer = new ResizeObserver(setHeaderHeight);
    observer.observe(header);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--public-header-height");
    };
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      setMobileMenuMounted(true);
      return;
    }

    const timeout = window.setTimeout(() => setMobileMenuMounted(false), 220);
    return () => window.clearTimeout(timeout);
  }, [mobileOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full transition-[background-color,border-color,box-shadow] duration-300 ease-out",
          hasScrolled
            ? "border-b border-white/60 bg-white/72 shadow-[0_12px_34px_rgba(3,48,42,0.10)] backdrop-blur-xl backdrop-saturate-150"
            : overlayNav
              ? "bg-transparent"
              : "border-b border-gray-200 bg-white/95"
        )}
      >
        {hasScrolled && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.52),rgba(255,255,255,0.08)_48%,rgba(255,255,255,0.32))]"
          />
        )}
      {(isHome || isCompare) && <AnnouncementBar />}

      <div
        className={cn(
          "relative mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-5 sm:px-10 lg:px-20",
          !overlayNav && "h-16 py-0"
        )}
      >
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/icon-logo.svg"
            alt=""
            width={18}
            height={24}
            className="h-6 w-[18px] shrink-0 transition-transform duration-300 ease-out group-hover:scale-105"
          />
          <span
            className={cn(
              "text-base tracking-[-0.02em]",
              overlayNav
                ? "font-medium text-brand-ink"
                : "font-semibold text-gray-900"
            )}
          >
            SchoolCost&nbsp;NG
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-base tracking-[-0.02em] transition-colors duration-300",
                  "after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:rounded-full after:transition-transform after:duration-300 after:ease-out after:content-['']",
                  "hover:after:scale-x-100",
                  overlayNav
                    ? cn(
                        "text-brand-ink/80 hover:text-brand-ink after:bg-brand-ink",
                        active && "font-medium text-brand-ink after:scale-x-100"
                      )
                    : cn(
                        "font-medium text-gray-600 hover:text-gray-900 after:bg-primary",
                        active && "text-primary after:scale-x-100"
                      )
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/schools"
          className="hidden h-12 items-center justify-center gap-2.5 rounded-[14px] bg-[#166D3E] px-7 text-lg font-medium leading-[1.2] tracking-[-0.02em] text-white shadow-[0_5px_12px_0_rgba(22,109,62,0.48)] transition-[transform,box-shadow,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#145f36] hover:shadow-[0_8px_18px_0_rgba(22,109,62,0.42)] active:translate-y-0 md:inline-flex"
        >
          Find a school
        </Link>

        <button
          className={cn(
            "p-2 -mr-2 transition-colors md:hidden",
            overlayNav ? "text-brand-ink" : "text-gray-600 hover:text-gray-900"
          )}
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileMenuMounted && (
        <div
          className={cn(
            "relative overflow-hidden border-t border-brand-ink/10 bg-white transition-[max-height,opacity,transform] duration-200 ease-out md:hidden motion-reduce:transition-none",
            mobileOpen
              ? "max-h-[430px] translate-y-0 opacity-100"
              : "max-h-0 -translate-y-2 opacity-0"
          )}
        >
          <nav
            className={cn(
              "mx-auto max-w-[1440px] px-4 py-4 transition-transform duration-200 ease-out sm:px-10 motion-reduce:transition-none",
              mobileOpen ? "translate-y-0" : "-translate-y-3"
            )}
          >
            <div className="overflow-hidden rounded-[8px] border border-[#e5ebe5] bg-white">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex min-h-12 items-center justify-between gap-3 border-b border-[#edf0ed] px-4 py-3 text-[15px] tracking-[-0.02em] transition-[background-color,color,transform] last:border-b-0",
                      active
                        ? "bg-brand-lime-light font-medium text-brand-ink"
                        : "font-normal text-brand-ink/72 hover:translate-x-0.5 hover:bg-brand-lime-light/60 hover:text-brand-ink"
                    )}
                  >
                    <span>{link.label}</span>
                    <ChevronRight
                      className={cn(
                        "size-4 shrink-0 transition-transform",
                        active ? "text-brand-ink" : "text-brand-ink/32"
                      )}
                      aria-hidden
                    />
                  </Link>
                );
              })}
            </div>

            <Link
              href="/schools"
              onClick={() => setMobileOpen(false)}
              className="mt-4 flex min-h-[58px] items-center justify-between gap-4 rounded-[8px] bg-[#166D3E] px-4 text-base font-medium tracking-[-0.02em] text-white shadow-[0_8px_18px_rgba(22,109,62,0.22)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[#145f36]"
            >
              <span>
                <span className="block">Find a school</span>
                <span className="mt-0.5 block text-xs font-normal text-white/72">
                  Search fees by school, course, or state
                </span>
              </span>
              <ArrowRight className="size-4 shrink-0" aria-hidden />
            </Link>
          </nav>
        </div>
      )}
      </header>

      {!overlayNav && <div aria-hidden="true" className="h-16 shrink-0" />}
    </>
  );
}
