import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";

export function ContactBanner() {
  return (
    <section className="contact-banner" aria-labelledby="contact-title">
      <div>
        <p className="eyebrow">YOUR NEXT CHAPTER</p>
        <h2 id="contact-title">
          Let’s make
          <br />
          your mark.
        </h2>
      </div>
      <div className="contact-banner-copy">
        <p>
          A new idea, a fresh start, or an identity that finally feels like you.
          Let’s bring it to life.
        </p>
        <Link className="button button-light" href="/contact">
          Tell me about your project <ArrowUpRight />
        </Link>
      </div>
    </section>
  );
}
