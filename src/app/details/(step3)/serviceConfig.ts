// src/app/details/(step3)/serviceConfig.ts

export type ServiceId =
  | "sell"
  | "consignment"
  | "tradein"
  | "refinance"
  | "iphone-exchange"
  | "pawn"
  | "maintenance";

export const serviceBenefits: { [key: string]: string[] } = {
  sell: [
    "รับเงินสดทันที",
    "ไม่มีค่าธรรมเนียมแอบแฝง",
    "บริการล้างข้อมูลและ iCloud ให้ฟรี",
    "มีออฟชั่นซื้อเครื่องคืนภายใน 7 วัน",
  ],
  consignment: [
    "ถ่ายรูปสินค้าแบบมืออาชีพเพื่อดึงดูดลูกค้า",
    "ทีมการตลาดช่วยโปรโมทในหลายช่องทาง",
    "แจ้งเตือนและรายงานความคืบหน้าสม่ำเสมอ",
    "คิดค่าบริการก็ต่อเมื่อสินค้าขายได้แล้วเท่านั้น",
  ],
  tradein: [
    "ลดราคาเครื่องใหม่ทันที ไม่ต้องรอ",
    "ประเมินราคายุติธรรม โปร่งใส",
    "รับประกันเครื่องใหม่ 1 ปีเต็ม",
    "ย้ายข้อมูลให้ฟรี ไม่มีค่าใช้จ่าย",
  ],
  refinance: [
    "รับเงินก้อนไปใช้ก่อนได้ทันที!",
    "แบ่งชำระคืนเบาๆ นานสูงสุด 6 เดือน",
    "ไม่ต้องใช้คนค้ำประกัน",
    "อนุมัติไวภายใน 15 นาที",
  ],
  "iphone-exchange": [
    "รับเงินสดทันทีหลังส่งมอบเครื่อง",
    "ต่อรอบได้ทุก 10 วัน โดยชำระค่าบริการ 15% ของวงเงิน",
    "ใช้ iCloud ของตัวเองได้ ไม่ติดไอคลาวด์ร้าน",
  ],
  pawn: [
    "รับเงินสดทันที ไม่ต้องรอ",
    "ไม่ต้องใช้คนค้ำประกัน",
    "เก็บรักษาเครื่องให้อย่างดี",
    "ไถ่ถอนได้เมื่อครบกำหนด",
  ],
};

export const PALETTE = {
  sell: {
    text: "text-pink-600",
    iconBg: "bg-gradient-to-br from-pink-500 to-orange-500",
    borderColor: "border-pink-500",
    soft: "bg-pink-50",
    ring: "ring-pink-500/20",
    shadow: "shadow-pink-500/20",
    solidBg: "bg-pink-600",
  },
  consignment: {
    text: "text-sky-600",
    iconBg: "bg-gradient-to-br from-cyan-500 to-sky-500",
    borderColor: "border-sky-500",
    soft: "bg-sky-50",
    ring: "ring-sky-500/20",
    shadow: "shadow-sky-500/20",
    solidBg: "bg-sky-600",
  },
  tradein: {
    text: "text-amber-700",
    iconBg: "bg-gradient-to-br from-yellow-500 to-amber-500",
    borderColor: "border-amber-500",
    soft: "bg-amber-50",
    ring: "ring-amber-500/20",
    shadow: "shadow-amber-500/20",
    solidBg: "bg-amber-600",
  },
  refinance: {
    text: "text-purple-600",
    iconBg: "bg-gradient-to-br from-purple-500 to-violet-700",
    borderColor: "border-purple-500",
    soft: "bg-purple-50",
    ring: "ring-purple-500/20",
    shadow: "shadow-purple-500/20",
    solidBg: "bg-purple-600",
  },
  "iphone-exchange": {
    text: "text-green-600",
    iconBg: "bg-gradient-to-br from-green-500 to-emerald-500",
    borderColor: "border-green-500",
    soft: "bg-green-50",
    ring: "ring-green-500/20",
    shadow: "shadow-green-500/20",
    solidBg: "bg-green-600",
  },
  pawn: {
    text: "text-orange-600",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
    borderColor: "border-orange-500",
    soft: "bg-orange-50",
    ring: "ring-orange-500/20",
    shadow: "shadow-orange-500/20",
    solidBg: "bg-orange-600",
  },
  maintenance: {
    text: "text-slate-600",
    iconBg: "bg-gradient-to-br from-slate-500 to-gray-500",
    borderColor: "border-slate-500",
    soft: "bg-slate-50",
    ring: "ring-slate-500/20",
    shadow: "shadow-slate-500/20",
    solidBg: "bg-slate-600",
  },
  fallback: {
    text: "text-zinc-500",
    iconBg: "bg-zinc-200",
    borderColor: "border-zinc-500",
    soft: "bg-zinc-50",
    ring: "ring-zinc-500/20",
    shadow: "shadow-zinc-500/20",
    solidBg: "bg-zinc-500",
  },
} as const;

export function getTheme(id: string) {
  const themeKey = id as keyof typeof PALETTE;
  return PALETTE[themeKey] ?? PALETTE.fallback;
}

export const formatTHB = (n: number) =>
  n
    .toLocaleString("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    })
    .replace("฿", "฿ ");
