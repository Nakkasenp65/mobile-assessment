"use client";
import { Smartphone } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname();
  console.log(pathname);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 transition-smooth hover:scale-105">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <span className=" sm:block text-lg font-semibold text-foreground">OK Mobile</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-smooth ${
                isActive("/")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              หน้าแรก
            </Link>
            <Link
              href="/assess"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-smooth ${
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
