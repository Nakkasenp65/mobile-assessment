// src/components/WebApiTestDashboard.tsx

"use client";

import { useState, useEffect } from "react";

// การกำหนด Type สำหรับสถานะการทดสอบเพื่อความชัดเจน
type TestStatus = "รอทดสอบ" | "กำลังทดสอบ..." | "ไม่รองรับ" | string;

interface TestResults {
  battery: TestStatus;
  network: TestStatus;
  camera: TestStatus;
  bluetooth: TestStatus;
}

/**
 * CHIRON's NOTE:
 * นี่คือ Component ที่ทำหน้าที่เป็น "สนามทดสอบทางวิศวกรรม"
 * เพื่อประเมินขีดความสามารถและข้อจำกัดของ Web API บนเบราว์เซอร์จริง
 * แต่ละการทดสอบถูกออกแบบมาเพื่อแสดงให้เห็นถึง "ความจริง" ของสถาปัตยกรรม Sandbox
 * ที่เราทำงานอยู่ภายใน
 */
const WebApiTestDashboard = () => {
  const [results, setResults] = useState<TestResults>({
    battery: "รอทดสอบ",
    network: "รอทดสอบ",
    camera: "รอทดสอบ",
    bluetooth: "รอทดสอบ",
  });

  // --- การทดสอบอัตโนมัติ (ทำงานเมื่อ Component โหลด) ---
  useEffect(() => {
    // 1. การทดสอบสถานะแบตเตอรี่
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateStatus = () => {
          setResults((prev) => ({
            ...prev,
            battery: battery.charging
              ? `✅ กำลังชาร์จ (ระดับแบตเตอรี่: ${Math.floor(battery.level * 100)}%)`
              : `❌ ไม่ได้ชาร์จ (ระดับแบตเตอรี่: ${Math.floor(battery.level * 100)}%)`,
          }));
        };
        updateStatus();
        // ทำให้สถานะอัปเดตตามจริงเมื่อมีการเสียบ/ถอดสายชาร์จ
        battery.addEventListener("chargingchange", updateStatus);
      });
    } else {
      setResults((prev) => ({ ...prev, battery: "❌ API ไม่รองรับ" }));
    }

    // 2. การทดสอบสถานะการเชื่อมต่อ (Wi-Fi/Cellular)
    if ("connection" in navigator) {
      const connection = navigator.connection;
      console.log("connection : ", connection);
      console.log("navigator : ", navigator);
      const updateNetworkStatus = () => {
        setResults((prev) => ({
          ...prev,
          network: connection?.type
            ? `✅ เชื่อมต่อผ่าน: ${connection.type.toUpperCase()}`
            : "⚠️ ไม่สามารถระบุประเภทได้",
        }));
      };
      updateNetworkStatus();
      // อัปเดตเมื่อมีการเปลี่ยนแปลงการเชื่อมต่อ
      connection?.addEventListener("change", updateNetworkStatus);
    } else {
      setResults((prev) => ({ ...prev, network: "❌ API ไม่รองรับ" }));
    }
  }, []);

  // --- การทดสอบเชิงโต้ตอบ (ทำงานเมื่อผู้ใช้กดปุ่ม) ---

  // 3. การทดสอบการเข้าถึงกล้อง
  const handleCameraTest = async () => {
    setResults((prev) => ({ ...prev, camera: "กำลังทดสอบ..." }));
    if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
      try {
        // ร้องขอสิทธิ์ในการเข้าถึงวิดีโอ (กล้อง)
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setResults((prev) => ({ ...prev, camera: "✅ เข้าถึงกล้องได้สำเร็จ" }));

        // **สำคัญมาก:** ปิดการใช้งานกล้องทันทีหลังทดสอบเสร็จสิ้นเพื่อปิดไฟกล้อง
        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        if (error) {
          setResults((prev) => ({
            ...prev,
            camera: "❌ เกิดข้อผิดพลาด หรือ ผู้ใช้ปฏิเสธการเข้าถึง",
          }));
        }
      }
    } else {
      setResults((prev) => ({ ...prev, camera: "❌ API ไม่รองรับ" }));
    }
  };

  // 4. การทดสอบ Bluetooth
  const handleBluetoothTest = async () => {
    setResults((prev) => ({ ...prev, bluetooth: "กำลังทดสอบ..." }));
    if ("bluetooth" in navigator) {
      // **CRITICAL ANALYSIS:**
      // Web Bluetooth API ไม่ได้ถูกออกแบบมาเพื่อ "ตรวจสอบว่า Bluetooth เปิดอยู่หรือไม่"
      // แต่มันถูกออกแบบมาเพื่อ "ร้องขอการเชื่อมต่อกับอุปกรณ์ Bluetooth Low Energy (BLE) ที่อยู่ใกล้เคียง"
      // การเรียกใช้ `requestDevice` จะเป็นการเปิดหน้าต่างให้ผู้ใช้เลือกอุปกรณ์เพื่อเชื่อมต่อ
      // ดังนั้น เราจึงไม่สามารถใช้มันเพื่อตรวจสอบสถานะ "เปิด/ปิด" ได้
      setResults((prev) => ({
        ...prev,
        bluetooth: "⚠️ API รองรับ แต่ไม่สามารถใช้ตรวจสอบสถานะ เปิด/ปิด ได้โดยตรง",
      }));
    } else {
      setResults((prev) => ({ ...prev, bluetooth: "❌ API ไม่รองรับ" }));
    }
  };

  return (
    <div className="p-6 bg-card rounded-xl border border-border shadow-lg font-sans">
      <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
        แผงควบคุมการทดสอบ Web API
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        ผลลัพธ์ด้านล่างนี้คือความจริงที่ได้จากสภาวะแวดล้อมของเบราว์เซอร์ที่ท่านใช้งานอยู่
      </p>
      <div className="space-y-4">
        {/* Battery Status */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold text-foreground">1. สถานะการชาร์จแบตเตอรี่</h3>
          <p className="text-xs text-muted-foreground">
            ตรวจสอบว่าอุปกรณ์กำลังชาร์จอยู่หรือไม่ (ไม่ต้องขออนุญาต)
          </p>
          <p className="text-sm font-mono mt-2 p-2 bg-muted rounded">{results.battery}</p>
        </div>

        {/* Network Status */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold text-foreground">2. ประเภทการเชื่อมต่อ</h3>
          <p className="text-xs text-muted-foreground">
            ตรวจสอบว่าเชื่อมต่อผ่าน Wi-Fi หรือ Cellular (ไม่ต้องขออนุญาต)
          </p>
          <p className="text-sm font-mono mt-2 p-2 bg-muted rounded">{results.network}</p>
        </div>

        {/* Camera Access */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold text-foreground">3. การเข้าถึงกล้อง</h3>
          <p className="text-xs text-muted-foreground">
            ทดสอบการร้องขอสิทธิ์เพื่อเปิดใช้งานกล้อง (ต้องขออนุญาต)
          </p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={handleCameraTest}
              className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors"
            >
              เริ่มทดสอบกล้อง
            </button>
            <p className="text-sm font-mono p-2 bg-muted rounded flex-1">{results.camera}</p>
          </div>
        </div>

        {/* Bluetooth Status */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold text-foreground">4. สถานะ Bluetooth</h3>
          <p className="text-xs text-muted-foreground">
            ประเมินความสามารถในการเข้าถึง Bluetooth API
          </p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={handleBluetoothTest}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary-hover transition-colors"
            >
              ประเมิน Bluetooth API
            </button>
            <p className="text-sm font-mono p-2 bg-muted rounded flex-1">{results.bluetooth}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebApiTestDashboard;
