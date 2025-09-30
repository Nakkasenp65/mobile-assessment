"use client";

import React, { type ComponentType } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Calendar,
  ClipboardList,
  Wrench,
  HardDrive,
  Cpu,
  ShieldCheck,
  CheckCircle,
  Clock,
  Home,
  MapPin,
  Store,
  User,
  Hash,
} from "lucide-react";
import Layout from "../../../components/Layout/Layout";
import Image from "next/image";

import SupportSection from "../components/SupportSection";
import ConditionGrid from "./ConditionGrid";
import PriceLockCountdown from "./PirceLockCountdown";

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
    id: "ASS-2568-0001", // ✨ 3. เพิ่มข้อมูล ID สำหรับแต่ละ Record
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
  {
    id: "ASS-2568-0002",
    phoneNumber: "0987654321",
    assessmentDate: "24 กันยายน 2568",
    device: {
      brand: "Samsung",
      model: "Galaxy S23 Ultra",
      storage: "512GB",
      imageUrl:
        "https://images.samsung.com/is/image/samsung/p6pim/th/2302/gallery/th-galaxy-s23-ultra-s918-sm-s918bzghsth-534884024?$650_519_PNG$",
    },
    conditionInfo: {
      modelType: "th",
      warranty: "inactive",
      accessories: "box_only",
      bodyCondition: "minor_scratch",
      screenGlass: "passed",
      screenDisplay: "passed",
      batteryHealth: "low",
      camera: "failed",
      wifi: "failed",
      faceId: "passed",
      speaker: "passed",
      mic: "passed",
      touchScreen: "passed",
      charger: "failed",
    },
    pawnServiceInfo: {
      customerName: "นายสมชาย ใจดี",
      locationType: "store",
      storeBranch: "สาขาเซ็นทรัลลาดพร้าว",
      appointmentDate: "26 กันยายน 2568",
      appointmentTime: "11:00 - 14:00",
      phone: "0987654321",
    },
    selectedService: {
      name: "บริการจำนำ (Pawn Service)",
      price: 15200,
      appointmentDate: "26 กันยายน 2568, 11:00 - 14:00 น.",
    },
    status: "completed",
    estimatedValue: 19800,
    priceLockExpiresAt: getExpiryDate(1),
    nextSteps: [
      "นำอุปกรณ์และกล่องพร้อมบัตรประชาชนมาที่สาขา",
      "เจ้าหน้าที่จะตรวจสอบอุปกรณ์อีกครั้ง",
      "รับเงินสดและสัญญาการจำนำ",
    ],
  },
  {
    id: "ASS-2568-0003",
    phoneNumber: "0611223344",
    assessmentDate: "20 กันยายน 2568",
    device: {
      brand: "Apple",
      model: "iPhone 13",
      storage: "128GB",
      imageUrl:
        "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-13-finish-select-202207-6-1inch-product-red?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1656712888956",
    },
    conditionInfo: {
      modelType: "other",
      warranty: "inactive",
      accessories: "no_box",
      bodyCondition: "major_scratch",
      screenGlass: "defect",
      screenDisplay: "defect",
      batteryHealth: "low",
      camera: "failed",
      wifi: "passed",
      faceId: "failed",
      speaker: "failed",
      mic: "failed",
      touchScreen: "failed",
      charger: "failed",
    },
    pawnServiceInfo: {
      customerName: "คุณส้มใส น่ารัก",
      locationType: "home",
      homeAddress: "123/45 ถ.สุขุมวิท",
      province: "กรุงเทพมหานคร",
      district: "วัฒนา",
      appointmentDate: "22 กันยายน 2568",
      appointmentTime: "15:00 - 18:00",
      phone: "0611223344",
    },
    selectedService: {
      name: "บริการจำนำ (Pawn Service)",
      price: 4500,
      appointmentDate: "22 กันยายน 2568, 15:00 - 18:00 น.",
    },
    status: "in-progress",
    estimatedValue: 6000,
    priceLockExpiresAt: new Date(
      "2023-10-20T23:59:59",
    ).toISOString(),
    nextSteps: [
      "ทีมงานกำลังตรวจสอบข้อมูลเพิ่มเติม",
      "จะมีการติดต่อกลับเพื่อยืนยันการประเมินอีกครั้ง",
    ],
  },
];

type IconComponent = ComponentType<{ className?: string }>;

const SectionDivider = ({
  color = "from-slate-300 to-slate-200",
}) => (
  <div
    className={`my-4 h-[2px] w-full bg-gradient-to-r ${color}`}
  />
);

const SectionHeader = ({
  icon: Icon,
  label,
  colorClass,
}: {
  icon: IconComponent;
  label: string;
  colorClass: string;
}) => (
  <div className="mb-3 flex items-center gap-3">
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br ${colorClass} h-9 w-9`}
    >
      <Icon className="h-5 w-5 text-white" />
    </div>
    <span className="text-base font-bold text-slate-800 md:text-lg">
      {label}
    </span>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    completed: {
      label: "ประเมินเสร็จสิ้น",
      icon: CheckCircle,
      color: "bg-[#f0fdf4] text-[#16a34a]",
    },
    pending: {
      label: "รอการประเมิน",
      icon: Clock,
      color: "bg-[#fefce8] text-[#ca8a04]",
    },
    "in-progress": {
      label: "กำลังประเมิน",
      icon: Wrench,
      color: "bg-[#eff6ff] text-[#2563eb]",
    },
  };
  const config =
    statusConfig[status as keyof typeof statusConfig] ||
    statusConfig.pending;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${config.color}`}
    >
      <Icon className="mr-1 h-4 w-4" />
      {config.label}
    </span>
  );
};

const PawnServiceDetails = ({
  pawnServiceInfo,
  selectedService,
}: {
  pawnServiceInfo: PawnServiceInfo;
  selectedService: AssessmentRecord["selectedService"];
}) => {
  return (
    <div className="md:rounded-xl md:border md:border-[#e3dace] md:p-5">
      <SectionHeader
        icon={ClipboardList}
        label="ข้อมูลบริการและการนัดหมาย"
        colorClass="from-amber-500 to-orange-500"
      />
      <div className="mb-4 flex flex-col justify-between gap-2 rounded-xl border border-orange-200 bg-white p-4 shadow-sm md:items-center md:gap-4 lg:flex-row">
        <div>
          <span className="text-base font-bold text-[#f97316] md:text-lg">
            {selectedService.name}
          </span>
          <div className="mt-1 flex items-center gap-1.5 text-[#78716c] md:mt-2">
            <Calendar className="h-4 w-4" />
            <span className="text-xs font-medium md:text-sm">
              {selectedService.appointmentDate}
            </span>
          </div>
        </div>
        <div className="text-left md:text-right">
          <span className="text-xs text-slate-600 md:text-sm">
            ยอดเงินที่จะได้รับ
          </span>
          <span className="block text-xl font-bold text-[#f97316] md:text-2xl">
            {selectedService.price.toLocaleString("th-TH", {
              style: "currency",
              currency: "THB",
              minimumFractionDigits: 0,
            })}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-xs lg:text-sm">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-violet-500" />
          <span className="font-semibold">ชื่อผู้ใช้:</span>
          <span>{pawnServiceInfo.customerName}</span>
        </div>
        <div className="flex items-start gap-3">
          {pawnServiceInfo.locationType === "home" ? (
            <Home className="h-5 w-5 flex-shrink-0 text-sky-500" />
          ) : pawnServiceInfo.locationType === "bts" ? (
            <MapPin className="h-5 w-5 flex-shrink-0 text-emerald-500" />
          ) : (
            <Store className="h-5 w-5 flex-shrink-0 text-yellow-700" />
          )}
          <div className="flex items-start text-left">
            <span className="font-semibold">
              สถานที่นัดหมาย:
            </span>
            <span>
              {pawnServiceInfo.locationType === "home" &&
                `รับถึงบ้าน (${
                  pawnServiceInfo.homeAddress || ""
                })`}
              {pawnServiceInfo.locationType === "bts" &&
                `${pawnServiceInfo.btsLine} - สถานี ${pawnServiceInfo.btsStation}`}
              {pawnServiceInfo.locationType === "store" &&
                `${pawnServiceInfo.storeBranch}`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-blue-500" />
          <span className="font-semibold">โทร:</span>
          <span>{pawnServiceInfo.phone}</span>
        </div>
      </div>
    </div>
  );
};

const AssessmentDetails = ({
  record,
}: {
  record: AssessmentRecord;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative mt-12 w-full max-w-6xl"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#110e0c]">
          ผลการประเมินอุปกรณ์
        </h2>
        {/* ✨ 4. นำ ID มาแสดงผลตรงนี้ */}
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-600">
          <Hash className="h-4 w-4" />
          <span>รหัสการประเมิน: {record.id}</span>
        </div>
        <p className="mt-2 text-[#78716c]">
          อัพเดทล่าสุด: {record.assessmentDate}
        </p>
        <div className="mt-4">
          <StatusBadge status={record.status} />
        </div>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-2xl lg:p-10">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex w-full flex-col gap-6 md:flex-1">
            <div className="flex flex-col items-center gap-6 text-left lg:flex-row lg:items-start">
              <div className="w-full max-w-[180px] flex-shrink-0">
                <div className="relative mx-auto">
                  <Image
                    src={record.device.imageUrl}
                    alt={`${record.device.brand} ${record.device.model}`}
                    width={320}
                    height={320}
                    className="h-auto w-full rounded-2xl object-contain"
                  />
                </div>
              </div>
              <div className="flex w-full flex-1 flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-[#78716c]" />
                  <span className="font-medium text-[#78716c]">
                    รุ่น
                  </span>
                  <span className="ml-auto font-semibold text-[#110e0c]">
                    {record.device.brand}{" "}
                    {record.device.model}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-[#78716c]" />
                  <span className="font-medium text-[#78716c]">
                    ความจุ
                  </span>
                  <span className="ml-auto font-semibold text-[#110e0c]">
                    {record.device.storage}
                  </span>
                </div>
                <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">
                      มูลค่าประเมิน
                    </span>
                    <span className="text-2xl font-bold text-[#f97316]">
                      {record.estimatedValue.toLocaleString(
                        "th-TH",
                        {
                          style: "currency",
                          currency: "THB",
                          minimumFractionDigits: 0,
                        },
                      )}
                    </span>
                  </div>
                  <PriceLockCountdown
                    expiryDate={record.priceLockExpiresAt}
                  />
                </div>
              </div>
            </div>

            <SectionDivider color="from-orange-200 to-pink-200" />

            <ConditionGrid
              conditionInfo={record.conditionInfo}
            />
          </div>

          <div className="flex w-full flex-col gap-6 md:flex-1">
            <PawnServiceDetails
              pawnServiceInfo={record.pawnServiceInfo}
              selectedService={record.selectedService}
            />

            <div className="md:rounded-xl md:border md:border-[#e3dace] md:p-5">
              <div className="mb-3 flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500`}
                >
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-base font-bold text-slate-800 md:text-lg">
                  ขั้นตอนต่อไป
                </span>
              </div>
              <div className="mb-4 flex flex-col gap-3">
                {record.nextSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#eff6ff]">
                      <span className="text-sm font-bold text-[#2563eb]">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-left text-[#110e0c]">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-[#dbeafe] bg-[#eff6ff] p-4">
                <p className="flex items-start gap-2 text-left text-sm text-[#1e40af]">
                  <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                  <span>
                    <span className="font-medium">
                      หมายเหตุ:
                    </span>{" "}
                    กรุณานำบัตรประชาชนและอุปกรณ์ทั้งหมดมาด้วยในวันนัดหมาย
                  </span>
                </p>
              </div>
            </div>

            <SupportSection />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

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
