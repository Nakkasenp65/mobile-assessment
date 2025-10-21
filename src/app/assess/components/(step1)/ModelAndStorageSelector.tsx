// SECTION: src/app/assess/components/(step1)/ModelAndStorageSelector.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LockKeyhole } from "lucide-react";
import clsx from "clsx";
import { ConditionInfo, DeviceInfo } from "../../../../types/device";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ModelAndStorageSelectorProps {
  localInfo: DeviceInfo;
  availableModels: string[];
  availableStorage: string[];
  onSelectChange: (field: keyof DeviceInfo, value: string) => void;
  conditionInfo: ConditionInfo;
  onConditionUpdate: (updater: (prev: ConditionInfo) => ConditionInfo) => void;
}

const ModelAndStorageSelector = ({
  localInfo,
  availableModels,
  availableStorage,
  onSelectChange,
  conditionInfo,
  onConditionUpdate,
}: ModelAndStorageSelectorProps) => {
  const handleIcloudToggle = () => {
    onConditionUpdate((prev) => ({
      ...prev,
      canUnlockIcloud: !prev.canUnlockIcloud,
    }));
  };

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      {/* Model Selection */}
      <div className="grid w-full gap-2">
        <Label htmlFor="model-select" className="text-foreground text-base font-semibold">
          รุ่น <span className="text-red-500">*</span>
        </Label>
        <Select
          value={localInfo.model || ""}
          onValueChange={(value) => onSelectChange("model", value)}
          disabled={!localInfo.brand || !availableModels.length}
        >
          <SelectTrigger id="model-select" className="h-14 w-full rounded-xl text-base">
            <SelectValue placeholder="เลือกรุ่น" />
          </SelectTrigger>
          <SelectContent>
            {availableModels.length > 0 ? (
              availableModels.map((model) => (
                <SelectItem key={model} value={model} className="cursor-pointer py-2 text-base">
                  {model}
                </SelectItem>
              ))
            ) : (
              <p className="text-muted-foreground px-4 py-2 text-sm">ไม่พบรุ่นสำหรับยี่ห้อนี้</p>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Storage Selection */}
      <div className="grid w-full gap-2">
        <Label htmlFor="storage-select" className="text-foreground text-base font-semibold">
          ความจุ <span className="text-red-500">*</span>
        </Label>
        <Select
          value={localInfo.storage || ""}
          onValueChange={(value) => onSelectChange("storage", value)}
          disabled={!localInfo.model || !availableStorage.length}
        >
          <SelectTrigger id="storage-select" className="h-14 w-full rounded-xl text-base">
            <SelectValue placeholder="เลือกความจุ" />
          </SelectTrigger>
          <SelectContent>
            {availableStorage.length > 0 ? (
              availableStorage.map((storage) => (
                <SelectItem key={storage} value={storage} className="cursor-pointer py-2 text-base">
                  {storage}
                </SelectItem>
              ))
            ) : (
              <p className="text-muted-foreground px-4 py-2 text-sm">ไม่พบความจุสำหรับรุ่นนี้</p>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* ✨ [เพิ่ม] ส่วนของคำถาม iCloud */}
      <AnimatePresence>
        {localInfo.brand === "Apple" && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{
              opacity: 1,
              height: "auto",
              y: 0,
            }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <label
                htmlFor="icloud-toggle"
                className="flex cursor-pointer items-center gap-3 text-sm font-medium text-gray-700 select-none lg:text-base"
              >
                <LockKeyhole className="h-5 w-5 text-gray-500" />
                สามารถปลดล็อก iCloud ได้
              </label>
              <button
                type="button"
                id="icloud-toggle"
                role="switch"
                aria-checked={conditionInfo.canUnlockIcloud}
                onClick={handleIcloudToggle}
                className={clsx(
                  "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:outline-none",
                  {
                    "bg-pink-500": conditionInfo.canUnlockIcloud,
                    "bg-gray-200": !conditionInfo.canUnlockIcloud,
                  },
                )}
              >
                <motion.span
                  aria-hidden="true"
                  layout
                  transition={{
                    type: "spring",
                    stiffness: 700,
                    damping: 30,
                  }}
                  className={clsx(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    {
                      "translate-x-5": conditionInfo.canUnlockIcloud,
                      "translate-x-0": !conditionInfo.canUnlockIcloud,
                    },
                  )}
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ✨ [เพิ่ม] ข้อความแจ้งเรื่องข้อตกลงและเงื่อนไข */}
      <p className="mt-4 text-center text-xs text-gray-500">
        เมื่อเริ่มประเมินถือว่าท่านได้ยอมรับ{" "}
        <a
          href="https://pdpa.no1.mobi/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-600 underline hover:text-pink-700"
        >
          ข้อตกลงและเงื่อนไข
        </a>{" "}
        การใช้บริการ
      </p>
    </div>
  );
};

export default ModelAndStorageSelector;
