import type { GalleryPage, GalleryProject } from "@/lib/gallery-types";

export const GALLERY_PAGE_SIZE = 18;

export type DeviantArtRequest = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

type ClientOptions = {
  clientId: string;
  clientSecret: string;
  username: string;
  request?: DeviantArtRequest;
  now?: () => number;
};

type ImageAsset = { src: string; width: number; height: number };

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function imageAsset(value: unknown): ImageAsset | null {
  if (!record(value) || typeof value.src !== "string") return null;
  if (typeof value.width !== "number" || typeof value.height !== "number")
    return null;
  if (
    !Number.isInteger(value.width) ||
    !Number.isInteger(value.height) ||
    value.width < 1 ||
    value.height < 1
  )
    return null;
  try {
    const url = new URL(value.src);
    if (url.protocol !== "https:" || url.port || url.username || url.password)
      return null;
    if (
      !(
        url.hostname.endsWith(".wixmp.com") && url.pathname.startsWith("/f/")
      ) &&
      !url.hostname.endsWith(".deviantart.net")
    )
      return null;
    return { src: url.href, width: value.width, height: value.height };
  } catch {
    return null;
  }
}

function publishedAt(value: unknown): string | undefined {
  if (typeof value !== "string" && typeof value !== "number") return undefined;
  const date = new Date(
    /^\d+$/.test(String(value)) ? Number(value) * 1000 : String(value),
  );
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function projectFromDeviation(
  value: unknown,
  username: string,
): GalleryProject | null {
  if (
    !record(value) ||
    value.is_deleted ||
    value.is_blocked ||
    value.is_published === false
  )
    return null;
  if (
    typeof value.deviationid !== "string" ||
    typeof value.title !== "string" ||
    typeof value.url !== "string"
  )
    return null;
  if (!value.deviationid || !value.title.trim()) return null;
  let url: URL;
  try {
    url = new URL(value.url);
  } catch {
    return null;
  }
  if (
    url.protocol !== "https:" ||
    !["www.deviantart.com", "deviantart.com"].includes(url.hostname) ||
    url.port ||
    url.username ||
    url.password
  )
    return null;
  if (!url.pathname.toLowerCase().startsWith(`/${username.toLowerCase()}/art/`))
    return null;
  const preview = imageAsset(value.preview);
  const content = imageAsset(value.content);
  const thumbs = Array.isArray(value.thumbs)
    ? value.thumbs
        .map(imageAsset)
        .filter((asset): asset is ImageAsset => asset !== null)
        .sort((a, b) => b.width - a.width)
    : [];
  const image =
    preview && preview.width >= 650
      ? preview
      : (content ?? preview ?? thumbs[0]);
  if (!image) return null;
  return {
    id: value.deviationid,
    title: value.title,
    url: url.href,
    image: image.src,
    width: image.width,
    height: image.height,
    author:
      record(value.author) && typeof value.author.username === "string"
        ? value.author.username
        : username,
    publishedAt: publishedAt(value.published_time),
  };
}

export function createDeviantArtClient(options: ClientOptions) {
  const request = options.request ?? fetch;
  const now = options.now ?? Date.now;
  const headers = {
    "User-Agent": "WhitefoxDesigns-Portfolio/1.0",
    "Accept-Encoding": "gzip, deflate",
    Accept: "application/json",
  };
  let token: { value: string; expiresAt: number } | undefined;
  let pendingToken: Promise<string> | undefined;

  async function requestToken(): Promise<string> {
    const response = await request("https://www.deviantart.com/oauth2/token", {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: options.clientId,
        client_secret: options.clientSecret,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok)
      throw new Error("DeviantArt authentication is unavailable.");
    const data: unknown = await response.json();
    if (
      !record(data) ||
      typeof data.access_token !== "string" ||
      !data.access_token ||
      typeof data.expires_in !== "number" ||
      !Number.isFinite(data.expires_in) ||
      data.expires_in <= 0
    )
      throw new Error("DeviantArt returned an invalid access token.");
    token = {
      value: data.access_token,
      expiresAt:
        now() + data.expires_in * 1000 - Math.min(60000, data.expires_in * 500),
    };
    return token.value;
  }

  async function accessToken(): Promise<string> {
    if (token && now() < token.expiresAt) return token.value;
    if (!pendingToken)
      pendingToken = requestToken().finally(() => {
        pendingToken = undefined;
      });
    return pendingToken;
  }

  async function gallery(offset: number): Promise<GalleryPage> {
    if (!Number.isInteger(offset) || offset < 0 || offset > 50000)
      throw new Error("Invalid gallery offset.");
    const url = new URL("https://www.deviantart.com/api/v1/oauth2/gallery/all");
    url.search = new URLSearchParams({
      username: options.username,
      offset: String(offset),
      limit: String(GALLERY_PAGE_SIZE),
      with_session: "false",
      mature_content: "false",
    }).toString();
    let response: Response | undefined;
    for (let attempt = 0; attempt < 2; attempt++) {
      const currentToken = await accessToken();
      response = await request(url, {
        headers: {
          ...headers,
          Authorization: `Bearer ${currentToken}`,
          "dA-minor-version": "20240701",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (response.status !== 401 || attempt === 1) break;
      if (token?.value === currentToken) token = undefined;
    }
    if (!response?.ok) throw new Error("DeviantArt gallery is unavailable.");
    const data: unknown = await response.json();
    if (
      !record(data) ||
      !Array.isArray(data.results) ||
      typeof data.has_more !== "boolean"
    )
      throw new Error("DeviantArt returned an invalid gallery.");
    const projects = data.results
      .map((item) => projectFromDeviation(item, options.username))
      .filter((project): project is GalleryProject => project !== null);
    const unique = [
      ...new Map(projects.map((project) => [project.id, project])).values(),
    ];
    const nextOffset =
      typeof data.next_offset === "number" &&
      Number.isInteger(data.next_offset) &&
      data.next_offset > offset &&
      data.next_offset <= 50000
        ? data.next_offset
        : null;
    if (data.has_more && nextOffset === null)
      throw new Error("DeviantArt returned an invalid gallery cursor.");
    return {
      projects: unique,
      hasMore: data.has_more && nextOffset !== null,
      nextOffset: data.has_more ? nextOffset : null,
    };
  }

  return { gallery };
}
