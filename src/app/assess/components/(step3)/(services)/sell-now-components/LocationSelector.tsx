// src/app/assess/components/(step3)/(services)/sell-now-components/LocationSelector.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Home, Train, Store } from "lucide-react";
import { motion } from "framer-motion";

type LocationType = "home" | "bts" | "store";

interface LocationSelectorProps {
  locationType: LocationType | null;
  handleLocationTypeChange: (type: LocationType) => void;
  formVariants: any;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  locationType,
  handleLocationTypeChange,
  formVariants,
}) => {
  return (
    <motion.div variants={formVariants} className="flex flex-col gap-4">
      <Label className="block text-lg font-semibold">เลือกสถานที่รับซื้อ</Label>
      <div className="grid grid-cols-3 gap-3">
        <Button
          type="button"
          variant={locationType === "home" ? "default" : "outline"}
          onClick={() => handleLocationTypeChange("home")}
          className="flex h-auto flex-col items-center gap-2 py-4"
        >
          <Home className="h-6 w-6" /> <span className="text-xs">รับซื้อถึงบ้าน</span>
        </Button>
        <Button
          type="button"
          variant={locationType === "bts" ? "default" : "outline"}
          onClick={() => handleLocationTypeChange("bts")}
          className="flex h-auto flex-col items-center gap-2 py-4"
        >
          <Train className="h-6 w-6" /> <span className="text-xs">BTS/MRT</span>
        </Button>
        <Button
          type="button"
          variant={locationType === "store" ? "default" : "outline"}
          onClick={() => handleLocationTypeChange("store")}
          className="flex h-auto flex-col items-center gap-2 py-4"
        >
          <Store className="h-6 w-6" /> <span className="text-xs">รับซื้อที่ร้าน</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default LocationSelector;
