import type { Metadata } from "next";
import Link from "next/link";
import { ContactBanner } from "@/components/contact-banner";
import { ArrowUpRight, Check } from "@/components/icons";
import { ServicePrice } from "@/components/service-price";
import logoInclusions from "@/content/logo-inclusions.json";

export const metadata: Metadata = {
  title: "Commissions",
  description:
    "Custom logo design, editable vector files, and full commercial rights. Explore Whitefox’s services and commission process.",
};

const steps = [
  {
    title: "Tell me your story.",
    text: "Share your project name, ideas, references, colors, and deadline. Not sure where to begin? You can request a free advisory.",
  },
  {
    title: "Find the right direction.",
    text: "Once your project is active, I send an initial design approach. We work through your feedback and refine the details together.",
  },
  {
    title: "Make it yours.",
    text: "Approve the final design and receive your original vector files, requested formats, and full commercial rights. I’m here for follow-up support, too.",
  },
];

export default function Commissions() {
  return (
    <main id="main-content" className="wrap inner-page">
      <section className="page-intro">
        <p className="eyebrow">COMMISSIONS / MADE FOR YOU</p>
        <h1>
          Your next identity
          <br />
          <span>starts here.</span>
        </h1>
        <p>
          One designer, a thoughtful process, and a mark that tells your story.
        </p>
      </section>
      <section className="pricing-grid" aria-labelledby="pricing-title">
        <div className="main-price">
          <div className="price-top">
            <span className="eyebrow">THE COMPLETE IDENTITY</span>
            <span className="pill">Logo design</span>
          </div>
          <h2 id="pricing-title">A mark of your own.</h2>
          <ServicePrice service="logo" main />
          <ul className="features">
            {logoInclusions.map((feature) => (
              <li key={feature}>
                <Check />
                {feature}
              </li>
            ))}
          </ul>
          <Link href="/contact" className="button">
            Start a conversation <ArrowUpRight />
          </Link>
          <p className="fine-print">
            <Link href="/tos#Service">Read the full service terms.</Link>
          </p>
        </div>
        <div className="add-on-stack">
          <article className="add-on">
            <p className="eyebrow">THE FINISHING TOUCH</p>
            <h3>Business cards</h3>
            <p>A physical extension of your identity.</p>
            <ServicePrice service="businessCards" />
            <span className="fine-print">
              Final cost depends on the time required.
            </span>
          </article>
          <article className="add-on priority">
            <p className="eyebrow">A LITTLE SOONER</p>
            <h3>Priority projects</h3>
            <p>Receive your first design approach within 72 hours.</p>
            <ServicePrice service="priority" additional />
            <span className="fine-print">Subject to availability.</span>
          </article>
        </div>
      </section>
      <section className="process-section" aria-labelledby="process-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE PROCESS</p>
            <h2 id="process-title">
              From hello
              <br />
              <span className="muted">to your new logo.</span>
            </h2>
          </div>
          <p>
            Please allow a minimum of four weeks
            <br className="desktop-break" /> after your project has started.
          </p>
        </div>
        <div className="process-grid">
          {steps.map((step, index) => (
            <article key={step.title}>
              <span className="step-number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
        <div className="service-note">
          <p>
            Payment is through PayPal after you receive an invoice. Existing
            projects may delay the start date by one or more weeks.
          </p>
          <Link href="/tos" className="text-link">
            Read all terms of service <ArrowUpRight />
          </Link>
        </div>
      </section>
      <ContactBanner />
    </main>
  );
}
