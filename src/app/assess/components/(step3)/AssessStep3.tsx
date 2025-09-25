// src/app/assess/step3/AssessStep3.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Banknote,
  Shield,
  Wrench,
  CreditCard,
  Truck,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import { DeviceInfo, ConditionInfo } from "../../page";
import { LucideIcon } from "lucide-react";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { useMobile } from "@/hooks/useMobile";
import AssessmentLedger from "./AssessmentLedger";
import Services from "./Services";
import FramerButton from "../../../../components/ui/framer/FramerButton";
import AssessmentSummary from "./AssessmentSummary";

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
  features: string[];
}

const AssessStep3 = ({
  deviceInfo,
  conditionInfo,
  onBack,
}: AssessStep3Props) => {
  const [selectedService, setSelectedService] = useState<string>("");

  const { finalPrice, grade, gradeTextStyle, gradeNeonColor } =
    usePriceCalculation(deviceInfo, conditionInfo);

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

  const calculatedPawnPrice = Math.round(finalPrice * 0.7);

  const services: ServiceOption[] = [
    {
      id: "sell",
      title: "ขายทันที",
      description: "รับเงินสดเต็มจำนวนทันที",
      icon: Banknote,
      price: finalPrice,
      features: [
        "รับเงินสดทันที",
        "โอนเงินภายใน 30 นาที",
        "ไม่มีค่าธรรมเนียม",
        "รับประกันราคา 7 วัน",
      ],
    },
    {
      id: "pawn",
      title: "บริการจำนำ",
      description: "รับเงินก้อนพร้อมสิทธิ์ไถ่คืน",
      icon: Shield,
      price: calculatedPawnPrice,
      features: [
        "รับเงินสดทันที",
        "ไถ่คืนได้ภายใน 6 เดือน",
        "อัตราดอกเบี้ย 2% ต่อเดือน",
        "เก็บเครื่องในสภาพดี",
      ],
    },
    {
      id: "tradein",
      title: "แลกซื้อเครื่องใหม่",
      description: "เพิ่มส่วนลดเมื่ออัปเกรดเครื่องใหม่ที่ร้าน",
      icon: RefreshCw,
      price: Math.round(finalPrice * 1.05),
      features: [
        "บวกส่วนลดเพิ่ม",
        "เลือกรุ่นใหม่ได้ทันที",
        "โอนย้ายข้อมูลให้",
        "ประกันความพึงพอใจ 7 วัน",
      ],
    },
    {
      id: "consignment",
      title: "ฝากขาย",
      description: "เราช่วยประกาศขายเพื่อให้ได้ราคาดีที่สุด",
      icon: ShoppingBag,
      price: Math.round(finalPrice * 1.15),
      features: [
        "ทีมการตลาดลงประกาศ",
        "ถ่ายรูปสินค้าโปร",
        "อัปเดตสถานะเป็นระยะ",
        "คิดค่าบริการเมื่อขายได้",
      ],
    },
    {
      id: "installment",
      title: "ผ่อนชำระ",
      description: "แบ่งจ่ายสบายใจ ไม่ต้องจ่ายเต็ม",
      icon: CreditCard,
      price: Math.round(finalPrice / 6),
      features: [
        "ยืนยันตัวตนออนไลน์",
        "อนุมัติไว",
        "ดอกเบี้ยโปรโมชัน",
        "ผ่อนยาวได้ตามโปร",
      ],
    },
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
    // ใช้ card-assessment จาก globals.css เพื่อให้มีพื้นหลังและกรอบที่สอดคล้องกัน
    <div className="flex w-full flex-col gap-8 md:p-8">
      <div className="text-center">
        <h2 className="text-foreground mt-8 text-3xl font-bold">
          ผลประเมินสภาพโทรศัพท์
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-8">
        {/* Column 1: Assessment Summary */}
        <AssessmentSummary
          deviceInfo={deviceInfo}
          conditionInfo={conditionInfo}
          isImageLoading={isImageLoading}
          mobileData={mobileData}
          grade={grade}
          gradeTextStyle={gradeTextStyle}
          gradeNeonColor={gradeNeonColor}
          finalPrice={finalPrice}
          assessmentDate={assessmentDate}
        />

        {/* Column 2: Service Selection */}
        <div className="flex flex-col">
          <Services
            services={services}
            selectedService={selectedService}
            setSelectedService={setSelectedService}
            deviceInfo={deviceInfo}
            pawnPrice={calculatedPawnPrice}
          />
        </div>
      </div>

      {/* Footer Buttons - ปรับปรุงใหม่ทั้งหมด */}
      <div className="mt-4 flex items-center justify-between border-t pt-6 dark:border-zinc-800">
        {/* ปุ่มย้อนกลับ (Secondary Action) */}
        <FramerButton
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-12 items-center rounded-xl border bg-white px-6 transition-colors dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="ml-2 hidden font-semibold sm:inline">ย้อนกลับ</span>
        </FramerButton>

        {/* ปุ่มยืนยัน (Primary Action) */}
        <FramerButton
          onClick={handleConfirm}
          disabled={!selectedService}
          size="lg"
          // ใช้ gradient-primary จาก globals.css และปรับเงาให้สอดคล้องกับธีม
          className="gradient-primary text-primary-foreground shadow-primary/30 hover:shadow-secondary/30 h-12 transform-gpu rounded-xl px-8 text-base font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          ยืนยันการเลือก
        </FramerButton>
      </div>
    </div>
  );
};

export default AssessStep3;
