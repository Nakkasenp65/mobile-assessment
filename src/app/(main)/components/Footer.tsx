"use client";
import {
  Phone,
  Envelope,
  FacebookLogo,
  ChatTeardropText, // Phosphor's representation for Line
  TwitterLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";

const Footer = () => (
  <footer className="text-foreground mt-16 bg-gray-100 pt-4 md:pt-16">
    <div className="container mx-auto px-4">
      {/* Silas's logic: A responsive grid that adapts from 1 to 2 to 4 columns. */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[5fr_3fr_2fr_2fr]">
        {/* Column 1: About */}
        <div className="md:col-span-2 lg:col-span-1">
          <a
            href="#"
            className="mb-5 flex items-center gap-3 text-3xl font-bold text-black"
          ></a>
          <h4 className="mb-4 text-lg leading-snug font-bold text-black">
            รับซื้อโทรศัพท์ทุกรุ่น พร้อมบริการถึงที่
            <br />
            ให้ราคาดีที่คุณต้องถูกใจ
          </h4>
          <p className="text-muted-foreground text-sm">
            YelloBe บริการรับซื้อมือถือราคาสูงทุกรุ่น รู้ราคาภายใน 1 นาที
            เราพร้อมประเมินราคาที่สูงกว่าตามท้องตลาดทั่วไป รับซื้อไอโฟน (Apple
            iPhone) ซัมซุง (Samsung) ออปโป้ (Oppo) และอื่นๆ อีกมากมาย
          </p>
        </div>

        {/* Column 2: Subscribe & Contact */}
        <div>
          <h5 className="mb-5 text-sm font-bold tracking-wider text-black uppercase">
            Subscribe
          </h5>
          <form className="mb-5 flex">
            <input
              type="email"
              placeholder="Your Email"
              className="focus:ring-primary h-12 flex-grow rounded-l-md border border-r-0 border-gray-300 bg-white px-4 text-sm outline-none focus:ring-2"
            />
            {/* Aria's touch: Using arbitrary value for the exact yellow color. */}
            <button
              type="submit"
              className="h-12 rounded-r-md bg-[#fcc109] px-6 font-bold text-black transition-opacity hover:opacity-90"
            >
              GO
            </button>
          </form>
          <div className="space-y-2">
            <p className="text-muted-foreground flex items-center gap-3 text-sm">
              <Phone size={18} />
              098-950-9222
            </p>
            <p className="text-muted-foreground flex items-center gap-3 text-sm">
              <Envelope size={18} />
              yellobemptech@gmail.com
            </p>
          </div>
        </div>

        {/* Column 3: Customer Links */}
        <div>
          <h5 className="mb-5 text-sm font-bold tracking-wider text-black uppercase">
            ศูนย์ดูแลลูกค้า
          </h5>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-muted-foreground text-sm transition-colors hover:text-black"
              >
                คำถามบ่อยๆ
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-muted-foreground text-sm transition-colors hover:text-black"
              >
                วิธีการขายสินค้า
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-muted-foreground text-sm transition-colors hover:text-black"
              >
                วิธีการรับเงิน
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: YELLOBE Links & Social */}
        <div>
          <h5 className="mb-5 text-sm font-bold tracking-wider text-black uppercase">
            YELLOBE
          </h5>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-muted-foreground text-sm transition-colors hover:text-black"
              >
                เกี่ยวกับ Yellobe
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-muted-foreground text-sm transition-colors hover:text-black"
              >
                ข้อกำหนดและเงื่อนไข
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-muted-foreground text-sm transition-colors hover:text-black"
              >
                นโยบายความเป็นส่วนตัว
              </a>
            </li>
          </ul>
          <h5 className="mt-8 mb-4 text-sm font-bold tracking-wider text-black uppercase">
            Follow Us
          </h5>
          <div className="flex gap-2">
            {/* Aria's touch: Recreating social icons with exact colors and hover effects. */}
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877f2] transition-transform hover:-translate-y-1"
            >
              <FacebookLogo size={20} weight="fill" className="text-white" />
            </a>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#06c755] transition-transform hover:-translate-y-1"
            >
              <ChatTeardropText
                size={20}
                weight="fill"
                className="text-white"
              />
            </a>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1da1f2] transition-transform hover:-translate-y-1"
            >
              <TwitterLogo size={20} weight="fill" className="text-white" />
            </a>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff0000] transition-transform hover:-translate-y-1"
            >
              <YoutubeLogo size={20} weight="fill" className="text-white" />
            </a>
          </div>
        </div>
      </div>
    </div>

    {/* Subfooter */}
    <div className="mt-12 bg-gray-200 py-4">
      <div className="container mx-auto px-4 text-center">
        <p className="text-muted-foreground text-sm">
          Copyright : 2024 Ok Mobile. All Rights Reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
