import type { Metadata } from "next";
import { ArrowUpRight } from "@/components/icons";
import { contentData, type TermBlock } from "@/lib/terms";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Whitefox Designs commission pricing, payment, project process, usage rights, cancellation policy, and frequently asked questions.",
};

function Block({ block }: { block: TermBlock }) {
  if (block.type === "list")
    return (
      <div className="terms-list">
        <h3>{block.title}</h3>
        <ul>
          {block.items.map((item, index) => (
            <li key={typeof item === "string" ? item : `item-${index}`}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  if (block.type === "title") return <h2>{block.content}</h2>;
  if (block.type === "microtitle") return <h3>{block.content}</h3>;
  if (block.type === "note")
    return <aside className="terms-note">{block.content}</aside>;
  return <p>{block.content}</p>;
}

export default function Terms() {
  const sections = Object.entries(contentData);
  return (
    <main id="main-content" className="wrap inner-page">
      <section className="page-intro terms-intro">
        <p className="eyebrow">THE DETAILS / WORKING TOGETHER</p>
        <h1>
          A clear start.
          <br />
          <span>A better process.</span>
        </h1>
        <p>Everything you need to know before commissioning a design.</p>
      </section>
      <div className="terms-layout">
        <aside className="terms-sidebar">
          <p className="eyebrow">TERMS OF SERVICE</p>
          <nav aria-label="Terms sections">
            {sections.map(([id, blocks], index) => (
              <a key={id} href={`#${id}`}>
                <span>0{index + 1}</span>
                {blocks[0].type === "title" ? blocks[0].content : id}
                <ArrowUpRight />
              </a>
            ))}
          </nav>
        </aside>
        <article className="terms-content" aria-label="Terms of service">
          {sections.map(([id, blocks]) => (
            <section id={id} key={id}>
              {blocks.map((block) => (
                <Block key={block.id} block={block} />
              ))}
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
