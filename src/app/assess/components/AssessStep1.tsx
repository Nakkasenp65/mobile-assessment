"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMobile } from "@/hooks/useMobile";
import { DeviceInfo, ConditionInfo } from "../page";
import { PHONE_DATA } from "../../../util/phone";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Box, Smartphone } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useDeviceDetection } from "../../../hooks/useDeviceDetection";
import FramerButton from "../../../components/ui/framer/FramerButton";
import Image from "next/image";

interface AssessStep1Props {
  deviceInfo: DeviceInfo;
  onDeviceUpdate: (info: DeviceInfo) => void;
  onConditionUpdate: (info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo)) => void;
  onNext: () => void;
  onUserDeviceUpdate: (value: boolean) => void;
}

const AssessStep1 = ({
  deviceInfo,
  onDeviceUpdate,
  onConditionUpdate,
  onNext,
  onUserDeviceUpdate,
}: AssessStep1Props) => {
  // --- Section: State Management ---
  const [localInfo, setLocalInfo] = useState<DeviceInfo>(deviceInfo);
  const { isDesktop } = useDeviceDetection();

  // Track if user has selected a brand (for auto-collapse)
  const [hasSelectedBrand, setHasSelectedBrand] = useState(false);
  // Track if user manually opened accordion after first selection
  const [isManuallyOpened, setIsManuallyOpened] = useState(false);

  const [availableModels, setAvailableModels] = useState<string[]>(() => {
    if (deviceInfo.brand) return PHONE_DATA.models[deviceInfo.brand] ?? [];
    return [];
  });

  const [availableStorage, setAvailableStorage] = useState<string[]>(() => {
    if (deviceInfo.model) return PHONE_DATA.storage[deviceInfo.model] ?? [];
    return [];
  });

  const { data: productData, isLoading: isImageLoading } = useMobile(
    localInfo.brand,
    localInfo.model,
  );

  const [userDeviceSelection, setUserDeviceSelection] = useState<
    "this_device" | "other_device" | null
  >(isDesktop ? "other_device" : "this_device");

  const prevBrandRef = useRef(localInfo.brand);
  const prevModelRef = useRef(localInfo.model);

  // Control accordion open/close state
  const [accordionValue, setAccordionValue] = useState<string>("brand-selector");

  // --- Section: Lifecycle & Effects ---
  useEffect(() => {
    if (localInfo.brand && localInfo.brand !== prevBrandRef.current) {
      const nextModels = PHONE_DATA.models[localInfo.brand] ?? [];
      setAvailableModels(nextModels);
      setLocalInfo((prev) => ({
        ...prev,
        model: "",
        storage: "",
      }));
      if (localInfo.brand !== "Apple") {
        onConditionUpdate((prev) => ({ ...prev, batteryHealth: "" }));
      }
      if (nextModels.length === 1) {
        setLocalInfo((prev) => ({ ...prev, model: nextModels[0] }));
      }
      prevBrandRef.current = localInfo.brand;
    }
  }, [localInfo.brand, onConditionUpdate]);

  useEffect(() => {
    if (localInfo.model && localInfo.model !== prevModelRef.current) {
      const nextStorage = PHONE_DATA.storage[localInfo.model] ?? [];
      setAvailableStorage(nextStorage);
      setLocalInfo((prev) => ({ ...prev, storage: "" }));
      if (nextStorage.length === 1) {
        setLocalInfo((prev) => ({ ...prev, storage: nextStorage[0] }));
      }
      prevModelRef.current = localInfo.model;
    }
  }, [localInfo.model]);

  useEffect(() => {
    onDeviceUpdate(localInfo);
  }, [localInfo, onDeviceUpdate]);

  // --- Section: Event Handlers ---
  const handleBrandChange = (brandId: string) => {
    setLocalInfo((prev) => ({ ...prev, brand: brandId }));

    // Close accordion only on first selection and if not manually opened
    if (!hasSelectedBrand && !isManuallyOpened) {
      setAccordionValue("");
      setHasSelectedBrand(true);
    }
  };

  const handleAccordionChange = (value: string) => {
    setAccordionValue(value);

    // If user opens accordion after first selection, mark as manually opened
    if (hasSelectedBrand && value === "brand-selector") {
      setIsManuallyOpened(true);
    }
  };

  const handleSelectChange = (field: keyof DeviceInfo, value: string) => {
    setLocalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleUserDeviceSelect = (selection: "this_device" | "other_device") => {
    setUserDeviceSelection(selection);
    onUserDeviceUpdate(selection === "this_device");
  };

  const allBrands = PHONE_DATA.brands.map((b) => b.id);
  const isValidBrand = allBrands.includes(localInfo.brand);
  const isValidModel = isValidBrand && availableModels.includes(localInfo.model);
  const isValidStorage = isValidModel && availableStorage.includes(localInfo.storage);
  const isUserDeviceOk = isDesktop || userDeviceSelection !== null;
  const isComplete = isValidBrand && isValidModel && isValidStorage && isUserDeviceOk;

  return (
    <motion.div
      className="mx-auto flex h-full max-w-2xl flex-col gap-8 rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* --- Section: Page Header --- */}
      <div className="text-center">
        <h2 className="text-foreground mb-2 text-3xl font-bold">ระบุรุ่นมือถือของคุณ</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          เลือกยี่ห้อ รุ่น และความจุของเครื่องที่ต้องการประเมิน
        </p>
      </div>

      {/* --- Section: User Device Selection (Mobile Only) --- */}
      {!isDesktop && (
        <div className="space-y-3">
          <label className="text-foreground block text-center text-lg font-semibold">
            คุณต้องการประเมินอุปกรณ์เครื่องใด?
          </label>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              onClick={() => handleUserDeviceSelect("this_device")}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all",
                userDeviceSelection === "this_device"
                  ? "border-primary bg-primary/10 ring-primary ring-2"
                  : "border-border bg-accent/50 hover:border-primary/50",
              )}
              whileTap={{ scale: 0.97 }}
            >
              <Smartphone className="text-primary h-8 w-8" />
              <span className="text-foreground font-medium">ประเมินเครื่องนี้</span>
            </motion.button>
            <motion.button
              onClick={() => handleUserDeviceSelect("other_device")}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all",
                userDeviceSelection === "other_device"
                  ? "border-secondary bg-secondary/10 ring-secondary ring-2"
                  : "border-border bg-accent/50 hover:border-secondary/50",
              )}
              whileTap={{ scale: 0.97 }}
            >
              <Box className={cn("text-secondary h-8 w-8")} />
              <span className="text-foreground font-medium">ประเมินเครื่องอื่น</span>
            </motion.button>
          </div>
        </div>
      )}

      {/* --- Section: Main Device Selection Form --- */}
      <div className="flex-grow space-y-6">
        {/* --- Sub-section: Brand Selection (Accordion) --- */}
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={accordionValue}
          onValueChange={handleAccordionChange}
        >
          <AccordionItem value="brand-selector" className="border-none p-2">
            <AccordionTrigger className="hover:no-underline">
              <span className="text-foreground font-semibold">
                {localInfo.brand ? `แบรนด์ที่เลือก: ${localInfo.brand}` : "เลือกแบรนด์"}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-3 gap-3 p-2 sm:grid-cols-4">
                {PHONE_DATA.brands.map((brand) => {
                  const isSelected = localInfo.brand === brand.id;
                  return (
                    <button
                      key={brand.id}
                      onClick={() => handleBrandChange(brand.id)}
                      className={cn(
                        "flex h-28 flex-col items-center justify-center gap-3 rounded-2xl border p-4 transition-all duration-200",
                        isSelected
                          ? "border-secondary bg-secondary/10 ring-secondary ring-2"
                          : "hover:border-primary/50",
                      )}
                    >
                      <div className="flex h-8 w-8 items-center justify-center">
                        <img
                          src={brand.logo}
                          alt={`${brand.name} logo`}
                          width="32"
                          height="32"
                          className={cn(
                            "h-auto max-h-8 w-auto max-w-8 object-contain",
                            !isSelected && "grayscale",
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          isSelected ? "text-secondary" : "text-muted-foreground",
                        )}
                      >
                        {brand.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* --- Sub-section: Model & Storage Selection --- */}
        <AnimatePresence>
          {localInfo.brand && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6 overflow-hidden p-2"
            >
              <div className="">
                <label className="text-foreground mb-2 ml-1 block text-sm font-medium">
                  รุ่น *
                </label>
                <Select
                  onValueChange={(v) => handleSelectChange("model", v)}
                  value={localInfo.model}
                >
                  <SelectTrigger
                    className={cn(
                      "border-border bg-card h-14 w-full rounded-xl px-4 text-base focus:ring-orange-500",
                    )}
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
                <label className="text-foreground mb-2 ml-1 block text-sm font-medium">
                  ความจุ *
                </label>
                <Select
                  onValueChange={(v) => handleSelectChange("storage", v)}
                  value={localInfo.storage}
                  disabled={!localInfo.model}
                >
                  <SelectTrigger
                    className={cn(
                      "border-border bg-card h-14 w-full rounded-xl px-4 text-base focus:ring-orange-500",
                    )}
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Section: Image Preview --- */}
        <div
          className="flex min-h-[3rem] items-center justify-center overflow-hidden rounded-xl transition-all duration-300"
          style={{ height: isImageLoading || productData?.image_url ? "12rem" : "3rem" }}
        >
          <AnimatePresence mode="wait">
            {isImageLoading && (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="border-t-primary h-8 w-8 animate-spin rounded-full border-4 border-slate-200" />
              </motion.div>
            )}
            {!isImageLoading && productData?.image_url && (
              <motion.div
                key="image"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Image
                  width="160"
                  height="160"
                  src={productData.image_url}
                  alt={`${localInfo.brand} ${localInfo.model}`}
                  className="h-auto max-h-40 w-auto object-contain"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- Section: Action Buttons & Legal --- */}
      <div className="flex justify-end">
        <FramerButton
          onClick={onNext}
          disabled={!isComplete}
          size="lg"
          className="text-primary-foreground h-14 w-full transform-gpu rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-lg font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/30 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          ถัดไป
        </FramerButton>
      </div>

      <div className="flex items-center">
        <label className="text-muted-foreground w-full text-center text-sm leading-none">
          เมื่อประเมินราคา คุณยอมรับ{" "}
          <a href="/privacy" className="text-primary hover:text-primary/80 underline">
            นโยบายความเป็นส่วนตัว
          </a>{" "}
          และ{" "}
          <a href="/terms" className="text-primary hover:text-primary/80 underline">
            ข้อกำหนดและเงื่อนไข
          </a>{" "}
          ของเรา
        </label>
      </div>
    </motion.div>
  );
};

export default AssessStep1;
