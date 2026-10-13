import { expect, test } from "@playwright/test";

const origin = "https://whitefoxdesigns.net";
const paths = ["/", "/commissions", "/contact", "/tos"];

test("search and sharing metadata are unique and complete without JavaScript", async ({
    browser,
    baseURL,
    viewport,
}) => {
    const context = await browser.newContext({
        javaScriptEnabled: false,
        viewport,
    });
    const page = await context.newPage();
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    try {
        for (const path of paths) {
            const response = await page.goto(baseURL + path);
            expect(response?.status()).toBe(200);
            const title = await page.title();
            expect(title).toContain("Whitefox Designs");
            titles.add(title);
            const description = page.locator('head meta[name="description"]');
            await expect(description).toHaveCount(1);
            const summary = await description.getAttribute("content");
            expect(summary?.length).toBeGreaterThan(60);
            descriptions.add(summary ?? "");
            const canonical = page.locator('head link[rel="canonical"]');
            await expect(canonical).toHaveCount(1);
            expect(
                new URL((await canonical.getAttribute("href")) ?? "").href,
            ).toBe(new URL(path, origin).href);
            expect(
                new URL(
                    (await page
                        .locator('head meta[property="og:url"]')
                        .getAttribute("content")) ?? "",
                ).href,
            ).toBe(new URL(path, origin).href);
            for (const selector of [
                'meta[property="og:title"]',
                'meta[name="twitter:title"]',
            ]) {
                await expect(page.locator(selector)).toHaveAttribute(
                    "content",
                    title,
                );
            }
            for (const selector of [
                'meta[property="og:description"]',
                'meta[name="twitter:description"]',
            ]) {
                await expect(page.locator(selector)).toHaveAttribute(
                    "content",
                    summary ?? "",
                );
            }
            for (const selector of [
                'meta[property="og:image"]',
                'meta[name="twitter:image"]',
            ]) {
                await expect(page.locator(selector)).toHaveAttribute(
                    "content",
                    `${origin}/og-image.png`,
                );
            }
            await expect(
                page.locator('meta[name="googlebot"]'),
            ).toHaveAttribute("content", /max-image-preview:large/);
            await expect(
                page.locator('meta[name="robots"][content*="noindex"]'),
            ).toHaveCount(0);
            await expect(page.locator("h1")).toHaveCount(1);
        }
        expect(titles.size).toBe(paths.length);
        expect(descriptions.size).toBe(paths.length);
    } finally {
        await context.close();
    }
});

test("homepage structured data identifies the existing brand and crawlable artwork", async ({
    page,
    request,
}) => {
    await page.goto("/");
    const script = page.locator('script[type="application/ld+json"]');
    await expect(script).toHaveCount(1);
    const data = JSON.parse((await script.textContent()) ?? "{}");
    expect(data["@context"]).toBe("https://schema.org");
    const organization = data["@graph"].find(
        (item: { "@type": string }) => item["@type"] === "Organization",
    );
    const website = data["@graph"].find(
        (item: { "@type": string }) => item["@type"] === "WebSite",
    );
    expect(organization.name).toBe("Whitefox Designs");
    expect(organization.url).toBe(origin);
    expect(organization.email).toBe("whitefoxldesigns@gmail.com");
    expect(organization.sameAs).toContain(
        "https://www.deviantart.com/whitefoxdesigns/gallery/",
    );
    expect(organization.sameAs).toEqual(
        expect.arrayContaining([
            "https://bsky.app/profile/whitefoxdesigns.net",
            "https://ko-fi.com/whitefoxdesigns",
        ]),
    );
    expect(website.name).toBe(organization.name);
    expect(website.publisher["@id"]).toBe(organization["@id"]);
    expect(organization.logo.url).toBe(`${origin}/icon.svg`);
    const logo = await request.get("/icon.svg");
    expect(logo.status()).toBe(200);
    expect(logo.headers()["content-type"]).toContain("image/svg+xml");
    const image = await request.get("/og-image.png");
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toContain("image/png");
    const bytes = await image.body();
    expect(bytes.readUInt32BE(16)).toBe(1200);
    expect(bytes.readUInt32BE(20)).toBe(630);
});

test("crawler files advertise only canonical public pages and missing pages stay excluded", async ({
    request,
    page,
}) => {
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    const rules = await robots.text();
    expect(rules).toContain("User-Agent: *");
    expect(rules).toContain("Allow: /");
    expect(rules).toContain("Disallow: /api/");
    expect(rules).toContain(`Sitemap: ${origin}/sitemap.xml`);
    expect(rules).not.toContain("Disallow: /_next");
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(sitemap.headers()["content-type"]).toContain("xml");
    const xml = await sitemap.text();
    const urls = Array.from(
        xml.matchAll(/<loc>(.*?)<\/loc>/g),
        (match) => match[1],
    );
    expect(urls.sort()).toEqual(paths.map((path) => origin + path).sort());
    const missing = await page.goto("/missing-seo-test-page");
    expect(missing?.status()).toBe(404);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        /noindex/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test("AI crawler directives preserve normal search indexing", async ({
    request,
}) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/plain");
    const body = await response.text();
    const groups = body
        .split(/\r?\n\s*\r?\n/)
        .map((group) => group.split(/\r?\n/));
    const normalSearch = groups.find((group) =>
        group.includes("User-Agent: *"),
    );
    expect(normalSearch).toContain(
        "Content-signal: search=yes, ai-train=no, ai-input=no",
    );
    expect(normalSearch).toContain("Allow: /");
    expect(normalSearch).toContain("Disallow: /api/");
    expect(normalSearch).not.toContain("Disallow: /");

    for (const crawler of [
        "Amazonbot",
        "Applebot-Extended",
        "Bytespider",
        "CCBot",
        "ClaudeBot",
        "Google-Extended",
        "GPTBot",
        "meta-externalagent",
    ]) {
        const group = groups.find((lines) =>
            lines.includes(`User-Agent: ${crawler}`),
        );
        expect(group).toContain("Disallow: /");
        expect(group).not.toContain("Allow: /");
    }
    for (const crawler of [
        "Googlebot",
        "Googlebot-Image",
        "Bingbot",
        "Applebot",
    ]) {
        expect(
            groups.some((group) => group.includes(`User-Agent: ${crawler}`)),
        ).toBe(false);
    }
});
