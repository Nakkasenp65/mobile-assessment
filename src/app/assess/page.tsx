"use client";
import { useState } from "react";
import AssessStep1 from "./components/AssessStep1";
import AssessStep2 from "./components/(step2)/AssessStep2";
import AssessStep3 from "./components/AssessStep3";
import ProgressBar from "./components/ProgressBar";
import Layout from "@/components/Layout/Layout";

export interface DeviceInfo {
  brand: string;
  model: string;
  storage: string;
}

export interface ConditionInfo {
  screenGlass: string;
  screenDisplay: string;
  bodyCondition: string;
  powerOn: string;
  cameras: string;
  biometric: string;
  charger: string;
  wifi: string;
}

export default function AssessPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    brand: "",
    model: "",
    storage: "",
  });
  const [conditionInfo, setConditionInfo] = useState<ConditionInfo>({
    screenGlass: "",
    screenDisplay: "",
    bodyCondition: "",
    powerOn: "",
    cameras: "",
    biometric: "",
    charger: "",
    wifi: "",
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDeviceUpdate = (info: DeviceInfo) => {
    setDeviceInfo(info);
  };

  console.log(conditionInfo);

  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <ProgressBar currentStep={currentStep} totalSteps={3} />

        <div className="mt-8">
          {currentStep === 1 && (
            <AssessStep1
              deviceInfo={deviceInfo}
              onDeviceUpdate={handleDeviceUpdate}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <AssessStep2
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
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
