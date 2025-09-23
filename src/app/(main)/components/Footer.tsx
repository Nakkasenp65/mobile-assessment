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

const Footer: React.FC = () => {
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("กรุณากรอกอีเมลให้ถูกต้อง");
      return;
    }
    // TODO: เรียก API สมัครรับข่าวสารของคุณ
    alert("ขอบคุณที่ติดตามเรา! เราจะส่งข่าวสารให้คุณเป็นระยะ");
    e.currentTarget.reset();
  };

  return (
    <footer className="relative isolate mt-20">
      {/* แถบไฮไลต์ soft gradient ด้านบน */}
      <div className="pointer-events-none absolute inset-x-0 -top-6 mx-auto h-12 max-w-6xl rounded-full bg-gradient-to-r from-orange-400/25 via-pink-400/25 to-fuchsia-400/25 blur-2xl" />
      {/* พื้นหลังนุ่ม โทนเทา + ไล่สีบาง ๆ */}
      <div className="absolute inset-0 -z-10 bg-gray-100" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-pink-50/40 via-white to-orange-50/40" />

      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* กริด 1→2→4 คอลัมน์ */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[5fr_3fr_2fr_2fr]">
          {/* Column 1: About */}
          <section
            aria-labelledby="footer-about"
            className="md:col-span-2 lg:col-span-1"
          >
            <h2 id="footer-about" className="sr-only">
              เกี่ยวกับ OK Mobile
            </h2>
            <a
              href="/"
              className="mb-5 inline-flex items-center gap-3 text-2xl font-extrabold tracking-tight text-gray-900"
              aria-label="OK Mobile"
            >
              <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                OK Mobile
              </span>
            </a>
            <h3 className="mb-3 text-lg leading-snug font-bold text-gray-900 md:text-xl">
              รับซื้อโทรศัพท์ทุกรุ่น พร้อมบริการถึงที่
              <br className="hidden md:block" />
              ให้ราคาดีที่คุณต้องถูกใจ
            </h3>
            <p className="text-muted-foreground max-w-prose text-sm leading-relaxed">
              OK Mobile บริการรับซื้อมือถือราคาสูงทุกรุ่น รู้ราคาภายใน 1 นาที
              พร้อมประเมินราคายุติธรรมกว่าท้องตลาด รับซื้อ iPhone, Samsung, OPPO
              และอีกมากมาย
            </p>
          </section>

          {/* Column 2: Subscribe & Contact */}
          <section aria-labelledby="footer-subscribe">
            <h3
              id="footer-subscribe"
              className="mb-4 text-sm font-bold tracking-wider text-gray-900 uppercase"
            >
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
            <ul className="space-y-2 text-sm" aria-label="ช่องทางการติดต่อ">
              <li className="text-muted-foreground flex items-center gap-3">
                <Phone size={18} aria-hidden />
                <a href="tel:0989509222" className="hover:text-gray-900">
                  098-950-9222
                </a>
              </li>
              <li className="text-muted-foreground flex items-center gap-3">
                <Envelope size={18} aria-hidden />
                <a
                  href="mailto:OKMobile@gmail.com"
                  className="hover:text-gray-900"
                >
                  OKMobile@gmail.com
                </a>
              </li>
            </ul>
          </section>

          {/* Column 3: Customer Links */}
          <nav aria-labelledby="footer-customer" className="">
            <h3
              id="footer-customer"
              className="mb-4 text-sm font-bold tracking-wider text-gray-900 uppercase"
            >
              ศูนย์ดูแลลูกค้า
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground text-sm transition-colors hover:text-gray-900"
                >
                  คำถามบ่อยๆ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground text-sm transition-colors hover:text-gray-900"
                >
                  วิธีการขายสินค้า
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground text-sm transition-colors hover:text-gray-900"
                >
                  วิธีการรับเงิน
                </a>
              </li>
            </ul>
          </nav>

          {/* Column 4: Company & Social */}
          <nav aria-labelledby="footer-company">
            <h3
              id="footer-company"
              className="mb-4 text-sm font-bold tracking-wider text-gray-900 uppercase"
            >
              OK Mobile
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground text-sm transition-colors hover:text-gray-900"
                >
                  เกี่ยวกับ OK Mobile
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground text-sm transition-colors hover:text-gray-900"
                >
                  ข้อกำหนดและเงื่อนไข
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground text-sm transition-colors hover:text-gray-900"
                >
                  นโยบายความเป็นส่วนตัว
                </a>
              </li>
            </ul>

            <h3 className="mt-8 mb-3 text-sm font-bold tracking-wider text-gray-900 uppercase">
              Follow Us
            </h3>
            <ul className="flex gap-2" aria-label="โซเชียลมีเดีย">
              <li>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877f2] text-white shadow-sm transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-pink-500/40 focus-visible:outline-none"
                >
                  <FacebookLogo size={20} weight="fill" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  aria-label="LINE"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#06c755] text-white shadow-sm transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-pink-500/40 focus-visible:outline-none"
                >
                  <ChatTeardropText size={20} weight="fill" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  aria-label="Twitter/X"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1da1f2] text-white shadow-sm transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-pink-500/40 focus-visible:outline-none"
                >
                  <TwitterLogo size={20} weight="fill" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff0000] text-white shadow-sm transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-pink-500/40 focus-visible:outline-none"
                >
                  <YoutubeLogo size={20} weight="fill" />
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Subfooter */}
      <div className="border-t border-white/60 bg-gray-200/90 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-xs md:text-sm">
            © {new Date().getFullYear()} OK Mobile. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
