"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../../components/Layout/Layout";
import { AssessmentRecord } from "../../../types/assessment";
import AssessStep3 from "../../assess/components/(step3)/AssessStep3";
import AssessStep4 from "../../assess/components/(step4)/AssessStep4";

const getExpiryDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
};

const mockRecords: AssessmentRecord = {
  id: "ASS-2568-0001",
  phoneNumber: "0812345678",
  assessmentDate: "25 กันยายน 2568",
  device: {
    brand: "Apple",
    model: "iPhone 15 Pro",
    storage: "256GB",
    imageUrl:
      "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845702708",
  },
  conditionInfo: {
    modelType: "model_th",
    warranty: "warranty_active_long",
    accessories: "acc_full",
    bodyCondition: "body_mint",
    screenGlass: "glass_ok",
    screenDisplay: "display_ok",
    batteryHealth: "battery_health_high",
    camera: "camera_ok",
    wifi: "wifi_ok",
    faceId: "biometric_ok",
    speaker: "speaker_ok",
    mic: "mic_ok",
    touchScreen: "touchscreen_ok",
    charger: "charger_failed",
    call: "call_ok",
    homeButton: "home_button_ok",
    sensor: "sensor_ok",
    buttons: "buttons_ok",
  },
  pawnServiceInfo: {
    customerName: "นางสาวสายฟ้า สมสุข",
    locationType: "bts",
    btsLine: "BTS - สายสุขุมวิท",
    btsStation: "สยาม",
    appointmentDate: "27 กันยายน 2568",
    appointmentTime: "13:00 - 17:00",
    phone: "0812345678",
  },
  selectedService: {
    name: "บริการจำนำ (Pawn Service)",
    price: 22600,
    appointmentDate: "27 กันยายน 2568, 13:00 - 17:00 น.",
  },
  status: "completed",
  estimatedValue: 28500,
  priceLockExpiresAt: getExpiryDate(3),
  nextSteps: [
    "เตรียมบัตรประชาชนและอุปกรณ์ให้พร้อม",
    "ไปพบทีมงานตามวัน-เวลานัด และสถานีที่เลือก",
    "ชำระเงินและรับเอกสารการทำรายการ",
  ],
};

export default function AssessmentRecordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 = Service Selection (AssessStep3), 2 = Service Form (AssessStep4)
  const [selectedService, setSelectedService] = useState<string>("");

  // Extract data from mockRecords
  const { device, conditionInfo } = mockRecords;

  // Transform device data to match DeviceInfo type
  const deviceInfo = {
    brand: device.brand,
    model: device.model,
    storage: device.storage,
    productType: device.brand === "Apple" ? "iPhone" : "Android", // Simplified logic
    imageUrl: device.imageUrl,
  };

  // Handler to advance to service form
  const handleNext = () => {
    if (step === 1 && selectedService) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  // Handler for back navigation
  const handleBack = () => {
    if (step === 2) {
      setStep(1); // Return to service selection
      window.scrollTo(0, 0);
    } else {
      router.push("/my-assessments"); // Exit to assessments list
    }
  };

  return (
    <Layout>
      <main className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center overflow-x-hidden bg-white px-4 py-8 text-center sm:py-16">
        <div className="z-10 container flex w-full flex-col items-center">
          {step === 1 && (
            <AssessStep3
              deviceInfo={deviceInfo}
              conditionInfo={conditionInfo}
              onBack={handleBack}
              onNext={handleNext}
              setSelectedService={setSelectedService}
              priceLockExpiresAt={mockRecords.priceLockExpiresAt}
            />
          )}

          {step === 2 && (
            <AssessStep4
              deviceInfo={deviceInfo}
              conditionInfo={conditionInfo}
              selectedService={selectedService}
              onBack={handleBack}
            />
          )}
        </div>
      </main>
    </Layout>
  );
}
