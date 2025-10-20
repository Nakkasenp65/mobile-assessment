import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

function sanitizeDigits(input: string): string {
  return (input || "").replace(/\D/g, "");
}

function normalizeThaiPhone(phone: string): string {
  const digits = sanitizeDigits(phone);
  if (!digits) return "";
  if (digits.startsWith("66")) return digits;
  if (digits.startsWith("0")) return `66${digits.slice(1)}`;
  // If already no leading 0 and not prefixed, assume local and prefix 66
  return `66${digits}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}) as Record<string, unknown>);
    const inputPhone =
      typeof body?.phoneNumber === "string"
        ? body.phoneNumber
        : typeof body?.phone === "string"
          ? body.phone
          : undefined;

    if (!inputPhone) {
      return NextResponse.json({ success: false, message: "Missing phoneNumber in request body" }, { status: 400 });
    }

    const normalized = normalizeThaiPhone(inputPhone);
    if (!normalized) {
      return NextResponse.json({ success: false, message: "Invalid phone number provided" }, { status: 400 });
    }

    const baseUrl = process.env.OTP_BASE_URL;
    const url = `${baseUrl}/requestOTP`;

    // Use application/x-www-form-urlencoded to match typical Cloud Function expectations
    const upstreamRes = await axios.post(url, new URLSearchParams({ phone: normalized }), {
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      timeout: 10000,
    });

    // Axios returns parsed JSON when possible; otherwise a string. Normalize to object
    const dataUnknown = upstreamRes.data as unknown;
    let obj: Record<string, unknown> = {};
    if (typeof dataUnknown === "string") {
      try {
        obj = JSON.parse(dataUnknown) as Record<string, unknown>;
      } catch {
        obj = { raw: dataUnknown } as Record<string, unknown>;
      }
    } else if (typeof dataUnknown === "object" && dataUnknown !== null) {
      obj = dataUnknown as Record<string, unknown>;
    }

    const msg = typeof obj.msg === "string" ? obj.msg : undefined;
    const codeVal = obj.code as unknown;
    const statusVal = obj.status as unknown;
    const codeOk = codeVal === "0" || codeVal === 0;
    const statusOk = statusVal === "200" || statusVal === 200;
    const ok = codeOk || statusOk;

    const resultObj =
      typeof obj.result === "object" && obj.result !== null ? (obj.result as Record<string, unknown>) : {};

    if (!ok) {
      return NextResponse.json({ success: false, message: msg ?? "OTP request failed", raw: obj }, { status: 400 });
    }

    const requestNo = typeof resultObj.requestNo === "string" ? resultObj.requestNo : undefined;
    const token = typeof resultObj.token === "string" ? resultObj.token : undefined;
    const ref = typeof resultObj.ref === "string" ? resultObj.ref : undefined;

    const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString();

    return NextResponse.json({
      success: true,
      message: msg ?? "OK",
      data: {
        requestNo,
        token,
        ref,
        expiresAt,
      },
      raw: obj,
    });
  } catch (error) {
    const ax = error as AxiosError;
    const status = ax.response?.status ?? 500;
    const raw = ax.response?.data ?? undefined;
    let message: string = ax.message;
    const resData = ax.response?.data;
    if (resData && typeof resData === "object") {
      const objData = resData as Record<string, unknown>;
      const msgStr = typeof objData.msg === "string" ? objData.msg : undefined;
      const messageStr = typeof objData.message === "string" ? objData.message : undefined;
      message = msgStr ?? messageStr ?? message;
    } else if (typeof resData === "string") {
      try {
        const parsed = JSON.parse(resData) as Record<string, unknown>;
        const msgStr = typeof parsed.msg === "string" ? parsed.msg : undefined;
        const messageStr = typeof parsed.message === "string" ? parsed.message : undefined;
        message = msgStr ?? messageStr ?? message;
      } catch {
        // keep default message
      }
    }
    return NextResponse.json({ success: false, message, raw }, { status });
  }
}
