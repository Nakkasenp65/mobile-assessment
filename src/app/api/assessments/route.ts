import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function isIso8601(value: string): boolean {
  // Basic ISO 8601 validation: YYYY-MM-DDTHH:mm:ss.sssZ or with timezone offset
  // This is a light check; the final parse ensures validity.
  const isoRegex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?)(Z|[+-]\d{2}:\d{2})$/;
  return isoRegex.test(value);
}

function toIso(date: Date): string {
  return date.toISOString();
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function computeDefaultExpiry(): string {
  return toIso(addDays(new Date(), 7));
}

function ensureFutureDatetime(iso: string): { ok: boolean; message?: string } {
  if (!isIso8601(iso)) {
    return { ok: false, message: "expiredAt must be a valid ISO 8601 timestamp" };
  }
  const dt = new Date(iso);
  const ts = dt.getTime();
  if (Number.isNaN(ts)) {
    return { ok: false, message: "expiredAt is not a parseable datetime" };
  }
  if (ts <= Date.now()) {
    return { ok: false, message: "expiredAt must be in the future" };
  }
  return { ok: true };
}

export async function POST(req: NextRequest) {
  try {
    if (!BACKEND_URL) {
      return NextResponse.json({ message: "Missing NEXT_PUBLIC_BACKEND_URL" }, { status: 500 });
    }

    const body = await req.json();

    // Accept either provided expiredAt or automatically compute now+7d if missing.
    let { expiredAt } = body as { expiredAt?: unknown };

    if (expiredAt === undefined) {
      expiredAt = computeDefaultExpiry();
    }

    if (expiredAt === null || typeof expiredAt !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_FIELD",
            field: "expiredAt",
            message: "expiredAt is required and must be a string in ISO 8601 format",
          },
        },
        { status: 400 }
      );
    }

    const check = ensureFutureDatetime(expiredAt);
    if (!check.ok) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            field: "expiredAt",
            message: check.message,
          },
        },
        { status: 400 }
      );
    }

    // Forward request to upstream with normalized payload
    const upstreamEndpoint = `${BACKEND_URL}/api/assessments`;

    const forwardPayload = {
      ...body,
      expiredAt,
    };

    const upstreamRes = await fetch(upstreamEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(forwardPayload),
    });

    const data = await upstreamRes.json();
    return NextResponse.json(data, { status: upstreamRes.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message },
      },
      { status: 500 }
    );
  }
}