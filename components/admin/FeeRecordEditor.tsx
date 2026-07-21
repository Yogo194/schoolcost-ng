"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { FeeRecord, FeeItem } from "@/types/fee";
import { FEE_CATEGORY_LABELS, FEE_FREQUENCY_LABELS } from "@/types/fee";

const feeItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Required"),
  category: z.string().min(1, "Required"),
  amount: z.coerce.number().positive("Must be > 0"),
  is_compulsory: z.boolean(),
  frequency: z.enum(["one_time", "recurring"]),
  applies_to: z.enum(["fresh_only", "returning_only", "all_students"]),
  description: z.string().optional(),
});

const schema = z.object({
  verification_status: z.enum([
    "officially_verified",
    "community_verified",
    "reported",
    "outdated",
    "disputed",
  ]),
  confidence_level: z.enum(["high", "medium", "low"]),
  source_type: z.enum([
    "official_school_source",
    "official_fee_circular",
    "school_representative",
    "student_portal_evidence",
    "payment_invoice",
    "community_reported",
  ]),
  admin_note: z.string().optional(),
  is_published: z.boolean(),
  fee_items: z.array(feeItemSchema).min(1, "Add at least one fee item"),
});

type FormValues = z.infer<typeof schema>;

interface FeeRecordEditorProps {
  record?: Partial<FeeRecord>;
  items?: FeeItem[];
  onSubmit: (values: FormValues) => Promise<void>;
  isLoading?: boolean;
}

export function FeeRecordEditor({
  record,
  items = [],
  onSubmit,
  isLoading,
}: FeeRecordEditorProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      verification_status: record?.verification_status ?? "reported",
      confidence_level: record?.confidence_level ?? "low",
      source_type: record?.source_type ?? "community_reported",
      admin_note: record?.admin_note ?? "",
      is_published: record?.is_published ?? false,
      fee_items: items.length > 0
        ? items.map((i) => ({
            id: i.id,
            name: i.name,
            category: i.category,
            amount: i.amount,
            is_compulsory: i.is_compulsory,
            frequency: i.frequency,
            applies_to: i.applies_to,
            description: i.description ?? "",
          }))
        : [{ name: "", category: "tuition", amount: 0, is_compulsory: true, frequency: "recurring", applies_to: "all_students" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fee_items",
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Verification */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Verification</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <Select
              value={form.watch("verification_status")}
              onValueChange={(v) => form.setValue("verification_status", v as FormValues["verification_status"])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="officially_verified">Officially Verified</SelectItem>
                <SelectItem value="community_verified">Community Verified</SelectItem>
                <SelectItem value="reported">Reported</SelectItem>
                <SelectItem value="outdated">Outdated</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Confidence</Label>
            <Select
              value={form.watch("confidence_level")}
              onValueChange={(v) => form.setValue("confidence_level", v as FormValues["confidence_level"])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Source Type</Label>
            <Select
              value={form.watch("source_type")}
              onValueChange={(v) => form.setValue("source_type", v as FormValues["source_type"])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="official_school_source">Official School Source</SelectItem>
                <SelectItem value="official_fee_circular">Official Fee Circular</SelectItem>
                <SelectItem value="school_representative">School Representative</SelectItem>
                <SelectItem value="student_portal_evidence">Student Portal Evidence</SelectItem>
                <SelectItem value="payment_invoice">Payment Invoice</SelectItem>
                <SelectItem value="community_reported">Community Reported</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <Separator />

      {/* Fee Items */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Fee Items</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                name: "",
                category: "other",
                amount: 0,
                is_compulsory: true,
                frequency: "recurring",
                applies_to: "all_students",
              })
            }
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map((field, idx) => (
            <div
              key={field.id}
              className="border border-gray-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    {...form.register(`fee_items.${idx}.name`)}
                    placeholder="Fee name (e.g. Tuition Fee)"
                    className="text-sm"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(idx)}
                  className="text-gray-400 hover:text-destructive shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Category</Label>
                  <Select
                    value={form.watch(`fee_items.${idx}.category`)}
                    onValueChange={(v) => { if (v) form.setValue(`fee_items.${idx}.category`, v as never); }}
                  >
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(FEE_CATEGORY_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Amount (₦)</Label>
                  <Input
                    {...form.register(`fee_items.${idx}.amount`)}
                    type="number"
                    className="h-8 text-xs"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Frequency</Label>
                  <Select
                    value={form.watch(`fee_items.${idx}.frequency`)}
                    onValueChange={(v) => form.setValue(`fee_items.${idx}.frequency`, v as "one_time" | "recurring")}
                  >
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recurring">
                        {FEE_FREQUENCY_LABELS.recurring}
                      </SelectItem>
                      <SelectItem value="one_time">
                        {FEE_FREQUENCY_LABELS.one_time}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Applies To</Label>
                  <Select
                    value={form.watch(`fee_items.${idx}.applies_to`)}
                    onValueChange={(v) => form.setValue(`fee_items.${idx}.applies_to`, v as "fresh_only" | "returning_only" | "all_students")}
                  >
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_students">All students</SelectItem>
                      <SelectItem value="fresh_only">Fresh only</SelectItem>
                      <SelectItem value="returning_only">Returning only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Compulsory toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...form.register(`fee_items.${idx}.is_compulsory`)}
                  className="accent-primary"
                />
                <span className="text-xs text-gray-600">Compulsory fee</span>
              </label>
            </div>
          ))}
        </div>
        {form.formState.errors.fee_items && (
          <p className="text-xs text-destructive mt-2">
            {form.formState.errors.fee_items.message ?? "Please check fee items"}
          </p>
        )}
      </section>

      <Separator />

      {/* Publish */}
      <section>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...form.register("is_published")}
            className="accent-primary"
          />
          <span className="text-sm font-medium text-gray-900">
            Publish this fee record
          </span>
        </label>
        <p className="text-xs text-gray-400 mt-1 ml-6">
          Published records are visible to the public.
        </p>
      </section>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving…" : record?.id ? "Save Changes" : "Create Fee Record"}
      </Button>
    </form>
  );
}
