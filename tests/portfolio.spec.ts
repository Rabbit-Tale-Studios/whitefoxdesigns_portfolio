import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import logoInclusions from "@/content/logo-inclusions.json";
import { formatPrice, formatServicePrice, pricing } from "@/lib/pricing";

test("pages render without errors, overflow, or accessibility violations", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of ["/", "/commissions", "/contact", "/tos"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test("hero logo stays sized while loading on wide screens", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Covers the wide desktop layout.");
  await page.setViewportSize({ width: 1920, height: 1000 });
  let releaseLogo: () => void = () => {};
  const logoReady = new Promise<void>((resolve) => {
    releaseLogo = resolve;
  });
  await page.route("**/brand/logo.svg", async (route) => {
    await logoReady;
    await route.continue();
  });
  let initialWidth = 0;
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const card = await page.locator(".hero-visual").boundingBox();
    const logo = await page.locator(".hero-logo").boundingBox();
    expect(card?.width).toBeGreaterThan(450);
    expect(logo?.width).toBeGreaterThan(250);
    initialWidth = card?.width ?? 0;
  } finally {
    releaseLogo();
  }
  await expect
    .poll(() =>
      page
        .locator(".hero-logo")
        .evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  const loadedCard = await page.locator(".hero-visual").boundingBox();
  expect(Math.abs((loadedCard?.width ?? 0) - initialWidth)).toBeLessThan(1);
  for (const width of [390, 1440, 1500, 2560]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect(page.locator(".hero-logo")).toBeVisible();
    const logo = await page.locator(".hero-logo").boundingBox();
    expect(logo?.width).toBeGreaterThan(200);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("gallery expands and keeps API requests on the server", async ({
  page,
}) => {
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    if (
      /^https?:/.test(request.url()) &&
      !request.url().startsWith("http://127.0.0.1:3002")
    )
      externalRequests.push(request.url());
  });
  await page.goto("/");
  await expect(page.locator(".project-card:visible")).toHaveCount(6);
  await page.getByText("Explore more work", { exact: true }).click();
  await expect(page.locator(".project-card:visible")).toHaveCount(
    await page.locator(".project-card").count(),
  );
  for (const image of await page.locator(".project-art img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate((element) => (element as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
  }
  for (const link of await page.locator(".project-card").all()) {
    await expect(link).toHaveAttribute(
      "href",
      /^https:\/\/www\.deviantart\.com\/whitefoxdesigns\/art\//,
    );
  }
  await page.getByText("Show fewer projects", { exact: true }).click();
  await expect(page.locator(".project-card:visible")).toHaveCount(6);
  expect(externalRequests).toEqual([]);
});

test("navigation stays clickable and mobile menu closes after selection", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  const menu = page.getByRole("navigation", {
    name: isMobile ? "Mobile navigation" : "Main navigation",
    exact: true,
  });
  if (isMobile) await page.getByLabel("Toggle navigation").click();
  await menu.getByRole("link", { name: "Commissions", exact: true }).click();
  await expect(page).toHaveURL(/\/commissions$/);
  if (isMobile) await expect(menu).not.toBeVisible();
  await page.getByRole("link", { name: "Start a conversation" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await page.getByRole("link", { name: "The full project checklist" }).click();
  await expect(page).toHaveURL(/\/tos#WorkProcess$/);
  await expect(page.locator("#WorkProcess h2")).toBeInViewport();
  if (isMobile) {
    await page.getByLabel("Toggle navigation").click();
    await page.keyboard.press("Escape");
    await expect(menu).not.toBeVisible();
  }
});

test("contact links and copy-email control work", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/contact");
  await expect(page.locator(".email-address")).toHaveAttribute(
    "href",
    "mailto:whitefoxldesigns@gmail.com",
  );
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(page.getByRole("status")).toHaveText("Email copied!");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "whitefoxldesigns@gmail.com",
  );
  await expect(page.locator(".social-list a")).toHaveCount(5);
});

test("commission pricing and included services agree with the terms", async ({
  page,
}) => {
  await page.goto("/commissions");
  await expect(page.locator('[data-service="logo"] .price')).toContainText(
    formatPrice(pricing.logo.amount),
  );
  await expect(
    page.locator('[data-service="businessCards"] .add-on-price'),
  ).toContainText(formatServicePrice(pricing.businessCards));
  await expect(
    page.locator('[data-service="priority"] .add-on-price'),
  ).toContainText(`+${formatServicePrice(pricing.priority)}`);
  await expect(page.locator(".features li")).toHaveText(logoInclusions);
  await page.goto("/tos");
  await expect(page.locator(".terms-content > section")).toHaveCount(7);
  await expect(page.locator("#Prices")).toContainText(
    `Logo Design ${formatPrice(pricing.logo.amount)} USD`,
  );
  await expect(page.locator("#Prices")).toContainText(
    `Business Card Design starting cost ${formatPrice(pricing.businessCards.amount)} up to ${formatPrice(pricing.businessCards.maxAmount)} USD depending on time required.`,
  );
  await expect(page.locator("#Prices")).toContainText(
    `additional ${formatServicePrice(pricing.priority)}`,
  );
  await expect(page.locator("#Prices li")).toHaveText(logoInclusions);
  await expect(page.locator("#Payment")).toContainText(
    formatPrice(pricing.logo.amount),
  );
  await expect(page.locator("#Payment")).toContainText("invoiced total");
  await expect(page.locator("#Payment")).toContainText(
    "Please don’t send any payment without receiving an invoice first.",
  );
  await expect(page.locator("#Cancellations_and_Refunds")).toContainText(
    "nonrefundable after the first design approach is sent.",
  );
  for (const link of await page.locator(".terms-sidebar a").all()) {
    const href = await link.getAttribute("href");
    expect(href).toBeTruthy();
    await expect(page.locator(href ?? "missing")).toHaveCount(1);
  }
});

test("essential portfolio and contact content work without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByText("Explore more work", { exact: true }).click();
  await expect(page.locator(".project-card:visible")).toHaveCount(18);
  await page.goto(`${baseURL}/contact`);
  await expect(page.locator(".email-address")).toBeVisible();
  await context.close();
});

test("missing pages provide a working route back", async ({ page }) => {
  const response = await page.goto("/missing-page");
  expect(response?.status()).toBe(404);
  await page.getByRole("link", { name: "Back to the portfolio" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "A little character.",
  );
});
