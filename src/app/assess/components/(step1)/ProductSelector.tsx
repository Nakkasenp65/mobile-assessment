// src/app/assess/components/(step1)/ProductSelector.tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PHONE_DATA } from "@/util/phone";
import { BsEarbuds } from "react-icons/bs";

interface ProductSelectorProps {
  selectedProduct: string;
  onProductChange: (productId: string) => void;
}

const ProductSelector = ({ selectedProduct, onProductChange }: ProductSelectorProps) => {
  const appleProducts = PHONE_DATA.products["Apple"] || [];

  return (
    <section className="w-full">
      {/* Horizontal scrolling container */}
      <div className="flex flex-wrap justify-between gap-2 gap-x-4 gap-y-4 py-2">
        {appleProducts.map((product) => {
          const Icon = product.icon;
          const isSelected = selectedProduct === product.id;

          return (
            <motion.button
              key={product.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onProductChange(product.id)}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={cn(
                "relative flex h-32 min-w-36 flex-1 flex-shrink-0 flex-col items-center justify-center rounded-2xl border transition-all duration-200",
                "sm:min-w-56",
                "md:min-w-56",
                isSelected ? "border-primary shadow-primary/10 shadow-lg" : "border-border hover:border-gray-300",
              )}
            >
              {/* Icon Container */}
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-200",
                  isSelected ? "bg-primary" : "bg-gray-200/80",
                )}
              >
                <Icon
                  className={cn(
                    "h-8 w-8 transition-colors duration-200",
                    isSelected ? "text-primary-foreground" : "text-muted-foreground",
                  )}
                  strokeWidth={product.icon === BsEarbuds ? 0.5 : 1.5}
                />
              </div>

              {/* Product Name */}
              <span
                className={cn(
                  "mt-3 text-sm font-semibold transition-colors",
                  isSelected ? "text-primary" : "text-foreground",
                )}
              >
                {product.name}
              </span>

              {/* Selected Indicator Pill (subtle and clean) */}
              {isSelected && (
                <motion.div
                  className="bg-primary absolute bottom-2 h-1 w-6 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

export default ProductSelector;
