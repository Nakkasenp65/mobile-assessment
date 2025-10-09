// SECTION: src/app/assess/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AssessStep1 from "./components/(step1)/AssessStep1";
import AssessStep2 from "./components/(step2)/AssessStep2";
import AssessStep3 from "./components/(step3)/AssessStep3";
import AssessStep4 from "./components/(step4)/AssessStep4";
import ProgressBar from "./components/ProgressBar";
import Layout from "@/components/Layout/Layout";
import { ConditionInfo, DeviceInfo } from "../../types/device";

export default function AssessPage() {
  // SECTION: State Management
  const [currentStep, setCurrentStep] = useState(1);
  const [isUserDevice, setIsUserDevice] = useState<boolean>(true);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    brand: "",
    productType: "",
    model: "",
    storage: "",
  });
  const [conditionInfo, setConditionInfo] = useState<ConditionInfo>({
    canUnlockIcloud: true,
    modelType: "",
    warranty: "",
    accessories: "",
    bodyCondition: "",
    screenGlass: "",
    screenDisplay: "",
    batteryHealth: "",
    camera: "",
    wifi: "",
    faceId: "",
    speaker: "",
    mic: "",
    touchScreen: "",
    charger: "",
    call: "",
    homeButton: "",
    sensor: "",
    buttons: "",
  });
  const [selectedService, setSelectedService] = useState<string>("");
  const searchParams = useSearchParams();

  // SECTION: Handle URL Parameters
  useEffect(() => {
    const brand = searchParams.get("brand");
    const productType = searchParams.get("productType"); // ✨ [เพิ่ม] ดึงค่า productType
    const model = searchParams.get("model");
    const capacity = searchParams.get("capacity");
    const isIcloudUnlock = searchParams.get("isIcloudUnlock");

    if (brand || productType || model || capacity || isIcloudUnlock) {
      console.log("Parameters from URL:");
      console.log({ brand, productType, model, capacity, isIcloudUnlock });

      setDeviceInfo((prev) => ({
        ...prev,
        brand: brand || prev.brand,
        productType: productType || prev.productType, // ✨ [เพิ่ม] ตั้งค่า productType
        model: model || prev.model,
        storage: capacity || prev.storage,
      }));

      if (isIcloudUnlock !== null) {
        setConditionInfo((prev) => ({
          ...prev,
          canUnlockIcloud: isIcloudUnlock === "true",
        }));
      }
    }
  }, [searchParams]);

  // SECTION: Navigation Handlers
  const handleNext = () => {
    if (
      currentStep === 1 &&
      deviceInfo.brand === "Apple" &&
      deviceInfo.productType &&
      !["iPhone", "iPad"].includes(deviceInfo.productType)
    ) {
      setCurrentStep(3);
    } else if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (
      currentStep === 3 &&
      deviceInfo.brand === "Apple" &&
      deviceInfo.productType &&
      !["iPhone", "iPad"].includes(deviceInfo.productType)
    ) {
      setCurrentStep(1);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // SECTION: State Update Handlers
  const handleDeviceUpdate = (info: DeviceInfo) => {
    setDeviceInfo(info);
  };

  const handleUserDeviceUpdate = (value: boolean) => {
    setIsUserDevice(value);
  };

  // SECTION: Render Component
  return (
    <Layout>
      <div className="container mx-auto flex w-full flex-col gap-8 p-4 pb-24 sm:gap-8 sm:pt-8">
        <ProgressBar currentStep={currentStep} totalSteps={4} />

        <div className="flex flex-col">
          {currentStep === 1 && (
            <AssessStep1
              deviceInfo={deviceInfo}
              conditionInfo={conditionInfo}
              onDeviceUpdate={handleDeviceUpdate}
              onConditionUpdate={setConditionInfo}
              onUserDeviceUpdate={handleUserDeviceUpdate}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <AssessStep2
              isOwnDevice={isUserDevice}
              conditionInfo={conditionInfo}
              onConditionUpdate={setConditionInfo}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <AssessStep3
              deviceInfo={deviceInfo}
              conditionInfo={conditionInfo}
              onBack={handleBack}
              onNext={handleNext}
              setSelectedService={setSelectedService}
            />
          )}

          {currentStep === 4 && (
            <AssessStep4
              deviceInfo={deviceInfo}
              conditionInfo={conditionInfo}
              selectedService={selectedService}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
