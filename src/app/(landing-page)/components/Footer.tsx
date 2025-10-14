// src\app\(landing-page)\components\Footer.tsx

"use client";

import * as React from "react";
import {
  Phone,
  Envelope,
  FacebookLogo,
  ChatTeardropText, // LINE
  TwitterLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";

export default function Footer() {
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("กรุณากรอกอีเมลให้ถูกต้อง");
      return;
    }
    alert("ขอบคุณที่ติดตามเรา! เราจะส่งข่าวสารให้คุณเป็นระยะ");
    e.currentTarget.reset();
  };

  return (
    <footer className="relative isolate block">
      {/* Backgrounds (ไม่มีการเปลี่ยนแปลง) */}

      <div className="absolute inset-0 -z-10 bg-gray-100" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-pink-50/40 via-white to-orange-50/40" />

      <div className="container mx-auto px-4 py-8">
        {/* Grid Layout หลัก (ไม่มีการเปลี่ยนแปลง) */}
        <div className="grid grid-cols-1 gap-y-10 md:grid-cols-4 md:gap-x-8 md:gap-y-12 lg:grid-cols-[5fr_3fr_2fr_2fr]">
          <section aria-labelledby="footer-about" className="md:col-span-4 lg:col-span-1">
            <h2 id="footer-about" className="sr-only">
              เกี่ยวกับ OK Mobile
            </h2>
            <Link
              href="/"
              className="mb-5 inline-flex items-center gap-3 text-2xl font-extrabold tracking-tight text-gray-900"
              aria-label="OK Mobile"
            >
              <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                OK Mobile
              </span>
            </Link>
            <h3 className="mb-3 text-lg leading-snug font-bold text-gray-900 md:text-xl">
              รับซื้อโทรศัพท์ทุกรุ่น พร้อมบริการถึงที่
              <br className="hidden md:block" />
              ให้ราคาดีที่คุณต้องถูกใจ
            </h3>
            <p className="text-muted-foreground max-w-prose text-sm leading-relaxed">
              OK Mobile บริการรับซื้อมือถือราคาสูงทุกรุ่น รู้ราคาภายใน 1 นาที พร้อมประเมินราคายุติธรรมกว่าท้องตลาด
              รับซื้อ iPhone, Samsung, OPPO และอีกมากมาย
            </p>
          </section>

          {/* Column 2: Subscribe & Contact (ไม่มีการเปลี่ยนแปลง) */}
          <section aria-labelledby="footer-subscribe">
            <h3 id="footer-subscribe" className="mb-4 text-sm font-bold tracking-wider text-gray-900 uppercase">
              Subscribe
            </h3>
            <form
              onSubmit={onSubmit}
              className="mb-5 flex w-full overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-pink-500/40"
            >
              <input
                name="email"
                type="email"
                inputMode="email"
                placeholder="อีเมลของคุณ"
                aria-label="อีเมลของคุณ"
                className="h-12 w-0 flex-1 px-4 text-sm outline-none"
                required
              />
              <button
                type="submit"
                className="h-12 min-w-20 bg-gradient-to-r from-orange-500 to-pink-600 px-5 text-sm font-bold text-white transition-all hover:brightness-110 active:translate-y-px"
              >
                สมัคร
              </button>
            </form>
            <ul className="flex flex-col items-start gap-4 text-sm" aria-label="ช่องทางการติดต่อ">
              <li className="text-muted-foreground flex items-center gap-2">
                <Phone size={18} aria-hidden />
                <a href="tel:0989509222" className="hover:text-gray-900">
                  098-950-9222
                </a>
              </li>
              <li className="text-muted-foreground flex items-center gap-2">
                <Envelope size={18} aria-hidden />
                <a href="mailto:OKMobile@gmail.com" className="hover:text-gray-900">
                  OKMobile@gmail.com
                </a>
              </li>
            </ul>
          </section>

          {/* Accordion สำหรับจอมือถือ (ไม่มีการเปลี่ยนแปลง) */}
          <div className="block md:hidden">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="customer-service">
                <AccordionTrigger className="text-sm font-bold tracking-wider text-gray-900 uppercase">
                  ศูนย์ดูแลลูกค้า
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 pt-2">
                    <li>
                      <a href="#" className="text-muted-foreground text-sm">
                        คำถามบ่อยๆ
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-muted-foreground text-sm">
                        วิธีการขายสินค้า
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-muted-foreground text-sm">
                        วิธีการรับเงิน
                      </a>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="company">
                <AccordionTrigger className="text-sm font-bold tracking-wider text-gray-900 uppercase">
                  OK Mobile
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 pt-2">
                    <li>
                      <a href="#" className="text-muted-foreground text-sm">
                        เกี่ยวกับ OK Mobile
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-muted-foreground text-sm">
                        ข้อกำหนดและเงื่อนไข
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-muted-foreground text-sm">
                        นโยบายความเป็นส่วนตัว
                      </a>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Layout เดิมสำหรับจอ Desktop (ไม่มีการเปลี่ยนแปลง) */}
          <nav aria-labelledby="footer-customer" className="hidden md:block">
            <h3 id="footer-customer" className="mb-4 text-sm font-bold tracking-wider text-gray-900 uppercase">
              ศูนย์ดูแลลูกค้า
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground text-sm transition-colors hover:text-gray-900">
                  คำถามบ่อยๆ
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground text-sm transition-colors hover:text-gray-900">
                  วิธีการขายสินค้า
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground text-sm transition-colors hover:text-gray-900">
                  วิธีการรับเงิน
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-company" className="hidden md:block">
            <h3 id="footer-company" className="mb-4 text-sm font-bold tracking-wider text-gray-900 uppercase">
              OK Mobile
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground text-sm transition-colors hover:text-gray-900">
                  เกี่ยวกับ OK Mobile
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground text-sm transition-colors hover:text-gray-900">
                  ข้อกำหนดและเงื่อนไข
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground text-sm transition-colors hover:text-gray-900">
                  นโยบายความเป็นส่วนตัว
                </a>
              </li>
            </ul>
          </nav>

          {/* 
            --- [ปรับปรุง] Social Icons ---
            - ลบ col-span class ที่ไม่จำเป็นออก
          */}
          <div>
            <h3 className="mb-3 text-sm font-bold tracking-wider text-gray-900 uppercase">Follow Us</h3>
            <ul className="flex gap-2" aria-label="โซเชียลมีเดีย">
              <li>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877f2] text-white shadow-sm transition-transform hover:-translate-y-1"
                >
                  <FacebookLogo size={20} weight="fill" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  aria-label="LINE"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#06c755] text-white shadow-sm transition-transform hover:-translate-y-1"
                >
                  <ChatTeardropText size={20} weight="fill" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  aria-label="Twitter/X"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1da1f2] text-white shadow-sm transition-transform hover:-translate-y-1"
                >
                  <TwitterLogo size={20} weight="fill" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff0000] text-white shadow-sm transition-transform hover:-translate-y-1"
                >
                  <YoutubeLogo size={20} weight="fill" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Subfooter (ไม่มีการเปลี่ยนแปลง) */}
      <div className="border-t border-white/60 bg-gray-200/90 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-xs md:text-sm">
            © {new Date().getFullYear()} OK Mobile. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
