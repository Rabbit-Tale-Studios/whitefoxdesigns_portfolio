"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { BrandMark } from "@/components/brand-mark";
import { ArrowUpRight, Plus } from "@/components/icons";

const links = [
  { href: "/", label: "Portfolio" },
  { href: "/commissions", label: "Commissions" },
  { href: "/tos", label: "Terms of service" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  function closeMenu() {
    if (menu.current) menu.current.open = false;
  }

  return (
    <header className="site-header">
      <div className="header-inner wrap">
        <Link
          href="/"
          className="brand"
          aria-label="Whitefox Designs home"
          onClick={closeMenu}
        >
          <BrandMark />
          <span>
            whitefox<span className="brand-sub">DESIGNS</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="button button-small header-contact">
          Let’s talk <ArrowUpRight />
        </Link>
        <details
          className="mobile-menu"
          ref={menu}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              closeMenu();
              menu.current?.querySelector("summary")?.focus();
            }
          }}
        >
          <summary aria-label="Toggle navigation">
            <span>Menu</span>
            <Plus />
          </summary>
          <nav aria-label="Mobile navigation">
            {[...links, { href: "/contact", label: "Let’s talk" }].map(
              (link) => (
                <Link
                  href={link.href}
                  key={link.href}
                  onClick={closeMenu}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                  <ArrowUpRight />
                </Link>
              ),
            )}
          </nav>
        </details>
      </div>
    </header>
  );
}
