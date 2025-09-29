// HeroSection.tsx
"use client";
import clsx from "clsx";
import {
  PiggyBank,
  ShieldCheck,
  Tag,
  Truck,
  Sparkles,
} from "lucide-react";

import HeroImageSlider from "./HeroImageSlider";
import HeroAssessmentForm from "./HeroAssessmentForm";

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

const HeroSection = () => {
  return (
    <section className="relative h-max w-full overflow-hidden">
      {/* ULTIMATE LUXURY BACKGROUND */}
      <div className="absolute inset-0 h-full w-full">
        {/* Rich vibrant gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-pink-100 to-fuchsia-200" />

        {/* Layered radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-300/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-pink-300/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_top,_var(--tw-gradient-stops))] from-fuchsia-200/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-white/40 to-transparent" />

        {/* Animated mesh gradient spheres */}
        <div className="absolute inset-0 opacity-40">
          <div
            className="absolute top-0 -left-20 h-[700px] w-[700px] animate-pulse rounded-full bg-gradient-to-br from-orange-400/60 to-pink-400/60 blur-3xl"
            style={{ animationDuration: "8s" }}
          />
          <div
            className="absolute -right-20 bottom-0 h-[700px] w-[700px] animate-pulse rounded-full bg-gradient-to-tl from-pink-400/60 to-fuchsia-400/60 blur-3xl"
            style={{
              animationDuration: "10s",
              animationDelay: "2s",
            }}
          />
          <div
            className="absolute top-1/3 left-1/3 h-[500px] w-[500px] animate-pulse rounded-full bg-gradient-to-r from-orange-300/50 to-pink-300/50 blur-3xl"
            style={{
              animationDuration: "12s",
              animationDelay: "4s",
            }}
          />
          <div
            className="absolute right-1/3 bottom-1/3 h-[500px] w-[500px] animate-pulse rounded-full bg-gradient-to-l from-pink-300/50 to-orange-300/50 blur-3xl"
            style={{
              animationDuration: "14s",
              animationDelay: "6s",
            }}
          />
        </div>

        {/* Multiple geometric patterns */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Massive premium glow orbs */}
        <div className="absolute -top-20 left-1/4 h-[800px] w-[800px] rounded-full bg-gradient-to-r from-orange-300/50 to-pink-300/50 blur-3xl" />
        <div className="absolute right-1/4 -bottom-20 h-[800px] w-[800px] rounded-full bg-gradient-to-l from-pink-300/50 to-fuchsia-300/50 blur-3xl" />

        {/* Premium accent lines with glow */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-orange-400/80 to-transparent shadow-lg shadow-orange-300/50" />
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-pink-400/80 to-transparent shadow-lg shadow-pink-300/50" />

        {/* Side accent glows */}
        <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-orange-300/60 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-pink-300/60 to-transparent" />

        {/* Noise texture for premium grain */}
        <div
          className="absolute inset-0 opacity-[0.02] mix-blend-soft-light"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating sparkle effect spots */}
        <div
          className="absolute top-[15%] left-[10%] h-2 w-2 animate-pulse rounded-full bg-orange-400/60 blur-sm"
          style={{ animationDuration: "3s" }}
        />
        <div
          className="absolute top-[25%] right-[15%] h-3 w-3 animate-pulse rounded-full bg-pink-400/60 blur-sm"
          style={{
            animationDuration: "4s",
            animationDelay: "1s",
          }}
        />
        <div
          className="absolute bottom-[20%] left-[20%] h-2 w-2 animate-pulse rounded-full bg-fuchsia-400/60 blur-sm"
          style={{
            animationDuration: "5s",
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute right-[25%] bottom-[30%] h-3 w-3 animate-pulse rounded-full bg-orange-400/60 blur-sm"
          style={{
            animationDuration: "6s",
            animationDelay: "3s",
          }}
        />
      </div>

      {/* Enhanced glass morphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/20 to-white/30 backdrop-blur-[60px]" />

      {/* CONTAINER */}
      <div className="relative z-20 flex w-full flex-col">
        {/* ส่วนที่ 1: Slider และ Form */}
        <div
          className={clsx(
            "flex w-full flex-col items-center justify-center",
          )}
        >
          <div
            className={clsx(
              "container flex w-full flex-col items-center justify-center gap-4 pt-8",
              "md:flex-row md:items-start md:justify-between md:gap-4 md:pt-16",
              "lg:gap-12",
              "xl:pt-8",
            )}
          >
            <HeroImageSlider />
            <HeroAssessmentForm />
          </div>
        </div>

        {/* HeroFeature */}
        <section className="mt-6 w-full pb-6 sm:pb-14 lg:mt-8 xl:mt-2">
          <div className="container mx-auto">
            {/* Enhanced feature card with more depth */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-white/70 bg-white/95 p-4 shadow-2xl ring-2 ring-orange-100/60 backdrop-blur-md sm:p-6">
              {/* Subtle inner glow */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-50/40 via-transparent to-pink-50/40" />

              {/* Content */}
              <div className="relative z-10">
                {/* Title with sparkle */}
                <div className="mb-4 text-center sm:mb-6">
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4 text-orange-400 sm:h-5 sm:w-5" />
                    <h2 className="text-lg font-bold text-black sm:text-2xl">
                      ขายกับ{" "}
                      <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text font-bold text-transparent">
                        OK Mobile
                      </span>{" "}
                      ดียังไง
                    </h2>
                    <Sparkles className="h-4 w-4 text-pink-400 sm:h-5 sm:w-5" />
                  </div>
                  <div className="mx-auto mt-2 h-1.5 w-20 rounded-full bg-gradient-to-r from-orange-400 via-pink-400 to-fuchsia-400 shadow-lg shadow-orange-300/60 sm:w-28" />
                </div>

                {/* Feature Grid with enhanced cards */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:gap-5 lg:grid-cols-4 lg:gap-8">
                  {featuresData.map((feature, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-2xl border-2 border-orange-100/70 bg-gradient-to-br from-orange-50/90 to-pink-50/90 p-3 px-2 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-pink-200/90 hover:bg-white hover:shadow-2xl"
                    >
                      {/* Shine effect on hover */}
                      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                      {/* Content */}
                      <div className="relative z-10">
                        {/* Icon Container with glow */}
                        <div className="relative mx-auto mb-2 flex h-14 w-14 transform items-center justify-center rounded-full border-2 border-orange-100/50 bg-white shadow-lg transition group-hover:scale-110 group-hover:border-pink-200/70 group-hover:shadow-xl">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-200/30 to-pink-200/30 blur-md transition-all group-hover:blur-lg" />
                          <feature.icon className="relative h-8 w-8 text-orange-500 transition-colors group-hover:text-pink-500" />
                        </div>

                        {/* Text Content */}
                        <h3 className="bg-gradient-to-r from-orange-500 via-pink-500 to-fuchsia-500 bg-clip-text text-xs font-bold text-transparent sm:text-lg">
                          {feature.title}
                        </h3>
                        <p className="text-[11px] leading-tight text-slate-600 sm:text-xs sm:leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default HeroSection;
