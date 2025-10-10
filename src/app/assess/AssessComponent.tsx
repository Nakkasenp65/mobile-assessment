// src/app/assess/AssessComponent.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [isInitialStepCalculated, setIsInitialStepCalculated] = useState(false);

  useEffect(() => {
    if (isInitialStepCalculated) return;

    const brand = searchParams.get("brand");
    const model = searchParams.get("model");
    const capacity = searchParams.get("capacity");
    const isIcloudUnlock = searchParams.get("isIcloudUnlock");
    const productType = searchParams.get("productType");
    const isFromMainPage = searchParams.get("isFromMainPage");

    const hasAllParams = !!(brand && model && capacity && isFromMainPage === "true");
    const hasSimpleParams = !!(
      brand === "Apple" &&
      productType &&
      !["iPhone", "iPad"].includes(productType) &&
      isFromMainPage === "true"
    );

    if (hasAllParams || hasSimpleParams) {
      setDeviceInfo((prev) => ({
        ...prev,
        brand: brand || prev.brand,
        productType: productType || prev.productType,
        model: model || prev.model,
        storage: capacity || prev.storage,
      }));

      if (isIcloudUnlock) {
        setConditionInfo((prev) => ({
          ...prev,
          canUnlockIcloud: isIcloudUnlock === "true",
        }));
      }

      if (hasSimpleParams) {
        setCurrentStep(3);
      } else {
        setCurrentStep(2);
      }
    }

    setIsInitialStepCalculated(true);
  }, [searchParams, isInitialStepCalculated]);

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

  const handleDeviceUpdate = useCallback((info: DeviceInfo) => {
    setDeviceInfo(info);
  }, []);

  const handleUserDeviceUpdate = useCallback((value: boolean) => {
    setIsUserDevice(value);
  }, []);

  // SECTION: Render Component
  return (
    <Layout>
      <div className="container mx-auto flex min-h-dvh w-full flex-col items-center gap-8 p-4 pb-24 sm:gap-8 sm:pt-8">
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
              deviceInfo={deviceInfo}
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
