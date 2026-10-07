"use client";

import { type ReactNode, useEffect, useState } from "react";
import { ArrowUpRight } from "@/components/icons";

type TermsSection = { id: string; label: ReactNode };

export function TermsNavigation({ sections }: { sections: TermsSection[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    const elements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    let frame = 0;

    function updateActiveSection() {
      frame = 0;
      const offset =
        Number.parseFloat(
          getComputedStyle(document.documentElement).scrollPaddingTop,
        ) || 0;
      let current = elements[0]?.id;
      for (const element of elements) {
        if (element.getBoundingClientRect().top > offset + 24) break;
        current = element.id;
      }
      setActiveId(current);
    }

    function scheduleUpdate() {
      if (!frame) frame = requestAnimationFrame(updateActiveSection);
    }

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
    };
  }, [sections]);

  return (
    <nav aria-label="Terms sections">
      {sections.map(({ id, label }, index) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={activeId === id ? "location" : undefined}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          {label}
          <ArrowUpRight />
        </a>
      ))}
    </nav>
  );
}
