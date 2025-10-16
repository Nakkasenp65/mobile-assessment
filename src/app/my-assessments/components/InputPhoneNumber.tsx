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
  showTurnstileWarning, // Destructure showTurnstileWarning
  isDevEnv, // Destructure isDevEnv
}) => {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPhoneSubmit(phoneNumber);
  };

  return (
    <div className="flex h-max w-full max-w-xl items-center justify-center rounded-2xl bg-white p-8 shadow-xl">
      <div className="w-full">
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <div className="from-primary to-secondary relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br shadow-xl">
              <Phone className="h-8 w-8 text-white" />
            </div>
          </div>

          <h1 className="text-center text-2xl font-bold tracking-tight text-gray-900">ตรวจสอบรายการประเมินของคุณ</h1>

          <p className="text-center text-sm text-gray-600 md:text-lg">OK Mobile : บริษัท โอเค นัมเบอร์ วัน จำกัด</p>
        </div>

        <form onSubmit={onSubmit} className="mt-10 rounded-2xl border border-gray-300 bg-white p-8">
          <div className="flex flex-col gap-6">
            {showTurnstileWarning && (
              <p className="flex items-center justify-center gap-2 text-center font-semibold text-red-500">
                <AlertTriangle className="h-5 w-5" /> {/* Decorative icon */}
                กรุณาตรวจสอบ Cloudflare ก่อนดำเนินการต่อ
              </p>
            )}
            <div className="flex flex-col gap-2">
              <label className="text-base font-bold text-gray-700">เบอร์โทรศัพท์</label>
              <div className="relative">
                <Input
                  type="tel"
                  id="phoneNumber"
                  placeholder="กรอกเบอร์โทรศัพท์มือถือ"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => onPhoneNumberChange(e.target.value)}
                  className="focus:border-primary focus:ring-primary/15 h-12 w-full rounded-full border-2 border-slate-300 bg-white pr-5 pl-12 text-base shadow transition"
                  required
                />
                <span className="pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 text-slate-400">
                  <Phone className="h-5 w-5" />
                </span>
              </div>
            </div>
            <Button
              type="submit"
              className="from-primary to-secondary h-12 w-full rounded-full bg-gradient-to-r text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "กำลังค้นหา..." : "ค้นหารายการประเมิน"}
            </Button>
          </div>
        </form>
        {isDevEnv && (
          <div className="text-border mt-6 flex items-center justify-center gap-2 rounded-lg p-2 text-sm font-medium">
            <AlertTriangle className="h-4 w-4" />
            <span>DEV MODE: Verification Disabled</span>
          </div>
        )}
        <div className="mt-6 flex justify-center rounded-lg bg-white p-2 text-white">
          <Turnstile onVerify={onTurnstileVerify} language="th" /> {/* Moved outside form and added language */}
        </div>
      </div>
    </div>
  );
};

export default InputPhoneNumber;
