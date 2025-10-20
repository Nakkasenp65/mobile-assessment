import React from "react";
import { Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Turnstile from "@/components/Turnstile";
import { AlertTriangle } from "lucide-react"; // Import AlertTriangle icon

interface InputPhoneNumberProps {
  phoneNumber: string;
  onPhoneNumberChange: (phoneNumber: string) => void;
  onPhoneSubmit: (phoneNumber: string) => void;
  onTurnstileVerify: (token: string | null) => void;
  isLoading: boolean;
  showTurnstileWarning: boolean; // Add showTurnstileWarning prop
  isDevEnv: boolean; // Add isDevEnv prop
}

const InputPhoneNumber: React.FC<InputPhoneNumberProps> = ({
  phoneNumber,
  onPhoneNumberChange,
  onPhoneSubmit,
  onTurnstileVerify,
  isLoading,
  showTurnstileWarning,
  isDevEnv,
}) => {
  const sanitizedPhone = phoneNumber.replace(/\D/g, "").slice(0, 10);
  const isValidPhone = /^\d{10}$/.test(sanitizedPhone);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPhoneSubmit(sanitizedPhone);
  };

  return (
    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white/95 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:max-w-lg">
      {/* Header Section with Apple-style spacing */}
      <div className="px-6 pt-8 pb-6 text-center sm:px-10 sm:pt-12 sm:pb-8">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-pink-600 shadow-[0_6px_24px_rgba(251,146,60,0.25)]">
          <Phone className="h-7 w-7 text-white" strokeWidth={1.5} />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            ตรวจสอบรายการประเมิน
          </h1>
          <p className="text-base leading-relaxed text-gray-500 sm:text-lg">OK Mobile</p>
          <p className="text-sm font-medium text-gray-400">บริษัท โอเค นัมเบอร์ วัน จำกัด</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 pb-8 sm:px-10 sm:pb-10">
        {/* Warning Message */}
        {showTurnstileWarning && (
          <div className="mb-6 flex items-center justify-center gap-3 rounded-2xl bg-red-50 px-4 py-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-sm font-medium text-red-600">
              กรุณาตรวจสอบ Cloudflare ก่อนดำเนินการต่อ
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-6 sm:space-y-8">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">หมายเลขโทรศัพท์</label>
            <div className="relative">
              <Input
                type="tel"
                inputMode="numeric"
                id="phoneNumber"
                placeholder="เบอร์โทรศัพท์ 10 หลัก"
                maxLength={10}
                value={sanitizedPhone}
                onChange={(e) => onPhoneNumberChange(e.target.value)}
                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 text-center text-base tracking-wider transition-all duration-200 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 focus:ring-offset-0 sm:h-14 sm:text-lg"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className={`h-12 w-full rounded-2xl text-base font-semibold transition-all duration-300 focus:ring-4 focus:ring-offset-0 sm:h-14 sm:text-lg ${
              isValidPhone && !isLoading
                ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-[0_8px_32px_rgba(251,146,60,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(251,146,60,0.4)] focus:ring-orange-200"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
            disabled={!isValidPhone || isLoading}
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                กำลังค้นหา
              </span>
            ) : (
              "ค้นหารายการประเมิน"
            )}
          </Button>
        </form>

        {/* Development Mode Indicator */}
        {isDevEnv && (
          <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-amber-50 px-4 py-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium tracking-wide text-amber-700 uppercase">
              Development Mode
            </span>
          </div>
        )}

        {/* Turnstile Section */}
        <div className="mt-8 flex justify-center">
          <div className="rounded-2xl bg-gray-50 p-3 sm:p-4">
            <Turnstile onVerify={onTurnstileVerify} language="th" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPhoneNumber;
