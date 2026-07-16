import type { Metadata } from "next";
import Link from "next/link";
import { Building2, FileText, Inbox, CheckCircle } from "lucide-react";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

export const metadata: Metadata = { title: "Admin Dashboard | SchoolCost NG" };

export default async function AdminDashboardPage() {
  // TODO: fetch real stats from Supabase
  const stats = {
    institutions: 0,
    published_records: 0,
    pending_submissions: 0,
    approved_this_week: 0,
  };

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">Overview</h1>
        <p className="text-sm text-gray-500">
          Manage institutions, fee records, and submission queue.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          label="Active Institutions"
          value={stats.institutions}
          icon={Building2}
        />
        <AdminStatCard
          label="Published Fee Records"
          value={stats.published_records}
          icon={FileText}
          variant="success"
        />
        <AdminStatCard
          label="Pending Submissions"
          value={stats.pending_submissions}
          icon={Inbox}
          variant={stats.pending_submissions > 0 ? "warning" : "default"}
          note={stats.pending_submissions > 0 ? "Needs review" : undefined}
        />
        <AdminStatCard
          label="Approved This Week"
          value={stats.approved_this_week}
          icon={CheckCircle}
          variant="success"
        />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            href: "/admin/institutions/new",
            label: "Add Institution",
            description: "Add a new school to the database",
            icon: Building2,
          },
          {
            href: "/admin/fees/new",
            label: "Add Fee Record",
            description: "Publish verified fee data for a course",
            icon: FileText,
          },
          {
            href: "/admin/submissions",
            label: "Review Submissions",
            description: "Moderate community-submitted fee data",
            icon: Inbox,
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-start gap-3 border border-gray-200 rounded-lg p-4 bg-white hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center shrink-0 transition-colors">
              <item.icon className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
                {item.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
