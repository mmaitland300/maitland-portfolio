import { describe, expect, it, afterEach } from "vitest";
import { getSnakeDemoUrl, SNAKE_DEMO_FALLBACK } from "./snake-demo";

describe("getSnakeDemoUrl", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SNAKE_DEMO_URL;
  });

  it("returns fallback when unset or whitespace", () => {
    delete process.env.NEXT_PUBLIC_SNAKE_DEMO_URL;
    expect(getSnakeDemoUrl()).toBe(SNAKE_DEMO_FALLBACK);
    process.env.NEXT_PUBLIC_SNAKE_DEMO_URL = "   ";
    expect(getSnakeDemoUrl()).toBe(SNAKE_DEMO_FALLBACK);
  });

  it("returns the URL when valid http(s)", () => {
    process.env.NEXT_PUBLIC_SNAKE_DEMO_URL = "https://demo.example/app";
    expect(getSnakeDemoUrl()).toBe("https://demo.example/app");
  });

  it("rejects non-http schemes", () => {
    process.env.NEXT_PUBLIC_SNAKE_DEMO_URL = "ftp://bad";
    expect(getSnakeDemoUrl()).toBeUndefined();
  });
});
