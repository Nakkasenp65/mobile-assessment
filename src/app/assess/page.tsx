// src/app/assess/page.tsx

"use client";
import { useEffect, useState } from "react";
import AssessStep1 from "./components/AssessStep1";
import AssessStep2 from "./components/(step2)/AssessStep2";
import AssessStep3 from "./components/(step3)/AssessStep3";
import AssessStep4 from "./components/(step4)/AssessStep4"; //  เพิ่ม import สำหรับ Step 4
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
  // เพิ่ม state สำหรับเก็บ service ที่เลือก
  const [selectedService, setSelectedService] = useState<string>("");

  useEffect(() => {
    console.log(conditionInfo);
  }, [conditionInfo]);

  const handleNext = () => {
    // ปรับเงื่อนไขให้ไปถึง step 4 ได้
    if (currentStep < 4) {
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
      <div className="container mx-auto px-4 py-8 pb-24 sm:py-16 sm:pb-4">
        {/* ปรับ totalSteps เป็น 4 */}
        <ProgressBar currentStep={currentStep} totalSteps={4} />

        <div className="mt-8">
          {currentStep === 1 && (
            <AssessStep1
              deviceInfo={deviceInfo}
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
              onNext={handleNext} // ส่ง onNext ไปเพื่อใช้ในการยืนยัน
              setSelectedService={setSelectedService} // ส่ง state setter ไป
            />
          )}

          {/* เพิ่มการแสดงผลสำหรับ Step 4 */}
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
