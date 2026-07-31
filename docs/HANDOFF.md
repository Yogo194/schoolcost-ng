# Handoff — QA pass and trust fixes (2026-07-30)

Context for whoever picks this up next. Written after a production-readiness QA
pass on SchoolCost NG.

## TL;DR

Ran a full QA pass before go-live. Found and fixed two defects that were
misrepresenting money to users. Launch state is **GO WITH CONDITIONS**. Build is
green, tree is clean, nothing pushed.

## Commits made in this session

| Commit | What |
|---|---|
| `9e21758` | Stop unverified fees from being presented as verified, plus soft-404 fix |
| `7bde19a` | Show per-level fee totals on school profiles |

`9130307` ("Wire admin fee and institution management") and `99e0583` came from a
different session running concurrently, not from this work.

**Nothing has been pushed.** 62 commits sit unpushed on `main`. Pushing deploys
to Vercel production, and per `AGENTS.md` that requires explicit instruction.

## Defect 1 (P0) — unverified fees labelled "verified"

**Symptom:** 25 schools and 720 published rows with zero price-comparable fees
rendered "Courses with verified fees", "Verified compulsory fees" and "Latest
verified session", plus a green "Official source" badge. Included `reported`/low
schools such as Veritas and Federal University Lafia.

**Root cause:** `getSchoolFeeCoverage()` fell back to a `COURSE_DEFAULT` constant
for any school not hardcoded in `BAND_SCHOOLS`, and that constant hardcoded
"verified" language regardless of the school's real trust tier.

**Secondary cause, also fixed:** the profile page decided verified vs reported
from `source_type === "community_reported"`. That is the wrong signal. A row can
carry `source_type = official_school_source` while being `verification_status =
reported`, which is exactly how Augustine slipped through. Now keyed off the
trust tier.

**Fix:**
- `lib/fees/school-fee-coverage.ts` — added `COURSE_REPORTED`; `getSchoolFeeCoverage(slug, { hasPriceComparableFees })`
- `lib/fees/get-school-profile.ts` — computes `hasPriceComparableFees` once from `canUseForPriceComparison`
- `lib/mock/school-profile.ts` — new `has_price_comparable_fees` field on `SchoolProfile`
- `app/(public)/schools/[slug]/page.tsx` — uses the trust tier, not `source_type`
- `components/public/SchoolStatsBar.tsx` — neutral defaults so no caller can accidentally claim "verified"

Hardcoded `BAND_SCHOOLS` copy still wins, so per-school provenance wording
(UNILAG, UI, OAU, Adekunle Ajasin, etc.) is preserved.

## Defect 2 (P0) — every level showed the Year 1 fee

**Symptom:** on school profiles, 100L through 400L all displayed the same amount.

**Root cause:** `lib/fees/get-school-profile.ts` mapped
`compulsory_total: Number(row.first_year_total)`. `first_year_total` is the Year 1
figure on every row by design, so it flattened all levels.

**Evidence:** verified against the official Augustine 2026/2027 PDF at
`public/evidence/fees/augustine-2026-2027-fee-schedule.pdf`.

| Religious Studies | Y1 | Y2 | Y3 | Y4 |
|---|---|---|---|---|
| PDF (truth) | 976,650 | 990,800 | 1,017,750 | 1,246,750 |
| Site before fix | 976,650 | 976,650 | 976,650 | 976,650 |

A 400L student saw a figure understated by ₦270,100.

**Fix:** read `compulsory_total`. Corrects **243 rows across 14 schools**.
Checked before changing: no published row has a null or zero `compulsory_total`,
so nothing falls back to ₦0, and the 100L stats-bar range is unchanged because
`compulsory_total == first_year_total` on fresher rows.

**Important:** this was NOT a seeding bug. The seed scripts write correct
per-level data. Only the display layer read the wrong column.

## Defect 3 (P1) — soft 404s

Unknown school slugs and unknown or mismatched fee ids returned **HTTP 200** with
a "not found" body. With the sitemap and robots work already shipped, that lets
search engines index unlimited nonexistent school URLs.

Fixed with `notFound()` in both dynamic routes plus a branded
`app/(public)/not-found.tsx` that renders inside the public layout. All three
cases now return 404.

## Verified state

- `npx tsc --noEmit` → exit 0
- `npm run build` → compiled successfully, 25/25 pages
- `npx --yes tsx scripts/audit-fee-trust.ts --strict` → **0 hard issues**, 28 warnings (all "school has fees but no price-comparable row")
- Directory three-state logic re-verified against database truth; zero false "No fee record yet"
- Compare trust gating verified empirically (untrusted schools correctly excluded)

## The trust rule — do not weaken this

`lib/fees/trust.ts`:

```ts
canUseForPriceComparison(status, confidence) =>
  confidence !== "low" && (status === "officially_verified" || status === "community_verified")
```

Price-led surfaces (directory "From ₦…", homepage lowest/recent, compare
"lowest") must only use rows that pass. Reported / outdated / low rows may still
be displayed, but must never look verified or win a lowest-cost highlight.

Enum values are `officially_verified | community_verified | reported | outdated |
disputed`. There is no `verified`.

Note: compare enforces the same rule inline as a query filter in
`lib/fees/get-compare-options.ts:69-70` rather than importing the helper. Correct
today, drift risk later. Worth unifying.

## Open work, highest value first

**1. Trust reclassification (biggest product win, needs a human decision).**
28 of 42 schools with published fees show "Fees listed" instead of a price. The
audit prints the evidence host per school and exposes an inconsistency: schools
whose evidence sits on their own institution domain are split between
`officially_verified/high` and `reported/medium` for no clear reason.

| School | Evidence host | Current |
|---|---|---|
| Lead City | lcu.edu.ng | officially_verified / high |
| Pan-Atlantic | pau.edu.ng | officially_verified / high |
| Redeemer's | run.edu.ng | officially_verified / high |
| Godfrey Okoye | gouni.edu.ng | reported / medium |
| Nile | nileuniversity.edu.ng | reported / medium |
| Salem | salemuniversity.edu.ng | reported / medium |
| Augustine | own PDF, verified exact | reported / medium |

Roughly 20 schools look under-claimed. Upgrading them is not weakening the rule,
it is applying it to evidence that already qualifies. Verify each evidence URL
before upgrading. Start with Augustine, Elizade and Godfrey Okoye, whose PDFs are
in `public/evidence/fees/` and can be checked exactly.

The rule is working correctly where it matters: Veritas is sourced from
`infoshoutloud.com.ng`, FU Lafia and UNIZIK from `myschool.ng`, FUTA from
`allschool.ng`. All correctly held at `reported`/low.

`scripts/audit-fee-trust.ts` (read-only) and `scripts/fix-fee-trust.ts` (writes)
already exist for this. `fix-fee-trust.ts` has NOT been run.

**2. 608 rows with contradictory metadata.** `source_type =
official_school_source` while `verification_status = reported`. Cosmetic now that
the copy is fixed, but it will confuse the next person writing a seed script.
Same underlying question as item 1.

**3. Fee source audit is incomplete.** See `docs/fee-source-audit.md`. Only 26 of
130 schools audited before the session hit its usage limit. 104 remain, mostly
state and private. Private universities have the highest hit rate because they
publish fees to market themselves; brand-new federal universities have the lowest.

Four confirmed Tier A sources so far (public, current, itemised, no login):
- **Bayero University Kano** — `mybuk2.buk.edu.ng/ug/schedule_of_fees.php`, 145 programmes
- **UDUSOK** — Bursar PDF, 2024/25, 80 programmes x 8 level columns
- **AFIT Kaduna** — HTML table, 2025/26, per programme and level, new page each session
- **AE-FUNAI** — 17-page PDF, 2025/26, per-faculty with named line items

## Gotchas worth knowing

- **Fee PDFs cannot be read by WebFetch.** It returns raw binary. Extract locally with `pypdf` (already installed).
- **`ymsfuek.edu.ng` (Federal University of Education Kano) is partially compromised** — serving injected Thai casino/slot SEO spam under `/about/` and `/video/`. Do not scrape it. Its old domain `fcekano.edu.ng` is NXDOMAIN.
- **`unilag.edu.ng` TLS cert only covers `www.`** — use the www host or the fetch fails.
- **Admiralty University contradicts itself.** Its FAQ lists ₦450k–₦750k faculty bands; its own Oct 2024 press release says tuition is waived with only a ₦75k acceptance fee. Not safe to publish either way.
- **DUFUHS filename trap.** `latest_school_fees_new.pdf` is actually OLDER (2022/23) than `2023_latest_school_fee.pdf`. Do not ingest by filename.
- `/tmp/` is now gitignored. A scratch file in there was breaking `next build`.

## QA coverage limitation

The pass had **no browser automation available**. Server-rendered HTML, code and
database were tested rigorously. NOT tested: client-side search/filter/tabs,
mobile viewport rendering, throttled network. Those were marked not-tested rather
than passed by inference. Worth covering before heavy traffic.
