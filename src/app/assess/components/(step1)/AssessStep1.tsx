// SECTION: src/app/assess/components/(step1)/AssessStep1.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMobile } from "@/hooks/useMobile";
import { ConditionInfo, DeviceInfo } from "../../../../types/device";
import { PHONE_DATA } from "../../../../util/phone";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
import FramerButton from "../../../../components/ui/framer/FramerButton";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

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
const StepWrapper: React.FC<{
  children: React.ReactNode;
  title: string;
  description: string;
  direction: number;
}> = ({ children, title, description, direction }) => (
  <motion.div
    key={title}
    custom={direction}
    initial={{ opacity: 0, x: 30 * direction }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -30 * direction }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
    className="flex h-full w-full flex-1 flex-col gap-4"
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
  conditionInfo: ConditionInfo;
  onDeviceUpdate: (info: DeviceInfo) => void;
  onConditionUpdate: (info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo)) => void;
  onNext: () => void;
  onUserDeviceUpdate: (value: boolean) => void;
}

const AssessStep1 = ({
  deviceInfo,
  conditionInfo,
  onDeviceUpdate,
  onConditionUpdate,
  onNext,
  onUserDeviceUpdate,
}: AssessStep1Props) => {
  const router = useRouter();
  const { isDesktop } = useDeviceDetection();
  const [currentStep, setCurrentStep] = useState<StepName>("selectDeviceType");
  const [direction, setDirection] = useState(1);
  const { data: productData, isLoading: isImageLoading } = useMobile(deviceInfo.brand, deviceInfo.model);
  const [userDeviceSelection, setUserDeviceSelection] = useState<"this_device" | "other_device" | null>(null);

  const isInitialDesktopSetupDone = useRef(false);

  useEffect(() => {
    if (isDesktop && !isInitialDesktopSetupDone.current) {
      setUserDeviceSelection("other_device");
      onUserDeviceUpdate(false);
      setCurrentStep("selectBrand");
      isInitialDesktopSetupDone.current = true;
    }
  }, [isDesktop, onUserDeviceUpdate]);

  useEffect(() => {
    // Only navigate FORWARD from selectProduct
    if (direction > 0 && currentStep === "selectProduct" && deviceInfo.productType) {
      const isDetailed = deviceInfo.productType === "iPhone" || deviceInfo.productType === "iPad";
      if (isDetailed) {
        setCurrentStep("selectModelStorage");
      } else {
        onNext();
      }
    }
  }, [deviceInfo.productType, direction, currentStep]);

  const handleSelectChange = (field: keyof DeviceInfo, value: string) => {
    const newState = { ...deviceInfo, [field]: value };

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

    onDeviceUpdate(newState);
  };

  const handleUserDeviceSelect = (selection: "this_device" | "other_device") => {
    setUserDeviceSelection(selection);
    onUserDeviceUpdate(selection === "this_device");
    setDirection(1);
    setCurrentStep("selectBrand");
  };

  const handleProductSelectAndNext = (productId: string) => {
    onDeviceUpdate({ ...deviceInfo, productType: productId, model: "", storage: "" });
    setDirection(1);
  };

  const nextStep = () => {
    setDirection(1);
    switch (currentStep) {
      case "selectBrand":
        if (deviceInfo.brand === "Apple") {
          setCurrentStep("selectProduct");
        } else {
          setCurrentStep("selectModelStorage");
        }
        break;
      case "selectProduct":
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
    setDirection(-1);
    switch (currentStep) {
      case "selectBrand":
        // For mobile, go back to device type selection. Desktop users start here, so no back action.
        if (!isDesktop) {
          setCurrentStep("selectDeviceType");
        }
        break;
      case "selectProduct":
        setCurrentStep("selectBrand");
        break;
      case "selectModelStorage":
        if (deviceInfo.brand === "Apple") {
          onDeviceUpdate({ ...deviceInfo, productType: "", model: "", storage: "" });
          setCurrentStep("selectProduct");
        } else {
          onDeviceUpdate({ ...deviceInfo, model: "", storage: "" });
          setCurrentStep("selectBrand");
        }
        break;
      case "simpleAssessment":
        setCurrentStep("selectBrand");
        break;
      default:
        break;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "selectDeviceType":
        if (isDesktop) return null;
        return (
          <StepWrapper
            title="ประเมินอุปกรณ์เครื่องใด?"
            description="เลือกเพื่อดำเนินการในขั้นตอนถัดไป"
            direction={direction}
          >
            <UserDeviceSelection selectedValue={userDeviceSelection} onSelect={handleUserDeviceSelect} />
          </StepWrapper>
        );

      case "selectBrand":
        return (
          <StepWrapper
            title="ระบุยี่ห้ออุปกรณ์ของคุณ"
            description="เลือกยี่ห้อของเครื่องที่ต้องการประเมิน"
            direction={direction}
          >
            <BrandSelector
              selectedBrand={deviceInfo.brand}
              onBrandChange={(brand) => handleSelectChange("brand", brand)}
              accordionValue="brand-selector"
              onAccordionChange={() => {}}
            />
            <NavigationButtons
              onBack={isDesktop ? undefined : prevStep}
              onNext={nextStep}
              isNextDisabled={!deviceInfo.brand}
            />
          </StepWrapper>
        );

      case "selectProduct":
        return (
          <StepWrapper
            title="เลือกประเภทผลิตภัณฑ์ Apple"
            description="เลือกประเภทของอุปกรณ์ Apple ที่คุณต้องการประเมิน"
            direction={direction}
          >
            <ProductSelector
              selectedProduct={deviceInfo.productType || ""}
              onProductChange={handleProductSelectAndNext}
            />
            <div className="mt-auto flex w-full justify-start pt-6">
              <FramerButton variant="ghost" onClick={prevStep} className="flex h-12 items-center rounded-full px-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="font-semibold">ย้อนกลับ</span>
              </FramerButton>
            </div>
          </StepWrapper>
        );

      case "selectModelStorage":
        const availableModels = PHONE_DATA.models[deviceInfo.productType || deviceInfo.brand] || [];
        const availableStorage = PHONE_DATA.storage[deviceInfo.model] || [];
        return (
          <StepWrapper
            title="ระบุรุ่นและความจุ"
            description="ข้อมูลนี้จำเป็นสำหรับการประเมินราคาที่แม่นยำ"
            direction={direction}
          >
            <div className="flex flex-col items-center gap-8">
              <DeviceImagePreview
                isLoading={isImageLoading}
                imageUrl={productData?.image_url}
                altText={`${deviceInfo.brand} ${deviceInfo.model}`}
              />
              <ModelAndStorageSelector
                localInfo={deviceInfo}
                availableModels={availableModels}
                availableStorage={availableStorage}
                onSelectChange={handleSelectChange}
                conditionInfo={conditionInfo}
                onConditionUpdate={onConditionUpdate}
              />
            </div>
            <NavigationButtons
              onBack={prevStep}
              onNext={nextStep}
              isNextDisabled={!deviceInfo.brand || !deviceInfo.model || !deviceInfo.storage}
            />
          </StepWrapper>
        );

      case "simpleAssessment":
        return (
          <StepWrapper
            title="รายละเอียดเพิ่มเติม"
            description={`กรอกรายละเอียดเกี่ยวกับ ${deviceInfo.productType} ของคุณ`}
            direction={direction}
          >
            <SimpleAssessmentForm />
            <NavigationButtons
              onBack={prevStep}
              onNext={nextStep}
              isNextDisabled={!deviceInfo.brand || !deviceInfo.productType}
            />
          </StepWrapper>
        );
      default:
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
