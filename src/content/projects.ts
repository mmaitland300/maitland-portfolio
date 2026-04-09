import { getResearchRadarDemoUrl } from "@/lib/research-radar";
import { getSnakeDemoUrl } from "@/lib/snake-demo";

/**
 * Promotion rule:
 * featured projects should have a case-study proof path (dedicated caseStudy page
 * with explicit artifacts/tradeoffs/current-state/evidence links).
 */
const snakeDemoUrl = getSnakeDemoUrl();
const researchRadarDemoUrl = getResearchRadarDemoUrl();

export type ProjectCategory = "featured" | "experiment";
export type ProjectStatus = "in-progress" | "operational" | "shipped" | "archived";
export type ProofLinkKind = "repo" | "test" | "ci" | "post" | "artifact";

export interface ProofLink {
  label: string;
  href: string;
  kind?: ProofLinkKind;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  problem?: string;
  constraints?: string;
  tradeoff?: string;
  role?: string;
  outcome?: string;
  status?: ProjectStatus;
  evidence?: string;
  knownLimits?: string;
  proofLinks?: ProofLink[];
  image?: string;
  tags: string[];
  github?: string;
  demo?: string;
  caseStudy?: string;
  iframe?: string;
  category: ProjectCategory;
}

/** Homepage grid: flagship DSP, a live shipped prototype, and employer story. */
export const HOMEPAGE_FEATURED_SLUGS = [
  "stringflux",
  "research-radar",
  "full-swing-tech-support",
] as const;

export type HomepageFeaturedSlug = (typeof HOMEPAGE_FEATURED_SLUGS)[number];

export const projects: Project[] = [
  {
    slug: "stringflux",
    title: "StringFlux",
    description:
      "A multiband granular delay and freeze plugin I'm building for guitar. It listens for transients and uses them to drive grain scheduling, so the texture responds to how you play instead of running on a fixed clock.",
    problem:
      "Most granular processors treat every input the same. For stringed instruments, that means pick attacks get smeared and the effect feels disconnected from the performance.",
    constraints:
      "Everything runs in the audio callback, so oversampling changes and grain scheduling have to be real-time safe. I can't rebuild state mid-buffer without risking glitches.",
    tradeoff:
      "I've kept the feature set narrow on purpose. Getting the engine stable and the transient response right matters more than adding controls nobody can trust yet.",
    outcome:
      "Still in progress. The current build has 3-band crossover routing, transient-driven grain scheduling, history/freeze capture, and safe 1x/2x/4x oversampling transitions.",
    status: "in-progress",
    evidence:
      "Public DSP case study and decision records document architecture, constraints, and validation. Core implementation details are kept private for licensing and commercial release planning.",
    knownLimits:
      "No public benchmark or latency claims yet; still validating consistency and host behavior under broader session conditions.",
    proofLinks: [
      {
        label: "StringFlux case study",
        href: "/projects/stringflux",
        kind: "artifact",
      },
      {
        label: "Oversampling decision log",
        href: "/blog/stringflux-oversampling-decision-log",
        kind: "post",
      },
      {
        label: "StringFlux public product page",
        href: "/stringflux",
        kind: "artifact",
      },
    ],
    tags: [
      "Audio Plugin",
      "DSP",
      "Granular Synthesis",
      "Transient Detection",
      "Oversampling",
    ],
    image: "/images/stringflux/ui-advanced.png",
    demo: "/stringflux",
    caseStudy: "/projects/stringflux",
    category: "featured",
  },
  {
    slug: "research-radar",
    title: "Research Radar",
    description:
      "A prototype for finding MIR and audio ML papers, with explainable recommendations, paper detail, topic trends, and transparent evaluation.",
    problem:
      "I wanted a paper-discovery tool that was easier to understand than a popularity list and less opaque than a generic AI-style search box.",
    constraints:
      "The corpus is intentionally curated and still limited. The strongest current result is clear, explainable ranking, while some experimental ranking ideas still need more work.",
    tradeoff:
      "I focused first on saving ranking runs, exposing signal breakdowns, and making the prototype understandable before pushing harder on more experimental ranking ideas.",
    outcome:
      "The current prototype includes ranked recommendation feeds, paper detail with similar papers, corpus-scoped trends, and an evaluation view for comparing output against simple baselines.",
    status: researchRadarDemoUrl ? "operational" : "in-progress",
    evidence:
      "The strongest stable claim today is that the prototype makes its ranking behavior visible and understandable over a curated set of MIR and audio ML papers.",
    knownLimits:
      "Bridge recommendations are still experimental, semantic ranking is not part of the default ranking, and the corpus is still narrower than the long-term plan.",
    proofLinks: [
      {
        label: "Research Radar case study",
        href: "/projects/research-radar",
        kind: "artifact",
      },
      {
        label: "Research Radar source repo",
        href: "https://github.com/mmaitland300/Research-Radar",
        kind: "repo",
      },
      {
        label: "Roadmap and ML notes",
        href: "https://github.com/mmaitland300/Research-Radar/blob/master/docs/roadmap.md",
        kind: "post",
      },
      {
        label: "Ranked recommendation tests",
        href: "https://github.com/mmaitland300/Research-Radar/blob/master/apps/api/tests/test_recommendations_ranked.py",
        kind: "test",
      },
      {
        label: "Evaluation compare tests",
        href: "https://github.com/mmaitland300/Research-Radar/blob/master/apps/api/tests/test_evaluation_compare.py",
        kind: "test",
      },
    ],
    tags: [
      "Next.js",
      "FastAPI",
      "Postgres",
      "pgvector",
      "Python",
      "Ranking",
    ],
    github: "https://github.com/mmaitland300/Research-Radar",
    demo: researchRadarDemoUrl,
    image: "/images/projects/research-radar-artifact.svg",
    caseStudy: "/projects/research-radar",
    category: "featured",
  },
  {
    slug: "portfolio-site",
    title: "Personal Site",
    description:
      "This site. Next.js 16 with MDX blogging, a contact form that sends email through Resend and falls back gracefully when the database is down, and a GitHub OAuth admin inbox for managing submissions.",
    problem:
      "I needed somewhere to put my work that wasn't just a GitHub profile. It had to accept contact without getting spammed, and I wanted to be able to iterate on it without worrying about breaking production.",
    constraints:
      "Solo project, so operational overhead had to stay low. No dedicated backend: managed services (Resend for email, Upstash for rate limiting, Neon for Postgres) handle the heavy parts.",
    tradeoff:
      "Server Actions over API routes, managed services over self-hosted infra. More vendor lock-in, but significantly less to maintain and debug alone.",
    outcome:
      "Live at mmaitland.dev with honeypot + Redis rate limiting on contact, GitHub OAuth admin gating, and MDX blog with draft protection.",
    status: "operational",
    evidence:
      "Production safeguards are documented in a public case study and decision record, with CI and smoke tests in the repository.",
    knownLimits:
      "Some route-level dynamic behavior remains broader than needed and will be narrowed in later optimization work.",
    proofLinks: [
      {
        label: "Personal site case study",
        href: "/projects/portfolio-site",
        kind: "artifact",
      },
      {
        label: "Contact decision record",
        href: "/blog/contact-pipeline-decision-record",
        kind: "post",
      },
      {
        label: "Route smoke tests",
        href: "https://github.com/mmaitland300/mmaitland-portfolio/blob/main/e2e/routes.spec.ts",
        kind: "test",
      },
      {
        label: "Environment parsing tests",
        href: "https://github.com/mmaitland300/mmaitland-portfolio/blob/main/src/lib/env.test.ts",
        kind: "test",
      },
      {
        label: "Contact action tests",
        href: "https://github.com/mmaitland300/mmaitland-portfolio/blob/main/src/actions/contact.test.ts",
        kind: "test",
      },
      {
        label: "CI workflow",
        href: "https://github.com/mmaitland300/mmaitland-portfolio/blob/main/.github/workflows/ci.yml",
        kind: "ci",
      },
    ],
    tags: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Prisma",
      "Auth.js",
      "Upstash",
      "MDX",
    ],
    github: "https://github.com/mmaitland300/mmaitland-portfolio",
    image: "/images/projects/portfolio-site-projects.png",
    caseStudy: "/projects/portfolio-site",
    category: "featured",
  },
  {
    slug: "full-swing-tech-support",
    title: "Full Swing Technical Support",
    description:
      "My day job. I work at Auxillium supporting Full Swing simulator customers remotely. Many setups also run Laser Shot or E6 Golf from TruGolf, which I support on the same tickets. This case study documents the triage approach I've built from that work.",
    problem:
      "Simulator issues rarely have one cause. A customer reports \"the ball isn't tracking\" and the root cause could be calibration drift, a licensing timeout, a network config problem, or a Windows update that broke a driver.",
    constraints:
      "Incomplete information is the norm. Customers are frustrated, logs aren't always available, and you're working remotely across all of these layers at once.",
    tradeoff:
      "Slower upfront diagnosis instead of quick one-off fixes. Takes more time per ticket, but the same failure patterns stop coming back.",
    role: "Technical support specialist at Auxillium. Scope is Full Swing simulator deployments plus Laser Shot and E6 Golf from TruGolf when those are part of the install.",
    outcome:
      "Built repeatable triage workflows that I now use across calibration, licensing, display, networking, and OS subsystems. Documented publicly as a case study.",
    status: "operational",
    evidence:
      "Public case study includes workflow artifact, representative incident pattern, and troubleshooting playbook linkage.",
    knownLimits:
      "Customer-identifying details and hard incident counts are intentionally excluded due to privacy and support constraints.",
    proofLinks: [
      {
        label: "Full Swing case study",
        href: "/projects/full-swing-tech-support",
        kind: "artifact",
      },
      {
        label: "Troubleshooting playbook",
        href: "/blog/troubleshooting-playbook-multi-layer-failures",
        kind: "post",
      },
    ],
    tags: [
      "Technical Support",
      "Troubleshooting",
      "Windows",
      "Networking",
      "Hardware/Software Integration",
    ],
    image: "/images/projects/full-swing-triage-artifact.svg",
    caseStudy: "/projects/full-swing-tech-support",
    category: "featured",
  },
  {
    slug: "snake-detector",
    title: "Snake Detector",
    description:
      "Bounded snake vs no-snake computer vision with a reproducible evaluation workflow, explicit limits, and a public case study plus training repo.",
    problem:
      "The original prototype was easy to overstate: noisy data, uneven image quality, and weak licensing assumptions made headline accuracy a bad proxy for operational reliability.",
    outcome:
      "Scripted training and evaluation with inspectable artifacts; limits and disclaimers are documented in the case study.",
    status: snakeDemoUrl ? "operational" : "shipped",
    evidence:
      "Public case study, reproducible CLI flow, saved artifact, and legally safe demo boundary.",
    knownLimits:
      "Demo is a bounded snake vs no-snake experiment and should not be treated as species identification or field-safe classification.",
    proofLinks: [
      {
        label: "Snake Detector case study",
        href: "/projects/snake-detector",
        kind: "artifact",
      },
      {
        label: "Training repo",
        href: "https://github.com/mmaitland300/Snake-detector",
        kind: "repo",
      },
    ],
    tags: ["Python", "Machine Learning", "CNN", "Computer Vision"],
    demo: snakeDemoUrl,
    github: "https://github.com/mmaitland300/Snake-detector",
    caseStudy: "/projects/snake-detector",
    category: "experiment",
  },
  {
    slug: "sample-organizer",
    title: "Sample Library Organizer",
    description:
      "A PyQt5 desktop app (Musicians Organizer) for large local audio libraries: recursive scanning, SQLite persistence with SQLAlchemy Core and Alembic migrations, filtering and multi-dimensional tagging, duplicate detection, background audio-feature extraction, similarity-style recommendations, and waveform/spectrogram preview in the app.",
    image: "/images/projects/sample-organizer-loaded.png",
    tags: ["Python", "PyQt", "SQLite", "Audio"],
    github: "https://github.com/mmaitland300/organizer_project",
    category: "experiment",
  },
];

export function getFeaturedProjects() {
  return projects.filter((p) => p.category === "featured");
}

/** Curated subset for the homepage hero grid. */
export function getHomepageFeaturedProjects(): Project[] {
  return HOMEPAGE_FEATURED_SLUGS.map((slug) => {
    const p = projects.find((x) => x.slug === slug);
    if (!p) {
      throw new Error(`Homepage featured slug missing from data: ${slug}`);
    }
    return p;
  });
}

export function getExperiments() {
  return projects.filter((p) => p.category === "experiment");
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Slugs that have a case-study page and accept comments. */
export function getCommentableSlugs(): Set<string> {
  return new Set(
    projects.filter((p) => p.caseStudy).map((p) => p.slug)
  );
}
