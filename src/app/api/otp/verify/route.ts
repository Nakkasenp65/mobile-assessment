import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}) as Record<string, unknown>);
    const token = typeof body?.token === "string" ? body.token : undefined;
    const pin = typeof body?.pin === "string" ? body.pin : undefined;

    if (!token || !pin) {
      return NextResponse.json({ success: false, message: "Missing token or pin" }, { status: 400 });
    }

    const baseUrl = process.env.OTP_BASE_URL;
    const url = `${baseUrl}/verifyOTP`;

    const upstreamRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, pin }),
    });

    const text = await upstreamRes.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text } as Record<string, unknown>;
    }

    const obj = typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : {};
    const msg = typeof obj.msg === "string" ? obj.msg : undefined;
    const codeVal = obj.code as unknown;
    const statusVal = obj.status as unknown;

    const codeOk = codeVal === "0" || codeVal === 0;
    const statusOk = statusVal === "200" || statusVal === 200;

    const verified = upstreamRes.ok && (codeOk || statusOk);

    return NextResponse.json(
      {
        success: verified,
        message: msg ?? (verified ? "Verified" : "Verification failed"),
        data: { verified },
        raw: obj,
      },
      { status: verified ? 200 : 400 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
