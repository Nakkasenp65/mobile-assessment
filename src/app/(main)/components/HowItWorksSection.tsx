"use client";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";

const steps = [
  {
    icon: "https://applehouseth.com/images/icons/assessment_icon.png",
    title: "ประเมิน",
  },
  {
    icon: "https://applehouseth.com/images/icons/calendar_icon.png",
    title: "นัดหมาย",
  },
  {
    icon: "https://applehouseth.com/images/icons/payment_icon.png",
    title: "รับเงินทันที",
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
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
    </div>

    {/* Content Container */}
    <div className="relative z-10 pt-16 md:pt-24">
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

        {/* --- START: การเปลี่ยนแปลง Layout หลัก --- */}
        {/* 
          1. สร้าง Flex Container หลักเพื่อทำหน้าที่เป็น "กลุ่ม" และจัดให้อยู่กลาง
        */}
        <div className="flex flex-col items-center md:flex-row md:items-end md:justify-center md:gap-8">
          {/* Steps Container */}
          <div role="list" aria-describedby="how-desc" className="order-1 flex items-center">
            <div className="flex items-start justify-center gap-2 sm:gap-4 md:mb-24">
              {steps.map((step, index) => (
                <React.Fragment key={step.title}>
                  <div role="listitem" className="flex flex-col items-center text-center">
                    {/* Circle - 2. ลดขนาดลงเล็กน้อยตามคำแนะนำ */}
                    <div className="relative">
                      <div
                        className="grid aspect-square w-20 place-items-center rounded-full bg-gradient-to-br from-pink-100 to-pink-300 shadow-lg ring-1 shadow-pink-400/30 ring-white/50 transition-transform duration-300 hover:-translate-y-1 sm:w-24 md:w-24 lg:w-28"
                        tabIndex={0}
                        aria-label={step.title}
                      >
                        <span
                          className="absolute -top-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-pink-600 text-sm font-bold text-white shadow-md md:h-7 md:w-7"
                          aria-hidden
                        >
                          {index + 1}
                        </span>
                        <img
                          src={step.icon}
                          alt=""
                          className="h-10 w-10 object-contain select-none sm:h-12 md:h-12 lg:h-14"
                        />
                      </div>
                    </div>
                    <h4 className="mt-4 text-base font-bold text-nowrap text-pink-500 md:text-lg">{step.title}</h4>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="pt-8 sm:pt-10 md:pt-10 lg:pt-12">
                      <ChevronRight className="h-8 w-8 text-gray-300" strokeWidth={1.5} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Illustration (The Woman) */}
          <div className="order-2 mt-4 w-full md:mt-0 md:w-auto md:flex-shrink-0">
            <Image
              width={600}
              height={800}
              src="https://lh3.googleusercontent.com/d/1TuqxKpYBdgpK-rtul5auS0b0B84JyBoG?format=webp"
              alt="ลูกค้าผู้หญิงถือไอโฟน"
              className="h-[50vh] max-h-[450px] w-full object-contain object-bottom md:h-auto md:w-80 md:object-cover lg:w-96"
            />
          </div>
        </div>
        {/* --- END: การเปลี่ยนแปลง Layout หลัก --- */}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
