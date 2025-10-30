// src/app/assess/AssessComponent.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import AssessStep1 from "./components/(step1)/AssessStep1";
import AssessStep2 from "./components/(step2)/AssessStep2";
import ProgressBar from "./components/ProgressBar";
import Layout from "@/components/Layout/Layout";
import { ConditionInfo, DeviceInfo } from "../../types/device";
import { useRouter } from "next/navigation";

export default function AssessComponent() {
  const router = useRouter();
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

  const searchParams = useSearchParams();
  const [isInitialStepCalculated, setIsInitialStepCalculated] = useState(false);
  const [isFromMainPage, setIsFromMainPage] = useState<boolean>(false);

  useEffect(() => {
    const brand = searchParams.get("brand");
    const model = searchParams.get("model");
    const capacity = searchParams.get("capacity");
    const isIcloudUnlock = searchParams.get("isIcloudUnlock");
    const productType = searchParams.get("productType");
    const fromMain = searchParams.get("isFromMainPage") === "true";

    // Track source to adjust initial step behavior in AssessStep1
    setIsFromMainPage(fromMain);

    // Prefill only when navigating from main page and we have usable params
    if (fromMain && (brand || productType || model || capacity)) {
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

      setIsInitialStepCalculated(true);
    } else if (!fromMain) {
      // For non-main-page flows, we can initialize immediately
      setIsInitialStepCalculated(true);
    }
  }, [searchParams]);

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(2);
      return;
    }
    // Navigate to AssessmentRecordPage and persist temp data
    const id = `${deviceInfo.brand || "UNK"}-${deviceInfo.model || "MODEL"}-${Date.now()}`;
    try {
      const payload = {
        device: {
          brand: deviceInfo.brand,
          model: deviceInfo.model,
          storage: deviceInfo.storage,
        },
        conditionInfo,
      };
      if (typeof window !== "undefined") {
        window.localStorage.setItem(`assessment:${id}`, JSON.stringify(payload));
      }
    } catch (error) {
      console.error("Set Local Item Error: ", error);
    }
    router.push(`/details/${encodeURIComponent(id)}`);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // SECTION: State Update Handlers
  const handleDeviceUpdate = useCallback((info: DeviceInfo) => {
    setDeviceInfo(info);
  }, []);

  const handleUserDeviceUpdate = useCallback((value: boolean) => {
    setIsUserDevice(value);
  }, []);

  const handleConditionUpdate = useCallback(
    (info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo)) => {
      setConditionInfo(info);
    },
    [],
  );

  // SECTION: Render Component
  return (
    <Layout>
      <div className="container mx-auto flex w-full flex-col items-center gap-8 p-4 pb-24 sm:gap-8 sm:pt-8">
        <ProgressBar currentStep={currentStep} totalSteps={3} />

        <div className="flex w-full flex-col">
          {currentStep === 1 && (
            <AssessStep1
              deviceInfo={deviceInfo}
              conditionInfo={conditionInfo}
              onDeviceUpdate={handleDeviceUpdate}
              onConditionUpdate={handleConditionUpdate}
              onUserDeviceUpdate={handleUserDeviceUpdate}
              onNext={handleNext}
              isFromMainPage={isFromMainPage}
              paramsReady={isInitialStepCalculated}
            />
          )}

          {currentStep === 2 && (
            <AssessStep2
              deviceInfo={deviceInfo}
              isOwnDevice={isUserDevice}
              conditionInfo={conditionInfo}
              onConditionUpdate={handleConditionUpdate}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
