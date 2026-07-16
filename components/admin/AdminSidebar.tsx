"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Inbox,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/institutions", label: "Institutions", icon: Building2 },
  { href: "/admin/fees", label: "Fee Records", icon: FileText },
  { href: "/admin/submissions", label: "Submissions", icon: Inbox },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2 h-16 px-5 border-b border-gray-200">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-gray-900 text-[14px]">
          SchoolCost<span className="text-primary">NG</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-100">
        <Link
          href="/"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
