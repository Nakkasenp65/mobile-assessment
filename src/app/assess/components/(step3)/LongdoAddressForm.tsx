// src/app/assess/components/(step3)/LongdoAddressForm.tsx
"use client";

import { useEffect, useRef } from "react";

// ประกาศ Type ของข้อมูลที่ได้จาก Longdo เพื่อความปลอดภัย
export interface LongdoAddressData {
  subdistrict: string;
  district: string;
  province: string;
  postcode: string;
}

interface LongdoAddressFormProps {
  onAddressSelect: (address: LongdoAddressData) => void;
}
declare const longdo: any;

const LongdoAddressForm = ({ onAddressSelect }: LongdoAddressFormProps) => {
  const onAddressSelectRef = useRef(onAddressSelect);
  useEffect(() => {
    onAddressSelectRef.current = onAddressSelect;
  }, [onAddressSelect]);

  useEffect(() => {
    const initializeForm = () => {
      if (typeof longdo !== "undefined" && longdo.AddressForm) {
        try {
          new longdo.AddressForm("longdo-address-form-container", {
            style: "/css/longdo-custom.css",
            showLabels: true,
            onchanged: (address: LongdoAddressData) => {
              onAddressSelectRef.current(address);
            },
          });
          console.log("✅ Longdo Address Form initialized successfully with labels.");
        } catch (error) {
          console.error("❌ Longdo Address Form initialization failed:", error);
        }
      } else {
        console.error("❌ Attempted to initialize form, but `longdo.AddressForm` was not found.");
        const container = document.getElementById("longdo-address-form-container");
        if (container) {
          container.innerHTML = `<p class="text-destructive text-sm">เกิดข้อผิดพลาดในการโหลดฟอร์มที่อยู่ กรุณาลองใหม่อีกครั้ง</p>`;
        }
      }
    };

    if (typeof longdo !== "undefined" && longdo.AddressForm) {
      initializeForm();
    } else {
      window.addEventListener("longdo-all-scripts-ready", initializeForm, { once: true });
    }

    return () => {
      window.removeEventListener("longdo-all-scripts-ready", initializeForm);
    };
  }, []);

  return (
    <div
      id="longdo-address-form-container"
      className="[&_input]:border-input w-full [&_input]:h-12 [&_input]:rounded-md [&_input]:border"
    >
      <p className="text-muted-foreground text-sm">กำลังโหลดฟอร์มที่อยู่...</p>
    </div>
  );
};

export default LongdoAddressForm;
