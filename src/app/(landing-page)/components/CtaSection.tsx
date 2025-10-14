// src/app/(main)/components/CtaSection.tsx

import FramerButton from "../../../components/ui/framer/FramerButton";
import Image from "next/image";
// [ADD] Import icons
import { MessageSquare, Phone } from "lucide-react";

const CtaSection = () => (
  <section className="relative isolate overflow-hidden bg-slate-900 py-24 sm:py-32">
    {/* Background Image - ทำให้โปร่งแสงลงเล็กน้อยเพื่อขับให้ข้อความเด่นขึ้น */}
    <div className="absolute inset-0 -z-20">
      <Image
        src="/assets/store.webp"
        alt="พื้นหลังร้าน OK Mobile"
        fill
        priority={true}
        className="object-cover opacity-30"
        sizes="100vw"
      />
    </div>

    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-900/15 to-slate-900" />

    {/* Content Container */}
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-x-16 gap-y-10 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
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
          <div className="flex w-full flex-shrink-0 flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
            <FramerButton
              size="lg"
              className="h-14 w-full rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-8 text-base font-semibold text-white shadow-lg sm:w-auto"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              แชทกับเรา
            </FramerButton>
            <FramerButton
              size="lg"
              variant="outline"
              className="h-14 w-full rounded-full border-2 border-white/80 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm hover:border-white hover:bg-white/20 focus-visible:ring-white/50 sm:w-auto"
            >
              <Phone className="mr-2 h-5 w-5" />
              โทรสอบถาม
            </FramerButton>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CtaSection;
