import React from "react";
import { CheckCircle } from "lucide-react";
import { ServiceOption } from "./AssessStep3";

interface ServicesProps {
  services: ServiceOption[];
  selectedService: string;
  setSelectedService: React.Dispatch<React.SetStateAction<string>>;
}

/** พาเลตหลัก: pink (sell), orange (pawn) + โทนเสริมสำหรับบริการอื่น ๆ */
const PALETTE = {
  sell: {
    bar: "from-pink-500 to-fuchsia-500",
    ring: "ring-pink-500/60",
    icon: "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white",
    text: "text-pink-600 dark:text-pink-400",
    soft: "bg-pink-50/70 dark:bg-pink-500/10",
  },
  pawn: {
    bar: "from-orange-500 to-amber-500",
    ring: "ring-orange-500/60",
    icon: "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
    text: "text-orange-600 dark:text-orange-400",
    soft: "bg-orange-50/70 dark:bg-orange-500/10",
  },
  tradein: {
    bar: "from-violet-500 to-indigo-500",
    ring: "ring-violet-500/60",
    icon: "bg-gradient-to-r from-violet-500 to-indigo-500 text-white",
    text: "text-violet-600 dark:text-violet-400",
    soft: "bg-violet-50/70 dark:bg-violet-500/10",
  },
  consignment: {
    bar: "from-teal-500 to-cyan-500",
    ring: "ring-teal-500/60",
    icon: "bg-gradient-to-r from-teal-500 to-cyan-500 text-white",
    text: "text-teal-600 dark:text-teal-400",
    soft: "bg-teal-50/70 dark:bg-teal-500/10",
  },
  refurbish: {
    bar: "from-emerald-500 to-green-500",
    ring: "ring-emerald-500/60",
    icon: "bg-gradient-to-r from-emerald-500 to-green-500 text-white",
    text: "text-emerald-600 dark:text-emerald-400",
    soft: "bg-emerald-50/70 dark:bg-emerald-500/10",
  },
  installment: {
    bar: "from-rose-500 to-pink-500",
    ring: "ring-rose-500/60",
    icon: "bg-gradient-to-r from-rose-500 to-pink-500 text-white",
    text: "text-rose-600 dark:text-rose-400",
    soft: "bg-rose-50/70 dark:bg-rose-500/10",
  },
  delivery: {
    bar: "from-amber-500 to-yellow-500",
    ring: "ring-amber-500/60",
    icon: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white",
    text: "text-amber-600 dark:text-amber-400",
    soft: "bg-amber-50/70 dark:bg-amber-500/10",
  },
  fallback: {
    bar: "from-slate-500 to-gray-600",
    ring: "ring-slate-500/60",
    icon: "bg-gradient-to-r from-slate-500 to-gray-600 text-white",
    text: "text-slate-600 dark:text-slate-400",
    soft: "bg-slate-50/70 dark:bg-slate-500/10",
  },
} as const;

function getTheme(id: string) {
  return (PALETTE as any)[id] ?? PALETTE.fallback;
}

const THB = (n: number) =>
  n.toLocaleString("th-TH", { minimumFractionDigits: 0 });

export default function Services({
  services,
  selectedService,
  setSelectedService,
}: ServicesProps) {
  const handleSelect = (id: string) => setSelectedService(id);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, idx: number) => {
    const current = services[idx];
    if (!current) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(current.id);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = services[idx + 1] ?? services[0];
      document
        .querySelector<HTMLDivElement>(`[data-service="${next.id}"]`)
        ?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = services[idx - 1] ?? services[services.length - 1];
      document
        .querySelector<HTMLDivElement>(`[data-service="${prev.id}"]`)
        ?.focus();
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col gap-4">
      <h3 className="text-foreground mt-6 block text-lg font-semibold md:hidden">
        เลือกบริการที่ต้องการ
      </h3>

      {/* คอนเทนเนอร์แบบคอลัมน์เดียว (อ่านง่าย ไม่เบียดสรุปฝั่งซ้าย) */}
      <div
        role="radiogroup"
        aria-label="ตัวเลือกบริการ"
        className="flex flex-col gap-4"
      >
        {services.map((service, index) => {
          const {
            id,
            title,
            description,
            features,
            price,
            icon: Icon,
          } = service;
          const active = selectedService === id;
          const t = getTheme(id);

          return (
            <div
              key={id}
              data-service={id}
              role="radio"
              aria-checked={active}
              tabIndex={0}
              onKeyDown={(e) => onKeyDown(e, index)}
              onClick={() => handleSelect(id)}
              className={[
                "group cursor-pointer rounded-2xl border-2 transition-all duration-200",
                "border-border/70 hover:border-foreground/20 hover:shadow-md",
                active ? `ring-2 ${t.ring} shadow-lg` : "ring-0",
                "bg-white/80 backdrop-blur-[2px] dark:bg-zinc-900/50",
              ].join(" ")}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* ไอคอนเม็ดยา */}
                  <div
                    className={[
                      "rounded-xl p-3 transition-all duration-200",
                      active ? t.icon : "bg-muted text-muted-foreground",
                      "group-hover:scale-[1.02]",
                    ].join(" ")}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <h4 className="text-foreground truncate text-base font-semibold">
                        {title}
                      </h4>
                      <p
                        className={[
                          "text-xl font-bold whitespace-nowrap",
                          active ? t.text : "text-foreground",
                        ].join(" ")}
                        title={`฿${THB(price)}`}
                      >
                        ฿{THB(price)}
                      </p>
                    </div>

                    <p className="text-muted-foreground mb-3 text-sm">
                      {description}
                    </p>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle
                            className={[
                              "h-4 w-4 flex-shrink-0",
                              active ? t.text : "text-muted-foreground",
                            ].join(" ")}
                          />
                          <span className="text-foreground/90 text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {active && (
                      <div
                        className={[
                          "mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
                          t.soft,
                          "ring-1 ring-black/5 dark:ring-white/5",
                        ].join(" ")}
                      >
                        <span className={t.text}>เลือกแล้ว</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
