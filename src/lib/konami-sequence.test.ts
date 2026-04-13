import { describe, expect, it } from "vitest";
import { advanceKonamiIndex, KONAMI_CODES } from "./konami-sequence";

describe("advanceKonamiIndex", () => {
  it("completes after full sequence", () => {
    let i = 0;
    let last = { index: 0, complete: false };
    for (const code of KONAMI_CODES) {
      last = advanceKonamiIndex(i, code);
      i = last.index;
    }
    expect(last.complete).toBe(true);
    expect(i).toBe(0);
  });

  it("resets on wrong key", () => {
    expect(advanceKonamiIndex(2, "ArrowLeft")).toEqual({ index: 0, complete: false });
  });

  it("restarts from first ArrowUp when mid-sequence", () => {
    expect(advanceKonamiIndex(4, "ArrowUp")).toEqual({ index: 1, complete: false });
  });
});
