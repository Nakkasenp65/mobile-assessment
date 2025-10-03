"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Wrench, Loader2 } from "lucide-react";
import { DeviceInfo } from "../../../page";
import FramerButton from "@/components/ui/framer/FramerButton";
import { RepairItem } from "@/hooks/useRepairPrices";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MaintenanceServiceProps {
  deviceInfo: DeviceInfo;
  repairs: RepairItem[];
  totalCost: number; // This is now the total of ALL possible repairs
  isLoading: boolean;
}

const MaintenanceService: React.FC<MaintenanceServiceProps> = ({
  deviceInfo,
  repairs,
  totalCost,
  isLoading,
}) => {
  const [selectedRepairs, setSelectedRepairs] = useState<RepairItem[]>([]);

  const handleSelectionChange = (repair: RepairItem, isSelected: boolean) => {
    setSelectedRepairs((prev) => {
      if (isSelected) {
        return [...prev, repair];
      } else {
        return prev.filter((r) => r.part !== repair.part);
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
          repairs.map((repair, index) => {
            const isSelected = selectedRepairs.some((r) => r.part === repair.part);
            return (
              <Label
                key={index}
                htmlFor={`repair-${index}`}
                className="flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-slate-50 dark:hover:bg-zinc-700/50"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`repair-${index}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => handleSelectionChange(repair, !!checked)}
                  />
                  <div className="flex items-center gap-2">
                    <repair.icon className="h-5 w-5 text-slate-500" />
                    <span className="text-slate-800 dark:text-zinc-100">{repair.part}</span>
                  </div>
                </div>
                <span className="font-semibold text-slate-800 dark:text-zinc-100">
                  ฿{repair.cost.toLocaleString()}
                </span>
              </Label>
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
        className="flex justify-center pt-2"
      >
        <FramerButton size="lg" className="h-14 w-full" disabled={selectedRepairs.length === 0}>
          <Wrench className="mr-2 h-4 w-4" />
          ติดต่องานซ่อม
        </FramerButton>
      </motion.div>
    </section>
  );
};

export default MaintenanceService;
