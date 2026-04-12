import { parseAppEnv } from "@/lib/env";

const LOCAL_SITE_URL = "http://localhost:3000";

function normalizeUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://")
    ? value
    : `https://${value}`;
}

const CANONICAL_MMAITLAND_WWW = "https://www.mmaitland.dev";

/**
 * mmaitland.dev / www.mmaitland.dev → https://www.mmaitland.dev (paths preserved).
 * Other hostnames unchanged. Forks that use their own domain never hit this branch.
 */
function canonicalizeMmaitlandPublicUrl(url: string): string {
  const normalized = normalizeUrl(url.trim()).replace(/\/$/, "");
  try {
    const u = new URL(normalized);
    if (u.hostname !== "mmaitland.dev" && u.hostname !== "www.mmaitland.dev") {
      return normalized;
    }
    const out = new URL(normalized);
    out.protocol = "https:";
    out.hostname = "www.mmaitland.dev";
    let href = out.href;
    if (href.endsWith("/")) {
      href = href.slice(0, -1);
    }
    return href;
  } catch {
    return normalized;
  }
}

/** Apex and www both resolve to the canonical public origin (no path) for site metadata. */
function canonicalMmaitlandSiteUrl(url: string): string {
  const trimmed = normalizeUrl(url.trim());
  try {
    const { hostname } = new URL(trimmed);
    if (hostname === "mmaitland.dev" || hostname === "www.mmaitland.dev") {
      return CANONICAL_MMAITLAND_WWW;
    }
  } catch {
    /* leave unchanged */
  }
  return trimmed;
}

export function getSiteUrl() {
  const env = parseAppEnv();
  const configuredUrl = env.NEXT_PUBLIC_SITE_URL;
  if (configuredUrl) {
    return canonicalMmaitlandSiteUrl(configuredUrl);
  }

  const deploymentUrl = env.VERCEL_PROJECT_PRODUCTION_URL ?? env.VERCEL_URL;
  if (deploymentUrl) {
    return canonicalMmaitlandSiteUrl(deploymentUrl);
  }

  return LOCAL_SITE_URL;
}

/**
 * Base URL for resolving relative `href` values in the print resume / PDF.
 * Standalone PDFs should not rely on relative links. Override with
 * NEXT_PUBLIC_RESUME_PDF_LINK_BASE for forks or unusual deploy hosts.
 */
export function getResumePdfLinkBase(): string {
  const override = process.env.NEXT_PUBLIC_RESUME_PDF_LINK_BASE?.trim();
  if (override) {
    return canonicalizeMmaitlandPublicUrl(override);
  }

  const site = getSiteUrl().replace(/\/$/, "");
  try {
    const { hostname } = new URL(site);
    if (hostname === "mmaitland.dev" || hostname === "www.mmaitland.dev") {
      return CANONICAL_MMAITLAND_WWW;
    }
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return CANONICAL_MMAITLAND_WWW;
    }
    return site;
  } catch {
    return CANONICAL_MMAITLAND_WWW;
  }
}
