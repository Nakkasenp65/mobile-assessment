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
import { PiggyBank, ShieldCheck, Tags, Truck } from "lucide-react";

const slides = [
  "https://applehouseth.com/_next/static/media/Banner-B1.ea56d8c2.webp",
  "https://applehouseth.com/_next/static/media/Banner-B3.0ae6f993.webp",
  "https://applehouseth.com/_next/static/media/Banner-B2.b18630aa.webp",
];

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
    // ใช้ค่า 900 px เพื่อให้ครอบคลุมเพราะ user มีแนวโน้มที่จะไม่เลื่อนแต่อ่านแค่ข้างบน หรือ hero
    <section className="relative h-[1300px] w-full overflow-hidden px-4 md:h-[1200px] md:px-0 lg:h-[950px]">
      <div className="relative z-20 container mx-auto flex h-full flex-col items-center md:items-end">
        {/* Ad and Form */}
        <div className="flex w-full flex-1 flex-col items-center justify-center md:flex-3 md:flex-row md:items-center md:gap-12">
          {/* Slider */}
          <div className="relative aspect-square h-full w-full max-w-lg overflow-hidden">
            <AnimatePresence>
              <motion.img
                key={currentSlide}
                src={slides[currentSlide]}
                alt={`Banner ${currentSlide + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 h-full w-full object-contain"
              />
            </AnimatePresence>
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2"></div>
          </div>

          {/* Form */}
          {/* คิดว่าควรแยกอีก component */}
          <div className="w-full max-w-md rounded-2xl border border-white/50 bg-white/80 p-8 shadow-2xl backdrop-blur-md">
            <h3 className="text-secondary mb-6 text-center text-2xl font-bold">
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
                {/* แสดงผลก็ต้่อเมื่อ iphone ถูกเลือกเท่านั้น */}
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
        </div>
        <div className="flex-2 lg:flex-1">
          <div className="my-12 text-center md:mt-0">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
              ขายกับ{" "}
              <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                Ok Mobile
              </span>{" "}
              ดียังไง
            </h2>
            <div className="mx-auto my-3 h-1 w-24 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600" />
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="flex items-center gap-2 text-center"
                >
                  {/* Icon Circle */}
                  <div className="grid place-items-center rounded-full bg-white p-3 shadow-lg md:p-4">
                    <Icon
                      className="h-6 w-6 text-pink-500 md:h-10 md:w-10"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    {/* Title */}
                    <h3 className="text-sm font-light text-gray-900 md:font-semibold">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground mt-1 hidden text-left text-sm md:block">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
