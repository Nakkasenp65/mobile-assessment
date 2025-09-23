// src/app/(main)/components/HeroFeatures.tsx
"use client";

import { PiggyBank, ShieldCheck, Tags, Truck } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "มีมาตรฐาน",
    description: "ไม่สับสน ไม่ต้องต่อรองให้ยุ่งยาก เราให้ราคาที่เป็นธรรม",
  },
  {
    icon: Tags,
    title: "ขายได้ราคาดี",
    description: "ให้ราคาสูงตามสภาพจริง เหมือนกับที่คุณไปขายที่หน้าร้าน",
  },
  {
    icon: Truck,
    title: "รับเครื่องถึงบ้าน",
    description: "สะดวกสบาย ไม่ต้องเสียเวลาเดินทางไปที่ร้านด้วยตัวเอง",
  },
  {
    icon: PiggyBank,
    title: "ฟรี ไม่มีค่าใช้จ่าย",
    description: "ทุกขั้นตอนของเราไม่มีค่าใช้จ่ายแอบแฝง บริการด้วยความจริงใจ",
  },
];

const HeroFeatures = () => {
  return (
    <div className="left-0 z-10 mt-16 flex w-full justify-end md:mt-8">
      {/* responsive content */}
      <div className="container mx-auto flex flex-col gap-8 px-4">
        {/* Header */}
        <div className="flex flex-col text-center md:mt-0">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl lg:text-4xl">
            ขายกับ{" "}
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              Ok Mobile
            </span>{" "}
            ดียังไง
          </h2>
          <div className="mx-auto my-3 h-1 w-32 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 md:w-40" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group flex flex-col items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20 sm:p-6"
              >
                {/* Icon Container */}
                <div className="grid place-items-center rounded-full bg-gradient-to-br from-orange-400 to-pink-500 p-4 shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Icon
                    className="h-6 w-6 text-white md:h-8 md:w-8 lg:h-10 lg:w-10"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Text Content */}
                <div className="flex flex-col items-center text-center">
                  <h3 className="text-lg font-semibold text-white md:text-xl lg:text-xl">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-200 md:text-base lg:text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeroFeatures;
