import React, { Fragment } from "react";
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
import { LoaderCircle } from "lucide-react";

type Variant = "confirm" | "warning" | "error" | "success";

export interface ConfirmCancelModalProps {
  assessmentId: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string; // optional custom title
  depositAmount?: string; // formatted string, e.g., "฿200"
  description?: string; // optional custom description
  onConfirm: () => Promise<void> | void;
  refetchAfterSuccess: () => Promise<void> | void;
  isLoading: boolean;
  isSuccess: boolean;
  confirmText?: string;
  cancelText?: string;
  variant?: Variant; // Add variant prop
}

/**
 * Modal สำหรับยืนยันการยกเลิกบริการ
 *
 * @param isOpen - สถานะเปิดปิด modal
 * @param setIsOpen - ฟังก์ชันสำหรับตั้งค่าสถานะเปิดปิด modal
 * @param title - หัวข้อ modal
 * @param onConfirm - ฟังก์ชันที่จะถูกเรียกเมื่อผู้ใช้ยืนยัน
 * @param description - คำอธิบายเพิ่มเติมใน modal
 * @param isLoading - สถานะการโหลดขณะดำเนินการ
 * @param isSuccess - สถานะการสำเร็จของการยกเลิก
 * @param confirmText - ข้อความปุ่มยืนยัน
 * @param cancelText - ข้อความปุ่มยกเลิก
 * @param variant - ประเภทของ modal (confirm, warning, error, success)
 *
 */
export default function ConfirmCancelModal({
  assessmentId,
  isOpen,
  setIsOpen,
  title = "ยืนยันการยกเลิกการจอง",
  description = "คุณต้องการยกเลิกการจองบริการนี้ใช่หรือไม่? การดำเนินการนี้อาจส่งผลต่อเงื่อนไขการใช้บริการในอนาคต",
  isLoading = false,
  isSuccess = false,
  cancelText = "ยกเลิก",
  confirmText = "ยืนยันการยกเลิก",
  onConfirm,
  refetchAfterSuccess,
  variant = "error",
}: ConfirmCancelModalProps) {
  const colorMap: Record<
    Variant,
    { bg: string; fg: string; iconBg: string; Icon: React.ComponentType<{ className?: string }> }
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

  const { fg, iconBg, Icon } = colorMap[variant];

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
          if (isSuccess) refetchAfterSuccess();
        }}
        className="w-full rounded-2xl bg-white shadow-lg"
      >
        <div className="flex flex-col gap-4 px-6 py-4 md:items-center">
          {/* Icon */}
          <div className={`flex items-center justify-center`}>
            <div className={`${iconBg} flex h-12 w-12 items-center justify-center rounded-full`}>
              <Icon className={`h-6 w-6 ${fg}`} />
            </div>
          </div>

          {/* Text section */}
          <div className="flex w-full flex-1 flex-col items-center text-center">
            <DialogHeader className="mb-2 p-0">
              <DialogTitle className="text-xl font-semibold md:text-lg">
                {isSuccess ? "ยกเลิกการจองสำเร็จ" : title}
              </DialogTitle>
            </DialogHeader>

            <DialogDescription className="mt-2 text-sm md:text-base">
              {isSuccess
                ? "การยกเลิกการจองของคุณเสร็จสมบูรณ์แล้ว ท่านสามารถกลับไปเลือกบริการอื่นๆได้"
                : description}
            </DialogDescription>
          </div>
        </div>

        {/* Button Section */}
        <div className="border-t border-gray-100 px-6 py-4">
          {/* Action Buttons */}
          <div className="flex flex-col justify-center gap-3 md:flex-row">
            {isSuccess ? (
              <Fragment>
                <FramerButton
                  variant="ghost"
                  onClick={() => window.location.replace(`${window.location.origin}`)}
                  disabled={isLoading}
                  className="order-2 h-12 w-full rounded-xl border-gray-200 bg-white text-gray-700 md:order-1 md:w-1/2"
                >
                  กลับสู่หน้าหลัก
                </FramerButton>
                <FramerButton
                  onClick={() =>
                    window.location.replace(`${window.location.origin}/details/${assessmentId}`)
                  }
                  disabled={isLoading}
                  className="order-2 h-12 w-full rounded-xl border-gray-200 bg-white text-gray-700 md:order-1 md:w-1/2"
                >
                  ไปยังหน้าจองบริการ
                </FramerButton>
              </Fragment>
            ) : (
              <Fragment key={"action-button"}>
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
                    <span className="flex items-center justify-center gap-2">{confirmText}</span>
                  )}
                </FramerButton>
              </Fragment>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
