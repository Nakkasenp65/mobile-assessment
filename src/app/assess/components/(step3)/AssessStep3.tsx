"use client";
import { useState } from "react";
import { ArrowLeft, Banknote, Shield, CheckCircle } from "lucide-react";
import { DeviceInfo, ConditionInfo } from "../../page";
import { LucideIcon } from "lucide-react";
import { usePriceCalculation } from "../../../../hooks/usePriceCalculation";
import AssessmentLedger from "./AssessmentLedger";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface AssessStep3Props {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  onBack: () => void;
}

interface ServiceOption {
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

  const { finalPrice, basePrice, adjustments } = usePriceCalculation(
    deviceInfo,
    conditionInfo,
  );

  const services: ServiceOption[] = [
    {
      id: "sell",
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
      id: "pawn",
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
  ];

  const handleConfirm = () => {
    if (selectedService) {
      alert("ขอบคุณสำหรับการใช้บริการ! เราจะติดต่อกลับภายใน 24 ชั่วโมง");
    }
  };

  return (
    <div className="card-assessment">
      <div className="mb-8 text-center">
        <h2 className="text-foreground mb-2 text-2xl font-bold">
          เลือกบริการและดูราคา
        </h2>
        <p className="text-muted-foreground">
          {deviceInfo.brand} {deviceInfo.model} {deviceInfo.storage}
        </p>
      </div>

      <div className="from-primary/10 to-secondary/10 border-primary/20 mb-8 rounded-2xl border bg-gradient-to-r px-4 pt-4 text-center">
        <p className="text-muted-foreground mb-2 text-sm font-medium">
          ราคาประเมินเบื้องต้น
        </p>
        <p className="from-primary to-secondary bg-gradient-to-br bg-clip-text text-4xl font-bold text-transparent">
          ฿{finalPrice.toLocaleString()}
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          *ราคาสุดท้ายขึ้นอยู่กับการตรวจสอบเครื่องจริง
        </p>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              ดูรายละเอียดการประเมิน
            </AccordionTrigger>
            <AccordionContent>
              <AssessmentLedger
                basePrice={basePrice}
                adjustments={adjustments}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="mb-8 space-y-4">
        <h3 className="text-foreground mb-4 text-lg font-semibold">
          เลือกบริการที่ต้องการ
        </h3>

        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className={`hover:shadow-card cursor-pointer rounded-2xl border p-6 transition-all duration-200 ${
                selectedService === service.id
                  ? "border-primary bg-primary/5 shadow-card ring-primary ring-2"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedService(service.id)}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`rounded-xl p-3 transition-colors ${
                    selectedService === service.id
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-foreground text-lg font-semibold">
                      {service.title}
                    </h4>
                    <p className="text-primary text-2xl font-bold">
                      ฿{service.price.toLocaleString()}
                    </p>
                  </div>

                  <p className="text-muted-foreground mb-4 text-sm">
                    {service.description}
                  </p>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="text-success h-4 w-4" />
                        <span className="text-foreground text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="border-border text-foreground hover:bg-accent flex h-12 items-center rounded-xl border px-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">ย้อนกลับ</span>
        </Button>

        <Button
          onClick={handleConfirm}
          disabled={!selectedService}
          size="lg"
          className="text-primary-foreground h-12 transform-gpu rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-8 text-base font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/30 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          ยืนยันการเลือก
        </Button>
      </div>
    </div>
  );
};

export default AssessStep3;
