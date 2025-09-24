// src/app/assess/step3/AssessStep3.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Banknote,
  Shield,
  ImageOff,
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

// จำนำ turn refinance ซ่อม
// ไม่จำเป็นต้อง import PawnService ที่นี่แล้ว เพราะ Services เป็นผู้จัดการ
// import PawnService from "./(services)/PawnService";

// ----------------------------------------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------------------------------------
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

// ----------------------------------------------------------------------------------------------------
// Component: AssessStep3
// ทำหน้าที่เป็น Orchestrator อย่างสมบูรณ์ โดยจัดการ State หลักและส่งข้อมูลลงไปยัง Child Components
// ตรรกะการแสดงผล PawnService ถูกย้ายไปจัดการที่ Services component แล้ว
// ----------------------------------------------------------------------------------------------------
const AssessStep3 = ({
  deviceInfo,
  conditionInfo,
  onBack: handleGlobalBack,
}: AssessStep3Props) => {
  const [selectedService, setSelectedService] = useState<string>("");

  const { finalPrice, grade, gradeTextStyle, gradeNeonColor } =
    usePriceCalculation(deviceInfo, conditionInfo);

  const { data: mobileData, isLoading: isImageLoading } = useMobile(
    deviceInfo.brand,
    deviceInfo.model,
  );

  console.log(deviceInfo);
  console.log(conditionInfo);

  const pawnPrice = Math.round(finalPrice * 0.7);

  const services: ServiceOption[] = [
    {
      id: "sell",
      title: "ขายทันที",
      description: "รับเงินสดเต็มจำนวนทันที",
      icon: Banknote,
      price: finalPrice,
      features: ["รับเงินสดทันที", "โอนเงินภายใน 30 นาที", "ไม่มีค่าธรรมเนียม"],
    },
    {
      id: "pawn",
      title: "บริการจำนำ",
      description: "รับเงินก้อนพร้อมสิทธิ์ไถ่คืน",
      icon: Shield,
      price: pawnPrice,
      features: [], // Features จะไม่แสดง เพราะจะแสดงเป็นฟอร์มแทน
    },
    {
      id: "tradein",
      title: "แลกซื้อเครื่องใหม่ (Trade-in)",
      description: "เพิ่มส่วนลดเมื่ออัปเกรดเครื่องใหม่",
      icon: RefreshCw,
      price: Math.round(finalPrice * 1.05),
      features: ["บวกส่วนลดเพิ่ม", "เลือกรุ่นใหม่ได้ทันที", "โอนย้ายข้อมูลให้"],
    },
  ];

  const handleConfirm = () => {
    if (selectedService) {
      // ในอนาคตอาจต้องเพิ่ม logic ตรวจสอบว่าฟอร์ม pawn กรอกครบหรือยัง
      alert(
        `ขอบคุณสำหรับการเลือกบริการ ${selectedService}! เราจะติดต่อกลับภายใน 24 ชั่วโมง`,
      );
    }
  };

  // ==========================================================================
  // โครงสร้างหลัก: ไม่มีการสลับหน้าแล้ว ทุกอย่างแสดงผลในหน้าเดียว
  // ==========================================================================
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        {/* --- Left Column: Summary --- */}
        <div className="flex flex-1 flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-foreground mt-4 text-2xl font-bold">
            สรุปผลการประเมิน
          </h2>
          <div className="border-border sticky w-full rounded-2xl md:border md:p-2">
            <div className="relative flex flex-col items-center sm:flex-row">
              <div className="bg-accent/20 flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-lg">
                <AnimatePresence mode="wait">
                  {isImageLoading ? (
                    <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                  ) : mobileData?.image_url ? (
                    <Image
                      src={mobileData.image_url}
                      alt={`${deviceInfo.brand} ${deviceInfo.model}`}
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                  ) : (
                    <ImageOff className="text-muted-foreground h-8 w-8" />
                  )}
                </AnimatePresence>
              </div>
              <div className="flex w-full flex-col items-start text-start sm:text-left md:items-start">
                <h3 className="text-foreground text-lg font-bold md:text-xl">
                  {deviceInfo.model}
                </h3>
                <div className="flex gap-2">
                  <p className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
                    {deviceInfo.brand}
                  </p>
                  <p className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs">
                    {deviceInfo.storage}
                  </p>
                </div>
              </div>
              <div className="absolute right-4 flex items-baseline justify-center">
                <span
                  className={`bg-gradient-to-br bg-clip-text text-[72px] font-bold text-transparent ${gradeTextStyle} [filter:drop-shadow(0_0_4px_var(--neon-color))_drop-shadow(0_0_4px_#fff)]`}
                  style={
                    { "--neon-color": gradeNeonColor } as React.CSSProperties
                  }
                >
                  {grade}
                </span>
              </div>
            </div>
            <div className="from-primary/10 to-secondary/10 border-primary/20 mt-2 flex gap-2 rounded-sm border bg-gradient-to-r p-2 text-center">
              <p className="text-2xl font-medium text-black">ราคาประเมิน:</p>
              <p className="from-primary to-secondary bg-gradient-to-br bg-clip-text text-2xl font-bold text-transparent">
                {finalPrice.toLocaleString()}
              </p>
              <p className="text-2xl font-medium text-black">บาท</p>
            </div>
          </div>

          {/* // ==========================================================================
          // โครงสร้างหลัก: ไม่มีการสลับหน้าแล้ว ทุกอย่างแสดงผลในหน้าเดียว
          // ========================================================================== */}
          <div className="w-full rounded-2xl">
            <AssessmentLedger
              deviceInfo={deviceInfo}
              conditionInfo={conditionInfo}
            />
          </div>
        </div>

        {/* --- Right Column: Service Selection (ส่ง Props ที่จำเป็นลงไป) --- */}

        <Services
          services={services}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          deviceInfo={deviceInfo}
          pawnPrice={pawnPrice}
        />
      </div>

      <div className="border-border flex justify-between border-t pt-6">
        <FramerButton
          variant="ghost"
          onClick={handleGlobalBack}
          className="border-border text-foreground hover:bg-accent flex h-12 items-center rounded-xl border px-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">ย้อนกลับ</span>
        </FramerButton>
        <FramerButton
          onClick={handleConfirm}
          disabled={!selectedService}
          size="lg"
          className="text-primary-foreground h-12 transform-gpu rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-8 text-base font-semibold shadow-lg transition-all duration-300 hover:-translate-y-1 disabled:opacity-50"
        >
          ยืนยันการเลือก
        </FramerButton>
      </div>
    </div>
  );
};

export default AssessStep3;
