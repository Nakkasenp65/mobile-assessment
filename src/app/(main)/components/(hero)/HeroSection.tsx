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
          className="h-full object-cover blur-md"
          aria-hidden="true"
        />
        {/* Background overlay pink */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-orange-400/40 via-pink-100/25 to-pink-500/75" />
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-black to-black drop-shadow-2xl sm:via-black/25" />
      </div>

      {/* CONTAINER: จัดวางเนื้อหาทั้งหมด */}
      {/* 
        - ใช้ min-h-screen เพื่อให้ section สูงเต็มหน้าจอเป็นอย่างน้อย
        - เพิ่ม padding ด้านบนและล่าง (py-16, sm:py-24) เพื่อให้มีพื้นที่หายใจ
        - justify-center เพื่อจัดให้อยู่ตรงกลางแนวตั้ง
      */}
      <div className="relative z-20 flex w-full flex-col items-center justify-center px-4 py-8">
        {/* Wrapper สำหรับ Slider และ Form */}
        {/*
          - Mobile (default): flex-col, items-center, gap-8 -> เรียงบนลงล่าง, อยู่กลาง, มีช่องว่างระหว่างกัน 8 (2rem)
          - Tablet (sm): flex-row, items-center, justify-center, gap-12 -> เรียงซ้ายไปขวา, จัดกลางแนวนอน-ตั้ง, มีช่องว่าง 12 (3rem)
        */}
        <div className="container flex w-full flex-col items-center justify-center gap-8 sm:flex-row sm:items-center sm:gap-12 lg:gap-16">
          <HeroImageSlider />
          <HeroAssessmentForm />
        </div>

        {/* ขายกับ OK Mobile ดียังไง (เพิ่มระยะห่างด้านบน) */}
        <div className="mt-8 sm:mt-16">
          <HeroFeatures />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
