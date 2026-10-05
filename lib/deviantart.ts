import "server-only";
import { unstable_cache } from "next/cache";
import { createDeviantArtClient } from "@/lib/deviantart-client";
import type { GalleryPage } from "@/lib/gallery-types";

const clientId = process.env.DEVIANTART_CLIENT_ID?.trim();
const clientSecret = process.env.DEVIANTART_CLIENT_SECRET?.trim();
const username = process.env.DEVIANTART_USERNAME?.trim() || "whitefoxdesigns";
const configured = Boolean(
  clientId && clientSecret && /^[\w-]{1,50}$/.test(username),
);
const client =
  configured && clientId && clientSecret
    ? createDeviantArtClient({ clientId, clientSecret, username })
    : null;

const cachedGallery = unstable_cache(
  async (offset: number) => {
    if (!client) throw new Error("DeviantArt credentials are not configured.");
    return client.gallery(offset);
  },
  ["deviantart-gallery-v1", username, clientId ?? "unconfigured"],
  { revalidate: 900, tags: ["deviantart-gallery"] },
);

export async function getGalleryPage(offset = 0): Promise<GalleryPage> {
  return cachedGallery(offset);
}

export async function getInitialGallery(): Promise<GalleryPage> {
  try {
    return await getGalleryPage();
  } catch {
    console.warn("DeviantArt gallery is temporarily unavailable.");
    return {
      projects: [],
      hasMore: false,
      nextOffset: null,
      unavailable: true,
    };
  }
}
