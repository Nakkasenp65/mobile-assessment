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
  // 1. เพิ่ม overflow-hidden ที่ container หลักเพื่อตัดขอบส่วนเกิน
  <section
    aria-labelledby="how-title"
    className="relative isolate container mx-auto overflow-hidden rounded-4xl"
  >
    {/* Background Image (เหมือนเดิม) */}
    <div className="absolute inset-0">
      <Image
        src="/assets/store.webp"
        alt=""
        fill
        priority={false}
        className="rounded-4xl object-cover"
        sizes="100vw"
      />
    </div>

    {/* 2. สร้าง Layer สำหรับทำ Backdrop Blur โดยเฉพาะ และขยายให้ใหญ่กว่ากรอบเล็กน้อย */}
    <div className="absolute inset-[-2px] bg-gradient-to-b from-white via-pink-200/25 to-white backdrop-blur-sm"></div>

    {/* 3. ทำให้ Content ทั้งหมดอยู่บน Layer ใหม่ที่ไม่มี backdrop-blur */}
    <div className="relative z-10 p-8 md:p-16">
      {/* Header (เหมือนเดิม) */}
      <div className="text-center">
        <h2
          id="how-title"
          className="text-xl font-extrabold tracking-tight text-slate-900 md:text-3xl"
        >
          Ok Mobile รับซื้อไอโฟนจำนวนมาก
        </h2>
        <div className="mx-auto my-3 h-1 w-24 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600" />
        <p
          id="how-desc"
          className="text-muted-foreground mx-auto mb-10 max-w-2xl text-sm md:text-base"
        >
          3 ขั้นตอนง่ายๆ ขายไอโฟนกับเรา
        </p>
      </div>

      <div className="flex flex-col items-center gap-12 md:flex-row md:items-center md:justify-center">
        {/* Illustration (The Woman) */}
        <div className="order-1 md:order-2">
          <Image
            width={600}
            height={600}
            src="/assets/customer.webp"
            alt="ลูกค้าถือไอโฟน"
            className="max-w-[16rem] drop-shadow-lg drop-shadow-black/25 md:max-w-xs"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Steps Container */}
        <div
          role="list"
          aria-describedby="how-desc"
          className="order-2 w-full md:order-1 md:flex-1"
        >
          <div className="-mr-2 flex items-center justify-center gap-4 md:gap-6">
            {steps.map((step, index) => (
              <React.Fragment key={step.title}>
                <div
                  role="listitem"
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative">
                    <div
                      className={
                        "ring-secondary mx-auto mb-2 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-pink-200 to-pink-300 shadow-[0_0_1px_#fff,inset_0_0_1px_#fff,0_0_3px_var(--color-secondary),0_0_4px_var(--color-secondary),0_0_24px_var(--color-secondary)] ring duration-300 hover:-translate-y-1 hover:scale-[1.03] md:h-32 md:w-32"
                      }
                      tabIndex={0}
                      aria-label={step.title}
                    >
                      <span
                        className="pointer-events-none absolute -top-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-pink-600 text-xs font-bold text-white shadow-md md:-top-3 md:-right-3 md:h-8 md:w-8"
                        aria-hidden
                      >
                        {index + 1}
                      </span>
                      <img
                        src={step.icon}
                        alt=""
                        className="h-14 w-14 max-w-md object-contain select-none"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-nowrap text-pink-500 md:text-xl">
                    {step.title}
                  </h4>
                </div>

                {index < steps.length - 1 && (
                  <ChevronRight className="md:w- mb-6" strokeWidth={1} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
