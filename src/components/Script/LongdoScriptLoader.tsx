// src/components/Script/LongdoScriptLoader.tsx
"use client";

import Script from "next/script";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type ScriptLoadStatus = "loading" | "ready" | "error";

interface LongdoMapScriptContextType {
  scriptLoadStatus: ScriptLoadStatus;
}

const LongdoMapScriptContext = createContext<LongdoMapScriptContextType | undefined>(undefined);

// 4. สร้าง Provider Component
export const LongdoMapScriptProvider = ({ children }: { children: ReactNode }) => {
  const [scriptLoadStatus, setScriptLoadStatus] = useState<ScriptLoadStatus>("loading");
  const [isMapSdkLoaded, setIsMapSdkLoaded] = useState(false);

  // Memoize context value เพื่อ performance
  const contextValue = useMemo(
    () => ({
      scriptLoadStatus,
    }),
    [scriptLoadStatus],
  );

  return (
    <LongdoMapScriptContext.Provider value={contextValue}>
      {/* ส่วนนี้คือ Script Loader เดิมของคุณ แต่ย้ายมาอยู่ใน Provider
        และเพิ่มการ setScriptLoadStatus("error") ใน onError
      */}
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
          setScriptLoadStatus("error"); // <-- จุดสำคัญ: อัปเดตสถานะเป็น error
        }}
      />

      {isMapSdkLoaded && (
        <Script
          id="longdo-address-form-script"
          src="https://api.longdo.com/address-form/js/addressform.js"
          strategy="afterInteractive"
          onLoad={() => {
            console.log("✅ Longdo Address Form script loaded.");
            window.dispatchEvent(new Event("longdo-all-scripts-ready"));
            setScriptLoadStatus("ready"); // <-- จุดสำคัญ: อัปเดตสถานะเป็น ready
          }}
          onError={(e) => {
            console.error("❌ Failed to load Longdo Address Form script:", e);
            setScriptLoadStatus("error"); // <-- จุดสำคัญ: อัปเดตสถานะเป็น error
          }}
        />
      )}

      {/* 5. Render children (แอปของคุณ) */}
      {children}
    </LongdoMapScriptContext.Provider>
  );
};

// 6. สร้าง Custom Hook เพื่อง่ายต่อการเรียกใช้
export const useLongdoMapScript = () => {
  const context = useContext(LongdoMapScriptContext);
  if (context === undefined) {
    throw new Error("useLongdoMapScript must be used within a LongdoMapScriptProvider");
  }
  return context;
};
