import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Understand how SchoolCost NG verifies school fee data and what our source and confidence labels mean.",
};

export default function HowItWorksPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">How SchoolCost NG Works</h1>
      <p className="text-gray-500 mb-10">
        Every fee record on SchoolCost NG has a source label, verification status, and confidence level. Here is what they mean.
      </p>

      {/* Verification statuses */}
      <section className="mb-12">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Verification Statuses</h2>
        <div className="space-y-3">
          {[
            {
              icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
              label: "Officially Verified",
              color: "border-emerald-200 bg-emerald-50",
              description: "Data confirmed from an official school source: the school website, an official circular, or a school representative.",
            },
            {
              icon: <CheckCircle className="w-4 h-4 text-blue-600" />,
              label: "Community Verified",
              color: "border-blue-200 bg-blue-50",
              description: "Submitted with strong evidence such as a student portal screenshot, payment invoice, or receipt. Reviewed by our team.",
            },
            {
              icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
              label: "Reported",
              color: "border-amber-200 bg-amber-50",
              description: "Submitted by a community member but with limited evidence. Use with caution and verify directly with the school.",
            },
            {
              icon: <Clock className="w-4 h-4 text-gray-400" />,
              label: "Outdated",
              color: "border-gray-200 bg-gray-50",
              description: "This record has not been reviewed recently and may not reflect the current academic session.",
            },
            {
              icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
              label: "Disputed",
              color: "border-red-200 bg-red-50",
              description: "The accuracy of this record is disputed. Multiple submissions show conflicting information.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex gap-3 p-4 rounded-lg border ${item.color}`}
            >
              <div className="mt-0.5 shrink-0">{item.icon}</div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-0.5">{item.label}</p>
                <p className="text-xs text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Source types */}
      <section className="mb-12">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Source Types</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Source</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Official School Source", "The school's official website or fee schedule."],
                ["Official Fee Circular", "A fee circular published by the institution."],
                ["School Representative", "Submitted directly by a staff member or official representative."],
                ["Student Portal Evidence", "Screenshot from the school's student portal showing fees."],
                ["Payment Invoice", "A payment receipt or invoice issued by the school."],
                ["Community Reported", "Submitted by a student or member of the public without supporting evidence."],
              ].map(([source, meaning]) => (
                <tr key={source} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{source}</td>
                  <td className="px-4 py-3 text-gray-500">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Confidence levels */}
      <section className="mb-12">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Confidence Levels</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div><span className="font-medium text-gray-900">High: </span>Strong source, recently reviewed, breakdown looks complete.</div>
          <div><span className="font-medium text-gray-900">Medium: </span>Credible evidence, but some details may be incomplete.</div>
          <div><span className="font-medium text-gray-900">Low: </span>Weak or unclear source. Confirm directly with the school.</div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border border-gray-200 rounded-lg p-5 bg-gray-50">
        <div className="flex gap-3">
          <ShieldCheck className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">Always verify directly with your school</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Fee data on this platform is submitted by users and reviewed by our team. Fees change between sessions.
              Before making any payment or financial decision, confirm the current fee schedule directly with your institution.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8 flex gap-4">
        <Link href="/submit-fees" className="text-sm text-primary hover:underline font-medium">
          Submit fee information →
        </Link>
        <Link href="/schools" className="text-sm text-gray-500 hover:underline">
          Browse schools →
        </Link>
      </div>
    </div>
  );
}
