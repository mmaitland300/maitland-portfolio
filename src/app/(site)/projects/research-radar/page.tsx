import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowLeft,
  BarChart3,
  ExternalLink,
  Github,
  Microscope,
  Network,
  SearchCheck,
  Sparkles,
} from "lucide-react";
import { MainContentAnchor } from "@/components/layout/main-content-anchor";
import { ProjectComments } from "@/components/sections/project-comments";
import { CaseStudyEvidenceFooter } from "@/components/sections/case-study-evidence-footer";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getProjectBySlug } from "@/content/projects";
import { cn } from "@/lib/utils";

const ARTIFACT_SRC = "/images/projects/research-radar-artifact.svg";

const mainSurfaces = [
  {
    title: "Ranked recommendations",
    detail:
      "Emerging, bridge, and undercited feeds come from materialized ranking runs instead of ad hoc front-end sorting, so the current ranking version and reasons stay inspectable.",
  },
  {
    title: "Paper detail with similar papers",
    detail:
      "Each paper detail page exposes metadata plus embedding-backed similar papers. That similarity layer is useful and real, but it is still separate from the default family ranking.",
  },
  {
    title: "Trends inside the curated slice",
    detail:
      "The trends surface stays scoped to the current corpus policy rather than pretending to summarize the whole field from generic topic counts.",
  },
  {
    title: "Evaluation as transparency",
    detail:
      "The evaluation page compares ranked output against citation- and date-ordered baselines so visitors can inspect list behavior without mistaking proxy metrics for universal relevance proof.",
  },
];

const technicalPoints = [
  {
    title: "Stable ranking seam first",
    detail:
      "The durable product seam is versioned ranking runs plus per-signal rows in Postgres. That makes the prototype explainable even while some ML work is still changing.",
  },
  {
    title: "Product, API, and pipeline are separate on purpose",
    detail:
      "The live app stays its own deployment, while the portfolio links out to it. The architecture split is clean: Next.js web, FastAPI API, Postgres with pgvector, and a Python pipeline for ingest, embeddings, ranking, and clustering.",
  },
  {
    title: "Experimental work is visible, not overstated",
    detail:
      "bridge_score is persisted and inspectable, but the default bridge weight remains 0.0 because current geometry still does not produce a clearly distinct bridge head. semantic_score stays null in ranking rather than being faked.",
  },
];

const screenshotGallery = [
  {
    title: "Recommended: emerging",
    src: "/images/projects/research-radar/recommended-emerging.png",
    route: "/recommended?family=emerging",
    why: "Best first screenshot for the core value proposition: materialized recommendations with visible reasoning.",
    alt: "Research Radar recommended emerging page showing ranked paper cards with visible signal breakdowns",
  },
  {
    title: "Evaluation",
    src: "/images/projects/research-radar/evaluation-emerging.png",
    route: "/evaluation?family=emerging",
    why: "Shows the product's honesty. The page makes comparison and proxy-metric boundaries visible instead of hiding them.",
    alt: "Research Radar evaluation page comparing ranked output against citation and date baselines",
  },
  {
    title: "Trends",
    src: "/images/projects/research-radar/trends.png",
    route: "/trends",
    why: "Useful for showing the prototype is not only a feed: it also exposes topic momentum inside the curated corpus slice.",
    alt: "Research Radar trends page showing topic momentum inside the curated corpus slice",
  },
  {
    title: "Paper detail with similar papers",
    src: "/images/projects/research-radar/paper-detail-similar.png",
    route: "/papers/https%3A%2F%2Fopenalex.org%2FW3093121331",
    why: "Paper detail with metadata and embedding-backed similar papers (GiantMIDI Piano example).",
    alt: "Research Radar paper detail page for GiantMIDI Piano showing metadata and similar papers",
  },
  {
    title: "Bridge family (experimental)",
    src: "/images/projects/research-radar/recommended-bridge-experimental.png",
    route: "/recommended?family=bridge",
    why: "Bridge family is experimental and structurally informed, not yet a clearly distinct production-ready family.",
    alt: "Research Radar bridge recommendation page showing bridge scores with experimental framing",
  },
];

const currentState = {
  stable: [
    "Heuristic ranking is the stable core, and ranking runs are materialized with inspectable signal breakdowns.",
    "bridge_score is real and inspectable in the data model.",
    "Paper detail, trends, and evaluation are implemented product surfaces rather than roadmap-only promises.",
  ],
  experimental: [
    "Bridge recommendations are currently structural experimental reordering, not a clearly separate family.",
    "The weighted harness exists, but weighted experiments on the current geometry did not produce a distinct bridge head.",
    "The next likely bridge direction is neighbor-based signal plus tighter eligibility and gating, not more weight on the current setup.",
  ],
  caveats: [
    "semantic_score remains null in ranking.",
    "Default production bridge weight should stay 0.0.",
    "Bootstrap sources are still narrower in code than the long-term corpus brief.",
  ],
};

const lessonsLearned = [
  "A ranking product gets more credible when versioning and explanation land before more sophisticated modeling.",
  "Keeping experimental bridge behavior visible but unweighted is better than burying uncertainty behind a confident-looking feed.",
  "Evaluation pages earn trust when they frame proxy metrics as debugging aids rather than as universal quality proof.",
];

export const metadata: Metadata = {
  title: "Research Radar: Explainable Discovery Prototype",
  description:
    "Case study for Research Radar, an explainable paper-discovery prototype for MIR and audio ML papers with ranked feeds, similarity, trends, and transparent evaluation.",
};

export const dynamic = "force-dynamic";

function buildLiveRoute(demoUrl: string | undefined, route: string) {
  if (!demoUrl || route.includes("{")) {
    return null;
  }

  try {
    return new URL(route, demoUrl).toString();
  } catch {
    return null;
  }
}

export default function ResearchRadarCaseStudyPage() {
  const project = getProjectBySlug("research-radar");
  if (!project?.github) {
    throw new Error("Missing project data for research-radar");
  }

  const liveDemoUrl = project.demo;

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
            <Badge variant="secondary">Next.js</Badge>
            <Badge variant="secondary">FastAPI</Badge>
            <Badge variant="secondary">Postgres + pgvector</Badge>
            <Badge variant="secondary">Ranking prototype</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Research Radar: explainable discovery for MIR and audio ML papers
          </h1>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            Research Radar is an explainable research-discovery prototype for music
            information retrieval and audio ML papers. It materializes ranking runs
            with visible signal breakdowns instead of hiding behind opaque relevance,
            and it keeps the live app separate from the portfolio so the case study
            can explain the work without pretending the prototype is a finished
            product.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Bridge recommendations are currently experimental and based on structural
            embedding-space signals. Evaluation is here for transparency and product
            inspection, not as a claim of universal relevance quality.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {liveDemoUrl ? (
              <a
                href={liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "default", size: "lg" }))}
              >
                <ExternalLink className="mr-1.5 h-4 w-4" />
                Open live prototype
              </a>
            ) : (
              <p className="max-w-md text-sm text-muted-foreground">
                The live prototype is meant to stay deployed separately from this
                portfolio. Once its public URL is pinned, this page can link out to
                it directly.
              </p>
            )}
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              <Github className="mr-1.5 h-4 w-4" />
              View source
            </a>
            <a
              href="#visual-walkthrough"
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
            >
              See walkthrough
            </a>
          </div>
        </header>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <div className="mb-3 flex items-center gap-2">
            <SearchCheck className="h-5 w-5 text-cyan-400" />
            <h2 className="text-xl font-semibold">What the project does</h2>
          </div>
          <figure className="overflow-hidden rounded-lg border border-border bg-muted/20">
            <div className="relative aspect-[1400/900] w-full">
              <Image
                src={ARTIFACT_SRC}
                alt="Overview graphic showing Research Radar's ranked recommendations, paper detail, trends, evaluation, and current product framing"
                fill
                unoptimized
                className="object-contain object-center p-2 sm:p-4"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
            <figcaption className="border-t border-border bg-card/50 px-4 py-3 text-center text-xs leading-relaxed text-muted-foreground">
              Portfolio-side overview of the current prototype surfaces and product
              framing. This is an architecture-style summary, not a literal app
              screenshot.
            </figcaption>
          </figure>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {mainSurfaces.map((surface) => (
              <div
                key={surface.title}
                className="rounded-lg border border-border bg-card/30 px-4 py-4"
              >
                <h3 className="text-sm font-medium text-foreground">
                  {surface.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {surface.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Network className="h-5 w-5 text-purple-400" />
            <h2 className="text-xl font-semibold">Why it is technically interesting</h2>
          </div>
          <div className="space-y-4">
            {technicalPoints.map((point) => (
              <div key={point.title}>
                <h3 className="text-sm font-medium text-foreground">{point.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{point.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="visual-walkthrough"
          className="mb-10 scroll-mt-16 rounded-xl border border-border bg-card/40 p-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-semibold">Visual walkthrough</h2>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            These captures were taken from a production-style run against the current
            API, with ranking pinned to{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              ml2-5a-qual-r2-k6-20260405
            </code>{" "}
            and similar papers using{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              v1-title-abstract-1536-cleantext-r2
            </code>
            . The app stays deployed separately from the portfolio; this section shows
            what the live prototype looked like at that pin.
          </p>
          <div className="space-y-6">
            {screenshotGallery.map((target) => {
              const liveHref = buildLiveRoute(liveDemoUrl, target.route);
              return (
                <figure
                  key={target.title}
                  className="overflow-hidden rounded-lg border border-border bg-card/30"
                >
                  <div className="relative aspect-[1440/2200] w-full bg-muted/20">
                    <Image
                      src={target.src}
                      alt={target.alt}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 896px"
                    />
                  </div>
                  <figcaption className="space-y-2 border-t border-border px-4 py-4 text-sm">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <h3 className="font-medium text-foreground">{target.title}</h3>
                      {liveHref ? (
                        <a
                          href={liveHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 underline-offset-4 hover:underline"
                        >
                          {target.route}
                        </a>
                      ) : (
                        <code className="rounded bg-muted px-2 py-1 text-xs text-foreground">
                          {target.route}
                        </code>
                      )}
                    </div>
                    <p className="text-muted-foreground">{target.why}</p>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card/40 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Microscope className="h-5 w-5 text-cyan-400" />
              <h2 className="text-xl font-semibold">Stable now</h2>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {currentState.stable.map((item) => (
                <li key={item} className="rounded-lg border border-border bg-card/30 px-3 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-amber-500/35 bg-amber-500/5 p-6">
            <div className="mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-semibold">Experimental notes</h2>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {currentState.experimental.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-amber-500/20 bg-background/40 px-3 py-3"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card/40 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Microscope className="h-5 w-5 text-rose-400" />
              <h2 className="text-xl font-semibold">Boundaries</h2>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {currentState.caveats.map((item) => (
                <li key={item} className="rounded-lg border border-border bg-card/30 px-3 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-3 text-xl font-semibold">Tech stack</h2>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            The product surface is a Next.js app backed by a FastAPI service. Data
            lives in Postgres with pgvector, while the Python pipeline handles
            ingest, text cleanup, embeddings, ranking runs, and clustering
            experiments.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Next.js",
              "TypeScript",
              "FastAPI",
              "Python",
              "Postgres",
              "pgvector",
              "OpenAlex",
              "Ranking runs",
              "Clustering",
            ].map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-3 text-xl font-semibold">Lessons learned</h2>
          <div className="space-y-4">
            {lessonsLearned.map((item) => (
              <p key={item} className="text-sm leading-relaxed text-muted-foreground">
                {item}
              </p>
            ))}
          </div>
        </section>

        <CaseStudyEvidenceFooter
          project={project}
          statusIcon={<Microscope className="h-5 w-5 text-cyan-400" />}
        />

        <Suspense fallback={null}>
          <ProjectComments
            projectSlug="research-radar"
            currentPath="/projects/research-radar"
          />
        </Suspense>
      </div>
    </div>
  );
}
