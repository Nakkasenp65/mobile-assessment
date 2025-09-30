// src/app/assess/components/(step3)/Services.tsx
import React, { useEffect, useRef } from "react";
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
import IcloudService from "./(services)/IcloudService";
import SellNowService from "./(services)/SellNowService";
import ConsignmentService from "./(services)/ConsignmentService";
import TradeInService from "./(services)/TradeInService";

interface ServicesProps {
  services: ServiceOption[];
  selectedService: string;
  setSelectedService: React.Dispatch<
    React.SetStateAction<string>
  >;
  deviceInfo: DeviceInfo;
  pawnPrice: number;
}

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
    text: "text-cyan-500",
    borderColor: "border-cyan-500",
    soft: "bg-cyan-50/20 dark:bg-cyan-900/20",
    ring: "ring-cyan-500/20",
  },
  consignment: {
    text: "text-sky-500",
    borderColor: "border-sky-500",
    soft: "bg-sky-50/20 dark:bg-sky-900/20",
    ring: "ring-sky-500/20",
  },
  icloud: {
    text: "text-indigo-500",
    borderColor: "border-indigo-500",
    soft: "bg-indigo-50/20 dark:bg-indigo-900/20",
    ring: "ring-indigo-500/20",
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
  pawnPrice,
}: ServicesProps) {
  // ✨ สร้าง refs สำหรับ Accordion แต่ละอัน
  const accordionRefs = useRef<
    Record<string, HTMLDivElement | null>
  >({});

  // ✨ Effect สำหรับ auto scroll เมื่อเปิด Accordion
  useEffect(() => {
    if (selectedService) {
      const accordionElement =
        accordionRefs.current[selectedService];
      if (accordionElement) {
        // รอให้ animation เสร็จก่อน (300ms)
        setTimeout(() => {
          // วิธีที่ 1: ใช้ scrollIntoView (แนะนำ)
          // accordionElement.scrollIntoView({
          //   behavior: "smooth",
          //   block: "start",
          //   inline: "nearest",
          // });

          // หรือใช้วิธีที่ 2: ควบคุม offset ได้แม่นยำกว่า
          const elementTop =
            accordionElement.getBoundingClientRect().top;
          const offsetPosition =
            elementTop + window.scrollY - 100; // -100 เผื่อพื้นที่ navbar
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }, 300);
      }
    }
  }, [selectedService]);

  return (
    <div className="flex w-full flex-1 flex-col">
      <Accordion
        type="single"
        collapsible
        className="flex w-full flex-col gap-3"
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
              // ✨ เพิ่ม ref ให้แต่ละ Accordion
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
                      "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm dark:bg-zinc-800",
                    )}
                  >
                    <Icon
                      className={cn("h-6 w-6", theme.text)}
                    />
                  </div>

                  <div className="flex-1 text-left">
                    <h4 className="text-foreground font-semibold">
                      {service.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {service.description}
                    </p>
                  </div>

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
                  {service.id === "sell" && (
                    <SellNowService
                      deviceInfo={deviceInfo}
                      sellPrice={service.price}
                    />
                  )}
                  {service.id === "icloud" && (
                    <IcloudService
                      deviceInfo={deviceInfo}
                      icloudPawnPrice={Math.round(
                        service.price * 0.5,
                      )}
                    />
                  )}
                  {service.id === "tradein" && (
                    <TradeInService
                      deviceInfo={deviceInfo}
                      tradeInPrice={service.price}
                    />
                  )}
                  {service.id === "consignment" && (
                    <ConsignmentService
                      deviceInfo={deviceInfo}
                      consignmentPrice={service.price}
                    />
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
