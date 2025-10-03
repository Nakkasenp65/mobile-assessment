// src/app/assess/components/(step3)/Services.tsx
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ServiceOption } from "./AssessStep3";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Check, LucideIcon } from "lucide-react";

interface ServicesProps {
  services: ServiceOption[];
  selectedService: string;
  setSelectedService: React.Dispatch<React.SetStateAction<string>>;
}

// --- Data for Benefits ---
const serviceBenefits: { [key: string]: string[] } = {
  sell: [
    "รับเงินสดทันทีภายใน 30 นาที",
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
    // สมมติว่า Pawn มี benefits คล้ายๆ กัน
    "รับเงินสดทันที ไม่ต้องรอ",
    "ไม่ต้องใช้คนค้ำประกัน",
    "เก็บรักษาเครื่องให้อย่างดี",
    "ไถ่ถอนได้เมื่อครบกำหนด",
  ],
};

const PALETTE = {
  sell: {
    text: "text-pink-600",
    iconBg: "bg-gradient-to-br from-pink-500 to-orange-500",
    benefitBg: "border-pink-100 bg-gradient-to-br from-pink-50/75 to-orange-500/25",
    benefitText: "text-pink-800",
    benefitIcon: "text-pink-600",
    borderColor: "border-pink-500",
    soft: "bg-pink-50/20",
    ring: "ring-pink-500/20",
  },
  consignment: {
    text: "text-sky-600",
    iconBg: "bg-gradient-to-br from-cyan-500 to-sky-500",
    benefitBg: "border-cyan-100 bg-gradient-to-br from-cyan-50/75 to-sky-500/25",
    benefitText: "text-cyan-800",
    benefitIcon: "text-cyan-600",
    borderColor: "border-sky-500",
    soft: "bg-sky-50/20",
    ring: "ring-sky-500/20",
  },
  tradein: {
    text: "text-amber-700",
    iconBg: "bg-gradient-to-br from-yellow-500 to-amber-500",
    benefitBg: "border-amber-100 bg-gradient-to-br from-yellow-50/50 to-amber-400/50",
    benefitText: "text-amber-800",
    benefitIcon: "text-amber-600",
    borderColor: "border-amber-500",
    soft: "bg-amber-50/20",
    ring: "ring-amber-500/20",
  },
  refinance: {
    text: "text-purple-600",
    iconBg: "bg-gradient-to-br from-purple-500 to-violet-700",
    benefitBg: "border-purple-100 bg-gradient-to-br from-purple-50/75 to-purple-500/25",
    benefitText: "text-purple-800",
    benefitIcon: "text-purple-600",
    borderColor: "border-purple-500",
    soft: "bg-purple-50/20",
    ring: "ring-purple-500/20",
  },
  "iphone-exchange": {
    text: "text-green-600",
    iconBg: "bg-gradient-to-br from-green-500 to-emerald-500",
    benefitBg: "border-green-100 bg-gradient-to-br from-green-50/75 to-emerald-500/25",
    benefitText: "text-green-800",
    benefitIcon: "text-green-600",
    borderColor: "border-green-500",
    soft: "bg-green-50/20",
    ring: "ring-green-500/20",
  },
  pawn: {
    text: "text-orange-600",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
    benefitBg: "border-orange-100 bg-gradient-to-br from-orange-50/75 to-amber-500/25",
    benefitText: "text-orange-800",
    benefitIcon: "text-orange-600",
    borderColor: "border-orange-500",
    soft: "bg-orange-50/20",
    ring: "ring-orange-500/20",
  },
  fallback: {
    text: "text-zinc-500",
    iconBg: "bg-zinc-200",
    benefitBg: "bg-zinc-100 border-zinc-200",
    benefitText: "text-zinc-800",
    benefitIcon: "text-zinc-600",
    borderColor: "border-zinc-500",
    soft: "bg-zinc-50/20",
    ring: "ring-zinc-500/20",
  },
} as const;

function getTheme(id: string) {
  const themeKey = id as keyof typeof PALETTE;
  return PALETTE[themeKey] ?? PALETTE.fallback;
}

const THB = (n: number) =>
  n
    .toLocaleString("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    })
    .replace("฿", "฿ ");

export default function Services({ services, selectedService, setSelectedService }: ServicesProps) {
  const accordionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleValueChange = (value: string) => {
    // ถ้าคลิกอันเดิมที่เปิดอยู่ ให้ปิดมัน (ค่า value จะเป็น "" (string ว่าง))
    // ถ้าคลิกอันใหม่ ให้ set state เป็น id ของอันใหม่
    setSelectedService(value === selectedService ? "" : value);
  };

  return (
    <div className="flex w-full flex-1 flex-col">
      <Accordion
        type="single"
        collapsible
        className="flex w-full flex-col gap-3"
        value={selectedService}
        onValueChange={handleValueChange}
      >
        {services.map((service) => {
          const isSelected = selectedService === service.id;
          const theme = getTheme(service.id);
          const Icon = service.icon as LucideIcon;
          const benefits = serviceBenefits[service.id] || [];

          return (
            <AccordionItem
              key={service.id}
              value={service.id}
              ref={(el) => {
                accordionRefs.current[service.id] = el;
              }}
              className={cn(
                "rounded-2xl border shadow-sm transition-all duration-300 ease-in-out",
                isSelected
                  ? `${theme.borderColor} ${theme.soft} ${theme.ring} ring-2`
                  : "border-border bg-card",
              )}
            >
              <AccordionTrigger className="w-full cursor-pointer p-4 text-left hover:no-underline">
                <div className="flex w-full items-center gap-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full shadow-sm",
                      theme.iconBg,
                    )}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-foreground font-semibold">{service.title}</h4>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </div>
                  <div className="ml-2 text-right">
                    <p className="text-foreground text-lg font-bold">{THB(service.price)}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className={cn("mt-2 rounded-xl border p-4", theme.benefitBg)}
                >
                  <ul className={cn("space-y-2 text-sm", theme.benefitText)}>
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className={cn("mt-0.5 h-4 w-4 flex-shrink-0", theme.benefitIcon)} />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
