import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { ArrowUpRight } from "@/components/icons";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <Link href="/" className="brand" aria-label="Whitefox Designs home">
            <BrandMark />
            <span>
              whitefox<span className="brand-sub">DESIGNS</span>
            </span>
          </Link>
          <p>
            Distinctive identities.
            <br />
            Designed with character.
          </p>
          <a className="text-link" href={`mailto:${site.email}`}>
            Say hello <ArrowUpRight />
          </a>
        </div>
        <div className="footer-links">
          <nav aria-label="Social links">
            {site.socials.map((social) => (
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                key={social.name}
              >
                {social.name}
                <ArrowUpRight />
              </a>
            ))}
          </nav>
          <Link href="/tos">Terms of service</Link>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()}{" "}
            <a
              href="https://hasira.me"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hasira
            </a>
            . All rights reserved.
          </p>
          <a href="https://hasira.me" target="_blank" rel="noopener noreferrer">
            Made with ♥ by Hasira
          </a>
        </div>
      </div>
    </footer>
  );
}
