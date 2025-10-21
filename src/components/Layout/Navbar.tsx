"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import Image from "next/image";
import MobileMenu from "./MobileMenu";

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
    { href: "/my-assessments", label: "การประเมินของฉัน" },
    { href: "/assess", label: "ประเมินราคา" },
  ];

  return (
    <>
      <nav className={"sticky top-0 z-30 w-full bg-white py-2 shadow-md"}>
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
                <span className="text-muted-foreground hidden text-xs sm:block">
                  ซื้อ-ขายมือถือออนไลน์
                </span>
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
