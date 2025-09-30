"use client";

import { motion } from "framer-motion";
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
} from "lucide-react";
import { DeviceInfo, ConditionInfo } from "../../../page";
import FramerButton from "@/components/ui/framer/FramerButton";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface MaintenanceServiceProps {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
}

// --- Configuration Maps (เหมือนเดิม) ---
const REPAIR_COSTS: Record<
  string,
  { failed: number; defect: number }
> = {
  bodyCondition: { failed: 1200, defect: 2500 },
  screenGlass: { failed: 800, defect: 1500 },
  screenDisplay: { failed: 2000, defect: 3500 },
  batteryHealth: { failed: 800, defect: 1200 },
  camera: { failed: 1500, defect: 2500 },
  wifi: { failed: 800, defect: 1500 },
  faceId: { failed: 1200, defect: 2000 },
  speaker: { failed: 600, defect: 1000 },
  mic: { failed: 600, defect: 1000 },
  touchScreen: { failed: 1500, defect: 2500 },
};

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
};

const MaintenanceService: React.FC<
  MaintenanceServiceProps
> = ({ conditionInfo }) => {
  const { repairs, totalCost: repairCost } = useMemo(() => {
    const repairs: {
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
        const costConfig =
          REPAIR_COSTS[part as keyof typeof REPAIR_COSTS];

        if (isRepairable && costConfig) {
          const costKey =
            condition === "low"
              ? "failed"
              : (condition as "failed" | "defect");
          const cost = costConfig[costKey];
          const metadata = PART_METADATA[part];

          if (metadata) {
            repairs.push({
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

    return { repairs, totalCost };
  }, [conditionInfo]);

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
        className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-white p-6 text-center shadow-lg"
      >
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-emerald-100/50 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-teal-100/50 blur-2xl" />
        <div className="relative z-10">
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
        </div>
      </motion.div>

      {/* --- [REVISED] Repair Details Section --- */}
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
        {repairs.length > 0 ? (
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
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-center">
            <p className="text-sm text-emerald-600">
              เยี่ยมเลย! ไม่พบรายการที่ต้องซ่อม
            </p>
          </div>
        )}
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.2 },
        }}
        className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4"
      >
        <h4 className="mb-3 text-sm font-semibold text-emerald-900">
          บริการที่คุณจะได้รับ
        </h4>
        <ul className="space-y-2 text-sm text-emerald-800">
          <li className="flex items-start gap-2">
            <Wrench className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
            <span>
              ตรวจเช็คและซ่อมแซมโดยช่างผู้เชี่ยวชาญ
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
            <span>รับประกันงานซ่อม 90 วัน</span>
          </li>
          <li className="flex items-start gap-2">
            <Settings className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
            <span>ใช้อะไหล่แท้คุณภาพสูง</span>
          </li>
          <li className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
            <span>ทำความสะอาดและตรวจสอบทุกระบบ</span>
          </li>
        </ul>
      </motion.div>

      {/* Warning Box */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.3 },
        }}
        className="flex items-start gap-4 rounded-xl border border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 p-4 shadow-sm"
      >
        <AlertTriangle className="h-6 w-6 flex-shrink-0 text-amber-500" />
        <div className="space-y-1">
          <h3 className="font-medium text-amber-900">
            ข้อควรทราบก่อนการซ่อม
          </h3>
          <p className="text-sm text-amber-800">
            ราคาอาจมีการเปลี่ยนแปลงหลังจากการตรวจสอบสภาพจริงโดยช่างผู้เชี่ยวชาญ
            เราจะแจ้งราคาที่แน่นอนให้ทราบก่อนดำเนินการซ่อม
          </p>
        </div>
      </motion.div>

      {/* Confirmation Button */}
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
        >
          <Wrench className="mr-2 h-4 w-4" />
          ยืนยันการซ่อมและชำระเงิน
        </FramerButton>
      </motion.div>
    </main>
  );
};

export default MaintenanceService;
