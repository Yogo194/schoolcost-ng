import type { Metadata } from "next";
import Link from "next/link";
import { LegalPolicyNav } from "@/components/public/LegalPolicyNav";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  path: "/disclaimer",
  title: "Fee Information Disclaimer",
  description:
    "Important information about using SchoolCost NG fee records for planning and comparison.",
});

const SECTIONS = [
  { id: "purpose", label: "What this means" },
  { id: "accuracy", label: "Accuracy and updates" },
  { id: "costs", label: "What a fee total includes" },
  { id: "decisions", label: "Before you decide or pay" },
  { id: "sources", label: "Sources and review" },
  { id: "responsibility", label: "Your responsibility" },
  { id: "contact", label: "Report an issue" },
] as const;

function DisclaimerSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-[26px] font-medium leading-[1.15] tracking-[-0.04em] text-brand-ink sm:text-[32px]">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[15px] leading-7 tracking-[-0.01em] text-brand-ink/75 sm:text-base">
        {children}
      </div>
    </section>
  );
}

export default function DisclaimerPage() {
  return (
    <section className="bg-[#fcfdef] px-4 py-16 sm:px-10 sm:py-24 lg:px-20 lg:py-[120px]">
      <div className="mx-auto grid max-w-[1120px] gap-12 lg:grid-cols-[220px_minmax(0,650px)] lg:gap-20">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink/50">
            Legal
          </p>
          <p className="mt-2 text-lg font-medium tracking-[-0.03em] text-brand-ink">
            Fee Information Disclaimer
          </p>
          <LegalPolicyNav sections={SECTIONS} navLabel="Disclaimer sections" />
        </aside>

        <article>
          <Link
            href="/"
            className="text-sm font-medium text-brand-green underline decoration-brand-green/40 underline-offset-4 transition-colors hover:text-brand-ink"
          >
            SchoolCost NG
          </Link>
          <h1 className="mt-4 text-[42px] font-medium leading-[0.98] tracking-[-0.055em] text-brand-ink sm:text-[56px]">
            Fee Information Disclaimer
          </h1>
          <p className="mt-4 text-sm leading-6 text-brand-ink/55">
            Last updated 21 July 2026
          </p>

          <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-16">
            <DisclaimerSection id="purpose" title="What this means">
              <p>
                SchoolCost NG helps people understand and compare likely
                tertiary-school costs in Nigeria. The figures on this website
                are for research, comparison, and planning only. They are not a
                quotation, invoice, admission offer, payment instruction, or
                guarantee of what any institution will charge you.
              </p>
              <p>
                Only the relevant institution can confirm its current fees,
                payment terms, eligibility requirements, and the amounts that
                apply to you.
              </p>
            </DisclaimerSection>

            <DisclaimerSection id="accuracy" title="Accuracy and updates">
              <p>
                We work to review submissions and show the date a fee record
                was reviewed. However, fees can change after publication,
                sometimes without notice. A school may also charge different
                amounts depending on course, level, campus, residence status,
                entry route, payment timing, or other circumstances.
              </p>
              <p>
                A record may be incomplete, delayed, or no longer current. The
                absence of a fee or school from SchoolCost NG does not mean that
                the school does not offer a course or that no fee is payable.
              </p>
            </DisclaimerSection>

            <DisclaimerSection id="costs" title="What a fee total includes">
              <p>
                Each SchoolCost NG record should be read with its breakdown,
                labels, and notes. A first-year total may include one-time
                charges that do not apply in later years. A whole-programme
                estimate may be based on the available fee data and may not
                include future increases.
              </p>
              <p>
                Unless a record clearly says otherwise, figures may not include
                personal living costs, transport, food, books, equipment,
                professional examinations, late-payment charges, optional
                services, or every course-specific charge. Hostel and
                accommodation charges are often optional or subject to
                availability.
              </p>
            </DisclaimerSection>

            <DisclaimerSection id="decisions" title="Before you decide or pay">
              <p>
                Always confirm the final amount directly with the relevant
                institution before you accept an offer, make a payment, or make
                a financial commitment. Check the school&apos;s official channels
                for the correct academic session, course, level, payment
                deadline, bank details, and whether a charge is compulsory.
              </p>
              <p>
                SchoolCost NG does not provide financial, legal, admissions, or
                investment advice. Your circumstances are your own, and you
                should seek advice from the appropriate professional where
                needed.
              </p>
            </DisclaimerSection>

            <DisclaimerSection id="sources" title="Sources and review">
              <p>
                Fee data can come from school materials, submitted evidence,
                contributors, or other sources that we review. A review label
                describes our assessment of the information available at that
                time. It does not mean that SchoolCost NG or a school has made
                a permanent guarantee about the fee.
              </p>
              <p>
                References to a school, course, or third-party website do not
                create an endorsement, partnership, or affiliation unless we
                state one clearly.
              </p>
            </DisclaimerSection>

            <DisclaimerSection id="responsibility" title="Your responsibility">
              <p>
                You use SchoolCost NG at your own discretion. You are
                responsible for checking information before relying on it and
                for safeguarding your own payment decisions. To the extent
                permitted by law, SchoolCost NG is not responsible for loss or
                damage resulting from reliance on information that has changed,
                is incomplete, or is incorrect.
              </p>
              <p>
                Nothing in this disclaimer excludes liability that cannot be
                excluded under applicable law. Read our{" "}
                <Link href="/terms" className="font-medium text-brand-green underline decoration-brand-green/40 underline-offset-4 hover:text-brand-ink">
                  Terms of Use
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-medium text-brand-green underline decoration-brand-green/40 underline-offset-4 hover:text-brand-ink">
                  Privacy Policy
                </Link>{" "}
                for more information.
              </p>
            </DisclaimerSection>

            <DisclaimerSection id="contact" title="Report an issue">
              <p>
                If you spot an error, have newer evidence, or want to help us
                improve a record, please{" "}
                <Link href="/submit-correction" className="font-medium text-brand-green underline decoration-brand-green/40 underline-offset-4 hover:text-brand-ink">
                  report an error
                </Link>{" "}
                or{" "}
                <Link href="/submit-fees" className="font-medium text-brand-green underline decoration-brand-green/40 underline-offset-4 hover:text-brand-ink">
                  submit a fee update
                </Link>
                . We review every contribution before publishing it.
              </p>
            </DisclaimerSection>
          </div>
        </article>
      </div>
    </section>
  );
}
