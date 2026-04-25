import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { buttonVariants } from "@/components/ui/button-variants";
import { getProjectBySlug } from "@/content/projects";
import { cn } from "@/lib/utils";

const ARTIFACT_SRC = "/images/projects/research-radar-artifact.svg";

const mainSurfaces = [
  {
    title: "Ranked recommendations",
    detail:
      "Visitors can browse emerging papers, undercited papers, and an experimental bridge view. Each list is generated ahead of time and includes enough detail to show why a paper was recommended.",
  },
  {
    title: "Paper detail with similar papers",
    detail:
      "Each paper page shows metadata plus a related-papers section, so someone can move from one useful paper to the next without starting over from search every time.",
  },
  {
    title: "Trends in the current dataset",
    detail:
      "The trends page reads momentum inside this corpus slice—helpful for tuning here, scoped to what the ranker actually sees.",
  },
  {
    title: "Evaluation and comparison",
    detail:
      "The evaluation page compares the ranking against simpler baselines like citation count and recency so you can sanity-check behavior against scores everyone already understands.",
  },
];

const technicalPoints = [
  {
    title: 'Recommendations should answer "why is this here?"',
    detail:
      "Each ranked list stores the signal mix that produced it, same as keeping scratchwork attached to the answer sheet. That makes regressions obvious when ranking code changes and gives another engineer something concrete to react to.",
  },
  {
    title: "Splitting the site from the prototype is intentional",
    detail:
      "This page is the case study, while the prototype runs as its own app. Under the hood there is a Next.js frontend, a FastAPI backend, Postgres with pgvector for storage and similarity search, and Python jobs for ingest, ranking, and clustering. Keeping those pieces separate makes it easier to update the ranking workflow without turning every change into a full-site deploy.",
  },
  {
    title: "Experimental ideas stay visible and clearly bounded",
    detail:
      "Some ideas are still exploratory, especially bridge-style recommendations that try to connect papers across areas. They stay in the UI with explicit framing and stay off the default path until the signals deserve first-class billing.",
  },
];

const screenshotGallery: {
  title: string;
  src: string;
  route: string;
  why: string;
  alt: string;
  /** When false, `route` is caption context only (no deep link to the live demo). */
  deepLinkable?: boolean;
}[] = [
  {
    title: "Recommended: emerging",
    src: "/images/projects/research-radar/recommended-emerging.png",
    route: "/recommended?family=emerging",
    why: "The clearest introduction to the product: a ranked list with visible recommendation signals.",
    alt: "Research Radar recommended emerging page showing ranked paper cards with visible signal breakdowns",
  },
  {
    title: "Recommended: undercited",
    src: "/images/projects/research-radar/recommended-undercited.png",
    route: "/recommended?family=undercited",
    why: "Shows the undercited family with the same explainable breakdown pattern as emerging, scoped to the low-cite pool.",
    alt: "Research Radar recommended undercited page with ranked cards and visible signals",
  },
  {
    title: "Evaluation: emerging",
    src: "/images/projects/research-radar/evaluation-emerging.png",
    route: "/evaluation?family=emerging",
    why: "Shows the ranker next to citation and recency baselines so you can see what changes when the model does.",
    alt: "Research Radar evaluation page for the emerging family comparing ranked output against baselines",
  },
  {
    title: "Evaluation: bridge",
    src: "/images/projects/research-radar/evaluation-bridge.png",
    route: "/evaluation?family=bridge",
    why: "Same evaluation surface for the experimental bridge family, so comparisons stay apples-to-apples across tabs.",
    alt: "Research Radar evaluation page for the bridge family comparing ranked output against baselines",
  },
  {
    title: "Bridge family (experimental)",
    src: "/images/projects/research-radar/recommended-bridge-experimental.png",
    route: "/recommended?family=bridge",
    why: "Shows the experimental bridge feed with the same honest framing used in production—interesting, still rough.",
    alt: "Research Radar bridge recommendation page showing bridge scores with experimental framing",
  },
  {
    title: "Hosting pins (Railway)",
    src: "/images/projects/research-radar/railway-project-next-public-pins.png",
    route: "NEXT_PUBLIC_* variables on Railway (web service)",
    why: "Documents how the deployed Next.js app picks up public env pins for API base URL and embedding version—small ops proof alongside the product shots.",
    alt: "Railway project settings showing Next.js public environment variable pins",
    deepLinkable: false,
  },
];

const currentState = {
  stable: [
    "The main product is a set of ranked paper feeds that show why items appear where they do.",
    "Paper detail, trends, and evaluation are all working parts of the prototype.",
    "The strongest current value is inspecting and comparing recommendations with the ranking logic in plain sight.",
  ],
  experimental: [
    "Bridge recommendations are still experimental and stay behind the main feeds until the signals earn first-class billing.",
    "I tested weighted variations; with the current signals the deck order barely moved, so the next lever is the bridge features themselves.",
    "The next step is likely better bridge signals and tighter filtering before touching the scalar weights again.",
  ],
  caveats: [
    "Semantic ranking stays out of the default ranking path for now.",
    "Bridge stays off by default in production.",
    "The corpus is still curated and narrower than the long-term vision.",
  ],
};

const lessonsLearned = [
  "Building explanation and versioning in early made it easier to compare changes and improve the system over time.",
  "Keeping experimental features visible but off by default kept the core product more focused.",
  "Evaluation stayed useful as a comparison grid; a single headline score never bought enough confidence on its own.",
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
    notFound();
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
            Research Radar is a research-discovery prototype for music information
            retrieval and audio ML papers. I built it to make recommendations easier
            to understand: you can browse ranked feeds, open a paper, explore
            trends, and compare the output against simpler baselines.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            The live app stays separate from this site. Bridge
            recommendations are still exploratory, and the evaluation view helps
            inspect how the ranking behaves against simpler baselines.
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
                The live prototype is deployed separately from this site, but no
                public demo URL is configured right now. Set{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  NEXT_PUBLIC_RESEARCH_RADAR_URL
                </code>{" "}
                to a valid https URL (or remove an invalid value) to restore the
                link.
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
            <SearchCheck className="h-5 w-5 text-brand-cyan" />
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
              High-level overview of the current prototype surfaces and product
              framing. Labels match the live app; geometry is simplified for the
              diagram export.
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
            <Network className="h-5 w-5 text-brand-violet" />
            <h2 className="text-xl font-semibold">
              Engineering choices, in plain language
            </h2>
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
            These captures come from a <strong>2026-04-25</strong> baseline
            screenshot pass against the deployed prototype (same session and
            viewport across product routes). The app stays deployed separately
            from this site; this section shows what that baseline looked like in
            the browser.
          </p>
          <div className="space-y-6">
            {screenshotGallery.map((target) => {
              const liveHref =
                target.deepLinkable === false
                  ? null
                  : buildLiveRoute(liveDemoUrl, target.route);
              return (
                <figure
                  key={target.title}
                  className="overflow-hidden rounded-lg border border-border bg-card/30"
                >
                  <div className="relative aspect-video w-full bg-muted/20">
                    <Image
                      src={target.src}
                      alt={target.alt}
                      fill
                      unoptimized
                      className="object-contain object-top"
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
                          className="text-brand-cyan underline-offset-4 hover:underline"
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
              <Microscope className="h-5 w-5 text-brand-cyan" />
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
              <h2 className="text-xl font-semibold">What is still experimental</h2>
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
            The interface is built in Next.js, the API is built in FastAPI, and the
            data lives in Postgres with pgvector. A separate Python pipeline handles
            ingest, cleanup, embeddings, ranking, and clustering experiments behind
            the scenes.
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
          statusIcon={<Microscope className="h-5 w-5 text-brand-cyan" />}
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
