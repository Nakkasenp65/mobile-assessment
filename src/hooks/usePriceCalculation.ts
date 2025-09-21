"use client";
import { useMemo } from "react";
import { DeviceInfo, ConditionInfo } from "../app/assess/page";

// =================================================================
// [Business Logic Rules] - The single source of truth for pricing.
// =================================================================

const BASE_PRICES: Record<string, number> = {
  "iPhone 15 Pro Max": 25000,
  "iPhone 15 Pro": 22000,
  "iPhone 15": 19000,
  "Galaxy S24 Ultra": 23000,
  "Pixel 8 Pro": 18000,
  default: 15000, // Fallback price
};

const STORAGE_ADJUSTMENTS: Record<string, number> = {
  "128 GB": 0,
  "256 GB": 3000,
  "512 GB": 6000,
  "1 TB": 10000,
};

const CONDITION_ADJUSTMENTS: Record<string, Record<string, number>> = {
  screenGlass: { perfect: 0, minor: -1500, cracked: -5000 },
  screenDisplay: { perfect: 0, spots: -3000, not_working: -8000 },
  powerOn: { yes: 0, sometimes: -4000 },
  cameras: { passed: 0, failed: -2500 },
  charger: { success: 0, failed: -1000, ignore: 0 },
  wifi: { good: 0, excellent: 0, poor: -1200, ignore: 0 },
  touchScreen: { passed: 0, failed: -3500 },
  mic: { passed: 0, failed: -1800 },
  speaker: { passed: 0, failed: -1500 },
  batteryHealth: {
    "100%": 1000,
    "95% - 99%": 0,
    "90% - 94%": -500,
    "85% - 89%": -1500,
    "ต่ำกว่า 85%": -2500,
    เปลี่ยนแบตเตอรี่: -3000,
  },
};

const TRANSLATION_MAP: Record<string, string> = {
  perfect: "สมบูรณ์แบบ",
  minor: "มีรอยเล็กน้อย",
  cracked: "กระจกแตก",
  spots: "มีจุด/เส้น",
  not_working: "ไม่แสดงผล",
  yes: "เปิดติดปกติ",
  sometimes: "เปิดติดบ้าง",
  passed: "ทำงานปกติ",
  failed: "มีปัญหา",
  success: "ชาร์จปกติ",
  good: "เชื่อมต่อได้",
  excellent: "เชื่อมต่อได้",
  poor: "เชื่อมต่อไม่ได้",
  ignore: "ข้ามการตรวจสอบ",
};

// =================================================================
// [Hook Logic]
// =================================================================

export interface PriceAdjustment {
  label: string;
  value: string;
  impact: number;
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
  return useMemo(() => {
    const { model, storage, batteryHealth } = deviceInfo;

    // 1. Calculate Base Price
    let calculatedBasePrice = BASE_PRICES[model] || BASE_PRICES["default"];
    calculatedBasePrice += STORAGE_ADJUSTMENTS[storage] || 0;

    const adjustments: PriceAdjustment[] = [];
    let totalAdjustment = 0;

    // 2. Create Adjustments Array
    const allConditions = { ...conditionInfo, batteryHealth };

    for (const key in allConditions) {
      const typedKey = key as keyof typeof allConditions;
      const value = allConditions[typedKey];

      if (!value) continue; // Skip if value is empty

      // Handle touchscreen percentage
      if (typedKey === "touchScreen" && value.includes("%")) {
        const percentage = parseInt(value, 10);
        const status = percentage >= 90 ? "passed" : "failed";
        const impact =
          status === "passed" ? 0 : CONDITION_ADJUSTMENTS.touchScreen.failed;
        adjustments.push({
          label: "ระบบสัมผัส",
          value: `${percentage}% (${status})`,
          impact,
        });
        totalAdjustment += impact;
        continue;
      }

      const adjustmentRule = CONDITION_ADJUSTMENTS[typedKey];
      if (adjustmentRule) {
        const impact = adjustmentRule[value] ?? 0;

        // Don't show items with 0 impact unless it's a specific positive one like battery
        if (impact !== 0 || typedKey === "batteryHealth") {
          adjustments.push({
            label: key.charAt(0).toUpperCase() + key.slice(1), // Simple label generation
            value: TRANSLATION_MAP[value] || value,
            impact,
          });
          totalAdjustment += impact;
        }
      }
    }

    // 3. Calculate Final Price
    const finalPrice = calculatedBasePrice + totalAdjustment;

    return {
      basePrice: calculatedBasePrice,
      adjustments,
      finalPrice: Math.max(0, finalPrice), // Price cannot be negative
    };
  }, [deviceInfo, conditionInfo]);
};
