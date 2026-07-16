import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  secondaryAction,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-4",
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-gray-300">{icon}</div>
      )}
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {action && (
            <Link href={action.href} className={cn(buttonVariants({ size: "sm" }))}>
              {action.label}
            </Link>
          )}
          {secondaryAction && (
            <Link href={secondaryAction.href} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              {secondaryAction.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
