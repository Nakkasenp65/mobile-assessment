// src/app/(main)/components/HeroAssessmentForm.tsx
"use client";

import { useState, Fragment } from "react"; // (เพิ่ม) Import Fragment
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
// --- (เพิ่ม) นำเข้าไอคอนลูกศร ---
import {
  Square,
  CheckSquare,
  Search,
  FileCheck2,
  Wallet,
  ChevronRight,
  MoveRight, // ไอคอนลูกศร
} from "lucide-react";

const MOCK_DATA = {
  brands: ["Apple", "Samsung", "Google"],
  models: {
    Apple: ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 14 Pro Max"],
    Samsung: ["Galaxy S24 Ultra", "Galaxy S23 Ultra"],
    Google: ["Pixel 8 Pro", "Pixel 8"],
  },
  storage: {
    "iPhone 15 Pro Max": ["256GB", "512GB", "1TB"],
    "iPhone 15 Pro": ["128GB", "256GB", "512GB"],
    "iPhone 14 Pro Max": ["128GB", "256GB", "512GB"],
    "Galaxy S24 Ultra": ["256GB", "512GB", "1TB"],
    "Galaxy S23 Ultra": ["256GB", "512GB"],
    "Pixel 8 Pro": ["128GB", "256GB"],
    "Pixel 8": ["128GB", "256GB"],
  },
};

const processSteps = [
  { icon: Search, text: "ค้นหายี่ห้อ" },
  { icon: FileCheck2, text: "ตรวจสอบราคา" },
  { icon: Wallet, text: "รับเงินทันที" },
];

const HeroAssessmentForm = () => {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [isIcloudUnlocked, setIsIcloudUnlocked] = useState<boolean>(false);

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel("");
  };

  const isAppleSelected = selectedBrand === "Apple";
  const availableModels = selectedBrand
    ? MOCK_DATA.models[selectedBrand] || []
    : [];
  const availableStorage = selectedModel
    ? MOCK_DATA.storage[selectedModel] || []
    : [];

  return (
    <div className="w-full max-w-md sm:w-1/2 lg:w-2/5">
      {/* Form Wrapper */}
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* ... ส่วนของ Form ยังเหมือนเดิมทั้งหมด ... */}
          <h3 className="text-secondary text-center text-lg font-bold sm:text-xl">
            ประเมินราคาโทรศัพท์ที่ต้องการขาย
          </h3>

          <Select onValueChange={handleBrandChange} value={selectedBrand}>
            <SelectTrigger className="h-12 w-full text-sm md:h-14 md:text-base">
              <SelectValue placeholder="เลือกยี่ห้อโทรศัพท์" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_DATA.brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={setSelectedModel}
            value={selectedModel}
            disabled={!selectedBrand}
          >
            <SelectTrigger className="h-12 w-full text-sm md:h-14 md:text-base">
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

          <Select disabled={!selectedModel}>
            <SelectTrigger className="h-12 w-full text-sm md:h-14 md:text-base">
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

          {isAppleSelected && (
            <div
              className="flex cursor-pointer items-center space-x-2 pt-2"
              onClick={() => setIsIcloudUnlocked(!isIcloudUnlocked)}
            >
              {isIcloudUnlocked ? (
                <CheckSquare className="h-5 w-5 text-pink-600" />
              ) : (
                <Square className="h-5 w-5 text-gray-400" />
              )}
              <label className="cursor-pointer text-sm leading-none font-medium select-none sm:text-base">
                สามารถปลดล็อค iCloud ได้
              </label>
            </div>
          )}

          <Button
            size="lg"
            onClick={() => {
              setTermsAccepted(true);
              router.replace("/assess");
            }}
            disabled={!selectedModel}
            className="text-primary-foreground mt-2 h-12 w-full transform-gpu rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-base font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/30 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none md:h-14 md:text-lg"
          >
            ประเมินราคา
          </Button>

          <div
            className="flex cursor-pointer items-start space-x-2.5 pt-2"
            onClick={() => setTermsAccepted(!termsAccepted)}
          >
            {termsAccepted ? (
              <CheckSquare className="mt-0.5 h-5 w-5 flex-shrink-0 text-pink-600" />
            ) : (
              <Square className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
            )}
            <label className="cursor-pointer text-sm leading-normal font-medium text-gray-700 select-none">
              ฉันได้อ่านและยอมรับ{" "}
              <a
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-pink-600 underline transition-colors hover:text-pink-800"
              >
                ข้อตกลงและเงื่อนไข
              </a>{" "}
              การใช้บริการ
            </label>
          </div>
        </form>
      </div>

      {/* --- (ปรับปรุง) Section ขั้นตอนการใช้งาน --- */}
      {/* 
        - justify-center เพื่อจัดให้อยู่ตรงกลาง
        - items-center เพื่อให้ลูกศรอยู่กึ่งกลางแนวตั้ง
        - gap-2 เพื่อสร้างระยะห่างระหว่าง Step กับลูกศร
      */}
      <div className="mt-8 flex items-center justify-center gap-2 text-center sm:gap-4">
        {processSteps.map((step, index) => (
          // ใช้ Fragment เพื่อ group step และลูกศรเข้าด้วยกัน
          <Fragment key={index}>
            {/* Step Item (เหมือนเดิม) */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
                <step.icon className="h-7 w-7 text-pink-600" />
              </div>
              <p className="text-sm font-semibold text-white">{step.text}</p>
            </div>

            {/* (เพิ่ม) แสดงลูกศร ถ้าไม่ใช่ step สุดท้าย */}
            {index < processSteps.length - 1 && (
              <MoveRight
                className="mb-6 h-8 w-8 flex-shrink-0 text-white"
                strokeWidth={2}
              />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default HeroAssessmentForm;
