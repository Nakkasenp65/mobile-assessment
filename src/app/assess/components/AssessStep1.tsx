"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { useMobile } from "@/hooks/useMobile";
import { DeviceInfo } from "../page";

// shadcn/ui select
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Box, Smartphone } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useDeviceDetection } from "../../../hooks/useDeviceDetection";
import FramerButton from "../../../components/ui/framer/FramerButton";

interface AssessStep1Props {
  deviceInfo: DeviceInfo;
  onDeviceUpdate: (info: DeviceInfo) => void;
  onNext: () => void;
  onUserDeviceUpdate: (value: boolean) => void;
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
      "Samsung S24 Ultra",
      "Samsung S24 Plus",
      "Samsung S24",
      "Samsung S23 Ultra",
    ],
    Google: ["Pixel 8 Pro", "Pixel 8", "Pixel 7 Pro", "Pixel 7"],
  } as Record<string, string[]>,
  storage: {
    "iPhone 15 Pro Max": ["128 GB", "256 GB", "512 GB", "1 TB"],
    "iPhone 15 Pro": ["128 GB", "256 GB", "512 GB", "1 TB"],
    "iPhone 15": ["128 GB", "256 GB", "512 GB"],
    "Samsung S24 Ultra": ["256 GB", "512 GB", "1 TB"],
    "Samsung S24 Plus": ["256 GB", "512 GB"],
    "Samsung S24": ["128 GB", "256 GB", "512 GB"],
    "Pixel 8 Pro": ["128 GB", "256 GB", "512 GB"],
    "Pixel 8": ["128 GB", "256 GB"],
  } as Record<string, string[]>,
};

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
  onUserDeviceUpdate,
}: AssessStep1Props) => {
  const [localInfo, setLocalInfo] = useState<DeviceInfo>(deviceInfo);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availableStorage, setAvailableStorage] = useState<string[]>([]);
  const { isDesktop } = useDeviceDetection();

  const { data: productData, isLoading: isImageLoading } = useMobile(
    localInfo.brand,
    localInfo.model,
  );

  const [userDeviceSelection, setUserDeviceSelection] = useState<
    "this_device" | "other_device" | null
  >(null);

  // === จำค่าเดิมเพื่อจับการเปลี่ยนจริง ๆ
  const prevBrandRef = useRef(localInfo.brand);
  const prevModelRef = useRef(localInfo.model);

  useEffect(() => {
    if (localInfo.brand !== prevBrandRef.current) {
      const nextModels = MOCK_DATA.models[localInfo.brand] ?? [];
      setAvailableModels(nextModels);

      setLocalInfo((prev) => ({
        ...prev,
        model: "",
        storage: "",
        batteryHealth:
          localInfo.brand === "Apple" ? prev.batteryHealth : undefined,
      }));

      if (nextModels.length === 1) {
        setLocalInfo((prev) => ({ ...prev, model: nextModels[0] }));
      }

      prevBrandRef.current = localInfo.brand;
    } else {
      setAvailableModels(MOCK_DATA.models[localInfo.brand] ?? []);
    }
  }, [localInfo.brand]);

  useEffect(() => {
    if (localInfo.model !== prevModelRef.current) {
      const nextStorage = MOCK_DATA.storage[localInfo.model] ?? [];
      setAvailableStorage(nextStorage);

      setLocalInfo((prev) => ({ ...prev, storage: "" }));

      if (nextStorage.length === 1) {
        setLocalInfo((prev) => ({ ...prev, storage: nextStorage[0] }));
      }

      prevModelRef.current = localInfo.model;
    } else {
      setAvailableStorage(MOCK_DATA.storage[localInfo.model] ?? []);
    }
  }, [localInfo.model]);

  useEffect(() => {
    onDeviceUpdate(localInfo);
  }, [localInfo, onDeviceUpdate]);

  const handleSelectChange = (field: keyof DeviceInfo, value: string) => {
    setLocalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleUserDeviceSelect = (
    selection: "this_device" | "other_device",
  ) => {
    setUserDeviceSelection(selection);
    onUserDeviceUpdate(selection === "this_device");
  };

  const isAppleDevice = localInfo.brand === "Apple";

  // === ตรวจความสอดคล้องกับลิสต์จริง
  const isValidBrand = MOCK_DATA.brands.includes(localInfo.brand);
  const isValidModel =
    isValidBrand && availableModels.includes(localInfo.model);
  const isValidStorage =
    isValidModel && availableStorage.includes(localInfo.storage);
  const isValidBattery = !isAppleDevice || !!localInfo.batteryHealth;
  const isUserDeviceOk = isDesktop || userDeviceSelection !== null;

  const isComplete =
    isValidBrand &&
    isValidModel &&
    isValidStorage &&
    isValidBattery &&
    isUserDeviceOk;

  return (
    <motion.div
      className="card-assessment mx-auto flex h-full max-w-2xl flex-col rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="mb-8 text-center">
        <h2 className="text-foreground mb-2 text-3xl font-bold">
          ระบุรุ่นมือถือของคุณ
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          เลือกยี่ห้อ รุ่น และความจุของเครื่องที่ต้องการประเมิน
        </p>
      </div>

      {!isDesktop && (
        <div className="mb-8 space-y-3">
          <label className="text-foreground block text-center text-lg font-semibold">
            คุณต้องการประเมินอุปกรณ์เครื่องใด?
          </label>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              onClick={() => handleUserDeviceSelect("this_device")}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all",
                userDeviceSelection === "this_device"
                  ? "border-primary bg-primary/10 ring-primary animate-pulse ring-2"
                  : "border-border bg-accent/50 hover:border-primary/50",
              )}
              role="button"
              aria-pressed={userDeviceSelection === "this_device"}
              whileTap={{ scale: 0.97 }}
            >
              <Smartphone className="text-primary h-8 w-8" />
              <span className="text-foreground font-medium">
                ประเมินเครื่องนี้
              </span>
            </motion.button>

            <motion.button
              onClick={() => handleUserDeviceSelect("other_device")}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all",
                userDeviceSelection === "other_device"
                  ? "border-secondary bg-secondary/10 ring-secondary animate-pulse ring-2"
                  : "border-border bg-accent/50 hover:border-secondary/50",
              )}
              role="button"
              aria-pressed={userDeviceSelection === "other_device"}
              whileTap={{ scale: 0.97 }}
            >
              <Box className={cn("text-secondary h-8 w-8")} />
              <span className="text-foreground font-medium">
                ประเมินเครื่องอื่น
              </span>
            </motion.button>
          </div>
        </div>
      )}

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
            <SelectTrigger className="border-border/50 h-14 w-full rounded-xl px-4 text-base focus:ring-orange-500">
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

        {/* Battery Health (เฉพาะ Apple) */}
        <AnimatePresence>
          {isAppleDevice && (
            <motion.div
              key="battery-health-field"
              className="overflow-hidden"
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

        {/* รูปตัวอย่างรุ่น (กัน layout jump ด้วย min-height) */}
        <div
          className="flex min-h-[3rem] items-center justify-center overflow-hidden rounded-xl transition-all duration-300"
          style={{ height: productData?.image_url ? "12rem" : "3rem" }}
        >
          <AnimatePresence mode="wait">
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
        <FramerButton
          onClick={onNext}
          disabled={!isComplete}
          size="lg"
          className="text-primary-foreground h-14 w-full transform-gpu rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-lg font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/30 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          ถัดไป
        </FramerButton>
      </div>
    </motion.div>
  );
};

export default AssessStep1;
