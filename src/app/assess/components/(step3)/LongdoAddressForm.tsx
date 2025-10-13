// src/app/assess/components/(step3)/LongdoAddressForm.tsx

"use client";

import { useEffect, useRef, useCallback } from "react";

export interface LongdoAddressData {
  subdistrict: string;
  district: string;
  province: string;
  postcode: string;
  address: string;
  road?: string;
  aoi?: string;
}

interface LongdoAddressFormProps {
  onAddressChange: (address: LongdoAddressData) => void;
  initialData?: LongdoAddressData | null;
}

declare const longdo: any;

const LongdoAddressForm = ({ onAddressChange, initialData }: LongdoAddressFormProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isFormInitialized = useRef(false);
  const lastPopulatedData = useRef<string | null>(null);

  const stableOnAddressChange = useCallback(onAddressChange, [onAddressChange]);

  // useEffect สำหรับสร้างฟอร์ม (ทำงานครั้งเดียว)
  useEffect(() => {
    const initializeForm = () => {
      if (containerRef.current && typeof longdo !== "undefined" && longdo.AddressForm && !isFormInitialized.current) {
        containerRef.current.innerHTML = "";
        try {
          new longdo.AddressForm("longdo-address-form-container", {
            style: "/css/longdo-custom.css",
            showLabels: true,
            onchanged: (address: Omit<LongdoAddressData, "address">) => {
              const fullAddress: LongdoAddressData = {
                ...address,
                address: (document.getElementById("etc") as HTMLTextAreaElement)?.value || "",
              };
              stableOnAddressChange(fullAddress);
            },
          });
          isFormInitialized.current = true;
          console.log("✅ Longdo Address Form Initialized.");
        } catch (error) {
          console.error("❌ Longdo Address Form initialization failed:", error);
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
      isFormInitialized.current = false;
    };
  }, [stableOnAddressChange]);

  // useEffect สำหรับเติมข้อมูล (ทำงานเมื่อ initialData เปลี่ยน)
  useEffect(() => {
    // ✨ [CRITICAL FIX] สร้างฟังก์ชัน populateForm ที่ฉลาดและรอได้
    const populateForm = async (data: LongdoAddressData) => {
      // รอจนกว่าฟอร์มจะพร้อม 100%
      while (!isFormInitialized.current || !document.getElementById("province")) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.log("🚀 Populating form with data:", data);

      // Helper ที่จะคอยเช็คจนกว่า option ที่ต้องการจะโผล่มา
      const waitUntilOptionExists = async (elementId: string, text: string): Promise<boolean> => {
        for (let i = 0; i < 20; i++) {
          // พยายาม 20 ครั้ง (รวม 6 วินาที)
          const selectEl = document.getElementById(elementId) as HTMLSelectElement;
          if (selectEl) {
            const option = Array.from(selectEl.options).find((opt) => opt.text === text);
            if (option) {
              if (selectEl.value !== option.value) {
                selectEl.value = option.value;
                selectEl.dispatchEvent(new Event("change", { bubbles: true }));
              }
              return true;
            }
          }
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
        console.warn(`Timeout waiting for option "${text}" in #${elementId}`);
        return false;
      };

      // 1. เติมรหัสไปรษณีย์ก่อนเพื่อกระตุ้นให้ Longdo โหลดข้อมูล
      const postcodeEl = document.getElementById("postal_code") as HTMLInputElement;
      if (postcodeEl) {
        postcodeEl.value = data.postcode;
        postcodeEl.dispatchEvent(new Event("blur", { bubbles: true }));
      }

      // 2. รอจน province โหลดเสร็จแล้วค่อยเลือก
      await waitUntilOptionExists("province", data.province);

      // 3. รอจน district โหลดเสร็จแล้วค่อยเลือก
      await waitUntilOptionExists("district", data.district);

      // 4. รอจน subdistrict โหลดเสร็จแล้วค่อยเลือก
      await waitUntilOptionExists("subdistrict", data.subdistrict);

      // 5. เติมที่อยู่
      const addressEl = document.getElementById("etc") as HTMLTextAreaElement;
      if (addressEl) {
        const addressText = data.address || `${data.road || ""} ${data.aoi || ""}`.trim();
        addressEl.value = addressText;
      }

      // 6. บังคับส่งข้อมูลกลับไปหา Parent หลังเติมข้อมูลเสร็จสมบูรณ์
      console.log("✅ Forcing state update after populating form.");
      stableOnAddressChange({
        province: data.province,
        district: data.district,
        subdistrict: data.subdistrict,
        postcode: data.postcode,
        address: (document.getElementById("etc") as HTMLTextAreaElement)?.value || "",
      });
    };

    const dataSignature = JSON.stringify(initialData);
    if (initialData && lastPopulatedData.current !== dataSignature) {
      lastPopulatedData.current = dataSignature;
      populateForm(initialData);
    }
  }, [initialData, stableOnAddressChange]);

  return (
    <div ref={containerRef} id="longdo-address-form-container" className="w-full">
      <p className="text-muted-foreground text-sm">กำลังโหลดฟอร์มที่อยู่...</p>
    </div>
  );
};

export default LongdoAddressForm;
