"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Wrench,
  Sparkles,
  AlertTriangle,
  Settings,
  Shield,
  Smartphone,
  MonitorSmartphone,
  Battery,
  Camera,
  Wifi,
  ScanFace,
  Volume2,
  Mic,
  LucideIcon,
  Loader2,
} from "lucide-react";
import { DeviceInfo, ConditionInfo } from "../../../page";
import FramerButton from "@/components/ui/framer/FramerButton";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useRepairPrices } from "@/hooks/useRepairPrices"; // 👈 1. Import Hook ใหม่

interface MaintenanceServiceProps {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
}

// --- Configuration Maps (สำหรับแสดงผล) ---
const PART_METADATA: Record<
  string,
  { name: string; icon: LucideIcon }
> = {
  bodyCondition: { name: "ตัวเครื่อง", icon: Smartphone },
  screenGlass: {
    name: "กระจกหน้าจอ",
    icon: MonitorSmartphone,
  },
  screenDisplay: {
    name: "จอแสดงผล",
    icon: MonitorSmartphone,
  },
  batteryHealth: { name: "แบตเตอรี่", icon: Battery },
  camera: { name: "กล้อง", icon: Camera },
  wifi: { name: "Wi-Fi", icon: Wifi },
  faceId: { name: "Face ID", icon: ScanFace },
  speaker: { name: "ลำโพง", icon: Volume2 },
  mic: { name: "ไมโครโฟน", icon: Mic },
  touchScreen: {
    name: "หน้าจอสัมผัส",
    icon: MonitorSmartphone,
  },
  chargingPort: { name: "พอร์ตชาร์จ", icon: Smartphone },
};

const MaintenanceService: React.FC<
  MaintenanceServiceProps
> = ({ deviceInfo, conditionInfo }) => {
  // 👈 2. เรียกใช้ Hook เพื่อดึงข้อมูลราคาจาก Supabase
  const { data: modelCosts, isLoading: isLoadingPrices } =
    useRepairPrices(deviceInfo.model);

  const { repairs, totalCost: repairCost } = useMemo(() => {
    // ถ้ายังโหลดราคาไม่เสร็จ หรือไม่มีข้อมูล ให้ return ค่าว่าง
    if (!modelCosts) {
      return { repairs: [], totalCost: 0 };
    }

    const calculatedRepairs: {
      part: string;
      condition: string;
      cost: number;
      icon: LucideIcon;
    }[] = [];
    let totalCost = 0;

    Object.entries(conditionInfo).forEach(
      ([part, condition]) => {
        const isRepairable =
          condition === "failed" ||
          condition === "defect" ||
          (part === "batteryHealth" && condition === "low");

        const costConfig = modelCosts[part];

        if (isRepairable && costConfig) {
          const costKey =
            condition === "low"
              ? "failed"
              : (condition as "failed" | "defect");
          const cost = costConfig[costKey];
          const metadata = PART_METADATA[part];

          if (metadata && cost !== undefined) {
            calculatedRepairs.push({
              part: metadata.name,
              condition:
                condition === "defect"
                  ? "เปลี่ยนใหม่"
                  : "ซ่อมแซม",
              cost,
              icon: metadata.icon,
            });
            totalCost += cost;
          }
        }
      },
    );

    return { repairs: calculatedRepairs, totalCost };
  }, [conditionInfo, modelCosts]); // 👈 3. ใช้ modelCosts เป็น dependency

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
          {isLoadingPrices ? (
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
              <p className="text-4xl font-bold text-emerald-600">
                ฿{" "}
                {repairCost.toLocaleString("th-TH", {
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
        {repairs.length > 0 && !isLoadingPrices ? (
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
          !isLoadingPrices && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-center">
              <p className="text-sm text-emerald-600">
                เยี่ยมเลย! ไม่พบรายการที่ต้องซ่อม
              </p>
            </div>
          )
        )}
      </motion.div>

      {/* ... (Features, Warning Box, และ Button คงเดิม) ... */}
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
          disabled={isLoadingPrices} // Disable a while loading
        >
          <Wrench className="mr-2 h-4 w-4" />
          ยืนยันการซ่อมและชำระเงิน
        </FramerButton>
      </motion.div>
    </main>
  );
};

export default MaintenanceService;
