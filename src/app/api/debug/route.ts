// app/debug/route.ts
import { NextResponse } from "next/server";

/**
 * ตั้งค่า runtime ที่ต้องการทดสอบ
 * ลองสลับเป็น "nodejs" หรือ "edge" เพื่อเปรียบเทียบพฤติกรรม
 */
// export const runtime = "nodejs";

// function safeEnv(name: string) {
//   const val = process.env[name];
//   return typeof val === "undefined" ? null : val;
// }

// function collectEnvDebug() {
//   return {
//     NEXT_RUNTIME: runtime,
//     NODE_ENV: process.env.NODE_ENV ?? null,
//     DEPOSIT_AMOUNT: safeEnv("DEPOSIT_AMOUNT"),
//     NEXT_PUBLIC_DEPOSIT_AMOUNT: safeEnv("NEXT_PUBLIC_DEPOSIT_AMOUNT"),
//     // ตัวอย่าง NEXT_PUBLIC และอื่น ๆ ที่คุณตั้งไว้
//     NEXT_PUBLIC_SUPABASE_URL: safeEnv("NEXT_PUBLIC_SUPABASE_URL"),
//     NEXT_PUBLIC_SUPABASE_ANON_KEY_PRESENT: safeEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ? true : false,
//     // ระวัง: อย่าแสดงค่า secret ตัวจริงใน production logs/response
//   };
// }

/**
 * GET /debug
 * คืนค่าที่อ่านได้จาก process.env เพื่อทดสอบว่า environment ถูกฉีดเข้ามาหรือไม่
 */
export async function GET() {
  try {
    // const debug = collectEnvDebug();
    // เบื้องต้น log ลง console เพื่อดูบน server logs / Vercel logs
    const DEPOSIT_AMOUNT = process.env.DEPOSIT_AMOUNT;
    console.log(DEPOSIT_AMOUNT);
    // console.log("[debug/route] GET env debug:", debug);

    return NextResponse.json(
      {
        ok: true,
        when: new Date().toISOString(),
        DEPOSIT_AMOUNT,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[debug/route] GET error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

/**
 * POST /debug
 * รับ body JSON แบบ { echo?: any } และคืน env + echo
 */
// export async function POST(req: Request) {
//   try {
//     const body = await req.json().catch(() => null);
//     const debug = collectEnvDebug();
//     console.log("[debug/route] POST body:", body);
//     console.log("[debug/route] POST env debug:", debug);

//     return NextResponse.json(
//       {
//         ok: true,
//         when: new Date().toISOString(),
//         body,
//         debug,
//       },
//       { status: 200 },
//     );
//   } catch (err) {
//     console.error("[debug/route] POST error:", err);
//     return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
//   }
// }
