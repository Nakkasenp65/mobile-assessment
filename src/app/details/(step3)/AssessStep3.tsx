// src/app/assess/components/(step3)/AssessStep3.tsx

"use client";
import { useEffect, useState, useRef, useMemo } from "react"; // ✨ include useMemo
import { ArrowLeft } from "lucide-react";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { useMobile } from "@/hooks/useMobile";
import Services from "./Services";
import FramerButton from "../../../components/ui/framer/FramerButton";
import AssessmentSummary from "./AssessmentSummary";
import { useRepairPrices } from "@/hooks/useRepairPrices";
import { ConditionInfo, DeviceInfo } from "../../../types/device";
import ScrollDownIndicator from "../../../components/ui/ScrollDownIndicator";
import { cn } from "@/lib/utils";

const getExpiryDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
};

interface AssessStep3Props {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  docId?: string;
  onBack: () => void;
  onNext: () => void;
  setSelectedService: React.Dispatch<React.SetStateAction<string>>;
  priceLockExpiresAt?: string; // Optional for price lock countdown
}

export default function AssessStep3({
  docId,
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

  // ✨ Determine expiration status from priceLockExpiresAt
  const isExpired = useMemo(() => {
    if (!priceLockExpiresAt) return false;
    const ts = new Date(priceLockExpiresAt).getTime();
    return Number.isFinite(ts) && ts <= Date.now();
  }, [priceLockExpiresAt]);

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
    <div className="grid w-full gap-4 pb-24 sm:gap-8">
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <h2 className="text-2xl font-bold text-black lg:mb-2 lg:text-4xl">ผลการประเมินอุปกรณ์</h2>
      </div>

      <div
        className={cn(
          "grid grid-cols-1 gap-3",
          !isIcloudLocked && "lg:grid-cols-2 lg:items-start lg:gap-3",
        )}
      >
        <AssessmentSummary
          deviceInfo={deviceInfo}
          conditionInfo={conditionInfo}
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
          docId={docId}
        />

        {!isIcloudLocked && (
          <div ref={servicesRef} id="services-section" className="lg:sticky lg:top-0">
            {isExpired ? (
              <div className="border-border rounded-xl border bg-rose-50/80 p-4 text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
                <p className="text-sm font-semibold">ราคาล็อคหมดอายุแล้ว</p>
                <p className="mt-1 text-xs">กรุณาทำการประเมินใหม่เพื่อดำเนินการบริการต่อไป</p>
              </div>
            ) : (
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
            )}
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
