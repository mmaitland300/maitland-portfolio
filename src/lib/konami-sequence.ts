/** Classic Konami-style sequence (keyboard `code` values). */
export const KONAMI_CODES = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
] as const;

export type KonamiStepResult = { index: number; complete: boolean };

/**
 * Advance the Konami sequence. Wrong keys reset; a wrong key that matches the
 * first step starts a fresh attempt at index 1.
 */
export function advanceKonamiIndex(
  prevIndex: number,
  key: string
): KonamiStepResult {
  const expected = KONAMI_CODES[prevIndex];
  if (key === expected) {
    const next = prevIndex + 1;
    if (next >= KONAMI_CODES.length) {
      return { index: 0, complete: true };
    }
    return { index: next, complete: false };
  }
  if (key === KONAMI_CODES[0]) {
    return { index: 1, complete: false };
  }
  return { index: 0, complete: false };
}
