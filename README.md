# Whitefox Designs

Your portfolio brings together your logo work, commission information, contact details, and terms of service. The charcoal background, warm white text, sage green accents, and soft apricot details work on phones, tablets, and desktops.

## Your pages

- **Portfolio** (`/`): introduction, selected projects, and a link to your full DeviantArt gallery.
- **Commissions** (`/commissions`): pricing, included services, and the design process.
- **Contact** (`/contact`): email, social profiles, and the information clients should send.
- **Terms of service** (`/tos`): your original pricing and service policies.

## Preview your website

Install [Bun](https://bun.sh), then open a terminal in this folder:

```sh
bun install
bun run dev
```

Visit [localhost:3000](http://localhost:3000). Keep the terminal open while previewing; press Ctrl+C when finished. Run only one development server for this project at a time.

## Update your content

**Contact details and social profiles:** edit `lib/site.ts`. Your email address is shared across the site automatically.

**Portfolio:** the website reads your artwork, original titles, project links, and publication dates from the DeviantArt API. The first six projects appear immediately. “Explore more work” reveals the rest of the first page, and “Load more projects” fetches older work. Publish or update work on DeviantArt to update the website automatically; there is no separate list to maintain.

### Connect your DeviantArt gallery

1. Open [DeviantArt Applications](https://www.deviantart.com/developers/apps) and create or edit a **confidential/server-side** application. This connection uses the **Client Credentials** grant to access the public gallery. A public app that only supplies a Client ID is insufficient for this setup. See the [official authentication guide](https://deviantart.readme.io/docs/authentication).
2. Copy `.env.example` to `.env.local`, then fill in `DEVIANTART_CLIENT_ID` and `DEVIANTART_CLIENT_SECRET`. Your local file has already been created.
3. Keep `DEVIANTART_USERNAME=whitefoxdesigns` to use your current gallery. Restart the development server after setting the keys.
4. When publishing, add the same three variables to your hosting provider’s environment settings, then redeploy.

The website caches gallery pages for 15 minutes and renews its API access token automatically. Updates appear as visitors return and cached pages refresh. API keys are used only by the server.

Portfolio images come directly from DeviantArt and are optimized by Next.js. No downloaded gallery copies or local project list are stored in the repository. If DeviantArt is unavailable, visitors can retry or follow the full-gallery link.

**Your introduction:** edit `app/page.tsx`.

**Prices and discounts:** edit only `content/pricing.json`. Both the commissions page and the pricing/payment terms update from this file. See the examples below. Service descriptions can be edited in `app/commissions/page.tsx`.

**Terms:** `lib/terms.tsx` contains your original service wording. Each section appears on the terms page and in its contents list automatically.

**Contact checklist:** edit `app/contact/page.tsx`.

**Colors:** edit `app/tokens.css`. Forest charcoal (`#1E2724`) is the page background, warm white (`#F5F3ED`) is the main text color, and muted sage (`#B3C9B7`) is the main accent. Moss green buttons and gently tinted panels keep the theme consistent, with soft borders. Soft apricot (`#E8AD84`) is the orange secondary accent for heading highlights, small details, and icons on hover. The other reference palette colors remain available in this file. Layout and responsive styles are in `app/globals.css`.

## Change a price or run a discount

Open `content/pricing.json`. The three entries are `logo`, `businessCards`, and `priority`. All prices are in USD.

- Change `price` to set the normal price, for example `175` or `149.50`.
- Set `discountPercent` to `0` for the normal price, or a percentage such as `20` to run a sale.
- Change `discountLabel` to the offer name, such as “Summer offer.”

For a 20% discount on a $150 logo, the logo entry would be:

```json
"logo": {
  "price": 150,
  "discountPercent": 20,
  "discountLabel": "Summer offer"
}
```

The website displays $120, the original $150 price, and the offer label. The terms and required payment amount also show $120. Other services keep their own prices. To end the sale, set `discountPercent` back to `0`. Discounts are switched on and off manually; they have no automatic expiry. No discount is currently enabled.

Save the file and refresh the local preview. For the published site, commit and deploy the change through your hosting workflow. Run `bun run validate` first: it identifies invalid prices or discount percentages before publishing. Keep the JSON commas and quotation marks intact.

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
