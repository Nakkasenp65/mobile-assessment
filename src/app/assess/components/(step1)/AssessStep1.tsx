// src/app/assess/components/(step1)/AssessStep1.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMobile } from "@/hooks/useMobile";
import { DeviceInfo, ConditionInfo } from "../../../../types/device";
import { PHONE_DATA } from "../../../../util/phone";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
import FramerButton from "../../../../components/ui/framer/FramerButton";

import UserDeviceSelection from "./UserDeviceSelection";
import BrandSelector from "./BrandSelector";
import ModelAndStorageSelector from "./ModelAndStorageSelector";
import DeviceImagePreview from "./DeviceImagePreview";
import ProductSelector from "./ProductSelector";
import SimpleAssessmentForm from "./SimpleAssessmentForm";

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
  const [localInfo, setLocalInfo] = useState<DeviceInfo>(deviceInfo);
  const { isDesktop } = useDeviceDetection();
  const [hasSelectedBrand, setHasSelectedBrand] = useState(!!deviceInfo.brand);
  const [isManuallyOpened, setIsManuallyOpened] = useState(false);
  const [accordionValue, setAccordionValue] = useState<string>("brand-selector");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availableStorage, setAvailableStorage] = useState<string[]>([]);
  const { data: productData, isLoading: isImageLoading } = useMobile(localInfo.brand, localInfo.model);
  const [userDeviceSelection, setUserDeviceSelection] = useState<"this_device" | "other_device" | null>(
    isDesktop ? "other_device" : null,
  );

  const prevBrandRef = useRef(localInfo.brand);
  const prevProductTypeRef = useRef(localInfo.productType);

  useEffect(() => {
    if (localInfo.brand && localInfo.brand !== prevBrandRef.current) {
      setLocalInfo((prev) => ({ ...prev, productType: "", model: "", storage: "" }));
      prevBrandRef.current = localInfo.brand;
    }
  }, [localInfo.brand]);

  useEffect(() => {
    if (localInfo.productType && localInfo.productType !== prevProductTypeRef.current) {
      const nextModels = PHONE_DATA.models[localInfo.productType] ?? [];
      setAvailableModels(nextModels);
      setLocalInfo((prev) => ({ ...prev, model: "", storage: "" }));
      if (nextModels.length === 1) {
        setLocalInfo((prev) => ({ ...prev, model: nextModels[0] }));
      }
      prevProductTypeRef.current = localInfo.productType;
    }
  }, [localInfo.productType]);

  useEffect(() => {
    onDeviceUpdate(localInfo);
  }, [localInfo, onDeviceUpdate]);

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

  const isAppleProductSelected = localInfo.brand === "Apple" && localInfo.productType;
  const isDetailedAssessment =
    isAppleProductSelected && (localInfo.productType === "iPhone" || localInfo.productType === "iPad");
  const isSimpleAssessment = isAppleProductSelected && !["iPhone", "iPad"].includes(localInfo.productType || "");
  const isOtherBrand = localInfo.brand && localInfo.brand !== "Apple";

  const isComplete = (() => {
    if (isDetailedAssessment || isOtherBrand) {
      return !!(localInfo.brand && localInfo.model && localInfo.storage);
    }
    if (isSimpleAssessment) {
      // For simple assessment, we just need brand and product type
      return !!(localInfo.brand && localInfo.productType);
    }
    return false;
  })();

  return (
    <motion.div
      className="mx-auto flex h-full max-w-2xl flex-col gap-8 rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="text-center">
        <h2 className="text-foreground mb-2 text-3xl font-bold">ระบุรุ่นอุปกรณ์ของคุณ</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          เลือกยี่ห้อ, ประเภท, รุ่น, และความจุของเครื่องที่ต้องการประเมิน
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
          {localInfo.brand === "Apple" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProductSelector
                selectedProduct={localInfo.productType || ""}
                onProductChange={(p) => handleSelectChange("productType", p)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(isDetailedAssessment || isOtherBrand) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              <ModelAndStorageSelector
                localInfo={localInfo}
                availableModels={PHONE_DATA.models[localInfo.productType || localInfo.brand] || []}
                availableStorage={PHONE_DATA.storage[localInfo.model] || []}
                onSelectChange={handleSelectChange}
              />
            </motion.div>
          )}

          {isSimpleAssessment && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SimpleAssessmentForm />
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
