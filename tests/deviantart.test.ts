import { describe, expect, test } from "bun:test";
import {
  createDeviantArtClient,
  type DeviantArtRequest,
} from "@/lib/deviantart-client";

const artwork = {
  deviationid: "deviation-1",
  title: "A & B <Design>",
  url: "https://www.deviantart.com/whitefoxdesigns/art/Original-123",
  author: { username: "WhitefoxDesigns" },
  published_time: "1717200000",
  content: {
    src: "https://images-wixmp-example.wixmp.com/f/account/design.png?token=image-token",
    width: 650,
    height: 520,
  },
};
const options = {
  clientId: "test-id",
  clientSecret: "test-secret",
  username: "whitefoxdesigns",
};
const token = (value = "test-token", expiresIn = 3600) =>
  Response.json({ access_token: value, expires_in: expiresIn });
const page = (
  results: unknown[] = [artwork],
  hasMore = true,
  nextOffset: number | null = 18,
) => Response.json({ results, has_more: hasMore, next_offset: nextOffset });

describe("DeviantArt gallery integration", () => {
  test("authenticates privately, requests the correct cursor, and preserves original metadata", async () => {
    const calls: { url: string; init?: RequestInit }[] = [];
    const request: DeviantArtRequest = async (input, init) => {
      calls.push({ url: String(input), init });
      return String(input).endsWith("/oauth2/token") ? token() : page();
    };
    const result = await createDeviantArtClient({
      ...options,
      request,
    }).gallery(0);
    expect(calls).toHaveLength(2);
    expect(calls[0].init?.method).toBe("POST");
    const body = new URLSearchParams(String(calls[0].init?.body));
    expect(body.get("grant_type")).toBe("client_credentials");
    expect(body.get("client_secret")).toBe("test-secret");
    expect(body.has("scope")).toBe(false);
    const url = new URL(calls[1].url);
    expect(url.pathname).toBe("/api/v1/oauth2/gallery/all");
    expect(url.searchParams.get("username")).toBe("whitefoxdesigns");
    expect(url.searchParams.get("offset")).toBe("0");
    expect(url.searchParams.get("limit")).toBe("18");
    expect(url.searchParams.has("access_token")).toBe(false);
    const headers = new Headers(calls[1].init?.headers);
    expect(headers.get("Authorization")).toBe("Bearer test-token");
    expect(headers.get("User-Agent")).toContain("Whitefox");
    expect(headers.get("Accept-Encoding")).toContain("gzip");
    expect(result.projects[0]).toMatchObject({
      id: artwork.deviationid,
      title: artwork.title,
      url: artwork.url,
      image: artwork.content.src,
      author: "WhitefoxDesigns",
      publishedAt: "2024-06-01T00:00:00.000Z",
    });
    expect(result.nextOffset).toBe(18);
    expect(JSON.stringify(result)).not.toContain("test-secret");
    expect(JSON.stringify(result)).not.toContain("test-token");
  });

  test("shares authentication across concurrent pages and renews an expired token", async () => {
    let time = 0;
    let tokens = 0;
    const cursors: string[] = [];
    const request: DeviantArtRequest = async (input) => {
      if (String(input).endsWith("/oauth2/token")) {
        tokens++;
        return token(`token-${tokens}`);
      }
      cursors.push(new URL(String(input)).searchParams.get("offset") ?? "");
      return page([artwork], false, null);
    };
    const client = createDeviantArtClient({
      ...options,
      request,
      now: () => time,
    });
    await Promise.all([client.gallery(0), client.gallery(18)]);
    expect(tokens).toBe(1);
    expect(cursors.sort()).toEqual(["0", "18"]);
    time = 3600000;
    await client.gallery(36);
    expect(tokens).toBe(2);
  });

  test("refreshes an invalid token once and retries the same gallery page", async () => {
    let tokenCalls = 0;
    let galleryCalls = 0;
    const request: DeviantArtRequest = async (input) => {
      if (String(input).endsWith("/oauth2/token"))
        return token(`token-${++tokenCalls}`);
      galleryCalls++;
      return galleryCalls === 1
        ? new Response(null, { status: 401 })
        : page([artwork], false, null);
    };
    const result = await createDeviantArtClient({
      ...options,
      request,
    }).gallery(18);
    expect(result.projects).toHaveLength(1);
    expect(tokenCalls).toBe(2);
    expect(galleryCalls).toBe(2);
  });

  test("filters unavailable artwork and unsafe links without losing pagination", async () => {
    const invalid = [
      { ...artwork, deviationid: "deleted", is_deleted: true },
      { ...artwork, deviationid: "blocked", is_blocked: true },
      { ...artwork, deviationid: "private", is_published: false },
      { ...artwork, deviationid: "url", url: "javascript:alert(1)" },
      {
        ...artwork,
        deviationid: "foreign",
        url: "https://www.deviantart.com/another-user/art/Example-1",
      },
      {
        ...artwork,
        deviationid: "host",
        content: { ...artwork.content, src: "https://example.com/image.jpg" },
      },
      {
        ...artwork,
        deviationid: "size",
        content: { ...artwork.content, width: 0 },
      },
    ];
    const request: DeviantArtRequest = async (input) =>
      String(input).endsWith("/oauth2/token")
        ? token()
        : page([artwork, artwork, ...invalid]);
    const result = await createDeviantArtClient({
      ...options,
      request,
    }).gallery(0);
    expect(result.projects).toHaveLength(1);
    expect(result.hasMore).toBe(true);
    expect(result.nextOffset).toBe(18);
  });

  test("uses a suitable preview and supports thumbnail-only deviations", async () => {
    const preview = {
      ...artwork.content,
      src: "https://images-wixmp-example.wixmp.com/f/account/preview.jpg",
      width: 800,
      height: 640,
    };
    const second = {
      ...artwork,
      deviationid: "deviation-2",
      content: undefined,
      thumbs: [artwork.content],
      published_time: "not-a-date",
    };
    const request: DeviantArtRequest = async (input) =>
      String(input).endsWith("/oauth2/token")
        ? token()
        : page([{ ...artwork, preview }, second], false, null);
    const result = await createDeviantArtClient({
      ...options,
      request,
    }).gallery(0);
    expect(result.projects[0].image).toBe(preview.src);
    expect(result.projects[1].image).toBe(artwork.content.src);
    expect(result.projects[1].publishedAt).toBeUndefined();
    expect(result.hasMore).toBe(false);
  });

  test("does not hammer the API on rate limits or leak upstream errors", async () => {
    let calls = 0;
    const request: DeviantArtRequest = async (input) => {
      if (String(input).endsWith("/oauth2/token")) return token();
      calls++;
      return Response.json(
        { error_description: "upstream secret details" },
        { status: 429 },
      );
    };
    await expect(
      createDeviantArtClient({ ...options, request }).gallery(0),
    ).rejects.toThrow("DeviantArt gallery is unavailable.");
    expect(calls).toBe(1);
  });

  test("rejects invalid cursors and malformed responses", async () => {
    let calls = 0;
    const request: DeviantArtRequest = async (input) => {
      calls++;
      return String(input).endsWith("/oauth2/token")
        ? token()
        : page([artwork], true, 0);
    };
    const client = createDeviantArtClient({ ...options, request });
    for (const offset of [-1, 1.5, 50001])
      await expect(client.gallery(offset)).rejects.toThrow(
        "Invalid gallery offset.",
      );
    expect(calls).toBe(0);
    await expect(client.gallery(0)).rejects.toThrow(
      "DeviantArt returned an invalid gallery cursor.",
    );
  });

  test("recovers after authentication fails", async () => {
    let calls = 0;
    const request: DeviantArtRequest = async (input) => {
      if (String(input).endsWith("/oauth2/token"))
        return ++calls === 1 ? new Response(null, { status: 401 }) : token();
      return page([artwork], false, null);
    };
    const client = createDeviantArtClient({ ...options, request });
    await expect(client.gallery(0)).rejects.toThrow(
      "DeviantArt authentication is unavailable.",
    );
    expect((await client.gallery(0)).projects).toHaveLength(1);
  });
});
