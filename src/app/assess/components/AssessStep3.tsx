"use client";
import { useState } from "react";
import { ArrowLeft, Banknote, Shield, CheckCircle } from "lucide-react";
import { DeviceInfo, ConditionInfo } from "../page";
import { LucideIcon } from "lucide-react";

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

  console.log("deviceInfo Assess 3 : ", deviceInfo);
  console.log("conditionInfo Assess 3 : ", conditionInfo);

  // Mock price calculation based on device and condition
  const calculateBasePrice = () => {
    let basePrice = 20000; // Base price for iPhone 15 Pro

    // Adjust by storage
    if (deviceInfo.storage.includes("256")) basePrice += 3000;
    if (deviceInfo.storage.includes("512")) basePrice += 6000;
    if (deviceInfo.storage.includes("1 TB")) basePrice += 10000;

    // Condition adjustments
    const conditions = Object.values(conditionInfo);
    let conditionMultiplier = 1.0;

    conditions.forEach((condition) => {
      if (
        condition.includes("perfect") ||
        condition.includes("excellent") ||
        condition.includes("yes") ||
        condition.includes("works")
      ) {
        conditionMultiplier *= 1.0;
      } else if (
        condition.includes("minor") ||
        condition.includes("good") ||
        condition.includes("sometimes")
      ) {
        conditionMultiplier *= 0.85;
      } else {
        conditionMultiplier *= 0.6;
      }
    });

    return Math.round(basePrice * conditionMultiplier);
  };

  const basePrice = calculateBasePrice();

  const services: ServiceOption[] = [
    {
      id: "sell",
      title: "ขายทันที",
      description: "รับเงินสดเต็มจำนวนทันที",
      icon: Banknote,
      price: basePrice,
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
      price: Math.round(basePrice * 0.7),
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
      // Handle confirmation logic here
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

      {/* Price Display */}
      <div className="from-primary/10 to-secondary/10 border-primary/20 mb-8 rounded-2xl border bg-linear-to-r p-6 text-center">
        <p className="text-muted-foreground mb-2 text-sm font-medium">
          ราคาประเมินเบื้องต้น
        </p>
        <p className="from-primary to-secondary bg-gradient-to-br bg-clip-text text-4xl font-bold text-transparent">
          ฿{basePrice.toLocaleString()}
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          *ราคาสุดท้ายขึ้นอยู่กับการตรวจสอบเครื่องจริง
        </p>
      </div>

      {/* Service Options */}
      <div className="mb-8 space-y-4">
        <h3 className="text-foreground mb-4 text-lg font-semibold">
          เลือกบริการที่ต้องการ
        </h3>

        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className={`transition-smooth hover:shadow-card cursor-pointer rounded-2xl border p-6 ${
                selectedService === service.id
                  ? "border-primary bg-primary/5 shadow-card"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedService(service.id)}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`rounded-xl p-3 ${
                    selectedService === service.id
                      ? "gradient-primary text-white"
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

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="border-border text-foreground hover:bg-accent transition-smooth flex items-center rounded-xl border p-2 px-3"
        >
          <ArrowLeft className="h-4 w-4" />
          ย้อนกลับ
        </button>

        <button
          onClick={handleConfirm}
          disabled={!selectedService}
          className="text-primary-foreground h-14 transform-gpu rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-3 text-lg font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/30 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          ยืนยันการเลือก
        </button>
      </div>
    </div>
  );
};

export default AssessStep3;
