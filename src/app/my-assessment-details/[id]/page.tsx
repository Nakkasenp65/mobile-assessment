"use client";

import Layout from "../../../components/Layout/Layout";
import AssessmentDetails from "../components/AssessmentDetails";

// --- Interfaces ---
interface ConditionInfo {
  modelType: string;
  warranty: string;
  accessories: string;
  bodyCondition: string;
  screenGlass: string;
  screenDisplay: string;
  batteryHealth: string;
  camera: string;
  wifi: string;
  faceId: string;
  speaker: string;
  mic: string;
  touchScreen: string;
  charger: string;
}

interface PawnServiceInfo {
  customerName: string;
  locationType: "home" | "bts" | "store";
  homeAddress?: string;
  province?: string;
  district?: string;
  btsLine?: string;
  btsStation?: string;
  storeBranch?: string;
  appointmentDate: string;
  appointmentTime: string;
  phone: string;
}

interface AssessmentRecord {
  id: string; // ✨ 2. เพิ่ม ID เข้าไปใน Interface
  phoneNumber: string;
  assessmentDate: string;
  device: {
    brand: string;
    model: string;
    storage: string;
    imageUrl: string;
  };
  conditionInfo: ConditionInfo;
  pawnServiceInfo: PawnServiceInfo;
  selectedService: {
    name: string;
    price: number;
    appointmentDate: string;
  };
  status: "completed" | "pending" | "in-progress";
  estimatedValue: number;
  priceLockExpiresAt: string;
  nextSteps: string[];
}

const getExpiryDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
};

const mockRecords: AssessmentRecord[] = [
  {
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
      modelType: "th",
      warranty: "active_long",
      accessories: "full",
      bodyCondition: "mint",
      screenGlass: "passed",
      screenDisplay: "passed",
      batteryHealth: "high",
      camera: "passed",
      wifi: "passed",
      faceId: "passed",
      speaker: "passed",
      mic: "passed",
      touchScreen: "passed",
      charger: "failed",
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
  },
];

export default function AssessmentRecordPage() {
  const recordToShow = mockRecords[0];

  return (
    <Layout>
      <main className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center overflow-x-hidden bg-gradient-to-br from-[#fff8f0] via-white to-[#ffeaf5] px-4 py-16 text-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-[#fed7aa] opacity-20 blur-3xl" />
          <div className="absolute top-1/4 right-0 h-80 w-80 rounded-full bg-[#fbcfe8] opacity-20 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-[#ddd6fe] opacity-20 blur-3xl" />
        </div>

        <div className="relative z-10 flex w-full max-w-6xl flex-col items-center">
          {recordToShow && (
            <AssessmentDetails record={recordToShow} />
          )}
        </div>
      </main>
    </Layout>
  );
}
