import Link from "next/link";
import Image from "next/image";
import { MapPin, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Institution } from "@/types/institution";
import { INSTITUTION_TYPE_LABELS, OWNERSHIP_TYPE_LABELS } from "@/types/institution";
import { CompareButton } from "./CompareButton";
import { formatCurrency } from "@/lib/utils/format";

interface SchoolCardProps {
  institution: Institution;
  lowestFee?: number | null;
  currency?: string;
  className?: string;
}

export function SchoolCard({
  institution,
  lowestFee,
  currency = "NGN",
  className,
}: SchoolCardProps) {
  return (
    <div
      className={cn(
        "group border border-gray-200 rounded-lg bg-white hover:border-gray-300 hover:shadow-sm transition-all",
        className
      )}
    >
      <Link href={`/schools/${institution.slug}`} className="block p-5">
        {/* Logo + name row */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-md border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
            {institution.logo_url ? (
              <Image
                src={institution.logo_url}
                alt={`${institution.name} logo`}
                width={40}
                height={40}
                className="object-contain"
              />
            ) : (
              <Building2 className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm leading-snug truncate group-hover:text-primary transition-colors">
              {institution.name}
            </h3>
            {institution.abbreviation && (
              <p className="text-xs text-gray-500 mt-0.5">
                {institution.abbreviation}
              </p>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {institution.state}
          </span>
          <span>·</span>
          <span>{INSTITUTION_TYPE_LABELS[institution.institution_type]}</span>
          <span>·</span>
          <span>{OWNERSHIP_TYPE_LABELS[institution.ownership_type]}</span>
        </div>

        {/* Fee preview */}
        {lowestFee != null && (
          <div className="text-xs text-gray-500">
            From{" "}
            <span className="font-semibold text-gray-900">
              {formatCurrency(lowestFee, currency)}
            </span>
            {" "}/ year
          </div>
        )}
      </Link>

      {/* Compare footer */}
      <div className="px-5 pb-4">
        <CompareButton institutionSlug={institution.slug} institutionName={institution.name} />
      </div>
    </div>
  );
}
