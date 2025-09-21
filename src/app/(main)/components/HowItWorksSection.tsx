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
  <section className="to-card p-16 backdrop-blur-3xl">
    <div className="from-primary/10 to-secondary/10 mx-auto flex flex-col rounded-4xl bg-gradient-to-br p-8 text-center">
      <h2 className="mb-4 text-3xl font-bold">
        Ok Mobile รับซื้อไอโฟนจำนวนมาก
      </h2>
      <p className="text-muted-foreground mb-12 text-lg">
        3 ขั้นตอนง่ายๆ ขายไอโฟนกับเรา
      </p>
      <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">
        <div className="flex flex-col gap-8 md:flex-row lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="border-secondary animate-floater mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full border-2 bg-gradient-to-br from-pink-200 to-pink-300 shadow-lg duration-500 ease-in-out hover:-translate-y-3 hover:scale-105">
                <img src={step.icon} alt={step.title} className="h-16 w-16" />
              </div>
              <h4 className="text-secondary text-2xl font-bold">
                {step.title}
              </h4>
            </div>
          ))}
        </div>
        <div className="w-full max-w-xs lg:max-w-sm">
          <img
            src="https://applehouseth.com/_next/static/media/%E0%B8%96%E0%B8%B7%E0%B8%AD%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%96%E0%B8%B7%E0%B8%AD-%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99-1.a6f84525.webp"
            alt="Woman holding iPhone"
            className="animate-float-slow"
          />
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
