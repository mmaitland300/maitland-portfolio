import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getResumePdfLinkBase, getSiteUrl } from "./site-url";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  delete process.env.NEXT_PUBLIC_SITE_URL;
  delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
  delete process.env.VERCEL_URL;
  delete process.env.NEXT_PUBLIC_RESUME_PDF_LINK_BASE;
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("getSiteUrl", () => {
  it("normalizes apex mmaitland.dev to canonical www when NEXT_PUBLIC_SITE_URL is set", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://mmaitland.dev";
    expect(getSiteUrl()).toBe("https://www.mmaitland.dev");
  });

  it("prepends https:// when NEXT_PUBLIC_SITE_URL has no protocol", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "mmaitland.dev";
    expect(getSiteUrl()).toBe("https://www.mmaitland.dev");
  });

  it("prefers NEXT_PUBLIC_SITE_URL over VERCEL_PROJECT_PRODUCTION_URL", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://mmaitland.dev";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "https://other.vercel.app";
    expect(getSiteUrl()).toBe("https://www.mmaitland.dev");
  });

  it("falls back to VERCEL_PROJECT_PRODUCTION_URL when NEXT_PUBLIC_SITE_URL is unset", () => {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "myproject.vercel.app";
    expect(getSiteUrl()).toBe("https://myproject.vercel.app");
  });

  it("falls back to VERCEL_URL when production URL is unset", () => {
    process.env.VERCEL_URL = "myproject-git-main.vercel.app";
    expect(getSiteUrl()).toBe("https://myproject-git-main.vercel.app");
  });

  it("falls back to localhost when no env vars are set", () => {
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it("trims whitespace from the configured URL", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "  https://mmaitland.dev  ";
    expect(getSiteUrl()).toBe("https://www.mmaitland.dev");
  });

  it("normalizes www host to canonical https://www.mmaitland.dev", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.mmaitland.dev/";
    expect(getSiteUrl()).toBe("https://www.mmaitland.dev");
  });
});

describe("getResumePdfLinkBase", () => {
  it("uses NEXT_PUBLIC_RESUME_PDF_LINK_BASE when set", () => {
    process.env.NEXT_PUBLIC_RESUME_PDF_LINK_BASE = "https://example.com/path/";
    expect(getResumePdfLinkBase()).toBe("https://example.com/path");
  });

  it("prepends https when NEXT_PUBLIC_RESUME_PDF_LINK_BASE has no scheme", () => {
    process.env.NEXT_PUBLIC_RESUME_PDF_LINK_BASE = "mmaitland.dev/staging";
    expect(getResumePdfLinkBase()).toBe("https://mmaitland.dev/staging");
  });

  it("normalizes mmaitland.dev to https://www.mmaitland.dev", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://mmaitland.dev";
    expect(getResumePdfLinkBase()).toBe("https://www.mmaitland.dev");
  });

  it("uses www when site URL is already www", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.mmaitland.dev";
    expect(getResumePdfLinkBase()).toBe("https://www.mmaitland.dev");
  });

  it("uses www when browsing origin would be localhost", () => {
    expect(getResumePdfLinkBase()).toBe("https://www.mmaitland.dev");
  });

  it("uses configured non-mmaitland site URL as base", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://portfolio.example.org";
    expect(getResumePdfLinkBase()).toBe("https://portfolio.example.org");
  });
});
