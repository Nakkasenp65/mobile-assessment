// src/app/assess/components/(step3)/AssessStep3.tsx

"use client";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Banknote,
  CreditCard,
  ShoppingBag,
  Handshake,
  TabletSmartphone,
  Hash,
  Wrench,
} from "lucide-react";
import { DeviceInfo, ConditionInfo } from "../../page";
import { LucideIcon } from "lucide-react";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { useMobile } from "@/hooks/useMobile";
import Services from "./Services";
import FramerButton from "../../../../components/ui/framer/FramerButton";
import AssessmentSummary from "./AssessmentSummary";
import { useRepairPrices } from "@/hooks/useRepairPrices";
import StatusBadge from "../../../../components/ui/StatusBadge";

interface AssessStep3Props {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  onBack: () => void;
  onNext: () => void; //  รับ onNext มา
  setSelectedService: React.Dispatch<React.SetStateAction<string>>; //  รับ setSelectedService มา
}

export interface ServiceOption {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  price: number;
}

const getExpiryDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
};

const mockRecords = {
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
};

const AssessStep3 = ({
  deviceInfo,
  conditionInfo,
  onBack,
  onNext,
  setSelectedService,
}: AssessStep3Props) => {
  const {
    totalRepairCost,
    repairs,
    isLoading: isLoadingRepairPrices,
  } = useRepairPrices(deviceInfo.model, conditionInfo);

  const [localSelectedService, setLocalSelectedService] = useState<string>("");

  const { finalPrice, grade } = usePriceCalculation(deviceInfo, conditionInfo);

  const { data: mobileData, isLoading: isImageLoading } = useMobile(
    deviceInfo.brand,
    deviceInfo.model,
  );

  const assessmentDate =
    new Date().toLocaleString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }) + " น.";

  const calculatedRefinancePrice = Math.round(finalPrice * 0.5);
  const calculatedExchangePrice = Math.round(finalPrice * 0.7);

  const baseServices: ServiceOption[] = [
    {
      id: "sell",
      title: "ขายทันที",
      description: "รับเงินสดเต็มจำนวนทันที",
      icon: Banknote,
      price: finalPrice,
    },
    {
      id: "consignment",
      title: "ขายฝาก",
      description: "เราช่วยประกาศขายเพื่อให้ได้ราคาดีที่สุด",
      icon: ShoppingBag,
      price: finalPrice,
    },
    {
      id: "tradein",
      title: "เทิร์นเครื่อง",
      description: "นำเครื่องเก่ามาแลกเครื่องใหม่คุ้มๆ",
      icon: TabletSmartphone,
      price: finalPrice,
    },
  ];

  const isAppleDevice = deviceInfo.brand === "Apple";

  const coreServices: ServiceOption[] = [
    baseServices[0],
    ...(isAppleDevice
      ? [
          {
            id: "refinance",
            title: "บริการรีไฟแนนซ์",
            description: "รับเงินก้อน ผ่อนชำระคืน 6 เดือน",
            icon: CreditCard,
            price: calculatedRefinancePrice,
          },
        ]
      : []),
    ...baseServices.slice(1),
  ];

  const services: ServiceOption[] = [
    ...coreServices,
    ...(isAppleDevice
      ? [
          {
            id: "iphone-exchange",
            title: "ไอโฟนแลกเงิน",
            description: "รับเงินสดทันที ต่อรอบได้ทุก 10 วัน",
            icon: Handshake,
            price: calculatedExchangePrice,
          },
        ]
      : []),
    {
      id: "maintenance",
      title: "ซ่อมบำรุง",
      description: "เลือกซ่อมเฉพาะส่วนที่ต้องการ",
      icon: Wrench,
      price: totalRepairCost, // ใช้ totalRepairCost เป็น giá trị เริ่มต้น
    },
  ];

  const handleConfirm = () => {
    if (localSelectedService) {
      // เปลี่ยนจาก alert เป็นการเรียก onNext()
      onNext();
    }
  };

  useEffect(() => {
    setSelectedService(localSelectedService);
  }, [localSelectedService, setSelectedService]);

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <div className="flex w-full flex-col">
      {/* HEAD */}
      <div className="mb-8 flex w-full flex-col items-center justify-center gap-2">
        <h2 className="mb-2 text-3xl font-bold text-black">ผลการประเมินอุปกรณ์</h2>
        <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-600">
            <Hash className="h-4 w-4" />
            <span>รหัสการประเมิน: {mockRecords.id}</span>
          </div>
          <p className="text-[#78716c]">อัพเดทล่าสุด: {mockRecords.assessmentDate}</p>
          <StatusBadge status={mockRecords.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-3">
        {/* Column 1: Assessment Summary */}
        <AssessmentSummary
          deviceInfo={deviceInfo}
          conditionInfo={conditionInfo}
          isImageLoading={isImageLoading}
          mobileData={mobileData}
          grade={grade}
          finalPrice={finalPrice}
          assessmentDate={assessmentDate}
          repairs={repairs}
          totalCost={totalRepairCost}
          isLoadingRepairPrices={isLoadingRepairPrices}
        />

        {/* Column 2: Service Selection */}
        <div className="top-24 flex h-fit flex-col lg:sticky">
          <Services
            services={services}
            selectedService={localSelectedService}
            setSelectedService={setLocalSelectedService}
            repairs={repairs}
            totalCost={totalRepairCost}
            isLoading={isLoadingRepairPrices}
            deviceInfo={deviceInfo}
          />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-4 flex items-center justify-between border-t pt-6 dark:border-zinc-800">
        <FramerButton
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-12 items-center rounded-xl border bg-white px-6 transition-colors dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="ml-2 hidden font-semibold sm:inline">ย้อนกลับ</span>
        </FramerButton>

        <FramerButton
          onClick={handleConfirm} // ฟังก์ชันนี้จะเรียก onNext()
          disabled={!localSelectedService}
          size="lg"
          className="gradient-primary text-primary-foreground shadow-primary/30 hover:shadow-secondary/30 h-12 transform-gpu rounded-xl px-8 text-base font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          ยืนยันการเลือก
        </FramerButton>
      </div>
    </div>
  );
};

export default AssessStep3;
