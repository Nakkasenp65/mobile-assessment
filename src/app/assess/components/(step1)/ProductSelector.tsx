// src/app/assess/components/(step1)/ProductSelector.tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PHONE_DATA } from "@/util/phone";
import { LucideIcon } from "lucide-react";

interface ProductSelectorProps {
  selectedProduct: string;
  onProductChange: (productId: string) => void;
}

const ProductSelector = ({ selectedProduct, onProductChange }: ProductSelectorProps) => {
  const appleProducts = PHONE_DATA.products["Apple"] || [];

  return (
    <section className="w-full">
      <h3 className="text-foreground mb-6 text-center text-[1.08rem] font-bold tracking-tight">เลือกประเภทผลิตภัณฑ์</h3>

      <div className="grid grid-cols-2 place-items-center gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-5">
        {appleProducts.map((product) => {
          const Icon = product.icon as LucideIcon;
          const isSelected = selectedProduct === product.id;

          return (
            <motion.button
              key={product.id}
              type="button"
              aria-pressed={isSelected}
              tabIndex={0}
              onClick={() => onProductChange(product.id)}
              className={cn(
                "to-accent relative mx-auto flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border bg-gradient-to-b from-white/90 px-3 pt-5 pb-4 transition-all duration-200 outline-none",
                isSelected
                  ? "ring-primary from-primary/10 bg-gradient-to-b to-white shadow-lg ring-2"
                  : "hover:ring-primary/60 hover:shadow-xl hover:ring-1",
              )}
              whileTap={{ scale: 0.97 }}
              style={{
                fontFamily: "LINESeedSansTH, SF Pro Text, Arial, sans-serif",
                minWidth: 0,
                transitionProperty: "box-shadow, background, ring",
              }}
            >
              <span
                className={cn(
                  "bg-muted mb-2 flex items-center justify-center rounded-full transition-colors duration-200",
                  isSelected ? "bg-primary/10" : "group-hover:bg-accent",
                )}
                style={{ padding: 13 }}
              >
                <Icon
                  className={cn(
                    "h-9 w-9 transition-colors duration-200",
                    isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
              </span>
              <span
                className={cn(
                  "text-[1.07rem] font-medium transition-colors",
                  isSelected ? "text-primary" : "text-foreground",
                )}
                style={{
                  fontFamily: "LINESeedSansTH, SF Pro Text, Arial, sans-serif",
                }}
              >
                {product.name}
              </span>
              {isSelected && (
                <motion.div
                  className="bg-primary absolute bottom-3 left-1/2 h-[4px] w-9 -translate-x-1/2 rounded"
                  initial={{ opacity: 0, scaleX: 0.65 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0.65 }}
                  transition={{ type: "spring", stiffness: 310, damping: 26 }}
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
