// src/app/assess/components/(step2)/ReviewSummary.tsx
"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle, Phone, ShieldCheck } from "lucide-react";
import AssessmentLedger from "../(step3)/AssessmentLedger";
import { ConditionInfo, DeviceInfo } from "../../../../types/device";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ReviewSummaryProps {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  errors: string[];
  onBack: () => void;
  onConfirm: (phoneNumber: string) => void;
  isSubmitting?: boolean;
  serverError?: string;
}

export default function ReviewSummary({ deviceInfo, conditionInfo, errors, onBack, onConfirm, isSubmitting = false, serverError }: ReviewSummaryProps) {
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

      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          <div className="mb-1 flex items-center gap-2 font-semibold">
            <AlertCircle className="h-4 w-4" /> เกิดข้อผิดพลาดจากเซิร์ฟเวอร์
          </div>
          <p>{serverError}</p>
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
          onClick={openPhoneModal}
          className="rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 px-5 py-2 text-sm font-semibold text-white shadow hover:brightness-110 active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
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
        </button>
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
                className="h-11 w-full rounded-lg border-gray-200 bg-gray-50 pr-4 pl-10 text-base transition-all focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-900"
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
            {phoneError && (
              <p className="text-sm text-red-600">{phoneError}</p>
            )}
            {serverError && (
              <p className="text-sm text-red-600">{serverError}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closePhoneModal}
              className="rounded-lg"
              disabled={isSubmitting}
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleConfirmClick}
              className="rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 text-white disabled:opacity-60 disabled:cursor-not-allowed"
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
