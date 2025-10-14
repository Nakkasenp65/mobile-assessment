// src\app\(landing-page)\components\Navigation.tsx

import Link from "next/link";

const Navigation = () => (
  <nav className="border-border sticky top-0 z-50 border-b bg-white/80 py-4 backdrop-blur-sm">
    <div className="container mx-auto flex items-center justify-between">
      <a href="#" className="text-foreground flex items-center gap-2 text-2xl font-bold">
        <img src="https://applehouseth.com/images/icons/logo-text.png" alt="Ok Mobile Logo" className="h-9" />
      </a>
      <div className="hidden items-center gap-6 md:flex">
        <Link href="/assess" className="text-muted-foreground hover:text-secondary transition-colors">
          เริ่มประเมิน
        </Link>
        <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
          ข่าวสารและโปรโมชั่น
        </a>
        <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
          สาขาใกล้คุณ
        </a>
        <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
          ติดต่อเรา
        </a>
      </div>
    </div>
  </nav>
);

export default Navigation;
