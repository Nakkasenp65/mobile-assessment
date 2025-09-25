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
import { Check } from "lucide-react";

// ----------------------------------------------------------------------------------------------------
// Interface: ServicesProps
// ----------------------------------------------------------------------------------------------------
interface ServicesProps {
  services: ServiceOption[];
  selectedService: string;
  setSelectedService: React.Dispatch<React.SetStateAction<string>>;
  deviceInfo: DeviceInfo;
  pawnPrice: number;
}

/** พาเลตสีสำหรับแต่ละบริการ - ปรับปรุงสำหรับดีไซน์ใหม่ */
const PALETTE = {
  sell: {
    text: "text-pink-500",
    borderColor: "border-pink-500",
    soft: "bg-pink-50/20 dark:bg-pink-900/20",
    ring: "ring-pink-500/20",
  },
  pawn: {
    text: "text-orange-500",
    borderColor: "border-orange-500",
    soft: "bg-orange-50/20 dark:bg-orange-900/20",
    ring: "ring-orange-500/20",
  },
  tradein: {
    text: "text-violet-500",
    borderColor: "border-violet-500",
    soft: "bg-violet-50/20 dark:bg-violet-900/20",
    ring: "ring-violet-500/20",
  },
  consignment: {
    text: "text-cyan-500",
    borderColor: "border-cyan-500",
    soft: "bg-cyan-50/20 dark:bg-cyan-900/20",
    ring: "ring-cyan-500/20",
  },
  refurbish: {
    text: "text-red-500",
    borderColor: "border-red-500",
    soft: "bg-red-50/20 dark:bg-red-900/20",
    ring: "ring-red-500/20",
  },
  installment: {
    text: "text-rose-500",
    borderColor: "border-rose-500",
    soft: "bg-rose-50/20 dark:bg-rose-900/20",
    ring: "ring-rose-500/20",
  },
  delivery: {
    text: "text-amber-500",
    borderColor: "border-amber-500",
    soft: "bg-amber-50 dark:bg-amber-900/20",
    ring: "ring-amber-500/20",
  },
  fallback: {
    text: "text-slate-500",
    borderColor: "border-slate-500",
    soft: "bg-slate-50 dark:bg-slate-900/20",
    ring: "ring-slate-500/20",
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

// ----------------------------------------------------------------------------------------------------
// Component: Services
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
      <Accordion
        type="single"
        collapsible
        className="flex w-full flex-col gap-3" // ลด gap ลงเล็กน้อยเพื่อความกระชับ
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
                "rounded-2xl border shadow-sm transition-all duration-300 ease-in-out",
                isSelected
                  ? `${theme.borderColor} ${theme.soft} ${theme.ring} ring-2` // Style เมื่อถูกเลือก
                  : "border-border bg-card", // Style ปกติ (พื้นหลังขาว)
              )}
            >
              <AccordionTrigger className="w-full cursor-pointer p-4 text-left hover:no-underline">
                <div className="flex w-full items-center gap-4">
                  {/* ไอคอนในวงกลมสีขาว */}
                  <div
                    className={cn(
                      "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm dark:bg-zinc-800",
                    )}
                  >
                    <Icon className={cn("h-6 w-6", theme.text)} />
                  </div>

                  {/* หัวข้อและคำอธิบาย */}
                  <div className="flex-1 text-left">
                    <h4 className="text-foreground font-semibold">
                      {service.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {service.description}
                    </p>
                  </div>

                  {/* ราคา */}
                  <div className="ml-2 text-right">
                    <p className="text-foreground text-lg font-bold">
                      {THB(service.price)}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="mt-2 border-t pt-4 dark:border-zinc-700/50">
                  {service.id === "pawn" && (
                    <PawnService
                      deviceInfo={deviceInfo}
                      pawnPrice={pawnPrice}
                    />
                  )}
                  {service.id !== "pawn" && service.features.length > 0 && (
                    <>
                      <h5 className="text-foreground mb-2 font-semibold">
                        สิทธิประโยชน์ที่คุณจะได้รับ:
                      </h5>
                      <ul className="text-muted-foreground space-y-2">
                        {service.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2 text-sm"
                          >
                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
