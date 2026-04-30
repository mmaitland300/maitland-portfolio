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

const mainSurfaces = [
  {
    title: "Ranked recommendations",
    detail:
      "Visitors can browse emerging papers, undercited papers, and a bridge preview route for diagnostics. Each list is generated ahead of time and includes enough detail to show why a paper was recommended.",
  },
  {
    title: "Paper detail with similar papers",
    detail:
      "Each paper page shows metadata plus a related-papers section, so someone can move from one useful paper to the next without starting over from search every time.",
  },
  {
    title: "Trends in the current dataset",
    detail:
      "The trends page reads momentum inside this corpus slice. This is helpful for tuning here, scoped to what the ranker actually sees.",
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
      "Each ranked list stores the signal mix that produced it, same as keeping scratchwork attached to the answer sheet. That makes regressions obvious when ranking code changes and gives another reviewer something concrete to react to.",
  },
  {
    title: "Splitting the site from the prototype is intentional",
    detail:
      "This page is the case study, while the prototype runs as its own app. Under the hood there is a Next.js frontend, a FastAPI backend, Postgres with pgvector for storage and similarity search, and Python jobs for ingest, ranking, and clustering. Keeping those pieces separate makes it easier to update the ranking workflow without turning every change into a full-site deploy.",
  },
  {
    title: "Experimental ideas stay visible and clearly bounded",
    detail:
      "Some ideas are still exploratory, especially bridge-style cross-cluster signal. It stays visible as a preview/diagnostics surface with explicit framing; first-class recommender language waits until weighting and evaluation match the label.",
  },
];

const screenshotGallery = [
  {
    title: "Step 1: The ranked feed",
    src: "/images/projects/research-radar/recommended-emerging.png",
    route: "/recommended?family=emerging",
    plainSummary:
      "This is the main list. Each card shows a paper and a short breakdown of what pushed it up in the ranking for this snapshot. You don't have to take the order on faith.",
    inspectPoints: [
      "Pick any card and read the signal block below the title. That's the system's reasoning for that result.",
      "The feed is either emerging (newer papers gaining traction in this set) or undercited (papers that look underappreciated relative to their signals).",
    ],
    conclude:
      "The ranking isn't a black box. You can see what drove each result and compare runs when the code changes.",
    limit:
      "This is a curated slice of papers, not a comprehensive index of the field. It tells you what ranked highly here, not what's objectively best.",
    alt: "Research Radar recommended emerging page showing ranked paper cards with visible signal breakdowns",
  },
  {
    title: "Step 2: Paper detail and similar papers",
    src: "/images/projects/research-radar/paper-detail-similar.png",
    route: "/papers/https%3A%2F%2Fopenalex.org%2FW3093121331",
    plainSummary:
      "Click any card from the feed and you land here. You get the paper's full details, where it sat in the ranked list, and a set of similar papers so you can keep exploring without starting over.",
    inspectPoints: [
      "Venue, year, citation count, and topic tags are all in one place.",
      "The similar papers section finds nearby results by content. Useful when one paper looks relevant and you want to see what else is around it.",
    ],
    conclude:
      "You can move from a ranked result to a full paper view and keep moving through related work without losing your place.",
    limit:
      "Similar papers are matched by content similarity, not hand-curated. Useful for navigation, not a quality judgment.",
    alt: "Research Radar paper detail page for GiantMIDI Piano showing metadata and similar papers",
  },
  {
    title: "Step 3: Evaluation against simpler sorts",
    src: "/images/projects/research-radar/evaluation-emerging.png",
    route: "/evaluation?family=emerging",
    plainSummary:
      "This is where I check whether the ranking is actually doing something useful. It puts the system's output next to the most obvious alternatives: sort by citation count, sort by date. If the ranking is adding value, you should be able to see it here.",
    inspectPoints: [
      "Compare which papers appear in the ranked list versus what you'd get from a simple sort by citations or recency.",
      "Look at the overall shape, not just individual rows. Does the ranked list feel meaningfully different from the simple sorts?",
    ],
    conclude:
      "A quick sanity check that the ranking is doing something beyond what a spreadsheet sort would give you.",
    limit:
      "This is a comparison against simple baselines, not a formal relevance benchmark. A useful starting point, not a final verdict.",
    alt: "Research Radar evaluation page comparing ranked output against citation and date baselines",
  },
  {
    title: "Step 4: Trends in this dataset",
    src: "/images/projects/research-radar/trends.png",
    route: "/trends",
    plainSummary:
      "The trends page shows which topics are picking up momentum inside this particular set of papers. Not the whole field, just what the ranker actually sees.",
    inspectPoints: [
      "Topic clusters gaining momentum within this snapshot. Useful for understanding why certain papers are surfacing in the emerging feed.",
    ],
    conclude:
      "Gives context for why a topic might be heating up in the ranked lists right now.",
    limit:
      "This reflects momentum inside the curated set only. It won't match broader field trends.",
    alt: "Research Radar trends page showing topic momentum inside the curated corpus slice",
  },
];

const currentState = {
  stable: [
    "The centerpiece is materialized emerging and undercited feeds that show why items appear where they do, plus bridge diagnostics, not a validated bridge recommender family yet.",
    "Paper detail, trends, and evaluation are all working parts of the prototype.",
    "The strongest current value is inspecting and comparing recommendations with the ranking logic in plain sight.",
  ],
  experimental: [
    "Bridge is a preview/diagnostics route: bridge signal is measured and shown, but in the current public run it is not weighted into final_score, so it should not be read as a validated bridge recommender.",
    "I tested weighted variations; with the current signals the deck order barely moved, so the next lever is the bridge features themselves.",
    "The next step is likely better bridge signals and tighter filtering before touching the scalar weights again.",
  ],
  caveats: [
    "General semantic relevance is not treated as a default quality score. Some pinned emerging runs use embedding slice-fit as one bounded ranking feature, and the live UI labels when that feature is used.",
    "Bridge is available as an explicitly labeled preview/diagnostics surface; it is not the default recommendation path and bridge weight is zero in the current public run.",
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
    "Case study for Research Radar, a product-shaped prototype for MIR and audio ML: emerging and undercited rankings, bridge diagnostics, similarity, trends, and transparent evaluation.",
};

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
            Research Radar is a product-shaped prototype for MIR and audio ML,
            not a proven production product. The goal is simple: make ranking
            behavior inspectable, not hidden. You can move from emerging and
            undercited feeds through evaluation, trends, and paper detail without
            losing the reasoning behind the order.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            The live app is deployed separately from this case study. Bridge is a
            preview/diagnostics route (signal measured; not weighted into
            final_score in the current public run), while the core flow focuses on
            explainable emerging/undercited feeds plus transparent baseline comparison.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
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

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6 sm:p-7">
          <div className="mb-4 flex items-center gap-2">
            <SearchCheck className="h-5 w-5 text-brand-cyan" />
            <h2 className="text-xl font-semibold">What the project does</h2>
          </div>
          <p className="max-w-3xl text-[15px] leading-7 text-muted-foreground">
            Research Radar focuses on one reviewer workflow: inspect ranked
            recommendations, open a paper dossier, compare against baselines, and
            read trends in corpus context. The core value is transparency, not a
            black-box recommendation claim.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {mainSurfaces.map((surface) => (
              <div
                key={surface.title}
                className="rounded-lg border border-border bg-card/30 px-4 py-4 sm:px-5"
              >
                <h3 className="text-[15px] font-semibold text-foreground">
                  {surface.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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

        <section className="mb-10 rounded-xl border border-amber-500/35 bg-amber-500/5 p-6">
          <h2 className="mb-3 text-xl font-semibold">Scope and evaluation boundaries</h2>
          <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
            Current corpus scope is intentionally narrow. The deployed slice is a
            curated prototype around the currently wired bootstrap sources, and it
            should not be read as a comprehensive index of audio-ML literature.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Evaluation here is proxy-only: citation/date baselines, topic-mix and
            recency checks, plus distribution-level comparisons. There is not yet a
            human-labeled relevance benchmark.
          </p>
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
            Most paper tools give you a sorted list and no explanation of why
            anything landed where it did. I built this partly to fix that and
            partly to understand what it actually takes to build something like
            this end to end. The way I use it: open the emerging or undercited
            feed, read the signal note on each card before trusting the order,
            click into a paper if it looks worth following, then check the
            evaluation page to see whether the ranking makes sense against
            simpler sorts like citation count or date.
          </p>
          <div className="space-y-6">
            {screenshotGallery.map((target) => {
              const liveHref = buildLiveRoute(liveDemoUrl, target.route);
              return (
                <figure
                  key={target.title}
                  className="overflow-hidden rounded-lg border border-border bg-card/30"
                >
                  <div className="relative aspect-video w-full bg-muted/20">
                    <Image
                      src={target.src}
                      alt={target.alt}
                      data-testid="research-radar-walkthrough-image"
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
                    {"plainSummary" in target && (
                      <p className="mt-2 text-muted-foreground">{target.plainSummary}</p>
                    )}
                    <div className="mt-3 space-y-3 text-muted-foreground">
                      <div>
                        <p className="font-medium text-foreground">What to look at</p>
                        <ul className="mt-1 list-disc pl-5">
                          {target.inspectPoints.map((pt) => (
                            <li key={pt}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                      {"conclude" in target && (
                        <p>
                          <span className="font-medium text-foreground">What you can take from this:</span>{" "}
                          {target.conclude}
                        </p>
                      )}
                      {"limit" in target && (
                        <p>
                          <span className="font-medium text-foreground">{"What it doesn't tell you"}:</span>{" "}
                          {target.limit}
                        </p>
                      )}
                    </div>
                  </figcaption>
                </figure>
              );
            })}
          </div>
          <div className="mt-6 rounded-lg border border-border bg-card/30 px-4 py-4 text-sm">
            <h3 className="font-medium text-foreground">
              Optional: Bridge preview (diagnostics)
            </h3>
            <p className="mt-2 text-muted-foreground">
              Route:{" "}
              {buildLiveRoute(liveDemoUrl, "/recommended?family=bridge") ? (
                <a
                  href={buildLiveRoute(liveDemoUrl, "/recommended?family=bridge")!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-cyan underline-offset-4 hover:underline"
                >
                  /recommended?family=bridge
                </a>
              ) : (
                <code className="rounded bg-muted px-2 py-1 text-xs text-foreground">
                  /recommended?family=bridge
                </code>
              )}
            </p>
            <ul className="mt-2 list-disc pl-5 text-muted-foreground">
              <li>Bridge signal is measured and shown.</li>
              <li>
                In the current public run, bridge weight is zero, so{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">final_score</code> does not
                use the bridge signal.
              </li>
              <li>
                Treat this as diagnostics / preview, not a validated bridge recommender.
              </li>
            </ul>
          </div>
          <div className="mt-6 border-t border-border pt-4">
            {liveDemoUrl ? (
              <a
                href={liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "default", size: "lg" }))}
              >
                <ExternalLink className="mr-1.5 h-4 w-4" />
                Continue to live prototype
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
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-3 text-xl font-semibold">Public, reviewer-facing evidence</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            What you can verify without special access: repository
            history, linked tests, roadmap notes, and the screenshot baseline
            shown in the walkthrough above. Internal hosting
            details are intentionally omitted; the live prototype uses the stable
            radar.mmaitland.dev subdomain, with an environment override
            available for preview or migration deployments.
          </p>
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
          currentCaseStudyPath="/projects/research-radar"
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
