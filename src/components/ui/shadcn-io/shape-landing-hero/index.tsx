// src/components/ui/shadcn-io/shape-landing-hero.tsx

"use client";

import { motion } from "framer-motion";
import { cn } from "../../../../lib/utils";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ============================================================================
// ElegantShape Component (ไม่มีการเปลี่ยนแปลง)
// ============================================================================
type ElegantShapeProps = {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
};

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/10",
}: ElegantShapeProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "border-2 border-white/20 backdrop-blur-[2px]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]",
          )}
        />
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// HeroGeometric Component (ปรับปรุงด้วย GSAP)
// ============================================================================
type HeroGeometricProps = {
  className?: string;
};

export function HeroGeometric({
  className,
}: HeroGeometricProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ลงทะเบียน ScrollTrigger plugin กับ GSAP
    gsap.registerPlugin(ScrollTrigger);

    // ใช้ gsap.context เพื่อจัดการ animation และ cleanup อัตโนมัติ
    // ทำให้ปลอดภัยสำหรับ React's Strict Mode และการ unmount
    const ctx = gsap.context(() => {
      // เลือก div ที่ครอบ ElegantShape ทั้งหมด
      // เราจะใช้คลาส 'parallax-shape' เพื่อระบุเป้าหมาย
      const shapes = gsap.utils.toArray<HTMLDivElement>(
        ".parallax-shape",
      );

      shapes.forEach((shape) => {
        gsap.to(shape, {
          // กำหนดค่าการเคลื่อนไหวแบบสุ่มเพื่อสร้างมิติที่แตกต่างกัน
          y: gsap.utils.random(-250, 250), // เลื่อนขึ้น/ลง
          x: gsap.utils.random(-150, 150), // เลื่อนซ้าย/ขวาเล็กน้อย

          // ตั้งค่า ScrollTrigger
          scrollTrigger: {
            trigger: containerRef.current, // ใช้ container ของ HeroGeometric เป็นตัวกระตุ้น
            start: "top bottom", // เริ่ม animation เมื่อ top ของ trigger แตะ bottom ของ viewport
            end: "bottom top", // จบ animation เมื่อ bottom ของ trigger แตะ top ของ viewport
            scrub: 1.5, // ทำให้ animation ผูกกับการ scroll อย่างนุ่มนวล (ค่ามากจะหน่วงขึ้น)
          },
        });
      });
    }, containerRef); // Scope context ไปที่ containerRef

    // Cleanup function: จะถูกเรียกเมื่อ component unmount
    return () => ctx.revert();
  }, []); // [] ทำให้ useEffect ทำงานแค่ครั้งเดียวหลัง component mount

  return (
    <div
      ref={containerRef} // [เพิ่ม] กำหนด ref ให้กับ container หลัก
      className={cn(
        "relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white blur-xl",
        className,
      )}
    >
      {/* --- Background Gradient --- */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

      {/* --- Shapes ที่มีสีสันสดใส --- */}
      <div className="absolute inset-0 overflow-hidden">
        {/* [เพิ่ม] เพิ่ม className 'parallax-shape' ให้กับทุก ElegantShape */}
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-rose-500/40"
          className="parallax-shape top-[15%] left-[-10%] md:top-[20%] md:left-[-5%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/40"
          className="parallax-shape top-[70%] right-[-5%] md:top-[75%] md:right-[0%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-orange-500/40"
          className="parallax-shape bottom-[5%] left-[5%] md:bottom-[10%] md:left-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-400/50"
          className="parallax-shape top-[10%] right-[15%] md:top-[15%] md:right-[20%]"
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-cyan-400/50"
          className="parallax-shape top-[5%] left-[20%] md:top-[10%] md:left-[25%]"
        />
      </div>
    </div>
  );
}

export type { HeroGeometricProps, ElegantShapeProps };
