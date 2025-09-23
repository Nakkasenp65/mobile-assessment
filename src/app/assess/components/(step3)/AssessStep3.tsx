"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Banknote,
  Shield,
  ImageOff,
  Wrench,
  CreditCard,
  Truck,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import { DeviceInfo, ConditionInfo } from "../../page";
import { LucideIcon } from "lucide-react";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { useMobile } from "@/hooks/useMobile";
import AssessmentLedger from "./AssessmentLedger";
import Services from "./Services";
import FramerButton from "../../../../components/ui/framer/FramerButton";

interface AssessStep3Props {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  onBack: () => void;
}

export interface ServiceOption {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  price: number;
  features: string[];
}

const AssessStep3 = ({
  deviceInfo,
  conditionInfo,
  onBack,
}: AssessStep3Props) => {
  const [selectedService, setSelectedService] = useState<string>("");

  const { finalPrice, basePrice, adjustments, grade, gradeTextStyle } =
    usePriceCalculation(deviceInfo, conditionInfo);

  const { data: mobileData, isLoading: isImageLoading } = useMobile(
    deviceInfo.brand,
    deviceInfo.model,
  );

  const services: ServiceOption[] = [
    {
      id: "sell", // primary → pink
      title: "ขายทันที",
      description: "รับเงินสดเต็มจำนวนทันที",
      icon: Banknote,
      price: finalPrice,
      features: [
        "รับเงินสดทันที",
        "โอนเงินภายใน 30 นาที",
        "ไม่มีค่าธรรมเนียม",
        "รับประกันราคา 7 วัน",
      ],
    },
    {
      id: "pawn", // secondary → orange
      title: "บริการจำนำ",
      description: "รับเงินก้อนพร้อมสิทธิ์ไถ่คืน",
      icon: Shield,
      price: Math.round(finalPrice * 0.7),
      features: [
        "รับเงินสดทันที",
        "ไถ่คืนได้ภายใน 6 เดือน",
        "อัตราดอกเบี้ย 2% ต่อเดือน",
        "เก็บเครื่องในสภาพดี",
      ],
    },
    {
      id: "tradein", // violet/indigo
      title: "แลกซื้อเครื่องใหม่ (Trade-in)",
      description: "เพิ่มส่วนลดเมื่ออัปเกรดเครื่องใหม่ที่ร้าน",
      icon: RefreshCw,
      price: Math.round(finalPrice * 1.05), // ม็อกให้มี +โบนัส 5%
      features: [
        "บวกส่วนลดเพิ่ม",
        "เลือกรุ่นใหม่ได้ทันที",
        "โอนย้ายข้อมูลให้",
        "ประกันความพึงพอใจ 7 วัน",
      ],
    },
    {
      id: "consignment", // teal/cyan
      title: "ฝากขาย (Consignment)",
      description: "เราช่วยประกาศขายเพื่อให้ได้ราคาดีที่สุด",
      icon: ShoppingBag,
      price: Math.round(finalPrice * 1.15), // ม็อก: ถ้าขายได้จะได้มากขึ้น
      features: [
        "ทีมการตลาดลงประกาศ",
        "ถ่ายรูปสินค้าโปร",
        "อัปเดตสถานะเป็นระยะ",
        "คิดค่าบริการเมื่อขายได้",
      ],
    },
    {
      id: "refurbish", // emerald/green
      title: "ฟื้นฟูสภาพก่อนขาย (Refurbish)",
      description: "บริการทำความสะอาด/ปรับสภาพ เพิ่มโอกาสขายได้ราคาสูง",
      icon: Wrench,
      price: Math.round(finalPrice * 1.1), // ม็อก: หลังฟื้นฟูมูลค่าเพิ่ม
      features: [
        "ทำความสะอาดภายนอก",
        "ขัดลบรอยเบื้องต้น",
        "ตรวจเช็กฮาร์ดแวร์",
        "รายงานผลก่อนขาย",
      ],
    },
    {
      id: "installment", // rose/pink
      title: "ผ่อนชำระ",
      description: "แบ่งจ่ายสบายใจ ไม่ต้องจ่ายเต็ม",
      icon: CreditCard,
      price: Math.round(finalPrice / 6), // ม็อก: แสดงค่างวด/เดือน (6 เดือน)
      features: [
        "ยืนยันตัวตนออนไลน์",
        "อนุมัติไว",
        "ดอกเบี้ยโปรโมชัน",
        "ผ่อนยาวได้ตามโปร",
      ],
    },
    {
      id: "delivery", // amber/yellow
      title: "รับส่งเครื่องถึงบ้าน",
      description: "เรียกแมสเซนเจอร์รับเครื่อง/ส่งคืน สะดวกปลอดภัย",
      icon: Truck,
      price: 199, // ม็อกค่าบริการคงที่
      features: [
        "รับ-ส่งถึงที่",
        "แพ็กอย่างแน่นหนา",
        "ติดตามสถานะเรียลไทม์",
        "มีประกันการขนส่ง",
      ],
    },
  ];

  const handleConfirm = () => {
    if (selectedService) {
      alert("ขอบคุณสำหรับการใช้บริการ! เราจะติดต่อกลับภายใน 24 ชั่วโมง");
    }
  };

  return (
    <div className="card-assessment flex w-full flex-col gap-8">
      <div className="text-center">
        <h2 className="text-foreground mb-2 text-2xl font-bold">
          สรุปผลการประเมิน
        </h2>
      </div>

      <div className="flex flex-col md:flex-row md:gap-8">
        {/* Left Column: Summary */}
        <div className="flex flex-1 flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <div className="border-border w-full rounded-2xl border p-2">
            <div className="relative flex flex-col items-center gap-6 sm:flex-row">
              <div className="bg-accent/20 flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-lg">
                <AnimatePresence mode="wait">
                  {isImageLoading ? (
                    <motion.div
                      key="loader"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                    </motion.div>
                  ) : mobileData?.image_url ? (
                    <motion.div
                      key="image"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Image
                        src={mobileData.image_url}
                        alt={`${deviceInfo.brand} ${deviceInfo.model}`}
                        width={100}
                        height={100}
                        className="object-contain"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="no-image"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ImageOff className="text-muted-foreground h-8 w-8" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-foreground text-xl font-bold">
                  {deviceInfo.model}
                </h3>
                <p className="text-muted-foreground">{deviceInfo.brand}</p>
                <p className="text-muted-foreground text-sm">
                  {deviceInfo.storage}
                </p>
              </div>
              <div className="absolute right-4 flex items-baseline justify-center">
                <span
                  className={`bg-gradient-to-br bg-clip-text text-[72px] font-bold text-transparent ${gradeTextStyle} `}
                >
                  {grade}
                </span>
              </div>
            </div>
          </div>

          <div className="from-primary/10 to-secondary/10 border-primary/20 rounded-2xl border bg-gradient-to-r p-6 text-center">
            <p className="text-muted-foreground mt-2 mb-2 text-sm font-medium">
              ราคาประเมินเบื้องต้น
            </p>
            <p className="from-primary to-secondary bg-gradient-to-br bg-clip-text text-4xl font-bold text-transparent">
              ฿{finalPrice.toLocaleString()}
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              *ราคาสุดท้ายขึ้นอยู่กับการตรวจสอบเครื่องจริง
            </p>
          </div>

          <div className="border-border w-full rounded-2xl">
            <AssessmentLedger adjustments={adjustments} />
          </div>
        </div>

        {/* Right Column: Service Selection */}
        <Services
          services={services}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
        />
      </div>

      <div className="border-border flex justify-between border-t pt-6">
        <FramerButton
          variant="ghost"
          onClick={onBack}
          className="border-border text-foreground hover:bg-accent flex h-12 items-center rounded-xl border px-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">ย้อนกลับ</span>
        </FramerButton>
        <FramerButton
          onClick={handleConfirm}
          disabled={!selectedService}
          size="lg"
          className="text-primary-foreground h-12 transform-gpu rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-8 text-base font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/30 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          ยืนยันการเลือก
        </FramerButton>
      </div>
    </div>
  );
};

export default AssessStep3;
