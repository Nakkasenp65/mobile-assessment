"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Phone, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog";
import { Input } from "./input";
import { Button } from "./button";

interface PhoneNumberEditModalProps {
  open: boolean;
  initialPhone?: string;
  title?: string;
  description?: string;
  onCancel: () => void;
  onSave: (sanitizedPhone: string) => void;
}

// Minimalist, premium modal for editing phone numbers, aligned with Apple's aesthetic
function sanitizePhone(value: string): string {
  return (value || "").replace(/\D/g, "").slice(0, 10);
}

export function PhoneNumberEditModal({
  open,
  initialPhone = "",
  title = "ยืนยันเบอร์โทรศัพท์",
  description = "กรุณากรอกเบอร์โทรศัพท์ 10 หลัก เพื่อใช้ค้นหาและติดตามรายการของคุณ",
  onCancel,
  onSave,
}: PhoneNumberEditModalProps) {
  const [phoneInput, setPhoneInput] = useState<string>(sanitizePhone(initialPhone));
  const sanitized = useMemo(() => sanitizePhone(phoneInput), [phoneInput]);
  const isValid = useMemo(() => /^\d{10}$/.test(sanitized), [sanitized]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPhoneInput(sanitizePhone(initialPhone));
  }, [initialPhone, open]);

  const handleSave = () => {
    if (!isValid) {
      setError("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)");
      return;
    }
    setError(null);
    onSave(sanitized);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onCancel() : void 0)}>
      <DialogContent className="sm:max-w-sm md:max-w-md rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-2xl backdrop:blur-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-slate-900">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
              <Phone className="h-4 w-4" />
            </span>
            <span className="text-xl font-semibold tracking-tight">{title}</span>
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-relaxed text-slate-600">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <label className="text-sm font-medium text-slate-800">เบอร์โทรศัพท์</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <Phone className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              type="tel"
              inputMode="numeric"
              value={sanitized || phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className={`h-12 w-full rounded-xl border-slate-200 bg-slate-50 pr-4 pl-10 text-base transition-all duration-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 ${
                error ? "aria-invalid" : ""
              }`}
              placeholder="0987654321"
              maxLength={10}
              aria-invalid={!isValid}
              aria-describedby={error ? "phone-error" : undefined}
            />
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className={`h-4 w-4 ${isValid ? "text-emerald-600" : "text-red-500"}`} />
            <p className={`text-xs ${isValid ? "text-emerald-700" : "text-red-600"}`}>
              {isValid ? "รูปแบบเบอร์ถูกต้อง" : "ต้องเป็นตัวเลข 10 หลัก"}
            </p>
          </div>
          {error && (
            <p id="phone-error" className="text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} className="h-11 rounded-xl px-5">
            ยกเลิก
          </Button>
          <Button onClick={handleSave} disabled={!isValid} className="h-11 rounded-xl px-6">
            บันทึก
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PhoneNumberEditModal;