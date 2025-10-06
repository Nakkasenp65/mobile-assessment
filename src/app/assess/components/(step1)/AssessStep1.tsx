// src/app/assess/components/(step1)/AssessStep1.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMobile } from "@/hooks/useMobile";
import { ConditionInfo, DeviceInfo } from "../../../../types/device";
import { PHONE_DATA } from "../../../../util/phone";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
import FramerButton from "../../../../components/ui/framer/FramerButton";
import { ArrowLeft } from "lucide-react";

// Import sub-components
import UserDeviceSelection from "./UserDeviceSelection";
import BrandSelector from "./BrandSelector";
import ProductSelector from "./ProductSelector";
import ModelAndStorageSelector from "./ModelAndStorageSelector";
import SimpleAssessmentForm from "./SimpleAssessmentForm";
import DeviceImagePreview from "./DeviceImagePreview";

// --- Types ---
type StepName = "selectDeviceType" | "selectBrand" | "selectProduct" | "selectModelStorage" | "simpleAssessment";

// --- Helper Components ---
const StepWrapper: React.FC<{ children: React.ReactNode; title: string; description: string }> = ({
  children,
  title,
  description,
}) => (
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -30 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="absolute flex h-full w-full flex-col gap-8"
  >
    <div className="text-center">
      <h2 className="text-foreground text-2xl font-bold md:text-3xl">{title}</h2>
      <p className="text-muted-foreground text-sm md:text-base">{description}</p>
    </div>
    <div className="flex flex-1 flex-col">{children}</div>
  </motion.div>
);

const NavigationButtons: React.FC<{ onBack?: () => void; onNext: () => void; isNextDisabled: boolean }> = ({
  onBack,
  onNext,
  isNextDisabled,
}) => (
  <div className={`flex w-full ${onBack ? "justify-between" : "justify-end"} mt-auto items-center pt-6`}>
    {onBack && (
      <FramerButton variant="ghost" onClick={onBack} className="flex h-12 items-center rounded-full px-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span className="font-semibold">ย้อนกลับ</span>
      </FramerButton>
    )}
    <FramerButton
      onClick={onNext}
      disabled={isNextDisabled}
      size="lg"
      className="h-14 transform-gpu rounded-xl px-8 text-base font-semibold shadow-lg transition-all duration-300 hover:-translate-y-1 disabled:transform-none"
    >
      ถัดไป
    </FramerButton>
  </div>
);

// --- Main Component ---
interface AssessStep1Props {
  deviceInfo: DeviceInfo;
  onDeviceUpdate: (info: DeviceInfo) => void;
  onConditionUpdate: (info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo)) => void;
  onNext: () => void;
  onUserDeviceUpdate: (value: boolean) => void;
}

const AssessStep1 = ({ deviceInfo, onDeviceUpdate, onNext, onUserDeviceUpdate }: AssessStep1Props) => {
  const { isDesktop } = useDeviceDetection();
  // Start with 'selectDeviceType' by default. The useEffect will correct it for desktops.
  const [currentStep, setCurrentStep] = useState<StepName>("selectDeviceType");

  const [localInfo, setLocalInfo] = useState<DeviceInfo>(deviceInfo);
  const { data: productData, isLoading: isImageLoading } = useMobile(localInfo.brand, localInfo.model);
  const [userDeviceSelection, setUserDeviceSelection] = useState<"this_device" | "other_device" | null>(null);

  // ✨ [THE FIX] This effect runs when `isDesktop` value is determined.
  useEffect(() => {
    // If it's a desktop, force the step to 'selectBrand'.
    if (isDesktop) {
      setCurrentStep("selectBrand");
      setUserDeviceSelection("other_device");
      onUserDeviceUpdate(false);
    }
  }, [isDesktop, onUserDeviceUpdate]);

  // Update parent component when localInfo changes
  useEffect(() => {
    onDeviceUpdate(localInfo);
  }, [localInfo, onDeviceUpdate]);

  const handleSelectChange = (field: keyof DeviceInfo, value: string) => {
    setLocalInfo((prev) => {
      const newState = { ...prev, [field]: value };
      // Reset subsequent selections
      if (field === "brand") {
        newState.productType = "";
        newState.model = "";
        newState.storage = "";
      }
      if (field === "productType") {
        newState.model = "";
        newState.storage = "";
      }
      if (field === "model") {
        newState.storage = "";
      }
      return newState;
    });
  };

  const handleUserDeviceSelect = (selection: "this_device" | "other_device") => {
    setUserDeviceSelection(selection);
    onUserDeviceUpdate(selection === "this_device");
    setCurrentStep("selectBrand");
  };

  const nextStep = () => {
    switch (currentStep) {
      case "selectBrand":
        if (localInfo.brand === "Apple") {
          setCurrentStep("selectProduct");
        } else {
          setCurrentStep("selectModelStorage");
        }
        break;
      case "selectProduct":
        const isDetailed = localInfo.productType === "iPhone" || localInfo.productType === "iPad";
        if (isDetailed) {
          setCurrentStep("selectModelStorage");
        } else {
          setCurrentStep("simpleAssessment");
        }
        break;
      case "selectModelStorage":
      case "simpleAssessment":
        onNext();
        break;
      default:
        break;
    }
  };

  const prevStep = () => {
    switch (currentStep) {
      case "selectBrand":
        if (!isDesktop) {
          setCurrentStep("selectDeviceType");
        }
        break;
      case "selectProduct":
        setCurrentStep("selectBrand");
        break;
      case "selectModelStorage":
        if (localInfo.brand === "Apple") {
          setCurrentStep("selectProduct");
        } else {
          setCurrentStep("selectBrand");
        }
        break;
      case "simpleAssessment":
        setCurrentStep("selectProduct");
        break;
      default:
        break;
    }
  };

  const renderCurrentStep = () => {
    // Don't render anything until device detection is complete on mobile
    if (!isDesktop && currentStep === "selectDeviceType" && userDeviceSelection === null) {
      return (
        <StepWrapper title="ประเมินอุปกรณ์เครื่องใด?" description="เลือกเพื่อดำเนินการในขั้นตอนถัดไป">
          <UserDeviceSelection selectedValue={userDeviceSelection} onSelect={handleUserDeviceSelect} />
        </StepWrapper>
      );
    }

    switch (currentStep) {
      case "selectDeviceType":
        return (
          <StepWrapper title="ประเมินอุปกรณ์เครื่องใด?" description="เลือกเพื่อดำเนินการในขั้นตอนถัดไป">
            <UserDeviceSelection selectedValue={userDeviceSelection} onSelect={handleUserDeviceSelect} />
          </StepWrapper>
        );
      case "selectBrand":
        return (
          <StepWrapper title="ระบุยี่ห้ออุปกรณ์ของคุณ" description="เลือกยี่ห้อของเครื่องที่ต้องการประเมิน">
            <BrandSelector
              selectedBrand={localInfo.brand}
              onBrandChange={(brand) => handleSelectChange("brand", brand)}
              accordionValue="brand-selector"
              onAccordionChange={() => {}}
            />
            <NavigationButtons
              onBack={isDesktop ? undefined : prevStep}
              onNext={nextStep}
              isNextDisabled={!localInfo.brand}
            />
          </StepWrapper>
        );
      case "selectProduct":
        return (
          <StepWrapper
            title="เลือกประเภทผลิตภัณฑ์ Apple"
            description="เลือกประเภทของอุปกรณ์ Apple ที่คุณต้องการประเมิน"
          >
            <ProductSelector
              selectedProduct={localInfo.productType || ""}
              onProductChange={(p) => handleSelectChange("productType", p)}
            />
            <NavigationButtons onBack={prevStep} onNext={nextStep} isNextDisabled={!localInfo.productType} />
          </StepWrapper>
        );
      case "selectModelStorage":
        const availableModels = PHONE_DATA.models[localInfo.productType || localInfo.brand] || [];
        const availableStorage = PHONE_DATA.storage[localInfo.model] || [];
        return (
          <StepWrapper title="ระบุรุ่นและความจุ" description="ข้อมูลนี้จำเป็นสำหรับการประเมินราคาที่แม่นยำ">
            <div className="flex flex-col items-start gap-8 md:flex-row">
              <div className="w-full flex-shrink-0 md:w-1/2">
                <DeviceImagePreview
                  isLoading={isImageLoading}
                  imageUrl={productData?.image_url}
                  altText={`${localInfo.brand} ${localInfo.model}`}
                />
              </div>
              <div className="w-full md:w-1/2">
                <ModelAndStorageSelector
                  localInfo={localInfo}
                  availableModels={availableModels}
                  availableStorage={availableStorage}
                  onSelectChange={handleSelectChange}
                />
              </div>
            </div>
            <NavigationButtons
              onBack={prevStep}
              onNext={nextStep}
              isNextDisabled={!localInfo.brand || !localInfo.model || !localInfo.storage}
            />
          </StepWrapper>
        );
      case "simpleAssessment":
        return (
          <StepWrapper
            title="รายละเอียดเพิ่มเติม"
            description={`กรอกรายละเอียดเกี่ยวกับ ${localInfo.productType} ของคุณ`}
          >
            <SimpleAssessmentForm />
            <NavigationButtons
              onBack={prevStep}
              onNext={nextStep}
              isNextDisabled={!localInfo.brand || !localInfo.productType}
            />
          </StepWrapper>
        );
      default:
        // Render nothing if on desktop and initial step is still selectDeviceType before useEffect kicks in
        return null;
    }
  };

  return (
    <motion.div
      className="mx-auto flex w-full max-w-4xl flex-col rounded-2xl p-2 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="relative" style={{ minHeight: "70vh" }}>
        <AnimatePresence mode="wait">{renderCurrentStep()}</AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AssessStep1;
