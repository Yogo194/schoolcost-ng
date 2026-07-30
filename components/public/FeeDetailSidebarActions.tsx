"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Plus } from "lucide-react";
import { submitCorrectionAction } from "@/app/actions/submissions";
import type { FeeDetailRecord } from "@/lib/mock/fee-detail";
import { SubmitCorrectionForm } from "@/components/forms/SubmitCorrectionForm";
import { EvidenceUploadField } from "@/components/forms/EvidenceUploadField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { SubmitCorrectionPayload } from "@/components/forms/SubmitCorrectionForm";

export type FeeDetailView = "breakdown" | "verification" | "compare";

type FormPanel = "update" | "error" | null;

const VIEW_TABS = [
  { value: "breakdown", label: "Breakdown" },
  { value: "verification", label: "Verification" },
  { value: "compare", label: "Compare" },
] as const;

async function submitCorrectionPayload(data: SubmitCorrectionPayload) {
  const formData = new FormData();
  const { evidenceFiles, ...payload } = data;
  formData.set("payload", JSON.stringify(payload));
  for (const file of evidenceFiles) {
    formData.append("evidence", file);
  }

  const result = await submitCorrectionAction(formData);
  if (!result.ok) {
    throw new Error(result.error);
  }
}

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
      className="relative flex w-full max-w-full items-center rounded-[54px] border border-[#e5ebe5] bg-brand-ink/[0.06] p-1 sm:inline-flex sm:w-auto"
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
              "relative z-10 inline-flex flex-1 items-center justify-center rounded-[42px] px-3 py-2.5 text-base leading-6 tracking-[-0.25px] transition-colors duration-300 sm:flex-none sm:px-4",
              selected
                ? "font-semibold text-brand-ink"
                : "font-normal text-brand-ink/45 hover:text-brand-ink/70"
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
  const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);
  const [hasSubmittedUpdate, setHasSubmittedUpdate] = useState(false);
  const [isErrorSubmitting, setIsErrorSubmitting] = useState(false);
  const [hasSubmittedError, setHasSubmittedError] = useState(false);

  function openUpdatePanel() {
    setIsUpdateSubmitting(false);
    setHasSubmittedUpdate(false);
    setFormPanel("update");
  }

  function openErrorPanel() {
    setIsErrorSubmitting(false);
    setHasSubmittedError(false);
    setFormPanel("error");
  }

  return (
    <>
      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#e5ebe5] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0">
          <p className="text-[15px] font-medium tracking-[-0.02em] text-brand-ink sm:text-base">
            Something look off?
          </p>
          <p className="mt-1 text-[15px] leading-[1.5] tracking-[-0.02em] text-brand-ink/70">
            Help improve {record.course} fees at {record.schoolName}. These
            actions apply to this course only.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={openUpdatePanel}
            className="inline-flex h-11 items-center justify-center rounded-[12px] border border-[#e5ebe5] bg-white px-4 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-lime/30"
          >
            Submit update
          </button>
          <button
            type="button"
            onClick={openErrorPanel}
            className="inline-flex h-11 items-center justify-center rounded-[12px] border border-[#e5ebe5] bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Report error
          </button>
        </div>
      </div>

      <Sheet
        open={formPanel === "update"}
        onOpenChange={(open) => {
          if (open) openUpdatePanel();
          else setFormPanel(null);
        }}
      >
        <SheetContent
          side="right"
          className="data-[side=right]:inset-y-2 data-[side=right]:right-2 data-[side=right]:h-[calc(100dvh-1rem)] data-[side=right]:w-[calc(100vw-1rem)] data-[side=right]:rounded-[24px] gap-0 overflow-hidden border border-[#e5ebe5] bg-white p-0 shadow-[-18px_18px_60px_rgba(3,48,42,0.22)] sm:data-[side=right]:w-[min(600px,calc(100vw-1rem))] sm:data-[side=right]:max-w-none [&_[data-slot=sheet-close]]:right-5 [&_[data-slot=sheet-close]]:top-5"
        >
          <SheetHeader className="border-b border-[#e5ebe5] px-6 py-5 pr-16 sm:px-7">
            <SheetTitle className="text-xl font-semibold tracking-[-0.03em] text-brand-ink">
              Submit an update
            </SheetTitle>
            <SheetDescription className="mt-1 text-sm leading-5 text-brand-ink/65">
              We will check the evidence before updating this fee. It should take about a minute.
            </SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-7">
            <CourseContextBanner record={record} level={level} />
            <CourseUpdateForm
              record={record}
              level={level}
              onSubmittingChange={setIsUpdateSubmitting}
              onSubmitted={() => setHasSubmittedUpdate(true)}
            />
          </div>
          <div className="flex shrink-0 gap-3 border-t border-[#e5ebe5] bg-white px-6 py-4 sm:px-7">
            {hasSubmittedUpdate ? (
              <SheetClose
                render={<Button type="button" className="w-full">Done</Button>}
              />
            ) : (
              <>
                <SheetClose
                  render={
                    <Button type="button" variant="secondary" className="flex-1">
                      Cancel
                    </Button>
                  }
                />
                <Button
                  type="submit"
                  form="course-update-form"
                  disabled={isUpdateSubmitting}
                  className="flex-[1.35] gap-2"
                >
                  <Plus className="size-4" aria-hidden />
                  {isUpdateSubmitting ? "Submitting…" : "Submit update"}
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet
        open={formPanel === "error"}
        onOpenChange={(open) => {
          if (open) openErrorPanel();
          else setFormPanel(null);
        }}
      >
        <SheetContent
          side="right"
          className="data-[side=right]:inset-y-2 data-[side=right]:right-2 data-[side=right]:h-[calc(100dvh-1rem)] data-[side=right]:w-[calc(100vw-1rem)] data-[side=right]:rounded-[24px] gap-0 overflow-hidden border border-[#e5ebe5] bg-white p-0 shadow-[-18px_18px_60px_rgba(3,48,42,0.22)] sm:data-[side=right]:w-[min(600px,calc(100vw-1rem))] sm:data-[side=right]:max-w-none [&_[data-slot=sheet-close]]:right-5 [&_[data-slot=sheet-close]]:top-5"
        >
          <SheetHeader className="border-b border-[#e5ebe5] px-6 py-5 pr-16 sm:px-7">
            <SheetTitle className="text-xl font-semibold tracking-[-0.03em] text-brand-ink">
              Report an error
            </SheetTitle>
            <SheetDescription className="mt-1 text-sm leading-5 text-brand-ink/65">
              Tell us what looks wrong. We will review it before changing this fee.
            </SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-7">
            <CourseContextBanner record={record} level={level} />
            <SubmitCorrectionForm
              feeRecordId={record.id}
              formId="report-error-form"
              hideSubmitButton
              onSubmittingChange={setIsErrorSubmitting}
              onSubmitted={() => setHasSubmittedError(true)}
              onSubmit={submitCorrectionPayload}
            />
          </div>
          <div className="flex shrink-0 gap-3 border-t border-[#e5ebe5] bg-white px-6 py-4 sm:px-7">
            {hasSubmittedError ? (
              <SheetClose
                render={<Button type="button" className="w-full">Done</Button>}
              />
            ) : (
              <>
                <SheetClose
                  render={
                    <Button type="button" variant="secondary" className="flex-1">
                      Cancel
                    </Button>
                  }
                />
                <Button
                  type="submit"
                  form="report-error-form"
                  disabled={isErrorSubmitting}
                  className="flex-[1.35]"
                >
                  {isErrorSubmitting ? "Sending…" : "Send report"}
                </Button>
              </>
            )}
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
    <div className="mb-6 rounded-2xl border border-[#e5ebe5] bg-brand-lime-light/60 p-4">
      <p className="text-xs uppercase tracking-[0.07em] text-brand-ink/50">
        Selected record
      </p>
      <p className="mt-1 text-base font-medium text-brand-ink">
        {record.course} · {record.schoolName}
      </p>
      <p className="mt-1 text-sm text-brand-ink/65">
        {level} · {record.session}
      </p>
    </div>
  );
}

function CourseUpdateForm({
  record,
  level,
  onSubmittingChange,
  onSubmitted,
}: {
  record: FeeDetailRecord;
  level: string;
  onSubmittingChange: (submitting: boolean) => void;
  onSubmitted: () => void;
}) {
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState(
    String(record.totalsByLevel[level]?.compulsory ?? "")
  );
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [evidenceError, setEvidenceError] = useState<string | undefined>();
  const [submitError, setSubmitError] = useState<string | undefined>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (evidenceFiles.length === 0) {
      setEvidenceError("Please upload at least one supporting file.");
      return;
    }
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setSubmitError("Enter a valid updated amount.");
      return;
    }
    setEvidenceError(undefined);
    setSubmitError(undefined);
    onSubmittingChange(true);
    try {
      await submitCorrectionPayload({
        fee_record_id: record.id,
        correction_type: "wrong_amount",
        description:
          notes.trim() ||
          `Updated estimated fees for ${record.course} at ${record.schoolName}.`,
        suggested_amount: parsedAmount,
        source_url: "",
        submitter_name: "",
        submitter_email: email,
        evidenceFiles,
      });
      setSuccess(true);
      onSubmitted();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong sending this. Please try again."
      );
    } finally {
      onSubmittingChange(false);
    }
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
    <form id="course-update-form" onSubmit={handleSubmit} className="space-y-5 pb-2">
      <div className="space-y-1.5">
        <Label>Updated compulsory total (₦)</Label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min={1}
        />
        <p className="text-xs leading-4 text-brand-ink/55">
          Include charges every student must pay. Leave out optional hostel or feeding costs.
        </p>
      </div>
      <div className="space-y-1.5">
        <Label>Anything that helps us check it faster (optional)</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="For example: new portal invoice for 2026/2027."
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
        label="Proof of the updated fee"
      />
      {submitError && (
        <p className="text-xs text-destructive">{submitError}</p>
      )}
      <div className="border-t border-[#edf0ed] pt-5">
        <Label>Your email (optional)</Label>
        <Input
          className="mt-1.5"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Only if you are happy for us to ask a follow-up question"
        />
      </div>
    </form>
  );
}
