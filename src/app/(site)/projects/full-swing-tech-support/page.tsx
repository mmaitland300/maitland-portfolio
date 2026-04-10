import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, AlertTriangle, CheckCircle2, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MainContentAnchor } from "@/components/layout/main-content-anchor";
import { TriageFlowDiagram } from "@/components/case-studies/triage-flow-diagram";
import { CaseStudyEvidenceFooter } from "@/components/sections/case-study-evidence-footer";
import { ProjectComments } from "@/components/sections/project-comments";
import { getProjectBySlug } from "@/content/projects";

/** Same asset as the Full Swing project card thumbnail. */
const TRIAGE_ARTIFACT_SRC = "/images/projects/full-swing-triage-artifact.svg";

export const metadata: Metadata = {
  title: "Full Swing Technical Support Case Study",
  description:
    "Troubleshooting case study from simulator support at Auxillium: Full Swing focus, with Laser Shot and E6 Golf from TruGolf on shared installs. Triage, failure isolation, and tradeoffs.",
};

export const dynamic = "force-dynamic";

const failureModes = [
  "Calibration drift impacting ball/club data accuracy",
  "Licensing and activation failures after environment changes",
  "Display and graphics mismatches across GPU/OS updates",
  "Network/configuration instability affecting software behavior",
  "Peripheral and Windows conflicts causing intermittent faults",
];

const workflow = [
  {
    step: "1. Scope and classify symptoms",
    detail:
      "Separate user-reported symptoms from underlying system layers (hardware, licensing, network, OS, graphics) to avoid premature root-cause assumptions.",
  },
  {
    step: "2. Build a reproducible baseline",
    detail:
      "Capture current environment state and reproduce under controlled conditions to reduce noise and identify which variables are actually causal.",
  },
  {
    step: "3. Isolate likely failure branches",
    detail:
      "Use branch-based diagnostics rather than ad hoc guessing: test one subsystem at a time and eliminate competing hypotheses with evidence.",
  },
  {
    step: "4. Apply lowest-risk corrective action",
    detail:
      "Prioritize reversible fixes first, then progress to deeper remediations only when diagnostics confirm they are necessary.",
  },
  {
    step: "5. Document and codify pattern",
    detail:
      "Convert resolved incidents into repeatable troubleshooting paths so similar issues are solved faster and with higher consistency.",
  },
];

const representativeIncident = [
  {
    label: "Symptom",
    detail:
      "Customer reports inconsistent launch and spin reads after a software/OS update window, with occasional sessions that appear normal and then degrade.",
  },
  {
    label: "Candidate causes",
    detail:
      "Calibration state drift, graphics/driver mismatch, peripheral input instability, and environment changes introduced during updates.",
  },
  {
    label: "Branch elimination path",
    detail:
      "Reproduce in a controlled baseline, then isolate one subsystem at a time (calibration checks, display pipeline checks, peripheral checks) to remove non-causal branches.",
  },
  {
    label: "Root cause pattern",
    detail:
      "A mixed-state configuration where calibration assumptions and post-update environment behavior no longer matched clean baseline expectations.",
  },
  {
    label: "Fix pattern",
    detail:
      "Apply reversible corrective actions in order (restore known-good settings, recalibrate in sequence, re-verify environment) before deeper changes.",
  },
  {
    label: "What changed after",
    detail:
      "Issue handling became faster on similar escalations because the incident was converted into a repeatable checklist rather than a one-off memory.",
  },
];

const branchEliminationRows = [
  {
    symptom: "Intermittent misreads after update window",
    plausibleLayers: "Calibration + GPU/driver + OS mixed state",
    ruledOutBy: "Controlled baseline and display pipeline checks",
    finalPattern: "Mixed-state config after update + calibration mismatch",
  },
  {
    symptom: "Tracking drops only in specific sessions",
    plausibleLayers: "Licensing timeout + network path + peripheral state",
    ruledOutBy: "Connectivity and licensing checks stayed stable",
    finalPattern: "Peripheral/OS interaction causing intermittent state drift",
  },
];

export default function FullSwingCaseStudyPage() {
  const project = getProjectBySlug("full-swing-tech-support");
  if (!project) {
    throw new Error("Missing project data for full-swing-tech-support");
  }

  return (
    <div className="py-24">
      <MainContentAnchor />
      <div className="mx-auto max-w-4xl px-6">
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} /> Back to projects
        </Link>

        <header className="mb-12">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant="secondary">Technical Support</Badge>
            <Badge variant="secondary">Troubleshooting</Badge>
            <Badge variant="secondary">Failure Analysis</Badge>
            <Badge variant="secondary">Operational Workflow</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Full Swing Technical Support Case Study
          </h1>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            I work this role at Auxillium, which provides technical support for
            Full Swing simulator customers. The examples here center on that
            stack; many of the same environments also include Laser Shot or E6
            Golf from TruGolf, supported in the same workflow. The case study is
            about how multi-layer issues get diagnosed under tight constraints,
            where hardware, software, networking, and operating-system behavior
            frequently overlap.
          </p>
        </header>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-semibold">Problem Context</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Incidents were rarely single-point failures. Most escalations
            involved multiple plausible causes and partial signals, creating a
            high risk of quick but unstable fixes. The key challenge was
            identifying root cause with enough confidence to prevent recurrence.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">Common Failure Modes</h2>
          <ul className="space-y-2">
            {failureModes.map((mode) => (
              <li
                key={mode}
                className="rounded-lg border border-border bg-card/30 px-4 py-3 text-sm text-muted-foreground"
              >
                {mode}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <div className="mb-3 flex items-center gap-2">
            <Wrench className="h-5 w-5 text-brand-cyan" />
            <h2 className="text-xl font-semibold">Diagnostic Workflow</h2>
          </div>
          <figure className="mb-8 overflow-hidden rounded-lg border border-border bg-muted/20">
            <div className="relative aspect-[1200/675] w-full">
              <Image
                src={TRIAGE_ARTIFACT_SRC}
                alt="Branch-based triage workflow: classify symptoms, build baseline, branch testing, apply fix, verify, and document"
                fill
                unoptimized
                className="object-contain object-center p-2 sm:p-4"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
            <figcaption className="border-t border-border bg-card/50 px-4 py-3 text-center text-xs leading-relaxed text-muted-foreground">
              Same overview as the project card preview: a representative
              branch-based triage artifact for multi-layer simulator support
              (not an official Full Swing diagram).
            </figcaption>
          </figure>
          <p className="mb-4 text-sm text-muted-foreground">
            Below is a simplified linear view of the same idea, useful when you
            want a quick read of the end-to-end path.
          </p>
          <TriageFlowDiagram />
          <div className="mt-8 space-y-4">
            {workflow.map((item) => (
              <div key={item.step}>
                <h3 className="text-sm font-medium text-foreground">{item.step}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-2 text-xl font-semibold">
            Representative Incident Pattern
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            This walkthrough reflects a recurring class of escalations, not a
            single customer transcript. Details are intentionally anonymized and
            scoped to troubleshooting patterns I can defend publicly.
          </p>
          <div className="space-y-3">
            {representativeIncident.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border bg-card/30 px-4 py-3 text-sm"
              >
                <span className="font-medium text-foreground">{item.label}: </span>
                <span className="text-muted-foreground">{item.detail}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 overflow-x-auto rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-3 text-xl font-semibold">Branch elimination table</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            A compact view of how plausible layers are ruled out before locking a
            final cause pattern.
          </p>
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Symptom</th>
                <th className="py-2 pr-4 font-medium">Plausible layers</th>
                <th className="py-2 pr-4 font-medium">What ruled out branches</th>
                <th className="py-2 font-medium">Final cause pattern</th>
              </tr>
            </thead>
            <tbody>
              {branchEliminationRows.map((row) => (
                <tr key={row.symptom} className="border-b border-border/60 align-top">
                  <td className="py-3 pr-4 text-muted-foreground">{row.symptom}</td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {row.plausibleLayers}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{row.ruledOutBy}</td>
                  <td className="py-3 text-muted-foreground">{row.finalPattern}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-3 text-xl font-semibold">Tradeoffs</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The consistent tradeoff was speed versus reliability. Fast,
            one-off fixes could close tickets quickly but often increased
            repeat incidents. A structured, reproducible triage path required
            more discipline up front, but produced better long-term resolution
            quality and lower ambiguity on future cases.
          </p>
        </section>

        <CaseStudyEvidenceFooter
          project={project}
          statusIcon={<CheckCircle2 className="h-5 w-5 text-emerald-400" />}
        />

        <Suspense fallback={null}>
          <ProjectComments
            projectSlug="full-swing-tech-support"
            currentPath="/projects/full-swing-tech-support"
          />
        </Suspense>
      </div>
    </div>
  );
}
