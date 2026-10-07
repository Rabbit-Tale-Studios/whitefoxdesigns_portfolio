import { expect, type Locator, test } from "@playwright/test";

async function geometry(locator: Locator) {
  return locator.evaluateAll((elements) =>
    elements.map((element) => {
      const { x, y, width, height } = element.getBoundingClientRect();
      return [x, y, width, height].map(
        (value) => Math.round(value * 100) / 100,
      );
    }),
  );
}

test("header links stay in place and identify the current page", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const controls = page.locator(
    ".site-header .brand, .desktop-nav a, .header-contact, .mobile-menu > summary",
  );
  const initial = await geometry(controls);
  const menu = page.getByRole("navigation", {
    name: isMobile ? "Mobile navigation" : "Main navigation",
    exact: true,
  });

  for (const [label, path] of [
    ["Commissions", "/commissions"],
    ["Terms of service", "/tos"],
    ["Let’s talk", "/contact"],
    ["Portfolio", "/"],
  ]) {
    if (isMobile) {
      const mainTop = await page
        .locator("main")
        .evaluate((element) => element.getBoundingClientRect().top);
      await page.getByLabel("Toggle navigation").click();
      expect(
        await page
          .locator("main")
          .evaluate((element) => element.getBoundingClientRect().top),
      ).toBe(mainTop);
    }
    const link =
      !isMobile && path === "/contact"
        ? page.locator(".header-contact")
        : menu.getByRole("link", { name: label, exact: true });
    await link.click();
    await expect(page).toHaveURL(new RegExp(path === "/" ? "/$" : `${path}$`));
    if (isMobile) {
      await expect(menu).not.toBeVisible();
      await page.getByLabel("Toggle navigation").click();
    }
    await expect(link).toHaveAttribute("aria-current", "page");
    await expect(
      page.locator('.site-header a[aria-current="page"]:visible'),
    ).toHaveCount(1);
    await expect.poll(() => geometry(controls)).toEqual(initial);
    if (isMobile) await page.keyboard.press("Escape");
  }
});

test("terms selection follows anchors, scrolling and direct links without resizing", async ({
  page,
}) => {
  await page.goto("/tos#WorkProcess");
  const navigation = page.getByRole("navigation", { name: "Terms sections" });
  const active = navigation.locator('[aria-current="location"]');
  await expect(active).toHaveAttribute("href", "#WorkProcess");
  const sizes = () =>
    navigation
      .getByRole("link")
      .evaluateAll((links) =>
        links.map((link) => [link.clientWidth, link.clientHeight]),
      );
  const initial = await sizes();
  await navigation.getByRole("link", { name: "02 Payment" }).click();
  await expect(active).toHaveAttribute("href", "#Payment");
  await page
    .locator("#Service")
    .evaluate((element) => element.scrollIntoView());
  await expect(active).toHaveAttribute("href", "#Service");
  await expect.poll(sizes).toEqual(initial);
  await expect(active).toHaveCount(1);
});

test("gallery toggle and loading feedback retain their geometry", async ({
  page,
}) => {
  await page.goto("/");
  const toggle = page.locator(".more-work > summary");
  await toggle.scrollIntoViewIfNeeded();
  const initial = await geometry(toggle);
  await toggle.click();
  await expect(
    page.getByText("Show fewer projects", { exact: true }),
  ).toBeVisible();
  await expect.poll(() => geometry(toggle)).toEqual(initial);
  await toggle.click();
  await expect(
    page.getByText("Explore more work", { exact: true }),
  ).toBeVisible();
  await expect.poll(() => geometry(toggle)).toEqual(initial);
  await toggle.click();

  const load = page.getByRole("button", {
    name: "Load more projects",
    exact: true,
  });
  await expect(load).toBeVisible();
  await load.scrollIntoViewIfNeeded();
  const buttonSize = () =>
    load.evaluate((element) => [element.clientWidth, element.clientHeight]);
  const buttonBefore = await buttonSize();
  const sectionTop = () =>
    page
      .locator(".about-section")
      .evaluate((element) =>
        Math.round(element.getBoundingClientRect().top + window.scrollY),
      );
  const belowBefore = await sectionTop();
  let release: () => void = () => {};
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/gallery?offset=*", async (route) => {
    await pending;
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: "{}",
    });
  });
  try {
    await load.click();
    const loading = page.getByRole("button", {
      name: "Loading projects…",
      exact: true,
    });
    await expect(loading).toBeDisabled();
    expect(
      await loading.evaluate((element) => [
        element.clientWidth,
        element.clientHeight,
      ]),
    ).toEqual(buttonBefore);
    expect(await sectionTop()).toBe(belowBefore);
  } finally {
    release();
  }
  await expect(page.locator(".gallery-message")).toHaveText(
    "Work could not be loaded. Please try again.",
  );
  await expect(load).toBeEnabled();
  expect(await buttonSize()).toEqual(buttonBefore);
  expect(await sectionTop()).toBe(belowBefore);
});
