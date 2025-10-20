// src/app/assess/components/(step2)/ReviewSummary.tsx
"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Phone, ArrowLeft, CardSim } from "lucide-react";
import AssessmentLedger from "../../../details/(step3)/AssessmentLedger";
import { ConditionInfo, DeviceInfo } from "../../../../types/device";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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

  function openPhoneModal() {
    setPhoneError(null);
    setIsPhoneModalOpen(true);
  }

  function closePhoneModal() {
    setIsPhoneModalOpen(false);
  }

  function handleConfirmClick() {
    if (!isValidPhone) {
      setPhoneError("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)");
      return;
    }
    setPhoneError(null);
    onConfirm(sanitized);
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
        <DialogContent className="overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:max-w-md">
          {/* Apple-style header */}
          <div className="px-8 pt-8 pb-6">
            <DialogHeader className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <Phone className="h-10 w-10 text-gray-600" strokeWidth={1.5} />
                </div>
              </div>
              <div className="space-y-2">
                <DialogTitle className="text-2xl font-semibold tracking-tight text-gray-900">
                  ยืนยันเบอร์โทรศัพท์
                </DialogTitle>
                <DialogDescription className="text-base leading-relaxed text-gray-500">
                  กรอกเบอร์โทรศัพท์ 10 หลัก เพื่อใช้ในการติดตามรายการประเมินของคุณ
                </DialogDescription>
              </div>
            </DialogHeader>
          </div>

          {/* Input section */}
          <div className="px-8 pb-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
                <div className="relative">
                  <Input
                    type="tel"
                    inputMode="numeric"
                    value={sanitized ? sanitized : phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-center text-xl tracking-widest transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0"
                    placeholder="เบอร์โทรศัพท์ 10 หลัก"
                    maxLength={10}
                    disabled={isSubmitting}
                  />
                  {/* Subtle validation indicator */}
                  {sanitized.length > 0 && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      {isValidPhone ? (
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                      ) : (
                        <div className="flex space-x-1">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 w-1 rounded-full ${i < sanitized.length ? "bg-blue-500" : "bg-gray-200"}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Minimalist validation */}

              {/* Clean error display */}
              {(phoneError || serverError) && (
                <div className="rounded-2xl bg-red-50 px-4 py-3 text-center">
                  <p className="text-sm text-red-600">{phoneError || serverError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Apple-style button section */}
          <div className="border-t border-gray-100 px-8 py-6">
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={closePhoneModal}
                className="h-12 flex-1 rounded-2xl border-gray-200 bg-white font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:ring-offset-0"
                disabled={isSubmitting}
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleConfirmClick}
                className={`h-12 flex-1 rounded-2xl font-medium transition-all focus:ring-2 focus:ring-offset-0 ${
                  isValidPhone && !isSubmitting
                    ? "bg-blue-600 text-white shadow-[0_4px_12px_rgba(59,130,246,0.25)] hover:bg-blue-700 focus:ring-blue-500/50"
                    : "cursor-not-allowed bg-gray-200 text-gray-400"
                }`}
                disabled={!isValidPhone || isSubmitting}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    กำลังบันทึก
                  </span>
                ) : (
                  "บันทึกรายการ"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
