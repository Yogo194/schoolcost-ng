"use client";

import { useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { SubmissionStatus } from "@/types/database";

interface ModerationActionsProps {
  submissionId: string;
  currentStatus: SubmissionStatus;
  onAction?: (status: SubmissionStatus, feedback?: string) => Promise<void>;
}

export function ModerationActions({
  submissionId,
  currentStatus,
  onAction,
}: ModerationActionsProps) {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState<SubmissionStatus | null>(null);

  const isPending =
    currentStatus === "pending" || currentStatus === "needs_more_evidence";

  async function handleAction(status: SubmissionStatus) {
    if (!onAction) return;
    setLoading(status);
    try {
      await onAction(status, feedback || undefined);
      setFeedback("");
    } finally {
      setLoading(null);
    }
  }

  if (!isPending) {
    return (
      <div className="rounded-lg border border-gray-200 p-4 bg-gray-50 text-sm text-gray-500">
        This submission has been{" "}
        <span className="font-medium text-gray-700">{currentStatus.replace(/_/g, " ")}</span>.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Admin feedback (optional)</Label>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Leave a note for the submitter or internal record…"
          rows={3}
          className="text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => handleAction("approved")}
          disabled={!!loading}
          className="gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          {loading === "approved" ? "Approving…" : "Approve"}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => handleAction("needs_more_evidence")}
          disabled={!!loading}
          className="gap-2"
        >
          <AlertCircle className="w-4 h-4" />
          {loading === "needs_more_evidence" ? "Requesting…" : "Request Evidence"}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => handleAction("duplicate")}
          disabled={!!loading}
          className="gap-2 text-gray-600"
        >
          <Copy className="w-4 h-4" />
          {loading === "duplicate" ? "Marking…" : "Duplicate"}
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleAction("rejected")}
          disabled={!!loading}
          className="gap-2"
        >
          <XCircle className="w-4 h-4" />
          {loading === "rejected" ? "Rejecting…" : "Reject"}
        </Button>
      </div>
    </div>
  );
}
