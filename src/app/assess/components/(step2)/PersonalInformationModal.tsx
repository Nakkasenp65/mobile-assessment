import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import FramerButton from "../../../../components/ui/framer/FramerButton";
import { Label } from "../../../../components/ui/label";
import WebMIcon from "../../../../components/ui/WebMIcon";

interface PersonalInformationModalProps {
  isSubmitting?: boolean;
  serverError?: string;
  isPhoneModalOpen: boolean;
  setIsPhoneModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: (phoneNumber: string, customerName: string) => void;
}

/**
 * PersonalInformationModal component
 *
 * @param isSubmitting - State to indicate if the form is being submitted
 * @param serverError - Error message from the server
 * @param isPhoneModalOpen - State to control modal visibility
 * @param setIsPhoneModalOpen - Function to close the modal
 * @param onConfirm - Callback when confirming the information
 * @description Modal for collecting personal information
 *
 * @returns JSX.Element
 */

export default function PersonalInformationModal({
  isPhoneModalOpen,
  isSubmitting,
  serverError,
  onConfirm,
  setIsPhoneModalOpen,
}: PersonalInformationModalProps) {
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState("");
  const [fullnameInput, setFullnameInput] = useState("");
  const sanitized = phoneInput.replace(/\D/g, "").slice(0, 10);
  const isValidPhone = /^\d{10}$/.test(sanitized);

  useEffect(() => {
    setPhoneError(null);
  }, []);

  function closePhoneModal() {
    setIsPhoneModalOpen(false);
  }

  function handleConfirmClick() {
    if (!isValidPhone) {
      setPhoneError("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)");
      return;
    }
    setPhoneError(null);
    onConfirm(sanitized, fullnameInput);
  }

  return (
    <Dialog open={isPhoneModalOpen} onOpenChange={setIsPhoneModalOpen}>
      <DialogContent className="overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:max-w-md">
        {/* Apple-style header */}
        <div className="px-8 pt-8 pb-6">
          <DialogHeader className="flex w-full flex-col items-center justify-center gap-2 text-center text-black">
            <WebMIcon src={"/assets/incoming-call.gif"} delay={2} />
            <DialogTitle className="text-2xl font-semibold tracking-tight text-black">
              ยืนยันการประเมิน
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-black">
              <b>เบอร์โทรศัพท์</b> ของท่านจะถูกใช้ในการค้นหาการประเมิน
              กรุณากรอกเบอร์โทรศัพท์ปัจจุบันเพื่อ{" "}
              <b className="text-red-500">ป้องกันข้อมูลสูญหาย</b>
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Input section */}
        <div className="px-8 pb-2">
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              {/* Fullname input */}
              <div className="flex w-full flex-col gap-1">
                <Label className="block text-sm font-medium">
                  ชื่อ - นามสกุล <span className="text-red-300">*</span>
                </Label>
                <Input
                  type="text"
                  value={fullnameInput}
                  onChange={(e) => setFullnameInput(e.target.value)}
                  className="border-border h-12 w-full rounded-2xl border px-4 text-base transition-all duration-300 placeholder:text-stone-300"
                  placeholder="กรุณากรอกชื่อและนามสกุล"
                  disabled={isSubmitting}
                />
              </div>

              {/* Phone number input */}
              <div className="flex w-full flex-col gap-1">
                <Label className="block text-sm font-medium">
                  เบอร์โทรศัพท์ <span className="text-red-300">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type="tel"
                    inputMode="numeric"
                    value={sanitized ? sanitized : phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="border-border h-12 w-full rounded-2xl border px-4 text-base transition-all duration-300 placeholder:text-stone-300"
                    placeholder="089-xxx-xxxx"
                    maxLength={10}
                    disabled={isSubmitting}
                  />
                  {/* Subtle validation indicator */}
                  {sanitized.length > 0 && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      {isValidPhone ? (
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                      ) : (
                        <div className="flex space-x-1">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 w-1 rounded-full ${i < sanitized.length ? "bg-blue-500" : "bg-gray-200"}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Clean error display */}
            {(phoneError || serverError) && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-center">
                <p className="text-sm text-red-600">{phoneError || serverError}</p>
              </div>
            )}
          </div>
        </div>

        {/* Apple-style button section */}
        <div className="border-t border-gray-100 px-8 py-6">
          <div className="flex space-x-3">
            <FramerButton
              variant="outline"
              onClick={closePhoneModal}
              className="h-12 flex-1 rounded-2xl border-gray-200 bg-white font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:ring-offset-0"
              disabled={isSubmitting}
            >
              ยกเลิก
            </FramerButton>
            <FramerButton
              onClick={handleConfirmClick}
              className={`h-12 flex-1 rounded-2xl font-medium transition-all focus:ring-2 focus:ring-offset-0 ${
                isValidPhone && !isSubmitting
                  ? "focus:ring-primary-500/50"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
              }`}
              disabled={!isValidPhone || isSubmitting}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-3">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  กำลังบันทึก
                </span>
              ) : (
                "บันทึกรายการ"
              )}
            </FramerButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
