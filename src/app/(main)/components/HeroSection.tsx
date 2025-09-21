"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const slides = [
  "https://applehouseth.com/_next/static/media/Banner-B1.ea56d8c2.webp",
  "https://applehouseth.com/_next/static/media/Banner-B3.0ae6f993.webp",
  "https://applehouseth.com/_next/static/media/Banner-B2.b18630aa.webp",
];

const HeroSection = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="container mx-auto mt-4 flex flex-col items-center justify-center gap-12 lg:flex-row">
      {/* Slider (No changes needed) */}
      <div className="relative aspect-square h-auto w-full max-w-lg overflow-hidden rounded-2xl">
        <AnimatePresence>
          <motion.img
            key={currentSlide}
            src={slides[currentSlide]}
            alt={`Banner ${currentSlide + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full scale-90 rounded-4xl object-cover md:scale-100"
          />
        </AnimatePresence>
      </div>

      {/* Form (No changes needed) */}
      <div className="w-full max-w-md rounded-2xl border border-white/50 bg-white/80 px-8 shadow-lg backdrop-blur-md">
        <h3 className="text-secondary mb-6 text-center text-xl font-bold md:text-2xl">
          ประเมินราคาโทรศัพท์ที่ต้องการขาย
        </h3>
        <form className="space-y-5">
          <Select>
            <SelectTrigger className="h-14 w-full text-base">
              <SelectValue placeholder="เลือกรุ่นของ iPhone ของคุณ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="14pm">iPhone 14 Pro Max</SelectItem>
              <SelectItem value="14p">iPhone 14 Pro</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="h-14 w-full text-base">
              <SelectValue placeholder="เลือกความจุ GB" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="128">128GB</SelectItem>
              <SelectItem value="256">256GB</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Checkbox id="icloud-unlock" />
            <label
              htmlFor="icloud-unlock"
              className="text-base leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              สามารถปลดล็อค iCloud ได้
            </label>
          </div>
          <Button
            size="lg"
            onClick={() => router.replace("/assess")}
            className="text-primary-foreground h-14 w-full transform-gpu rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-lg font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/30 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            ประเมินราคา
          </Button>
        </form>
      </div>
    </header>
  );
};

export default HeroSection;
