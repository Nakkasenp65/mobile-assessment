// src/app/assess/components/(step2)/ReviewSummary.tsx
"use client";

import { CheckCircle, AlertCircle } from "lucide-react";
import AssessmentLedger from "../(step3)/AssessmentLedger";
import { ConditionInfo, DeviceInfo } from "../../../../types/device";

interface ReviewSummaryProps {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  errors: string[];
  onBack: () => void;
  onConfirm: () => void;
}

export default function ReviewSummary({
  deviceInfo,
  conditionInfo,
  errors,
  onBack,
  onConfirm,
}: ReviewSummaryProps) {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <div className="rounded-2xl border bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          ตรวจสอบสรุปข้อมูลอุปกรณ์ของคุณ
        </h3>
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

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          กลับไปแก้ไข
        </button>
        <button
          onClick={onConfirm}
          className="rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 px-5 py-2 text-sm font-semibold text-white shadow hover:brightness-110 active:translate-y-px"
          aria-label="ยืนยันข้อมูลและดำเนินการต่อ"
        >
          ยืนยันข้อมูลและดำเนินการต่อ
        </button>
      </div>
    </div>
  );
}