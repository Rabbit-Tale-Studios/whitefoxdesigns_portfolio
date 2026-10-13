import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { pageSeo } from "@/lib/seo";
import { site } from "@/lib/site";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const sans = localFont({
    src: "./fonts/dm-sans-latin.woff2",
    variable: "--font-sans",
    display: "swap",
    weight: "100 1000",
});

export const metadata: Metadata = {
    metadataBase: new URL(site.url),
    title: { default: pageSeo["/"].title, template: "%s - Whitefox Designs" },
    description: site.description,
    robots: { googleBot: { "max-image-preview": "large" } },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={sans.variable} data-scroll-behavior="smooth">
            <body>
                <a className="skip-link" href="#main-content">
                    Skip to content
                </a>
                <SiteHeader />
                {children}
                <SiteFooter />
                <Analytics />
            </body>
        </html>
    );
}
