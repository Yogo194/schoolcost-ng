import type { Metadata } from "next";
import Link from "next/link";
import { LegalPolicyNav } from "@/components/public/LegalPolicyNav";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  path: "/privacy",
  title: "Privacy Policy",
  description:
    "How SchoolCost NG collects, uses, protects, and publishes information.",
});

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "information", label: "Information we collect" },
  { id: "use", label: "How we use it" },
  { id: "publishing", label: "What we publish" },
  { id: "sharing", label: "When we share it" },
  { id: "retention", label: "Retention and security" },
  { id: "rights", label: "Your rights" },
  { id: "children", label: "Children and young people" },
  { id: "changes", label: "Changes to this policy" },
  { id: "contact", label: "Contact us" },
] as const;

function PolicySection({
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

export default function PrivacyPage() {
  return (
    <section className="bg-[#fcfdef] px-4 py-16 sm:px-10 sm:py-24 lg:px-20 lg:py-[120px]">
      <div className="mx-auto grid max-w-[1120px] min-w-0 gap-12 lg:grid-cols-[220px_minmax(0,650px)] lg:gap-20">
        <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink/50">
            Legal
          </p>
          <p className="mt-2 text-lg font-medium tracking-[-0.03em] text-brand-ink">
            Privacy Policy
          </p>
          <LegalPolicyNav sections={SECTIONS} />
        </aside>

        <article className="min-w-0">
          <Link
            href="/"
            className="text-sm font-medium text-brand-green underline decoration-brand-green/40 underline-offset-4 transition-colors hover:text-brand-ink"
          >
            SchoolCost NG
          </Link>
          <h1 className="mt-4 text-[2.5rem] font-medium leading-[1.05] tracking-[-0.04em] text-brand-ink sm:text-5xl lg:text-[56px]">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm leading-6 text-brand-ink/55">
            Last updated 21 July 2026
          </p>

          <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-16">
            <PolicySection id="overview" title="Overview">
              <p>
                SchoolCost NG helps students, parents, and other users find and
                compare tertiary-school costs in Nigeria. This policy explains
                how SchoolCost NG collects, uses, stores, and shares personal
                information when you use our website or send us a fee update,
                correction, or school suggestion.
              </p>
              <p>
                In this policy, &ldquo;SchoolCost NG,&rdquo; &ldquo;we,&rdquo;
                and &ldquo;us&rdquo; mean the team responsible for this website
                and its fee-information directory. We aim to process personal
                information fairly, transparently, and only for clear purposes,
                in line with applicable Nigerian data-protection law, including
                the Nigeria Data Protection Act 2023.
              </p>
            </PolicySection>

            <PolicySection id="information" title="Information we collect">
              <p>We collect information in three main ways:</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-brand-green">
                <li>
                  <strong className="font-semibold text-brand-ink">
                    Information you submit.
                  </strong>{" "}
                  This can include your name, email address, the school,
                  course, level, academic session, fee details, correction
                  details, and any message you send us.
                </li>
                <li>
                  <strong className="font-semibold text-brand-ink">
                    Evidence you choose to upload.
                  </strong>{" "}
                  For example, screenshots, fee schedules, PDFs, or images that
                  help us review a submission. Please do not upload identity
                  documents, bank details, medical information, or other
                  sensitive information that is not needed to verify a fee.
                </li>
                <li>
                  <strong className="font-semibold text-brand-ink">
                    Technical information.
                  </strong>{" "}
                  Our service providers may process limited technical
                  information needed to deliver and protect the website, such
                  as device and browser details, IP address, request logs, and
                  security information.
                </li>
              </ul>
            </PolicySection>

            <PolicySection id="use" title="How we use it">
              <p>We use personal information to:</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-brand-green">
                <li>review, verify, and respond to submissions;</li>
                <li>create, update, or correct school-fee records;</li>
                <li>contact you if we need to clarify information you sent;</li>
                <li>keep the directory accurate, secure, and resistant to misuse;</li>
                <li>meet legal obligations and resolve disputes where necessary.</li>
              </ul>
              <p>
                Where applicable, we rely on your consent when you submit
                information to us, our legitimate interest in running a
                trustworthy fee-information service, and any legal obligation
                that applies to us. You can withdraw consent at any time, but
                this will not affect processing already carried out lawfully.
              </p>
            </PolicySection>

            <PolicySection id="publishing" title="What we publish">
              <p>
                SchoolCost NG publishes reviewed fee information so people can
                compare education costs. We may publish information such as a
                school name, course, level, academic session, fee amount,
                category, source type, and review date.
              </p>
              <p>
                We do not publish your name, email address, or uploaded proof
                files as part of a fee record. Your contribution may help
                improve the directory, but your identity is not displayed
                alongside it.
              </p>
            </PolicySection>

            <PolicySection id="sharing" title="When we share it">
              <p>
                We do not sell personal information. We only share it where it
                is necessary to run SchoolCost NG, including with trusted
                hosting, database, storage, security, and email service
                providers acting on our instructions; where required by law; or
                to protect the rights, safety, and integrity of SchoolCost NG
                and its users.
              </p>
              <p>
                Some service providers may process information outside Nigeria.
                Where that happens, we take reasonable steps to ensure the
                transfer is permitted and that appropriate safeguards are in
                place.
              </p>
            </PolicySection>

            <PolicySection id="retention" title="Retention and security">
              <p>
                We keep personal information only for as long as it is
                reasonably needed for the purposes described here. Submission
                details and evidence may be kept while we review them and for a
                reasonable period afterwards to support quality checks, audit
                trails, disputes, and fraud prevention. We may retain
                non-identifying fee information in the public directory after
                removing or separating contributor details.
              </p>
              <p>
                We use reasonable technical and organisational measures to
                protect information, including restricted access to submission
                data. No internet service can guarantee absolute security, so
                please send only information that is necessary for your
                submission.
              </p>
            </PolicySection>

            <PolicySection id="rights" title="Your rights">
              <p>
                Subject to applicable law, you may ask us to confirm whether we
                hold your personal information, access it, correct it, delete
                it, restrict or object to certain processing, or provide a
                portable copy where applicable. You may also withdraw consent
                and complain to the Nigeria Data Protection Commission if you
                believe your rights have not been respected.
              </p>
              <p>
                To make a request, email us with enough information to identify
                your submission. We may need to verify your identity before we
                act. We aim to respond within 30 days, or explain if we need
                more time as permitted by law.
              </p>
            </PolicySection>

            <PolicySection id="children" title="Children and young people">
              <p>
                SchoolCost NG is designed for people researching tertiary
                education and is not intended to collect personal information
                directly from children. If you are under 18, please use the
                contribution features with a parent or guardian. If you believe
                a child has provided us personal information without appropriate
                permission, contact us so we can review and delete it where
                appropriate.
              </p>
            </PolicySection>

            <PolicySection id="changes" title="Changes to this policy">
              <p>
                We may update this policy as SchoolCost NG develops, our
                practices change, or the law changes. We will post the revised
                version here and update the date at the top. If a change is
                material, we will take reasonable steps to make it clear before
                it takes effect.
              </p>
            </PolicySection>

            <PolicySection id="contact" title="Contact us">
              <p>
                For a privacy question or request, email{" "}
                <a
                  href="mailto:privacy@schoolcost.ng"
                  className="font-medium text-brand-green underline decoration-brand-green/40 underline-offset-4 hover:text-brand-ink"
                >
                  privacy@schoolcost.ng
                </a>
                . Please do not include sensitive personal information in an
                email unless we specifically ask for it.
              </p>
              <p>
                You can also raise a privacy concern with the{" "}
                <a
                  href="https://ndpc.gov.ng/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-brand-green underline decoration-brand-green/40 underline-offset-4 hover:text-brand-ink"
                >
                  Nigeria Data Protection Commission
                </a>
                .
              </p>
            </PolicySection>
          </div>
        </article>
      </div>
    </section>
  );
}
