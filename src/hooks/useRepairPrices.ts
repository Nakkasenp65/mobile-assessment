// src/hooks/useRepairPrices.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useMemo } from "react";
import { ConditionInfo } from "../app/assess/page";
import {
  Smartphone,
  MonitorSmartphone,
  Battery,
  Camera,
  Wifi,
  ScanFace,
  Volume2,
  Mic,
  BatteryCharging,
  LucideIcon,
} from "lucide-react";

/**
 * Interface สำหรับโครงสร้างข้อมูลราคาซ่อมที่ได้จาก Hook
 * key: คือ part_key เช่น "screenGlass"
 * value: คือ Object ที่มีราคาตามอาการ
 */
export interface RepairPriceData {
  [part: string]: {
    failed?: number;
    defect?: number;
    low?: number;
    [condition: string]: number | undefined;
  };
}

/**
 * Interface สำหรับข้อมูลการซ่อมแต่ละรายการ
 */
export interface RepairItem {
  part: string;
  condition: string;
  cost: number;
  icon: LucideIcon;
}

/**
 * Interface สำหรับผลลัพธ์ที่ได้จาก Hook
 */
export interface RepairCalculationResult {
  repairs: RepairItem[];
  totalRepairCost: number;
  isLoading: boolean;
}

// Configuration Maps สำหรับการแสดงผล (ย้ายมาจาก MaintenanceService)
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
  charger: { name: "พอร์ตชาร์จ", icon: BatteryCharging },
};

/**
 * Custom Hook สำหรับดึงข้อมูลราคาซ่อมและคำนวณค่าใช้จ่ายทั้งหมด
 * @param model - ชื่อรุ่นของอุปกรณ์
 * @param conditionInfo - ข้อมูลสภาพเครื่องทั้งหมด
 */
export const useRepairPrices = (
  model: string,
  conditionInfo: ConditionInfo,
): RepairCalculationResult => {
  const { data: priceMap, isLoading } = useQuery({
    queryKey: ["repairPrices", model],
    queryFn: async (): Promise<RepairPriceData> => {
      const { data, error } = await supabase
        .from("repair_prices")
        .select("part_key, condition_key, price")
        .eq("model_name", model);

      if (error) {
        console.error(
          "Error fetching repair prices:",
          error,
        );
        throw new Error(error.message);
      }
      if (!data) return {};

      const mappedPrices: RepairPriceData = {};
      for (const item of data) {
        if (!mappedPrices[item.part_key]) {
          mappedPrices[item.part_key] = {};
        }
        mappedPrices[item.part_key][item.condition_key] =
          item.price;
      }
      return mappedPrices;
    },
    enabled: !!model,
    staleTime: 1000 * 60 * 60,
    gcTime: Infinity,
  });

  // ใช้ useMemo ในการคำนวณราคารวมและรายการซ่อมเมื่อ priceMap หรือ conditionInfo เปลี่ยน
  const { repairs, totalRepairCost } = useMemo(() => {
    if (!priceMap) {
      return { repairs: [], totalRepairCost: 0 };
    }

    const calculatedRepairs: RepairItem[] = [];
    let totalCost = 0;

    Object.entries(conditionInfo).forEach(
      ([part, condition]) => {
        const isRepairable =
          condition === "failed" ||
          condition === "defect" ||
          (part === "batteryHealth" && condition === "low");

        const costConfig = priceMap[part];

        if (isRepairable && costConfig) {
          const costKey = (
            condition === "low" ? "failed" : condition
          ) as "failed" | "defect";
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

    return {
      repairs: calculatedRepairs,
      totalRepairCost: totalCost,
    };
  }, [conditionInfo, priceMap]);

  return { repairs, totalRepairCost, isLoading };
};
