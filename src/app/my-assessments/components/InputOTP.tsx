import React, {
  FormEvent,
  KeyboardEvent,
  useRef,
  useEffect,
} from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InputOTPProps {
  phoneNumber: string;
  otp: string[];
  onOtpChange: (
    element: HTMLInputElement,
    index: number,
  ) => void;
  onOtpKeyDown: (
    e: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => void;
  onSubmit: (e: FormEvent) => void;
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
  // CHIRON: Ref array เป็นสถานะของ DOM ที่ผูกกับ Component นี้โดยตรง จึงควรถูกจัดการภายในนี้
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // CHIRON: ใช้ `useEffect` เพื่อจัดการ Side Effect (การ focus)
  // เมื่อ Component นี้ถูก render (ถูกสลับมาแสดง) ให้ focus ที่ input ช่องแรกทันที
  // นี่คือการออกแบบเชิงพฤติกรรมเพื่อชี้นำผู้ใช้
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

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
        <span className="font-semibold text-orange-600">
          {phoneNumber}
        </span>
      </p>
      <form
        onSubmit={onSubmit}
        className="mx-auto mt-8 w-full max-w-md"
      >
        <div className="flex justify-center gap-2 md:gap-3">
          {otp.map((data, index) => (
            <Input
              key={index}
              ref={(el) => {
                if (el) {
                  inputRefs.current[index] = el;
                }
              }}
              type="text"
              inputMode="numeric" // CHIRON: บอกให้ mobile device แสดง numeric keypad
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

        <Button
          type="button"
          variant="link"
          onClick={onBack}
          className="mt-4 text-slate-500"
        >
          เปลี่ยนเบอร์โทร
        </Button>
      </form>
    </motion.div>
  );
};

export default InputOTP;
