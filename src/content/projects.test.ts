import { describe, it, expect } from "vitest";
import {
  projects,
  getFeaturedProjects,
  getHomepageFeaturedProjects,
  getExperiments,
} from "./projects";

describe("projects data integrity", () => {
  it("has no duplicate slugs", () => {
    const slugs = projects.map((p) => p.slug);
    const unique = new Set(slugs);
    expect(unique.size).toBe(slugs.length);
  });

  it("every project has required fields", () => {
    for (const p of projects) {
      expect(p.slug, `${p.slug} missing slug`).toBeTruthy();
      expect(p.title, `${p.slug} missing title`).toBeTruthy();
      expect(p.description, `${p.slug} missing description`).toBeTruthy();
      expect(p.tags, `${p.slug} missing tags`).toBeDefined();
      expect(p.tags.length, `${p.slug} has empty tags`).toBeGreaterThan(0);
      expect(["featured", "experiment"], `${p.slug} invalid category`).toContain(
        p.category
      );
    }
  });

  it("caseStudy links follow /projects/<slug> pattern", () => {
    for (const p of projects) {
      if (p.caseStudy) {
        expect(p.caseStudy).toMatch(/^\/projects\/.+/);
      }
    }
  });

  it("getFeaturedProjects returns only featured category", () => {
    const featured = getFeaturedProjects();
    expect(featured.length).toBeGreaterThan(0);
    for (const p of featured) {
      expect(p.category).toBe("featured");
    }
  });

  it("getExperiments returns only experiment category", () => {
    const experiments = getExperiments();
    expect(experiments.length).toBeGreaterThan(0);
    for (const p of experiments) {
      expect(p.category).toBe("experiment");
    }
  });

  it("getHomepageFeaturedProjects resolves without throwing", () => {
    expect(() => getHomepageFeaturedProjects()).not.toThrow();
  });

  it("homepage featured projects are all valid project entries", () => {
    const allSlugs = new Set(projects.map((p) => p.slug));
    for (const p of getHomepageFeaturedProjects()) {
      expect(allSlugs.has(p.slug)).toBe(true);
    }
  });

  it("featured projects include frozen proof contracts", () => {
    const featured = getFeaturedProjects();
    const allowedStatus = new Set([
      "in-progress",
      "operational",
      "live-prototype",
      "shipped",
      "archived",
    ]);
    const allowedProofKinds = new Set(["repo", "test", "ci", "post", "artifact"]);

    for (const p of featured) {
      expect(p.status, `${p.slug} missing status`).toBeTruthy();
      expect(allowedStatus.has(p.status as string), `${p.slug} invalid status`).toBe(
        true
      );
      expect(p.evidence, `${p.slug} missing evidence`).toBeTruthy();
      expect(p.knownLimits, `${p.slug} missing known limits`).toBeTruthy();
      expect(p.proofLinks, `${p.slug} missing proofLinks`).toBeDefined();
      expect(p.proofLinks?.length ?? 0, `${p.slug} missing proof links`).toBeGreaterThan(
        0
      );

      for (const link of p.proofLinks ?? []) {
        expect(link.label, `${p.slug} proof link missing label`).toBeTruthy();
        expect(link.href, `${p.slug} proof link missing href`).toBeTruthy();
        expect(
          /^(\/|https?:\/\/)/.test(link.href),
          `${p.slug} proof link href must be internal or absolute`
        ).toBe(true);
        if (link.kind) {
          expect(
            allowedProofKinds.has(link.kind),
            `${p.slug} invalid proof link kind`
          ).toBe(true);
        }
      }
    }
  });
});

