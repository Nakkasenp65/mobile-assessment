// src/app/assess/components/AssessStep1.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMobile } from "@/hooks/useMobile";
import { DeviceInfo, ConditionInfo } from "../../../../types/device";
import { PHONE_DATA } from "../../../../util/phone";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
import FramerButton from "../../../../components/ui/framer/FramerButton";

// Import a new component
import UserDeviceSelection from "./UserDeviceSelection";
import BrandSelector from "./BrandSelector";
import ModelAndStorageSelector from "./ModelAndStorageSelector";
import DeviceImagePreview from "./DeviceImagePreview";

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

  const [hasSelectedBrand, setHasSelectedBrand] = useState(false);
  const [isManuallyOpened, setIsManuallyOpened] = useState(false);
  const [accordionValue, setAccordionValue] = useState<string>("brand-selector");

  const [availableModels, setAvailableModels] = useState<string[]>(() => {
    if (deviceInfo.brand) return PHONE_DATA.models[deviceInfo.brand] ?? [];
    return [];
  });

  const [availableStorage, setAvailableStorage] = useState<string[]>(() => {
    if (deviceInfo.model) return PHONE_DATA.storage[deviceInfo.model] ?? [];
    return [];
  });

  const { data: productData, isLoading: isImageLoading } = useMobile(localInfo.brand, localInfo.model);

  const [userDeviceSelection, setUserDeviceSelection] = useState<"this_device" | "other_device" | null>(
    isDesktop ? "other_device" : null,
  );

  const prevBrandRef = useRef(localInfo.brand);
  const prevModelRef = useRef(localInfo.model);

  // --- Section: Lifecycle & Effects ---
  useEffect(() => {
    if (localInfo.brand && localInfo.brand !== prevBrandRef.current) {
      const nextModels = PHONE_DATA.models[localInfo.brand] ?? [];
      setAvailableModels(nextModels);
      setLocalInfo((prev) => ({ ...prev, model: "", storage: "" }));
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
    if (!hasSelectedBrand && !isManuallyOpened) {
      setAccordionValue("");
      setHasSelectedBrand(true);
    }
  };

  const handleAccordionChange = (value: string) => {
    setAccordionValue(value);
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
      <div className="text-center">
        <h2 className="text-foreground mb-2 text-3xl font-bold">ระบุรุ่นมือถือของคุณ</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          เลือกยี่ห้อ รุ่น และความจุของเครื่องที่ต้องการประเมิน
        </p>
      </div>

      {!isDesktop && <UserDeviceSelection selectedValue={userDeviceSelection} onSelect={handleUserDeviceSelect} />}

      <div className="flex-grow space-y-6">
        <BrandSelector
          selectedBrand={localInfo.brand}
          onBrandChange={handleBrandChange}
          accordionValue={accordionValue}
          onAccordionChange={handleAccordionChange}
        />

        <AnimatePresence>
          {localInfo.brand && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              <ModelAndStorageSelector
                localInfo={localInfo}
                availableModels={availableModels}
                availableStorage={availableStorage}
                onSelectChange={handleSelectChange}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <DeviceImagePreview
          isLoading={isImageLoading}
          imageUrl={productData?.image_url}
          altText={`${localInfo.brand} ${localInfo.model}`}
        />
      </div>

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
