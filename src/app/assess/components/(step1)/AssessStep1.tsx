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
}

const AssessStep1 = ({
  deviceInfo,
  conditionInfo,
  onDeviceUpdate,
  onConditionUpdate,
  onNext,
  onUserDeviceUpdate,
}: AssessStep1Props) => {
  const { isDesktop } = useDeviceDetection();
  const [currentStep, setCurrentStep] = useState<StepName>("initializing");
  const [direction, setDirection] = useState(1);
  const { data: productData, isLoading: isImageLoading } = useMobile(deviceInfo.brand, deviceInfo.model);
  const [userDeviceSelection, setUserDeviceSelection] = useState<"this_device" | "other_device" | null>(null);
  const [simpleValid, setSimpleValid] = useState<boolean>(false);
  const [simpleData, setSimpleData] = useState<{ imageFile: File; description: string } | null>(null);

  // ✨ [FIXED] แก้ไข useEffect ให้จัดการกับ Race Condition ของ isDesktop
  useEffect(() => {
    // ถ้าผู้ใช้เริ่มดำเนินการไปแล้ว (ไม่ใช่ step เริ่มต้น) ให้หยุดการทำงานของ effect นี้
    // เพื่อไม่ให้ไปรบกวนการย้อนกลับ (Back) ของผู้ใช้
    if (currentStep !== "initializing" && currentStep !== "selectDeviceType") {
      return;
    }

    // กรณีเป็น Desktop: จะข้ามหน้า UserDeviceSelection ไปยังหน้าเลือก Brand ทันที
    if (isDesktop) {
      onUserDeviceUpdate(false);
      setUserDeviceSelection("other_device");

      // หากมีข้อมูลจากหน้าแรก (pre-filled) ให้ข้ามไป step ที่เหมาะสม
      if (deviceInfo.brand) {
        setCurrentStep(deviceInfo.brand === "Apple" ? "selectProduct" : "selectModelStorage");
      } else {
        // หากเป็นการเข้าชมปกติ ให้ไปที่หน้าเลือก Brand
        setCurrentStep("selectBrand");
      }
    }
    // กรณีเป็น Mobile (หรือ Desktop ที่ยังตรวจไม่เสร็จ): จะแสดงหน้า UserDeviceSelection ก่อน
    else {
      // ตั้งค่าให้เป็นหน้าเลือกอุปกรณ์เฉพาะตอนที่ยังเป็น "initializing" เท่านั้น
      if (currentStep === "initializing") {
        setCurrentStep("selectDeviceType");
      }
    }
  }, [isDesktop, deviceInfo.brand, onUserDeviceUpdate, currentStep]);

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

    if (deviceInfo.model) {
      onNext();
    } else {
      setCurrentStep("selectBrand");
    }
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
  };

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
  };

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
            <SimpleAssessmentForm
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
