import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body || {};

    if (!token) {
      return NextResponse.json({ success: false, message: "Missing token" }, { status: 400 });
    }

    const secret = process.env.TURNSTILE_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, message: "Server misconfiguration: TURNSTILE_SECRET not set" },
        { status: 500 },
      );
    }

    const params = new URLSearchParams();
    params.append("response", token);
    params.append("secret", secret);

    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const json = await verifyRes.json();

    if (!json.success) {
      return NextResponse.json({ success: false, detail: json }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
