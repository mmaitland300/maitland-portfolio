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
  "/projects/snake-detector",
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

test("Research Radar case study renders walkthrough and evidence links", async ({
  page,
}) => {
  await page.goto("/projects/research-radar");

  await expect(
    page.getByRole("heading", { name: /Research Radar/i }).first()
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /View source/i })).toHaveAttribute(
    "href",
    /github\.com\/mmaitland300\/Research-Radar/
  );
  await expect(page.locator("#visual-walkthrough")).toBeVisible();

  const walkthroughImages = page.locator(
    '[data-testid="research-radar-walkthrough-image"]'
  );
  await expect(walkthroughImages).toHaveCount(4);

  const imageCount = await walkthroughImages.count();
  for (let i = 0; i < imageCount; i += 1) {
    const image = walkthroughImages.nth(i);
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(
        async () =>
          image.evaluate((img) => ({
            complete: (img as HTMLImageElement).complete,
            width: (img as HTMLImageElement).naturalWidth,
          })),
        { message: `walkthrough image ${i} should load` }
      )
      .toEqual(
        expect.objectContaining({
          complete: true,
          width: expect.any(Number),
        })
      );
    const naturalWidth = await image.evaluate(
      (img) => (img as HTMLImageElement).naturalWidth
    );
    expect(naturalWidth).toBeGreaterThan(0);
  }
});

test("Research Radar project card opens case study by default", async ({
  page,
}) => {
  await page.goto("/projects");
  const cardOverlay = page.locator(
    '[data-testid="project-card-research-radar"] a[aria-label="Open Research Radar"]'
  );
  await expect(cardOverlay).toHaveAttribute("href", "/projects/research-radar");

  await page.click(
    '[data-testid="project-card-research-radar"] a:has-text("Case study")'
  );
  await expect(page).toHaveURL(/\/projects\/research-radar$/);
});

test("homepage Research Radar card opens case study by default", async ({
  page,
}) => {
  await page.goto("/");
  const overlay = page.locator(
    '[data-testid="project-card-research-radar"] a[aria-label="Open Research Radar"]'
  );
  await expect(overlay).toHaveAttribute("href", "/projects/research-radar");
});
