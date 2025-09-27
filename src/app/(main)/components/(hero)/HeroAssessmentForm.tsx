"use client";
import { useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Square,
  CheckSquare,
  Search,
  FileCheck2,
  ClipboardList,
  Wallet,
  MoveRight,
  LockKeyhole,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const MOCK_DATA = {
  brands: ["Apple", "Samsung", "Google"],
  models: {
    Apple: ["iPhone 15 Pro Max"],
    Samsung: [],
    Google: [],
  },
  storage: { "iPhone 15 Pro Max": ["256GB", "512GB"] },
};

const processSteps = [
  {
    icon: Search,
    text: "ประเมิน",
  },
  {
    icon: FileCheck2,
    text: "ตรวจสอบราคา",
  },
  {
    icon: ClipboardList,
    text: "เลือกบริการ",
  },
  {
    icon: Wallet,
    text: "รับเงินทันที",
  },
];

const HeroAssessmentForm = () => {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] =
    useState<string>("");
  const [selectedModel, setSelectedModel] =
    useState<string>("");
  const [termsAccepted, setTermsAccepted] =
    useState<boolean>(false);
  const [canUnlockIcloud, setCanUnlockIcloud] =
    useState<boolean>(false);

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel("");
  };

  const availableModels = selectedBrand
    ? MOCK_DATA.models[selectedBrand] || []
    : [];
  const availableStorage = selectedModel
    ? MOCK_DATA.storage[selectedModel] || []
    : [];

  return (
    <div className="flex h-max w-full flex-col md:w-[42%] lg:w-[50%] xl:w-[48%]">
      {/* Form Wrapper */}
      <div className="rounded-2xl bg-white p-4 shadow-lg md:p-5 lg:p-6">
        {/* ... โค้ดส่วนฟอร์มเหมือนเดิม ... */}
        <form
          className="flex w-full flex-col gap-2.5 md:gap-3 lg:gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <h3 className="text-secondary text-center text-base font-bold md:text-lg lg:text-xl">
            ประเมินราคาโทรศัพท์ที่ต้องการขาย
          </h3>

          <Select
            onValueChange={handleBrandChange}
            value={selectedBrand}
          >
            <SelectTrigger className="h-10 w-full text-sm md:h-11 md:text-sm lg:h-12 lg:text-base">
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
            <SelectTrigger className="h-10 w-full text-sm md:h-11 md:text-sm lg:h-12 lg:text-base">
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
            <SelectTrigger className="h-10 w-full text-sm md:h-11 md:text-sm lg:h-12 lg:text-base">
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

          <AnimatePresence>
            {selectedBrand === "Apple" && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  y: 0,
                }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
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
                    onClick={() =>
                      setCanUnlockIcloud(!canUnlockIcloud)
                    }
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
                      transition={{
                        type: "spring",
                        stiffness: 700,
                        damping: 30,
                      }}
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
            onClick={() => router.replace("/assess")}
            disabled={!selectedModel}
            className="text-primary-foreground mt-1 h-10 w-full rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-sm font-semibold shadow-lg transition-transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 md:h-11 md:text-base lg:h-12 lg:text-lg"
          >
            ประเมินราคา
          </Button>

          <div
            className="flex cursor-pointer items-start space-x-2 pt-1"
            onClick={() => setTermsAccepted(!termsAccepted)}
          >
            {termsAccepted ? (
              <CheckSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-pink-600 md:h-4 md:w-4 lg:h-5 lg:w-5" />
            ) : (
              <Square className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 md:h-4 md:w-4 lg:h-5 lg:w-5" />
            )}
            <label className="cursor-pointer text-xs leading-normal font-medium text-gray-700 select-none md:text-xs lg:text-sm">
              ฉันได้อ่านและยอมรับ{" "}
              <a
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-pink-600 underline"
              >
                ข้อตกลงและเงื่อนไข
              </a>{" "}
              การใช้บริการ
            </label>
          </div>
        </form>
      </div>

      {/* Process Steps Section */}
      <div className="mt-5 rounded-2xl bg-white p-4 shadow-lg md:mt-6 md:hidden lg:mt-8 lg:block">
        <div className="mb-4 text-center">
          <h4 className="text-sm font-bold text-gray-800 lg:text-base">
            ขั้นตอนการใช้บริการ
          </h4>
          <div className="mx-auto mt-1.5 h-0.5 w-16 rounded-full bg-gradient-to-r from-orange-400 to-pink-500" />
        </div>

        {/* Steps Grid */}
        <div className="flex items-center justify-between md:scale-85 lg:scale-100">
          {processSteps.map((step, index) => (
            <Fragment key={index}>
              <div className="group flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 transition-all duration-300 group-hover:bg-gray-200 md:h-14 md:w-14">
                  <step.icon className="h-6 w-6 text-pink-600 md:h-7 md:w-7" />
                </div>

                <p className="w-20 text-center text-xs font-semibold text-gray-700">
                  {step.text}
                </p>
              </div>

              {index < processSteps.length - 1 && (
                <div className="flex-shrink-0 self-start pt-4">
                  <MoveRight
                    className="h-4 w-4 text-gray-300 md:h-5 md:w-5"
                    strokeWidth={2.5}
                  />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroAssessmentForm;
