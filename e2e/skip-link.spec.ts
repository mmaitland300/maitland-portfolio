import { test, expect } from "@playwright/test";

test.describe("skip link", () => {
  test("activating skip link moves focus to main content", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeAttached();

    // Browser tab-focus behavior can vary in CI/headless; focus the skip link directly.
    await skip.focus();
    await expect(skip).toBeFocused();
    await skip.press("Enter");

    const target = page.locator("#main-content");
    await expect(target).toBeFocused();
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(80);
  });
});
