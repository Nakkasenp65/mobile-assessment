"use client";

import { Camera, Mic } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function PermissionPrompt({
  open,
  onAllow,
  onCancel,
  isRequesting,
  error,
}: {
  open: boolean;
  onAllow: () => void;
  onCancel: () => void;
  isRequesting?: boolean;
  error?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onCancel() : void 0)}>
      <DialogContent className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-2xl backdrop:blur-sm w-[calc(100%-2rem)] max-h-[85vh] overflow-y-auto sm:max-w-sm sm:p-8 md:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-slate-900">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
              <Camera className="h-4 w-4" />
            </span>
            <span className="text-xl font-semibold tracking-tight">อนุญาตกล้องและไมโครโฟน</span>
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-relaxed text-slate-600">
            เพื่อทำการประเมินอัตโนมัติอย่างถูกต้อง กรุณา{" "}
            <span className="font-semibold">อนุญาตการเข้าถึงกล้องและไมโครโฟน</span>{" "}
            เมื่อเบราว์เซอร์มีหน้าต่างขอสิทธิ์ขึ้นมา
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-slate-600">
          <Mic className="h-4 w-4 text-slate-400" />
          <p className="text-xs">
            คุณสามารถเปลี่ยนแปลงการอนุญาตได้ภายหลังในการตั้งค่าเบราว์เซอร์ของคุณ
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} className="h-11 rounded-xl px-5">
            ภายหลัง
          </Button>
          <Button onClick={onAllow} disabled={!!isRequesting} className="h-11 rounded-xl px-6">
            {isRequesting ? "กำลังขอสิทธิ์..." : "ตกลง"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
