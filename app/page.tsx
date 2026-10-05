import Image from "next/image";
import Link from "next/link";
import { ContactBanner } from "@/components/contact-banner";
import { Gallery } from "@/components/gallery";
import { Arrow, ArrowUpRight, Plus } from "@/components/icons";
import { getInitialGallery } from "@/lib/deviantart";
import { site } from "@/lib/site";

export const revalidate = 60;

export default async function Home() {
  const gallery = await getInitialGallery();
  return (
    <main id="main-content">
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">INDEPENDENT LOGO DESIGNER</p>
          <h1 id="hero-title">
            A little character.
            <br />A lasting <span>identity.</span>
          </h1>
          <p className="hero-description">
            I’m Whitefox. I create distinctive brand identities that capture
            your story and set you apart.
          </p>
          <div className="hero-actions">
            <Link href="#work" className="button">
              Explore my work <Arrow className="arrow-down" />
            </Link>
            <Link href="/commissions" className="text-link">
              Commission a logo <ArrowUpRight />
            </Link>
          </div>
          <div className="hero-note">
            <span className="tiny-cross">+</span> Thoughtfully drawn. Uniquely
            yours.
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-caption">
            <span>THE MAKING OF A MARK</span>
            <span>WF-01</span>
          </div>
          <Image
            src="/brand/construction.png"
            width={612}
            height={612}
            sizes="(max-width: 760px) 90vw, 42vw"
            alt="The original Whitefox symbol, with geometric construction lines"
            preload
            className="construction-art"
          />
          <div className="visual-bottom">
            <span>
              From a simple idea
              <br />
              to something unmistakable.
            </span>
            <span className="visual-stamp">wf.</span>
          </div>
        </div>
      </section>
      <div className="specialties wrap">
        <span>LOGO DESIGN</span>
        <Plus />
        <span>BRAND IDENTITY</span>
        <Plus />
        <span>VECTOR ARTWORK</span>
        <Plus />
        <span>BUSINESS CARDS</span>
      </div>
      <section
        id="work"
        className="work-section wrap"
        aria-labelledby="work-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / THE PORTFOLIO</p>
            <h2 id="work-title">
              Small marks.
              <br />
              <span className="muted">Big personalities.</span>
            </h2>
          </div>
          <p>
            A selection of identities, each with a story
            <br className="desktop-break" /> and a character of its own.
          </p>
        </div>
        <Gallery initialPage={gallery} />
        <p className="gallery-footnote">
          All designs belong to their respective owners.{" "}
          <a
            href={site.socials[0].href}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit the full gallery <ArrowUpRight />
          </a>
        </p>
      </section>
      <section className="about-section" aria-labelledby="about-title">
        <div className="wrap about-grid">
          <div>
            <p className="eyebrow">02 / BEHIND THE DESIGN</p>
            <h2 id="about-title">
              Your story.
              <br />
              My attention
              <br />
              <span>to every detail.</span>
            </h2>
          </div>
          <div className="about-copy">
            <p className="large-copy">
              Good design starts with a conversation. What you do, what you
              love, and how you want to be seen.
            </p>
            <p>
              From the first approach to the finishing touches, I work with you
              to build an identity that feels right. You receive editable vector
              files, full commercial rights, and support after your project is
              complete.
            </p>
            <Link href="/commissions" className="text-link">
              A closer look at the process <ArrowUpRight />
            </Link>
            <div className="about-facts">
              <div>
                <strong>01</strong>
                <span>Designer, from start to finish</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>Your commercial rights</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="wrap banner-wrap">
        <ContactBanner />
      </div>
    </main>
  );
}
