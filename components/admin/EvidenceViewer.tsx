import { ExternalLink, FileText, Image as ImageIcon } from "lucide-react";
import type { Evidence } from "@/types/fee";
import { formatDate } from "@/lib/utils/format";

interface EvidenceViewerProps {
  evidence: Evidence[];
}

export function EvidenceViewer({ evidence }: EvidenceViewerProps) {
  if (evidence.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-4">No evidence attached.</p>
    );
  }

  return (
    <div className="space-y-3">
      {evidence.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 border border-gray-200 rounded-lg p-4 bg-white"
        >
          <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0">
            {item.file_url?.endsWith(".pdf") ? (
              <FileText className="w-4 h-4 text-gray-500" />
            ) : (
              <ImageIcon className="w-4 h-4 text-gray-500" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 capitalize">
              {item.source_type.replace(/_/g, " ")}
            </p>
            {item.evidence_date && (
              <p className="text-xs text-gray-500 mt-0.5">
                Date: {formatDate(item.evidence_date)}
              </p>
            )}
            {item.submitted_by_email && (
              <p className="text-xs text-gray-400">by {item.submitted_by_email}</p>
            )}
            {item.admin_note && (
              <p className="text-xs text-gray-600 mt-1 italic">{item.admin_note}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            {item.file_url && (
              <a
                href={item.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                View file
              </a>
            )}
            {item.source_url && (
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                Source URL
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
