import type { MetadataRoute } from "next";
import { pageSeo } from "@/lib/seo";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
    return Object.keys(pageSeo).map((path) => ({
        url: new URL(path, site.url).href,
    }));
}
