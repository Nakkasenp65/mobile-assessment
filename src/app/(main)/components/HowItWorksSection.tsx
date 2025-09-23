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
  <section aria-labelledby="how-title" className="relative isolate rounded-4xl">
    {/* Background Image + Gradient Overlay (No changes, as requested) */}
    <div className="absolute inset-0 -z-10">
      <Image
        src="/assets/store.webp"
        alt=""
        fill
        priority={false}
        className="rounded-4xl object-cover"
        sizes="100vw"
      />
    </div>

    {/* Real Element (No changes to background, as requested) */}
    <div className="rounded-4xl bg-gradient-to-b from-white via-pink-200/25 to-white p-8 backdrop-blur-xs md:p-16">
      {/* Header (No changes needed) */}
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

      {/* [CHIRON'S DEFINITIVE FIX] - The new adaptive layout container */}
      {/* This container uses flexbox and responsive ordering to achieve the desired layout. */}
      <div className="flex flex-col items-center gap-12 md:flex-row md:items-center md:justify-center">
        {/* Illustration (The Woman) */}
        {/* On mobile, this is the first item in the flexbox (order-1), appearing after the header. */}
        {/* On desktop (md:), it becomes the second item (order-2) and is aligned to the right. */}
        <div className="order-1 md:order-2">
          <img
            src="https://applehouseth.com/_next/static/media/%E0%B8%96%E0%B8%B7%E0%B8%AD%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%96%E0%B8%B7%E0%B8%AD-%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99-1.a6f84525.webp"
            alt="ลูกค้าถือไอโฟน"
            className="max-w-[12rem] drop-shadow-lg drop-shadow-black/25 md:max-w-xs"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Steps Container */}
        {/* On mobile, this is the second item (order-2), appearing below the illustration. */}
        {/* On desktop (md:), it becomes the first item (order-1) and takes up more space (flex-1). */}
        <div
          role="list"
          aria-describedby="how-desc"
          className="order-2 w-full md:order-1 md:flex-1"
        >
          {/* Circles and arrow (No changes to the internal logic, as requested) */}
          <div className="-mr-2 flex items-center justify-center gap-4 md:gap-6">
            {steps.map((step, index) => (
              <React.Fragment key={step.title}>
                <div
                  role="listitem"
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Icon Circle + Step Number */}
                  <div className="relative">
                    <div
                      className={
                        "ring-secondary mx-auto mb-2 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-pink-200 to-pink-300 shadow-[0_0_1px_#fff,inset_0_0_1px_#fff,0_0_3px_var(--color-secondary),0_0_4px_var(--color-secondary),0_0_24px_var(--color-secondary)] ring duration-300 hover:-translate-y-1 hover:scale-[1.03] md:h-24 md:w-24"
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
                      {/* circle image */}
                      <img
                        src={step.icon}
                        alt=""
                        className="h-14 w-14 max-w-md object-contain select-none md:h-12"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>

                  {/* Under circle title */}
                  <h4 className="text-sm font-bold text-nowrap text-pink-500 md:text-xl">
                    {step.title}
                  </h4>
                </div>

                {index < steps.length - 1 && (
                  <ChevronRight className="neon- mb-6" strokeWidth={1} />
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
