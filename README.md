# Whitefox Designs

Your portfolio brings together your logo work, commission information, contact details, and terms of service. The charcoal background, warm white text, sage green accents, and soft apricot details work on phones, tablets, and desktops.

## Your pages

- **Portfolio** (`/`): introduction, selected projects, and a link to your full DeviantArt gallery.
- **Commissions** (`/commissions`): pricing, included services, and the design process.
- **Contact** (`/contact`): email, social profiles, and the information clients should send.
- **Terms of service** (`/tos`): your current pricing and service policies.

## Preview your website

Install [Bun](https://bun.sh), then open a terminal in this folder:

```sh
bun install
bun run dev
```

Visit [localhost:3000](http://localhost:3000). Keep the terminal open while previewing; press Ctrl+C when finished. Run only one development server for this project at a time.

## Update your content

**Contact details, website address, and social profiles:** edit `lib/site.ts`. The public website address is `https://whitefoxdesigns.net` and is used for canonical page addresses, the sitemap, structured business information, and sharing-image links. Your email address is shared across the site automatically.

**Portfolio:** the website reads your artwork, original titles, project links, and publication dates from the DeviantArt API. The first six projects appear immediately. “Explore more work” reveals the rest of the first page, and “Load more projects” fetches older work. Publish or update work on DeviantArt to update the website automatically; there is no separate list to maintain.

### Connect your DeviantArt gallery

1. Open [DeviantArt Applications](https://www.deviantart.com/developers/apps) and create or edit a **confidential/server-side** application. This connection uses the **Client Credentials** grant to access the public gallery. A public app that only supplies a Client ID is insufficient for this setup. See the [official authentication guide](https://deviantart.readme.io/docs/authentication).
2. Copy `.env.example` to `.env.local`, then fill in `DEVIANTART_CLIENT_ID` and `DEVIANTART_CLIENT_SECRET`. Your local file has already been created.
3. Keep `DEVIANTART_USERNAME=whitefoxdesigns` to use your current gallery. Restart the development server after setting the keys.
4. When publishing, add the same three variables to your hosting provider’s environment settings, then redeploy.

The website caches gallery pages for 15 minutes and renews its API access token automatically. Updates appear as visitors return and cached pages refresh. API keys are used only by the server.

Portfolio images come directly from DeviantArt and are optimized by Next.js. No downloaded gallery copies or local project list are stored in the repository. If DeviantArt is unavailable, visitors can retry or follow the full-gallery link.

**Your introduction:** edit `app/page.tsx`.

**Prices and discounts:** edit only `content/pricing.json`. Both the commissions page and the pricing/payment terms update from this file. See the examples below. Service descriptions can be edited in `app/commissions/page.tsx`. The logo inclusions are shared between the commissions page and terms through `content/logo-inclusions.json`.

**Terms:** `lib/terms.tsx` contains your original service wording. Each section appears on the terms page and in its contents list automatically.

**Contact checklist:** edit `app/contact/page.tsx`.

**Colors:** edit `app/tokens.css`. Forest charcoal (`#1E2724`) is the page background, warm white (`#F5F3ED`) is the main text color, and muted sage (`#B3C9B7`) is the main accent. Moss green buttons and gently tinted panels keep the theme consistent, with soft borders. Soft apricot (`#E8AD84`) is the orange secondary accent for heading highlights, small details, and icons on hover. The other reference palette colors remain available in this file. Layout and responsive styles are in `app/globals.css`.

## Change a price or run a discount

Open `content/pricing.json`. The three entries are `logo`, `businessCards`, and `priority`.

- **Logo:** `logo.price` is the USD price. It is currently `175`.
- **Business cards:** `businessCards.price` is the starting USD price, currently `20`. `maxPrice` is the upper end, currently `150`. The final cost depends on time required. Keep `maxPrice` at least as large as `price`.
- **Priority projects:** `priority.percent` is the additional percentage, currently `50`. The website displays **+50%**, with the first design approach within 72 hours, subject to availability.
- Each service has `discountPercent` and `discountLabel`. Set `discountPercent` to `0` for normal pricing or a percentage such as `20` for a sale. Give the sale a name with `discountLabel`.

For a 20% discount on a $175 logo, the logo entry would be:

```json
"logo": {
  "price": 175,
  "discountPercent": 20,
  "discountLabel": "Summer offer"
}
```

The website displays $140, the regular $175 price, and the offer label. The terms show the same current price. Business-card discounts apply to both ends of the range. A 20% discount on the 50% priority surcharge displays +40%. The payment terms require the invoiced total, including any requested additional services.

To end a sale, set its `discountPercent` back to `0`. Discounts are switched on and off manually; they have no automatic expiry. No discount is currently enabled.

Save the file and refresh the local preview. For the published site, commit and deploy the change through your hosting workflow. Run `bun run validate` first: it identifies invalid prices or discount percentages before publishing. Keep the JSON commas and quotation marks intact.

## Sharing preview

`public/og-image.png` is the 1200 × 630 image shown when a link is shared. It uses your supplied SVG logo, the local DM Sans font, and the website’s colors. Open Graph and Twitter/X metadata use it across your pages.

After changing the logo or colors, run `bun run create:og` to rebuild it. The layout and text are in `scripts/create-og.ts`. Install the preview browser once with `bunx playwright install chromium` if needed. Deploy the updated image along with the website.

## Search visibility

Page titles and search descriptions live in `lib/seo.ts`. Keep each description specific to the page and its real services. This file also supplies the page addresses in `/sitemap.xml`. When adding a page, add its entry here and use its metadata on that page. Contact details, the business name, and social links still come from `lib/site.ts`.

Every public page has a canonical address on `https://whitefoxdesigns.net`, plus its own Open Graph and Twitter/X title and description. The homepage identifies the business and website with structured data. It uses your existing `app/icon.svg` as the search logo because its dark background keeps the white artwork visible. The existing sharing image stays at `public/og-image.png`.

The generated `/robots.txt` allows normal search engines to crawl public pages, images, and scripts, and points to the sitemap. It excludes the gallery API and disallows the AI crawlers listed below. The sitemap lists the four public pages and does not invent update dates. Your first gallery page is present in the initial HTML; older work reached through “Load more projects” remains available on DeviantArt.

### AI crawler preferences

`app/robots.txt/route.ts` serves Cloudflare-compatible Content Signals: `search=yes, ai-train=no, ai-input=no`. It also disallows Amazonbot, Applebot-Extended, Bytespider, CCBot, ClaudeBot, Google-Extended, GPTBot, and meta-externalagent, using the crawler list in [Cloudflare’s documentation](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/). Normal Google, Bing, and Apple search crawlers remain allowed.

These are voluntary crawler instructions, not a firewall. To enforce blocking for `whitefoxdesigns.net`, sign in to its Cloudflare account, open **Security > Settings > Configure AI bot policies**, set **Training** to **Block (on all pages)**, and enable **Bot Preference Sync**. Use **AI Crawl Control** to review and block additional AI crawlers. These account settings are separate from publishing this repository and have not been enabled by the site code.

After enabling Cloudflare controls, inspect the public `/robots.txt` to confirm the combined Cloudflare and site rules still allow normal search indexing. Cloudflare may prepend its managed rules to this site's response. See [AI bot policies](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/) for current options.

### After publishing

1. Verify `whitefoxdesigns.net` as a Domain property in [Google Search Console](https://search.google.com/search-console/about), using the DNS record Google supplies. No verification token is included in the repository.
2. Submit `https://whitefoxdesigns.net/sitemap.xml`. Inspect the homepage and commissions page with URL Inspection, check the selected canonical, and request indexing after meaningful updates.
3. At your hosting provider, make HTTPS on `whitefoxdesigns.net` the primary address. Redirect the HTTP and www versions permanently to the same paths on that address. Keep preview deployments protected or marked noindex in hosting settings.
4. Test the published homepage with [Rich Results Test](https://search.google.com/test/rich-results) and [PageSpeed Insights](https://pagespeed.web.dev/). Review mobile loading, responsiveness, and layout stability. This small site may not have enough traffic for field measurements yet.
5. Review Search Console indexing and search queries after Google has recrawled the site. Compare impressions, clicks, and enquiries over time; metadata changes do not guarantee higher rankings.

### Ongoing improvements

- Use original, descriptive project titles on DeviantArt, since the portfolio displays these titles and uses them in image descriptions.
- The next useful content expansion is individual project case studies on this website: the real client brief, design decisions, finished artwork, and a link to commission work. Publish only information you are allowed to share, respecting the Vault Service and project rights.
- Link this website from your established portfolio and social profiles. Seek relevant, earned mentions through real work and collaborations.
- Keep service information accurate and write for prospective clients. Avoid repetitive keywords, purchased links, invented testimonials, and duplicate pages targeting different search phrases.

These practices follow [Google’s SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), and [organization structured data guidance](https://developers.google.com/search/docs/appearance/structured-data/organization).

Run `bun run test:e2e -- tests/seo.spec.ts` after a successful build to check metadata without JavaScript, sharing images, structured data, crawler files, and missing-page behavior.

## Check and publish

```sh
bun run validate
bun run build
bun run start
```

`validate` checks code formatting, pricing values, and TypeScript. `build` prepares the website for release; `start` lets you preview that release locally. Stop the development server first so port 3000 is available.

For hosting, use this repository’s root folder as the project directory, with `bun install` as the install command and `bun run build` as the build command. Choose hosting that supports Next.js. No separate backend is needed. Set your DeviantArt environment variables on the hosting provider.

Run `bun run test:api` for the API integration checks and `bun run test:pricing` for discount calculations. For the included browser checks, run `bunx playwright install chromium` once, then `bun run test:e2e` after a successful build. The checks use port 3002.

## Artwork and fonts

The supplied Whitefox Designs 2024 SVG is used in the header, footer, and main logo display. Its vector shapes and white fill are preserved. To replace it, update `public/brand/logo.svg`; the matching browser icon is in `app/icon.svg`. Portfolio artwork, titles, links, and publication dates are loaded from the [Whitefox Designs gallery](https://www.deviantart.com/whitefoxdesigns/gallery/); each image links to its original project. All designs belong to their respective owners. No artwork has been generated.

DM Sans is served locally. Its license is included in `app/fonts/LICENSE.txt`.
