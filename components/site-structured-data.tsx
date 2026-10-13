import { siteStructuredData } from "@/lib/seo";

export function SiteStructuredData() {
    return (
        <script
            type="application/ld+json"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON is serialized and HTML-sensitive characters are escaped.
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(siteStructuredData).replace(
                    /</g,
                    "\\u003c",
                ),
            }}
        />
    );
}
