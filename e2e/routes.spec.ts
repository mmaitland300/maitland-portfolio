import { test, expect } from "@playwright/test";

const publicRoutes = [
  "/",
  "/about",
  "/projects",
  "/stringflux",
  "/projects/stringflux",
  "/projects/full-swing-tech-support",
  "/projects/portfolio-site",
  "/projects/research-radar",
  "/blog",
  "/contact",
  "/music",
  "/resume",
  "/resume/print",
];

for (const route of publicRoutes) {
  test(`GET ${route} returns 200 and renders content`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toBeVisible();
  });
}

test("/resume/print shows print marker and omits site nav and footer", async ({
  page,
}) => {
  const response = await page.goto("/resume/print");
  expect(response?.status()).toBe(200);
  await expect(page.locator("[data-resume-print-ready]")).toBeVisible();
  await expect(page.locator("nav")).toHaveCount(0);
  await expect(page.locator("footer")).toHaveCount(0);
});

test("admin/login renders without error", async ({ page }) => {
  const response = await page.goto("/admin/login");
  expect(response?.status()).toBe(200);
  const heading = page.locator("h1");
  await expect(heading).toBeVisible();
  const normalized = (await heading.textContent())?.replace(/\s+/g, " ").trim();
  expect(["Admin Login", "Admin Unavailable", "Access Denied"]).toContain(
    normalized
  );
});

test("every public route has a <title> and meta description", async ({
  page,
}) => {
  for (const route of publicRoutes) {
    await page.goto(route);
    const title = await page.title();
    expect(title, `${route} missing <title>`).toBeTruthy();
    expect(title.length, `${route} <title> too short`).toBeGreaterThan(5);

    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description, `${route} missing meta description`).toBeTruthy();
  }
});

const routesWithOgImages = [
  "/",
  "/projects",
  "/blog",
  "/about",
  "/contact",
  "/resume",
];

for (const route of routesWithOgImages) {
  test(`OG meta tags present on ${route}`, async ({ page }) => {
    await page.goto(route);
    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute("content");
    expect(ogTitle, `${route} missing og:title`).toBeTruthy();

    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect(ogImage, `${route} missing og:image`).toBeTruthy();
  });
}

test("not-found page returns 404 status", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist");
  expect(response?.status()).toBe(404);
});

test("navbar links are visible on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  const nav = page.locator("nav");
  await expect(nav).toBeVisible();

  for (const label of ["Projects", "About", "Blog", "Contact"]) {
    await expect(nav.getByRole("link", { name: label })).toBeVisible();
  }
});
