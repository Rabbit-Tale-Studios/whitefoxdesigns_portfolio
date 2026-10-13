import type { Metadata } from "next";
import { site } from "@/lib/site";

export const pageSeo = {
    "/": {
        title: "Whitefox Designs - Logo Design & Brand Identity",
        description: site.description,
    },
    "/commissions": {
        title: "Logo Design Commissions & Pricing - Whitefox Designs",
        description:
            "Explore custom logo design commissions, pricing, business cards, and the Whitefox Designs process. Includes editable vector files and full commercial rights.",
    },
    "/contact": {
        title: "Contact Whitefox Designs - Logo Design Enquiries",
        description:
            "Contact Whitefox Designs about a custom logo or brand identity. Share your ideas, references, and deadline, or request a free advisory to get started.",
    },
    "/tos": {
        title: "Commission Terms of Service - Whitefox Designs",
        description:
            "Read Whitefox Designs commission terms covering pricing, payment, the design process, commercial rights, cancellations, and frequently asked questions.",
    },
} as const;

export function createPageMetadata(path: keyof typeof pageSeo): Metadata {
    const { title, description } = pageSeo[path];
    const url = new URL(path, site.url).href;
    const image = {
        url: new URL("/og-image.png", site.url).href,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Whitefox Designs - logo design and brand identity, with the Whitefox logo",
    };
    return {
        title: { absolute: title },
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            type: "website",
            siteName: site.name,
            locale: "en_US",
            images: [image],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
        },
    };
}

export const siteStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": new URL("/#organization", site.url).href,
            name: site.name,
            url: site.url,
            description: site.description,
            email: site.email,
            logo: {
                "@type": "ImageObject",
                url: new URL("/icon.svg", site.url).href,
                width: 952,
                height: 952,
            },
            sameAs: site.socials.map((social) => social.href),
        },
        {
            "@type": "WebSite",
            "@id": new URL("/#website", site.url).href,
            name: site.name,
            url: site.url,
            description: site.description,
            inLanguage: "en",
            publisher: { "@id": new URL("/#organization", site.url).href },
        },
    ],
};
