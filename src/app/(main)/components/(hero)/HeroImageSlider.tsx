// src/app/(main)/components/(hero)/HeroImageSlider.tsx
"use client";

import { useState, useEffect } from "react";

const slides = [
  "https://applehouseth.com/_next/static/media/Banner-B1.ea56d8c2.webp",
  "https://applehouseth.com/_next/static/media/Banner-B3.0ae6f993.webp",
  "https://applehouseth.com/_next/static/media/Banner-B2.b18630aa.webp",
];

const HeroImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  return (
    // --- การเปลี่ยนแปลง ---
    // Mobile: w-full (เต็มความกว้าง)
    // Tablet (sm): w-1/2 (ครึ่งหนึ่งของ container)
    // Desktop (lg): w-3/5 (สามในห้าส่วน เพื่อให้ใหญ่กว่าฟอร์มเล็กน้อย)
    <div className="relative w-full sm:w-1/2 lg:w-2/6">
      <img
        key={currentSlide}
        src={slides[currentSlide]}
        alt={`Banner ${currentSlide + 1}`}
        className="h-auto w-full object-contain"
      />
    </div>
  );
};

export default HeroImageSlider;
