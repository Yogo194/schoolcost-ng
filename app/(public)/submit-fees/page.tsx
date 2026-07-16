import type { Metadata } from "next";
import { SubmitFeeForm } from "@/components/forms/SubmitFeeForm";

export const metadata: Metadata = {
  title: "Submit Fee Information",
  description: "Submit school fee information to help other students and parents plan their education costs.",
};

export default async function SubmitFeesPage() {
  // TODO: fetch institutions list for the dropdown
  const institutions: never[] = [];

  async function handleSubmit(data: unknown) {
    "use server";
    // TODO: insert into submissions table via Supabase
    console.log("Fee submission:", data);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit Fee Information</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Help other students and parents by submitting verified fee information.
          All submissions are reviewed by our team before being published.
        </p>
      </div>
      <SubmitFeeForm institutions={institutions} onSubmit={handleSubmit as never} />
    </div>
  );
}
