"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Wrench, Loader2 } from "lucide-react";
import { DeviceInfo } from "../../../page";
import FramerButton from "@/components/ui/framer/FramerButton";
import { cn } from "@/lib/utils";
import { RepairItem } from "@/hooks/useRepairPrices"; // 👈 1. Import Type ใหม่

interface MaintenanceServiceProps {
  deviceInfo: DeviceInfo;
  repairs: RepairItem[]; // 👈 2. รับ props 'repairs'
  totalCost: number; // 👈 3. รับ props 'totalCost'
  isLoading: boolean; // 👈 4. รับ props 'isLoading'
}

const MaintenanceService: React.FC<
  MaintenanceServiceProps
> = ({ deviceInfo, repairs, totalCost, isLoading }) => {
  // 5. ลบ useRepairPrices และ useMemo ออกไป เพราะคำนวณมาจากข้างนอกแล้ว

  const estimatedTime =
    repairs.length > 2 ? "3-5 วันทำการ" : "2-3 วันทำการ";

  return (
    <main className="w-full space-y-6 pt-4">
      {/* Price Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative flex h-[138px] flex-col justify-center overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-white p-6 text-center shadow-lg"
      >
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-emerald-100/50 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-teal-100/50 blur-2xl" />
        <AnimatePresence mode="wait">
          {/* 6. ใช้ `isLoading` จาก props */}
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex flex-col items-center justify-center"
            >
              <Loader2 className="mb-2 h-8 w-8 animate-spin text-emerald-500" />
              <p className="text-sm text-emerald-700">
                กำลังคำนวณราคาซ่อม...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10"
            >
              <h3 className="mb-2 text-lg font-semibold text-emerald-900">
                ค่าบริการซ่อมโดยประมาณ
              </h3>
              {/* 7. ใช้ `totalCost` จาก props */}
              <p className="text-4xl font-bold text-emerald-600">
                ฿{" "}
                {totalCost.toLocaleString("th-TH", {
                  minimumFractionDigits: 0,
                })}
              </p>
              <p className="mt-2 text-sm text-emerald-600">
                ระยะเวลาซ่อม: {estimatedTime}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Repair Details Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.1 },
        }}
        className="space-y-3"
      >
        <h4 className="text-lg font-semibold text-slate-800">
          รายการซ่อม
        </h4>
        {/* 8. ใช้ `repairs` และ `isLoading` จาก props */}
        {repairs.length > 0 && !isLoading ? (
          <div className="divide-y divide-emerald-100 rounded-xl border border-emerald-100 bg-white">
            {repairs.map((repair, index) => {
              const Icon = repair.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                    <Icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-slate-800">
                      {repair.part}
                    </p>
                    <p
                      className={cn(
                        "text-xs",
                        repair.condition === "ซ่อมแซม"
                          ? "text-amber-600"
                          : "text-red-600",
                      )}
                    >
                      {repair.condition}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">
                      ฿{repair.cost.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !isLoading && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-center">
              <p className="text-sm text-emerald-600">
                เยี่ยมเลย! ไม่พบรายการที่ต้องซ่อม
              </p>
            </div>
          )
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.4 },
        }}
        className="flex justify-center"
      >
        <FramerButton
          className="bg-emerald-600 hover:bg-emerald-700"
          size="lg"
          disabled={isLoading}
        >
          <Wrench className="mr-2 h-4 w-4" />
          ยืนยันการซ่อมและชำระเงิน
        </FramerButton>
      </motion.div>
    </main>
  );
};

export default MaintenanceService;
