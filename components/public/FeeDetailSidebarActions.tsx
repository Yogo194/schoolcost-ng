"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Plus } from "lucide-react";
import type { FeeDetailRecord } from "@/lib/mock/fee-detail";
import { SubmitCorrectionForm } from "@/components/forms/SubmitCorrectionForm";
import { EvidenceUploadField } from "@/components/forms/EvidenceUploadField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type FeeDetailView = "breakdown" | "verification" | "compare";

type FormPanel = "update" | "error" | null;

const VIEW_TABS = [
  { value: "breakdown", label: "Breakdown" },
  { value: "verification", label: "Verification" },
  { value: "compare", label: "Compare" },
] as const;

export function DetailViewTabs({
  activeView,
  onChange,
}: {
  activeView: FeeDetailView;
  onChange: (view: FeeDetailView) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef(new Map<FeeDetailView, HTMLButtonElement>());
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  const measure = useCallback(() => {
    const button = buttonRefs.current.get(activeView);
    if (!button) return;
    setPill({
      left: button.offsetLeft,
      width: button.offsetWidth,
      ready: true,
    });
  }, [activeView]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(list);
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Fee detail view"
      className="relative inline-flex max-w-full items-center rounded-[54px] border border-[#e5ebe5] bg-brand-ink/[0.06] p-1"
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-1 left-0 top-1 rounded-[42px] bg-white shadow-[0_1px_3px_0_rgba(16,24,40,0.10),0_1px_2px_0_rgba(16,24,40,0.06)] will-change-transform",
          pill.ready
            ? "transition-[transform,width] duration-[420ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
            : "opacity-0"
        )}
        style={{
          width: pill.width,
          transform: `translateX(${pill.left}px)`,
        }}
      />
      {VIEW_TABS.map((tab) => {
        const selected = activeView === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            ref={(element) => {
              if (element) buttonRefs.current.set(tab.value, element);
              else buttonRefs.current.delete(tab.value);
            }}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative z-10 inline-flex items-center justify-center rounded-[42px] px-4 py-2.5 text-base font-semibold leading-6 tracking-[-0.25px] transition-colors duration-300",
              selected
                ? "text-brand-ink"
                : "text-brand-ink/45 hover:text-brand-ink/70"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/** CTAs that belong with verification / trust context. */
export function VerificationActions({
  record,
  level,
}: {
  record: FeeDetailRecord;
  level: string;
}) {
  const [formPanel, setFormPanel] = useState<FormPanel>(null);

  return (
    <>
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#e5ebe5] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-base font-medium tracking-[-0.02em] text-brand-ink">
            Something look off?
          </p>
          <p className="mt-1 text-sm tracking-[-0.02em] text-brand-ink/65">
            Help improve {record.course} fees at {record.schoolName}. These
            actions apply to this course only.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFormPanel("update")}
            className="inline-flex h-11 items-center justify-center rounded-[12px] border border-[#e5ebe5] bg-white px-4 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-lime/30"
          >
            Submit update
          </button>
          <button
            type="button"
            onClick={() => setFormPanel("error")}
            className="inline-flex h-11 items-center justify-center rounded-[12px] border border-[#e5ebe5] bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Report error
          </button>
        </div>
      </div>

      <Sheet
        open={formPanel === "update"}
        onOpenChange={(open) => setFormPanel(open ? "update" : null)}
      >
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-lg"
        >
          <SheetHeader>
            <SheetTitle>Submit update</SheetTitle>
            <SheetDescription>
              Updating fees for {record.course} at {record.schoolName}. School
              and course are already selected.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-6">
            <CourseContextBanner record={record} level={level} />
            <CourseUpdateForm record={record} level={level} />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet
        open={formPanel === "error"}
        onOpenChange={(open) => setFormPanel(open ? "error" : null)}
      >
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-lg"
        >
          <SheetHeader>
            <SheetTitle>Report error</SheetTitle>
            <SheetDescription>
              Report a problem with the {record.course} fee record at{" "}
              {record.schoolName}.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-6">
            <CourseContextBanner record={record} level={level} />
            <SubmitCorrectionForm
              feeRecordId={record.id}
              onSubmit={async (data) => {
                console.log("Correction submission:", {
                  ...data,
                  evidence: data.evidenceFiles.map((file) => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                  })),
                });
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function CourseContextBanner({
  record,
  level,
}: {
  record: FeeDetailRecord;
  level: string;
}) {
  return (
    <div className="mb-5 rounded-xl border border-[#e5ebe5] bg-brand-lime-light/60 p-3">
      <p className="text-xs uppercase tracking-[0.07em] text-brand-ink/50">
        Selected record
      </p>
      <p className="mt-1 text-sm font-medium text-brand-ink">
        {record.course} · {record.schoolName}
      </p>
      <p className="mt-0.5 text-xs text-brand-ink/65">
        {level} · {record.session}
      </p>
    </div>
  );
}

function CourseUpdateForm({
  record,
  level,
}: {
  record: FeeDetailRecord;
  level: string;
}) {
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState(
    String(record.totalsByLevel[level]?.compulsory ?? "")
  );
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [evidenceError, setEvidenceError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (evidenceFiles.length === 0) {
      setEvidenceError("Please upload at least one supporting file.");
      return;
    }
    setEvidenceError(undefined);
    setSubmitting(true);
    console.log("Course fee update:", {
      recordId: record.id,
      school: record.schoolName,
      course: record.course,
      level,
      amount,
      notes,
      name,
      email,
      evidence: evidenceFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    });
    await new Promise((r) => setTimeout(r, 400));
    setSubmitting(false);
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <h3 className="text-base font-semibold text-brand-ink">
          Update submitted for review
        </h3>
        <p className="mt-1 text-sm text-brand-ink/65">
          We will check the evidence before publishing it.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Suggested compulsory total (₦)</Label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min={1}
        />
      </div>
      <div className="space-y-1.5">
        <Label>What changed?</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          required
          minLength={10}
          placeholder="Describe the update and where you found the figure…"
        />
      </div>
      <EvidenceUploadField
        files={evidenceFiles}
        onChange={(files) => {
          setEvidenceFiles(files);
          if (files.length > 0) setEvidenceError(undefined);
        }}
        required
        error={evidenceError}
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Your name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Full name"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Your email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>
      </div>
      <Button type="submit" disabled={submitting} className="w-full gap-2">
        <Plus className="size-4" aria-hidden />
        {submitting ? "Submitting…" : "Submit update"}
      </Button>
    </form>
  );
}
