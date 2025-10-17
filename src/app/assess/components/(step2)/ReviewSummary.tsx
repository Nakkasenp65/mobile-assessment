// src/app/assess/components/(step2)/ReviewSummary.tsx
"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle, Phone, ShieldCheck, ArrowLeft, CardSim } from "lucide-react";
import AssessmentLedger from "../../../details/(step3)/AssessmentLedger";
import { ConditionInfo, DeviceInfo } from "../../../../types/device";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FramerButton from "../../../../components/ui/framer/FramerButton";

interface ReviewSummaryProps {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  errors: string[];
  onBack: () => void;
  onConfirm: (phoneNumber: string) => void;
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
  const [phoneInput, setPhoneInput] = useState("");
  const sanitized = phoneInput.replace(/\D/g, "").slice(0, 10);
  const isValidPhone = /^\d{10}$/.test(sanitized);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const openPhoneModal = () => {
    setPhoneError(null);
    setIsPhoneModalOpen(true);
  };
  const closePhoneModal = () => setIsPhoneModalOpen(false);
  const handleConfirmClick = () => {
    if (!isValidPhone) {
      setPhoneError("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)");
      return;
    }
    setPhoneError(null);
    onConfirm(sanitized);
  };

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <div className="rounded-2xl border bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <h3 className="mb-3 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          ตรวจสอบสรุปข้อมูลอุปกรณ์ของคุณ
        </h3>
        {/* Device Info Summary */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-foreground text-base font-semibold">
            {deviceInfo.brand} {deviceInfo.model || deviceInfo.productType}
          </div>
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

      <div className="flex items-center justify-between">
        <FramerButton
          variant="ghost"
          onClick={onBack}
          className="bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-12 items-center rounded-full border px-1 transition-colors dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
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

      {/* Phone Number Modal */}
      <Dialog open={isPhoneModalOpen} onOpenChange={setIsPhoneModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-pink-600 text-white shadow">
                <Phone className="h-4 w-4" />
              </span>
              ยืนยันเบอร์โทรศัพท์เพื่อบันทึกรายการ
            </DialogTitle>
            <DialogDescription>
              กรุณากรอกเบอร์โทรศัพท์ 10 หลัก เพื่อใช้ค้นหาและติดตามรายการประเมินของคุณในภายหลัง
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-200">เบอร์โทรศัพท์</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Phone className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="tel"
                inputMode="numeric"
                value={sanitized ? sanitized : phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="h-11 w-full rounded-lg border-gray-200 bg-gray-50 pr-4 pl-10 text-base transition-all focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-700 dark:bg-zinc-900"
                placeholder="0987654321"
                maxLength={10}
                disabled={isSubmitting}
              />
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className={`h-4 w-4 ${isValidPhone ? "text-emerald-600" : "text-red-500"}`} />
              <p className={`text-xs ${isValidPhone ? "text-emerald-700" : "text-red-600"}`}>
                {isValidPhone ? "รูปแบบเบอร์ถูกต้อง" : "ต้องเป็นตัวเลข 10 หลัก"}
              </p>
            </div>
            {phoneError && <p className="text-sm text-red-600">{phoneError}</p>}
            {serverError && <p className="text-sm text-red-600">{serverError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closePhoneModal} className="rounded-lg" disabled={isSubmitting}>
              ยกเลิก
            </Button>
            <Button
              onClick={handleConfirmClick}
              className="rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 text-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!isValidPhone || isSubmitting}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
                  กำลังบันทึก...
                </span>
              ) : (
                "บันทึกรายการ"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
