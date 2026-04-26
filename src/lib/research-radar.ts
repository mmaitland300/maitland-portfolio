export const RESEARCH_RADAR_DEMO_FALLBACK = "https://radar.mmaitland.dev";

/** Public Research Radar demo base URL. Env wins; fallback stays stable. */
export function getResearchRadarDemoUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_RESEARCH_RADAR_URL?.trim();
  if (!raw) return RESEARCH_RADAR_DEMO_FALLBACK;
  if (!/^https?:\/\//i.test(raw)) return undefined;
  return raw;
}
