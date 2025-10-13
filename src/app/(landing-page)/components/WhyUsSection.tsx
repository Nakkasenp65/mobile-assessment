"use client";

import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    icon: "https://applehouseth.com/images/icons/retail_feature_icon.png",
    title: "น่าเชื่อถือ ชัวร์",
    desc: "ไว้ใจได้ หมดปัญหาโดนโกง มีหน้าร้านสาขาทั่วไทย",
  },
  {
    icon: "https://applehouseth.com/images/icons/phone_feature_icon.png",
    title: "ง่าย ชัวร์",
    desc: "เพียง 3 ขั้นตอนง่ายๆ ประเมิน > นัดหมาย > รับเงินทันที",
  },
  {
    icon: "https://applehouseth.com/images/icons/payment_feature_icon.png",
    title: "ให้สูง ชัวร์",
    desc: "รับซื้อราคาสูง ยุติธรรมไม่กดราคา",
  },
  {
    icon: "https://applehouseth.com/images/icons/driver_feature_icon.png",
    title: "สะดวก ชัวร์",
    desc: "บริการรับซื้อถึงที่ ฟรี ไม่มีค่าใช้จ่าย",
  },
];

const WhyUsSection = () => {
  return (
    <section aria-labelledby="why-us-title" className="relative isolate container mx-auto">
      <div className="mx-auto mt-16 px-4 py-8 text-center md:px-8 lg:px-12">
        <motion.h2
          id="why-us-title"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-4 text-xl font-extrabold tracking-tight text-slate-900 md:text-4xl"
        >
          ขาย iPhone กับ{" "}
          <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">Ok Mobile</span>{" "}
          ดียังไง?
        </motion.h2>
        <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-sm md:text-base">
          ประสบการณ์ที่ไว้ใจได้ ขั้นตอนเรียบง่าย ได้ราคายุติธรรม และบริการถึงที่
        </p>

        {/* 4 Cards  */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {features.map((feature, i) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.45,
                delay: i * 0.05,
                ease: "easeOut",
              }}
              className={[
                "group relative overflow-hidden rounded-2xl border bg-white/80 p-4 text-left shadow-sm backdrop-blur-md transition-all",
                "border-slate-200/70 hover:border-pink-200/80 dark:border-white/10 dark:bg-white/5",
                "hover:shadow-lg hover:shadow-pink-200/30",
              ].join(" ")}
            >
              {/* แถบไล่สีบนขอบการ์ด (เนียน ๆ) */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500/70 to-pink-600/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* ไอคอนในเม็ดยา + วงแสง */}
              <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/15 to-pink-500/15 blur-md" />
                <div className="relative rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
                  <img src={feature.icon} alt="" loading="lazy" decoding="async" className="h-10 w-10 object-contain" />
                </div>
              </div>

              <h3 className="mb-2 text-center text-base font-bold text-slate-900 md:text-lg">{feature.title}</h3>
              <p className="text-muted-foreground text-center text-xs leading-relaxed md:text-base">{feature.desc}</p>

              {/* ปุ่มเน้นโทนแบรนด์ตอน hover (แถบด้านล่าง) */}
              <div className="pointer-events-none absolute inset-x-6 bottom-0 translate-y-1 border-t border-transparent py-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:border-pink-200/60 group-hover:opacity-100" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
