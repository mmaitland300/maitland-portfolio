import { afterEach, describe, expect, it } from "vitest";
import {
  getResearchRadarDemoUrl,
  RESEARCH_RADAR_DEMO_FALLBACK,
} from "./research-radar";

describe("getResearchRadarDemoUrl", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_RESEARCH_RADAR_URL;
  });

  it("returns fallback when unset or whitespace", () => {
    delete process.env.NEXT_PUBLIC_RESEARCH_RADAR_URL;
    expect(getResearchRadarDemoUrl()).toBe(RESEARCH_RADAR_DEMO_FALLBACK);
    process.env.NEXT_PUBLIC_RESEARCH_RADAR_URL = "   ";
    expect(getResearchRadarDemoUrl()).toBe(RESEARCH_RADAR_DEMO_FALLBACK);
  });

  it("returns the URL when valid http(s)", () => {
    process.env.NEXT_PUBLIC_RESEARCH_RADAR_URL = "https://demo.example/app";
    expect(getResearchRadarDemoUrl()).toBe("https://demo.example/app");
  });

  it("rejects non-http schemes", () => {
    process.env.NEXT_PUBLIC_RESEARCH_RADAR_URL = "ftp://bad";
    expect(getResearchRadarDemoUrl()).toBeUndefined();
  });
});
