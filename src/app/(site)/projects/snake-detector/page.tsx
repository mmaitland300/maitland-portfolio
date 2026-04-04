import type { Metadata } from "next";
import Link from "next/link";
import { MainContentAnchor } from "@/components/layout/main-content-anchor";
import { Suspense } from "react";
import {
  ArrowLeft,
  BarChart3,
  FlaskConical,
  ListChecks,
  AlertTriangle,
  ExternalLink,
  Github,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProjectComments } from "@/components/sections/project-comments";
import { MlEvalWorkflowDiagram } from "@/components/case-studies/ml-eval-workflow-diagram";
import { getProjectBySlug } from "@/content/projects";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Snake Detector: Bounded CV Demo",
  description:
    "A bounded snake vs no-snake demo with reproducible training workflow, explicit limits, and proof artifacts. Not species ID or field-ready wildlife classification.",
};

export const dynamic = "force-dynamic";

const artifactTable = [
  {
    artifact: "Stratified train/val split",
    purpose:
      "Keep class ratios stable so metrics reflect generalization, not a lucky split.",
  },
  {
    artifact: "Augmentation policy (logged)",
    purpose:
      "Make image-level changes comparable across runs instead of silently drifting.",
  },
  {
    artifact: "Confusion matrix + structured error review",
    purpose:
      "Surface which classes get confused before touching model depth or width.",
  },
  {
    artifact: "Run folder (config + metrics snapshot)",
    purpose:
      "Reproduce any reported number without guessing which code version produced it.",
  },
];

const ctaBaseClassName =
  "inline-flex items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px";
const ctaDefaultClassName =
  "bg-primary px-2.5 py-2 text-primary-foreground";
const ctaOutlineClassName =
  "border-border bg-background px-2.5 py-2 hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50";
const ctaGhostClassName =
  "px-2.5 py-2 text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/50";

export default function SnakeDetectorCaseStudyPage() {
  const project = getProjectBySlug("snake-detector");
  if (!project?.github) {
    throw new Error("Missing project data for snake-detector");
  }
  const demoUrl = project.demo;

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

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant="secondary">Computer Vision</Badge>
            <Badge variant="secondary">CNN</Badge>
            <Badge variant="secondary">Evaluation</Badge>
            <Badge variant="secondary">Experiment</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Snake Detector: a bounded computer-vision demo with reproducible proof
          </h1>
          <p className="mt-4 max-w-3xl text-muted-foreground leading-relaxed">
            This project started as a model experiment. The workflow, dataset
            boundary, and limitations are explicit so the story stays honest for
            readers of the case study and anyone reproducing from the repo.
            {demoUrl
              ? " A live demo runs on a separate host so you can try uploads in the browser."
              : " Proof lives in this case study and the training repository, with a reproducible path from the code."}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {demoUrl ? (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  ctaBaseClassName,
                  ctaDefaultClassName,
                  "gap-2"
                )}
              >
                <ExternalLink size={16} />
                Try live demo
              </a>
            ) : (
              <p className="max-w-md text-sm text-muted-foreground">
                This build does not link to a hosted demo. Use the proof package
                and repository below for artifacts and reproduction.
              </p>
            )}
            <a
              href="#proof-package"
              className={cn(ctaBaseClassName, ctaOutlineClassName)}
            >
              View proof package
            </a>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(ctaBaseClassName, ctaGhostClassName)}
            >
              <Github size={16} className="mr-1.5" />
              Code
            </a>
          </div>
        </header>

        <section
          className="mb-10 rounded-xl border border-amber-500/35 bg-amber-500/5 p-6"
          aria-labelledby="known-limits-heading"
        >
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
            <h2 id="known-limits-heading" className="text-xl font-semibold">
              Known limits
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {project.knownLimits}
          </p>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-3 text-xl font-semibold">Try it</h2>
          {demoUrl ? (
            <>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Open the{" "}
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-cyan-400 underline-offset-4 hover:underline"
                >
                  live demo
                </a>{" "}
                in a new tab. Upload a photo and get a bounded snake vs no-snake
                prediction from the current public build.
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Note: the demo may take a few seconds to wake on first load while
                the host cold-starts.
              </p>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground">
              Use the{" "}
              <a
                href="#proof-package"
                className="text-cyan-400 underline-offset-4 hover:underline"
              >
                proof package
              </a>{" "}
              and training repository to inspect artifacts and reproduce evaluation
              runs in your own environment.
            </p>
          )}
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-3 text-xl font-semibold">What the demo proves</h2>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            {demoUrl ? (
              <li>
                <span className="font-medium text-foreground/90">
                  Deployment and inference path:
                </span>{" "}
                a working public endpoint with bounded inputs and outputs.
              </li>
            ) : (
              <li>
                <span className="font-medium text-foreground/90">
                  Deployment and inference path:
                </span>{" "}
                there is no in-browser demo linked from this site; scripts and
                saved artifacts in the repository define bounded inference and how
                to run it.
              </li>
            )}
            <li>
              <span className="font-medium text-foreground/90">
                Reproducibility:
              </span>{" "}
              the training and evaluation loop is scripted; artifacts and the repo
              back the story on this page.
            </li>
            <li>
              It does{" "}
              <span className="font-medium text-foreground/90">not</span> prove
              field-ready wildlife identification, species-level reliability, or
              licensing-cleared training data suitable for commercial redistribution.
            </li>
          </ul>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-3 text-xl font-semibold">How to use it</h2>
          {demoUrl ? (
            <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
              <li>Upload one image through the demo UI.</li>
              <li>Review the prediction and confidence framing shown in the app.</li>
              <li>
                Read the known limits above before trusting the output for anything
                beyond a narrow experiment.
              </li>
            </ol>
          ) : (
            <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
              <li>
                Open the case study proof package and training repo to understand
                splits, metrics, and limits.
              </li>
              <li>
                Reproduce or adapt the workflow locally from the repo when you need
                numbers you can defend.
              </li>
              <li>
                Cross-check results against the known limits before treating output
                as reliable outside a narrow experiment.
              </li>
            </ol>
          )}
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <div className="mb-3 flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-cyan-400" />
            <h2 className="text-xl font-semibold">Why the project matters</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Most of the value is in dataset hygiene, fixed evaluation splits,
            confusion-driven review, and refusing to let aggregate accuracy hide
            weak classes. That discipline transfers directly to larger vision
            projects where the failure mode is silent, not loud.
          </p>
        </section>

        <section
          id="proof-package"
          className="mb-10 scroll-mt-16 rounded-xl border border-border bg-card/40 p-6"
        >
          <div className="mb-3 flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-purple-400" />
            <h2 className="text-xl font-semibold">Proof package (artifacts)</h2>
          </div>
          <MlEvalWorkflowDiagram />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Artifact</th>
                  <th className="py-2 font-medium">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {artifactTable.map((row) => (
                  <tr key={row.artifact} className="border-b border-border/60">
                    <td className="py-3 pr-4 font-medium text-foreground">
                      {row.artifact}
                    </td>
                    <td className="py-3 text-muted-foreground">{row.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card/40 p-6">
          <div className="mb-3 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-semibold">Where it stands</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The repo holds the full training flow, split configuration, and
            evaluation scripts.
            {demoUrl
              ? " The live demo is intentionally narrow so visitors can try the behavior without mistaking it for a general-purpose classifier."
              : " This portfolio build emphasizes artifacts and reproducibility from the repository rather than a linked demo."}
          </p>
        </section>

        <Suspense fallback={null}>
          <ProjectComments
            projectSlug="snake-detector"
            currentPath="/projects/snake-detector"
          />
        </Suspense>
      </div>
    </div>
  );
}
