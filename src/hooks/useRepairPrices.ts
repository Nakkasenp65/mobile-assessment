// src/hooks/useRepairPrices.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useMemo } from "react";
import { ConditionInfo } from "../types/device";
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
  PhoneCall,
  CircleDot,
  RadioTower,
  Power,
  Hand,
} from "lucide-react";

/**
 * Interface สำหรับโครงสร้างข้อมูลราคาซ่อมที่ได้จาก Hook
 */
export interface RepairPriceData {
  [part: string]: {
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

// Configuration Maps สำหรับการแสดงผล (อัปเดตให้ครบทุกอาการ)
const PART_METADATA: Record<string, { name: string; icon: LucideIcon }> = {
  bodyCondition: { name: "ตัวเครื่อง", icon: Smartphone },
  screenGlass: { name: "กระจกหน้าจอ", icon: MonitorSmartphone },
  screenDisplay: { name: "จอแสดงผล", icon: MonitorSmartphone },
  batteryHealth: { name: "แบตเตอรี่", icon: Battery },
  camera: { name: "กล้อง", icon: Camera },
  wifi: { name: "Wi-Fi", icon: Wifi },
  faceId: { name: "Face ID / Touch ID", icon: ScanFace },
  speaker: { name: "ลำโพง", icon: Volume2 },
  mic: { name: "ไมโครโฟน", icon: Mic },
  touchScreen: { name: "หน้าจอสัมผัส", icon: Hand },
  charger: { name: "พอร์ตชาร์จ", icon: BatteryCharging },
  call: { name: "การโทร", icon: PhoneCall },
  homeButton: { name: "ปุ่ม Home", icon: CircleDot },
  sensor: { name: "Sensor", icon: RadioTower },
  buttons: { name: "ปุ่ม Power / Volume", icon: Power },
};

/**
 * Custom Hook สำหรับดึงข้อมูลราคาซ่อมและคำนวณค่าใช้จ่ายทั้งหมด
 * @param model - ชื่อรุ่นของอุปกรณ์
 * @param conditionInfo - ข้อมูลสภาพเครื่องทั้งหมด
 */
export const useRepairPrices = (model: string, conditionInfo: ConditionInfo): RepairCalculationResult => {
  const { data: priceMap, isLoading } = useQuery({
    queryKey: ["repairPrices", model],
    queryFn: async (): Promise<RepairPriceData> => {
      const { data, error } = await supabase
        .from("repair_prices")
        .select("part_key, condition_key, price")
        .eq("model_name", model);

      if (error) {
        console.error("Error fetching repair prices:", error);
        throw new Error(error.message);
      }
      if (!data) return {};

      const mappedPrices: RepairPriceData = {};
      for (const item of data) {
        if (!mappedPrices[item.part_key]) {
          mappedPrices[item.part_key] = {};
        }
        mappedPrices[item.part_key][item.condition_key] = item.price;
      }
      return mappedPrices;
    },
    enabled: !!model,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: Infinity,
  });

  // ✨ [แก้ไข] ปรับปรุง Logic การคำนวณให้ตรงกับข้อมูลใหม่
  const { repairs, totalRepairCost } = useMemo(() => {
    if (!priceMap || !conditionInfo) {
      return { repairs: [], totalRepairCost: 0 };
    }

    const calculatedRepairs: RepairItem[] = [];
    let totalCost = 0;

    // วนลูปตามข้อมูลสภาพเครื่องที่ผู้ใช้เลือก
    Object.entries(conditionInfo).forEach(([partKey, conditionKey]) => {
      if (!conditionKey) return; // ข้ามถ้าไม่มีข้อมูล

      // ดึงราคาโดยตรงจาก map โดยใช้ partKey และ conditionKey
      const cost = priceMap[partKey]?.[conditionKey];
      const metadata = PART_METADATA[partKey];

      // ถ้ามีราคาสำหรับอาการนี้ ให้ถือว่าเป็นรายการซ่อม
      if (metadata && typeof cost === "number") {
        calculatedRepairs.push({
          part: metadata.name,
          condition: "ต้องซ่อมแซม/เปลี่ยน", // Label กลางๆ สำหรับแสดงผล
          cost,
          icon: metadata.icon,
        });
        totalCost += cost;
      }
    });

    return {
      repairs: calculatedRepairs,
      totalRepairCost: totalCost,
    };
  }, [conditionInfo, priceMap]);

  return { repairs, totalRepairCost, isLoading };
};
