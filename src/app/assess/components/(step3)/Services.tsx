// src/app/assess/components/(step3)/Services.tsx
import React, { useEffect, useRef } from "react";
import { ServiceOption } from "./AssessStep3";
import { DeviceInfo, ConditionInfo } from "../../page";
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
import MaintenanceService from "./(services)/MaintenanceService";
import ConsignmentService from "./(services)/ConsignmentService";
import TradeInService from "./(services)/TradeInService";
import RefinanceService from "./(services)/RefinanceService";
import IPhoneExchangeService from "./(services)/IPhoneExchangeService";
import { RepairItem } from "@/hooks/useRepairPrices"; //  เพิ่มการ import RepairItem

interface ServicesProps {
  services: ServiceOption[];
  selectedService: string;
  setSelectedService: React.Dispatch<
    React.SetStateAction<string>
  >;
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  pawnPrice: number;
  refinancePrice?: number;
  exchangePrice?: number;
  repairs: RepairItem[]; //  เพิ่ม props
  totalRepairCost: number; //  เพิ่ม props
  isLoadingRepairPrices: boolean; //  เพิ่ม props
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
  conditionInfo,
  pawnPrice,
  refinancePrice,
  exchangePrice,
  repairs,
  totalRepairCost,
  isLoadingRepairPrices,
}: ServicesProps) {
  const accordionRefs = useRef<
    Record<string, HTMLDivElement | null>
  >({});

  useEffect(() => {
    if (selectedService) {
      const accordionElement =
        accordionRefs.current[selectedService];
      if (accordionElement) {
        setTimeout(() => {
          const elementTop =
            accordionElement.getBoundingClientRect().top;
          const offsetPosition =
            elementTop + window.scrollY - 100;
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
                  {service.id === "sell" && (
                    <SellNowService
                      deviceInfo={deviceInfo}
                      sellPrice={service.price}
                    />
                  )}
                  {service.id === "maintenance" && (
                    <MaintenanceService
                      deviceInfo={deviceInfo}
                      repairs={repairs}
                      totalCost={totalRepairCost}
                      isLoading={isLoadingRepairPrices}
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
                  {service.id === "refinance" &&
                    refinancePrice !== undefined && (
                      <RefinanceService
                        deviceInfo={deviceInfo}
                        refinancePrice={refinancePrice}
                      />
                    )}
                  {service.id === "iphone-exchange" &&
                    exchangePrice !== undefined && (
                      <IPhoneExchangeService
                        deviceInfo={deviceInfo}
                        exchangePrice={exchangePrice}
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
