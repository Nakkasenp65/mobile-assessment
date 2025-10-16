import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      serviceType,
      type,
      date,
      time,
      customerName,
      phone,
      extra,
    } = body || {};

    if (!serviceType || !type || !date || !time) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const payload = {
      serviceType,
      type, // ONSITE / OFFSITE / ONLINE
      date,
      time,
      customerName: customerName ?? "",
      phone: phone ?? "",
      extra: extra ?? {},
    };

    const backend = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL;

    if (backend) {
      // Attempt to forward to backend; path can be adjusted as needed.
      const endpoint = `${backend}/api/preferred-time`;
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const contentType = res.headers.get("content-type") ?? "application/json";
        const text = await res.text();
        return new NextResponse(text, { status: res.status, headers: { "content-type": contentType } });
      } catch (err) {
        console.error("Forward preferred-time failed:", err);
        // Fallback to local echo success to avoid blocking UX during preview
        return NextResponse.json({ success: true, echo: payload, forwarded: false });
      }
    }

    // No backend configured; echo payload for local preview
    console.log("preferred-time payload", payload);
    return NextResponse.json({ success: true, echo: payload });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}