import React, { FormEvent } from "react";
import { Phone, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InputPhoneNumberProps {
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
}

const InputPhoneNumber: React.FC<InputPhoneNumberProps> = ({
  phoneNumber,
  onPhoneNumberChange,
  onSubmit,
  isLoading,
}) => {
  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="from-primary to-secondary absolute -inset-1 rounded-full bg-gradient-to-r opacity-75 blur"></div>
            <div className="from-primary to-secondary relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br shadow-xl">
              <Phone className="h-8 w-8 text-white" />
            </div>
          </div>

          <h1 className="mt-8 text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            ตรวจสอบรายการประเมินของคุณ
          </h1>

          <p className="mt-3 text-center text-base text-gray-600 md:text-lg">
            OK Mobile : บริษัท โอเค นัมเบอร์ วัน จำกัด
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-10 rounded-2xl border border-gray-100 bg-white p-8 shadow-2xl shadow-blue-500/10"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                เบอร์โทรศัพท์
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="tel"
                  inputMode="numeric"
                  value={phoneNumber}
                  onChange={(e) =>
                    onPhoneNumberChange(e.target.value)
                  }
                  className="focus:border-primary focus:ring-primary/20 h-12 w-full rounded-lg border-gray-200 bg-gray-50 pr-4 pl-12 text-base transition-all focus:bg-white focus:ring-2"
                  placeholder="098-765-4321"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500">
                กรุณากรอกเบอร์โทรศัพท์ 10 หลัก
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="hover:shadow-primary/40 shadow-primary/30 h-12 w-full rounded-lg font-medium text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  กำลังค้นหา...
                </span>
              ) : (
                "ดำเนินการค้นหา"
              )}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          ข้อมูลของคุณได้รับการปกป้องและเข้ารหัสอย่างปลอดภัย
        </p>
      </div>
    </div>
  );
};

export default InputPhoneNumber;
