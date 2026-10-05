import type { Metadata } from "next";
import Link from "next/link";
import { CopyEmail } from "@/components/copy-email";
import { ArrowUpRight, Check } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Have a logo in mind? Contact Whitefox Designs to discuss your project, references, and commission details.",
};

export default function Contact() {
  return (
    <main id="main-content" className="wrap inner-page">
      <section className="page-intro">
        <p className="eyebrow">CONTACT / SAY HELLO</p>
        <h1>
          Good things start
          <br />
          <span>with an idea.</span>
        </h1>
        <p>
          Tell me what you have in mind. Let’s make something that feels like
          you.
        </p>
      </section>
      <div className="contact-grid">
        <section className="email-card" aria-labelledby="email-title">
          <p className="eyebrow">STRAIGHT TO MY INBOX</p>
          <h2 id="email-title">
            Let’s talk
            <br />
            about your project.
          </h2>
          <a className="email-address" href={`mailto:${site.email}`}>
            {site.email}
            <ArrowUpRight />
          </a>
          <CopyEmail />
          <p>
            Still figuring out the details? Request an advisory. It doesn’t have
            a cost.
          </p>
        </section>
        <section className="brief-card" aria-labelledby="brief-title">
          <p className="eyebrow">A LITTLE ABOUT YOU</p>
          <h2 id="brief-title">What to include</h2>
          <ul>
            {[
              "Your project name and a little about it",
              "The name of the copyright owner",
              "Ideas, references, and preferred colors",
              "Your deadline and required file formats",
              "Your PayPal email for the invoice",
              "Whether you’d like the private Vault Service",
            ].map((item) => (
              <li key={item}>
                <Check />
                {item}
              </li>
            ))}
          </ul>
          <Link href="/tos#WorkProcess" className="text-link">
            The full project checklist <ArrowUpRight />
          </Link>
        </section>
      </div>
      <section className="find-me" aria-labelledby="social-title">
        <div>
          <p className="eyebrow">ELSEWHERE ON THE INTERNET</p>
          <h2 id="social-title">Find me here, too.</h2>
        </div>
        <div className="social-list">
          {site.socials.map((social, index) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="social-number">0{index + 1}</span>
              <span>
                {social.name}
                {social.name === "Discord" && <small>@whitefox.designs</small>}
              </span>
              <ArrowUpRight />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
