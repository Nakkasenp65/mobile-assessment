// src/app/assess/components/(step1)/ModelAndStorageSelector.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DeviceInfo } from "../../../../types/device";

interface ModelAndStorageSelectorProps {
  localInfo: DeviceInfo;
  availableModels: string[];
  availableStorage: string[];
  onSelectChange: (field: keyof DeviceInfo, value: string) => void;
}

export default function ModelAndStorageSelector({
  localInfo,
  availableModels,
  availableStorage,
  onSelectChange,
}: ModelAndStorageSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-foreground mb-2 ml-1 block text-sm font-medium">รุ่น *</label>
        <Select onValueChange={(v) => onSelectChange("model", v)} value={localInfo.model}>
          <SelectTrigger
            className={cn("border-border bg-card h-14 w-full rounded-xl px-4 text-base focus:ring-orange-500")}
          >
            <SelectValue placeholder="เลือกรุ่น" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>รุ่น</SelectLabel>
              {availableModels.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-foreground mb-2 ml-1 block text-sm font-medium">ความจุ *</label>
        <Select
          onValueChange={(v) => onSelectChange("storage", v)}
          value={localInfo.storage}
          disabled={!localInfo.model}
        >
          <SelectTrigger
            className={cn("border-border bg-card h-14 w-full rounded-xl px-4 text-base focus:ring-orange-500")}
          >
            <SelectValue placeholder="เลือกความจุ" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>ความจุ</SelectLabel>
              {availableStorage.map((storage) => (
                <SelectItem key={storage} value={storage}>
                  {storage}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
