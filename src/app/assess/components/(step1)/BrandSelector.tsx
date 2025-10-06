// src/app/assess/components/(step1)/BrandSelector.tsx
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PHONE_DATA } from "@/util/phone";
import { cn } from "@/lib/utils";

interface BrandSelectorProps {
  selectedBrand: string;
  onBrandChange: (brandId: string) => void;
  accordionValue: string;
  onAccordionChange: (value: string) => void;
}

const BrandSelector = ({ selectedBrand, onBrandChange, accordionValue, onAccordionChange }: BrandSelectorProps) => (
  <Accordion type="single" collapsible className="w-full" value={accordionValue} onValueChange={onAccordionChange}>
    <AccordionItem value="brand-selector" className="border-none">
      <AccordionTrigger className="hover:no-underline">
        <span className="text-foreground font-semibold">
          {selectedBrand ? `แบรนด์ที่เลือก: ${selectedBrand}` : "เลือกแบรนด์"}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-3 gap-3 pt-4 sm:grid-cols-4">
          {PHONE_DATA.brands.map((brand) => {
            const isSelected = selectedBrand === brand.id;
            return (
              <button
                key={brand.id}
                onClick={() => onBrandChange(brand.id)}
                className={cn(
                  "flex h-28 flex-col items-center justify-center gap-3 rounded-2xl border p-4 transition-all duration-200",
                  isSelected ? "border-secondary bg-secondary/10" : "hover:border-primary/50",
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center">
                  {(brand.logo || brand.import) && (
                    <img
                      src={brand.logo || brand.import}
                      alt={`${brand.name} logo`}
                      width="32"
                      height="32"
                      className={cn("h-auto max-h-8 w-auto max-w-8 object-contain", !isSelected && "grayscale")}
                    />
                  )}
                  {brand.icon && <brand.icon className={cn("h-8 w-8", !isSelected && "grayscale")} />}
                </div>
                <span className={cn("text-sm font-semibold", isSelected ? "text-secondary" : "text-muted-foreground")}>
                  {brand.name}
                </span>
              </button>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default BrandSelector;
