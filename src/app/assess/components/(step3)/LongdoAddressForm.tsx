// src/app/assess/components/(step3)/LongdoAddressForm.tsx
"use client";

import { useEffect, useRef } from "react";

export interface LongdoAddressData {
  subdistrict: string;
  district: string;
  province: string;
  postcode: string;
  address: string;
}

interface LongdoAddressFormProps {
  onAddressSelect: (address: LongdoAddressData) => void;
}

declare const longdo: any;

const LongdoAddressForm = ({ onAddressSelect }: LongdoAddressFormProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onAddressSelectRef = useRef(onAddressSelect);

  useEffect(() => {
    onAddressSelectRef.current = onAddressSelect;
  }, [onAddressSelect]);

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
                  if (document.getElementById("postal_code")) {
                    console.log("✅ Longdo Form elements detected. Attaching listeners.");
                    const elementsToWatch = ["subdistrict", "district", "province", "postal_code", "etc"];
                    elementsToWatch.forEach((id) => {
                      const el = document.getElementById(id);
                      if (el) {
                        el.addEventListener("input", scrapeAddressData);
                        el.addEventListener("change", scrapeAddressData);
                      }
                    });
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
