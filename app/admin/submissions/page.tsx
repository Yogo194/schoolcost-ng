import type { Metadata } from "next";
import { SubmissionQueue } from "@/components/admin/SubmissionQueue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listSubmissions } from "@/lib/submissions/admin";
import type { SubmissionWithDetails } from "@/types/submission";

export const metadata: Metadata = { title: "Submissions | Admin" };

export default async function AdminSubmissionsPage() {
  let submissions: SubmissionWithDetails[] = [];
  let loadError: string | null = null;

  try {
    submissions = await listSubmissions();
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Could not load submissions";
  }

  const pending = submissions.filter(
    (s) => s.status === "pending" || s.status === "needs_more_evidence"
  );
  const reviewed = submissions.filter(
    (s) => s.status !== "pending" && s.status !== "needs_more_evidence"
  );

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Submissions</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {pending.length} pending · {submissions.length} total
        </p>
      </div>

      {loadError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </p>
      )}

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
