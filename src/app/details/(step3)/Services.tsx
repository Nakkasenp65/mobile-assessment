// src/app/assess/components/(step3)/Services.tsx

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ArrowUpDown,
  Banknote,
  CircleDot,
  CreditCard,
  ExternalLink,
  Handshake,
  LucideIcon,
  ShoppingBag,
  Wrench,
} from "lucide-react";
import MaintenanceService from "./(services)/MaintenanceService";
import { RepairItem } from "@/hooks/useRepairPrices";
import { Button } from "../../../components/ui/button";
import { DeviceInfo } from "../../../types/device";
import { ServiceOption } from "../../../types/service";
import { Assessment } from "../../../types/assessment";
import Link from "next/link";

interface ServicesProps {
  selectedService: string;
  setSelectedService: React.Dispatch<React.SetStateAction<string>>;
  repairs: RepairItem[];
  totalCost: number;
  isLoading: boolean;
  deviceInfo: DeviceInfo;
  onNext: () => void;
  finalPrice: number;
  assessmentId?: string;
  assessmentData?: Assessment;
}

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
  selectedService,
  setSelectedService,
  repairs,
  totalCost,
  isLoading,
  deviceInfo,
  onNext,
  finalPrice,
  assessmentId,
  assessmentData,
}: ServicesProps) {
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const calculatedRefinancePrice = Math.round(finalPrice * 0.5);
  const calculatedExchangePrice = Math.round(finalPrice * 0.7);
  const isAppleDevice = deviceInfo.brand === "Apple";

  // Helper function to check if a service has assessment data
  const hasServiceData = (serviceId: string): boolean => {
    if (!assessmentData) return false;

    const serviceFieldMap: Record<string, keyof Assessment> = {
      sell: "sellNowServiceInfo",
      consignment: "consignmentServiceInfo",
      tradein: "tradeInServiceInfo",
      refinance: "refinanceServiceInfo",
      "iphone-exchange": "iphoneExchangeServiceInfo",
      pawn: "pawnServiceInfo",
    };

    const field = serviceFieldMap[serviceId];
    return field ? !!assessmentData[field] : false;
  };

  const baseServices: ServiceOption[] = [
    {
      id: "sell",
      title: "ขายทันที",
      description: "รับเงินสดเต็มจำนวนทันที",
      icon: Banknote,
      price: finalPrice,
    },
    {
      id: "consignment",
      title: "ขายฝาก",
      description: "เราช่วยประกาศขายเพื่อให้ได้ราคาดีที่สุด",
      icon: ShoppingBag,
      price: finalPrice,
    },
    {
      id: "tradein",
      title: "เทิร์นเครื่อง",
      description: "นำเครื่องเก่ามาแลกเครื่องใหม่คุ้มๆ",
      icon: ArrowUpDown,
      price: finalPrice,
    },
  ];

  const coreServices: ServiceOption[] = [
    baseServices[0],
    ...(isAppleDevice
      ? [
          {
            id: "refinance",
            title: "บริการรีไฟแนนซ์",
            description: "รับเงินก้อน ผ่อนชำระคืน 6 เดือน",
            icon: CreditCard,
            price: calculatedRefinancePrice,
          },
        ]
      : []),
    ...baseServices.slice(1),
  ];

  const services: ServiceOption[] = [
    ...coreServices,
    ...(isAppleDevice
      ? [
          {
            id: "iphone-exchange",
            title: "ไอโฟนแลกเงิน",
            description: "รับเงินสดทันที ต่อรอบได้ทุก 10 วัน",
            icon: Handshake,
            price: calculatedExchangePrice,
          },
        ]
      : []),
    {
      id: "maintenance",
      title: "ซ่อมบำรุง",
      description: "เลือกซ่อมเฉพาะส่วนที่ต้องการ",
      icon: Wrench,
      price: totalCost,
    },
  ];

  const handleSelect = (serviceId: string) => {
    if (serviceId === "maintenance") {
      setIsMaintenanceOpen((current) => !current);
    } else {
      setSelectedService((current) => (current === serviceId ? "" : serviceId));
      setIsMaintenanceOpen(false);
    }
  };

  useEffect(() => {
    if (selectedService && itemRefs.current[selectedService]) {
      itemRefs.current[selectedService]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedService]);

  return (
    <div className="w-full">
      <h2 className="my-6 text-left text-2xl font-bold text-slate-800 lg:hidden">
        เลือกบริการที่ต้องการ
      </h2>
      <div className="flex w-full flex-col gap-4">
        {services.map((service) => {
          const isMaintenance = service.id === "maintenance";
          const isSelected = isMaintenance ? isMaintenanceOpen : selectedService === service.id;
          const theme = getTheme(service.id);
          const Icon = service.icon as LucideIcon;
          const benefits = serviceBenefits[service.id] || [];

          if (isMaintenance && repairs.length === 0) {
            return null;
          }

          return (
            <motion.div
              key={service.id}
              ref={(el) => {
                itemRefs.current[service.id] = el;
              }}
              layout
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "relative flex h-full w-full flex-col rounded-2xl border p-5 text-left transition-all duration-300",
                isSelected
                  ? `ring-2 ${theme.ring} ${theme.borderColor} shadow-lg ${theme.shadow}`
                  : "border-border hover:border-slate-300",
                "cursor-pointer",
                isMaintenance && "lg:hidden",
              )}
              onClick={() => handleSelect(service.id)}
            >
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center rounded-full text-white",
                      theme.iconBg,
                    )}
                  >
                    <CircleDot className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-1 items-center gap-4">
                <div
                  className={cn(
                    "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl shadow-sm",
                    theme.iconBg,
                  )}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-foreground font-bold">{service.title}</h4>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  <p className="text-foreground text-lg font-bold">{THB(service.price)}</p>
                </div>
              </div>

              {!isMaintenance && (
                <>
                  <div className="bg-border my-4 h-px w-full" />
                  <ul className="text-muted-foreground space-y-2 text-sm">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <div
                          className={cn(
                            "mt-1.5 h-2 w-2 flex-shrink-0 rounded-full opacity-50",
                            theme.solidBg,
                          )}
                        />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {/* View Details Link - Only shown if assessment data exists for this service */}
                  {assessmentId && hasServiceData(service.id) && (
                    <div className="mt-4 flex items-center justify-start">
                      <Link
                        href={`/confirmed/${assessmentId}`}
                        className={cn(
                          "inline-flex items-center gap-2 text-sm font-medium transition-colors hover:underline",
                          theme.text,
                        )}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4" />
                        ดูรายละเอียดการจอง
                      </Link>
                    </div>
                  )}

                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: "16px" }}
                        exit={{ opacity: 0, height: 0, marginTop: "0px" }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-end overflow-hidden"
                      >
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNext();
                          }}
                          size="lg"
                          className={cn(
                            "h-12 w-full text-base font-bold text-white shadow-lg transition-all duration-300 sm:w-max",
                            theme.solidBg,
                            `hover:${theme.solidBg} hover:brightness-110`,
                          )}
                        >
                          ยืนยันบริการนี้
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {isMaintenance && (
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: "16px" }}
                      exit={{ opacity: 0, height: 0, marginTop: "0px" }}
                      className="lg:hidden"
                    >
                      <MaintenanceService
                        deviceInfo={deviceInfo}
                        repairs={repairs}
                        totalCost={totalCost}
                        isLoading={isLoading}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
