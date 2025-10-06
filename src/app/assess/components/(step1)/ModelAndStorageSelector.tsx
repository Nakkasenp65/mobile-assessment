// src/app/assess/components/(step1)/ModelAndStorageSelector.tsx
"use client";

import { DeviceInfo } from "../../../../types/device";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ModelAndStorageSelectorProps {
  localInfo: DeviceInfo;
  availableModels: string[];
  availableStorage: string[];
  onSelectChange: (field: keyof DeviceInfo, value: string) => void;
}

const ModelAndStorageSelector = ({
  localInfo,
  availableModels,
  availableStorage,
  onSelectChange,
}: ModelAndStorageSelectorProps) => {
  return (
    // ✨ [แก้ไข] จำกัดความกว้างและจัดกึ่งกลาง
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
    </div>
  );
};

export default ModelAndStorageSelector;
