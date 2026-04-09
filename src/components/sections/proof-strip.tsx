import Link from "next/link";
import { getResearchRadarDemoUrl } from "@/lib/research-radar";
import {
  HOMEPAGE_FEATURED_SLUGS,
  getHomepageFeaturedProjects,
  type HomepageFeaturedSlug,
  type ProofLink,
} from "@/content/projects";

function isHomepageFeaturedSlug(slug: string): slug is HomepageFeaturedSlug {
  return (HOMEPAGE_FEATURED_SLUGS as readonly string[]).includes(slug);
}

type ProofHeadline = {
  what: string;
  whyItMatters: string;
  linkPick: (links: ProofLink[]) => ProofLink[];
};

function researchRadarProofHeadline(
  demoUrl: string | undefined
): ProofHeadline {
  const core =
    "Paper discovery for MIR and audio ML with ranked feeds, visible signal breakdowns, corpus-scoped trends, and evaluation against baselines.";
  return {
    what: demoUrl ? "Research Radar (demo linked)" : "Research Radar",
    whyItMatters: demoUrl
      ? `${core} The project card links out to the hosted app.`
      : `${core} There is no outbound demo link from this site right now, so the case study and repository carry the proof.`,
    linkPick: (links: ProofLink[]) => {
      const byKind = (k: ProofLink["kind"]) =>
        links.find((l) => l.kind === k);
      const picked: ProofLink[] = [];
      const artifact = byKind("artifact");
      const post = byKind("post");
      const repo = byKind("repo");
      const test = links.find((l) => l.kind === "test");
      if (artifact) picked.push(artifact);
      if (post) picked.push(post);
      if (repo) picked.push(repo);
      else if (test) picked.push(test);
      return picked;
    },
  };
}

/** Curated proof-first copy; URLs come from each project's proofLinks (see projects.ts). */
const PROOF_HEADLINES_BASE = {
  "full-swing-tech-support": {
    what: "Production troubleshooting",
    whyItMatters:
      "Remote triage across calibration, licensing, display, networking, and Windows behavior. The public case study shows how multi-layer failures are isolated under incomplete information.",
    linkPick: (links: ProofLink[]) =>
      links.filter((l) =>
        ["artifact", "post"].includes(l.kind ?? "")
      ),
  },
  stringflux: {
    what: "StringFlux (JUCE / C++)",
    whyItMatters:
      "Real-time DSP work: transient-aware behavior, safe oversampling transitions, and disciplined feature scope. Public proof is architecture and decision records while core implementation remains private for licensing.",
    linkPick: (links: ProofLink[]) =>
      links.filter((l) => ["artifact", "post"].includes(l.kind ?? "")),
  },
} satisfies Omit<Record<HomepageFeaturedSlug, ProofHeadline>, "research-radar">;

function proofHeadlinesForDeploy(): Record<HomepageFeaturedSlug, ProofHeadline> {
  return {
    ...PROOF_HEADLINES_BASE,
    "research-radar": researchRadarProofHeadline(getResearchRadarDemoUrl()),
  };
}

export function ProofStrip() {
  const featured = getHomepageFeaturedProjects();
  const proofHeadlines = proofHeadlinesForDeploy();

  return (
    <section
      aria-label="Evidence links for featured work"
      className="border-t border-border/30 pt-8 pb-8 md:pt-10"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => {
            const curated = isHomepageFeaturedSlug(project.slug)
              ? proofHeadlines[project.slug]
              : undefined;
            const links = project.proofLinks ?? [];
            const proofLinks = curated
              ? curated.linkPick(links)
              : links.slice(0, 3);

            return (
              <article
                key={project.slug}
                className="rounded-lg border border-border bg-card/40 px-4 py-3"
              >
                <h2 className="text-sm font-medium text-foreground">
                  {curated?.what ?? project.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {curated?.whyItMatters ?? project.evidence ?? project.description}
                </p>
                <div className="mt-3 border-t border-border/60 pt-3">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Evidence links
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {proofLinks.map((item) => {
                      const isExternal = item.href.startsWith("http");
                      return (
                        <li key={`${item.label}-${item.href}`}>
                          {isExternal ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              {item.label}
                            </a>
                          ) : (
                            <Link
                              href={item.href}
                              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              {item.label}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
