import type { Metadata } from "next";
import Link from "next/link";
import { LegalPolicyNav } from "@/components/public/LegalPolicyNav";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  path: "/terms",
  title: "Terms of Use",
  description: "The terms that apply when you use SchoolCost NG.",
});

const SECTIONS = [
  { id: "agreement", label: "Your agreement" },
  { id: "service", label: "About the service" },
  { id: "use", label: "Using SchoolCost NG" },
  { id: "submissions", label: "Submitting information" },
  { id: "review", label: "Review and publication" },
  { id: "content", label: "Our content" },
  { id: "availability", label: "Availability and changes" },
  { id: "liability", label: "Liability" },
  { id: "law", label: "Law and disputes" },
  { id: "contact", label: "Contact us" },
] as const;

function TermsSection({
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
      <div className="mt-4 min-w-0 space-y-4 text-[15px] leading-7 tracking-[-0.01em] text-brand-ink/75 [overflow-wrap:anywhere] sm:text-base">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <section className="bg-[#fcfdef] px-4 py-16 sm:px-10 sm:py-24 lg:px-20 lg:py-[120px]">
      <div className="mx-auto grid max-w-[1120px] min-w-0 gap-12 lg:grid-cols-[220px_minmax(0,650px)] lg:gap-20">
        <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink/50">
            Legal
          </p>
          <p className="mt-2 text-lg font-medium tracking-[-0.03em] text-brand-ink">
            Terms of Use
          </p>
          <LegalPolicyNav sections={SECTIONS} navLabel="Terms sections" />
        </aside>

        <article className="min-w-0">
          <Link
            href="/"
            className="text-sm font-medium text-brand-green underline decoration-brand-green/40 underline-offset-4 transition-colors hover:text-brand-ink"
          >
            SchoolCost NG
          </Link>
          <h1 className="mt-4 text-[42px] font-medium leading-[0.98] tracking-[-0.055em] text-brand-ink sm:text-[56px]">
            Terms of Use
          </h1>
          <p className="mt-4 text-sm leading-6 text-brand-ink/55">
            Last updated 21 July 2026
          </p>

          <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-16">
            <TermsSection id="agreement" title="Your agreement">
              <p>
                These Terms of Use govern your access to and use of SchoolCost
                NG. By using the website, browsing school-fee information, or
                submitting a fee update, correction, or school suggestion, you
                agree to these terms. If you do not agree, please do not use the
                service.
              </p>
            </TermsSection>

            <TermsSection id="service" title="About the service">
              <p>
                SchoolCost NG is an independent directory for researching and
                comparing the costs of Nigerian tertiary education. It brings
                together reviewed fee information by school, course, level, and
                academic session to help users plan and ask better questions.
              </p>
              <p>
                SchoolCost NG is not a university, polytechnic, regulator,
                admissions body, or payment processor. We do not set school
                fees and we do not make admission, enrolment, scholarship, or
                financial decisions for any institution.
              </p>
            </TermsSection>

            <TermsSection id="use" title="Using SchoolCost NG">
              <p>You may use SchoolCost NG for lawful, personal, and non-commercial research and planning.</p>
              <p>You must not:</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-brand-green">
                <li>use the service in a way that is unlawful, misleading, or harmful;</li>
                <li>attempt to bypass security, interfere with the service, or access restricted areas;</li>
                <li>scrape, copy, or republish substantial parts of the directory without permission;</li>
                <li>use automated tools in a way that places an unreasonable load on the service;</li>
                <li>impersonate another person or misrepresent your connection to a school.</li>
              </ul>
            </TermsSection>

            <TermsSection id="submissions" title="Submitting information">
              <p>
                You may submit fee information, corrections, evidence, or a
                school suggestion. You are responsible for ensuring that what
                you send is accurate to the best of your knowledge, lawful to
                share, and does not infringe another person&apos;s rights.
              </p>
              <p>
                Do not submit sensitive personal information unless it is
                strictly necessary and we ask for it. In particular, do not send
                identity documents, bank details, passwords, medical
                information, or information about another person that is not
                needed to verify a school fee.
              </p>
              <p>
                By submitting information, you give SchoolCost NG a
                non-exclusive, worldwide, royalty-free licence to store,
                review, verify, adapt, and use the submitted fee information to
                operate and improve the directory. This does not give us the
                right to publish your personal contact details or private proof
                files alongside a fee record.
              </p>
            </TermsSection>

            <TermsSection id="review" title="Review and publication">
              <p>
                We may review, request clarification on, accept, reject, edit,
                delay, remove, or label a submission at our discretion. A
                submission is not published automatically and sending evidence
                does not guarantee that a record will be added or changed.
              </p>
              <p>
                We aim to show the source type and review date for published
                information. Even after review, information can become outdated
                or incomplete. Please read our{" "}
                <Link href="/disclaimer" className="font-medium text-brand-green underline decoration-brand-green/40 underline-offset-4 hover:text-brand-ink">
                  Fee Information Disclaimer
                </Link>{" "}
                before relying on a figure.
              </p>
            </TermsSection>

            <TermsSection id="content" title="Our content">
              <p>
                SchoolCost NG, its name, design, software, text, and original
                directory presentation are protected by applicable intellectual
                property laws. You may use them to research and compare fees,
                but you may not reproduce, sell, license, or build a competing
                directory from substantial parts of the service without our
                written permission.
              </p>
              <p>
                School names, logos, and other third-party marks belong to their
                respective owners. Their appearance on SchoolCost NG does not
                imply endorsement, partnership, or affiliation.
              </p>
            </TermsSection>

            <TermsSection id="availability" title="Availability and changes">
              <p>
                We may change, suspend, or discontinue any part of SchoolCost
                NG at any time, including a school record, comparison feature,
                or contribution flow. We may also update these terms as the
                product or law changes. The updated terms will be posted here
                with a revised date.
              </p>
            </TermsSection>

            <TermsSection id="liability" title="Liability">
              <p>
                SchoolCost NG is provided for general information and planning.
                To the extent permitted by law, we do not guarantee that the
                service will always be available, error-free, complete, or
                suitable for a particular purpose. You are responsible for
                confirming fees, payment deadlines, admission requirements, and
                all final amounts directly with the relevant institution before
                making a decision or payment.
              </p>
              <p>
                Nothing in these terms excludes or limits liability that cannot
                lawfully be excluded or limited under applicable law.
              </p>
            </TermsSection>

            <TermsSection id="law" title="Law and disputes">
              <p>
                These terms are governed by the laws of the Federal Republic of
                Nigeria. If you have a concern, please contact us first so we
                can try to resolve it directly and fairly.
              </p>
            </TermsSection>

            <TermsSection id="contact" title="Contact us">
              <p>
                For a question about these terms, email{" "}
                <a href="mailto:privacy@schoolcost.ng" className="font-medium text-brand-green underline decoration-brand-green/40 underline-offset-4 hover:text-brand-ink">
                  privacy@schoolcost.ng
                </a>
                .
              </p>
            </TermsSection>
          </div>
        </article>
      </div>
    </section>
  );
}
