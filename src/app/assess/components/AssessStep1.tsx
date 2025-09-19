"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { useMobile } from "@/hooks/useMobile";
import { DeviceInfo } from "../page"; // ตรวจสอบให้แน่ใจว่า DeviceInfo ใน page.tsx ถูกอัปเดตแล้ว

// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssessStep1Props {
  deviceInfo: DeviceInfo;
  onDeviceUpdate: (info: DeviceInfo) => void;
  onNext: () => void;
}

const MOCK_DATA = {
  brands: ["Apple", "Samsung", "Google"],
  models: {
    Apple: [
      "iPhone 15 Pro Max",
      "iPhone 15 Pro",
      "iPhone 15",
      "iPhone 14 Pro Max",
      "iPhone 14 Pro",
    ],
    Samsung: [
      "Galaxy S24 Ultra",
      "Galaxy S24+",
      "Galaxy S24",
      "Galaxy S23 Ultra",
    ],
    Google: ["Pixel 8 Pro", "Pixel 8", "Pixel 7 Pro", "Pixel 7"],
  } as Record<string, string[]>,
  storage: {
    "iPhone 15 Pro Max": ["128 GB", "256 GB", "512 GB", "1 TB"],
    "iPhone 15 Pro": ["128 GB", "256 GB", "512 GB", "1 TB"],
    "iPhone 15": ["128 GB", "256 GB", "512 GB"],
    "Galaxy S24 Ultra": ["256 GB", "512 GB", "1 TB"],
    "Galaxy S24+": ["256 GB", "512 GB"],
    "Galaxy S24": ["128 GB", "256 GB", "512 GB"],
    "Pixel 8 Pro": ["128 GB", "256 GB", "512 GB"],
    "Pixel 8": ["128 GB", "256 GB"],
  } as Record<string, string[]>,
};

// [FIX] Add Mock Data for Battery Health
const BATTERY_HEALTH_OPTIONS = [
  "100%",
  "95% - 99%",
  "90% - 94%",
  "85% - 89%",
  "ต่ำกว่า 85%",
  "เปลี่ยนแบตเตอรี่",
];

const AssessStep1 = ({
  deviceInfo,
  onDeviceUpdate,
  onNext,
}: AssessStep1Props) => {
  const [localInfo, setLocalInfo] = useState<DeviceInfo>(deviceInfo);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availableStorage, setAvailableStorage] = useState<string[]>([]);
  const { data: productData, isLoading: isImageLoading } = useMobile(
    localInfo.brand,
    localInfo.model,
  );

  // [FIX] Updated useEffect for brand changes
  useEffect(() => {
    if (localInfo.brand && MOCK_DATA.models[localInfo.brand]) {
      setAvailableModels(MOCK_DATA.models[localInfo.brand]);
      if (localInfo.brand !== deviceInfo.brand) {
        // Clear subsequent fields when brand changes
        setLocalInfo((prev) => ({
          ...prev,
          model: "",
          storage: "",
          batteryHealth: undefined,
        }));
      }
      // Clear battery health if the selected brand is not Apple
      if (localInfo.brand !== "Apple") {
        setLocalInfo((prev) => ({ ...prev, batteryHealth: undefined }));
      }
    } else {
      setAvailableModels([]);
    }
  }, [localInfo.brand, deviceInfo.brand]);

  useEffect(() => {
    if (localInfo.model && MOCK_DATA.storage[localInfo.model]) {
      setAvailableStorage(MOCK_DATA.storage[localInfo.model]);
      if (localInfo.model !== deviceInfo.model) {
        setLocalInfo((prev) => ({ ...prev, storage: "" }));
      }
    } else {
      setAvailableStorage([]);
    }
  }, [localInfo.model, deviceInfo.model]);

  useEffect(() => {
    onDeviceUpdate(localInfo);
  }, [localInfo, onDeviceUpdate]);

  const handleSelectChange = (field: keyof DeviceInfo, value: string) => {
    setLocalInfo((prev) => ({ ...prev, [field]: value }));
  };

  // [FIX] Updated logic for completion check
  const isAppleDevice = localInfo.brand === "Apple";
  const isComplete = isAppleDevice
    ? !!(
        localInfo.brand &&
        localInfo.model &&
        localInfo.storage &&
        localInfo.batteryHealth
      )
    : !!(localInfo.brand && localInfo.model && localInfo.storage);

  return (
    <motion.div
      className="card-assessment flex h-full flex-col rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="mb-8 text-center">
        <h2 className="text-foreground mb-2 text-3xl font-bold">
          ระบุรุ่นมือถือของคุณ
        </h2>
        <p className="text-muted-foreground text-base">
          เลือกยี่ห้อ รุ่น และความจุของเครื่องที่ต้องการประเมิน
        </p>
      </div>

      <div className="flex-grow space-y-6">
        {/* Brand Selection */}
        <div>
          <label className="text-foreground mb-2 ml-1 block text-sm font-medium">
            ยี่ห้อ *
          </label>
          <Select
            onValueChange={(value) => handleSelectChange("brand", value)}
            value={localInfo.brand}
          >
            <SelectTrigger className="border-border/50 h-14 w-full rounded-xl px-4 text-base focus:ring-orange-500">
              <SelectValue placeholder="เลือกยี่ห้อ" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>ยี่ห้อ</SelectLabel>
                {MOCK_DATA.brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Model Selection */}
        <div>
          <label className="text-foreground mb-2 ml-1 block text-sm font-medium">
            รุ่น *
          </label>
          <Select
            onValueChange={(value) => handleSelectChange("model", value)}
            value={localInfo.model}
            disabled={!localInfo.brand}
          >
            <SelectTrigger className="border-border/50 h-14 w-full rounded-xl px-4 text-base focus:ring-orange-500">
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

        {/* Storage Selection */}
        <div>
          <label className="text-foreground mb-2 ml-1 block text-sm font-medium">
            ความจุ *
          </label>
          <Select
            onValueChange={(value) => handleSelectChange("storage", value)}
            value={localInfo.storage}
            disabled={!localInfo.model}
          >
            <SelectTrigger className="border-border/50 h-14 w-full rounded-xl p-4 text-base focus:ring-orange-500">
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

        {/* [FIX] Conditional Battery Health Field */}
        <AnimatePresence>
          {isAppleDevice && (
            <motion.div
              key="battery-health-field"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: "1.5rem" }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div>
                <label className="text-foreground mb-2 ml-1 block text-sm font-medium">
                  สุขภาพแบตเตอรี่ *
                </label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("batteryHealth", value)
                  }
                  value={localInfo.batteryHealth || ""}
                  disabled={!isAppleDevice}
                >
                  <SelectTrigger className="border-border/50 h-14 w-full rounded-xl px-4 text-base focus:ring-orange-500">
                    <SelectValue placeholder="เลือกเปอร์เซ็นต์แบตเตอรี่" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>สุขภาพแบตเตอรี่</SelectLabel>
                      {BATTERY_HEALTH_OPTIONS.map((health) => (
                        <SelectItem key={health} value={health}>
                          {health}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className="bg-card-foreground/5 flex items-center justify-center overflow-hidden rounded-xl transition-all duration-300"
          style={{ height: productData?.image_url ? "12rem" : "0" }}
        >
          <AnimatePresence mode="wait">
            {isImageLoading && (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-muted-foreground"
              >
                กำลังโหลดรูปภาพ...
              </motion.div>
            )}
            {!isImageLoading && productData?.image_url && (
              <motion.div
                key="image"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  width={160}
                  height={160}
                  src={productData.image_url}
                  alt={`${localInfo.brand} ${localInfo.model}`}
                  className="object-contain"
                  priority
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={onNext}
          disabled={!isComplete}
          size="lg"
          className="text-primary-foreground h-14 w-full transform-gpu rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-lg font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/30 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          ถัดไป
        </Button>
      </div>
    </motion.div>
  );
};

export default AssessStep1;
