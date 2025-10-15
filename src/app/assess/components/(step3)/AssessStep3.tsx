// src/app/assess/components/(step3)/AssessStep3.tsx

"use client";
import { useEffect, useState, useRef } from "react"; // ✨ 1. import useRef
import { ArrowLeft } from "lucide-react";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { useMobile } from "@/hooks/useMobile";
import Services from "./Services";
import FramerButton from "../../../../components/ui/framer/FramerButton";
import AssessmentSummary from "./AssessmentSummary";
import { useRepairPrices } from "@/hooks/useRepairPrices";
import { ConditionInfo, DeviceInfo } from "../../../../types/device";
import { AssessmentRecord } from "../../../../types/assessment";
import ScrollDownIndicator from "../../../../components/ui/ScrollDownIndicator";
import { cn } from "@/lib/utils";

const getExpiryDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
};

const mockRecords: AssessmentRecord = {
  id: "ASS-2568-0001",
  phoneNumber: "0812345678",
  assessmentDate: "25 กันยายน 2568",
  device: {
    brand: "Apple",
    model: "iPhone 15 Pro",
    storage: "256GB",
    imageUrl: "https://lh3.googleusercontent.com/d/14EB_azrtiSrLtPVlIxWiU5Vg1hS8aw1A",
  },
  conditionInfo: {
    modelType: "model_th",
    warranty: "warranty_active_long",
    accessories: "acc_full",
    bodyCondition: "body_mint",
    screenGlass: "glass_ok",
    screenDisplay: "display_ok",
    batteryHealth: "battery_health_high",
    camera: "camera_ok",
    wifi: "wifi_ok",
    faceId: "biometric_ok",
    speaker: "speaker_ok",
    mic: "mic_ok",
    touchScreen: "touchscreen_ok",
    charger: "charger_failed",
    call: "call_ok",
    homeButton: "home_button_ok",
    sensor: "sensor_ok",
    buttons: "buttons_ok",
    canUnlockIcloud: true,
  },
  pawnServiceInfo: {
    customerName: "นางสาวสายฟ้า สมสุข",
    locationType: "bts",
    btsLine: "BTS - สายสุขุมวิท",
    btsStation: "สยาม",
    appointmentDate: "27 กันยายน 2568",
    appointmentTime: "13:00 - 17:00",
    phone: "0812345678",
  },
  selectedService: {
    name: "บริการจำนำ (Pawn Service)",
    price: 22600,
    appointmentDate: "27 กันยายน 2568, 13:00 - 17:00 น.",
  },
  status: "completed",
  estimatedValue: 28500,
  priceLockExpiresAt: getExpiryDate(3),
  nextSteps: [
    "เตรียมบัตรประชาชนและอุปกรณ์ให้พร้อม",
    "ไปพบทีมงานตามวัน-เวลานัด และสถานีที่เลือก",
    "ชำระเงินและรับเอกสารการทำรายการ",
  ],
};

interface AssessStep3Props {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  onBack: () => void;
  onNext: () => void;
  setSelectedService: React.Dispatch<React.SetStateAction<string>>;
  priceLockExpiresAt?: string; // Optional for price lock countdown
}

export default function AssessStep3({
  deviceInfo,
  conditionInfo,
  onBack,
  onNext,
  setSelectedService,
  priceLockExpiresAt,
}: AssessStep3Props) {
  const isIcloudLocked = !conditionInfo.canUnlockIcloud;
  const isPriceable = conditionInfo.canUnlockIcloud;

  const servicesRef = useRef<HTMLDivElement>(null);

  const {
    totalRepairCost,
    repairs,
    isLoading: isLoadingRepairPrices,
  } = useRepairPrices(deviceInfo.model, conditionInfo);

  const [localSelectedService, setLocalSelectedService] = useState<string>("");

  const { finalPrice, grade } = usePriceCalculation(deviceInfo, conditionInfo);

  console.log("Final Price:", finalPrice);
  console.log("Grade:", grade);

  const { data: mobileData, isLoading: isImageLoading } = useMobile(deviceInfo.brand, deviceInfo.model);

  const assessmentDate =
    new Date().toLocaleString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }) + " น.";

  const handleConfirm = () => {
    if (localSelectedService && localSelectedService !== "maintenance") {
      onNext();
    }
  };

  useEffect(() => {
    if (localSelectedService !== "maintenance") {
      setSelectedService(localSelectedService);
    }
  }, [localSelectedService, setSelectedService]);

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <div className="flex w-full flex-col gap-4 sm:gap-8">
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <h2 className="text-2xl font-bold text-black lg:mb-2 lg:text-4xl">ผลการประเมินอุปกรณ์</h2>
      </div>

      <div className={cn("grid grid-cols-1 gap-3", !isIcloudLocked && "lg:grid-cols-2 lg:gap-3")}>
        <AssessmentSummary
          deviceInfo={deviceInfo}
          conditionInfo={conditionInfo}
          mockRecords={mockRecords}
          isImageLoading={isImageLoading}
          mobileData={mobileData}
          grade={grade}
          finalPrice={isPriceable ? finalPrice : 0}
          assessmentDate={assessmentDate}
          repairs={repairs}
          totalCost={totalRepairCost}
          isLoadingRepairPrices={isLoadingRepairPrices}
          priceLockExpiresAt={priceLockExpiresAt}
          isIcloudLocked={isIcloudLocked}
        />

        {!isIcloudLocked && (
          <div ref={servicesRef} id="services-section" className="top-24 flex h-fit flex-col lg:sticky">
            <Services
              selectedService={localSelectedService}
              setSelectedService={setLocalSelectedService}
              repairs={repairs}
              totalCost={totalRepairCost}
              isLoading={isLoadingRepairPrices}
              deviceInfo={deviceInfo}
              onNext={onNext}
              finalPrice={isPriceable ? finalPrice : 0}
            />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-6 dark:border-zinc-800">
        <FramerButton
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-12 items-center rounded-xl border bg-white px-6 transition-colors dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="ml-2 hidden font-semibold sm:inline">ย้อนกลับ</span>
        </FramerButton>
      </div>

      {!isIcloudLocked && <ScrollDownIndicator targetRef={servicesRef} />}
    </div>
  );
}
