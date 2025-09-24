// src/app/assess/step3/Services.tsx
import React from "react";
import { ServiceOption } from "./AssessStep3";
import { DeviceInfo } from "../../page";
import PawnService from "./(services)/PawnService";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------------------------------------
// Interface: ServicesProps
// โครงสร้าง Props ยังคงเหมือนเดิม ไม่มีการเปลี่ยนแปลง
// ----------------------------------------------------------------------------------------------------
interface ServicesProps {
  services: ServiceOption[];
  selectedService: string;
  setSelectedService: React.Dispatch<React.SetStateAction<string>>;
  deviceInfo: DeviceInfo;
  pawnPrice: number;
}

/** พาเลตสีสำหรับแต่ละบริการ (คงเดิม) */
const PALETTE = {
  sell: {
    bar: "from-pink-500 to-fuchsia-500",
    ring: "ring-pink-500/60",
    borderColor: "border-pink-500", // เพิ่ม borderColor
    icon: "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white",
    text: "text-pink-600 dark:text-pink-400",
    soft: "bg-pink-50 dark:bg-pink-500/10",
  },
  pawn: {
    bar: "from-orange-500 to-amber-500",
    ring: "ring-orange-500/60",
    borderColor: "border-orange-500", // เพิ่ม borderColor
    icon: "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
    text: "text-orange-600 dark:text-orange-400",
    soft: "bg-orange-50 dark:bg-orange-500/10",
  },
  tradein: {
    bar: "from-violet-500 to-indigo-500",
    ring: "ring-violet-500/60",
    borderColor: "border-violet-500", // เพิ่ม borderColor
    icon: "bg-gradient-to-r from-violet-500 to-indigo-500 text-white",
    text: "text-violet-600 dark:text-violet-400",
    soft: "bg-violet-50 dark:bg-violet-500/10",
  },
  fallback: {
    bar: "from-slate-500 to-gray-600",
    ring: "ring-slate-500/60",
    borderColor: "border-slate-500", // เพิ่ม borderColor
    icon: "bg-gradient-to-r from-slate-500 to-gray-600 text-white",
    text: "text-slate-600 dark:text-slate-400",
    soft: "bg-slate-50 dark:bg-slate-500/10",
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
    .replace("฿", "฿");

// ----------------------------------------------------------------------------------------------------
// Component: Services
// **ปรับปรุง UI ทั้งหมด** ให้เป็น Card-based ตามดีไซน์ใหม่
// - ไอคอนมีสีพื้นหลังถาวร
// - สถานะ "เลือกแล้ว" จะแสดงเป็นเส้นขอบสี (Border) แทนการเปลี่ยนสีพื้นหลัง
// ----------------------------------------------------------------------------------------------------
export default function Services({
  services,
  selectedService,
  setSelectedService,
  deviceInfo,
  pawnPrice,
}: ServicesProps) {
  return (
    <div className="flex w-full flex-1 flex-col">
      <h3 className="text-foreground mt-6 block text-lg font-semibold md:hidden">
        เลือกบริการที่ต้องการ
      </h3>
      <h3 className="text-foreground mb-4 hidden text-xl font-bold md:block">
        เลือกบริการที่ต้องการ
      </h3>

      <Accordion
        type="single"
        collapsible
        className="w-full space-y-3" // ใช้ space-y เพื่อเว้นระยะห่างระหว่าง Card
        value={selectedService}
        onValueChange={setSelectedService}
      >
        {services.map((service) => {
          const isSelected = selectedService === service.id;
          const theme = getTheme(service.id);
          const Icon = service.icon;

          return (
            <AccordionItem
              key={service.id}
              value={service.id}
              className={cn(
                "rounded-xl border-2 bg-white transition-all duration-300 dark:bg-zinc-800",
                isSelected ? theme.borderColor : "border-transparent", // แสดง border สีเมื่อถูกเลือก
                "shadow-sm hover:shadow-md", // เพิ่มเงาเล็กน้อย
              )}
            >
              <AccordionTrigger className="w-full cursor-pointer p-4 text-left hover:no-underline">
                <div className="flex w-full items-center gap-4">
                  {/* ส่วนของไอคอน (มีสีพื้นหลังถาวร) */}
                  <div
                    className={cn(
                      "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg",
                      theme.soft, // ใช้สี soft จาก Palette
                    )}
                  >
                    <Icon className={cn("h-7 w-7", theme.text)} />
                  </div>

                  {/* ส่วนของข้อความ (หัวข้อและคำอธิบาย) */}
                  <div className="flex-1 text-left">
                    <h4 className="font-bold text-zinc-800 dark:text-zinc-100">
                      {service.title}
                    </h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {service.description}
                    </p>
                  </div>

                  {/* ส่วนของราคา */}
                  <div className="ml-2 text-right">
                    <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                      {THB(service.price)}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                {/* เนื้อหาภายใน Accordion (PawnService หรือ Feature List) */}
                {service.id === "pawn" && (
                  <PawnService deviceInfo={deviceInfo} pawnPrice={pawnPrice} />
                )}
                {service.id !== "pawn" && service.features.length > 0 && (
                  <div className="mt-4 border-t pt-4 dark:border-zinc-700">
                    <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                      {service.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
