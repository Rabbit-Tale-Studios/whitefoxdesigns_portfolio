import { getGalleryPage } from "@/lib/deviantart";

export async function GET(request: Request) {
  const rawOffset = new URL(request.url).searchParams.get("offset") ?? "0";
  if (!/^\d{1,5}$/.test(rawOffset) || Number(rawOffset) > 50000)
    return Response.json({ error: "Invalid gallery page." }, { status: 400 });
  try {
    const gallery = await getGalleryPage(Number(rawOffset));
    return Response.json(gallery, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400",
      },
    });
  } catch {
    return Response.json(
      { error: "More work could not be loaded. Please try again." },
      {
        status: 503,
        headers: { "Cache-Control": "no-store", "Retry-After": "60" },
      },
    );
  }
}
