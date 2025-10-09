// SECTION: src/app/assess/components/(step1)/ProductSelector.tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PHONE_DATA } from "@/util/phone";
import { BsEarbuds } from "react-icons/bs";
import { useState } from "react";
import { IconType } from "react-icons";
import { LucideIcon } from "lucide-react";

// --- Sub-component for individual buttons to manage their own tap state ---
const ProductButton = ({
  product,
  isSelected,
  onClick,
}: {
  product: { id: string; name: string; icon: LucideIcon | IconType };
  isSelected: boolean;
  onClick: () => void;
}) => {
  const [isTapping, setIsTapping] = useState(false);
  const Icon = product.icon;

  // A button should appear "selected" if it IS selected OR if it's currently being tapped.
  const shouldShowSelectedStyle = isSelected || isTapping;

  return (
    <motion.button
      key={product.id}
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      // Add tap event handlers
      onTapStart={() => setIsTapping(true)}
      onPointerUp={() => setIsTapping(false)}
      // Keep the scale animation on tap
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 1000, damping: 30 }}
      className={cn(
        "bg-card relative flex h-32 min-w-36 flex-1 flex-shrink-0 flex-col items-center justify-center rounded-2xl border",
        "sm:min-w-40",
        // Use the combined state for styling
        shouldShowSelectedStyle
          ? "border-primary shadow-primary/10 ring-primary shadow-lg ring-2"
          : "border-border hover:shadow-primary/5 duration-300 ease-in-out hover:border-gray-300 hover:shadow-lg",
      )}
    >
      {/* Icon Container */}
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-200",
          // Use the combined state for styling
          shouldShowSelectedStyle ? "bg-primary" : "bg-gray-100 dark:bg-gray-800",
        )}
      >
        <Icon
          className={cn(
            "h-8 w-8 transition-colors duration-200",
            // Use the combined state for styling
            shouldShowSelectedStyle ? "text-primary-foreground" : "text-muted-foreground",
          )}
          strokeWidth={product.icon === BsEarbuds ? 0.5 : 1.5}
        />
      </div>

      {/* Product Name */}
      <span
        className={cn(
          "mt-3 text-sm font-semibold transition-colors",
          // Use the combined state for styling
          shouldShowSelectedStyle ? "text-primary" : "text-foreground",
        )}
      >
        {product.name}
      </span>

      {/* Selected Indicator Pill */}
      {isSelected && (
        <motion.div
          layoutId="productSelectorPill"
          className="bg-primary absolute bottom-2 h-1 w-6 rounded-full"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

// --- Main Component ---
interface ProductSelectorProps {
  selectedProduct: string;
  onProductChange: (productId: string) => void;
}

const ProductSelector = ({ selectedProduct, onProductChange }: ProductSelectorProps) => {
  const appleProducts = PHONE_DATA.products["Apple"] || [];

  return (
    <section className="w-full">
      <div className="flex flex-wrap justify-center gap-4 py-2 sm:justify-start">
        {appleProducts.map((product) => (
          <ProductButton
            key={product.id}
            product={product}
            isSelected={selectedProduct === product.id}
            onClick={() => {
              setTimeout(() => {
                onProductChange(product.id);
              }, 150);
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductSelector;
