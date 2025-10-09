// SECTION: src/app/assess/components/(step1)/BrandSelector.tsx
"use client";

import { Accordion } from "@/components/ui/accordion";
import { PHONE_DATA } from "@/util/phone";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BrandSelectorProps {
  selectedBrand: string;
  onBrandChange: (brandId: string) => void;
  accordionValue: string;
  onAccordionChange: (value: string) => void;
}

export default function BrandSelector({
  selectedBrand,
  onBrandChange,
  accordionValue,
  onAccordionChange,
}: BrandSelectorProps) {
  return (
    <Accordion type="single" collapsible className="w-full" value={accordionValue} onValueChange={onAccordionChange}>
      <span className="text-foreground">{selectedBrand ? `แบรนด์ที่เลือก: ${selectedBrand}` : "เลือกแบรนด์"}</span>
      <div className="grid grid-cols-3 gap-2 pt-4 sm:grid-cols-4">
        {PHONE_DATA.brands.map((brand) => {
          const isSelected = selectedBrand === brand.id;
          const brandColor = brand.color || "#000000";

          return (
            <motion.button
              key={brand.id}
              onClick={() => onBrandChange(brand.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              // This sets the brand color so Tailwind can use it for the background.

              className={cn(
                "flex aspect-square h-32 w-full flex-col items-center justify-center rounded-sm border p-9 transition-all duration-300",
                isSelected
                  ? // BG IS THE BRAND COLOR. BORDER IS TRANSPARENT.
                    `border-transparent ${brandColor} shadow-xl`
                  : // Unselected state is a white card with a border.
                    "",
              )}
            >
              <div className="flex h-full w-full items-center justify-center">
                {(brand.logo || brand.import) && (
                  <img
                    src={brand.logo || brand.import}
                    alt={`${brand.name} logo`}
                    width="48"
                    height="48"
                    className={cn(
                      "h-full w-full object-contain transition-all duration-300",
                      // LOGO IS WHITE WHEN SELECTED.
                      isSelected ? "brightness-0 invert" : "grayscale",
                    )}
                  />
                )}
                {brand.icon && (
                  <brand.icon
                    className={cn(
                      "h-12 w-12 transition-all duration-300",
                      // Icon is white when selected.
                      isSelected ? "text-white" : "text-gray-400",
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
