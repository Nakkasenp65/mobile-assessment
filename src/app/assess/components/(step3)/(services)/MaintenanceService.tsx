"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Loader2, CheckCircle2 } from "lucide-react";
import { DeviceInfo } from "../../../page";
import FramerButton from "@/components/ui/framer/FramerButton";
import { RepairItem } from "@/hooks/useRepairPrices";
import { cn } from "@/lib/utils"; // CHIRON: Import `cn` utility สำหรับการจัดการ class แบบมีเงื่อนไข
import { Button } from "../../../../../components/ui/button";

interface MaintenanceServiceProps {
  deviceInfo: DeviceInfo;
  repairs: RepairItem[];
  totalCost: number; // This is now the total of ALL possible repairs
  isLoading: boolean;
}

const MaintenanceService: React.FC<MaintenanceServiceProps> = ({ repairs, isLoading }) => {
  const [selectedRepairs, setSelectedRepairs] = useState<RepairItem[]>([]);

  // CHIRON: Structural Engineer - สร้างฟังก์ชันจัดการการเลือก/ยกเลิกที่ชัดเจน
  // ลดความซับซ้อนของ logic ใน event handler
  const handleToggleSelection = (repair: RepairItem) => {
    setSelectedRepairs((currentSelected) => {
      const isAlreadySelected = currentSelected.some((r) => r.part === repair.part);
      if (isAlreadySelected) {
        // ถ้ามีอยู่แล้ว ให้กรองออก (ยกเลิกการเลือก)
        return currentSelected.filter((r) => r.part !== repair.part);
      } else {
        // ถ้ายังไม่มี ให้เพิ่มเข้าไป (เลือก)
        return [...currentSelected, repair];
      }
    });
  };

  const selectedTotalCost = useMemo(() => {
    return selectedRepairs.reduce((acc, curr) => acc + curr.cost, 0);
  }, [selectedRepairs]);

  const estimatedTime = useMemo(() => {
    if (selectedRepairs.length === 0) return "-";
    return selectedRepairs.length > 2 ? "3-5 วันทำการ" : "2-3 วันทำการ";
  }, [selectedRepairs]);

  return (
    <section className="flex w-full flex-col gap-4 bg-white dark:bg-zinc-800">
      <h2 className="text-lg font-bold text-slate-800 md:text-2xl dark:text-zinc-100">
        รายละเอียดสภาพเครื่องและบริการซ่อม
      </h2>
      <p className="text-sm text-slate-600">
        คุณสามารถเลือกรายการที่ต้องการซ่อมเพื่อดูค่าใช้จ่ายโดยประมาณได้
      </p>

      {/* Repair items list */}
      <div className="flex flex-col gap-2 rounded-xl border bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
        {isLoading ? (
          <div className="flex h-24 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : repairs.length > 0 ? (
          repairs.map((repair) => {
            // CHIRON: คำนวณสถานะ `isSelected` ที่นี่ เพื่อใช้ขับเคลื่อน UI
            const isSelected = selectedRepairs.some((r) => r.part === repair.part);
            return (
              // CHIRON: Structural Engineer - เปลี่ยนจาก Label/Checkbox เป็น Button
              // เพื่อความถูกต้องทาง Semantic และเพิ่มพื้นที่การกดให้ใหญ่ขึ้น
              <motion.button
                key={repair.part}
                onClick={() => handleToggleSelection(repair)}
                // CHIRON: ใช้ `cn` เพื่อจัดการ class ตาม state `isSelected`
                className={cn(
                  "relative flex w-full cursor-pointer items-center justify-between rounded-lg border-2 p-3 text-left transition-all duration-200",
                  isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                    : "border-transparent bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/50",
                )}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                      isSelected
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                        : "bg-slate-200 text-slate-500 dark:bg-zinc-700 dark:text-zinc-400",
                    )}
                  >
                    <repair.icon className="h-5 w-5" />
                  </div>
                  <span
                    className={cn(
                      "font-medium",
                      isSelected
                        ? "text-blue-800 dark:text-blue-200"
                        : "text-slate-800 dark:text-zinc-100",
                    )}
                  >
                    {repair.part}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      "font-semibold",
                      isSelected
                        ? "text-blue-900 dark:text-blue-100"
                        : "text-slate-800 dark:text-zinc-100",
                    )}
                  >
                    ฿{repair.cost.toLocaleString()}
                  </span>
                  {/* CHIRON: แสดงสถานะการเลือกที่ชัดเจนด้วย Icon */}
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-300 dark:border-zinc-600">
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <CheckCircle2 className="h-5 w-5 text-blue-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.button>
            );
          })
        ) : (
          <div className="py-4 text-center text-sm text-slate-600 dark:text-zinc-400">
            เยี่ยมเลย! ไม่พบรายการที่ต้องซ่อม
          </div>
        )}
      </div>

      {/* Price Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-900"
      >
        <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-zinc-200">
          ค่าบริการซ่อมที่เลือก
        </h3>
        <p className="text-4xl font-bold text-slate-700 dark:text-zinc-50">
          ฿{" "}
          {selectedTotalCost.toLocaleString("th-TH", {
            minimumFractionDigits: 0,
          })}
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
          ระยะเวลาซ่อม: {estimatedTime}
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
        className="justify-center pt-2"
      >
        <Button
          size="lg"
          className="h-14 w-full bg-gradient-to-br from-stone-400 to-stone-500"
          disabled={selectedRepairs.length === 0}
        >
          <Wrench className="mr-2 h-4 w-4" />
          ติดต่องานซ่อม
        </Button>
      </motion.div>
    </section>
  );
};

export default MaintenanceService;
