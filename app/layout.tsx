import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
  title: {
    default: "Whitefox Designs - Logo Design & Brand Identity",
    template: "%s - Whitefox Designs",
  },
  description: site.description,
  openGraph: {
    title: "Whitefox Designs",
    description: site.description,
    type: "website",
    siteName: site.name,
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Whitefox Designs - logo design and brand identity, with the Whitefox logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: [
      {
        url: "/og-image.png",
        alt: "Whitefox Designs - logo design and brand identity, with the Whitefox logo",
      },
    ],
  },
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
