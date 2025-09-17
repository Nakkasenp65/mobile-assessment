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

const AssessStep3 = ({ deviceInfo, conditionInfo, onBack }: AssessStep3Props) => {
  const [selectedService, setSelectedService] = useState<string>("");

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
      } else if (condition.includes("minor") || condition.includes("good") || condition.includes("sometimes")) {
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
      features: ["รับเงินสดทันที", "โอนเงินภายใน 30 นาที", "ไม่มีค่าธรรมเนียม", "รับประกันราคา 7 วัน"],
    },
    {
      id: "pawn",
      title: "บริการจำนำ",
      description: "รับเงินก้อนพร้อมสิทธิ์ไถ่คืน",
      icon: Shield,
      price: Math.round(basePrice * 0.7),
      features: ["รับเงินสดทันที", "ไถ่คืนได้ภายใน 6 เดือน", "อัตราดอกเบี้ย 2% ต่อเดือน", "เก็บเครื่องในสภาพดี"],
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
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">เลือกบริการและดูราคา</h2>
        <p className="text-muted-foreground">
          {deviceInfo.brand} {deviceInfo.model} {deviceInfo.storage}
        </p>
      </div>

      {/* Price Display */}
      <div className="bg-linear-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 mb-8 text-center border border-primary/20">
        <p className="text-sm font-medium text-muted-foreground mb-2">ราคาประเมินเบื้องต้น</p>
        <p className="text-4xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
          ฿{basePrice.toLocaleString()}
        </p>
        <p className="text-sm text-muted-foreground mt-2">*ราคาสุดท้ายขึ้นอยู่กับการตรวจสอบเครื่องจริง</p>
      </div>

      {/* Service Options */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">เลือกบริการที่ต้องการ</h3>

        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className={`border rounded-2xl p-6 cursor-pointer transition-smooth hover:shadow-card ${
                selectedService === service.id
                  ? "border-primary bg-primary/5 shadow-card"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedService(service.id)}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`p-3 rounded-xl ${
                    selectedService === service.id ? "gradient-primary text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-foreground">{service.title}</h4>
                    <p className="text-2xl font-bold text-primary">฿{service.price.toLocaleString()}</p>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-sm text-foreground">{feature}</span>
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
          className="flex items-center px-6 py-3 border border-border text-foreground rounded-xl hover:bg-accent transition-smooth"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          ย้อนกลับ
        </button>

        <button
          onClick={handleConfirm}
          disabled={!selectedService}
          className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover transition-smooth shadow-soft hover:shadow-card transform hover:scale-105 disabled:hover:scale-100"
        >
          ยืนยันการเลือก
        </button>
      </div>
    </div>
  );
};

export default AssessStep3;
