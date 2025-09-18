// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// อ่านค่าจาก Environment Variables ที่เราตั้งค่าไว้
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// การใส่ ! (Non-null Assertion Operator) เป็นการยืนยันกับ TypeScript ว่า
// เรามั่นใจว่าค่าเหล่านี้จะมีอยู่จริงในตอนที่โค้ดทำงาน
// ซึ่งเป็นความรับผิดชอบของเราในการตรวจสอบไฟล์ .env.local

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
