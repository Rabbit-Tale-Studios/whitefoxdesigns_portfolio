import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

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

test("all original service sections and core prices remain available", async ({
  page,
}) => {
  await page.goto("/tos");
  await expect(page.locator(".terms-content > section")).toHaveCount(7);
  await expect(page.locator("#Prices")).toContainText("Logo Design $150 USD");
  await expect(page.locator("#Prices")).toContainText(
    "Business Card Design $40 USD",
  );
  await expect(page.locator("#Prices")).toContainText("additional $70 USD");
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
