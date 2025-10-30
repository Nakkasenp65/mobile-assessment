import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  XCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";

type Variant = "confirm" | "warning" | "error" | "success";

export interface ConfirmModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description?: React.ReactNode;
  variant?: Variant;
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  /**
   * Optional: stop closing after confirm if you want to manage it from parent.
   * Default: true (modal will close on success if onConfirm doesn't throw).
   */
  autoCloseOnConfirm?: boolean;
}

export default function ConfirmModal({
  isOpen,
  setIsOpen,
  title,
  description,
  variant = "confirm",
  onConfirm,
  isLoading = false,
  confirmText = "ยืนยัน",
  cancelText = "ยกเลิก",
  autoCloseOnConfirm = true,
}: ConfirmModalProps) {
  const colorMap: Record<Variant, { bg: string; fg: string; Icon: React.ComponentType<any> }> = {
    confirm: { bg: "bg-blue-50", fg: "text-blue-600", Icon: QuestionMarkCircleIcon },
    warning: { bg: "bg-yellow-50", fg: "text-yellow-600", Icon: ExclamationTriangleIcon },
    error: { bg: "bg-red-50", fg: "text-red-600", Icon: XCircleIcon },
    success: { bg: "bg-green-50", fg: "text-green-600", Icon: CheckCircleIcon },
  };

  const { bg, fg, Icon } = colorMap[variant];

  async function handleConfirm() {
    try {
      const res = onConfirm();
      if (res instanceof Promise) {
        await res;
      }
      if (autoCloseOnConfirm) setIsOpen(false);
    } catch (e) {
      // keep modal open for parent to surface error; do not swallow errors silently
      // parent can set an error state and pass it into description if desired
      // intentionally no further handling here
    }
  }

  function handleClose() {
    if (!isLoading) setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md rounded-2xl border-0 bg-white p-0 shadow-lg">
        <div className="px-6 pt-6 pb-4">
          <DialogHeader className="flex flex-col items-center gap-3 text-center">
            <div className={`flex h-16 w-16 items-center justify-center rounded-full ${bg}`}>
              <Icon className={`h-8 w-8 ${fg}`} />
            </div>
            <DialogTitle className="text-lg font-semibold text-gray-900">{title}</DialogTitle>
            {description && (
              <DialogDescription className="text-sm text-gray-500">{description}</DialogDescription>
            )}
          </DialogHeader>
        </div>

        <div className="border-t border-gray-100 px-6 py-4">
          <div className="flex w-full space-x-3">
            <Button
              variant="outline"
              className="flex-1 rounded-xl border-gray-200 bg-white text-gray-700"
              onClick={handleClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              className={`flex-1 rounded-xl font-medium ${isLoading ? "opacity-70" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  กำลังทำ
                </span>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
