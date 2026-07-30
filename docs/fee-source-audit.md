# Fee Source Audit — schools with no published fees

Audit of the 130 institutions that have fee rows but **zero published** fees
(placeholder/estimate pairs unpublished by the cleanup scripts).

Goal: find which schools have a **trustworthy, extractable** fee source so we
can prioritise seeding those.

## Tiers

- **A — Publish now.** School's own domain hosts a public, current, itemised fee
  schedule. No login. Extractable.
- **B — Official but weak.** Own-domain source exists but is stale (old session),
  partial (one faculty / postgrad only), or coarse (band totals, not per-course).
- **C — Portal-gated.** Fees exist only behind a student login or a query form.
  Not extractable without credentials.
- **D — Aggregators only.** Only blog sources (myschool.ng, preps.ng, etc.).
  Not trustworthy enough to publish as verified.

## Findings

| School | Own | Tier | Source | Notes |
|---|---|---|---|---|
| Bayero University, Kano (BUK) | federal | **A** | `mybuk2.buk.edu.ng/ug/schedule_of_fees.php` | **Best find.** 145 programmes, fresh (UTME + DE) / returning / international columns. Public, no login. Education ₦100.5k–111.3k, Engineering ₦101.5k–112.3k, Medicine ₦160.5k–171.3k. |
| Usmanu Danfodiyo Univ, Sokoto (UDUSOK) | federal | **A** | `udusok.edu.ng/wp-content/uploads/2025/01/2024_2025-UG-Fees-Summary-final-1.pdf` | **Verified, extracted.** Office of the Bursar, "2024/2025 Schedule of Undergraduate Student Registration Charges". 80 programmes × 8 columns (UME, DE, 200, 300, 400, 500, 600, Spillover). e.g. B.A. English ₦81,060 UME / ₦72,660 returning; MBBS ₦124,260 UME. Extract locally with `pypdf` — WebFetch cannot read it. |
| University of Jos (UNIJOS) | federal | **B** | `www.unijos.edu.ng/fee-structure` (postgrad); `unijos.edu.ng/unijos-issues-registration-procedures-newly-admitted-students-20242025-session` (UG) | **Corrected:** `/fee-structure` is *postgraduate foreign* fees, 2022/23 — not UG. UG numbers exist only inside an official news post: 100L science ₦165k (incl. ₦25k lab) / non-science ₦140k; 200L ₦135k/₦110k; 300L+ ₦130k/₦105k. Own-domain and current (2024/25) but banded, not per-course. Note the cert only covers `www.` — use the www host. |
| University of Ilorin (UNILORIN) | federal | **B** | `unilorin.edu.ng/.../NEWLY-APPROVED-UNDERGRADUTE-CHARGES.pdf` | Extracted OK, but **2022/2023** session. 3 bands only (Science 138,240 fresh / Arts 133,440 / Health Sci 254,640). Live charges portal `uilugportal` did not resolve (DNS). |
| University of Uyo (UNIUYO) | federal | **B** | `uniuyo.edu.ng/.../fees-schedule-2020-2021.pdf` | Own-domain PDF but **2020/2021** — too stale to publish as current. |
| Federal Univ. of Technology, Akure (FUTA) | federal | **B** | `futa.edu.ng/home/newsd/232`, `/261` | Only 2014/15 and 2015/16 schedules public. Current UG fees portal-gated. ODL fees current but ODL only. |
| University of Port Harcourt (UNIPORT) | federal | **C** | `aris.uniport.edu.ng/feeSchedule` | Fee-schedule page exists but is a filter form — no amounts render without querying. |
| University of Calabar (UNICAL) | federal | **C** | `portal.unical.edu.ng` | Portal/login only. No public schedule. |
| Michael Okpara Univ. of Agric (MOUAU) | federal | **C** | `portal.mouau.edu.ng` | Portal only. |
| Federal Univ. of Agric, Abeokuta (FUNAAB) | federal | **C** | — | Only application (₦2k/₦3k) + hostel (₦70k–₦140k) fees public. No UG tuition schedule. |
| University of Benin (UNIBEN) | federal | **B** | `news.uniben.edu` | Official news confirms no increase + portal opening; totals (₦170k non-science / ₦190k science) reported via press, not an itemised own-domain schedule. |
| Univ. of Nigeria, Nsukka (UNN) | federal | **D** | — | Only aggregators; one faculty (Education, ₦173,640) circulating. |
| Nnamdi Azikiwe Univ (UNIZIK) | federal | **D** | — | Aggregators only (₦162.5k fresh / ₦95k returning + ₦65k acceptance). Needs own-domain confirmation. |

### Federal — remaining (slice 1)

| School | Tier | Source | Session | Notes |
|---|---|---|---|---|
| Air Force Institute of Technology, Kaduna (AFIT) | **A** | `afit.edu.ng/home/schedule-of-sundry-fees-for-2025-2026-academic-session/` | 2025/26 | HTML table, no login, no PDF parsing. Itemised per programme **and** level. Publishes a fresh page each session (22/23, 23/24, 25/26 all live) → longitudinal data. Tuition free; total built from named line items. Aerospace Eng 100L ₦136,300; Sciences 200L ₦74,500; Computing 400L ₦62,000. |
| Alex Ekwueme Federal Univ. Ndufu-Alike (AE-FUNAI) | **A** | `funai.edu.ng/news/schedule-of-students-charges-for-2025-2026-academic-session-2/` | 2025/26 | 17-page public PDF. Per-faculty, freshmen + returning blocks, ~8 line items each, plus a separated "third party charges" section with receiving account named. Agriculture ₦206,500 fresh / ₦77,300 returning; Bio Sciences ₦231,500 / ₦82,300. Separate public page for College of Medicine. Spreadsheet-export PDF — needs table parsing (pypdf works). |
| David Umahi Fed. Univ. of Health Sciences (DUFUHS) | B | `kdums.edu.ng/resources/2023_latest_school_fee.pdf` | 2023/24 | Itemised, 17 programmes, VC-signed (Medicine ₦1,030,000; Pharmacy/Nursing/MLS ₦730,000; Comp Sci ₦530,000). Downgraded: 3 sessions stale, and the domain serves a second file named `latest_school_fees_new.pdf` that is actually **older** (2022/23). Conflicting "latest" files. Tier A if refreshed. |
| Federal Univ. of Education Zaria (FUEZ) | B | `fuez.edu.ng/home/get_payment_structure_pdfdata` | Undated | Public no-login PDF with real amounts but only 6 rows, new students only, no session stated. Sci ₦68,500 / Arts ₦64,500 registration. |
| Adeyemi Fed. Univ. of Education (AFUED) | B | `afued.edu.ng/view_news.php?id=7` | 2025/26 | Only admission-adjacent fees public (₦2k screening, ₦25k/₦20k acceptance). Charges generated in portal. Legacy `aceondo.edu.ng/tuitions-payables/` now 404. |
| Admiralty Univ. of Nigeria (ADUN) | B | `adun.edu.ng/faq` | Undated | **Two official pages contradict each other.** FAQ gives faculty bands (₦450k–₦750k/session); the 25 Oct 2024 press release says tuition is *waived*, only ₦75k acceptance. Not safe to publish. |
| Alvan Ikoku Fed. Univ. of Education | C | — | — | FAQ links a Tuition & Fees page that doesn't exist; amounts behind ERP login. Apex domain serves mismatched TLS cert (CN: matantorah.org). |
| Federal University Lafia | C | `bur.fulafia.edu.ng` | — | Bursary site is a near-empty WordPress install (still has "Hello world!"). Only ₦15k acceptance / ₦2k screening public. |
| Federal University Lokoja | C | `fulokoja.edu.ng/news-flash.php?i=53` | 2025/26 | Publishes ₦20k acceptance; explicitly routes school charges through the portal. |
| Federal Univ. of Agriculture Zuru (FUAZ) | C | — | — | Registrar notice has no amounts; `/price-table` is an empty Joomla stub. |
| **Federal Univ. of Education Kano (YMSFUEK)** | C | — | — | ⚠️ **Do not source from this domain.** Old domain `fcekano.edu.ng` is NXDOMAIN; successor `ymsfuek.edu.ng` is partially compromised — serving injected Thai casino/slot SEO spam under `/about/` and `/video/`. |
| Federal Univ. of Agriculture Bassambiri (FUAB) | D | — | — | Founded 2023, first intake 2025/26. Commercial template; "Tuition & Fees" nav links dead (406); footer still says "Yarra Park, Melbourne, Australia". |
| Federal Univ. of Agriculture Mubi (FUAMB) | D | — | — | Founded 2023. "Competitive tuition rates", no amounts anywhere. |

## Method

Domain-restricted search per school (`allowed_domains: ["<school>.edu.ng"]`) for
"school fees schedule of charges undergraduate", then WebFetch the hit to confirm
amounts actually render publicly. Aggregator blogs are deliberately excluded —
they disagree with each other and cite no primary source.

## Status

Swept so far: 13 of 130. Remaining: 37 federal, 44 state, 36 private.
