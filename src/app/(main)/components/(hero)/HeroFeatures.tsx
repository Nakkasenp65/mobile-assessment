"use client";

import {
  ShieldCheck,
  Tag,
  Truck,
  PiggyBank,
} from "lucide-react";

const featuresData = [
  {
    icon: ShieldCheck,
    title: "มีมาตรฐาน",
    description:
      "ให้ราคาที่เป็นธรรม โปร่งใส ไม่ต้องต่อรองให้เสียเวลา",
  },
  {
    icon: Tag,
    title: "ขายได้ราคาดี",
    description:
      "ประเมินราคาสูงตามสภาพจริง เหมือนมาขายที่หน้าร้าน",
  },
  {
    icon: Truck,
    title: "รับเครื่องถึงบ้าน",
    description:
      "สะดวกสบายด้วยบริการ Delivery ไม่ต้องเดินทางเอง",
  },
  {
    icon: PiggyBank,
    title: "ฟรี ไม่มีค่าใช้จ่าย",
    description:
      "ทุกขั้นตอนบริการฟรี ไม่มีค่าใช้จ่ายแอบแฝงแน่นอน",
  },
];

const HeroFeatures = () => {
  return (
    <section className="w-full pb-6 sm:pb-14">
      <div className="container mx-auto px-2">
        <div className="rounded-3xl bg-white p-4 shadow-2xl sm:p-8">
          {/* Title */}
          <div className="mb-4 text-center sm:mb-7">
            <h2 className="text-xl font-bold text-slate-900 sm:text-3xl">
              ขายกับ{" "}
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text font-extrabold text-transparent">
                OK Mobile
              </span>{" "}
              ดียังไง
            </h2>
            <div className="mx-auto mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 sm:mt-5 sm:w-28" />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:gap-5 lg:grid-cols-4 lg:gap-8">
            {featuresData.map((feature, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-pink-50 p-3 px-2 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-2xl"
              >
                {/* Icon Container */}
                <div className="mx-auto mb-2 flex h-14 w-14 transform items-center justify-center rounded-full border-2 border-orange-200 bg-white shadow-md transition group-hover:scale-105">
                  <feature.icon className="h-8 w-8 text-orange-500 group-hover:text-pink-500" />
                </div>
                {/* Text Content */}
                <h3 className="mb-1 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-xs font-bold text-transparent sm:text-lg">
                  {feature.title}
                </h3>
                <p className="text-[11px] leading-tight text-slate-600 sm:text-sm sm:leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroFeatures;
