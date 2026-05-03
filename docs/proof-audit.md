# Portfolio Proof Audit

This document is the **execution gate for messaging changes**. Prefer **softening claims over inventing placeholder proof**.

**Shared intent:** The README **Goals and intent** section states the same bar in one place for contributors and future you: evidence-backed positioning, featured-vs-experiment separation, and production-shaped defaults. This file is the **checklist and surface map** for keeping the live site honest as copy and data evolve.

**Historical baseline:** The audit table in [Living audit (March 2026)](#living-audit-march-2026) replaces the February 2026 snapshot. Earlier rows that cited removed copy (for example hero "build log" wording, blog "Notes From the Build," or missing CI links on the proof strip) reflected an older state and are **not** carried forward verbatim.

**Homepage composition:** The live homepage is intentionally minimal (Hero, ProofStrip, FeaturedProjects only). That is a **product choice**, not a deferred structural fix.

---

## Current status (summary)

What changed since the original baseline:

- **Hero** - No longer frames the site as an active "build log"; headline and body tie Auxillium/Full Swing support to web and audio work explicitly. A short line under the body links **case studies** and **engineering notes** as where constraints, evidence, and limits are documented.
- **Proof strip** - Portfolio tile **surfaces CI and test links** via `proofLinks` and `linkPick` in `proof-strip.tsx` (artifact, decision record, CI or test). Full Swing and StringFlux tiles still summarize; deep proof stays on case studies.
- **Case studies** - StringFlux includes a **Validation boundary** block (true now / being validated / not yet claimed). Full Swing includes a **hypothesis elimination** table. Portfolio case study **proof links** include CI workflow, env tests, contact tests, and case study + decision record.
- **Projects page** - Copy and metadata separate **featured case studies** from **experiments** in the header and description.
- **About** - Section title and lead are **method-first** ("Systems Diagnosis, Then Delivery" and layered-failure framing).
- **Resume** - **Tiered skills** (`core` / `working` / `familiar`) include **C++, JUCE, and DSP** under Production / Working.
- **Blog listing** - Positioning is outward-facing ("Engineering Notes and Decision Records," decision records and troubleshooting), not in-progress diary framing.

**Still optional (not blocking):** Formal **post-type taxonomy** in MDX; tightening `knownLimits` / summary density; regenerating **`public/resume.pdf`** to match `resume.ts` (source of truth is `resume.ts`; see README Content Management and Deferred follow-up).

---

## Locked data contracts (before implementation)

- `status`: `"in-progress" | "operational" | "shipped" | "archived"`
- `proofLinks`: `Array<{ label: string; href: string; kind?: "repo" | "test" | "ci" | "post" | "artifact" }>`

## Audit row schema

Each row:

`surface -> claim -> current proof -> remaining gap (if any) -> suggested action`

## Living audit (March 2026)

| Surface | Claim | Current proof | Remaining gap | Suggested action |
| --- | --- | --- | --- | --- |
| `hero.tsx` | Multi-domain identity (support + web + DSP + music) reads as one coherent story | Pill, name, discipline h2, Auxillium/Full Swing body, StringFlux + site + music; line below body links **case studies** and **engineering notes** as proof surfaces | None material | keep |
| `about/page.tsx` + `about-content.tsx` | About frames diagnosis-and-delivery method | Method-led title, opening on multi-layer failures, Auxillium context | None material | keep |
| `proof-strip.tsx` | Full Swing: repeatable triage under constraints | Links to case study + playbook; case study includes workflow, incident pattern, branch table | Strip is still a summary; artifact detail is on the case study page | keep |
| `proof-strip.tsx` | Portfolio: production safeguards and verifiable automation | Copy mentions CI + smoke; `proofLinks` + `linkPick` expose artifact, decision record, **CI**, **tests** | None material | keep |
| `proof-strip.tsx` | StringFlux: bounded DSP / oversampling claims | Copy defers benchmarks; links to case study + decision log; case study has validation boundary + `knownLimits` in data | Strip does not inline validation boundary (by design) | keep |
| `projects/page.tsx` | Strongest evidence is visually and verbally separated from experiments | Section header + metadata describe featured-first vs experiments | None material | keep |
| `resume.ts` | Skills match claimed strengths | Tiered skills; C++/JUCE/DSP in working tier | Summary is still dense | optional: shorten summary |
| `projects/portfolio-site/page.tsx` | Portfolio case study matches repo reality | Safeguards list, architecture artifact, full `proofLinks` (case study, decision record, tests, CI) | `knownLimits` still notes broad dynamic routes | optional: soften when narrowed |
| `projects/full-swing-tech-support/page.tsx` | Multi-layer diagnosis is defensible publicly | Workflow, incident pattern, hypothesis elimination table, evidence links | None material | keep |
| `projects/stringflux/page.tsx` | Engineering claims are grounded and bounded | Architecture, constraints, tradeoffs, validation checks, **validation boundary**, shared evidence footer | None material | keep |
| `blog/page.tsx` | Blog reads as useful engineering writing, not a dev diary | Title, description, and list alignment with decision records / troubleshooting | No formal post-type taxonomy in frontmatter | optional: future taxonomy |
| `projects.ts` + `projects/snake-detector/page.tsx` | Snake Detector stays an **experiment**: bounded snake vs no-snake demo, honest limits, proof package + repo; not species ID or field-ready claims | Case study sections order, known-limits callout, `proofLinks` (case study + repo), `NEXT_PUBLIC_SNAKE_DEMO_URL` (prefer direct `*.hf.space` app URL in `.env.example`) | Without URL: **shipped**, no Try demo CTA, copy stays accurate without a demo link; with URL: **operational**, demo opens in new tab | keep |

## Phase 2 implementation guardrail

After `Project` model changes, both must pass:

- `npm test`
- `npm run build`

## Scope guardrail

Do not rewrite experiment projects during focused proof passes unless they block shared components or tests.

## Deferred follow-up

- `public/resume.pdf` is intentionally lagging behind current `src/content/resume.ts` copy. The `/resume` page is driven by `resume.ts`; the PDF download is a convenience export and may be stale until regenerated.
- PDF regeneration/sync is deferred to a dedicated change set so proof and content edits stay reviewable. **Also documented in README** under Content Management. After editing `resume.ts`, run **`npm run resume:pdf`** (local server required) to refresh `public/resume.pdf` from **`/resume/print`** (lives under `src/app/resume/print/` with `resume/layout.tsx` skipping site chrome for that path only).
