import { describe, it, expect } from "vitest";
import { PAGE_TITLE_GRADIENT } from "./page-title-gradient";

describe("PAGE_TITLE_GRADIENT", () => {
  it("is a linear-gradient with expected stops (contract for CSS --page-title-gradient)", () => {
    expect(PAGE_TITLE_GRADIENT).toMatch(/^linear-gradient\(105deg,/);
    expect(PAGE_TITLE_GRADIENT).toContain("rgba(236, 241, 247");
    expect(PAGE_TITLE_GRADIENT).toContain("rgba(188, 160, 250");
  });
});
