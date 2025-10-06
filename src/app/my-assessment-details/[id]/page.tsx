"use client";

import Layout from "../../../components/Layout/Layout";
import { AssessmentRecord } from "../../../types/assessment";
import AssessmentDetails from "../components/AssessmentDetails";

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
  const recordToShow = mockRecords; // ในอนาคตจะเปลี่ยนมาใช้ข้อมูลจริง

  return (
    // bg-gradient-to-br from-[#fff8f0] via-white to-[#ffeaf5]
    <Layout>
      <main className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center overflow-x-hidden bg-white px-4 py-16 text-center">
        <div className="z-10 container flex w-full flex-col items-center">
          {recordToShow && <AssessmentDetails record={recordToShow} />}
        </div>
      </main>
    </Layout>
  );
}
