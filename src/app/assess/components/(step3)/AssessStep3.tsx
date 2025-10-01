// src/app/assess/components/(step3)/AssessStep3.tsx

"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Banknote, Wrench, CreditCard, ShoppingBag, Handshake } from "lucide-react";
import { DeviceInfo, ConditionInfo } from "../../page";
import { LucideIcon } from "lucide-react";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { useMobile } from "@/hooks/useMobile";
import Services from "./Services";
import FramerButton from "../../../../components/ui/framer/FramerButton";
import AssessmentSummary from "./AssessmentSummary";
import { useRepairPrices } from "@/hooks/useRepairPrices";

interface AssessStep3Props {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  onBack: () => void;
}

export interface ServiceOption {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  price: number;
}

const AssessStep3 = ({ deviceInfo, conditionInfo, onBack }: AssessStep3Props) => {
  const {
    totalRepairCost,
    repairs,
    isLoading: isLoadingRepairPrices,
  } = useRepairPrices(deviceInfo.model, conditionInfo);

  const [selectedService, setSelectedService] = useState<string>("sell");

  const { finalPrice, grade, gradeTextStyle, gradeNeonColor } = usePriceCalculation(
    deviceInfo,
    conditionInfo,
  );

  const { data: mobileData, isLoading: isImageLoading } = useMobile(
    deviceInfo.brand,
    deviceInfo.model,
  );

  const assessmentDate =
    new Date().toLocaleString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }) + " น.";

  const calculatedRefinancePrice = Math.round(finalPrice * 0.5);
  const calculatedExchangePrice = Math.round(finalPrice * 0.7);
  const calculatedPawnPrice = Math.round(finalPrice * 0.7);

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
    // {
    //   id: "maintenance",
    //   title: "บริการซ่อม",
    //   description: "ซ่อมแซมโดยช่างผู้เชี่ยวชาญ",
    //   icon: Wrench,
    //   price: totalRepairCost,
    // },
  ];

  const isAppleDevice = deviceInfo.brand === "Apple";

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
  ];

  const handleConfirm = () => {
    if (selectedService) {
      alert("ขอบคุณสำหรับการใช้บริการ! เราจะติดต่อกลับภายใน 24 ชั่วโมง");
    }
  };

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <div className="flex w-full flex-col gap-8 md:p-8">
      <div className="text-center">
        <h2 className="text-foreground mt-8 text-3xl font-bold">ผลประเมินสภาพโทรศัพท์</h2>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-8">
        {/* Column 1: Assessment Summary */}
        <AssessmentSummary
          deviceInfo={deviceInfo}
          conditionInfo={conditionInfo}
          isImageLoading={isImageLoading}
          mobileData={mobileData}
          grade={grade}
          finalPrice={finalPrice}
          assessmentDate={assessmentDate}
          // CHIRON: Systemic Interaction - ซ่อมแซมท่อส่งข้อมูลโดยการส่ง props ที่ถูกต้อง
          // ตามสัญญาที่ได้รับการปรับปรุงใหม่ของ AssessmentSummary
          repairs={repairs}
          totalCost={totalRepairCost}
          isLoadingRepairPrices={isLoadingRepairPrices}
        />

        {/* Column 2: Service Selection */}
        <div className="flex flex-col">
          <Services
            services={services}
            selectedService={selectedService}
            setSelectedService={setSelectedService}
            deviceInfo={deviceInfo}
            conditionInfo={conditionInfo}
            pawnPrice={calculatedPawnPrice}
            refinancePrice={calculatedRefinancePrice}
            exchangePrice={calculatedExchangePrice}
            repairs={repairs}
            totalRepairCost={totalRepairCost}
            isLoadingRepairPrices={isLoadingRepairPrices}
          />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-4 flex items-center justify-between border-t pt-6 dark:border-zinc-800">
        <FramerButton
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-12 items-center rounded-xl border bg-white px-6 transition-colors dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="ml-2 hidden font-semibold sm:inline">ย้อนกลับ</span>
        </FramerButton>

        <FramerButton
          onClick={handleConfirm}
          disabled={!selectedService}
          size="lg"
          className="gradient-primary text-primary-foreground shadow-primary/30 hover:shadow-secondary/30 h-12 transform-gpu rounded-xl px-8 text-base font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          ยืนยันการเลือก
        </FramerButton>
      </div>
    </div>
  );
};

export default AssessStep3;
