// src/components/Script/LongdoScriptLoader.tsx
"use client";

import Script from "next/script";
import { useState } from "react";

const LongdoScriptLoader = () => {
  // --- SECTION: State for Script Loading ---
  // [แก้ไข] เพิ่ม State เพื่อจัดการลำดับการโหลด Script
  // Longdo Address Form (addressform.js) จำเป็นต้องรอให้ Longdo Map SDK (map) โหลดเสร็จก่อน
  // เราจึงใช้ State `isMapSdkLoaded` เป็นตัวควบคุม
  const [isMapSdkLoaded, setIsMapSdkLoaded] = useState(false);

  return (
    <>
      {/* --- Script 1: Longdo Map SDK (ต้องโหลดก่อนเสมอ) --- */}
      <Script
        id="longdo-map-sdk"
        src={`https://api.longdo.com/map/?key=${process.env.NEXT_PUBLIC_LONGDO_MAP_API_KEY}`}
        strategy="afterInteractive" // แนะนำให้ระบุ strategy เพื่อความชัดเจน
        onLoad={() => {
          console.log("✅ Longdo Map SDK loaded successfully.");
          // [ปรับปรุง] ส่ง Event เดิมเผื่อมีส่วนอื่นใช้งาน แต่หลักๆ เราจะใช้ State
          window.dispatchEvent(new Event("longdo-map-sdk-loaded"));
          // เมื่อ SDK หลักโหลดเสร็จ, อัปเดต State เพื่อเริ่มโหลด Script ตัวถัดไป
          setIsMapSdkLoaded(true);
        }}
        onError={(e) => {
          console.error("❌ Failed to load Longdo Map SDK:", e);
        }}
      />

      {/* --- Script 2: Longdo Address Form (จะโหลดเมื่อ SDK พร้อม) --- */}
      {/* [แก้ไข] ใช้ State ในการ Render Script ตัวที่สองแบบมีเงื่อนไข (Conditional Rendering) */}
      {/* ทำให้มั่นใจได้ 100% ว่าจะเริ่มโหลด script นี้หลังจาก SDK หลักพร้อมใช้งานแล้ว */}
      {isMapSdkLoaded && (
        <Script
          id="longdo-address-form-script"
          src="https://api.longdo.com/address-form/js/addressform.js"
          strategy="afterInteractive"
          onLoad={() => {
            console.log("✅ Longdo Address Form script loaded successfully.");
            // [แก้ไข] สร้าง Event ใหม่ที่เฉพาะเจาะจงกว่าเดิม เมื่อทุกอย่างพร้อมจริงๆ
            // เพื่อให้ Component ที่รอใช้งาน (LongdoAddressForm.tsx) ทำงานได้อย่างแม่นยำ
            window.dispatchEvent(new Event("longdo-all-scripts-ready"));
          }}
          onError={(e) => {
            console.error("❌ Failed to load Longdo Address Form script:", e);
          }}
        />
      )}
    </>
  );
};

export default LongdoScriptLoader;
