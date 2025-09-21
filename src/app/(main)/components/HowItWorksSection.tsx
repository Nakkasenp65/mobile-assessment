"use client";

import Image from "next/image";

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
  <section className="to-card p-6 backdrop-blur-3xl sm:p-10 md:p-16">
    <div className="from-primary/10 to-secondary/10 relative mx-auto flex flex-col rounded-4xl border bg-gradient-to-br p-6 text-center md:p-8">
      <Image
        className="absolute top-0 left-0 -z-10 h-full w-full rounded-4xl object-cover blur-sm"
        src={"/assets/store.webp"}
        width={500}
        height={500}
        alt="store background"
      />
      <div className="absolute top-0 left-0 -z-10 h-full w-full rounded-4xl bg-gradient-to-br from-0% via-white/50 to-pink-500/50" />
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="text-2xl font-bold md:text-3xl">
          Ok Mobile รับซื้อไอโฟนจำนวนมาก
        </h2>
        <div className="from-primary to-secondary h-1 w-24 rounded-xl bg-gradient-to-r" />
        <p className="text-muted-foreground mb-8 text-base md:text-lg">
          3 ขั้นตอนง่ายๆ ขายไอโฟนกับเรา
        </p>
      </div>
      <div className="flex flex-col items-center lg:flex-row">
        <div className="flex w-full items-center justify-center gap-4">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="border-secondary mx-auto mb-2 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-2 bg-gradient-to-br from-pink-200 to-pink-300 shadow-lg duration-500 ease-in-out hover:-translate-y-3 hover:scale-105 md:h-28 md:w-28">
                <img
                  src={step.icon}
                  alt={step.title}
                  className="h-8 w-8 md:h-8 md:w-8"
                />
              </div>
              {/* [FIX] Responsive font size for the step title */}
              <h4 className="text-md font-bold text-pink-500 md:text-2xl">
                {step.title}
              </h4>
            </div>
          ))}
        </div>
        <div className="mt-8 w-full max-w-xs lg:mt-0 lg:max-w-xs">
          <img
            src="https://applehouseth.com/_next/static/media/%E0%B8%96%E0%B8%B7%E0%B8%AD%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%96%E0%B8%B7%E0%B8%AD-%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99-1.a6f84525.webp"
            alt="Woman holding iPhone"
            className="-mb-16 drop-shadow-sm drop-shadow-black/50"
          />
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
