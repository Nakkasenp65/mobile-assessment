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

// Import sub-components
import UserDeviceSelection from "./UserDeviceSelection";
import BrandSelector from "./BrandSelector";
import ProductSelector from "./ProductSelector";
import ModelAndStorageSelector from "./ModelAndStorageSelector";
import SimpleAssessmentForm from "./SimpleAssessmentForm";
import DeviceImagePreview from "./DeviceImagePreview";

// --- Types ---
type StepName = "selectDeviceType" | "selectBrand" | "selectProduct" | "selectModelStorage" | "simpleAssessment";

// SECTION: Helper Components
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

// SECTION: Main Component Props
interface AssessStep1Props {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  onDeviceUpdate: (info: DeviceInfo) => void;
  onConditionUpdate: (info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo)) => void;
  onNext: () => void;
  onUserDeviceUpdate: (value: boolean) => void;
}

// SECTION: Main Component
const AssessStep1 = ({
  deviceInfo,
  conditionInfo,
  onDeviceUpdate,
  onConditionUpdate,
  onNext,
  onUserDeviceUpdate,
}: AssessStep1Props) => {
  // SECTION: State Management
  const { isDesktop } = useDeviceDetection();
  const [currentStep, setCurrentStep] = useState<StepName>("selectDeviceType");
  const [direction, setDirection] = useState(1);
  const [localInfo, setLocalInfo] = useState<DeviceInfo>(deviceInfo);
  const { data: productData, isLoading: isImageLoading } = useMobile(localInfo.brand, localInfo.model);
  const [userDeviceSelection, setUserDeviceSelection] = useState<"this_device" | "other_device" | null>(null);
  const initialSetupDone = useRef(false);

  // SECTION: Helper Function - Check URL Parameters
  const hasRequiredUrlParams = (info: DeviceInfo): boolean => {
    return !!(info.brand && info.model && info.storage);
  };

  // SECTION: Sync deviceInfo from props to local state
  useEffect(() => {
    setLocalInfo(deviceInfo);
  }, [deviceInfo]);

  // SECTION: Initial Setup for Desktop
  useEffect(() => {
    if (initialSetupDone.current) return;

    if (isDesktop) {
      // ✨ [Desktop] ตั้งค่าเริ่มต้นว่าเป็นเครื่องคนอื่น
      setUserDeviceSelection("other_device");
      onUserDeviceUpdate(false);

      // ✨ [Desktop] ตรวจสอบว่ามี URL params ครบหรือไม่
      const hasUrlParams = hasRequiredUrlParams(deviceInfo);

      if (hasUrlParams) {
        // ✨ [Skip] ถ้ามี URL params ครบแล้ว ข้ามไป Step 2 เลย
        console.log("Desktop: URL params detected, skipping to next step");
        onNext();
      } else {
        // ✨ [No URL Params] ไม่มี URL params ให้เริ่มที่ selectBrand
        console.log("Desktop: No URL params, starting from brand selection");
        setCurrentStep("selectBrand");
      }

      initialSetupDone.current = true;
    } else {
      // ✨ [Mobile] เริ่มต้นที่ selectDeviceType เสมอ
      console.log("Mobile: Starting from device type selection");
      setCurrentStep("selectDeviceType");
      initialSetupDone.current = true;
    }
  }, [isDesktop, onUserDeviceUpdate, deviceInfo, onNext]);

  // SECTION: Sync local info to parent
  useEffect(() => {
    onDeviceUpdate(localInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localInfo]); // ✨ ลบ onDeviceUpdate ออกจาก dependency เพราะ wrap ด้วย useCallback แล้วใน parent

  // SECTION: Handle Field Changes
  const handleSelectChange = (field: keyof DeviceInfo, value: string) => {
    setLocalInfo((prev) => {
      const newState = { ...prev, [field]: value };
      // ✨ [Reset] รีเซ็ตค่าที่ขึ้นต่อกันเมื่อเปลี่ยนค่าด้านบน
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

  // SECTION: Handle User Device Selection
  const handleUserDeviceSelect = (selection: "this_device" | "other_device") => {
    setUserDeviceSelection(selection);
    onUserDeviceUpdate(selection === "this_device");
    setDirection(1);

    // ✨ [Check URL Params] ใช้ deviceInfo จาก props เพราะมันได้รับค่าจาก URL แล้ว
    const hasUrlParams = hasRequiredUrlParams(deviceInfo);
    console.log("Mobile: Checking URL params after device selection:", {
      brand: deviceInfo.brand,
      model: deviceInfo.model,
      storage: deviceInfo.storage,
      hasUrlParams,
    });

    if (hasUrlParams) {
      // ✨ [Skip] ถ้ามี URL params ครบแล้ว ข้ามไป Step 2 เลย
      console.log("Mobile: URL params detected, skipping to next step");
      onNext();
    } else {
      // ✨ [No URL Params] ไม่มี URL params ให้ไปที่ selectBrand
      console.log("Mobile: No URL params, proceeding to brand selection");
      setCurrentStep("selectBrand");
    }
  };

  // SECTION: Handle Product Selection and Navigate
  const handleProductSelectAndNext = (productId: string) => {
    setDirection(1);
    handleSelectChange("productType", productId);

    // ✨ [Detailed Assessment] iPhone และ iPad ต้องเลือก Model และ Storage
    const isDetailed = productId === "iPhone" || productId === "iPad";
    if (isDetailed) {
      setCurrentStep("selectModelStorage");
    } else {
      // ✨ [Simple Assessment] อุปกรณ์อื่นๆ ใช้แบบฟอร์มง่าย
      setCurrentStep("simpleAssessment");
    }
  };

  // SECTION: Navigate to Next Step
  const nextStep = () => {
    setDirection(1);
    switch (currentStep) {
      case "selectBrand":
        if (localInfo.brand === "Apple") {
          setCurrentStep("selectProduct");
        } else {
          setCurrentStep("selectModelStorage");
        }
        break;
      case "selectProduct":
        // ✨ [Product Selected] จะถูกจัดการโดย handleProductSelectAndNext
        break;
      case "selectModelStorage":
      case "simpleAssessment":
        // ✨ [Complete] ไป Step 2
        onNext();
        break;
      default:
        break;
    }
  };

  // SECTION: Navigate to Previous Step
  const prevStep = () => {
    setDirection(-1);
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

  // SECTION: Render Current Step
  const renderCurrentStep = () => {
    switch (currentStep) {
      // SECTION: Step - Device Type Selection (Mobile Only)
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

      // SECTION: Step - Brand Selection
      case "selectBrand":
        return (
          <StepWrapper
            title="ระบุยี่ห้ออุปกรณ์ของคุณ"
            description="เลือกยี่ห้อของเครื่องที่ต้องการประเมิน"
            direction={direction}
          >
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

      // SECTION: Step - Product Selection (Apple Only)
      case "selectProduct":
        return (
          <StepWrapper
            title="เลือกประเภทผลิตภัณฑ์ Apple"
            description="เลือกประเภทของอุปกรณ์ Apple ที่คุณต้องการประเมิน"
            direction={direction}
          >
            <ProductSelector
              selectedProduct={localInfo.productType || ""}
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

      // SECTION: Step - Model and Storage Selection
      case "selectModelStorage":
        const availableModels = PHONE_DATA.models[localInfo.productType || localInfo.brand] || [];
        const availableStorage = PHONE_DATA.storage[localInfo.model] || [];
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
                altText={`${localInfo.brand} ${localInfo.model}`}
              />
              <ModelAndStorageSelector
                localInfo={localInfo}
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
              isNextDisabled={!localInfo.brand || !localInfo.model || !localInfo.storage}
            />
          </StepWrapper>
        );

      // SECTION: Step - Simple Assessment Form (Non-iPhone/iPad)
      case "simpleAssessment":
        return (
          <StepWrapper
            title="รายละเอียดเพิ่มเติม"
            description={`กรอกรายละเอียดเกี่ยวกับ ${localInfo.productType} ของคุณ`}
            direction={direction}
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
        return null;
    }
  };

  // SECTION: Component Render
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
