import type { Metadata } from "next";
import { EmptyState } from "@/components/public/EmptyState";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  path: "/404",
  title: "Page not found",
  description: "We could not find that page on SchoolCost NG.",
});

export default function PublicNotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <EmptyState
        title="We could not find that page."
        description="The school or fee record you are looking for is not on SchoolCost NG yet. You can suggest a school and we will add it once we have fee data we can verify."
        action={{ label: "Browse all schools", href: "/schools" }}
        secondaryAction={{ label: "Suggest a school", href: "/suggest-school" }}
      />
    </div>
  );
}
