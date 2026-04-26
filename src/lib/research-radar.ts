export const RESEARCH_RADAR_CANONICAL_DEMO_URL = "https://radar.mmaitland.dev";

/** Public Research Radar demo base URL. Env override wins; canonical URL stays stable. */
export function getResearchRadarDemoUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_RESEARCH_RADAR_URL?.trim();
  if (!raw) return RESEARCH_RADAR_CANONICAL_DEMO_URL;
  if (!/^https?:\/\//i.test(raw)) return undefined;
  return raw;
}
