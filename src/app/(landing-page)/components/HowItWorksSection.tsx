"use client";
import { CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Search, CalendarClock, HandCoins } from "lucide-react";
import Image from "next/image";
import React from "react";

const steps = [
  {
    icon: Search,
    title: "ประเมินราคาออนไลน์",
    description:
      "ส่งรูปและรายละเอียดมือถือของคุณผ่าน LINE หรือ Facebook เพื่อให้ทีมงานของเราประเมินราคาเบื้องต้นได้ทันที",
    colors: {
      bg: "bg-[#F8F5FD]",
      icon: "text-violet-500",
      dot: "bg-violet-500",
    },
  },
  {
    icon: CalendarClock,
    title: "นัดหมายและยืนยัน",
    description: "เลือกสาขาที่สะดวกและนัดวันเวลาเพื่อนำเครื่องเข้ามาให้ทีมงานตรวจสอบสภาพจริงและยืนยันราคาสุดท้าย",
    colors: {
      bg: "bg-[#E5F9FE]",
      icon: "text-cyan-500",
      dot: "bg-cyan-500",
    },
  },
  {
    icon: HandCoins,
    title: "รับเงินสดทันที",
    description: "เมื่อตกลงราคาเรียบร้อยแล้ว คุณสามารถรับเงินสดกลับบ้านได้ทันที ง่ายๆ สะดวกและไม่ต้องรอ",
    colors: {
      bg: "bg-[#FADCDC]",
      icon: "text-pink-500",
      dot: "bg-pink-500",
    },
  },
];

const HowItWorksSection = () => (
  <section aria-labelledby="how-title" className="relative isolate w-full overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0">
      <Image
        src="/assets/store.webp"
        alt="พื้นหลังร้าน OK Mobile"
        fill
        priority={false}
        className="object-cover blur-[2px]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-white/80"></div>
    </div>

    {/* Content Container */}
    <div className="relative z-10 pt-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center">
          <h2
            id="how-title"
            className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl"
          >
            Ok Mobile รับซื้อไอโฟนจำนวนมาก
          </h2>
          <div className="mx-auto my-4 h-1.5 w-24 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600" />
          <p id="how-desc" className="text-muted-foreground mx-auto mb-12 max-w-2xl text-base md:mb-16 md:text-lg">
            3 ขั้นตอนง่ายๆ ขายไอโฟนกับเรา
          </p>
        </div>

        {/* --- โครงสร้าง Layout หลัก --- */}
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-center lg:gap-16">
          {/* ส่วนของขั้นตอน (Steps Section) */}
          <div className="flex w-full flex-row items-start justify-center lg:w-3/5">
            {steps.map((step, index) => (
              <React.Fragment key={step.title}>
                {/* แต่ละขั้นตอน (Step Item) */}
                <div className="flex w-1/3 flex-col items-center p-1 text-center md:p-2">
                  {/* กล่องไอคอน */}
                  <div
                    className={`flex h-16 w-16 flex-shrink-0 place-items-center items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 hover:-translate-y-1 md:h-20 md:w-20 ${step.colors.bg} `}
                  >
                    <step.icon className={`h-8 w-8 md:h-10 md:w-10 ${step.colors.icon}`} strokeWidth={1.5} />
                  </div>
                  <div className="mt-3 w-full md:mt-4">
                    {/* ข้อความ */}
                    <h3 className="text-sm font-bold text-slate-900 md:text-lg">{step.title}</h3>
                    <p className="mt-1 hidden px-1 text-xs text-slate-600 md:mt-2 md:block md:px-0 md:text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* --- [ปรับปรุง] เส้นเชื่อม (Connector) --- */}
                {index < steps.length - 1 && (
                  <div className="relative mx-2 mt-8 flex-1 self-start md:mx-4 md:mt-10">
                    <div className="w-full border-t-2 border-dashed border-gray-300" />
                    {/* 
                      เปลี่ยนมาใช้ CaretRightIcon อันเดียวตรงกลาง
                      - ใช้ `weight="fill"` เพื่อให้เป็นไอคอนแบบทึบ
                      - จัดให้อยู่กึ่งกลางเส้นด้วย absolute, left-1/2, top-1/2 และ translate
                      - ใช้สีของ icon จากขั้นตอนถัดไป (`steps[index + 1].colors.icon`)
                    */}
                    <CaretRightIcon
                      weight="fill"
                      className={`absolute top-1/2 left-1/2 mt-2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 ${steps[index + 1].colors.icon}`}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* ส่วนของรูปผู้หญิง (Illustration Section) */}
          <div className="w-full md:max-w-sm lg:order-first lg:w-2/5 lg:max-w-none">
            <Image
              width={600}
              height={800}
              src="https://lh3.googleusercontent.com/d/1TuqxKpYBdgpK-rtul5auS0b0B84JyBoG?format=webp"
              alt="ลูกค้าผู้หญิงถือไอโฟน"
              className="mx-auto h-auto w-full object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
