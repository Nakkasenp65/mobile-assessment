// src\app\assess\components\(step1)\AssessStep1.tsx

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
import StepWrapper from "./StepWrapper";
import NavigationButtons from "./NavigationButtons";

// --- Types ---
type StepName =
  | "initializing"
  | "selectDeviceType"
  | "selectBrand"
  | "selectProduct"
  | "selectModelStorage"
  | "simpleAssessment";

// --- Main Component ---
interface AssessStep1Props {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  onDeviceUpdate: (info: DeviceInfo) => void;
  onConditionUpdate: (info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo)) => void;
  onNext: () => void;
  onUserDeviceUpdate: (value: boolean) => void;
  isFromMainPage?: boolean;
  paramsReady?: boolean;
}

const AssessStep1 = ({
  deviceInfo,
  conditionInfo,
  onDeviceUpdate,
  onConditionUpdate,
  onNext,
  onUserDeviceUpdate,
  isFromMainPage,
  paramsReady,
}: AssessStep1Props) => {
  const { isDesktop, isAndroid, isIOS } = useDeviceDetection();
  const [currentStep, setCurrentStep] = useState<StepName>("initializing");
  const [direction, setDirection] = useState(1);
  const { data: productData, isLoading: isImageLoading } = useMobile(deviceInfo.brand, deviceInfo.model);
  const [userDeviceSelection, setUserDeviceSelection] = useState<"this_device" | "other_device" | null>(null);
  const [simpleValid, setSimpleValid] = useState<boolean>(false);
  const [simpleData, setSimpleData] = useState<{ imageFile: File; description: string } | null>(null);
  const [skipBrandAfterDeviceSelection, setSkipBrandAfterDeviceSelection] = useState<boolean>(!!isFromMainPage);

  useEffect(() => {
    // Wait until URL params are processed to avoid race conditions
    if (!paramsReady) return;

    if (currentStep !== "initializing" && currentStep !== "selectDeviceType") {
      return;
    }

    if (isDesktop) {
      onUserDeviceUpdate(false);
      setUserDeviceSelection("other_device");

      if (deviceInfo.brand) {
        setCurrentStep(deviceInfo.brand === "Apple" ? "selectProduct" : "selectModelStorage");
      } else {
        setCurrentStep("selectBrand");
      }
    } else {
      if (currentStep === "initializing") {
        if (deviceInfo.brand) {
          // Only bypass device selection for Apple non-detailed products when coming from main page
          if (
            isFromMainPage &&
            deviceInfo.brand === "Apple" &&
            deviceInfo.productType &&
            !["iPhone", "iPad"].includes(deviceInfo.productType)
          ) {
            setCurrentStep("simpleAssessment");
          } else if (isFromMainPage) {
            // For prefilled flows from main page, start at device selection
            setCurrentStep("selectDeviceType");
          } else {
            // Preserve existing behavior for non-main-page flows
            if (deviceInfo.brand === "Apple") {
              if (deviceInfo.productType) {
                const isDetailed = deviceInfo.productType === "iPhone" || deviceInfo.productType === "iPad";
                setCurrentStep(isDetailed ? "selectModelStorage" : "simpleAssessment");
              } else {
                setCurrentStep("selectProduct");
              }
            } else {
              setCurrentStep("selectModelStorage");
            }
          }
        } else {
          setCurrentStep("selectDeviceType");
        }
      }
    }
  }, [
    paramsReady,
    isDesktop,
    deviceInfo.brand,
    deviceInfo.productType,
    onUserDeviceUpdate,
    currentStep,
    isFromMainPage,
  ]);

  useEffect(() => {
    if (direction > 0 && currentStep === "selectProduct" && deviceInfo.productType) {
      const isDetailed = deviceInfo.productType === "iPhone" || deviceInfo.productType === "iPad";
      if (isDetailed) {
        setCurrentStep("selectModelStorage");
      } else {
        setCurrentStep("simpleAssessment");
      }
    }
  }, [deviceInfo.productType, direction, currentStep, onNext]);

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

    // Handle iOS own device explicitly; preserve prefilled values from main page
    if (selection === "this_device" && isIOS) {
      const newInfo = {
        ...deviceInfo,
        brand: deviceInfo.brand || "Apple",
        // Keep productType/model/storage if already prefilled
      };
      onDeviceUpdate(newInfo);

      if (skipBrandAfterDeviceSelection && newInfo.brand === "Apple") {
        if (newInfo.productType) {
          const isDetailed = newInfo.productType === "iPhone" || newInfo.productType === "iPad";
          setCurrentStep(isDetailed ? "selectModelStorage" : "simpleAssessment");
        } else {
          setCurrentStep("selectProduct");
        }
      } else {
        setCurrentStep("selectProduct");
      }

      setSkipBrandAfterDeviceSelection(false);
      return;
    }

    // For non-iOS or other-device selection, only skip brand once if coming from main page
    if (skipBrandAfterDeviceSelection && deviceInfo.brand) {
      if (deviceInfo.brand === "Apple") {
        if (deviceInfo.productType) {
          const isDetailed = deviceInfo.productType === "iPhone" || deviceInfo.productType === "iPad";
          setCurrentStep(isDetailed ? "selectModelStorage" : "simpleAssessment");
        } else {
          setCurrentStep("selectProduct");
        }
      } else {
        setCurrentStep("selectModelStorage");
      }
    } else {
      setCurrentStep("selectBrand");
    }

    setSkipBrandAfterDeviceSelection(false);
  };

  const handleProductSelectAndNext = (productId: string) => {
    onDeviceUpdate({ ...deviceInfo, productType: productId, model: "", storage: "" });
    setDirection(1);
  };

  function nextStep() {
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
        // Proceed to question form after model + storage selected
        onNext();
        break;
      case "simpleAssessment":
        // Require valid simple assessment (image + description) before proceeding
        if (simpleValid) {
          // Optionally persist simple form data for downstream use
          try {
            if (simpleData && typeof window !== "undefined") {
              const tempKey = "assessment:simple";
              window.sessionStorage.setItem(
                tempKey,
                JSON.stringify({
                  brand: deviceInfo.brand,
                  productType: deviceInfo.productType,
                  imageName: simpleData.imageFile.name,
                  description: simpleData.description,
                }),
              );
            }
          } catch {}
          onNext();
        }
        break;
      default:
        break;
    }
  }

  function prevStep() {
    setDirection(-1);
    switch (currentStep) {
      case "selectBrand":
        if (!isDesktop) {
          // If this flow originated from the main page and went directly to simple form,
          // avoid forcing device selection on back; return to simple form instead when applicable.
          if (
            isFromMainPage &&
            deviceInfo.brand === "Apple" &&
            deviceInfo.productType &&
            !["iPhone", "iPad"].includes(deviceInfo.productType)
          ) {
            setCurrentStep("simpleAssessment");
          } else {
            setSkipBrandAfterDeviceSelection(false);
            setCurrentStep("selectDeviceType");
          }
        }
        break;
      case "selectProduct":
        if (userDeviceSelection === "this_device" && isIOS) {
          setSkipBrandAfterDeviceSelection(false);
          setCurrentStep("selectDeviceType");
        } else {
          setCurrentStep("selectBrand");
        }
        break;
      case "selectModelStorage":
        if (deviceInfo.brand === "Apple") {
          setCurrentStep("selectProduct");
        } else {
          setCurrentStep("selectBrand");
        }
        break;
      case "simpleAssessment":
        setCurrentStep("selectBrand");
        break;
      default:
        break;
    }
  }

  function renderCurrentStep() {
    if (currentStep === "initializing") {
      return null;
    }

    switch (currentStep) {
      case "selectDeviceType":
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
            title="ระบุยี่ห้ออปกรณ์ของคุณ"
            description="เลือกยี่ห้อของเครื่องที่ต้องการประเมิน"
            direction={direction}
          >
            <BrandSelector
              selectedBrand={deviceInfo.brand}
              onBrandChange={(brand) => handleSelectChange("brand", brand)}
              accordionValue="brand-selector"
              onAccordionChange={() => {}}
              isOwnDevice={userDeviceSelection === "this_device"}
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
            {/* Product Selector */}
            <ProductSelector
              selectedProduct={deviceInfo.productType || ""}
              onProductChange={handleProductSelectAndNext}
            />
            {/* Step Navigation */}
            <div className="mt-auto flex w-full justify-start">
              <FramerButton
                variant="ghost"
                onClick={prevStep}
                className="bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-12 items-center rounded-full border px-6 transition-colors dark:bg-zinc-800 dark:hover:bg-zinc-700"
              >
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
            <SimpleAssessmentForm
              deviceInfo={deviceInfo}
              onDeviceUpdate={onDeviceUpdate}
              conditionInfo={conditionInfo}
              onConditionUpdate={onConditionUpdate}
              onValidityChange={(valid) => setSimpleValid(valid)}
              onDataChange={(data) => setSimpleData(data)}
            />
            <NavigationButtons
              onBack={prevStep}
              onNext={nextStep}
              isNextDisabled={!deviceInfo.brand || !deviceInfo.productType || !simpleValid}
            />
          </StepWrapper>
        );
      default:
        return null;
    }
  }

  return (
    <motion.div
      className="mx-auto flex w-full max-w-4xl flex-col rounded-2xl"
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
