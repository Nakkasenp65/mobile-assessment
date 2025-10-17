import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "Missing assessment id" }, { status: 400 });
    }

    if (!BACKEND_URL) {
      return NextResponse.json({ error: "Missing NEXT_PUBLIC_BACKEND_URL" }, { status: 500 });
    }

    const body = await req.json();

    const upstream = `${BACKEND_URL}/api/assessments/${id}`;

    const upstreamRes = await fetch(upstream, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await upstreamRes.json();
    return NextResponse.json(data, { status: upstreamRes.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "Missing assessment id" }, { status: 400 });
    }

    // Provide a debug stub when using /details/debug for previewing UI
    if (id === "debug") {
      const params = req.nextUrl.searchParams;
      const expired = params.get("expired") === "true";
      const now = Date.now();
      const expiryIso = expired ? new Date(now - 1 * 1000).toISOString() : new Date(now + 5 * 60 * 1000).toISOString();
      const payload = {
        success: true,
        data: {
          _id: "debug",
          docId: "DEBUG-001",
          phoneNumber: "0812345678",
          deviceInfo: { brand: "Apple", model: "iPhone 13", storage: "128GB" },
          conditionInfo: {
            canUnlockIcloud: false,
            modelType: "",
            warranty: "",
            openedOrRepaired: "",
            accessories: "",
            bodyCondition: "body_mint",
            screenGlass: "glass_ok",
            screenDisplay: "display_ok",
            batteryHealth: "battery_health_high",
            camera: "camera_ok",
            wifi: "wifi_ok",
            faceId: "biometric_ok",
            speaker: "speaker_ok",
            mic: "mic_ok",
            touchScreen: "touchscreen_ok",
            charger: "charger_ok",
            call: "call_ok",
            homeButton: "home_button_ok",
            sensor: "sensor_ok",
            buttons: "buttons_ok",
          },
          status: "pending",
          estimatedValue: 19999,
          assessmentDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          priceLockExpiresAt: expiryIso,
        },
      };
      return NextResponse.json(payload, { status: 200 });
    }

    if (!BACKEND_URL) {
      return NextResponse.json({ error: "Missing NEXT_PUBLIC_BACKEND_URL" }, { status: 500 });
    }

    const upstream = `${BACKEND_URL}/api/assessments/${id}`;
    const upstreamRes = await fetch(upstream, { method: "GET" });
    const data = await upstreamRes.json();

    // Enrich with priceLockExpiresAt if missing
    if (data?.success && data?.data) {
      const record = data.data;
      if (!record.priceLockExpiresAt) {
        const baseDateStr = record.assessmentDate || record.createdAt;
        const baseDate = baseDateStr ? new Date(baseDateStr) : new Date();
        const expires = new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
        record.priceLockExpiresAt = expires;
      }
    }

    return NextResponse.json(data, { status: upstreamRes.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}