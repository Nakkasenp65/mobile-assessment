// src/app/details/(step3)/serviceHelpers.ts

import { Assessment } from "../../../types/assessment";
import { ServiceId } from "./serviceConfig";
import { ArrowUpDown, Banknote, CreditCard, Handshake, ShoppingBag, Wrench } from "lucide-react";
import { ServiceOption } from "../../../types/service";

// Helper function to get service payload from assessmentData
export const getServicePayload = (assessmentData: Assessment | undefined, serviceId: ServiceId) => {
  if (!assessmentData) return null;

  switch (serviceId) {
    case "sell":
      return assessmentData.sellNowServiceInfo;
    case "consignment":
      return assessmentData.consignmentServiceInfo;
    case "tradein":
      return assessmentData.tradeInServiceInfo;
    case "refinance":
      return assessmentData.refinanceServiceInfo;
    case "iphone-exchange":
      return assessmentData.iphoneExchangeServiceInfo;
    // case "pawn":
    // return assessmentData.pawnServiceInfo;
    default:
      return null;
  }
};

// Build service options based on device and prices
export const buildServiceOptions = (
  isAppleDevice: boolean,
  finalPrice: number,
  totalCost: number,
): ServiceOption[] => {
  const calculatedRefinancePrice = Math.round(finalPrice * 0.5);
  const calculatedExchangePrice = Math.round(finalPrice * 0.7);

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

  return services;
};
