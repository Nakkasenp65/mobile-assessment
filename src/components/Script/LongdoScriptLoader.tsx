// src/components/Script/LongdoScriptLoader.tsx
"use client";

import Script from "next/script";
import { useState } from "react";

const LongdoScriptLoader = () => {
  const [isMapSdkLoaded, setIsMapSdkLoaded] = useState(false);

  return (
    <>
      <Script
        id="longdo-map-sdk"
        src={`https://api.longdo.com/map/?key=${process.env.NEXT_PUBLIC_LONGDO_MAP_API_KEY}`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log("✅ Longdo Map SDK loaded successfully.");
          window.dispatchEvent(new Event("longdo-map-sdk-loaded"));
          setIsMapSdkLoaded(true);
        }}
        onError={(e) => {
          console.error("❌ Failed to load Longdo Map SDK:", e);
        }}
      />

      {isMapSdkLoaded && (
        <Script
          id="longdo-address-form-script"
          src="https://api.longdo.com/address-form/js/addressform.js"
          strategy="afterInteractive"
          onLoad={() => {
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
