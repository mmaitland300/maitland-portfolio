/** Public Research Radar demo base URL; optional until a hosted demo is pinned. */
export function getResearchRadarDemoUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_RESEARCH_RADAR_URL?.trim();
  if (!raw) return undefined;
  if (!/^https?:\/\//i.test(raw)) return undefined;
  return raw;
}
