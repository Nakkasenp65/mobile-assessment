// src/app/(main)/components/(hero)/HeroSection.tsx
"use client";

import HeroImageSlider from "./HeroImageSlider";
import HeroAssessmentForm from "./HeroAssessmentForm";
import HeroFeatures from "./HeroFeatures";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0 h-full w-full">
        <div className="hero-background-image z-0" />
        <Image
          src="https://lh3.googleusercontent.com/d/1OfKa-MfaLCH1bv9j_Z8O7TlBEmqj8eh4"
          alt="Abstract pink and orange texture background"
          width={3000}
          height={3000}
          priority
          className="h-full object-cover"
          aria-hidden="true"
        />
        {/* Background overlay pink */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-orange-400/95 via-pink-300/95 to-pink-500/95" />
      </div>

      {/* CONTAINER: จัดวางเนื้อหาทั้งหมด */}
      <div className="relative z-20 w-full">
        {/* ส่วนที่ 1: Slider และ Form */}
        <div className="flex w-full flex-col items-center justify-center pb-8 sm:p-4">
          <div className="w-full max-w-7xl rounded-xl p-4 backdrop-blur-xl sm:bg-black/15">
            <div className="flex w-full flex-col items-center justify-center gap-8 sm:flex-row sm:items-center sm:gap-12 lg:gap-16">
              <HeroImageSlider />
              <HeroAssessmentForm />
            </div>
          </div>
        </div>

        {/* ส่วนที่ 2: "ขายกับ OK Mobile ดียังไง" Section */}
        <HeroFeatures />
      </div>
    </section>
  );
};

export default HeroSection;
