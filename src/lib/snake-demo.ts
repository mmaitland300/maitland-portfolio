/**
 * Default Gradio Space URL when NEXT_PUBLIC_SNAKE_DEMO_URL is unset.
 * Override via env if the Space name or host changes.
 */
export const SNAKE_DEMO_FALLBACK =
  "https://mmaitland-snake-detector-demo.hf.space";

/** Public Snake Detector demo URL. Env wins; otherwise the Hugging Face Space app URL. */
export function getSnakeDemoUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SNAKE_DEMO_URL?.trim();
  if (raw) {
    if (!/^https?:\/\//i.test(raw)) return undefined;
    return raw;
  }
  return SNAKE_DEMO_FALLBACK;
}
