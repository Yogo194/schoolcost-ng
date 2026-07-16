import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SchoolCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-5">
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="w-10 h-10 rounded-md shrink-0" />
        <div className="flex-1 min-w-0 space-y-1.5">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full mb-1.5" />
      <Skeleton className="h-3 w-2/3" />
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

export function FeeBreakdownSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex justify-between items-center py-2">
          <div className="space-y-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
      <div className="border-t border-gray-200 pt-3 flex justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-28" />
      </div>
    </div>
  );
}

export function PageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4 animate-pulse", className)}>
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
