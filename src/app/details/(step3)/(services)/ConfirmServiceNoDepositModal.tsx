import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  XCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";
import FramerButton from "../../../../components/ui/framer/FramerButton";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Loading from "../../../../components/ui/Loading";
import { LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";
import WebMIcon from "../../../../components/ui/WebMIcon";

type Variant = "confirm" | "warning" | "error" | "success";

export interface ConfirmServiceNoDepositModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  depositAmount?: string; // formatted string, e.g., "฿200"
  description?: string; // optional custom description
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  autoCloseOnConfirm?: boolean;
}

/**
 * Modal สำหรับยืนยันการจองบริการโดยไม่มีการชำระเงินมัดจำ
 *
 * @param isOpen - สถานะเปิดปิด modal
 * @param setIsOpen - ฟังก์ชันสำหรับตั้งค่าสถานะเปิดปิด modal
 * @param title - หัวข้อ modal
 * @param onConfirm - ฟังก์ชันที่จะถูกเรียกเมื่อผู้ใช้ยืนยัน
 * @param description - คำอธิบายเพิ่มเติมใน modal
 * @param isLoading - สถานะการโหลดขณะดำเนินการ
 * @param cancelText - ข้อความปุ่มยกเลิก
 *
 */
export default function ConfirmServiceNoDepositModal({
  isOpen,
  setIsOpen,
  title,
  onConfirm,
  description,
  isLoading = false,
  cancelText = "ยกเลิก",
  autoCloseOnConfirm = true,
}: ConfirmServiceNoDepositModalProps) {
  const colorMap: Record<
    Variant,
    { bg: string; fg: string; iconBg: string; Icon: React.ComponentType<any> }
  > = {
    confirm: {
      bg: "bg-blue-50",
      fg: "text-blue-700",
      iconBg: "bg-blue-100",
      Icon: QuestionMarkCircleIcon,
    },
    warning: {
      bg: "bg-yellow-50",
      fg: "text-yellow-700",
      iconBg: "bg-yellow-100",
      Icon: ExclamationTriangleIcon,
    },
    error: { bg: "bg-red-50", fg: "text-red-700", iconBg: "bg-red-100", Icon: XCircleIcon },
    success: {
      bg: "bg-green-50",
      fg: "text-green-700",
      iconBg: "bg-green-100",
      Icon: CheckCircleIcon,
    },
  };

  async function handleConfirm() {
    try {
      const res = onConfirm();
      if (res instanceof Promise) await res;
      // if (autoCloseOnConfirm) setIsOpen(false);
    } catch {
      // keep modal open so parent can surface errors
    }
  }

  function handleClose() {
    if (!isLoading) setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(e) => {
          // ป้องกันการปิดจากปุ่ม ESC
          if (isLoading) e.preventDefault();
        }}
        onInteractOutside={(e) => {
          // ป้องกันการปิดเมื่อคลิกนอก dialog
          if (isLoading) e.preventDefault();
        }}
        className="w-full max-w-lg rounded-2xl bg-white p-0 shadow-lg"
      >
        <div className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:gap-6">
          {/* Icon */}
          <div className={`-m-2 flex flex-2 items-center justify-center md:-m-24`}>
            <WebMIcon src="/assets/wallet-with-coins.gif" />
          </div>
          {/* Text section */}
          <div className="flex min-w-0 flex-1 flex-col">
            <DialogHeader className="mb-2 p-0">
              <DialogTitle className="text-xl font-semibold text-gray-900 md:text-lg">
                {title}
              </DialogTitle>
            </DialogHeader>

            <DialogDescription className="text-bold mt-2 text-sm md:text-base">
              {description}
            </DialogDescription>

            <div className="mt-4 flex items-center gap-3">
              <div
                className={`flex gap-6 rounded-lg border border-green-600 bg-white px-3 py-2 text-sm font-medium text-green-700`}
              >
                <div className="text-center">
                  หลังจองรายการท่านสามารถติดต่อเจ้าหน้าที่เพื่อสอบถามข้อมูลเพิ่มเติมได้ทันทีผ่านช่องทางที่ระบุไว้
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Button Section */}
        <div className="border-t border-gray-100 px-6 py-4">
          {/* Action Buttons */}
          <div className="flex flex-col gap-3 md:flex-row">
            <FramerButton
              variant="ghost"
              onClick={handleClose}
              disabled={isLoading}
              className="order-2 h-12 w-full rounded-xl border-gray-200 bg-white text-gray-700 md:order-1 md:w-1/2"
            >
              {cancelText}
            </FramerButton>

            <FramerButton
              onClick={handleConfirm}
              disabled={isLoading}
              className="shadow-primary/30 hover:shadow-secondary/30 order-1 h-12 w-full transform-gpu rounded-xl px-8 text-lg font-bold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl md:order-2 md:w-1/2"
              aria-disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  กำลังดำเนินการ{" "}
                  <LoaderCircle className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">ยืนยันการจองบริการ</span>
              )}
            </FramerButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
