import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const root = resolve(import.meta.dir, "..");
const [logo, font, tokens] = await Promise.all([
  readFile(resolve(root, "public/brand/logo.svg")),
  readFile(resolve(root, "app/fonts/dm-sans-latin.woff2")),
  readFile(resolve(root, "app/tokens.css"), "utf8"),
]);
function color(name: string): string {
  const value = tokens.match(
    new RegExp(`--${name}:\\s*(#[a-fA-F0-9]{6});`),
  )?.[1];
  if (!value)
    throw new Error(
      `Set --${name} to a six-digit hex color in app/tokens.css.`,
    );
  return value;
}
const colors = {
  background: color("ink"),
  text: color("paper"),
  sage: color("sage"),
  orange: color("orange"),
};
const logoUrl = `data:image/svg+xml;base64,${logo.toString("base64")}`;
const fontUrl = `data:font/woff2;base64,${font.toString("base64")}`;
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(
    `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><style>
@font-face { font-family: DM; src: url("${fontUrl}") format("woff2"); font-weight: 100 1000; }
* { box-sizing: border-box; }
html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
body { position: relative; background: ${colors.background}; color: ${colors.text}; font-family: DM, sans-serif; -webkit-font-smoothing: antialiased; }
.brand { position: absolute; top: 54px; left: 64px; display: flex; align-items: center; gap: 16px; }
.brand img { width: 46px; height: 44px; object-fit: contain; }
.wordmark { font-size: 29px; line-height: 1; font-weight: 650; letter-spacing: -1.7px; }
.wordmark small { display: block; margin: 9px 0 0 2px; font-size: 9px; letter-spacing: 4px; font-weight: 500; }
.copy { position: absolute; top: 196px; left: 64px; width: 620px; }
.eyebrow { margin: 0 0 28px; color: ${colors.sage}; font-size: 13px; font-weight: 650; letter-spacing: 2.4px; }
h1 { margin: 0; font-size: 72px; font-weight: 500; line-height: 1.06; letter-spacing: -4px; }
h1 span { color: ${colors.orange}; }
.description { margin: 26px 0 0; color: ${colors.sage}; font-size: 22px; line-height: 1.5; letter-spacing: -.4px; }
.logo-panel { position: absolute; top: 54px; right: 64px; width: 402px; height: 522px; display: flex; align-items: center; justify-content: center; }
.logo-panel img { display: block; width: 314px; height: auto; }
.footer { position: absolute; bottom: 54px; left: 64px; display: flex; align-items: center; gap: 12px; color: ${colors.sage}; font-size: 12px; font-weight: 600; letter-spacing: 1.9px; }
.footer span { color: ${colors.orange}; font-size: 26px; line-height: 1; font-weight: 400; letter-spacing: 0; }
</style></head><body>
<div class="brand"><img src="${logoUrl}" alt=""><div class="wordmark">whitefox<small>DESIGNS</small></div></div>
<div class="copy"><p class="eyebrow">INDEPENDENT LOGO DESIGNER</p><h1>Small marks.<br><span>Big personalities.</span></h1><p class="description">Logo design &amp; brand identity<br>with a little character.</p></div>
<div class="logo-panel"><img src="${logoUrl}" alt="Whitefox Designs logo"></div>
<div class="footer"><span>+</span> LOGO DESIGN · VECTOR ARTWORK · BUSINESS CARDS</div>
</body></html>`,
    { waitUntil: "load" },
  );
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(Array.from(document.images, (image) => image.decode()));
  });
  const clipped = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(".copy, .logo-panel, .footer"),
      (element) => element.getBoundingClientRect(),
    ).some((box) => box.right > 1200 || box.bottom > 630),
  );
  if (clipped)
    throw new Error("The share-image layout extends outside the image.");
  await page.screenshot({
    path: resolve(root, "public/og-image.png"),
    type: "png",
  });
  console.log(
    "Created public/og-image.png (1200 × 630) using the supplied logo, local font, and site colors.",
  );
} finally {
  await browser.close();
}
