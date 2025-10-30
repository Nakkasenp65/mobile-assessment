// src/app/assess/components/(step2)/ReviewSummary.tsx

// Review Summary to For Mobile Assessment Confirmation

"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Phone, ArrowLeft, CardSim } from "lucide-react";
import AssessmentLedger from "../../../details/(step3)/AssessmentLedger";
import { ConditionInfo, DeviceInfo } from "../../../../types/device";
import FramerButton from "../../../../components/ui/framer/FramerButton";
import PersonalInformationModal from "./PersonalInformationModal";

interface ReviewSummaryProps {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  errors: string[];
  onBack: () => void;
  onConfirm: (phoneNumber: string, customerName: string) => void;
  isSubmitting?: boolean;
  serverError?: string;
}

export default function ReviewSummary({
  deviceInfo,
  conditionInfo,
  errors,
  onBack,
  onConfirm,
  isSubmitting = false,
  serverError,
}: ReviewSummaryProps) {
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  function openPhoneModal() {
    setIsPhoneModalOpen(true);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      {/* Summary Container */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        {/* Summary Header */}
        <h3 className="mb-3 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          ตรวจสอบสรุปข้อมูลอุปกรณ์ของคุณ
        </h3>
        {/* Device Info Summary */}
        <div className="mt-6 flex items-center justify-between">
          {/* Device Name */}
          <div className="text-foreground text-lg font-semibold">
            {deviceInfo.brand} {deviceInfo.model || deviceInfo.productType}
          </div>
          {/* Storage */}
          {deviceInfo.storage && (
            <div className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              <CardSim className="h-3.5 w-3.5" />
              <span>{deviceInfo.storage}</span>
            </div>
          )}
        </div>
        {/* Ledger */}
        <AssessmentLedger
          deviceInfo={deviceInfo}
          conditionInfo={conditionInfo}
          repairs={[]}
          totalCost={0}
          isLoading={false}
        />
      </div>

      {errors.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          <div className="mb-2 flex items-center gap-2 font-semibold">
            <AlertCircle className="h-4 w-4" /> กรุณาแก้ไขข้อมูลต่อไปนี้ก่อนดำเนินการต่อ
          </div>
          <ul className="list-inside list-disc">
            {errors.map((e, idx) => (
              <li key={idx}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          <div className="mb-1 flex items-center gap-2 font-semibold">
            <AlertCircle className="h-4 w-4" /> เกิดข้อผิดพลาดจากเซิร์ฟเวอร์
          </div>
          <p>{serverError}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <FramerButton variant="outline" onClick={onBack} className="h-12">
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับไปแก้ไข
        </FramerButton>
        <FramerButton
          onClick={openPhoneModal}
          className="gradient-primary text-primary-foreground shadow-primary/30 hover:shadow-secondary/30 h-12 transform-gpu rounded-full px-2 text-base font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          aria-label="ยืนยันข้อมูลและดำเนินการต่อ"
          disabled={isSubmitting || errors.length > 0}
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
              กำลังบันทึก...
            </span>
          ) : (
            "ยืนยันข้อมูลและดำเนินการต่อ"
          )}
        </FramerButton>
      </div>

      <PersonalInformationModal
        isPhoneModalOpen={isPhoneModalOpen}
        isSubmitting={isSubmitting}
        serverError={serverError}
        onConfirm={onConfirm}
        setIsPhoneModalOpen={setIsPhoneModalOpen}
      />
    </div>
  );
}
