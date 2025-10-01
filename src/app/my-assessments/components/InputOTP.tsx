import React, { FormEvent, KeyboardEvent, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Debounce hook for delaying effect
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

interface InputOTPProps {
  phoneNumber: string;
  otp: string[];
  onOtpChange: (element: HTMLInputElement, index: number) => void;
  onOtpKeyDown: (e: KeyboardEvent<HTMLInputElement>, index: number) => void;
  onSubmit: (e?: FormEvent) => void; // make event optional for auto submit
  onBack: () => void;
  isLoading: boolean;
}

const InputOTP: React.FC<InputOTPProps> = ({
  phoneNumber,
  otp,
  onOtpChange,
  onOtpKeyDown,
  onSubmit,
  onBack,
  isLoading,
}) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Concatenate OTP digits
  const otpString = otp.join("");

  // Debounce OTP string to detect complete input after typing stops
  const debouncedOtp = useDebounce(otpString, 300);

  // Auto submit effect when debounced OTP length is 6 and not loading
  useEffect(() => {
    if (debouncedOtp.length === 6 && !isLoading) {
      // Call onSubmit without a form event for programmatic submission
      onSubmit?.();
    }
  }, [debouncedOtp, isLoading, onSubmit]);

  return (
    <motion.div
      key="enter-otp"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full text-center"
    >
      <h1 className="text-3xl font-extrabold tracking-tight text-[#110e0c] sm:text-4xl md:text-5xl">
        ยืนยันตัวตน
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base text-[#78716c] md:text-lg">
        กรอกรหัส OTP 6 หลักที่ส่งไปยัง{" "}
        <span className="font-semibold text-orange-600">{phoneNumber}</span>
      </p>
      <form
        onSubmit={onSubmit}
        className="mx-auto mt-8 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
      >
        <div className="flex justify-center gap-2 md:gap-3">
          {otp.map((data, index) => (
            <Input
              key={index}
              ref={(el) => {
                if (el) inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              value={data}
              onChange={(e) => onOtpChange(e.target, index)}
              onKeyDown={(e) => onOtpKeyDown(e, index)}
              className="h-14 w-12 rounded-lg border-2 border-[#e3dace] bg-white text-center text-2xl font-bold shadow-lg focus:border-[#f97316] focus:ring-[#f97316]/20 md:h-16 md:w-14"
              maxLength={1}
              required
            />
          ))}
        </div>

        <Button
          type="submit"
          disabled={isLoading || otp.join("").length < 6}
          className="mt-8 h-12 w-full rounded-full px-6 text-base font-semibold text-white sm:px-8"
        >
          {isLoading ? (
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-white/50 border-t-white" />
          ) : (
            "ยืนยัน"
          )}
        </Button>

        <Button type="button" variant="link" onClick={onBack} className="mt-4 text-slate-500">
          เปลี่ยนเบอร์โทร
        </Button>
      </form>
    </motion.div>
  );
};

export default InputOTP;
