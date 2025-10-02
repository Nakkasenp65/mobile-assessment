// src/app/assess/components/(step3)/Services.tsx
import React, { useEffect, useRef } from "react";
import { ServiceOption } from "./AssessStep3";
import { DeviceInfo, ConditionInfo } from "../../page";
import { Accordion } from "@/components/ui/accordion";
import { RepairItem } from "@/hooks/useRepairPrices";

// --- Import Service Components ที่ Refactor แล้ว ---
import SellNowService from "./(services)/SellNowService";
import ConsignmentService from "./(services)/ConsignmentService";
import RefinanceService from "./(services)/RefinanceService";
import IPhoneExchangeService from "./(services)/IPhoneExchangeService";

// --- Import Service Components ที่ยังไม่ได้ Refactor ---
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TradeInService from "./(services)/TradeInService";
import { cn } from "@/lib/utils";

interface ServicesProps {
  services: ServiceOption[];
  selectedService: string;
  setSelectedService: React.Dispatch<React.SetStateAction<string>>;
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo; // ยังคงเก็บไว้เพื่อส่งต่อให้ component ที่ยังไม่ได้แก้
  pawnPrice: number; // ยังคงเก็บไว้เพื่อส่งต่อ
  refinancePrice?: number;
  exchangePrice?: number;
  repairs: RepairItem[];
  totalRepairCost: number;
  isLoadingRepairPrices: boolean;
}

const PALETTE = {
  sell: {
    text: "text-pink-500",
    borderColor: "border-pink-500",
    soft: "bg-pink-50/20 dark:bg-pink-900/20",
    ring: "ring-pink-500/20",
  },
  consignment: {
    text: "text-sky-500",
    borderColor: "border-sky-500",
    soft: "bg-sky-50/20 dark:bg-sky-900/20",
    ring: "ring-sky-500/20",
  },
  refinance: {
    text: "text-purple-500",
    borderColor: "border-purple-500",
    soft: "bg-purple-50/20 dark:bg-purple-900/20",
    ring: "ring-purple-500/20",
  },
  "iphone-exchange": {
    text: "text-green-500",
    borderColor: "border-green-500",
    soft: "bg-green-50/20 dark:bg-green-900/20",
    ring: "ring-green-500/20",
  },
  maintenance: {
    text: "text-emerald-500",
    borderColor: "border-emerald-500",
    soft: "bg-emerald-50/20 dark:bg-emerald-900/20",
    ring: "ring-emerald-500/20",
  },
  tradein: {
    text: "text-amber-500",
    borderColor: "border-amber-500",
    soft: "bg-amber-50/20 dark:bg-amber-900/20",
    ring: "ring-amber-500/20",
  },
  fallback: {
    text: "text-zinc-500",
    borderColor: "border-zinc-500",
    soft: "bg-zinc-50/20 dark:bg-zinc-900/20",
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

export default function Services({
  services,
  selectedService,
  setSelectedService,
  deviceInfo,
  refinancePrice,
  exchangePrice,
}: ServicesProps) {
  const accordionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // ✅ 1. สร้างฟังก์ชัน Handler ใหม่
  const handleValueChange = (value: string) => {
    // อัปเดต state ที่ถูกเลือก
    setSelectedService(value);

    // สั่งให้เลื่อนหน้าจอ (จะทำงานเฉพาะเมื่อมีการคลิกจริงๆ)
    if (value) {
      setTimeout(() => {
        const accordionElement = accordionRefs.current[value];
        if (accordionElement) {
          const rect = accordionElement.getBoundingClientRect();
          const offsetTop = rect.top + window.scrollY - 100;
          window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
      }, 300);
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col">
      <Accordion
        type="single"
        collapsible
        className="flex w-full flex-col gap-3"
        value={selectedService}
        // ✅ 2. เปลี่ยนมาใช้ Handler ใหม่นี้แทน setSelectedService โดยตรง
        onValueChange={handleValueChange}
      >
        {services.map((service) => {
          const isSelected = selectedService === service.id;
          const theme = getTheme(service.id);
          const Icon = service.icon;

          // --- Logic การ Render แบบใหม่ ---
          if (service.id === "sell") {
            return (
              <SellNowService
                key={service.id}
                ref={(el) => {
                  accordionRefs.current[service.id] = el;
                }}
                deviceInfo={deviceInfo}
                service={service}
                theme={theme}
                isSelected={isSelected}
              />
            );
          }

          if (service.id === "consignment") {
            return (
              <ConsignmentService
                key={service.id}
                ref={(el) => {
                  accordionRefs.current[service.id] = el;
                }}
                deviceInfo={deviceInfo}
                service={service}
                theme={theme}
                isSelected={isSelected}
              />
            );
          }

          if (service.id === "tradein") {
            return (
              <TradeInService
                key={service.id}
                ref={(el) => {
                  accordionRefs.current[service.id] = el;
                }}
                deviceInfo={deviceInfo}
                service={service}
                theme={theme}
                isSelected={isSelected}
              />
            );
          }

          if (service.id === "refinance" && refinancePrice !== undefined) {
            return (
              <RefinanceService
                key={service.id}
                ref={(el) => {
                  accordionRefs.current[service.id] = el;
                }}
                deviceInfo={deviceInfo}
                service={service}
                theme={theme}
                isSelected={isSelected}
              />
            );
          }

          if (service.id === "iphone-exchange" && exchangePrice !== undefined) {
            return (
              <IPhoneExchangeService
                key={service.id}
                ref={(el) => {
                  accordionRefs.current[service.id] = el;
                }}
                deviceInfo={deviceInfo}
                service={service}
                theme={theme}
                isSelected={isSelected}
              />
            );
          }

          // --- Fallback สำหรับ Components ที่ยังไม่ได้ Refactor ---
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
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm dark:bg-zinc-800">
                    <Icon className={cn("h-6 w-6", theme.text)} />
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
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
