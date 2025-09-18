// hooks/useNetworkStatus.ts

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
interface ExtendedNetworkInformation extends NetworkInformation {
  type?:
    | "bluetooth"
    | "cellular"
    | "ethernet"
    | "none"
    | "wifi"
    | "wimax"
    | "other"
    | "unknown";
}

// การกำหนด Type สำหรับสถานะของเครือข่าย
export type NetworkQuality =
  | "excellent"
  | "good"
  | "poor"
  | "offline"
  | "unknown"
  | "evaluating"
  | "ignore";
export type ConnectionType =
  | "unknown"
  | "ethernet"
  | "other"
  | "none"
  | "bluetooth"
  | "mixed"
  | "wimax"
  | "wifi"
  | "cellular"
  | "evaluating"
  | "2g"
  | "slow-2g"
  | "3g"
  | "4g"
  | "5g";

interface NetworkStatus {
  quality: NetworkQuality;
  type: ConnectionType;
  message: string;
}

// ค่าเกณฑ์มาตรฐานสำหรับการประเมินคุณภาพ (สามารถปรับได้)
const WIFI_GOOD_DOWNLINK_MBPS = 5;

/**
 * CHIRON's NOTE:
 * This hook encapsulates the logic for proactively monitoring network status.
 * It subscribes to network changes and provides a real-time assessment,
 * enabling the UI to offer intelligent guidance to the user.
 */
export const useNetworkStatus = (): NetworkStatus => {
  const [status, setStatus] = useState<NetworkStatus>({
    quality: "unknown",
    type: "unknown",
    message: "กำลังเตรียมระบบตรวจสอบ...",
  });

  // --- [STRUCTURAL ADDITION] ---
  // ใช้ useRef เพื่อเก็บ ID ของ interval โดยไม่ทำให้เกิด re-render
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const assessConnection = useCallback(() => {
    console.log("CHECK : ", assessConnection);
    if (!("connection" in navigator)) {
      setStatus({
        quality: "unknown",
        type: "unknown",
        message: "เบราว์เซอร์ไม่รองรับ",
      });
      return;
    }

    // --- [BURST ASSESSMENT LOGIC] ---
    // 1. หยุดการประเมินเก่า (ถ้ามี) เพื่อเริ่มรอบใหม่เสมอ
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    console.log("CHECK : ", intervalRef.current);

    // 2. ตั้งค่าสถานะเริ่มต้นเป็น "กำลังประเมิน"
    setStatus((prev) => ({
      ...prev,
      quality: "evaluating",
      message: "กำลังประเมินคุณภาพเครือข่าย...",
    }));

    const connection = navigator.connection as ExtendedNetworkInformation;
    console.log("Connection: ", connection);

    // 3. เริ่ม Interval เพื่อประเมินทุก 1 วินาที
    intervalRef.current = setInterval(() => {
      const currentType = connection.type || "unknown";

      if (!navigator.onLine) {
        setStatus({
          quality: "offline",
          type: "none",
          message: "คุณไม่ได้เชื่อมต่ออินเทอร์เน็ต",
        });
        return;
      }

      if (currentType === "wifi") {
        const downlink = connection.downlink || 0;
        setStatus({
          quality: downlink >= WIFI_GOOD_DOWNLINK_MBPS ? "excellent" : "poor",
          type: "wifi",
          message: `การเชื่อมต่อ Wi-Fi (ความเร็ว: ${downlink.toFixed(2)} Mbps)`,
        });
      } else if (currentType === "unknown") {
        setStatus({
          quality: "unknown",
          type: connection.effectiveType,
          message: `ไม่พบสัญญาณ`,
        });
      } else {
        setStatus({
          quality: "good",
          type: currentType,
          message: `เชื่อมต่อผ่าน ${currentType}`,
        });
      }
    }, 500); // ทำงานทุก 1 วินาที

    // 4. ตั้งเวลาเพื่อหยุดการประเมินหลังจาก 5 วินาที
    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 5000); // หยุดหลังจาก 5 วินาที
  }, []);

  useEffect(() => {
    console.log("window: ", window);
    console.log("navigator", navigator);
    if (typeof window !== "undefined" && "connection" in navigator) {
      const connection = navigator.connection as ExtendedNetworkInformation;

      // ประเมินครั้งแรกเมื่อ Hook ถูกเรียกใช้
      assessConnection();

      connection.addEventListener("change", assessConnection);

      // --- [ENHANCED CLEANUP] ---
      // ยกเลิกการสมัครและหยุด interval ใดๆ ที่อาจยังทำงานอยู่
      return () => {
        connection.removeEventListener("change", assessConnection);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [assessConnection]);

  return status;
};
