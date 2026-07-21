"use client";

import { useId, useState } from "react";
import { FileUp, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE,
} from "@/lib/validations/submission";
import { cn } from "@/lib/utils";

interface EvidenceUploadFieldProps {
  files: File[];
  onChange: (files: File[]) => void;
  required?: boolean;
  className?: string;
  error?: string;
  /** Override the default field label. Pass null to hide it. */
  label?: string | null;
}

export function EvidenceUploadField({
  files,
  onChange,
  required = false,
  className,
  error,
  label = "Supporting evidence",
}: EvidenceUploadFieldProps) {
  const inputId = useId();
  const [localError, setLocalError] = useState<string | null>(null);

  function addFiles(list: FileList | null) {
    if (!list?.length) return;

    const next = [...files];
    let message: string | null = null;

    Array.from(list).forEach((file) => {
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        message = "Use PDF, PNG, or JPG files only.";
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        message = "Each file must be 10 MB or smaller.";
        return;
      }
      if (next.some((existing) => existing.name === file.name && existing.size === file.size)) {
        return;
      }
      if (next.length >= 3) {
        message = "You can upload up to 3 files.";
        return;
      }
      next.push(file);
    });

    setLocalError(message);
    onChange(next);
  }

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index));
    setLocalError(null);
  }

  const shownError = error || localError;

  return (
    <div className={cn("space-y-1.5", className)}>
      {label != null && (
        <Label htmlFor={inputId}>
          {label}
          {required ? "" : " (optional)"}
        </Label>
      )}
      <label
        htmlFor={inputId}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed border-[#d4a56a] bg-white px-4 py-5 text-center transition-colors hover:border-[#c8792a] hover:bg-[#fff6eb]"
      >
        <FileUp className="size-5 text-brand-ink/70" aria-hidden />
        <span className="text-sm font-semibold tracking-[-0.02em] text-brand-ink">
          Upload fee circular, portal screenshot, or receipt
        </span>
        <span className="text-xs tracking-[-0.02em] text-brand-ink/65">
          PDF, PNG, or JPG · up to 3 files · 10 MB each
        </span>
        <input
          id={inputId}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
          multiple
          className="sr-only"
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </label>

      {files.length > 0 && (
        <ul className="space-y-2 pt-1">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${index}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-[#e5ebe5] bg-white px-3 py-2"
            >
              <span className="min-w-0 truncate text-sm text-brand-ink">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-brand-ink/50 transition-colors hover:bg-brand-ink/5 hover:text-brand-ink"
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {shownError && (
        <p className="text-xs text-destructive">{shownError}</p>
      )}
    </div>
  );
}
