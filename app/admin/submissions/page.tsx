import type { Metadata } from "next";
import { SubmissionQueue } from "@/components/admin/SubmissionQueue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SubmissionWithDetails } from "@/types/submission";

export const metadata: Metadata = { title: "Submissions | Admin" };

export default async function AdminSubmissionsPage() {
  // TODO: fetch all submissions from Supabase (service role, bypasses RLS)
  const submissions: SubmissionWithDetails[] = [];
  const pending = submissions.filter((s) => s.status === "pending" || s.status === "needs_more_evidence");
  const reviewed = submissions.filter((s) => s.status !== "pending" && s.status !== "needs_more_evidence");

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Submissions</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {pending.length} pending · {submissions.length} total
        </p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending{pending.length > 0 && ` (${pending.length})`}
          </TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-4">
          <SubmissionQueue submissions={pending} />
        </TabsContent>
        <TabsContent value="reviewed" className="mt-4">
          <SubmissionQueue submissions={reviewed} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
