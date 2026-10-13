import { site } from "@/lib/site";

export const dynamic = "force-static";

// AI crawler names from Cloudflare's managed robots.txt documentation.
const aiCrawlers = [
    "Amazonbot",
    "Applebot-Extended",
    "Bytespider",
    "CCBot",
    "ClaudeBot",
    "Google-Extended",
    "GPTBot",
    "meta-externalagent",
];

export function GET() {
    const body = [
        "# Standard search indexing is allowed. AI training and AI input are not.",
        "User-Agent: *",
        "Content-signal: search=yes, ai-train=no, ai-input=no",
        "Allow: /",
        "Disallow: /api/",
        "",
        ...aiCrawlers.map((crawler) => `User-Agent: ${crawler}`),
        "Disallow: /",
        "",
        `Sitemap: ${new URL("/sitemap.xml", site.url).href}`,
        "",
    ].join("\n");

    return new Response(body, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
}
