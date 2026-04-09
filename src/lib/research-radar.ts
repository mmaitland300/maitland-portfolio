/**
 * Default public prototype URL when NEXT_PUBLIC_RESEARCH_RADAR_URL is unset.
 * Override via env when the deployment hostname changes.
 */
export const RESEARCH_RADAR_DEMO_FALLBACK = "https://research-radar-eta.vercel.app";

/** Public Research Radar demo base URL. Env wins; otherwise a known-good public deploy. */
export function getResearchRadarDemoUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_RESEARCH_RADAR_URL?.trim();
  if (raw) {
    if (!/^https?:\/\//i.test(raw)) return undefined;
    return raw;
  }
  return RESEARCH_RADAR_DEMO_FALLBACK;
}
