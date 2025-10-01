"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Wrench, Loader2 } from "lucide-react";
import { DeviceInfo } from "../../../page";
import FramerButton from "@/components/ui/framer/FramerButton";
import { cn } from "@/lib/utils";
import { RepairItem } from "@/hooks/useRepairPrices";

// CHIRON: สัญญา (Contract) ของ Component นี้ยังคงเหมือนเดิม
// มันระบุอย่างชัดเจนว่าต้องการข้อมูลอะไรบ้างเพื่อที่จะทำงานได้อย่างสมบูรณ์
interface MaintenanceServiceProps {
  deviceInfo: DeviceInfo;
  repairs: RepairItem[];
  totalCost: number;
  isLoading: boolean;
}

const MaintenanceService: React.FC<MaintenanceServiceProps> = ({
  deviceInfo,
  repairs,
  totalCost,
  isLoading,
}) => {
  // ตรรกะเล็กน้อยที่ยังคงอยู่ภายในเป็นเพียงการคำนวณเพื่อการแสดงผลเท่านั้น
  // ไม่เกี่ยวข้องกับ Business Logic หลัก
  const estimatedTime = repairs.length > 2 ? "3-5 วันทำการ" : "2-3 วันทำการ";

  // CHIRON: Structural Engineer - เปลี่ยน Root Element จาก <main> เป็น <section>
  // เพื่อบ่งบอกว่านี่คือส่วนหนึ่งของเอกสารที่ใหญ่กว่า ไม่ใช่หน้าหลักอีกต่อไป
  return (
    <section className="flex w-full flex-col gap-4 bg-white dark:bg-zinc-800">
      {/* หัวข้อที่ชัดเจนเพื่อแบ่งส่วนข้อมูลภายใน AssessmentLedger */}
      <h2 className="text-lg font-bold text-slate-800 md:text-2xl dark:text-zinc-100">
        สรุปค่าบริการซ่อม
      </h2>

      {/* ส่วนแสดงผลราคา */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        // CHIRON: Counter-intelligence - การปรับสไตล์ให้เป็นกลาง (Neutralization)
        // ใช้สี slate และลด effect ที่ไม่จำเป็นออกไป เพื่อให้กลมกลืนกับ Component แม่
        className="relative flex h-[138px] flex-col justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-900"
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex flex-col items-center justify-center"
            >
              <Loader2 className="mb-2 h-8 w-8 animate-spin text-slate-500" />
              <p className="text-sm text-slate-600 dark:text-zinc-400">กำลังคำนวณราคาซ่อม...</p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10"
            >
              <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-zinc-200">
                ค่าบริการซ่อมโดยประมาณ
              </h3>
              <p className="text-4xl font-bold text-slate-700 dark:text-zinc-50">
                ฿{" "}
                {totalCost.toLocaleString("th-TH", {
                  minimumFractionDigits: 0,
                })}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                ระยะเวลาซ่อม: {estimatedTime}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ส่วนแสดงรายละเอียดรายการซ่อม */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.1 },
        }}
        className="space-y-3 pt-2"
      >
        <h4 className="text-base font-semibold text-slate-800 dark:text-zinc-200">รายการซ่อม</h4>
        {repairs?.length > 0 && !isLoading ? (
          <div className="flex flex-col gap-2 rounded-xl border bg-white p-3 dark:divide-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/50">
            {repairs.map((repair, index) => {
              return (
                <div key={index} className="flex">
                  <div className="flex-grow">
                    <p className="text-slate-800 dark:text-zinc-100">{repair.part}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-800 dark:text-zinc-100">
                      ฿{repair.cost.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !isLoading && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
              <p className="text-sm text-slate-600 dark:text-zinc-400">
                เยี่ยมเลย! ไม่พบรายการที่ต้องซ่อม
              </p>
            </div>
          )
        )}
      </motion.div>

      {/* ปุ่ม Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.4 },
        }}
        className="flex justify-center pt-2"
      >
        <FramerButton size="lg" className="h-14 w-full">
          <Wrench className="mr-2 h-4 w-4" />
          ติดต่องานซ่อม
        </FramerButton>
      </motion.div>
    </section>
  );
};

export default MaintenanceService;
