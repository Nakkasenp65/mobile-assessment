import Link from "next/link";

export default function NotFound() {
  return (
    <main className="gradient-bg relative min-h-screen overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-[#ffeaf5] via-[#ffc6e0] to-[#f97316]/60 opacity-70 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-gradient-to-tr from-[#f97316]/60 via-[#ffb889] to-[#ffeaf5] opacity-70 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center sm:py-48">
        <h1 className="bg-gradient-to-r from-[#f97316] via-[#ff7ab8] to-[#ec4899] bg-clip-text p-4 text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
          ไม่พบหน้าที่ค้นหา...
        </h1>
        <p className="mt-4 max-w-prose text-base text-[var(--color-muted-foreground)] sm:text-lg">
          ลิงก์อาจถูกย้าย เปลี่ยนชื่อ หรือหมดอายุ ลองกลับไปยังหน้าแรกหรือตรวจสอบ URL อีกครั้ง
        </p>

        {/* Feature card (adapted from your snippet) */}
        <div className="relative mt-10 w-full max-w-md">
          <div className="group ] relative overflow-hidden rounded-2xl bg-gradient-to-bl from-pink-300 via-pink-400 to-orange-500 p-6 [box-shadow:12px_12px_0px_0px_#000000] backdrop-filter duration-500 hover:shadow-xl hover:transform-view">
            <div className="flex items-center justify-center">
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow">ไม่พบหน้า</h2>
                <p className="text-white/80">ขออภัย เราไม่สามารถโหลดหน้าดังกล่าว</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-4xl font-extrabold text-white drop-shadow">404</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="mr-2 text-white/70">สาเหตุที่เป็นไปได้</span>
                  <span className="text-white">URL ไม่ถูกต้อง</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-white/70">ลิงก์</span>
                  <span className="text-white">หมดอายุแล้ว</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-white/70">เนื้อหา</span>
                  <span className="text-white">ถูกย้ายตำแหน่ง</span>
                </div>
              </div>
            </div>
            <div className="mt-10 flex w-full items-center justify-between gap-3">
              <Link
                href="/"
                className="transition-smooth inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--color-foreground)] shadow-sm backdrop-blur hover:bg-white"
              >
                กลับหน้าแรก
              </Link>
              <Link
                href="/assess"
                className="btn-hero inline-flex items-center gap-2 px-6 py-3 text-sm shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                เริ่มประเมินใหม่
              </Link>
            </div>
          </div>

          {/* subtle glow */}
          <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-[#ffeaf5]/40 via-[#ffc7e1]/30 to-[#f97316]/30 blur-2xl" />
        </div>
      </section>
    </main>
  );
}
