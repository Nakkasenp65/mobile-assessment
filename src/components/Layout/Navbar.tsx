"use client";
import { Smartphone } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-border/50 bg-card/95 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
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

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
