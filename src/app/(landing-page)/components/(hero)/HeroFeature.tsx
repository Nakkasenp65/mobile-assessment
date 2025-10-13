// src/app/(main)/components/(hero)/HeroFeature.tsx

import { PiggyBank, ShieldCheck, Tag, Truck } from "lucide-react";

const featuresData = [
  {
    icon: ShieldCheck,
    title: "มีมาตรฐาน",
    description: "ให้ราคาที่เป็นธรรม โปร่งใส ไม่ต้องต่อรองให้เสียเวลา",
  },
  {
    icon: Tag,
    title: "ขายได้ราคาดี",
    description: "ประเมินราคาสูงตามสภาพจริง เหมือนมาขายที่หน้าร้าน",
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

export default function HeroFeature() {
  return (
    <section className={"w-full rounded-2xl bg-white p-6 shadow-xl"}>
      {/* Content */}
      <div className="relative">
        {/* HeroFeature - Head */}
        <div className="text-center sm:mb-6">
          <div className="mb-2 flex items-center justify-center gap-2">
            <h2 className="text-lg font-bold text-black sm:text-2xl">
              ขายกับ{" "}
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text font-bold text-transparent">
                OK Mobile
              </span>{" "}
              ดียังไง
            </h2>
          </div>
          <div className="mx-auto mt-2 h-1.5 w-20 rounded-full bg-gradient-to-r from-orange-400 via-pink-400 to-fuchsia-400 shadow-lg shadow-orange-300/60 sm:w-28" />
        </div>

        {/* HeroFeature - Content */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:gap-5 lg:grid-cols-4 lg:gap-8">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border-2 border-orange-100/70 bg-gradient-to-br from-orange-50/90 to-pink-50/90 p-3 px-2 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-pink-200/90 hover:bg-white hover:shadow-2xl"
            >
              {/* Content */}
              <div className="relative z-10">
                {/* Icon Container with glow */}
                <div className="relative mx-auto mb-2 flex h-14 w-14 transform items-center justify-center rounded-full border-2 border-orange-100/50 bg-white shadow-lg transition group-hover:scale-110 group-hover:border-pink-200/70 group-hover:shadow-xl">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-200/30 to-pink-200/30 blur-md transition-all group-hover:blur-lg" />
                  <feature.icon className="relative h-8 w-8 text-orange-500 transition-colors group-hover:text-pink-500" />
                </div>

                {/* Content - title */}
                <h3 className="bg-gradient-to-r from-orange-500 via-pink-500 to-fuchsia-500 bg-clip-text text-xs font-bold text-transparent sm:text-lg">
                  {feature.title}
                </h3>
                {/* Content - description */}
                <p className="text-[10px] leading-tight sm:text-xs sm:leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
