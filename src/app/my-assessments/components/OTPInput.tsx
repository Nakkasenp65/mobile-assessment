import React, { useState, useRef, useEffect } from "react";
import { Shield, ArrowLeft, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { getVerifiedSession } from "../lib/session";

interface OTPInputProps {
  phoneNumber: string;
  transactionRef?: string;
  onOTPVerify: (otp: string) => void;
  onBack: () => void;
  onResendOTP: () => void;
  isLoading: boolean;
  isResending: boolean;
  error?: string;
  countdown: number;
}

const OTPInput: React.FC<OTPInputProps> = ({
  phoneNumber,
  transactionRef,
  onOTPVerify,
  onBack,
  onResendOTP,
  isLoading,
  isResending,
  error,
  countdown,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [hasCachedSession, setHasCachedSession] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState<string | null>(null);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== "") && newOtp.join("").length === 6) {
      onOTPVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    if (pastedData.length === 6) {
      onOTPVerify(pastedData);
    } else if (pastedData.length > 0) {
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  };

  const isOTPComplete = otp.every(digit => digit !== "");
  const canResend = countdown === 0 && !isResending;

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Detect cached session for this phone number
  useEffect(() => {
    getVerifiedSession(phoneNumber).then((sess) => {
      if (sess) {
        setHasCachedSession(true);
        setSessionExpiry(new Date(sess.expiresAt).toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }));
      } else {
        setHasCachedSession(false);
        setSessionExpiry(null);
      }
    });
  }, [phoneNumber]);

  return (
    <div className="w-full max-w-md sm:max-w-lg overflow-hidden rounded-3xl bg-white/95 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      {/* Header Section */}
      <div className="px-6 pt-8 pb-6 sm:px-10 sm:pt-12 sm:pb-8 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_6px_24px_rgba(59,130,246,0.25)]">
          <Shield className="h-7 w-7 text-white" strokeWidth={1.5} />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">ยืนยันรหัส OTP</h1>
          <p className="text-base sm:text-lg leading-relaxed text-gray-500">
            รหัสยืนยันถูกส่งไปยัง
          </p>
          <p className="text-sm font-medium text-blue-600">
            {formatPhoneNumber(phoneNumber)}
          </p>
          {transactionRef && (
            <p className="text-xs font-medium text-gray-500">
              รหัสอ้างอิง: <span className="text-gray-700">{transactionRef}</span>
            </p>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 pb-8 sm:px-10 sm:pb-10">
        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center justify-center gap-3 rounded-2xl bg-red-50 px-4 py-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        )}

        {/* Cached Session Notice */}
        {hasCachedSession && (
          <div className="mb-6 flex items-center justify-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3">
            <Shield className="h-5 w-5 text-emerald-600" />
            <div className="text-sm">
              <p className="font-semibold text-emerald-700">พบเซสชันที่ยืนยันแล้ว</p>
              {sessionExpiry && (
                <p className="text-xs text-emerald-600">หมดอายุ: {sessionExpiry}</p>
              )}
            </div>
            <Button
              type="button"
              className="ml-4 bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => onOTPVerify(otp.join("") || "000000")}
            >
              ดำเนินการต่อ
            </Button>
          </div>
        )}

        {/* OTP Input Fields */}
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700 text-center">
              กรุณากรอกรหัส OTP 6 หลัก
            </label>
            
            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="h-12 sm:h-14 w-10 sm:w-12 rounded-2xl border border-gray-200 bg-gray-50 text-center text-xl sm:text-2xl font-bold transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:ring-offset-0"
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={() => onOTPVerify(otp.join(""))}
              className={`h-12 sm:h-14 w-full rounded-2xl text-base sm:text-lg font-semibold transition-all duration-300 focus:ring-4 focus:ring-offset-0 ${
                isOTPComplete && !isLoading
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-[0_8px_32px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(59,130,246,0.4)] focus:ring-blue-200"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
              }`}
              disabled={!isOTPComplete || isLoading}
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  กำลังยืนยัน
                </span>
              ) : (
                "ยืนยันรหัส OTP"
              )}
            </Button>

            {/* Resend OTP */}
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-gray-500">
                  ส่งรหัสใหม่ได้ในอีก {countdown} วินาที
                </p>
              ) : (
                <Button
                  variant="ghost"
                  onClick={onResendOTP}
                  disabled={isResending}
                  className="text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  {isResending ? (
                    <span className="inline-flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      กำลังส่งรหัสใหม่
                    </span>
                  ) : (
                    "ส่งรหัส OTP ใหม่"
                  )}
                </Button>
              )}
            </div>

            {/* Back Button */}
            <Button
              variant="outline"
              onClick={onBack}
              className="h-10 sm:h-12 w-full rounded-2xl border-gray-200 text-gray-600 hover:bg-gray-50"
              disabled={isLoading || isResending}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              กลับไปแก้ไขเบอร์โทร
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPInput;