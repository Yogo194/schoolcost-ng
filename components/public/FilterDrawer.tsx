"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NIGERIA_STATES } from "@/types/institution";

export interface FilterValues {
  state?: string;
  institution_type?: string;
  ownership_type?: string;
}

interface FilterDrawerProps {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onClear: () => void;
}

export function FilterDrawer({ values, onChange, onClear }: FilterDrawerProps) {
  const activeCount = Object.values(values).filter(Boolean).length;

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="sm" className="gap-2" />}>
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {activeCount > 0 && (
          <span className="ml-1 w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-medium">
            {activeCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader className="mb-6">
          <SheetTitle>Filter Schools</SheetTitle>
        </SheetHeader>

        <div className="space-y-5">
          <FilterField
            label="State"
            value={values.state}
            placeholder="All states"
            onChange={(v) => onChange({ ...values, state: v || undefined })}
          >
            {NIGERIA_STATES.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </FilterField>

          <FilterField
            label="Institution Type"
            value={values.institution_type}
            placeholder="All types"
            onChange={(v) =>
              onChange({ ...values, institution_type: v || undefined })
            }
          >
            <SelectItem value="university">University</SelectItem>
            <SelectItem value="polytechnic">Polytechnic</SelectItem>
            <SelectItem value="college_of_education">College of Education</SelectItem>
            <SelectItem value="health_institution">Health Institution</SelectItem>
          </FilterField>

          <FilterField
            label="Ownership"
            value={values.ownership_type}
            placeholder="All ownership types"
            onChange={(v) =>
              onChange({ ...values, ownership_type: v || undefined })
            }
          >
            <SelectItem value="federal">Federal</SelectItem>
            <SelectItem value="state">State</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </FilterField>

          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-gray-500"
              onClick={onClear}
            >
              Clear all filters
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function FilterField({
  label,
  value,
  placeholder,
  onChange,
  children,
}: {
  label: string;
  value?: string;
  placeholder: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-gray-600">{label}</Label>
      <Select value={value || ""} onValueChange={(v) => onChange(v ?? "")}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );
}
