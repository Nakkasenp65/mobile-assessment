"use client";

import { PiggyBank, ShieldCheck, Tags, Truck } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "มีมาตรฐาน",
    description: "ให้ราคาที่เป็นธรรม โปร่งใส ไม่ต้องต่อรองให้เสียเวลา",
  },
  {
    icon: Tags,
    title: "ขายได้ราคาดี",
    description: "ประเมินราคาสูงตามสภาพจริง เหมือนขายที่หน้าร้าน",
  },
  {
    icon: Truck,
    title: "รับเครื่องถึงบ้าน",
    description: "สะดวกสบายด้วยบริการ Delivery ไม่ต้องเดินทางเอง",
  },
  {
    icon: PiggyBank,
    title: "ฟรี ไม่มีค่าใช้จ่าย",
    description: "ทุกขั้นตอนบริการฟรี ไม่มีค่าใช้จ่ายแอบแฝงแน่นอน",
  },
];

const HeroFeatures = () => {
  return (
    <div className="container mx-auto">
      {/* Header (เหมือนเดิม) */}
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
          ขายกับ{" "}
          <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">Ok Mobile</span>{" "}
          ดียังไง
        </h2>
        <div className="mx-auto my-4 h-1.5 w-32 rounded-full bg-gradient-to-r from-orange-400 to-pink-500" />
      </div>

      {/* Layout Grid (เหมือนเดิม) */}
      <div className="mx-auto mt-12 grid max-w-xl grid-cols-1 gap-x-8 gap-y-6 md:max-w-none md:grid-cols-2 lg:gap-8">
        {features.map((feature) => (
          // --- START: การเปลี่ยนแปลง ---
          // 1. เพิ่ม Style Glassmorphism ให้กับ Container ของแต่ละ Feature
          <div
            key={feature.title}
            className="relative flex items-start gap-x-4 rounded-2xl bg-white/20 p-6 ring-1 ring-white/10 backdrop-blur-2xl transition-all duration-300 hover:bg-white/10"
          >
            {/* Icon Container - 2. ปรับสีพื้นหลังไอคอนให้เข้มขึ้นเล็กน้อยเพื่อความแตกต่าง */}
            <div className="flex h-14 w-14 flex-none items-center justify-center rounded-lg bg-white/10 sm:h-16 sm:w-16">
              <feature.icon className="h-8 w-8 text-white sm:h-9 sm:w-9" aria-hidden="true" strokeWidth={1.5} />
            </div>
            {/* Text Content (เหมือนเดิม) */}
            <div className="flex-auto">
              <h3 className="text-lg leading-7 font-semibold text-white">{feature.title}</h3>
              <p className="mt-1 text-base leading-7 text-gray-300">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroFeatures;
