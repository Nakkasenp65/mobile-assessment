"use client";

import { useMemo } from "react";
import { DeviceInfo, ConditionInfo } from "@/app/assess/page";

const BASE_PRICES: Record<string, number> = {
  "iPhone 15 Pro Max": 35000,
  "iPhone 15 Pro": 32000,
  "iPhone 15": 28000,
  // ... Add other models here
  default: 15000, // Fallback price
};

const STORAGE_ADJUSTMENTS: Record<string, number> = {
  "128 GB": 0,
  "256 GB": 3000,
  "512 GB": 6000,
  "1 TB": 10000,
};

const CONDITION_ADJUSTMENTS: Partial<
  Record<keyof ConditionInfo, Record<string, number>>
> = {
  screenGlass: { minor: -1500, cracked: -4000 },
  screenDisplay: { spots: -3000, not_working: -8000 },
  cameras: { failed: -2500, some_work: -1000 },
  mic: { failed: -1000 },
  speaker: { failed: -800 },
  powerOn: { sometimes: -2000 },
  charger: { failed: -500 },
  wifi: { poor: -500 },
  touchScreen: {
    "80-99%": -1000,
    "50-79%": -3000,
    "<50%": -6000,
  },
};

const TRANSLATION_MAP: Record<string, string> = {
  // General
  perfect: "สมบูรณ์แบบ",
  excellent: "ยอดเยี่ยม",
  good: "ดี",
  passed: "ผ่านการทดสอบ",
  success: "ทำงานปกติ",
  yes: "เปิด-ปิดปกติ",
  works: "ทำงานปกติ",
  all_work: "ทำงานปกติ",

  // Issues
  minor: "มีรอยเล็กน้อย",
  cracked: "กระจกแตก",
  spots: "มีจุดดำ/เส้น",
  not_working: "ไม่แสดงผล",
  failed: "ทำงานผิดพลาด",
  some_work: "มีปัญหาบางส่วน",
  sometimes: "เปิดติดบ้าง",
  not_works: "ไม่ทำงาน",
  poor: "การเชื่อมต่อช้า",

  // Battery Health
  "100%": "100%",
  "95% - 99%": "95% - 99%",
  "90% - 94%": "90% - 94%",
  "85% - 89%": "85% - 89%",
  "ต่ำกว่า 85%": "ต่ำกว่า 85%",
  เปลี่ยนแบตเตอรี่: "ควรเปลี่ยนแบตเตอรี่",
};

export interface PriceAdjustment {
  label: string;
  value: string; // The user-friendly translated value
  impact: number; // The price change (+/-)
}

export interface PriceCalculationResult {
  basePrice: number;
  adjustments: PriceAdjustment[];
  finalPrice: number;
}

export const usePriceCalculation = (
  deviceInfo: DeviceInfo,
  conditionInfo: ConditionInfo,
): PriceCalculationResult => {
  // useMemo คือหัวใจสำคัญที่ทำให้การคำนวณที่ซับซ้อนนี้
  // ทำงานใหม่ก็ต่อเมื่อข้อมูล deviceInfo หรือ conditionInfo เปลี่ยนแปลงเท่านั้น
  const calculationResult = useMemo(() => {
    // --- Step 1: Calculate Base Price ---
    const modelPrice = BASE_PRICES[deviceInfo.model] || BASE_PRICES.default;
    const storagePrice = STORAGE_ADJUSTMENTS[deviceInfo.storage] || 0;
    const basePrice = modelPrice + storagePrice;

    // --- Step 2: Calculate Adjustments ---
    const adjustments: PriceAdjustment[] = [];
    let totalAdjustments = 0;

    // Create a combined object for easier iteration
    const allInfo = { ...deviceInfo, ...conditionInfo };

    // Define the order and labels for the ledger
    const ledgerOrder: Array<{ key: keyof typeof allInfo; label: string }> = [
      { key: "brand", label: "ยี่ห้อ" },
      { key: "model", label: "รุ่น" },
      { key: "storage", label: "ความจุ" },
      { key: "batteryHealth", label: "สุขภาพแบตเตอรี่" },
      { key: "screenGlass", label: "สภาพกระจกหน้าจอ" },
      { key: "screenDisplay", label: "คุณภาพการแสดงผล" },
      { key: "powerOn", label: "การเปิดเครื่อง" },
      { key: "cameras", label: "กล้อง" },
      { key: "mic", label: "ไมโครโฟน" },
      { key: "speaker", label: "ลำโพง" },
      { key: "biometric", label: "ระบบ Biometric" },
      { key: "charger", label: "การชาร์จ" },
      { key: "wifi", label: "Wi-Fi" },
      { key: "touchScreen", label: "ระบบสัมผัส" },
    ];

    ledgerOrder.forEach(({ key, label }) => {
      const value = allInfo[key];
      if (!value) return; // Skip if value is empty

      let impact = 0;
      // Check if this condition key exists in our adjustment rules
      if (key in CONDITION_ADJUSTMENTS) {
        const ruleSet = CONDITION_ADJUSTMENTS[key as keyof ConditionInfo];
        if (ruleSet && value in ruleSet) {
          impact = ruleSet[value];
        }
      }

      adjustments.push({
        label,
        value: TRANSLATION_MAP[value] || value, // Translate the value
        impact,
      });
      totalAdjustments += impact;
    });

    // --- Step 3: Calculate Final Price ---
    const finalPrice = basePrice + totalAdjustments;

    return {
      basePrice,
      adjustments,
      finalPrice: finalPrice > 0 ? finalPrice : 0, // Ensure price doesn't go below zero
    };
  }, [deviceInfo, conditionInfo]);

  return calculationResult;
};
