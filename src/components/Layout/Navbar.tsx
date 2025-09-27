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
  MessageCircle, // Representing LINE
  Twitter,
  Youtube,
} from "lucide-react";

// --- Mobile Menu Component ---
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
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
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
            className="fixed top-0 bottom-0 left-0 z-50 flex w-4/5 max-w-sm flex-col overflow-y-auto bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center space-x-2"
              >
                <div className="gradient-primary flex h-8 w-8 items-center justify-center rounded-lg">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <span className="text-foreground text-lg font-semibold">
                  OK Mobile
                </span>
              </Link>
              <button
                onClick={closeMenu}
                className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              {/* Main Links */}
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/"
                    className="block rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100"
                  >
                    หน้าแรก
                  </Link>
                </li>
                <li>
                  <Link
                    href="/my-assessments"
                    className="block rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100"
                  >
                    ค้นหาการประเมิน
                  </Link>
                </li>
                <li>
                  <Link
                    href="/assess"
                    className="block rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100"
                  >
                    ประเมินราคา
                  </Link>
                </li>
              </ul>

              <div className="my-4 h-px bg-slate-200" />

              {/* Footer Links: Customer Service */}
              <h3 className="px-4 text-sm font-semibold tracking-wider text-slate-400 uppercase">
                ศูนย์ดูแลลูกค้า
              </h3>
              <ul className="mt-2 space-y-1">
                <li>
                  <a
                    href="#"
                    className="block rounded-lg px-4 py-3 text-base text-slate-700 hover:bg-slate-100"
                  >
                    คำถามบ่อยๆ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block rounded-lg px-4 py-3 text-base text-slate-700 hover:bg-slate-100"
                  >
                    วิธีการขายสินค้า
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block rounded-lg px-4 py-3 text-base text-slate-700 hover:bg-slate-100"
                  >
                    วิธีการรับเงิน
                  </a>
                </li>
              </ul>

              <div className="my-4 h-px bg-slate-200" />

              {/* Footer Links: Company */}
              <h3 className="px-4 text-sm font-semibold tracking-wider text-slate-400 uppercase">
                OK Mobile
              </h3>
              <ul className="mt-2 space-y-1">
                <li>
                  <a
                    href="#"
                    className="block rounded-lg px-4 py-3 text-base text-slate-700 hover:bg-slate-100"
                  >
                    เกี่ยวกับ OK Mobile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block rounded-lg px-4 py-3 text-base text-slate-700 hover:bg-slate-100"
                  >
                    ข้อกำหนดและเงื่อนไข
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block rounded-lg px-4 py-3 text-base text-slate-700 hover:bg-slate-100"
                  >
                    นโยบายความเป็นส่วนตัว
                  </a>
                </li>
              </ul>
            </nav>

            {/* Social Links */}
            <div className="mt-auto border-t p-4">
              <h3 className="px-4 text-sm font-semibold tracking-wider text-slate-400 uppercase">
                Follow Us
              </h3>
              <ul className="mt-3 flex justify-center gap-3">
                <li>
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877f2] text-white shadow-sm transition-transform hover:-translate-y-1"
                  >
                    <Facebook size={20} />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    aria-label="LINE"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#06c755] text-white shadow-sm transition-transform hover:-translate-y-1"
                  >
                    <MessageCircle size={20} />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    aria-label="Twitter/X"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1da1f2] text-white shadow-sm transition-transform hover:-translate-y-1"
                  >
                    <Twitter size={20} />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    aria-label="YouTube"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff0000] text-white shadow-sm transition-transform hover:-translate-y-1"
                  >
                    <Youtube size={20} />
                  </a>
                </li>
              </ul>
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
    // Cleanup function
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="border-border/50 bg-card/95 sticky top-0 z-30 w-full border-b backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="transition-smooth flex items-center space-x-2 hover:scale-105"
            >
              <div className="gradient-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <span className="text-foreground text-lg font-semibold sm:block">
                OK Mobile
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden items-center space-x-1 md:flex">
              <Link
                href="/"
                className={`transition-smooth rounded-lg px-4 py-2 text-sm font-medium ${
                  isActive("/")
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                หน้าแรก
              </Link>
              <Link
                href="/my-assessments"
                className={`transition-smooth rounded-lg px-4 py-2 text-sm font-medium ${
                  isActive("/my-assessments")
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                ค้นหาการประเมิน
              </Link>
              <Link
                href="/assess"
                className={`transition-smooth rounded-lg px-4 py-2 text-sm font-medium ${
                  isActive("/assess")
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                ประเมินราคา
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                aria-label="Open main menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Render Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
      />
    </>
  );
};

export default Navbar;
