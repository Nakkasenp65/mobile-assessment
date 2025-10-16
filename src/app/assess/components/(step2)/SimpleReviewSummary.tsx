// src/app/assess/components/(step2)/SimpleReviewSummary.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  Phone,
  ShieldCheck,
  ArrowLeft,
  Apple,
  Wrench,
  HardDrive,
  Shield,
} from "lucide-react";
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

interface SimpleReviewSummaryProps {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  errors: string[];
  onBack: () => void;
  onConfirm: (phoneNumber: string) => void;
  isSubmitting?: boolean;
  serverError?: string;
}

// Minimal label maps for simple assessment fields
const WARRANTY_LABELS: Record<ConditionInfo["warranty"], string> = {
  warranty_active_long: "เหลือมากกว่า 6 เดือน",
  warranty_active_short: "เหลือน้อยกว่า 6 เดือน",
  warranty_inactive: "หมดประกันแล้ว",
  "": "",
};

const REPAIRED_LABELS: Record<NonNullable<ConditionInfo["openedOrRepaired"]>, string> = {
  repaired_yes: "เคยซ่อม/แกะ",
  repaired_no: "ไม่เคยซ่อม/แกะ",
  "": "",
};

export default function SimpleReviewSummary({
  deviceInfo,
  conditionInfo,
  errors,
  onBack,
  onConfirm,
  isSubmitting = false,
  serverError,
}: SimpleReviewSummaryProps) {
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const sanitized = phoneInput.replace(/\D/g, "").slice(0, 10);
  const isValidPhone = /^\d{10}$/.test(sanitized);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Retrieve description from session storage saved by SimpleAssessmentForm
  const [extraDetails, setExtraDetails] = useState<string>("");
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.sessionStorage.getItem("assessment:simple") : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.description) setExtraDetails(String(parsed.description));
      }
    } catch {}
  }, []);

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

  const warrantyLabel = WARRANTY_LABELS[conditionInfo.warranty] || "";
  const repairedLabel = REPAIRED_LABELS[conditionInfo.openedOrRepaired ?? ""] || "";

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <h3 className="mb-4 flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
          <CheckCircle className="h-6 w-6 text-emerald-600" />
          ตรวจสอบข้อมูลสรุปสำหรับอุปกรณ์ Apple เฉพาะทาง
        </h3>

        {/* Device Overview */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-card rounded-xl border p-4 shadow-sm dark:border-zinc-700">
            <div className="mb-3 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
              <Apple className="h-5 w-5 text-blue-600" /> ข้อมูลอุปกรณ์
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 font-medium text-slate-700 dark:text-zinc-200">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 p-1 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <Apple className="h-3 w-3" />
                  </span>
                  ยี่ห้อ
                </span>
                <span className="font-medium text-slate-900 dark:text-white">{deviceInfo.brand || "-"}</span>
              </div>
              {deviceInfo.productType && (
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 font-medium text-slate-700 dark:text-zinc-200">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 p-1 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                      <Wrench className="h-3 w-3" />
                    </span>
                    ประเภท
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">{deviceInfo.productType}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 font-medium text-slate-700 dark:text-zinc-200">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 p-1 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <ShieldCheck className="h-3 w-3" />
                  </span>
                  รุ่น
                </span>
                <span className="font-medium text-slate-900 dark:text-white">{deviceInfo.model || "-"}</span>
              </div>
              {deviceInfo.storage && (
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 font-medium text-slate-700 dark:text-zinc-200">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 p-1 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                      <HardDrive className="h-3 w-3" />
                    </span>
                    ความจุ
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">{deviceInfo.storage}</span>
                </div>
              )}
            </div>
          </div>

          {/* General Info */}
          <div className="bg-card rounded-xl border p-4 shadow-sm dark:border-zinc-700">
            <div className="mb-3 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
              <ShieldCheck className="h-5 w-5 text-indigo-600" /> รายละเอียดทั่วไป
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 font-medium text-slate-700 dark:text-zinc-200">
                  <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  ประกันศูนย์
                </span>
                <span className="font-medium text-slate-900 dark:text-white">{warrantyLabel || "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 font-medium text-slate-700 dark:text-zinc-200">
                  <Wrench className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  เคยแกะหรือซ่อมมา
                </span>
                <span className="font-medium text-slate-900 dark:text-white">{repairedLabel || "-"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Extra details from simple form */}
        {extraDetails && (
          <div className="bg-card text-muted-foreground rounded-xl border p-4 text-sm shadow-sm dark:border-zinc-700">
            <div className="mb-3 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
              <AlertCircle className="h-5 w-5 text-amber-600" /> รายละเอียดเพิ่มเติมจากผู้ใช้
            </div>
            <p className="whitespace-pre-line text-slate-700 dark:text-zinc-300">{extraDetails}</p>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          <div className="mb-3 flex items-center gap-2 font-semibold text-red-800 dark:text-red-300">
            <AlertCircle className="h-5 w-5" /> กรุณาแก้ไขข้อมูลต่อไปนี้ก่อนดำเนินการต่อ
          </div>
          <ul className="list-inside list-disc space-y-1">
            {errors.map((e, idx) => (
              <li key={idx}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          <div className="mb-2 flex items-center gap-2 font-semibold text-red-800 dark:text-red-300">
            <AlertCircle className="h-5 w-5" /> เกิดข้อผิดพลาดจากเซิร์ฟเวอร์
          </div>
          <p>{serverError}</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <FramerButton
          variant="ghost"
          onClick={onBack}
          className="bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-12 items-center rounded-full border px-6 transition-colors shadow-sm dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับไปแก้ไข
        </FramerButton>
        <FramerButton
          onClick={openPhoneModal}
          className="gradient-primary text-primary-foreground shadow-primary/30 hover:shadow-secondary/30 h-12 transform-gpu rounded-full px-8 text-base font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-60"
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
