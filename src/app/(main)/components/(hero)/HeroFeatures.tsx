// src/app/(main)/components/(hero)/HeroFeatures.tsx
"use client";

import { ShieldCheck, Tag, Truck, PiggyBank } from "lucide-react";

// ข้อมูลสำหรับ Feature Cards
const featuresData = [
  {
    icon: <ShieldCheck className="h-12 w-12 text-pink-500" />,
    title: "มีมาตรฐาน",
    description: "ให้ราคาที่เป็นธรรม โปร่งใส ไม่ต้องต่อรองให้เสียเวลา",
  },
  {
    icon: <Tag className="h-12 w-12 text-pink-500" />,
    title: "ขายได้ราคาดี",
    description: "ประเมินราคาสูงตามสภาพจริง เหมือนมาขายที่หน้าร้าน",
  },
  {
    icon: <Truck className="h-12 w-12 text-pink-500" />,
    title: "รับเครื่องถึงบ้าน",
    description: "สะดวกสบายด้วยบริการ Delivery ไม่ต้องเดินทางเอง",
  },
  {
    icon: <PiggyBank className="h-12 w-12 text-pink-500" />,
    title: "ฟรี ไม่มีค่าใช้จ่าย",
    description: "ทุกขั้นตอนบริการฟรี ไม่มีค่าใช้จ่ายแอบแฝงแน่นอน",
  },
];

const HeroFeatures = () => {
  return (
    <section className="w-full bg-black/50 py-6 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            ขายกับ <span className="text-orange-300">Ok Mobile</span> ดียังไง
          </h2>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-orange-400 to-pink-500" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 lg:grid-cols-4">
          {featuresData.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {/* Circular Icon */}
              <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">
                {feature.icon}
              </div>
              {/* Text Content */}
              <h3 className="mb-2 text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-white/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroFeatures;
