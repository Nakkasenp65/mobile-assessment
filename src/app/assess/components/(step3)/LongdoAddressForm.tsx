// src/app/assess/components/(step3)/LongdoAddressForm.tsx
"use client";

import { useEffect, useRef } from "react";

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
  onAddressSelect: (address: LongdoAddressData) => void;
  initialData?: LongdoAddressData | null;
}

declare const longdo: any;

const LongdoAddressForm = ({ onAddressSelect, initialData }: LongdoAddressFormProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onAddressSelectRef = useRef(onAddressSelect);
  const initialDataRef = useRef(initialData);

  useEffect(() => {
    onAddressSelectRef.current = onAddressSelect;
  }, [onAddressSelect]);

  useEffect(() => {
    initialDataRef.current = initialData;
  }, [initialData]);

  useEffect(() => {
    const scrapeAddressData = () => {
      const subdistrictEl = document.getElementById("subdistrict") as HTMLSelectElement;
      const districtEl = document.getElementById("district") as HTMLSelectElement;
      const provinceEl = document.getElementById("province") as HTMLSelectElement;
      const postcodeEl = document.getElementById("postal_code") as HTMLInputElement;
      const addressEl = document.getElementById("etc") as HTMLTextAreaElement;

      const subdistrictText =
        subdistrictEl && subdistrictEl.selectedIndex > -1
          ? subdistrictEl.options[subdistrictEl.selectedIndex].text
          : "";
      const districtText =
        districtEl && districtEl.selectedIndex > -1 ? districtEl.options[districtEl.selectedIndex].text : "";
      const provinceText =
        provinceEl && provinceEl.selectedIndex > -1 ? provinceEl.options[provinceEl.selectedIndex].text : "";

      const data: LongdoAddressData = {
        subdistrict: subdistrictText,
        district: districtText,
        province: provinceText,
        postcode: postcodeEl?.value || "",
        address: addressEl?.value || "",
      };
      onAddressSelectRef.current(data);
    };

    const initializeForm = () => {
      if (typeof longdo !== "undefined" && longdo.AddressForm) {
        try {
          new longdo.AddressForm("longdo-address-form-container", {
            style: "/css/longdo-custom.css",
            showLabels: true,
            onchanged: scrapeAddressData,
          });
          console.log("✅ Longdo Address Form initialized.");

          const container = document.getElementById("longdo-address-form-container");
          if (container) {
            const observer = new MutationObserver((mutationsList, obs) => {
              for (const mutation of mutationsList) {
                if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                  const postcodeEl = document.getElementById("postal_code") as HTMLInputElement;
                  if (postcodeEl) {
                    console.log("✅ Longdo Form elements detected.");

                    if (initialDataRef.current?.postcode) {
                      const data = initialDataRef.current;
                      console.log("Applying initial geocode data:", data);

                      // --- วิธีที่ 1: กระตุ้นสคริปต์ Longdo ผ่านรหัสไปรษณีย์ ---
                      postcodeEl.value = data.postcode;
                      postcodeEl.dispatchEvent(new Event("input", { bubbles: true }));
                      postcodeEl.dispatchEvent(new Event("blur", { bubbles: true }));

                      const addressEl = document.getElementById("etc") as HTMLTextAreaElement;
                      const fullAddress = `${data.road || ""} ${data.aoi || ""}`.trim();
                      if (addressEl) {
                        addressEl.value = fullAddress;
                        addressEl.dispatchEvent(new Event("input", { bubbles: true }));
                      }

                      // --- วิธีที่ 2: บังคับตั้งค่า UI โดยตรง (Fallback) ---
                      // ใช้ Timeout เพื่อรอให้สคริปต์ Longdo มีเวลาสร้าง Options
                      setTimeout(() => {
                        console.log("Forcing UI update for dropdowns...");
                        const provinceEl = document.getElementById("province") as HTMLSelectElement;
                        const districtEl = document.getElementById("district") as HTMLSelectElement;
                        const subdistrictEl = document.getElementById("subdistrict") as HTMLSelectElement;

                        const forceSetUiValue = (selectEl: HTMLSelectElement, text: string) => {
                          if (!selectEl || !text) return;

                          const optionIndex = Array.from(selectEl.options).findIndex((opt) => opt.text === text);

                          if (optionIndex > -1) {
                            selectEl.selectedIndex = optionIndex;
                            selectEl.dispatchEvent(new Event("change", { bubbles: true }));
                            console.log(`✅ UI for ${selectEl.id} set to index ${optionIndex} ("${text}")`);
                          } else {
                            console.warn(
                              `Could not find option "${text}" for ${selectEl.id}. Options may not be loaded yet.`,
                            );
                          }
                        };

                        forceSetUiValue(provinceEl, data.province);
                        forceSetUiValue(districtEl, data.district);
                        forceSetUiValue(subdistrictEl, data.subdistrict);
                      }, 500); // หน่วงเวลา 500ms
                    }

                    obs.disconnect();
                    return;
                  }
                }
              }
            });
            observer.observe(container, { childList: true, subtree: true });
          }
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
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div ref={containerRef} id="longdo-address-form-container" className="w-full">
      <p className="text-muted-foreground text-sm">กำลังโหลดฟอร์มที่อยู่...</p>
    </div>
  );
};

export default LongdoAddressForm;
