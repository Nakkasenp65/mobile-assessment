import FramerButton from "../../../components/ui/framer/FramerButton";
import Image from "next/image";

const CtaSection = () => (
  // 1. ทำให้ Section เต็มความกว้าง และเพิ่ม Padding แนวตั้ง
  <section className="relative isolate overflow-hidden py-24 sm:py-32">
    {/* 2. สร้าง Layer พื้นหลังที่ซับซ้อนและสวยงาม */}
    <div className="absolute inset-0 -z-20">
      <Image
        src="/assets/store.webp"
        alt="พื้นหลังร้าน OK Mobile"
        fill
        priority={false}
        className="object-cover"
        sizes="100vw"
      />
    </div>
    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-900/75 to-slate-900" />

    {/* 3. สร้าง Container สำหรับเนื้อหา */}
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-7xl">
        {/* 4. ใช้ Flexbox สำหรับ Layout ที่ยืดหยุ่น */}
        <div className="flex flex-col items-center gap-x-16 gap-y-10 text-center md:flex-row md:justify-between md:text-left">
          {/* Text Content */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              ยังมีคำถามอื่นๆ อีกไหม? <br />
              <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                เราพร้อมให้คำปรึกษา
              </span>
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-300">
              ทีมงานของเราพร้อมตอบทุกคำถามและช่วยเหลือคุณอย่างเต็มที่
            </p>
          </div>
          {/* Buttons */}
          <div className="flex flex-shrink-0 items-center justify-center gap-4">
            <FramerButton
              size="lg"
              className="h-14 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-8 text-base font-semibold text-white shadow-lg"
            >
              แชทกับเรา
            </FramerButton>
            <FramerButton
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-2 border-white bg-transparent px-8 text-base font-semibold text-black hover:bg-white hover:text-slate-800"
            >
              โทรสอบถาม
            </FramerButton>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CtaSection;
