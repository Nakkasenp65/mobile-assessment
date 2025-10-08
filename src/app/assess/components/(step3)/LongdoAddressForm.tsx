"use client";

import { useEffect, useRef } from "react";

// Interface ยังคงเดิม
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
  // ✨ เอา onAddressSelect ออก
  // onAddressSelect: (address: LongdoAddressData) => void;
  // ✨ เพิ่ม Callback เพื่อแจ้งว่าฟอร์มพร้อมใช้งานแล้ว
  onFormReady: () => void;
  initialData?: LongdoAddressData | null;
}

declare const longdo: any;

const LongdoAddressForm = ({ onFormReady, initialData }: LongdoAddressFormProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isFormInitialized = useRef(false);
  const lastPopulatedData = useRef<string | null>(null);

  useEffect(() => {
    const initializeForm = () => {
      if (typeof longdo !== "undefined" && longdo.AddressForm && containerRef.current && !isFormInitialized.current) {
        containerRef.current.innerHTML = "";
        try {
          new longdo.AddressForm("longdo-address-form-container", {
            style: "/css/longdo-custom.css",
            showLabels: true,
            // ✨ ไม่จำเป็นต้องใช้ onchanged แล้ว เพราะ Parent จะดัก Event เอง
          });
          isFormInitialized.current = true;
          console.log("✅ Longdo Address Form initialized.");
          // ✨ ส่งสัญญาณบอก Parent ว่าฟอร์มพร้อมแล้ว!
          onFormReady();
        } catch (error) {
          console.error("❌ Longdo Address Form initialization failed:", error);
        }
      }
    };

    const populateForm = async (data: LongdoAddressData) => {
      // ... (ส่วน populateForm ทั้งหมดเหมือนเดิมเป๊ะ ไม่ต้องแก้ไข)
      if (!isFormInitialized.current) return;

      const setSelectValueByText = (selectEl: HTMLSelectElement, text: string): boolean => {
        const option = Array.from(selectEl.options).find((opt) => opt.text === text);
        if (option) {
          if (selectEl.value !== option.value) {
            selectEl.value = option.value;
            selectEl.dispatchEvent(new Event("input", { bubbles: true }));
            selectEl.dispatchEvent(new Event("change", { bubbles: true }));
          }
          return true;
        }
        return false;
      };

      const waitUntilOptionExists = async (
        elementId: string,
        text: string,
        retries = 15,
        delay = 200,
      ): Promise<HTMLSelectElement | null> => {
        for (let i = 0; i < retries; i++) {
          const selectEl = document.getElementById(elementId) as HTMLSelectElement;
          if (selectEl) {
            const option = Array.from(selectEl.options).find((opt) => opt.text === text);
            if (option) return selectEl;
          }
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        console.warn(`❌ Timeout waiting for option "${text}" in #${elementId}.`);
        return null;
      };

      const postcodeEl = document.getElementById("postal_code") as HTMLInputElement;
      if (postcodeEl && postcodeEl.value !== data.postcode) {
        postcodeEl.value = data.postcode;
        postcodeEl.dispatchEvent(new Event("input", { bubbles: true }));
        postcodeEl.dispatchEvent(new Event("blur", { bubbles: true }));
      }

      const addressEl = document.getElementById("etc") as HTMLTextAreaElement;
      if (addressEl) {
        const addressText = data.address || `${data.road || ""} ${data.aoi || ""}`.trim();
        if (addressEl.value !== addressText) {
          addressEl.value = addressText;
          addressEl.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }

      const provinceEl = await waitUntilOptionExists("province", data.province);
      if (provinceEl) setSelectValueByText(provinceEl, data.province);

      const districtEl = await waitUntilOptionExists("district", data.district);
      if (districtEl) {
        setSelectValueByText(districtEl, data.district);
        const subdistrictEl = await waitUntilOptionExists("subdistrict", data.subdistrict);
        if (subdistrictEl) setSelectValueByText(subdistrictEl, data.subdistrict);
      }
    };

    // --- Main Logic ---
    if (!isFormInitialized.current) {
      if (typeof longdo !== "undefined" && longdo.AddressForm) {
        initializeForm();
      } else {
        window.addEventListener("longdo-all-scripts-ready", initializeForm, { once: true });
      }
    }

    const dataSignature = JSON.stringify(initialData);
    if (isFormInitialized.current && initialData && lastPopulatedData.current !== dataSignature) {
      lastPopulatedData.current = dataSignature;
      populateForm(initialData);
    }

    return () => {
      window.removeEventListener("longdo-all-scripts-ready", initializeForm);
    };
  }, [initialData, onFormReady]); // ✨ เปลี่ยน Dependency

  return (
    <div ref={containerRef} id="longdo-address-form-container" className="w-full">
      <p className="text-muted-foreground text-sm">กำลังโหลดฟอร์มที่อยู่...</p>
    </div>
  );
};

export default LongdoAddressForm;
