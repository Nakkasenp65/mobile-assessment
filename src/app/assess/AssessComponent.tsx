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

export default function AssessComponent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isUserDevice, setIsUserDevice] = useState<boolean>(true);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    brand: "",
    productType: "",
    model: "",
    storage: "",
  });
  console.log("Device info in AssessComponent: ", deviceInfo);

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

  console.log("Condition info in AssessComponent: ", conditionInfo);

  const [selectedService, setSelectedService] = useState<string>("");
  const searchParams = useSearchParams();

  // SECTION: Handle URL Parameters
  useEffect(() => {
    const brand = searchParams.get("brand");
    const model = searchParams.get("model");
    const capacity = searchParams.get("capacity");
    const isIcloudUnlock = searchParams.get("isIcloudUnlock");

    if (brand || model || capacity || isIcloudUnlock) {
      setDeviceInfo((prev) => ({
        ...prev,
        brand: brand || prev.brand,
        model: model || prev.model,
        storage: capacity || prev.storage,
      }));

      setConditionInfo((prev) => ({
        ...prev,
        canUnlockIcloud: isIcloudUnlock === "true",
      }));
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
      <div className="container mx-auto flex w-full flex-col items-center gap-8 p-4 pb-24 sm:gap-8 sm:pt-8">
        <ProgressBar currentStep={currentStep} totalSteps={4} />

        <div className="flex w-full flex-col">
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
