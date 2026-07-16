import type { Metadata } from "next";
import { SuggestSchoolForm } from "@/components/forms/SuggestSchoolForm";

export const metadata: Metadata = {
  title: "Suggest a School",
  description: "Suggest a Nigerian tertiary institution to be added to SchoolCost NG.",
};

export default async function SuggestSchoolPage() {
  async function handleSubmit(data: unknown) {
    "use server";
    // TODO: insert school suggestion into submissions table
    console.log("School suggestion:", data);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Suggest a School</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Know a Nigerian tertiary institution that should be on SchoolCost NG?
          Suggest it here. We will add it when we can verify fee data for it.
        </p>
      </div>
      <SuggestSchoolForm onSubmit={handleSubmit as never} />
    </div>
  );
}
