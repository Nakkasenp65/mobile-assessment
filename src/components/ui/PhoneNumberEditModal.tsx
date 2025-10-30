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
import { Label } from "@/components/ui/label";
import FramerButton from "./framer/FramerButton";
import WebMIcon from "./WebMIcon";
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
  description,
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
      <DialogContent
        showCloseButton={false}
        className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-2xl backdrop:blur-sm sm:max-w-sm sm:p-8 md:max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center gap-3 text-slate-900">
            <WebMIcon src={"/assets/incoming-call.gif"} delay={2} />
            <span className="text-xl font-semibold tracking-tight">{title}</span>
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-slate-600">
            {description ? (
              description
            ) : (
              <span>
                เบอร์โทรศัพท์จะถูกใช้เพื่อค้นหาการประเมิน ท่านจะ{" "}
                <b>สามารถค้นหาบริการได้จากเบอร์โทรศัพท์นี้เท่านั้น</b>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-800">เบอร์โทรศัพท์</Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <Phone className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              type="tel"
              inputMode="numeric"
              value={sanitized || phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className={`h-12 w-full rounded-xl border-slate-200 pr-4 pl-10 text-base transition-all duration-200 focus:bg-white focus:ring-2 ${
                error ? "aria-invalid" : ""
              }`}
              placeholder="098*******"
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
          <FramerButton variant="ghost" onClick={onCancel} className="h-12 rounded-xl px-5">
            ยกเลิก
          </FramerButton>
          <FramerButton onClick={handleSave} disabled={!isValid} className="h-12 rounded-xl px-6">
            บันทึก
          </FramerButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PhoneNumberEditModal;
