// HeroImageSlider.tsx
"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/effect-fade";

const slides = [
  {
    src: "https://lh3.googleusercontent.com/d/1OgYezgJZ6xGv4lNVJ3mWs8oVkScE_a-H",
    alt: "รับซื้อ iPhone, iPad, Mac และสินค้า Apple อื่นๆ",
  },
  {
    src: "https://lh3.googleusercontent.com/d/1D-ofpwDdMMYachLUGua3vtD4HcJMXJvB",
    alt: "รับซื้อ iPhone, iPad, Mac และสินค้า Apple อื่นๆ",
  },
  {
    src: "https://lh3.googleusercontent.com/d/1ksOUeSz85POHgAOM4yz_7gGfkTOwbzWl",
    alt: "รับซื้อ iPhone, iPad, Mac และสินค้า Apple อื่นๆ",
  },
  {
    src: "https://lh3.googleusercontent.com/d/1oJRHiDMVMuoMwtXcS5ycPMtjmS-rHvlx",
    alt: "รับซื้อ iPhone, iPad, Mac และสินค้า Apple อื่นๆ",
  },
];

const HeroImageSlider = () => {
  const swiperRef = useRef(null);

  return (
    // Responsive sizing: Mobile full width, md: slightly larger than 1/2, lg: balanced with form
    <div className="relative w-full md:w-[50%] lg:w-[55%] xl:w-[46%]">
      {/* Background Blob - adjusted for better proportion */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src={"/assets/element.webp"}
          alt="decoration element"
          width={2000}
          height={2000}
          className="scale-90 blur-sm"
        />
      </div>

      {/* Swiper Component with consistent aspect ratio */}
      <div className="aspect-square w-full">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{
            crossFade: true,
          }}
          slidesPerView={1}
          loop={slides.length > 1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          className="h-full w-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide
              key={index}
              className="flex items-center justify-center"
            >
              <div className="flex h-full w-full items-center justify-center">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  width={3000}
                  height={3000}
                  priority={index === 0}
                  className="h-full w-full object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HeroImageSlider;
