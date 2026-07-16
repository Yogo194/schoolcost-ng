"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AnnouncementBar } from "@/components/public/AnnouncementBar";

const NAV_LINKS = [
  { href: "/schools", label: "Schools" },
  { href: "/compare", label: "Compare" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/submit-fees", label: "Submit Fees" },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isSchoolProfile = /^\/schools\/[^/]+$/.test(pathname);
  const isFeeDetail = /^\/schools\/[^/]+\/fees\//.test(pathname);
  const overlayNav = isHome || isSchoolProfile || isFeeDetail;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "z-50 w-full",
        overlayNav
          ? "absolute inset-x-0 top-0"
          : "sticky top-0 border-b border-gray-200 bg-white/90 backdrop-blur-md"
      )}
    >
      {isHome && <AnnouncementBar />}

      <div
        className={cn(
          "mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-5 sm:px-10 lg:px-20",
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
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className={cn(
            "border-t md:hidden",
            overlayNav
              ? "border-brand-ink/10 bg-brand-lime"
              : "border-gray-100 bg-white"
          )}
        >
          <nav className="mx-auto flex max-w-[1440px] flex-col gap-1 px-4 py-3 sm:px-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : overlayNav
                      ? "text-brand-ink hover:bg-brand-ink/5"
                      : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/schools"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex h-12 items-center justify-center gap-2.5 rounded-[14px] bg-[#166D3E] px-7 text-lg font-medium leading-[1.2] tracking-[-0.02em] text-white shadow-[0_5px_12px_0_rgba(22,109,62,0.48)] transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-0.5 hover:bg-[#145f36]"
            >
              Find a school
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
