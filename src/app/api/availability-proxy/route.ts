import { NextResponse } from "next/server";

// Server-side proxy to avoid browser CORS. It forwards availability queries
// to the upstream service and returns the JSON response unchanged when OK.
// On upstream failure, it returns the same status so the client can display
// error/fallback states appropriately.

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const serviceType = url.searchParams.get("serviceType");
    const type = url.searchParams.get("type");
    const date = url.searchParams.get("date");

    if (!serviceType || !type || !date) {
      return NextResponse.json({ error: "Missing required query params" }, { status: 400 });
    }

    const upstreamBase =
      process.env.CHECK_AVAILABILITY_BASE ??
      process.env.NEXT_PUBLIC_CHECK_AVAILABILITY_URL ??
      "https://cp-queue-backend.vercel.app";

    const upstreamUrl = `${upstreamBase}/api/availability?serviceType=${encodeURIComponent(
      serviceType
    )}&type=${encodeURIComponent(type)}&date=${encodeURIComponent(date)}`;

    const res = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      // Enable Next.js caching controls if needed; keep lightweight for demo
      next: { revalidate: 10 },
    });

    if (!res.ok) {
      // Forward upstream response (status and body) when possible
      const contentType = res.headers.get("content-type") ?? "application/json";
      let bodyText = "";
      try {
        bodyText = await res.text();
      } catch {
        bodyText = JSON.stringify({ error: "Upstream error" });
      }
      return new NextResponse(bodyText, {
        status: res.status,
        headers: { "content-type": contentType },
      });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Proxy network error" }, { status: 502 });
  }
}