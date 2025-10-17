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

// Longdo AddressForm typings to avoid `any`
// Use a safe object type for the Longdo AddressForm instance
type LongdoAddressFormInstance = object;

interface LongdoAddressFormOptions {
  style?: string;
  showLabels?: boolean;
  onchanged?: (address: Omit<LongdoAddressData, "address">) => void;
}

interface LongdoNamespace {
  AddressForm?: new (containerId: string, options?: LongdoAddressFormOptions) => LongdoAddressFormInstance;
}

declare const longdo: LongdoNamespace;

const LongdoAddressForm = ({ onAddressChange, initialData }: LongdoAddressFormProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isFormInitialized = useRef(false);
  const lastPopulatedData = useRef<string | null>(null);
  const listenersAttachedRef = useRef(false);
  const boundListenersRef = useRef<Array<{ el: Element; type: string; handler: EventListener }>>([]);
  const patchedTextareasRef = useRef<Array<{ el: HTMLTextAreaElement; original: PropertyDescriptor }>>([]);
  const valueWatchIntervalRef = useRef<number | null>(null);

  const stableOnAddressChange = useCallback(onAddressChange, [onAddressChange]);

  // Helper: read current values from injected DOM controls
  const readFormValues = useCallback((): LongdoAddressData => {
    const provinceEl = document.getElementById("province") as HTMLSelectElement | null;
    const districtEl = document.getElementById("district") as HTMLSelectElement | null;
    const subdistrictEl = document.getElementById("subdistrict") as HTMLSelectElement | null;
    const postcodeEl = document.getElementById("postal_code") as HTMLInputElement | null;
    const addressEl = document.getElementById("etc") as HTMLTextAreaElement | null;

    const getSelectedText = (sel: HTMLSelectElement | null) =>
      sel && sel.selectedIndex >= 0 ? sel.options[sel.selectedIndex].text : "";

    return {
      province: getSelectedText(provinceEl),
      district: getSelectedText(districtEl),
      subdistrict: getSelectedText(subdistrictEl),
      postcode: postcodeEl?.value || "",
      address: addressEl?.value || "",
    };
  }, []);

  // Attach plain JS listeners to injected controls for two-way binding
  const attachTwoWayBindingListeners = useCallback(() => {
    if (listenersAttachedRef.current) return;

    const provinceEl = document.getElementById("province");
    const districtEl = document.getElementById("district");
    const subdistrictEl = document.getElementById("subdistrict");
    const postcodeEl = document.getElementById("postal_code");
    const addressEl = document.getElementById("etc");

    const bind = (el: Element | null, type: string, handler: EventListener) => {
      if (!el) return;
      el.addEventListener(type, handler);
      boundListenersRef.current.push({ el, type, handler });
    };

    const emitChange = () => {
      try {
        const values = readFormValues();
        stableOnAddressChange(values);
      } catch (e) {
        // no-op: keep stability if elements not ready
      }
    };

    bind(provinceEl, "change", emitChange);
    bind(districtEl, "change", emitChange);
    bind(subdistrictEl, "change", emitChange);
    bind(postcodeEl, "input", emitChange);
    bind(postcodeEl, "blur", emitChange);
    bind(addressEl, "input", emitChange);

    // Patch textarea value setter to emit input on programmatic updates (e.g., suggestion selection)
    if (addressEl instanceof HTMLTextAreaElement) {
      const protoDesc = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value");
      if (protoDesc && protoDesc.set && protoDesc.get) {
        const original = protoDesc;
        const newDesc: PropertyDescriptor = {
          get() {
            return original.get!.call(this);
          },
          set(v: string) {
            original.set!.call(this, v);
            try {
              this.dispatchEvent(new Event("input", { bubbles: true }));
            } catch {
              // swallow to keep stability
            }
          },
        };
        try {
          Object.defineProperty(addressEl, "value", newDesc);
          patchedTextareasRef.current.push({ el: addressEl, original: original });
        } catch {
          // Fallback: start a lightweight watcher to detect value changes
          let lastVal = addressEl.value;
          valueWatchIntervalRef.current = window.setInterval(() => {
            if (addressEl.value !== lastVal) {
              lastVal = addressEl.value;
              emitChange();
            }
          }, 250);
        }
      }
    }

    listenersAttachedRef.current = true;
  }, [readFormValues, stableOnAddressChange]);

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

      // 7. Attach two-way binding listeners AFTER initial population
      attachTwoWayBindingListeners();
    };

    const dataSignature = JSON.stringify(initialData);
    if (initialData && lastPopulatedData.current !== dataSignature) {
      lastPopulatedData.current = dataSignature;
      void populateForm(initialData);
    }
  }, [initialData, stableOnAddressChange, attachTwoWayBindingListeners]);

  // Fallback: Attach listeners if there's no initialData (bind after form ready)
  useEffect(() => {
    if (initialData) return;
    let mounted = true;
    const tryAttach = async () => {
      // Wait until the injected controls exist
      while (mounted && (!isFormInitialized.current || !document.getElementById("province"))) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      if (mounted) attachTwoWayBindingListeners();
    };
    void tryAttach();
    return () => {
      mounted = false;
    };
  }, [initialData, attachTwoWayBindingListeners]);

  // Cleanup listeners on unmount to preserve stability
  useEffect(() => {
    return () => {
      boundListenersRef.current.forEach(({ el, type, handler }) => {
        el.removeEventListener(type, handler);
      });
      boundListenersRef.current = [];
      listenersAttachedRef.current = false;
      // Restore patched textarea setters
      patchedTextareasRef.current.forEach(({ el }) => {
        try {
          // Delete instance property to fall back to prototype
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          delete (el as any).value;
        } catch {
          // ignore
        }
      });
      patchedTextareasRef.current = [];
      if (valueWatchIntervalRef.current !== null) {
        window.clearInterval(valueWatchIntervalRef.current);
        valueWatchIntervalRef.current = null;
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
