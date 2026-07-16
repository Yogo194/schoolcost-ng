import Link from "next/link";
import { MapPin, Building2 } from "lucide-react";
import Image from "next/image";
import type { Institution } from "@/types/institution";
import { INSTITUTION_TYPE_LABELS, OWNERSHIP_TYPE_LABELS } from "@/types/institution";
import { formatCurrency } from "@/lib/utils/format";
import { CompareButton } from "./CompareButton";

interface SchoolResultRowProps {
  institution: Institution;
  lowestFee?: number | null;
  currency?: string;
}

export function SchoolResultRow({
  institution,
  lowestFee,
  currency = "NGN",
}: SchoolResultRowProps) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-4 px-4 rounded transition-colors">
      {/* Logo */}
      <div className="w-9 h-9 rounded-md border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
        {institution.logo_url ? (
          <Image
            src={institution.logo_url}
            alt=""
            width={36}
            height={36}
            className="object-contain"
          />
        ) : (
          <Building2 className="w-4 h-4 text-gray-400" />
        )}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/schools/${institution.slug}`}
          className="font-medium text-sm text-gray-900 hover:text-primary transition-colors truncate block"
        >
          {institution.name}
        </Link>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 flex-wrap">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {institution.state}
          </span>
          <span>·</span>
          <span>{INSTITUTION_TYPE_LABELS[institution.institution_type]}</span>
          <span>·</span>
          <span>{OWNERSHIP_TYPE_LABELS[institution.ownership_type]}</span>
        </div>
      </div>

      {/* Fee + compare */}
      <div className="flex items-center gap-4 shrink-0">
        {lowestFee != null && (
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">
              {formatCurrency(lowestFee, currency)}
            </p>
            <p className="text-xs text-gray-400">from / year</p>
          </div>
        )}
        <CompareButton
          institutionSlug={institution.slug}
          institutionName={institution.name}
          compact
        />
      </div>
    </div>
  );
}
