// hooks/useBattery.ts

"use client";

import { useState, useEffect } from "react";

// --- [TYPE DEFINITIONS] ---
// สร้าง Interface สำหรับ BatteryManager เพื่อให้ TypeScript รู้จักโครงสร้างของมันอย่างเป็นทางการ
// และหลีกเลี่ยงการใช้ `any` โดยสิ้นเชิง
interface BatteryManager extends EventTarget {
  readonly charging: boolean;
  readonly level: number;
}

// นี่คือ "พิมพ์เขียว" ของข้อมูลที่ Hook ของเราจะส่งออกไปให้ Component อื่นใช้
export interface BatteryStatus {
  isSupported: boolean; // API นี้ถูกรองรับในเบราว์เซอร์หรือไม่
  charging: boolean | null; // กำลังชาร์จอยู่หรือไม่ (null คือยังไม่ทราบค่า)
  level: number | null; // ระดับแบตเตอรี่ (0-100, null คือยังไม่ทราบค่า)
  message: string; // ข้อความสรุปสถานะ
}

/**
 * CHIRON's NOTE:
 * This hook encapsulates all logic for interacting with the Battery Status API.
 * It provides a reactive, real-time status of the device's battery,
 * while ensuring proper event listener cleanup to prevent memory leaks.
 */
export const useBattery = (): BatteryStatus => {
  const [status, setStatus] = useState<BatteryStatus>({
    isSupported: true,
    charging: null,
    level: null,
    message: "กำลังตรวจสอบสถานะแบตเตอรี่...",
  });

  useEffect(() => {
    // 1. [Guard Clause] ตรวจสอบความเข้ากันได้ของเบราว์เซอร์เป็นอันดับแรก
    if (!("getBattery" in navigator)) {
      setStatus({
        isSupported: false,
        charging: null,
        level: null,
        message: "เบราว์เซอร์ไม่รองรับ API นี้",
      });
      return;
    }

    let batteryManager: BatteryManager | null = null;

    const updateStatus = (battery: BatteryManager) => {
      setStatus({
        isSupported: true,
        charging: battery.charging,
        level: Math.floor(battery.level * 100),
        message: battery.charging
          ? `กำลังชาร์จ (${Math.floor(battery.level * 100)}%)`
          : `ไม่ได้ชาร์จ (${Math.floor(battery.level * 100)}%)`,
      });
    };

    // 2. [Asynchronous Operation] เรียกใช้ API ซึ่งคืนค่าเป็น Promise
    (navigator as any).getBattery().then((battery: BatteryManager) => {
      batteryManager = battery;

      // 3. [Initial State Update] อัปเดตสถานะครั้งแรกทันทีที่ได้รับข้อมูล
      updateStatus(batteryManager);

      // 4. [Event Subscription] สมัครรับข่าวสารการเปลี่ยนแปลง
      batteryManager.addEventListener("chargingchange", () =>
        updateStatus(batteryManager!),
      );
      batteryManager.addEventListener("levelchange", () =>
        updateStatus(batteryManager!),
      );
    });

    // 5. [CRITICAL: Cleanup Function] นี่คือหัวใจของความแข็งแรงของ Hook นี้
    // ฟังก์ชันนี้จะทำงานเมื่อ Component ที่ใช้ Hook นี้ถูก unmount
    return () => {
      if (batteryManager) {
        // ยกเลิกการสมัครรับข่าวสารทั้งหมดเพื่อป้องกัน Memory Leak
        batteryManager.removeEventListener("chargingchange", () =>
          updateStatus(batteryManager!),
        );
        batteryManager.removeEventListener("levelchange", () =>
          updateStatus(batteryManager!),
        );
      }
    };
  }, []); // Dependency array ว่างเปล่า เพื่อให้ useEffect นี้ทำงานเพียงครั้งเดียวตลอด Lifecycle

  return status;
};
