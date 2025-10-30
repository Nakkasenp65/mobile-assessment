"use client";

import { Accordion } from "@/components/ui/accordion";
import { PHONE_DATA } from "@/util/phone";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";

interface BrandSelectorProps {
  selectedBrand: string;
  onBrandChange: (brandId: string) => void;
  accordionValue: string;
  onAccordionChange: (value: string) => void;
  isOwnDevice?: boolean;
}

export default function BrandSelector({
  selectedBrand,
  onBrandChange,
  accordionValue,
  onAccordionChange,
  isOwnDevice = false,
}: BrandSelectorProps) {
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  const { isAndroid } = useDeviceDetection();
  const renderBrands =
    isOwnDevice && isAndroid
      ? PHONE_DATA.brands.filter((b) => b.id !== "Apple")
      : PHONE_DATA.brands;

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      value={accordionValue}
      onValueChange={onAccordionChange}
    >
      <span className="text-foreground">
        {selectedBrand ? `แบรนด์ที่เลือก: ${selectedBrand}` : "เลือกแบรนด์"}
      </span>
      <div className="grid grid-cols-3 gap-2 pt-4 sm:grid-cols-4">
        {renderBrands.map((brand) => {
          const isSelected = selectedBrand === brand.id;
          const isHovered = hoveredBrand === brand.id;
          const brandColor = brand.color || "#000000";

          return (
            <motion.button
              key={brand.id}
              onClick={() => onBrandChange(brand.id)}
              onMouseEnter={() => setHoveredBrand(brand.id)}
              onMouseLeave={() => setHoveredBrand(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              style={{
                backgroundColor: isSelected || isHovered ? brandColor : "transparent",
              }}
              className={cn(
                "flex aspect-square h-32 w-full flex-col items-center justify-center rounded-sm border",
                isSelected || isHovered
                  ? "border-transparent shadow-xl"
                  : "border-gray-200 hover:border-transparent hover:shadow-xl",
                brand.name === "Apple" || brand.name === "Xiaomi" ? "p-10" : "p-7",
              )}
            >
              <div className="flex aspect-square h-full w-auto items-center justify-center">
                {(brand.logo || brand.import) && (
                  <img
                    src={brand.logo || brand.import}
                    alt={`${brand.name} logo`}
                    width="48"
                    height="48"
                    className={cn(
                      "h-full w-full object-contain transition-all duration-300",
                      isSelected || isHovered ? "brightness-0 invert" : "grayscale",
                    )}
                  />
                )}
                {brand.icon && (
                  <brand.icon
                    className={cn(
                      "h-12 w-12 transition-all duration-300",
                      isSelected || isHovered ? "text-white" : "text-gray-400",
                    )}
                  />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </Accordion>
  );
}
