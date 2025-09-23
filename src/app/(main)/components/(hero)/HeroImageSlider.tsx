// src/app/(main)/components/HeroImageSlider.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  "https://applehouseth.com/_next/static/media/Banner-B1.ea56d8c2.webp",
  "https://applehouseth.com/_next/static/media/Banner-B3.0ae6f993.webp",
  "https://applehouseth.com/_next/static/media/Banner-B2.b18630aa.webp",
];

const HeroImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Debug
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative aspect-square h-max w-full max-w-lg overflow-hidden">
      <AnimatePresence>
        <motion.img
          key={currentSlide}
          src={slides[currentSlide]}
          alt={`Banner ${currentSlide + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 h-auto w-full object-contain"
        />
      </AnimatePresence>
    </div>
  );
};

export default HeroImageSlider;
