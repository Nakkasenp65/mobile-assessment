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
  default: 15000,
};

const STORAGE_ADJUSTMENTS: Record<string, number> = {
  "128 GB": 0,
  "256 GB": 3000,
  "512 GB": 6000,
  "1 TB": 10000,
};

const CONDITION_ADJUSTMENTS: Record<string, Record<string, number>> = {
  screenGlass: { passed: 0, failed: -1500, defect: -5000 },
  screenDisplay: { passed: 0, failed: -3000, defect: -8000 },
  powerOn: { passed: 0, failed: -4000 },
  camera: { passed: 0, failed: -2500 },
  charger: { passed: 0, failed: -1000 },
  wifi: { passed: 0, failed: -500 },
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
  failed: "มีปัญหาเล็กน้อย",
  defect: "มีตำหนิ/เสีย",
  minor: "มีรอยเล็กน้อย",
  cracked: "กระจกแตก",
  spots: "มีจุด/เส้น",
  not_working: "ไม่แสดงผล",
  yes: "เปิดติดปกติ",
  sometimes: "เปิดติดบ้าง",
  passed: "ทำงานปกติ",
  success: "ชาร์จปกติ",
  good: "เชื่อมต่อได้",
  excellent: "เชื่อมต่อได้ดี",
  poor: "การเชื่อมต่อช้า",
  ignore: "ข้ามการตรวจสอบ",
  unsupported: "ไม่รองรับ",
};

const LABEL_MAP: Record<string, string> = {
  brand: "ยี่ห้อ",
  model: "รุ่น",
  storage: "ความจุ",
  batteryHealth: "สุขภาพแบตเตอรี่",
  screenGlass: "สภาพกระจกหน้าจอ",
  screenDisplay: "คุณภาพการแสดงผล",
  powerOn: "การเปิดเครื่อง",
  touchScreen: "ระบบสัมผัส",
  wifi: "Wi-Fi",
  charger: "การชาร์จ",
  speaker: "ลำโพง",
  mic: "ไมโครโฟน",
  cameras: "กล้อง",
};

const GRADE_THRESHOLDS = { A: 0, B: 2, C: 4 };
const GRADE_TEXT_STYLES = {
  A: "from-yellow-500 to-amber-500",
  B: "from-green-500 to-emerald-500",
  C: "from-blue-500 to-cyan-500",
  D: "from-red-500 to-rose-500",
};

// =================================================================
// [Hook Logic]
// =================================================================

export interface PriceAdjustment {
  key: string;
  label: string;
  value: string;
  impact: number;
}

export interface PriceCalculationResult {
  basePrice: number;
  adjustments: PriceAdjustment[];
  finalPrice: number;
  grade: "A" | "B" | "C" | "D";
  gradeTextStyle: string;
}

export const usePriceCalculation = (
  deviceInfo: DeviceInfo,
  conditionInfo: ConditionInfo,
): PriceCalculationResult => {
  return useMemo(() => {
    const { model, storage } = deviceInfo;
    const calculatedBasePrice =
      (BASE_PRICES[model] || BASE_PRICES["default"]) +
      (STORAGE_ADJUSTMENTS[storage] || 0);

    const adjustments: PriceAdjustment[] = [];
    let totalAdjustment = 0;
    const allInfo = { ...deviceInfo, ...conditionInfo };

    for (const key in LABEL_MAP) {
      const typedKey = key as keyof typeof allInfo;
      const value = allInfo[typedKey];
      const label = LABEL_MAP[typedKey];

      if (!value) continue;

      let impact = 0;
      let displayValue = TRANSLATION_MAP[value] || value;

      if (typedKey === "touchScreen" && value.includes("%")) {
        const percentage = parseInt(value, 10);
        const status = percentage >= 90 ? "passed" : "failed";
        impact =
          status === "passed" ? 0 : CONDITION_ADJUSTMENTS.touchScreen.failed;
        displayValue = `${percentage}% (${TRANSLATION_MAP[status]})`;
      } else {
        const adjustmentRule = CONDITION_ADJUSTMENTS[typedKey];
        if (adjustmentRule) {
          impact = adjustmentRule[value] ?? 0;
        }
      }

      adjustments.push({ key: typedKey, label, value: displayValue, impact });
      totalAdjustment += impact;
    }

    const issueCount = adjustments.filter((adj) => adj.impact < 0).length;
    let grade: "A" | "B" | "C" | "D" = "D";
    if (issueCount <= GRADE_THRESHOLDS.A) grade = "A";
    else if (issueCount <= GRADE_THRESHOLDS.B) grade = "B";
    else if (issueCount <= GRADE_THRESHOLDS.C) grade = "C";

    const gradeTextStyle = GRADE_TEXT_STYLES[grade];

    const finalPrice = calculatedBasePrice + totalAdjustment;

    return {
      basePrice: calculatedBasePrice,
      adjustments,
      finalPrice: Math.max(0, finalPrice),
      grade,
      gradeTextStyle,
    };
  }, [deviceInfo, conditionInfo]);
};
