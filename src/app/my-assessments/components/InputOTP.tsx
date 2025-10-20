import React, { FormEvent, KeyboardEvent, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Debounce hook for delaying effect (ไม่เปลี่ยนแปลง)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// ขยาย Interface เพื่อรองรับภาระที่เพิ่มขึ้น
interface InputOTPProps {
  phoneNumber: string;
  otp: string[];
  onOtpChange: (element: HTMLInputElement, index: number) => void;
  onOtpKeyDown: (e: KeyboardEvent<HTMLInputElement>, index: number) => void;
  onSubmit: (e?: FormEvent) => void;
  onBack: () => void;
  onResend: () => void; // เพิ่ม onResend เข้ามาใน props
  isLoading: boolean;
}

const InputOTP: React.FC<InputOTPProps> = ({
  phoneNumber,
  otp,
  onOtpChange,
  onOtpKeyDown,
  onSubmit,
  onBack,
  onResend, // รับ onResend จาก props
  isLoading,
}) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  // สถานะใหม่: ตัวนับเวลาถอยหลัง เริ่มที่ 120 วินาที (2 นาที)
  const [countdown, setCountdown] = useState(120);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Concatenate OTP digits
  const otpString = otp.join("");

  // Debounce OTP string
  const debouncedOtp = useDebounce(otpString, 300);

  // Auto submit effect
  useEffect(() => {
    if (debouncedOtp.length === 6 && !isLoading) {
      onSubmit?.();
    }
  }, [debouncedOtp, isLoading, onSubmit]);

  // Lifecycle Management สำหรับตัวนับเวลา: โครงสร้างป้องกัน Memory Leak
  useEffect(() => {
    // ทำงานต่อเมื่อเวลายังไม่เป็นศูนย์
    if (countdown > 0) {
      const timerId = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      // Cleanup function: กลไกสำคัญในการรักษาความสมบูรณ์ของระบบ
      // จะถูกเรียกเมื่อ component unmount หรือเมื่อ countdown เปลี่ยนค่า
      // เพื่อหยุดการทำงานของ interval ป้องกัน memory leak
      return () => clearInterval(timerId);
    }
  }, [countdown]); // ทำงานใหม่ทุกครั้งที่ค่า countdown เปลี่ยนแปลง

  // ฟังก์ชันสำหรับจัดรูปแบบเวลาที่เหลือ
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <motion.div
      key="enter-otp"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full text-center"
    >
      <h1 className="text-3xl font-extrabold tracking-tight text-[#110e0c] sm:text-4xl md:text-5xl">ยืนยันตัวตน</h1>
      <p className="mx-auto mt-4 max-w-xl text-base text-[#78716c] md:text-lg">
        กรอกรหัส OTP 6 หลักที่ส่งไปยัง <span className="font-semibold text-orange-600">{phoneNumber}</span>
      </p>
      {/* แสดงผลรหัสอ้างอิง */}
      <p className="mt-2 text-sm text-slate-500">
        รหัสอ้างอิง (Ref): <span>REF666</span>
      </p>
      <form onSubmit={onSubmit} className="mx-auto mt-6 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
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
              // [Chiron] การผนึกสถานะ: ปิดช่องทางการแก้ไขข้อมูลระหว่างการส่งเพื่อรักษาความสมบูรณ์ของข้อมูล
              disabled={isLoading}
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

        <div className="mt-4 flex items-center justify-between">
          <Button type="button" variant="link" onClick={onBack} className="p-0 text-slate-500">
            เปลี่ยนเบอร์โทร
          </Button>

          {/* ส่วนควบคุมการส่งรหัสใหม่และตัวนับเวลา */}
          {countdown > 0 ? (
            <p className="text-sm text-slate-500">ส่งรหัสอีกครั้งใน {formatTime(countdown)}</p>
          ) : (
            <Button
              type="button"
              variant="link"
              onClick={() => {
                onResend();
                setCountdown(120); // รีเซ็ตตัวนับเวลาเมื่อกดส่งใหม่
              }}
              className="p-0 font-semibold text-orange-600"
              disabled={isLoading}
            >
              ส่งรหัส OTP อีกครั้ง
            </Button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default InputOTP;
