// src/app/assess/page.tsx

"use client";
import { useEffect, useState } from "react";
import AssessStep1 from "./components/AssessStep1";
import AssessStep2 from "./components/(step2)/AssessStep2";
import AssessStep3 from "./components/(step3)/AssessStep3";
import ProgressBar from "./components/ProgressBar";
import Layout from "@/components/Layout/Layout";

export interface DeviceInfo {
  brand: string;
  model: string;
  storage: string;
  batteryHealth: string;
}

export interface ConditionInfo {
  screenGlass: string;
  screenDisplay: string;
  powerOn: string;
  camera: string;
  charger: string;
  wifi: string;
  touchScreen: string;
  mic: string;
  speaker: string;
}

export default function AssessPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isUserDevice, setIsUserDevice] = useState<boolean>(true);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    brand: "",
    model: "",
    storage: "",
    batteryHealth: "",
  });
  const [conditionInfo, setConditionInfo] = useState<ConditionInfo>({
    screenGlass: "",
    screenDisplay: "",
    powerOn: "",
    camera: "",
    charger: "",
    wifi: "",
    touchScreen: "",
    mic: "",
    speaker: "",
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

  const handleUserDeviceUpdate = (value: boolean) => {
    setIsUserDevice(value);
  };

  useEffect(() => {
    console.log("เป็นเครื่องที่ถืออยู่: ", isUserDevice);
  }, [isUserDevice]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pb-24">
        <ProgressBar currentStep={currentStep} totalSteps={3} />

        <div className="mt-8">
          {currentStep === 1 && (
            <AssessStep1
              deviceInfo={deviceInfo}
              onDeviceUpdate={handleDeviceUpdate}
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
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
