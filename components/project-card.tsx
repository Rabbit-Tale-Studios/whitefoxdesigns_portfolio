import Image from "next/image";
import { ArrowUpRight } from "@/components/icons";

import type { GalleryProject } from "@/lib/gallery-types";

export function ProjectCard({
  project,
  number,
}: {
  project: GalleryProject;
  number: number;
}) {
  const date = project.publishedAt
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(project.publishedAt))
    : null;
  return (
    <a
      className="project-card"
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.title} — view on DeviantArt (opens in a new tab)`}
    >
      <div className="project-art">
        <Image
          src={project.image}
          width={project.width}
          height={project.height}
          alt={`${project.title} by ${project.author ?? "Whitefox Designs"}`}
          sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
        />
        <span className="project-open">
          <ArrowUpRight />
        </span>
      </div>
      <div className="project-caption">
        <div>
          <h3>{project.title}</h3>
          <p>
            {date && project.publishedAt ? (
              <time dateTime={project.publishedAt}>{date}</time>
            ) : (
              "Logo design"
            )}
          </p>
        </div>
        <span className="project-number">
          {String(number).padStart(2, "0")}
        </span>
      </div>
    </a>
  );
}
