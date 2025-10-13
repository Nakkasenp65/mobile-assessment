"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Menu,
  X,
  Facebook,
  MessageCircle,
  Home,
  Search,
  Calculator,
  HelpCircle,
  Truck,
  DollarSign,
  Info,
  FileText,
  Shield,
} from "lucide-react";
import Image from "next/image";

const MobileMenu = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();
  const closeMenu = () => setIsOpen(false);

  // Close menu on route change
  useEffect(() => {
    if (isOpen) {
      closeMenu();
    }
  }, [pathname]);

  const menuItems = [
    { href: "/", label: "หน้าแรก", icon: Home },
    {
      href: "/my-assessments",
      label: "ค้นหาการประเมิน",
      icon: Search,
    },
    {
      href: "/assess",
      label: "ประเมินราคา",
      icon: Calculator,
    },
  ];

  const customerServiceItems = [
    { href: "#", label: "คำถามบ่อยๆ", icon: HelpCircle },
    {
      href: "#",
      label: "วิธีการขายสินค้า",
      icon: Truck,
    },
    {
      href: "#",
      label: "วิธีการรับเงิน",
      icon: DollarSign,
    },
  ];

  const companyItems = [
    { href: "#", label: "เกี่ยวกับ OK Mobile", icon: Info },
    {
      href: "#",
      label: "ข้อกำหนดและเงื่อนไข",
      icon: FileText,
    },
    {
      href: "#",
      label: "นโยบายความเป็นส่วนตัว",
      icon: Shield,
    },
  ];

  const socialItems = [
    {
      href: "https://www.facebook.com/okmobilebkk",
      icon: Facebook,
      color: "bg-[#1877f2]",
      label: "Facebook",
    },
    {
      href: "https://lin.ee/0ab3Rcl",
      icon: MessageCircle,
      color: "bg-[#06c755]",
      label: "LINE",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeMenu}
            className="fixed inset-0 z-50 bg-black/25 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            // [แก้ไข] เพิ่ม bg-white เพื่อให้มีพื้นหลังสีขาว
            className="fixed top-0 bottom-0 left-0 z-50 flex w-4/5 max-w-sm flex-col overflow-y-auto bg-white shadow-2xl"
          >
            {/* Header with gradient */}
            <div className="gradient-primary relative p-4">
              <div className="flex items-center justify-between">
                <Link href="/" onClick={closeMenu} className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <Smartphone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-white">OK Mobile</span>
                    <p className="text-xs text-white/80">ซื้อ-ขายมือถือออนไลน์</p>
                  </div>
                </Link>
                <button
                  onClick={closeMenu}
                  className="rounded-xl p-2 text-white/90 transition-all hover:scale-110 hover:bg-white/20"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              {/* Main Links */}
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-3 rounded-xl px-4 py-3 text-base font-medium transition-all ${
                          isActive
                            ? "gradient-primary scale-105 transform text-white shadow-lg"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="via-border my-6 h-px bg-gradient-to-r from-transparent to-transparent" />

              {/* Customer Service */}
              <div className="mb-6">
                <h3 className="text-muted-foreground mb-3 px-4 text-sm font-semibold tracking-wider uppercase">
                  ศูนย์ดูแลลูกค้า
                </h3>
                <ul className="space-y-2">
                  {customerServiceItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center space-x-3 rounded-xl px-4 py-3 text-base transition-all"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="via-border my-6 h-px bg-gradient-to-r from-transparent to-transparent" />

              {/* Company */}
              <div className="mb-6">
                <h3 className="text-muted-foreground mb-3 px-4 text-sm font-semibold tracking-wider uppercase">
                  OK Mobile
                </h3>
                <ul className="space-y-2">
                  {companyItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center space-x-3 rounded-xl px-4 py-3 text-base transition-all"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>

            {/* Social Links */}
            <div className="border-border from-accent/50 border-t bg-gradient-to-t to-transparent p-6">
              <h3 className="text-muted-foreground mb-4 text-center text-sm font-semibold tracking-wider uppercase">
                ติดตามเรา
              </h3>
              <ul className="flex justify-center gap-3">
                {socialItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label}>
                      <a
                        target="_blank"
                        href={item.href}
                        aria-label={item.label}
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl ${item.color}`}
                      >
                        <Icon size={20} />
                      </a>
                    </li>
                  );
                })}
              </ul>
              <p className="text-muted-foreground mt-4 text-center text-xs">© 2024 OK Mobile. All rights reserved.</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Main Navbar Component ---
const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  // Effect to lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navItems = [
    { href: "/", label: "หน้าแรก" },
    { href: "/my-assessments", label: "ค้นหาการประเมิน" },
    { href: "/assess", label: "ประเมินราคา" },
  ];

  return (
    <>
      <nav className={"sticky top-0 z-30 w-full bg-white shadow-md"}>
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="group flex h-full items-center gap-2 py-2 pl-2 duration-300 ease-in-out hover:scale-105 xl:pl-0"
            >
              <Image
                src="/assets/one-plus-logo.webp"
                width={100}
                height={100}
                alt="ok-number-one-logo"
                className="h-full w-auto"
              />
              <div className="flex flex-col">
                <span className="text-foreground text-lg font-bold">OK Mobile</span>
                <span className="text-muted-foreground hidden text-xs sm:block">ซื้อ-ขายมือถือออนไลน์</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden items-center space-x-2 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-6 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? "gradient-primary text-primary-foreground scale-105 transform shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(true)}
                className="text-foreground hover:bg-accent/50 rounded-xl p-2 transition-all"
                aria-label="Open main menu"
              >
                <Menu className="h-6 w-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Render Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </>
  );
};

export default Navbar;
