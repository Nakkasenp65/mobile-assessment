// src/app/assess/components/(step3)/(services)/sell-now-components/LocationSelector.tsx
"use client";

import { Label } from "@/components/ui/label";
import { Home, Train, Store } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type LocationType = "home" | "bts" | "store";

interface LocationSelectorProps {
  locationType: LocationType | null;
  handleLocationTypeChange: (type: LocationType) => void;
  formVariants: Variants;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  locationType,
  handleLocationTypeChange,
  formVariants,
}) => {
  return (
    <motion.div variants={formVariants} className="flex flex-col gap-4">
      <Label className="block text-lg font-semibold">เลือกสถานที่รับซื้อ</Label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {/* Home option */}
        <motion.button
          type="button"
          onClick={() => handleLocationTypeChange("home")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          aria-pressed={locationType === "home"}
          className={cn(
            "flex h-24 flex-col items-center justify-center gap-2 rounded-xl border p-2 text-center text-sm font-medium",
            locationType === "home"
              ? "bg-primary text-primary-foreground shadow-primary/30 border-transparent shadow-lg"
              : "bg-card text-card-foreground hover:bg-accent hover:border-primary/50",
          )}
        >
          <Home className="h-6 w-6" />
          <span className="font-semibold">รับซื้อถึงบ้าน</span>
        </motion.button>

        {/* BTS/MRT option */}
        <motion.button
          type="button"
          onClick={() => handleLocationTypeChange("bts")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          aria-pressed={locationType === "bts"}
          className={cn(
            "flex h-24 flex-col items-center justify-center gap-2 rounded-xl border p-2 text-center text-sm font-medium",
            locationType === "bts"
              ? "bg-primary text-primary-foreground shadow-primary/30 border-transparent shadow-lg"
              : "bg-card text-card-foreground hover:bg-accent hover:border-primary/50",
          )}
        >
          <Train className="h-6 w-6" />
          <span className="font-semibold">BTS/MRT</span>
        </motion.button>

        {/* Store option */}
        <motion.button
          type="button"
          onClick={() => handleLocationTypeChange("store")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          aria-pressed={locationType === "store"}
          className={cn(
            "flex h-24 flex-col items-center justify-center gap-2 rounded-xl border p-2 text-center text-sm font-medium",
            locationType === "store"
              ? "bg-primary text-primary-foreground shadow-primary/30 border-transparent shadow-lg"
              : "bg-card text-card-foreground hover:bg-accent hover:border-primary/50",
          )}
        >
          <Store className="h-6 w-6" />
          <span className="font-semibold">รับซื้อที่ร้าน</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default LocationSelector;
