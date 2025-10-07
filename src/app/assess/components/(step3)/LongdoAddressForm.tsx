// src/app/assess/components/(step3)/(services)/LongdoAddressForm.tsx
"use client";

import { useEffect } from "react";

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

// ประกาศ longdo เพื่อให้ TypeScript รู้จัก
declare const longdo: any;

const LongdoAddressForm = ({ onAddressSelect }: LongdoAddressFormProps) => {
  useEffect(() => {
    // Function สำหรับรอให้ script ของ Longdo โหลดเสร็จ
    const initializeForm = () => {
      if (typeof longdo === "undefined" || !longdo.AddressForm) {
        // ถ้ายังไม่พร้อม ให้ลองใหม่ใน 100ms
        setTimeout(initializeForm, 100);
        return;
      }

      // เมื่อพร้อมแล้ว ให้สร้างฟอร์ม
      new longdo.AddressForm("longdo-address-form-container", {
        showLabels: false, // ซ่อน Label ของ Longdo เอง
        onchanged: (address: LongdoAddressData) => {
          // เมื่อผู้ใช้เลือกที่อยู่ ให้ส่งข้อมูลกลับไปที่ Component แม่
          onAddressSelect(address);
        },
      });
    };

    initializeForm();
  }, [onAddressSelect]);

  // สร้าง div container สำหรับให้ Longdo นำฟอร์มไปใส่
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
