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
  charger: string;
  call: string;
  homeButton: string;
  sensor: string;
  buttons: string;
}

export default function AssessPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isUserDevice, setIsUserDevice] = useState<boolean>(true);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    brand: "",
    model: "",
    storage: "",
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
    charger: "",
    call: "",
    homeButton: "",
    sensor: "",
    buttons: "",
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
      <div className="container mx-auto px-4 py-16">
        <ProgressBar currentStep={currentStep} totalSteps={3} />

        <div className="md:mt-8">
          {/* เลือกแบรนด์ โมเดล และ ความจุ */}
          {currentStep === 1 && (
            <AssessStep1
              deviceInfo={deviceInfo}
              onDeviceUpdate={handleDeviceUpdate}
              onConditionUpdate={setConditionInfo}
              onUserDeviceUpdate={handleUserDeviceUpdate}
              onNext={handleNext}
            />
          )}

          {/* ตอบคำถาม(QuestionReport) วัดสายชาร์จ(Automated) และ ระบายสี(Interactive) */}
          {currentStep === 2 && (
            <AssessStep2
              isOwnDevice={isUserDevice}
              conditionInfo={conditionInfo}
              onConditionUpdate={setConditionInfo}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {/* สรุปผลใบการประเมิน(POST API Result) */}
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
