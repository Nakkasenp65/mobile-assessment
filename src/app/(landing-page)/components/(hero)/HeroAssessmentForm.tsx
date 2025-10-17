// src/app/(main)/components/(hero)/HeroAssessmentForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { PHONE_DATA } from "@/util/phone";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LockKeyhole } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import DPOConsent from "@/components/ui/DpoConsent";

export default function HeroAssessmentForm() {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedProductType, setSelectedProductType] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedStorage, setSelectedStorage] = useState<string>("");
  const [canUnlockIcloud, setCanUnlockIcloud] = useState<boolean>(true);
  const [isDpoConsentVisible, setIsDpoConsentVisible] = useState(false);

  const availableBrands = PHONE_DATA.brands;
  const availableProductTypes = selectedBrand === "Apple" ? PHONE_DATA.products[selectedBrand] || [] : [];

  // SECTION: Event Handlers
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedProductType("");
    setSelectedModel("");
    setSelectedStorage("");
  };

  const handleProductTypeChange = (productType: string) => {
    setSelectedProductType(productType);
    setSelectedModel("");
    setSelectedStorage("");
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setSelectedStorage("");
  };

  const handleAcceptConsentAndNavigate = () => {
    // ปิด Modal ก่อนเสมอเมื่อกด "ยอมรับ"
    setIsDpoConsentVisible(false);

    // ตรวจสอบเงื่อนไขการ Redirect สำหรับสินค้า Apple ที่ไม่มีรุ่น/ความจุ
    if (selectedBrand === "Apple" && selectedProductType && !["iPhone", "iPad"].includes(selectedProductType)) {
      const params = new URLSearchParams({
        brand: "Apple",
        productType: selectedProductType,
        isFromMainPage: "true",
        isIcloudUnlock: String(canUnlockIcloud),
      });
      router.push(`/assess?${params.toString()}`);
      return;
    }

    // ตรวจสอบ Validation ของฟอร์ม
    if (!selectedBrand || !selectedModel || !selectedStorage) return;
    if (selectedBrand === "Apple" && !selectedProductType) return;

    // สร้าง URL และ Redirect
    const params = new URLSearchParams({
      brand: selectedBrand,
      productType: selectedProductType,
      model: selectedModel,
      capacity: selectedStorage,
      isFromMainPage: "true",
    });

    if (selectedBrand === "Apple") {
      params.append("isIcloudUnlock", String(canUnlockIcloud));
    }

    const url = `/assess?${params.toString()}`;
    router.push(url);
  };

  const handleShowConsent = () => {
    setIsDpoConsentVisible(true);
  };

  const handleCloseConsent = () => {
    setIsDpoConsentVisible(false);
  };

  const availableModels = (() => {
    if (selectedBrand !== "Apple") {
      return PHONE_DATA.models[selectedBrand] || [];
    }
    if (["iPhone", "iPad"].includes(selectedProductType)) {
      return PHONE_DATA.models[selectedProductType] || [];
    }
    return [];
  })();

  const availableStorage = selectedModel ? PHONE_DATA.storage[selectedModel] || [] : [];

  const isNextButtonDisabled = () => {
    if (!selectedBrand) return true;
    if (selectedBrand === "Apple") {
      if (!selectedProductType) return true;
      if (!["iPhone", "iPad"].includes(selectedProductType)) {
        return false;
      }
      return !selectedModel || !selectedStorage;
    } else {
      return !selectedModel || !selectedStorage;
    }
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-lg md:p-5 lg:p-6">
      <AnimatePresence>
        {isDpoConsentVisible && <DPOConsent onAccept={handleAcceptConsentAndNavigate} onClose={handleCloseConsent} />}
      </AnimatePresence>

      <form className="flex w-full flex-col gap-2.5 md:gap-3 lg:gap-4" onSubmit={(e) => e.preventDefault()}>
        <h3 className="text-secondary text-center text-base font-bold md:text-lg lg:text-xl">
          ประเมินราคาอุปกรณ์ของคุณ
        </h3>
        <AnimatePresence mode="wait">
          <Select key={"select-brand"} onValueChange={handleBrandChange} value={selectedBrand}>
            <SelectTrigger className="h-10 w-full text-sm md:h-11 md:text-sm lg:text-base">
              <SelectValue placeholder="เลือกยี่ห้อ" />
            </SelectTrigger>
            <SelectContent>
              {availableBrands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedBrand === "Apple" && (
            <motion.div
              key="apple-product-type"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Select onValueChange={handleProductTypeChange} value={selectedProductType} disabled={!selectedBrand}>
                <SelectTrigger className="h-10 w-full text-sm md:h-11 md:text-sm lg:text-base">
                  <SelectValue placeholder="เลือกประเภทสินค้า" />
                </SelectTrigger>
                <SelectContent>
                  {availableProductTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          )}

          <div className="flex flex-col gap-2.5 md:gap-3 lg:gap-4" key={"form-model-storage"}>
            <Select onValueChange={handleModelChange} value={selectedModel} disabled={availableModels.length === 0}>
              <SelectTrigger className="h-10 w-full text-sm md:h-11 md:text-sm lg:text-base">
                <SelectValue placeholder="เลือกรุ่น" />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedStorage} value={selectedStorage} disabled={!selectedModel}>
              <SelectTrigger className="h-10 w-full text-sm md:h-11 md:text-sm lg:text-base">
                <SelectValue placeholder="เลือกความจุ" />
              </SelectTrigger>
              <SelectContent>
                {availableStorage.map((storage) => (
                  <SelectItem key={storage} value={storage}>
                    {storage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedBrand === "Apple" && ["iPhone", "iPad"].includes(selectedProductType) && (
            <motion.div
              key="icloud-toggle"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <label
                  htmlFor="icloud-toggle"
                  className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700 select-none lg:text-base"
                >
                  <LockKeyhole className="h-5 w-5 text-gray-500" />
                  สามารถปลดล็อก iCloud ได้
                </label>
                <button
                  type="button"
                  id="icloud-toggle"
                  role="switch"
                  aria-checked={canUnlockIcloud}
                  onClick={() => setCanUnlockIcloud(!canUnlockIcloud)}
                  className={clsx(
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:outline-none",
                    {
                      "bg-pink-500": canUnlockIcloud,
                      "bg-gray-200": !canUnlockIcloud,
                    },
                  )}
                >
                  <motion.span
                    aria-hidden="true"
                    layout
                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                    className={clsx(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      {
                        "translate-x-5": canUnlockIcloud,
                        "translate-x-0": !canUnlockIcloud,
                      },
                    )}
                  />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          size="lg"
          onClick={handleShowConsent}
          disabled={isNextButtonDisabled()}
          className="text-primary-foreground mt-1 h-10 w-full rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-sm font-semibold shadow-lg duration-300 ease-in-out hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 md:h-11 md:text-base lg:text-lg"
        >
          ประเมินราคา
        </Button>

        <p className="mt-2 text-center text-xs text-gray-500">
          เมื่อเริ่มประเมินราคา ถือว่าท่านได้ยอมรับ{" "}
          <button type="button" onClick={handleShowConsent} className="text-pink-600 underline hover:text-pink-700">
            ข้อตกลงและเงื่อนไข
          </button>{" "}
          การใช้บริการ
        </p>
      </form>
    </div>
  );
}
