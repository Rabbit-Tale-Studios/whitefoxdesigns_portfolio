"use client";

import { useRef, useState } from "react";
import { Plus } from "@/components/icons";
import { ProjectCard } from "@/components/project-card";
import type { GalleryPage } from "@/lib/gallery-types";

function LoadingLabel({ loading, idle }: { loading: boolean; idle: string }) {
  return (
    <span className="button-label">
      <span data-active={!loading}>{idle}</span>
      <span data-active={loading}>Loading projects…</span>
    </span>
  );
}

export function Gallery({ initialPage }: { initialPage: GalleryPage }) {
  const [gallery, setGallery] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const requestPending = useRef(false);

  async function loadPage(offset: number) {
    if (requestPending.current) return;
    requestPending.current = true;
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/gallery?offset=${offset}`, {
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw new Error("Gallery unavailable");
      const next: GalleryPage = await response.json();
      setGallery((current) => ({
        ...next,
        projects:
          offset === 0
            ? next.projects
            : [
                ...new Map(
                  [...current.projects, ...next.projects].map((project) => [
                    project.id,
                    project,
                  ]),
                ).values(),
              ],
      }));
      setMessage(
        next.projects.length
          ? `${next.projects.length} projects loaded.`
          : "No additional artwork on this page.",
      );
    } catch {
      setMessage("Work could not be loaded. Please try again.");
    } finally {
      requestPending.current = false;
      setLoading(false);
    }
  }

  return (
    <>
      <div className="project-grid">
        {gallery.projects.slice(0, 6).map((project, index) => (
          <ProjectCard key={project.id} project={project} number={index + 1} />
        ))}
      </div>
      {(gallery.projects.length > 6 || gallery.hasMore) && (
        <details className="more-work">
          <summary className="button button-outline">
            <span className="button-label">
              <span className="when-closed">Explore more work</span>
              <span className="when-open">Show fewer projects</span>
            </span>
            <Plus />
          </summary>
          <div className="project-grid">
            {gallery.projects.slice(6).map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                number={index + 7}
              />
            ))}
          </div>
          <div className="gallery-pagination">
            {gallery.hasMore && gallery.nextOffset !== null && (
              <button
                type="button"
                className="button button-outline"
                disabled={loading}
                onClick={() => loadPage(gallery.nextOffset ?? 0)}
              >
                <LoadingLabel loading={loading} idle="Load more projects" />
                <Plus />
              </button>
            )}
          </div>
        </details>
      )}
      {gallery.projects.length === 0 && (
        <div className="gallery-empty">
          <p>
            {gallery.unavailable
              ? "The gallery is temporarily unavailable. Try again, or visit the full gallery below."
              : "New work is on its way. Visit my full gallery below."}
          </p>
          {gallery.unavailable && (
            <button
              className="button button-outline"
              type="button"
              disabled={loading}
              onClick={() => loadPage(0)}
            >
              <LoadingLabel loading={loading} idle="Try again" />
            </button>
          )}
        </div>
      )}
      <output className="gallery-message">{message}</output>
    </>
  );
}
