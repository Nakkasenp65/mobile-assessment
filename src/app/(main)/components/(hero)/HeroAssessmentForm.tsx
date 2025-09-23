// src/app/(main)/components/HeroAssessmentForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

// ข้อมูลจำลองสำหรับโทรศัพท์รุ่นต่างๆ
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

const HeroAssessmentForm = () => {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel(""); // รีเซ็ตรุ่นเมื่อเปลี่ยนยี่ห้อ
  };

  const isAppleSelected = selectedBrand === "Apple";
  const availableModels = selectedBrand
    ? MOCK_DATA.models[selectedBrand] || []
    : [];
  const availableStorage = selectedModel
    ? MOCK_DATA.storage[selectedModel] || []
    : [];

  return (
    <div className="-mt-16 h-max p-2 md:mt-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-2xl backdrop-blur-md">
        <h3 className="text-secondary mb-6 text-center text-xl font-bold sm:text-2xl">
          ประเมินราคาโทรศัพท์ที่ต้องการขาย
        </h3>
        <form className="space-y-5">
          {/* Brand Selector */}
          <Select onValueChange={handleBrandChange} value={selectedBrand}>
            <SelectTrigger className="h-14 w-full text-base">
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
          {/* Model Selector */}
          <Select
            onValueChange={setSelectedModel}
            value={selectedModel}
            disabled={!selectedBrand}
          >
            <SelectTrigger className="h-14 w-full text-base">
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
          {/* Storage Selector */}
          <Select disabled={!selectedModel}>
            <SelectTrigger className="h-14 w-full text-base">
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
          {/* Conditionally rendered iCloud Checkbox */}
          {isAppleSelected && (
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="icloud-unlock" />
              <label
                htmlFor="icloud-unlock"
                className="text-base leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                สามารถปลดล็อค iCloud ได้
              </label>
            </div>
          )}
          <Button
            size="lg"
            onClick={() => router.replace("/assess")}
            className="text-primary-foreground h-14 w-full transform-gpu rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-lg font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/30 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            ประเมินราคา
          </Button>
        </form>
      </div>
    </div>
  );
};

export default HeroAssessmentForm;
