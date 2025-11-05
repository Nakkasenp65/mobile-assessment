// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// description: supabase client มาจาก project ที่ใช้ appointment และ mobile assessment เก็บข้อมูล:
// - queue
// - payment link
// - รูปโทรศัพท์ตาม model
// - ราคาซ่อมของโทรศัพท์

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CLIENT_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_CLIENT_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
