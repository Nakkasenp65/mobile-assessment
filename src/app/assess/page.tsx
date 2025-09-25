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
  // ข้อมูลทั่วไป
  modelType: string;
  warranty: string;
  accessories: string;
  // สภาพภายนอก
  bodyCondition: string;
  screenGlass: string;
  // การทำงานหน้าจอและประสิทธิภาพ
  screenDisplay: string;
  batteryHealth: string; // คำตอบจากคำถามเรื่องสุขภาพแบต
  // ฟังก์ชันพื้นฐาน
  camera: string;
  wifi: string;
  faceId: string;
  speaker: string;
  mic: string;
  touchScreen: string;
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
      <div className="container mx-auto px-4 pt-0 pb-24 md:pt-8">
        <ProgressBar currentStep={currentStep} totalSteps={3} />

        <div className="md:mt-8">
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
            <AssessStep3 deviceInfo={deviceInfo} conditionInfo={conditionInfo} onBack={handleBack} />
          )}
        </div>
      </div>
    </Layout>
  );
}
