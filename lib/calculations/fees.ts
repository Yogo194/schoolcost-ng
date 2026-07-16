import type { FeeItem } from "@/types/fee";

export function compulsoryTotal(items: FeeItem[]): number {
  return items
    .filter((i) => i.is_compulsory && i.category !== "accommodation")
    .reduce((sum, i) => sum + i.amount, 0);
}

export function optionalTotal(items: FeeItem[]): number {
  return items
    .filter((i) => !i.is_compulsory)
    .reduce((sum, i) => sum + i.amount, 0);
}

export function accommodationTotal(items: FeeItem[]): number {
  return items
    .filter((i) => i.category === "accommodation")
    .reduce((sum, i) => sum + i.amount, 0);
}

export function firstYearTotal(items: FeeItem[]): number {
  return items
    .filter(
      (i) =>
        i.is_compulsory &&
        i.category !== "accommodation" &&
        (i.applies_to === "fresh_only" || i.applies_to === "all_students")
    )
    .reduce((sum, i) => sum + i.amount, 0);
}

export function returningYearTotal(items: FeeItem[]): number {
  return items
    .filter(
      (i) =>
        i.is_compulsory &&
        i.category !== "accommodation" &&
        i.frequency === "recurring" &&
        (i.applies_to === "returning_only" || i.applies_to === "all_students")
    )
    .reduce((sum, i) => sum + i.amount, 0);
}

export function estimatedDegreeTotal(
  firstYear: number,
  returningYear: number,
  durationYears: number
): number {
  return firstYear + returningYear * (durationYears - 1);
}
