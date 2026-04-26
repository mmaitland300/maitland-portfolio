import { afterEach, describe, expect, it } from "vitest";
import {
  getResearchRadarDemoUrl,
  RESEARCH_RADAR_CANONICAL_DEMO_URL,
} from "./research-radar";

describe("getResearchRadarDemoUrl", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_RESEARCH_RADAR_URL;
  });

  it("returns canonical URL when unset or whitespace", () => {
    delete process.env.NEXT_PUBLIC_RESEARCH_RADAR_URL;
    expect(getResearchRadarDemoUrl()).toBe(RESEARCH_RADAR_CANONICAL_DEMO_URL);
    process.env.NEXT_PUBLIC_RESEARCH_RADAR_URL = "   ";
    expect(getResearchRadarDemoUrl()).toBe(RESEARCH_RADAR_CANONICAL_DEMO_URL);
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
